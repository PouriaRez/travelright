'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Target,
  Heart,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';

type Value = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const VALUES: Value[] = [
  {
    icon: Heart,
    title: 'Built Around You',
    body: 'Every recommendation starts with your preferences, not a generic top-10 list written for everyone.',
  },
  {
    icon: Sparkles,
    title: 'Powered By AI',
    body: "We use real place data and AI matching to surface spots that actually fit your interests — not just what's popular.",
  },
  {
    icon: Target,
    title: 'Less Scrolling, More Traveling',
    body: "No more digging through blogs and review sites. Tell us what you like, and we'll do the research for you.",
  },
];

const useInView = (threshold = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
};

const ValueCard = ({
  icon: Icon,
  title,
  body,
  delay,
}: Value & { delay: number }) => {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: isInView ? `${delay}ms` : '0ms' }}
      className={`group rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-xl hover:border-zinc-300 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
        <Icon size={22} />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-zinc-900">{title}</h3>
      <p className="text-zinc-600 leading-relaxed">{body}</p>
    </div>
  );
};

const MissionPage = () => {
  const { ref: heroRef, isInView: heroInView } = useInView(0.1);
  const { ref: storyRef, isInView: storyInView } = useInView();
  const { ref: ctaRef, isInView: ctaInView } = useInView();

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="w-full py-28 px-6 bg-zinc-900">
        <div
          ref={heroRef}
          className={`mx-auto max-w-3xl text-center transition-all duration-700 ease-out ${
            heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Our Mission
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Travel planning shouldn&apos;t feel like a second job
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-300">
            We&apos;re building a smarter way to discover places worth your time
            — matched to who you are, not a generic checklist.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="w-full py-24 px-6 bg-white">
        <div
          ref={storyRef}
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ease-out ${
            storyInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
            Why we built TravelRight
          </h2>
          <p className="mt-5 text-zinc-600 leading-relaxed">
            Every trip starts the same way: dozens of open tabs, conflicting
            blog posts, and reviews that don&apos;t know anything about you. We
            thought planning a trip should feel as exciting as taking one — so
            we built a tool that actually listens to your preferences and does
            the legwork, using real place data and AI to match you with spots
            you&apos;ll genuinely love.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="w-full py-24 px-6 bg-zinc-50">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
              What we believe in
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value, i) => (
              <ValueCard key={value.title} {...value} delay={i * 150} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-24 px-6 bg-white">
        <div
          ref={ctaRef}
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ease-out ${
            ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
            Ready to find your next trip?
          </h2>
          <p className="mt-4 text-zinc-600">
            Tell us what you like, and let us handle the rest.
          </p>
          <Link href="/gather/information">
            <Button size="lg" className="group mt-8 text-lg">
              Plan My Trip
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MissionPage;
