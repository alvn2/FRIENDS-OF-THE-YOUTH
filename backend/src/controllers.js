import { prisma } from './database.js';
import bcrypt from 'bcryptjs';
import { generateToken, generatePDFCertificate } from './services.js';
import {
  initiateSTKPush,
  handleMpesaCallback,
  syncToGoogleSheet,
  sendEmail,
} from './services.js';
import { asyncHandler } from './utils.js'; // <-- FIX: Import from new utils file

// --- Auth Controllers ---

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error('Please provide all required fields: name, email, password, and phone.');
  }

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
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
    console.error('Failed to award "New Member" badge:', badgeError.message);
    // Non-fatal error, registration can proceed
  }

  if (user) {
    const token = generateToken(user.id, user.role);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user.id, user.role);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/**
 * @desc    Handle Google OAuth callback
 * @route   GET /api/v1/auth/google/callback
 * @access  Public
 */
const googleCallback = (req, res) => {
  // Passport.js middleware has run, user is attached to req.user
  // req.user contains { user, token } from our custom callback logic
  const { token } = req.user;

  // Redirect user to the frontend with the token
  // The frontend will save this token from the URL query params
  res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`);
};

// --- User Controllers ---

/**
 * @desc    Get user profile
 * @route   GET /api/v1/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is attached by the 'protect' middleware
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      badges: {
        include: {
          badge: true, // Include the details of the badge itself
        },
      },
      donations: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 5, // Get recent 5 donations
      },
      rsvps: {
        include: {
          event: true,
        },
      },
    },
  });

  if (user) {
    // Exclude password from the response
    const { password, ...userProfile } = user;
    res.json({
      message: 'Profile fetched successfully',
      data: userProfile,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, phone, bio } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      name: name || undefined,
      phone: phone || undefined,
      bio: bio || undefined,
    },
  });

  const { password, ...updatedUser } = user;
  res.json({
    message: 'Profile updated successfully',
    data: updatedUser,
  });
});

/**
 * @desc    Generate and download PDF membership certificate
 * @route   GET /api/v1/users/certificate
 * @access  Private
 */
const getCertificate = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const pdfBuffer = await generatePDFCertificate(user);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=FOTY_Certificate_${user.id}.pdf`
  );
  res.send(pdfBuffer);
});

/**
 * @desc    Subscribe to newsletter
 * @route   POST /api/v1/users/subscribe
 * @access  Private
 */
const subscribeToNewsletter = asyncHandler(async (req, res) => {
  const { newsletterType } = req.body; // 'DAILY' or 'WEEKLY'
  if (!['DAILY', 'WEEKLY'].includes(newsletterType)) {
    res.status(400);
    throw new Error('Invalid newsletter type. Must be DAILY or WEEKLY.');
  }

  await prisma.user.update({
    where: { id: req.user.id },
    data: {
      newsletter: newsletterType,
    },
  });

  res.json({
    message: `Successfully subscribed to ${newsletterType} newsletter.`,
  });
});

/**
 * @desc    Unsubscribe from newsletter
 * @route   POST /api/v1/users/unsubscribe
 * @access  Private
 */
const unsubscribeFromNewsletter = asyncHandler(async (req, res) => {
  await prisma.user.update({
    where: { id: req.user.id },
    data: {
      newsletter: null,
    },
  });

  res.json({ message: 'Successfully unsubscribed from the newsletter.' });
});

// --- Donation Controllers ---

/**
 * @desc    Initiate M-Pesa STK Push
 * @route   POST /api/v1/donations/stk-push
 * @access  Public
 */
const initiateDonation = asyncHandler(async (req, res) => {
  const { amount, phone } = req.body;
  const { id: userId } = req.user || {}; // User may or may not be logged in

  if (!amount || !phone) {
    res.status(400);
    throw new Error('Amount and phone number are required');
  }

  // Validate phone number (simple regex for Safaricom)
  const phoneRegex = /^(2547|07)\d{8}$/;
  if (!phoneRegex.test(phone)) {
    res.status(400);
    throw new Error('Invalid phone number format. Use 2547... or 07...');
  }

  // Format phone to 254...
  const formattedPhone = phone.startsWith('07')
    ? `254${phone.substring(1)}`
    : phone;

  const result = await initiateSTKPush(amount, formattedPhone, userId);

  // STK Push initiated successfully, but payment is not yet complete
  res.json({
    message: 'STK Push initiated. Please check your phone to complete the payment.',
    data: result, // This contains CheckoutRequestID, etc.
  });
});

/**
 * @desc    M-Pesa Callback
 * @route   POST /api/v1/donations/callback
 * @access  Public (from M-Pesa)
 */
const donationCallback = asyncHandler(async (req, res) => {
  console.log('--- M-Pesa Callback Received ---');
  console.log(JSON.stringify(req.body, null, 2));

  const callbackData = req.body;

  // Handle the callback data (update database, etc.)
  await handleMpesaCallback(callbackData);

  // Respond to M-Pesa to acknowledge receipt
  res.json({ ResultCode: 0, ResultDesc: 'Callback received successfully' });
});

/**
 * @desc    Get logged-in user's donations
 * @route   GET /api/v1/donations
 * @access  Private
 */
const getUserDonations = asyncHandler(async (req, res) => {
  const donations = await prisma.donation.findMany({
    where: {
      userId: req.user.id,
      status: 'COMPLETED', // Only show successful donations
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json({
    message: 'Donations fetched successfully',
    count: donations.length,
    data: donations,
  });
});

// --- Bulletin Post Controllers ---

/**
 * @desc    Get all bulletin posts (paginated)
 * @route   GET /api/v1/posts
 * @access  Public
 */
const getPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await prisma.bulletinPost.findMany({
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const totalPosts = await prisma.bulletinPost.count();

  res.json({
    message: 'Posts fetched successfully',
    data: posts,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    },
  });
});

/**
 * @desc    Get a single post by ID
 * @route   GET /api/v1/posts/:id
 * @access  Public
 */
const getPostById = asyncHandler(async (req, res) => {
  const post = await prisma.bulletinPost.findUnique({
    where: { id: req.params.id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  res.json({
    message: 'Post fetched successfully',
    data: post,
  });
});

/**
 * @desc    Create a new post
 * @route   POST /api/v1/posts
 * @access  Private
 */
const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }

  const post = await prisma.bulletinPost.create({
    data: {
      title,
      content,
      authorId: req.user.id,
    },
  });

  res.status(201).json({
    message: 'Post created successfully',
    data: post,
  });
});

/**
 * @desc    Update a post
 * @route   PUT /api/v1/posts/:id
 * @access  Private
 */
const updatePost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const post = await prisma.bulletinPost.findUnique({
    where: { id: req.params.id },
  });

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Check if user is the author
  if (post.authorId !== req.user.id) {
    res.status(403);
    throw new Error('User not authorized to update this post');
  }

  const updatedPost = await prisma.bulletinPost.update({
    where: { id: req.params.id },
    data: {
      title: title || undefined,
      content: content || undefined,
    },
  });

  res.json({
    message: 'Post updated successfully',
    data: updatedPost,
  });
});

/**
 * @desc    Delete a post
 * @route   DELETE /api/v1/posts/:id
 * @access  Private
 */
const deletePost = asyncHandler(async (req, res) => {
  const post = await prisma.bulletinPost.findUnique({
    where: { id: req.params.id },
  });

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Check if user is the author or an admin
  if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
    res.status(403);
    throw new Error('User not authorized to delete this post');
  }

  await prisma.bulletinPost.delete({
    where: { id: req.params.id },
  });

  res.json({ message: 'Post deleted successfully' });
});

// --- Event Controllers ---

/**
 * @desc    Get all events
 * @route   GET /api/v1/events
 * @access  Public
 */
const getEvents = asyncHandler(async (req, res) => {
  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: new Date(), // Only get upcoming events
      },
    },
    orderBy: {
      date: 'asc',
    },
    include: {
      rsvps: {
        select: {
          userId: true,
        },
      },
    },
  });

  // Map to include rsvpCount and if user has rsvp'd
  const eventsData = events.map((event) => {
    const rsvpCount = event.rsvps.length;
    // Check if req.user (from optional auth) exists and is in the rsvp list
    const userHasRsvpd =
      req.user && event.rsvps.some((rsvp) => rsvp.userId === req.user.id);
    const { rsvps, ...eventData } = event; // Exclude the full rsvp list
    return {
      ...eventData,
      rsvpCount,
      userHasRsvpd,
    };
  });

  res.json({
    message: 'Events fetched successfully',
    count: eventsData.length,
    data: eventsData,
  });
});

/**
 * @desc    Get a single event by ID
 * @route   GET /api/v1/events/:id
 * @access  Public
 */
const getEventById = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
    include: {
      rsvps: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const rsvpCount = event.rsvps.length;
  const userHasRsvpd =
    req.user && event.rsvps.some((rsvp) => rsvp.userId === req.user.id);
  const { rsvps, ...eventData } = event;

  res.json({
    message: 'Event fetched successfully',
    data: {
      ...eventData,
      rsvpCount,
      userHasRsvpd,
    },
  });
});

/**
 * @desc    RSVP for an event
 * @route   POST /api/v1/events/:id/rsvp
 * @access  Private
 */
const rsvpForEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if capacity is reached
  const rsvpCount = await prisma.eventRSVP.count({ where: { eventId } });
  if (event.capacity && rsvpCount >= event.capacity) {
    res.status(400);
    throw new Error('Event is already full');
  }

  // Check if already rsvp'd
  const existingRsvp = await prisma.eventRSVP.findUnique({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
  });

  if (existingRsvp) {
    res.status(400);
    throw new Error('User has already RSVPd for this event');
  }

  await prisma.eventRSVP.create({
    data: {
      userId,
      eventId,
    },
  });

  res.status(201).json({ message: 'RSVP successful' });
});

/**
 * @desc    Cancel RSVP for an event
 * @route   DELETE /api/v1/events/:id/rsvp
 * @access  Private
 */
const cancelRsvp = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  const existingRsvp = await prisma.eventRSVP.findUnique({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
  });

  if (!existingRsvp) {
    res.status(404);
    throw new Error('RSVP not found');
  }

  await prisma.eventRSVP.delete({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
  });

  res.json({ message: 'RSVP cancelled successfully' });
});

// --- Badge Controllers ---

/**
 * @desc    Get all available badges
 * @route   GET /api/v1/badges
 * @access  Public
 */
const getBadges = asyncHandler(async (req, res) => {
  const badges = await prisma.badge.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  res.json({
    message: 'Badges fetched successfully',
    count: badges.length,
    data: badges,
  });
});

// --- Admin Controllers ---

/**
 * @desc    (Admin) Get all users
 * @route   GET /api/v1/admin/users
 * @access  Admin
 */
const adminGetUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      // Select only non-sensitive fields
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      newsletter: true,
    },
  });

  res.json({
    message: 'Users fetched successfully',
    count: users.length,
    data: users,
  });
});

/**
 * @desc    (Admin) Get all donations
 * @route   GET /api/v1/admin/donations
 * @access  Admin
 */
const adminGetDonations = asyncHandler(async (req, res) => {
  const donations = await prisma.donation.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  res.json({
    message: 'Donations fetched successfully',
    count: donations.length,
    data: donations,
  });
});

/**
 * @desc    (Admin) Create a new event
 * @route   POST /api/v1/admin/events
 * @access  Admin
 */
const adminCreateEvent = asyncHandler(async (req, res) => {
  const { name, description, date, location, capacity, imageUrl } = req.body;
  if (!name || !description || !date || !location) {
    res.status(400);
    throw new Error('Name, description, date, and location are required');
  }

  const event = await prisma.event.create({
    data: {
      name,
      description,
      date: new Date(date),
      location,
      capacity: capacity ? parseInt(capacity) : null,
      imageUrl: imageUrl || null,
    },
  });

  res.status(201).json({
    message: 'Event created successfully',
    data: event,
  });
});

/**
 * @desc    (Admin) Update an event
 * @route   PUT /api/v1/admin/events/:id
 * @access  Admin
 */
const adminUpdateEvent = asyncHandler(async (req, res) => {
  const { name, description, date, location, capacity, imageUrl } = req.body;
  const event = await prisma.event.update({
    where: { id: req.params.id },
    data: {
      name: name || undefined,
      description: description || undefined,
      date: date ? new Date(date) : undefined,
      location: location || undefined,
      capacity: capacity ? parseInt(capacity) : undefined,
      imageUrl: imageUrl || undefined,
    },
  });

  res.json({
    message: 'Event updated successfully',
    data: event,
  });
});

/**
 * @desc    (Admin) Delete an event
 * @route   DELETE /api/v1/admin/events/:id
 * @access  Admin
 */
const adminDeleteEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;

  // Need to delete all RSVPs for this event first due to foreign key constraint
  await prisma.eventRSVP.deleteMany({
    where: { eventId },
  });

  // Now we can delete the event
  await prisma.event.delete({
    where: { id: eventId },
  });

  res.json({ message: 'Event and all associated RSVPs deleted successfully' });
});

/**
 * @desc    (Admin) Create a new badge
 * @route   POST /api/v1/admin/badges
 * @access  Admin
 */
const adminCreateBadge = asyncHandler(async (req, res) => {
  const { name, description, icon } = req.body;
  if (!name || !description || !icon) {
    res.status(400);
    throw new Error('Name, description, and icon are required');
  }

  const badge = await prisma.badge.create({
    data: {
      name,
      description,
      icon,
    },
  });

  res.status(201).json({
    message: 'Badge created successfully',
    data: badge,
  });
});

/**
 * @desc    (Admin) Manually award a badge to a user
 * @route   POST /api/v1/admin/users/:userId/badge
 * @access  Admin
 */
const adminAwardBadge = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { badgeId } = req.body;

  // Check if user and badge exist
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const badge = await prisma.badge.findUnique({ where: { id: badgeId } });

  if (!user || !badge) {
    res.status(404);
    throw new Error('User or Badge not found');
  }

  // Check if user already has this badge
  const existingUserBadge = await prisma.userBadge.findUnique({
    where: {
      userId_badgeId: {
        userId,
        badgeId,
      },
    },
  });

  if (existingUserBadge) {
    res.status(400);
    throw new Error('User already has this badge');
  }

  const userBadge = await prisma.userBadge.create({
    data: {
      userId,
      badgeId,
    },
  });

  res.status(201).json({
    message: `Badge "${badge.name}" awarded to user "${user.name}"`,
    data: userBadge,
  });
});

// --- Google Sheets Sync Controllers ---

/**
 * @desc    (Admin) Sync all users to Google Sheets
 * @route   GET /api/v1/admin/sync/users
 * @access  Admin
 */
const adminSyncUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      newsletter: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  // Define headers
  const headers = [
    'User ID',
    'Name',
    'Email',
    'Phone',
    'Role',
    'Joined At',
    'Newsletter',
  ];

  // Format data
  const data = users.map((user) => [
    user.id,
    user.name,
    user.email,
    user.phone,
    user.role,
    new Date(user.createdAt).toISOString().split('T')[0], // Format as YYYY-MM-DD
    user.newsletter || 'None',
  ]);

  await syncToGoogleSheet('Users', headers, data);
  res.json({ message: 'User data sync to Google Sheets initiated.' });
});

/**
 * @desc    (Admin) Sync all donations to Google Sheets
 * @route   GET /api/v1/admin/sync/donations
 * @access  Admin
 */
const adminSyncDonations = asyncHandler(async (req, res) => {
  const donations = await prisma.donation.findMany({
    where: { status: 'COMPLETED' },
    orderBy: { createdAt: 'asc' },
    include: {
      user: {
        select: { email: true, name: true },
      },
    },
  });

  const headers = [
    'Donation ID',
    'Date',
    'Amount',
    'Phone',
    'User Email',
    'User Name',
    'M-Pesa Receipt',
  ];

  const data = donations.map((d) => [
    d.id,
    new Date(d.createdAt).toISOString(),
    d.amount,
    d.phone,
    d.user?.email || 'Anonymous',
    d.user?.name || 'Anonymous',
    d.mpesaReceipt,
  ]);

  await syncToGoogleSheet('Donations', headers, data);
  res.json({ message: 'Donation data sync to Google Sheets initiated.' });
});

/**
 * @desc    (Admin) Sync all events to Google Sheets
 * @route   GET /api/v1/admin/sync/events
 * @access  Admin
 */
const adminSyncEvents = asyncHandler(async (req, res) => {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    include: {
      _count: {
        select: { rsvps: true },
      },
    },
  });

  const headers = [
    'Event ID',
    'Name',
    'Date',
    'Location',
    'Capacity',
    'RSVP Count',
  ];

  const data = events.map((event) => [
    event.id,
    event.name,
    new Date(event.date).toISOString(),
    event.location,
    event.capacity || 'N/A',
    event._count.rsvps,
  ]);

  await syncToGoogleSheet('Events', headers, data);
  res.json({ message: 'Event data sync to Google Sheets initiated.' });
});

// --- Health Check ---

/**
 * @desc    Health check
 * @route   GET /api/v1/health
 * @access  Public
 */
const healthCheck = (req, res) => {
  res.json({ status: 'UP', message: 'FOTY API is healthy' });
};

export {
  // We no longer export asyncHandler from here
  registerUser,
  loginUser,
  googleCallback,
  getUserProfile,
  updateUserProfile,
  getCertificate,
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  initiateDonation,
  donationCallback,
  getUserDonations,
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getEvents,
  getEventById,
  rsvpForEvent,
  cancelRsvp,
  getBadges,
  adminGetUsers,
  adminGetDonations,
  adminCreateEvent,
  adminUpdateEvent,
  adminDeleteEvent,
  adminCreateBadge,
  adminAwardBadge,
  adminSyncUsers,
  adminSyncDonations,
  adminSyncEvents,
  healthCheck,
};
