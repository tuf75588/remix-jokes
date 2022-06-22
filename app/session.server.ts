import bcrypt from 'bcryptjs';
import { db } from '~/utils/db.server';

type LoginForm = {
  username: string;
  password: string;
};

export async function login({ username, password }: LoginForm) {
  const user = await db.user.findUnique({ where: { username } });
  // if we don't exist
  if (!user) return null;

  // check hash against db seed
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) return null;

  return { id: user.id, username };
}
