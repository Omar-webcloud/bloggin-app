"use client";

import Image from "next/image";

interface HeroSectionProps {
  totalPosts?: number;
  onSelectPost?: (post: any) => void;
  featuredPost?: any;
}

export default function HeroSection({}: HeroSectionProps = {}) {
  return (
    <section className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden mb-8 sm:mb-10 shadow-sm border border-border/60 bg-muted/20">
      <div className="relative w-full aspect-[16/9] min-h-[200px] sm:min-h-[340px] md:min-h-[420px] lg:min-h-[480px]">
        <Image
          src="/hero.png"
          alt="Thoughts, Ideas, Stories"
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 1200px, 1400px"
        />
        <h1 className="sr-only">Thoughts, Ideas, Stories</h1>
      </div>
    </section>
  );
}
