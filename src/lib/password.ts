import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const KEY_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, hashedPassword: string) {
  const [salt, storedHash] = hashedPassword.split(':');

  if (!salt || !storedHash) {
    return false;
  }

  const derivedHash = scryptSync(password, salt, KEY_LENGTH);
  const storedHashBuffer = Buffer.from(storedHash, 'hex');

  if (derivedHash.length !== storedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(derivedHash, storedHashBuffer);
}
