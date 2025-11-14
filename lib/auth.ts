import bcrypt from 'bcryptjs';

export async function verifyPassword(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD not configured');
  }
  
  return adminPassword === password;
}
