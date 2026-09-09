import 'dotenv/config';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import connectDatabase from '../src/config/database.js';
import { ROLES } from '../src/constants/roles.js';
import User from '../src/models/User.js';

const options = Object.fromEntries(process.argv.slice(2).reduce((entries, argument, index, argumentsList) => {
  if (!argument.startsWith('--')) return entries;
  const key = argument.slice(2).replaceAll('-', '_').toUpperCase();
  entries.push([key, argumentsList[index + 1]]);
  return entries;
}, []));
const { ADMIN_EMAIL: configuredEmail, ADMIN_PASSWORD: configuredPassword, ADMIN_FIRST_NAME = 'TEXCELLENCE', ADMIN_LAST_NAME = 'Administrator' } = process.env;
const ADMIN_EMAIL = options.EMAIL || configuredEmail;
const ADMIN_PASSWORD = options.PASSWORD || configuredPassword;
const ADMIN_FIRST_NAME_VALUE = options.FIRST_NAME || ADMIN_FIRST_NAME;
const ADMIN_LAST_NAME_VALUE = options.LAST_NAME || ADMIN_LAST_NAME;

const createAdmin = async () => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set to create an administrator.');
  if (ADMIN_PASSWORD.length < 12) throw new Error('ADMIN_PASSWORD must be at least 12 characters.');
  await connectDatabase();
  const email = ADMIN_EMAIL.toLowerCase().trim();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    existingUser.role = ROLES.ADMIN;
    existingUser.isActive = true;
    existingUser.passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await existingUser.save();
    console.info('Administrator account promoted or updated.');
    return;
  }
  await User.create({ firstName: ADMIN_FIRST_NAME_VALUE, lastName: ADMIN_LAST_NAME_VALUE, email, passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12), role: ROLES.ADMIN });
  console.info('Administrator created.');
};

createAdmin().catch((error) => { console.error('Unable to create administrator:', error.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());
