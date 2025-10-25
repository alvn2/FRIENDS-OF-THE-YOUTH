import jwt from 'jsonwebtoken';
import { prisma } from './database.js'; 
import { asyncHandler } from './utils.js'; 

/**
 * Protect routes by verifying JWT.
 * Attaches user object to req.user if valid token.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // --- FIX: Read token from 'Authorization: Bearer' header ---
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (split 'Bearer TOKEN' string)
      token = req.headers.authorization.split(' ')[1];
      // -----------------------------------------------------

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (excluding password)
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true, name: true, email: true, role: true, 
          phone: true, bio: true, createdAt: true, updatedAt: true, 
          newsletter: true,
          // Include relations needed for DashboardPage/profile consistency
          badges: { include: { badge: true }},
          donations: { orderBy: { createdAt: 'desc'}, take: 5 }, // Match profile fetch
          rsvps: { include: { event: true }} // Match profile fetch
        },
      });

      if (!req.user) {
         res.status(401);
         throw new Error('Not authorized, user not found');
      }

      next(); // Proceed
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});


// --- admin middleware remains the same ---
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next(); 
  } else {
    res.status(403); 
    throw new Error('Not authorized as an admin');
  }
};

// --- optionalAuth middleware needs same fix ---
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  // Check for standard Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, role: true }, // Keep it minimal for optional
      });
      if (!req.user) {
         console.warn(`OptionalAuth: Valid token structure but user ${decoded.id} not found.`);
         req.user = undefined;
      }
    } catch (error) {
       console.warn(`OptionalAuth: Token verification failed (${error.message}). Proceeding as anonymous.`);
      req.user = undefined;
    }
  } else {
    req.user = undefined;
  }

  next(); // Always proceed
});


export { protect, admin, optionalAuth };

