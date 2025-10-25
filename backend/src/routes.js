import express from 'express';
import passport from 'passport';
import {
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
} from './controllers.js';
import { protect, admin, optionalAuth } from './middleware.js';

const router = express.Router();

// --- Auth Routes ---
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);

// Google OAuth
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=true`,
    session: false, // We are using JWTs, not sessions
  }),
  googleCallback
);

// --- User Routes ---
router.get('/users/profile', protect, getUserProfile);
router.put('/users/profile', protect, updateUserProfile);
router.get('/users/certificate', protect, getCertificate);
router.post('/users/subscribe', protect, subscribeToNewsletter);
router.post('/users/unsubscribe', protect, unsubscribeFromNewsletter);

// --- Donation Routes ---
// Use 'optionalAuth' so we can link donation to user if they are logged in
router.post('/donations/stk-push', optionalAuth, initiateDonation);
router.post('/donations/callback', donationCallback); // M-Pesa webhook
router.get('/donations', protect, getUserDonations);

// --- Bulletin Post Routes ---
router.get('/posts', getPosts);
router.post('/posts', protect, createPost);
router.get('/posts/:id', getPostById);
router.put('/posts/:id', protect, updatePost);
router.delete('/posts/:id', protect, deletePost);

// --- Event Routes ---
// Use 'optionalAuth' to see if user has RSVPd
router.get('/events', optionalAuth, getEvents);
router.get('/events/:id', optionalAuth, getEventById);
router.post('/events/:id/rsvp', protect, rsvpForEvent);
router.delete('/events/:id/rsvp', protect, cancelRsvp);

// --- Badge Routes ---
router.get('/badges', getBadges);

// --- Admin Routes ---
// All routes below are protected and require admin role
router.get('/admin/users', protect, admin, adminGetUsers);
router.get('/admin/donations', protect, admin, adminGetDonations);

router.post('/admin/events', protect, admin, adminCreateEvent);
router.put('/admin/events/:id', protect, admin, adminUpdateEvent);
router.delete('/admin/events/:id', protect, admin, adminDeleteEvent);

router.post('/admin/badges', protect, admin, adminCreateBadge);
router.post('/admin/users/:userId/badge', protect, admin, adminAwardBadge);

// Google Sheets Sync
router.get('/admin/sync/users', protect, admin, adminSyncUsers);
router.get('/admin/sync/donations', protect, admin, adminSyncDonations);
router.get('/admin/sync/events', protect, admin, adminSyncEvents);

// --- Health Check ---
router.get('/health', healthCheck);

export default router;

