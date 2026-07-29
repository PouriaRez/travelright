import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className="relative w-full h-[60dvh] overflow-hidden">
      <Image src="/nature.jpg" alt="view" fill className="object-cover" />
      <div className="absolute h-full w-full bg-black/55" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
        <h1 className="text-6xl font-bold text-zinc-200">
          It all starts here and now
        </h1>
        <Link href="/gather/information">
          <Button
            size="lg"
            variant="outline"
            className="text-lg text-zinc-700 hover:-translate-y-1 transition-all duration-300"
          >
            Find my way
            <ArrowRight />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
