import { BlogPost as SQLiteBlogPost } from '../lib/database';

// Legacy interface for backward compatibility
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  featuredImage: string;
  tags: string[];
  category: string;
  readTime: number;
  featured: boolean;
}

// Convert SQLite blog post to legacy format
export const convertSQLiteBlogPost = (post: SQLiteBlogPost): BlogPost => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  content: post.content,
  excerpt: post.excerpt,
  publishedAt: post.published_at,
  updatedAt: post.updated_at || undefined,
  featuredImage: post.featured_image || '',
  tags: Array.isArray(post.tags) ? post.tags : [],
  category: post.category,
  readTime: post.read_time || 5,
  featured: post.featured || false
});