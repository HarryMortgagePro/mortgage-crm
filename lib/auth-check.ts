import { redirect } from 'next/navigation';
import { getSession } from './session';

export async function requireAuth() {
  const session = await getSession();
  if (!session.isAuthenticated) {
    redirect('/login');
  }
  return session;
}
