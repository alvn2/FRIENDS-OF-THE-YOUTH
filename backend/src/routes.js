import express from 'express';
import passport from 'passport';
// --- Ensure ALL required controllers are imported ---
import {
  registerUser, loginUser, googleCallback, getUserProfile, updateUserProfile,
  getCertificate, subscribeToNewsletter, unsubscribeFromNewsletter,
  initiateDonation, donationCallback, getUserDonations,
  getPosts, getPostById, createPost, updatePost, deletePost,
  getEvents, getEventById, rsvpForEvent, cancelRsvp,
  getBadges,
  adminGetUsers, adminGetDonations, adminCreateEvent, adminUpdateEvent,
  adminDeleteEvent, adminCreateBadge, adminAwardBadge,
  adminSyncUsers, adminSyncDonations, adminSyncEvents,
  healthCheck,
} from './controllers.js'; // Ensure controllers.js exports all these
import { protect, admin, optionalAuth } from './middleware.js';

const router = express.Router();

// --- Health Check ---
router.get('/health', healthCheck);

// --- Auth Routes ---
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/#/login?error=google', session: false }),
  googleCallback
);

// --- User Routes ---
router.route('/users/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.get('/users/certificate', protect, getCertificate);
router.post('/users/subscribe', protect, subscribeToNewsletter);
router.post('/users/unsubscribe', protect, unsubscribeFromNewsletter);

// --- Donation Routes ---
router.route('/donations')
    .get(protect, getUserDonations); // GET /api/v1/donations

// --- FIX: Change route path to match frontend call after proxy ---
// Frontend calls /api/donations/initiate-mpesa -> Proxy rewrites to /api/v1/donations/initiate-mpesa
router.post('/donations/initiate-mpesa', optionalAuth, initiateDonation);
// ------------------------------------------------------------------

// POST /api/v1/donations/callback (M-Pesa sends here directly)
router.post('/donations/callback', donationCallback);

// --- Bulletin Post Routes ---
router.route('/posts')
  .get(getPosts)
  .post(protect, createPost);
router.route('/posts/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

// --- Event Routes ---
router.route('/events')
  .get(optionalAuth, getEvents);
router.route('/events/:id')
  .get(optionalAuth, getEventById);
router.post('/events/:id/rsvp', protect, rsvpForEvent);
router.delete('/events/:id/rsvp', protect, cancelRsvp);

// --- Badge Routes ---
router.get('/badges', getBadges);

// --- Admin Routes ---
// ... (admin routes remain the same) ...
router.get('/admin/users', protect, admin, adminGetUsers);
router.get('/admin/donations', protect, admin, adminGetDonations);
router.post('/admin/events', protect, admin, adminCreateEvent);
router.put('/admin/events/:id', protect, admin, adminUpdateEvent);
router.delete('/admin/events/:id', protect, admin, adminDeleteEvent);
router.post('/admin/badges', protect, admin, adminCreateBadge);
router.post('/admin/users/:userId/badge', protect, admin, adminAwardBadge);
router.get('/admin/sync/users', protect, admin, adminSyncUsers);
router.get('/admin/sync/donations', protect, admin, adminSyncDonations);
router.get('/admin/sync/events', protect, admin, adminSyncEvents);


export default router;

