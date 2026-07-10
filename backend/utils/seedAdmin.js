/**
 * One-time seed script to create the single admin account.
 * Run with: npm run seed
 * Reads ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD from .env
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const seed = async () => {
  await connectDB();

  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  const existing = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log(`Admin already exists for ${ADMIN_EMAIL}. No changes made.`);
    process.exit(0);
  }

  await Admin.create({
    name: ADMIN_NAME || 'Admin',
    email: ADMIN_EMAIL.toLowerCase(),
    password: ADMIN_PASSWORD,
  });

  console.log(`Admin account created for ${ADMIN_EMAIL}. You can now log in.`);
  mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
