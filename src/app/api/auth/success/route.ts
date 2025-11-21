import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

export async function GET() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  if (!kindeUser || !kindeUser.id) {
    throw new Error(`Authentication failed: ${JSON.stringify(kindeUser)}`);
  }

  /* const details = {
    email: kindeUser.email as string,
    firstName: kindeUser.given_name as string,
    lastName: kindeUser.family_name as string,
    id: kindeUser.id,
  };
   console.log('Details: ', details);
  */

  redirect('http://localhost:3000/trips');
}
