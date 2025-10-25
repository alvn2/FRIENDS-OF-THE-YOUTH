import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from './database.js';
import { generateToken } from './services.js';

// This function will be called by app.js and passed the passport object
const passportConfig = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'], // We need to request email and profile
      },
      async (accessToken, refreshToken, profile, done) => {
        // This is the "verify" callback that runs after Google authenticates
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in Google profile'), null);
          }

          // 1. Find existing user
          let user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
          });

          if (user) {
            // 2. User exists. Update their auth provider info if needed.
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                authProvider: 'GOOGLE',
                providerId: profile.id,
              },
            });
          } else {
            // 3. User does not exist. Create a new user.
            // We can't ask for a password, so we generate a random one
            // or leave it null (depending on schema, here we leave it null)
            // Our schema doesn't allow null password, so we must register them
            // with a temporary "please update" password.
            // A better approach: just save the user without a password.
            // Our schema has `password` as optional (`String?`)
            
            user = await prisma.user.create({
              data: {
                email: email.toLowerCase(),
                name: profile.displayName,
                // phone and bio will be null, user can update later
                authProvider: 'GOOGLE',
                providerId: profile.id,
                // We set password to null as they don't use local login
                password: null, 
              },
            });

            // Award the "New Member" badge
            try {
              const badge = await prisma.badge.findUnique({
                where: { name: 'New Member' },
              });
              if (badge) {
                await prisma.userBadge.create({
                  data: {
                    userId: user.id,
                    badgeId: badge.id,
                  },
                });
              }
            } catch (badgeError) {
              console.error('Failed to award "New Member" badge to Google user:', badgeError.message);
            }
          }

          // 4. Generate a token for this user
          const token = generateToken(user.id, user.role);
          
          // 5. Pass the user and token to the callback
          // We pass an object to be attached to req.user in the googleCallback controller
          return done(null, { user, token });

        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Passport doesn't need to serialize/deserialize user for JWT-based auth
  // But we leave the functions here as stubs in case we add sessions later.
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default passportConfig;

