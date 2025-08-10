@@ .. @@
 import React from 'react';
 import { Calendar, Clock, User, Share2, Twitter, Linkedin, Facebook, Tag, Home } from 'lucide-react';
 import { useBlogPost } from '../hooks/useSupabase';
-import { BlogPost as SupabaseBlogPost } from '../lib/supabase';
+import { BlogPost as SQLiteBlogPost } from '../lib/database';
 import Navigation from './Navigation';

-// Convert Supabase blog post to display format
-const convertSupabaseBlogPost = (post: SupabaseBlogPost) => ({
+// Convert SQLite blog post to display format
+const convertSQLiteBlogPost = (post: SQLiteBlogPost) => ({
   id: post.id,
   title: post.title,
   slug: post.slug,
@@ -15,7 +15,7 @@ const convertSupabaseBlogPost = (post: SupabaseBlogPost) => ({
   updatedAt: post.updated_at || undefined,
   featuredImage: post.featured_image || '',
-  tags: post.tags || [],
+  tags: Array.isArray(post.tags) ? post.tags : [],
   category: post.category,
   readTime: post.read_time || 5,
   featured: post.featured || false
@@ .. @@
 const BlogPost: React.FC<BlogPostProps> = ({ slug, onBack, onNavigateHome, onNavigateToProjects }) => {
-  // Fetch post from Supabase
-  const { post: supabasePost, loading, error } = useBlogPost(slug);
+  // Fetch post from SQLite
+  const { post: sqlitePost, loading, error } = useBlogPost(slug);
   
   // Convert to display format
-  const post = supabasePost ? convertSupabaseBlogPost(supabasePost) : null;
+  const post = sqlitePost ? convertSQLiteBlogPost(sqlitePost) : null;