import Image from 'next/image';
import { auth } from '../../auth';

const Description = async () => {
  const descriptions = {};
  const session = await auth();
  return (
    <div className="h-dvh w-dvw">
      What we are all about
      <div>
        {session ? (
          <div>
            <div>
              {session.user?.name} and {session.user?.email}
            </div>
            <Image
              src={session.user?.image!}
              alt="person"
              height={100}
              width={100}
            />
          </div>
        ) : (
          <div>no</div>
        )}
      </div>
    </div>
  );
};

export default Description;
