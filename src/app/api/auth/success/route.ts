import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

import { db } from '@/drizzle/db';
import { users } from '@/drizzle/schema';

export async function GET() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser || !kindeUser.id) {
    throw new Error(`Authentication failed: ${JSON.stringify(kindeUser)}`);
  }

  const userExists = await db
    .select()
    .from(users)
    .where(eq(users.id, kindeUser.id));

  if (userExists.length === 0)
    await db.insert(users).values({
      email: kindeUser.email as string,
      firstName: kindeUser.given_name as string,
      lastName: kindeUser.family_name as string,
      id: kindeUser.id,
    });

  redirect('http://localhost:3000/trips');
}
