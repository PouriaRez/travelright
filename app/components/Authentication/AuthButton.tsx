import { auth, signIn, signOut } from '@/auth';
import { Button } from '../../../components/ui/button';

export default async function AuthButton() {
  const session = await auth();

  if (session) {
    return (
      <div>
        <form
          className="flex flex-col justify-center items-center"
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <Button variant="destructive" type="submit" className="w-full h-12">
            Sign out
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col justify-center items-center"
      action={async () => {
        'use server';
        await signIn('google');
      }}
    >
      <Button variant="secondary" type="submit">
        Sign in with Google
      </Button>
    </form>
  );
}
