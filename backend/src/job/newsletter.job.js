import cron from 'node-cron';
import { prisma } from '../database.js';
import { sendEmail } from '../services.js';

/**
 * Fetches new content (posts and events) from the last 24 hours.
 * @returns {Promise<{posts: Array, events: Array}>}
 */
const getDailyContent = async () => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const posts = await prisma.bulletinPost.findMany({
    where: { createdAt: { gte: yesterday } },
    orderBy: { createdAt: 'desc' },
  });
  const events = await prisma.event.findMany({
    where: { createdAt: { gte: yesterday } }, // Newly created events
    orderBy: { date: 'asc' },
  });
  return { posts, events };
};

/**
 * Fetches new content (posts and events) from the last 7 days.
 * @returns {Promise<{posts: Array, events: Array}>}
 */
const getWeeklyContent = async () => {
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const posts = await prisma.bulletinPost.findMany({
    where: { createdAt: { gte: lastWeek } },
    orderBy: { createdAt: 'desc' },
  });
  const events = await prisma.event.findMany({
    where: { date: { gte: new Date() } }, // All upcoming events
    orderBy: { date: 'asc' },
  });
  return { posts, events };
};

/**
 * Generates an HTML email body from new content.
 * @param {string} name - User's name.
 * @param {Array} posts - Array of post objects.
 * @param {Array} events - Array of event objects.
 * @returns {string} - The generated HTML.
 */
const generateEmailHTML = (name, posts, events) => {
  let postHTML = '<h2>New Bulletin Posts</h2>';
  if (posts.length > 0) {
    postHTML += '<ul>';
    posts.forEach(post => {
      postHTML += `<li><b>${post.title}</b><p>${post.content.substring(0, 100)}...</p></li>`;
    });
    postHTML += '</ul>';
  } else {
    postHTML = '<p>No new bulletin posts this period.</p>';
  }

  let eventHTML = '<h2>Upcoming Events</h2>';
  if (events.length > 0) {
    eventHTML += '<ul>';
    events.forEach(event => {
      eventHTML += `<li><b>${event.name}</b> on ${new Date(event.date).toLocaleDateString()} at ${event.location}</li>`;
    });
    eventHTML += '</ul>';
  } else {
    eventHTML = '<p>No new or upcoming events.</p>';
  }

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Hi ${name},</h2>
      <p>Here's your update from Friends of the Youth (FOTY)!</p>
      <hr>
      ${postHTML}
      <hr>
      ${eventHTML}
      <hr>
      <p>Thank you for being a valued member of our community.</p>
      <p><em>To unsubscribe, please log in to your profile settings on our website.</em></p>
    </div>
  `;
};

/**
 * Sends the daily newsletter to all subscribed users.
 */
const sendDailyNewsletter = async () => {
  console.log('[Cron] Running daily newsletter job...');
  const { posts, events } = await getDailyContent();

  // If there's no new content, don't send emails
  if (posts.length === 0 && events.length === 0) {
    console.log('[Cron] No new content. Skipping daily emails.');
    return;
  }

  const users = await prisma.user.findMany({
    where: { newsletter: 'DAILY' },
  });

  if (users.length === 0) {
    console.log('[Cron] No users subscribed to daily newsletter.');
    return;
  }

  const html = generateEmailHTML('Member', posts, events);
  
  for (const user of users) {
    const personalizedHtml = generateEmailHTML(user.name, posts, events);
    await sendEmail(
      user.email,
      'FOTY Daily Update',
      personalizedHtml
    );
  }
  console.log(`[Cron] Sent daily newsletter to ${users.length} users.`);
};

/**
 * Sends the weekly newsletter to all subscribed users.
 */
const sendWeeklyNewsletter = async () => {
  console.log('[Cron] Running weekly newsletter job...');
  const { posts, events } = await getWeeklyContent();

  // If there's no new content, don't send emails
  if (posts.length === 0 && events.length === 0) {
    console.log('[Cron] No new content. Skipping weekly emails.');
    return;
  }

  const users = await prisma.user.findMany({
    where: { newsletter: 'WEEKLY' },
  });

  if (users.length === 0) {
    console.log('[Cron] No users subscribed to weekly newsletter.');
    return;
  }

  for (const user of users) {
    const personalizedHtml = generateEmailHTML(user.name, posts, events);
    await sendEmail(
      user.email,
      'FOTY Weekly Digest',
      personalizedHtml
    );
  }
  console.log(`[Cron] Sent weekly newsletter to ${users.length} users.`);
};

/**
 * Initializes and starts the cron jobs.
 * This is the function that needs to be exported.
 */
export const startNewsletterJob = () => {
  // Schedule daily job (e.g., every day at 8:00 AM)
  // For testing, you can use '* * * * *' to run every minute
  cron.schedule('0 8 * * *', sendDailyNewsletter, {
    timezone: "Africa/Nairobi",
  });

  // Schedule weekly job (e.g., every Monday at 9:00 AM)
  cron.schedule('0 9 * * 1', sendWeeklyNewsletter, {
    timezone: "Africa/Nairobi",
  });

  console.log('[Cron] Newsletter cron jobs scheduled.');
};

