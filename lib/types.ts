export type Category = 
  | 'All' 
  | 'Lifestyle' 
  | 'Reflections' 
  | 'Travel' 
  | 'Creativity' 
  | 'Food & Culture' 
  | 'Tech & Ideas' 
  | 'Saved';

export const CATEGORIES: Category[] = [
  'All',
  'Lifestyle',
  'Reflections',
  'Travel',
  'Creativity',
  'Food & Culture',
  'Tech & Ideas',
  'Saved'
];

export const EDITABLE_CATEGORIES: Exclude<Category, 'All' | 'Saved'>[] = [
  'Lifestyle',
  'Reflections',
  'Travel',
  'Creativity',
  'Food & Culture',
  'Tech & Ideas'
];

export type SortOption = 'newest' | 'oldest' | 'popular' | 'quick';

export type LayoutMode = 'grid' | 'list';

export interface Post {
  id: string;
  title: string;
  description: string;
  userId: string;
  username?: string;
  createdAt?: any;
  category?: string;
  tags?: string[];
  likes?: number;
  readTime?: number;
  bookmarked?: boolean;
}
