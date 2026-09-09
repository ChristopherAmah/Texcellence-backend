import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { recordActivity } from './activity.service.js';

const createToken = (user) => jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
export const registerUser = async ({ firstName, lastName, email, password }) => { const normalizedEmail = email.toLowerCase().trim(); if (await User.exists({ email: normalizedEmail })) { const error = new Error('An account with this email already exists.'); error.statusCode = 409; throw error; } const user = await User.create({ firstName, lastName, email: normalizedEmail, passwordHash: await bcrypt.hash(password, 12) }); await recordActivity({ type: 'ATTENDEE_REGISTERED', title: 'New account registered', description: `${firstName} ${lastName} created an attendee account.`, actor: user, entity: user }); return { user: user.toSafeObject(), token: createToken(user) }; };
export const loginUser = async ({ email, password }) => { const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash'); if (!user || !(await bcrypt.compare(password, user.passwordHash))) { const error = new Error('Invalid email or password.'); error.statusCode = 401; throw error; } if (!user.isActive) { const error = new Error('This account is inactive.'); error.statusCode = 403; throw error; } return { user: user.toSafeObject(), token: createToken(user) }; };
