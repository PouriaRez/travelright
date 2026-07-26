import { signIn } from '@/app/auth';
const Join = () => {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google');
      }}
    >
      <button type="submit">Sign in with Google</button>
    </form>
  );
};

export default Join;
