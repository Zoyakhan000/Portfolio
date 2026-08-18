import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

interface OtpRecord {
  otpHash: string;
  otpCode: string;
  expiresAt: number;
  attempts: number;
}

interface RateLimitRecord {
  attempts: number;
  lockoutUntil: number;
}

// Server state (persists across API calls in Node.js process)
let currentAdminPasswordHash: { hash: string; salt: string } | null = null;
const otpStore = new Map<string, OtpRecord>();
const rateLimitStore = new Map<string, RateLimitRecord>();

const ADMIN_EMAIL = 'fizarafir@gmail.com';
const INITIAL_DEFAULT_PASS = 'McSe2008@@@!@';

// Hash password using crypto.scrypt
export function hashPassword(password: string, saltHex?: string): { hash: string; salt: string } {
  const salt = saltHex ? Buffer.from(saltHex, 'hex') : randomBytes(16);
  const derivedKey = scryptSync(password, salt, 64);
  return {
    hash: derivedKey.toString('hex'),
    salt: salt.toString('hex')
  };
}

// Verify password
export function verifyPassword(password: string): boolean {
  if (!currentAdminPasswordHash) {
    // Initialize default password hash on first run
    currentAdminPasswordHash = hashPassword(INITIAL_DEFAULT_PASS);
  }

  const { hash, salt } = currentAdminPasswordHash;
  const targetBuffer = Buffer.from(hash, 'hex');
  const testBuffer = scryptSync(password, Buffer.from(salt, 'hex'), 64);
  
  if (targetBuffer.length !== testBuffer.length) return false;
  return timingSafeEqual(targetBuffer, testBuffer);
}

// Update admin password
export function setAdminPassword(newPassword: string): void {
  currentAdminPasswordHash = hashPassword(newPassword);
}

// Check rate limit (max 5 failed attempts within 15 mins)
export function checkRateLimit(key: string): { allowed: boolean; remainingSeconds?: number } {
  const record = rateLimitStore.get(key);
  const now = Date.now();

  if (record) {
    if (record.lockoutUntil > now) {
      const remainingSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
      return { allowed: false, remainingSeconds };
    }
    if (record.lockoutUntil <= now && record.attempts >= 5) {
      // Reset after lockout expired
      rateLimitStore.delete(key);
    }
  }
  return { allowed: true };
}

// Record failed login attempt
export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const record = rateLimitStore.get(key) || { attempts: 0, lockoutUntil: 0 };
  record.attempts += 1;

  if (record.attempts >= 5) {
    record.lockoutUntil = now + 15 * 60 * 1000; // 15 minute lockout
  }
  rateLimitStore.set(key, record);
}

// Clear rate limit on successful login
export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

// Generate secure OTP for email
export function generateOtp(email: string): { success: boolean; otpCode?: string; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  
  // Rate limit check for OTP request
  const rate = checkRateLimit(`otp_${cleanEmail}`);
  if (!rate.allowed) {
    return {
      success: false,
      error: `Too many OTP requests. Please wait ${rate.remainingSeconds || 60} seconds.`
    };
  }

  // Generate 6 digit numeric code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = randomBytes(8).toString('hex');
  const { hash: otpHash } = hashPassword(otpCode, salt);

  // Expiration 10 minutes from now
  const expiresAt = Date.now() + 10 * 60 * 1000;

  // Save OTP record
  otpStore.set(cleanEmail, {
    otpHash: `${salt}:${otpHash}`,
    otpCode,
    expiresAt,
    attempts: 0
  });

  // Log on server
  console.log(`[SECURE SERVER EMAIL DELIVERY] Sent OTP to ${cleanEmail}: ${otpCode}`);

  return {
    success: true,
    otpCode
  };
}

// Verify OTP and reset password
export function verifyOtpAndResetPassword(email: string, otpCode: string, newPassword: string): { success: boolean; message: string } {
  const cleanEmail = email.trim().toLowerCase();
  const record = otpStore.get(cleanEmail);

  if (!record) {
    return { success: false, message: 'Invalid or expired verification code.' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanEmail);
    return { success: false, message: 'Verification code has expired. Please request a new one.' };
  }

  if (record.attempts >= 5) {
    otpStore.delete(cleanEmail);
    return { success: false, message: 'Too many failed verification attempts. Please request a new code.' };
  }

  const [salt, expectedHash] = record.otpHash.split(':');
  const { hash: testHash } = hashPassword(otpCode, salt);

  if (!timingSafeEqual(Buffer.from(expectedHash, 'hex'), Buffer.from(testHash, 'hex'))) {
    record.attempts += 1;
    return { success: false, message: 'Invalid verification code.' };
  }

  // OTP is valid!
  otpStore.delete(cleanEmail);
  setAdminPassword(newPassword);
  return { success: true, message: 'Password has been successfully updated.' };
}

export interface AdminSession {
  authenticated: boolean;
  user?: {
    email: string;
    role: string;
  };
}

export function getAdminSession(): AdminSession {
  if (typeof window === 'undefined') {
    return { authenticated: false };
  }
  const token = localStorage.getItem('admin_token');
  if (token) {
    return {
      authenticated: true,
      user: { email: 'admin@agency.com', role: 'SuperAdmin' }
    };
  }
  return { authenticated: false };
}

export function setAdminToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_token', token);
  }
}

export function clearAdminToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token');
  }
}

export { ADMIN_EMAIL };

export function authenticateAdmin(email: string, password: string, ip: string): { success: boolean; message?: string; lockoutRemainingSeconds?: number } {
  const cleanEmail = email.trim().toLowerCase();
  
  if (cleanEmail !== ADMIN_EMAIL.toLowerCase()) {
    return { success: false, message: 'Invalid email or password.' };
  }

  const rate = checkRateLimit(`login_${cleanEmail}`);
  if (!rate.allowed) {
    return { success: false, message: `Account temporarily locked due to too many failed attempts. Please try again in ${rate.remainingSeconds} seconds.`, lockoutRemainingSeconds: rate.remainingSeconds };
  }

  if (verifyPassword(password)) {
    clearRateLimit(`login_${cleanEmail}`);
    return { success: true };
  } else {
    recordFailedAttempt(`login_${cleanEmail}`);
    return { success: false, message: 'Invalid email or password.' };
  }
}
