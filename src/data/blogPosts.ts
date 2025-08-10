@@ .. @@
-import { BlogPost as SupabaseBlogPost } from '../lib/supabase';
+import { BlogPost as SQLiteBlogPost } from '../lib/database';

 // Legacy interface for backward compatibility
@@ .. @@
   featured: boolean;
 }

-// Convert Supabase blog post to legacy format
-export const convertSupabaseBlogPost = (post: SupabaseBlogPost): BlogPost => ({
+// Convert SQLite blog post to legacy format
+export const convertSQLiteBlogPost = (post: SQLiteBlogPost): BlogPost => ({
   id: post.id,
   title: post.title,
   slug: post.slug,
@@ -20,7 +20,7 @@ export const convertSupabaseBlogPost = (post: SupabaseBlogPost): BlogPost => ({
   updatedAt: post.updated_at || undefined,
   featuredImage: post.featured_image || '',
-  tags: post.tags || [],
+  tags: Array.isArray(post.tags) ? post.tags : [],
   category: post.category,
   readTime: post.read_time || 5,
   featured: post.featured || false