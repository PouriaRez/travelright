'use client';

import { useEffect, useRef, useState } from 'react';
import { Compass, Map, Sparkles, type LucideIcon } from 'lucide-react';

type Pillar = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const PILLARS: Pillar[] = [
  {
    icon: Compass,
    title: 'Tell Us What You Love',
    body: 'Share your destination, interests, and dealbreakers — the more we know, the sharper your matches.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Matching',
    body: 'We scan real places near you and use AI to match them against what you actually care about — not generic top-10 lists.',
  },
  {
    icon: Map,
    title: 'Your Personalized Shortlist',
    body: 'Get a curated list of spots built just for you, ready to explore, save, and map out with a single tap.',
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

const PillarCard = ({
  icon: Icon,
  title,
  body,
  delay,
}: Pillar & { delay: number }) => {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: isInView ? `${delay}ms` : '0ms' }}
      className={`group relative rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-xl hover:border-zinc-300 ${
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

const Description = () => {
  const { ref: headingRef, isInView: headingInView } = useInView();

  return (
    <section className="w-full py-24 px-6 bg-zinc-50">
      <div className="mx-auto max-w-5xl">
        <div
          ref={headingRef}
          className={`mb-16 text-center transition-all duration-700 ease-out ${
            headingInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-zinc-500">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
            What we&apos;re all about
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-600">
            No more scrolling endless blogs and review sites — tell us what you
            like, and let AI find the spots worth your time.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <PillarCard key={pillar.title} {...pillar} delay={i * 150} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Description;
