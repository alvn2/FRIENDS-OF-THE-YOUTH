import jwt from 'jsonwebtoken';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // This is important for tables
import { prisma } from './database.js'; // <-- FIX 1: Named import
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import axios from 'axios';

// --- 1. JWT Service ---

/**
 * Generates a JWT token for a user.
 * @param {string} userId - The user's ID.
 * @param {string} role - The user's role.
 * @returns {string} - The generated JWT.
 */
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// --- 2. Email Service (Nodemailer) ---

// Create a reusable transporter object
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: (process.env.EMAIL_PORT === '465'), // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email.
 * @param {string} to - Recipient's email address.
 * @param {string} subject - Email subject.
 * @param {string} html - Email body in HTML.
 */
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM, // Sender address
      to: to, // List of receivers
      subject: subject, // Subject line
      html: html, // HTML body
    });
    console.log(`[Email] Sent to: ${to} | Subject: ${subject}`);
  } catch (error) {
    console.error('[Email] Error sending email:', error.message);
  }
};

// --- 3. PDF Certificate Service (jsPDF) ---

/**
 * Generates a PDF membership certificate.
 * @param {object} user - The user object from Prisma.
 * @returns {Buffer} - The generated PDF as a buffer.
 */
const generatePDFCertificate = async (user) => { // <-- FIX 2: Correct name
  const doc = new jsPDF();
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Set properties
  doc.setProperties({
    title: `FOTY Membership Certificate - ${user.name}`,
    subject: 'Friends of the Youth (FOTY) Official Certificate',
    author: 'Friends of the Youth',
  });

  // Add a border
  doc.rect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('Friends of the Youth (FOTY)', 105, 30, { align: 'center' });

  // Subtitle
  doc.setFontSize(20);
  doc.setFont('helvetica', 'normal');
  doc.text('Certificate of Membership', 105, 45, { align: 'center' });

  // "Proudly presents to"
  doc.setFontSize(16);
  doc.text('This certificate is proudly presented to:', 105, 70, { align: 'center' });

  // User Name
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(user.name, 105, 90, { align: 'center' });

  // Body Text
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `For their dedication and valued membership in the Friends of the Youth community.`,
    105,
    110,
    { align: 'center' }
  );

  // Details Table
  doc.autoTable({
    startY: 130,
    head: [['Membership Details']],
    body: [
      ['Member ID', user.id],
      ['Member Since', joinDate],
      ['Email', user.email],
      ['Phone', user.phone],
    ],
    theme: 'striped',
    margin: { left: 30, right: 30 },
  });

  // Footer / Signature line
  doc.setFontSize(12);
  doc.text('_________________________', 50, 200);
  doc.text('Signature (FOTY Director)', 50, 207);

  doc.text('_________________________', 160, 200, { align: 'center' });
  doc.text('Date', 160, 207, { align: 'center' });

  // Get the PDF as a buffer
  const pdfBuffer = doc.output('arraybuffer');
  return Buffer.from(pdfBuffer);
};

// --- 4. M-Pesa Service ---

/**
 * Gets an M-Pesa auth token.
 * @returns {Promise<string>} - The M-Pesa auth token.
 */
const getMpesaToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const authUrl =
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  
  // Base64 encode the consumer key and secret
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(authUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('[M-Pesa] Error getting token:', error.response ? error.response.data : error.message);
    throw new Error('Could not get M-Pesa token');
  }
};

/**
 * Initiates an M-Pesa STK Push.
 * @param {number} amount - The amount to charge.
 * @param {string} phone - The phone number (formatted as 254...).
 * @param {string} [userId] - The user ID (optional).
 * @returns {Promise<object>} - The response from M-Pesa.
 */
const initiateSTKPush = async (amount, phone, userId = null) => {
  const token = await getMpesaToken();
  const stkUrl = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, -3); // YYYYMMDDHHMMSS
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline', // or 'CustomerBuyGoodsOnline'
    Amount: amount,
    PartyA: phone, // The user's phone number
    PartyB: shortcode, // Your paybill/till number
    PhoneNumber: phone, // The user's phone number
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: 'FOTY_Donation',
    TransactionDesc: 'Donation to Friends of the Youth',
  };

  try {
    const response = await axios.post(stkUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Create a pending donation record
    await prisma.donation.create({
      data: {
        amount: parseInt(amount),
        phone,
        userId: userId || null,
        status: 'PENDING',
        checkoutRequestId: response.data.CheckoutRequestID,
        mpesaReceipt: null,
      },
    });

    return response.data;
  } catch (error) {
    console.error('[M-Pesa] STK Push Error:', error.response ? error.response.data : error.message);
    throw new Error('M-Pesa STK Push failed');
  }
};

/**
 * Handles the M-Pesa callback data.
 * @param {object} callbackData - The data from M-Pesa.
 */
const handleMpesaCallback = async (callbackData) => {
  const { Body } = callbackData;
  if (!Body || !Body.stkCallback) {
    console.error('[M-Pesa] Invalid callback format:', callbackData);
    return;
  }

  const { stkCallback } = Body;
  const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

  // Find the pending donation
  const donation = await prisma.donation.findUnique({
    where: { checkoutRequestId: CheckoutRequestID },
  });

  if (!donation) {
    console.error(`[M-Pesa] Donation not found for CheckoutRequestID: ${CheckoutRequestID}`);
    return;
  }

  if (ResultCode === 0) {
    // Payment was successful
    const metadata = stkCallback.CallbackMetadata.Item;
    const mpesaReceipt = metadata.find((i) => i.Name === 'MpesaReceiptNumber').Value;
    const amount = metadata.find((i) => i.Name === 'Amount').Value;

    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        status: 'COMPLETED',
        mpesaReceipt: mpesaReceipt,
        amount: parseInt(amount), // Update with confirmed amount
      },
    });

    console.log(`[M-Pesa] Payment completed for ${mpesaReceipt}`);
    
    // Check if this donation qualifies the user for a new badge
    if (donation.userId) {
      await checkAndAwardDonationBadge(donation.userId);
    }

  } else {
    // Payment failed or was cancelled
    await prisma.donation.update({
      where: { id: donation.id },
      data: {
        status: 'FAILED',
        mpesaReceipt: ResultDesc, // Store the error message
      },
    });
    console.error(`[M-Pesa] Payment failed for ${CheckoutRequestID}: ${ResultDesc}`);
  }
};

/**
 * Checks and awards donation-related badges to a user.
 * @param {string} userId - The user ID.
 */
const checkAndAwardDonationBadge = async (userId) => {
  try {
    const userDonations = await prisma.donation.findMany({
      where: {
        userId,
        status: 'COMPLETED',
      },
    });

    // Check for "First Donation" badge
    const firstDonationBadge = await prisma.badge.findUnique({ where: { name: 'First Donation' }});
    if (firstDonationBadge) {
      const hasBadge = await prisma.userBadge.findFirst({ where: { userId, badgeId: firstDonationBadge.id }});
      if (!hasBadge) {
        await prisma.userBadge.create({
          data: { userId, badgeId: firstDonationBadge.id }
        });
        console.log(`[Badges] Awarded 'First Donation' to user ${userId}`);
      }
    }
    
    // Check for "Big Spender" badge (total donations > 5000)
    const bigSpenderBadge = await prisma.badge.findUnique({ where: { name: 'Big Spender' }});
    if(bigSpenderBadge) {
      const hasBadge = await prisma.userBadge.findFirst({ where: { userId, badgeId: bigSpenderBadge.id }});
      const totalDonated = userDonations.reduce((sum, d) => sum + d.amount, 0);

      if (!hasBadge && totalDonated >= 5000) {
         await prisma.userBadge.create({
          data: { userId, badgeId: bigSpenderBadge.id }
        });
        console.log(`[Badges] Awarded 'Big Spender' to user ${userId}`);
      }
    }

  } catch (error) {
    console.error(`[Badges] Error checking donation badges for user ${userId}:`, error.message);
  }
};

// --- 5. Google Sheets Service ---

/**
 * Gets an authenticated Google Sheets client.
 * @returns {object} - The Google Sheets API client.
 */
const getGoogleAuth = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Fix newlines
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
};

/**
 * Syncs data to a specific sheet (tab) in the Google Sheet.
 * @param {string} sheetName - The name of the tab (e.g., "Users", "Donations").
 * @param {Array<string>} headers - The header row.
 * @param {Array<Array<any>>} data - The data rows.
 */
const syncToGoogleSheet = async (sheetName, headers, data) => {
  const sheets = getGoogleAuth();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  try {
    // 1. Clear the existing sheet content
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `${sheetName}!A1:Z`,
    });

    // 2. Add headers
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [headers],
      },
    });

    // 3. Add data
    if (data.length > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A2`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: data,
        },
      });
    }
    console.log(`[Google Sheets] Successfully synced ${data.length} rows to "${sheetName}" sheet.`);
  } catch (error) {
    console.error('[Google Sheets] Error syncing to sheet:', error.message);
  }
};

export {
  generateToken,
  sendEmail,
  generatePDFCertificate, // <-- FIX 2: Correct export
  getMpesaToken,
  initiateSTKPush,
  handleMpesaCallback,
  getGoogleAuth,
  syncToGoogleSheet,
};

