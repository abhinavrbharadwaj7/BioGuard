import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scryptAsync(password, salt, KEY_LENGTH);

  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password, storedHash = "") {
  const [salt, key] = storedHash.split(":");

  if (!salt || !key) {
    return false;
  }

  const storedKey = Buffer.from(key, "hex");
  const derivedKey = await scryptAsync(password, salt, storedKey.length);

  return timingSafeEqual(storedKey, derivedKey);
}
