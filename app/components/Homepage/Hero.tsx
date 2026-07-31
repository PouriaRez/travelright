import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import heroImage from '@/public/nature.jpg';

const Hero = () => {
  return (
    <div className="relative w-full h-[70dvh] min-h-120 overflow-hidden">
      <Image
        src={heroImage}
        alt="Scenic mountain landscape at golden hour"
        placeholder="blur"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/20" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="max-w-3xl text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
          It all starts here and now
        </h1>
        <p className="max-w-xl text-base sm:text-lg text-zinc-200/90">
          Plan smarter, travel further, and make every trip unforgettable.
        </p>
        <Link href="/gather/information">
          <Button
            size="lg"
            variant="outline"
            className="group text-lg text-zinc-900 bg-white/95 border-white hover:bg-white hover:-translate-y-1 transition-all duration-300"
          >
            Plan My Trip
            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
