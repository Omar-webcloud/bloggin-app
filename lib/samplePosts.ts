import { Post } from './types';

export const samplePosts: Post[] = [
  {
    id: 'art-of-slow-mornings',
    title: 'The Art of Slow Mornings in a Hyper-Connected World',
    userId: 'omar-featured-author',
    username: 'Md_Omar_Faruk_Chowdhury',
    createdAt: { seconds: Math.floor(new Date('2026-04-20T20:12:27').getTime() / 1000) },
    category: 'Lifestyle',
    readTime: 4,
    likes: 128,
    tags: ['Mindfulness', 'Morning Routine', 'Lifestyle', 'Habits'],
    description: `Before reaching for your phone at 7 AM and drowning in notifications, try giving your mind twenty quiet minutes with sunlight, a warm cup of tea, and a physical notebook.

For years, my first instinct upon waking up was to reach for my phone. Within thirty seconds of opening my eyes, my brain was already reacting to overnight messages, breaking news, and other people’s priorities.

Three months ago, I tried a small experiment: leaving my phone charging in another room overnight and spending the first twenty minutes of the day completely offline.

With nothing flashing for my attention, mornings slowed down. I started noticing the sound of birds outside the window, brewing tea without rushing, and jotting down three simple thoughts in a pocket notebook.

You do not need a complicated two-hour wellness routine to feel grounded. Just reclaiming the first fifteen minutes of your morning for your own thoughts changes the rhythm of your entire day.`
  },
  {
    id: 'what-is-life',
    title: 'What is life? Notes on Balance, Curiosity, and Everyday Moments',
    userId: 'omar-featured-author',
    username: 'Md_Omar_Faruk_Chowdhury',
    createdAt: { seconds: Math.floor(new Date('2026-03-15T23:20:05').getTime() / 1000) },
    category: 'Reflections',
    readTime: 3,
    likes: 94,
    tags: ['Life', 'Philosophy', 'Gratitude', 'Reflections'],
    description: `Between chasing big milestones and checking off daily to-do lists, it is easy to overlook the quiet moments that actually make up a meaningful life.

We often treat life like a series of distant checkpoints—graduating, landing the next role, moving to a new apartment, or finishing a major project. We tell ourselves we will relax once we reach the next hill.

Yet when you look back at your favorite memories from the past five years, they are rarely the resume highlights. They are late-night conversations with old friends, getting caught in unexpected rain, reading a book that shifted your perspective, or laughing over a homemade meal.

Life is not waiting at the finish line; it is happening in the small, ordinary intervals in between. Stay curious, be kind to yourself, and don’t forget to look around.`
  },
  {
    id: 'solo-train-journeys',
    title: 'Why Everyone Should Take a Long Window-Seat Train Journey Alone',
    userId: 'omar-featured-author',
    username: 'Md_Omar_Faruk_Chowdhury',
    createdAt: { seconds: Math.floor(new Date('2026-02-28T17:42:10').getTime() / 1000) },
    category: 'Travel',
    readTime: 5,
    likes: 76,
    tags: ['Travel', 'Train', 'Solo Travel', 'Stories'],
    description: `Airplanes teleport you from one city to another, but trains let you watch the landscape—and your own thoughts—unfold one mile at a time.

Airports are designed for speed, yet they somehow always feel stressful. Trains, on the other hand, carry a completely different kind of magic. Once you settle into a window seat and the station platform glides away, time stretches out.

Watching green fields, rivers, and small towns pass by outside the glass creates a rare mental space where you don’t feel guilty for doing nothing.

Some of my clearest journaling and favorite book chapters happened on four-hour train rides with a thermos of coffee and no itinerary. Next time you travel somewhere nearby, skip the rush and take the scenic tracks.`
  },
  {
    id: 'keeping-a-commonplace-book',
    title: 'How Keeping a Pocket Notebook Rescued My Attention Span',
    userId: 'omar-featured-author',
    username: 'Md_Omar_Faruk_Chowdhury',
    createdAt: { seconds: Math.floor(new Date('2026-02-10T18:40:46').getTime() / 1000) },
    category: 'Creativity',
    readTime: 4,
    likes: 83,
    tags: ['Writing', 'Creativity', 'Journaling', 'Books'],
    description: `Whenever I read a striking sentence, overhear a funny phrase, or sketch a rough idea, it goes straight into a paper commonplace book instead of a digital app.

For centuries, writers, scientists, and thinkers carried what they called a "commonplace book"—a personal notebook filled with favorite quotes, observations, recipes, and half-baked ideas.

Digital notes are great for searching, but paper has a tactile memory. When you write a quote by hand, you slow down enough to actually digest why it moved you.

Flipping through a physical notebook from two years ago feels like visiting an older version of yourself. Even the messy handwriting and coffee rings tell part of the story.`
  },
  {
    id: 'midnight-kitchen-experiments',
    title: 'The Joy of Imperfect Cooking: Ditching Strict Recipes on Weeknights',
    userId: 'omar-featured-author',
    username: 'Md_Omar_Faruk_Chowdhury',
    createdAt: { seconds: Math.floor(new Date('2026-01-29T10:47:37').getTime() / 1000) },
    category: 'Food & Culture',
    readTime: 4,
    likes: 61,
    tags: ['Cooking', 'Food', 'Home', 'Culture'],
    description: `Cooking becomes infinitely more relaxing when you stop treating recipes like chemistry exams and start tasting, improvising, and trusting your senses.

When I first started cooking for myself, I followed recipes with ruler-like precision. If a dish called for a quarter teaspoon of cumin and I only had coriander, I panicked.

Over time, watching family members cook taught me that great home food is built on intuition, not rigid measurements. It is about listening to the sizzle of garlic in olive oil, balancing acidity with a squeeze of lemon, and using whatever vegetables happen to be in the fridge.

Some of the best dinners come from happy accidents. Put on a good playlist, taste as you go, and enjoy the process.`
  },
  {
    id: 'tech-stack-guide',
    title: 'Building Cozy Spaces on the Web: Why Personal Blogs Still Matter',
    userId: 'omar-featured-author',
    username: 'Md_Omar_Faruk_Chowdhury',
    createdAt: { seconds: Math.floor(new Date('2026-01-14T20:12:27').getTime() / 1000) },
    category: 'Tech & Ideas',
    readTime: 5,
    likes: 69,
    tags: ['Blogging', 'Digital Garden', 'Internet', 'Writing'],
    description: `In an era of short-form algorithms and fleeting feeds, having a quiet corner of the internet where you can write long, thoughtful posts feels more refreshing than ever.

Social media feeds are built for velocity—posts appear, gather reactions for a few hours, and vanish beneath an endless scroll. Personal blogs operate on a completely different clock.

When you publish an essay, a travel guide, or a tutorial on a blog, it stays searchable, readable, and calm. Someone might stumble upon a story you wrote two years ago and find the exact perspective they needed today.

Whether you write about books, photography, coding, or daily life, owning a simple, distraction-free space to share your voice is one of the best habits on the web.`
  }
];
