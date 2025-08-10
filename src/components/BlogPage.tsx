@@ .. @@
 import { Search, Filter, Calendar, Clock, User, Tag, Home, BookOpen } from 'lucide-react';
 import { useBlogPosts } from '../hooks/useSupabase';
-import { BlogPost as SupabaseBlogPost } from '../lib/supabase';
-import { isSupabaseAvailable } from '../lib/supabase';
+import { BlogPost as SQLiteBlogPost } from '../lib/database';
+import { isSQLiteAvailable } from '../lib/sqlite';
 import Navigation from './Navigation';

-// Convert Supabase blog post to display format
-const convertSupabaseBlogPost = (post: SupabaseBlogPost) => ({
+// Convert SQLite blog post to display format
+const convertSQLiteBlogPost = (post: SQLiteBlogPost) => ({
   id: post.id,
   title: post.title,
   slug: post.slug,
@@ -20,7 +20,7 @@ const convertSupabaseBlogPost = (post: SupabaseBlogPost) => ({
   updatedAt: post.updated_at || undefined,
   featuredImage: post.featured_image || '',
-  tags: post.tags || [],
+  tags: Array.isArray(post.tags) ? post.tags : [],
   category: post.category,
   readTime: post.read_time || 5,
   featured: post.featured || false
@@ .. @@
 const BlogPage: React.FC<BlogPageProps> = ({ onNavigateHome, onNavigateToPost, onNavigateToProjects }) => {
-  // Fetch posts from Supabase
-  const { posts: supabasePosts, loading, error } = useBlogPosts();
+  // Fetch posts from SQLite
+  const { posts: sqlitePosts, loading, error } = useBlogPosts();
   
   // Debug logging
   useEffect(() => {
-    console.log('BlogPage - Posts:', supabasePosts);
+    console.log('BlogPage - Posts:', sqlitePosts);
     console.log('BlogPage - Loading:', loading);
     console.log('BlogPage - Error:', error);
-    console.log('BlogPage - Supabase available:', isSupabaseAvailable());
-    console.log('BlogPage - Total posts from Supabase:', supabasePosts.length);
-    if (supabasePosts.length > 0) {
-      console.log('BlogPage - First few posts:', supabasePosts.slice(0, 3).map(p => ({
+    console.log('BlogPage - SQLite available:', isSQLiteAvailable());
+    console.log('BlogPage - Total posts from SQLite:', sqlitePosts.length);
+    if (sqlitePosts.length > 0) {
+      console.log('BlogPage - First few posts:'
}, sqlitePosts.slice(0, 3).map(p => ({
         title: p.title,
         slug: p.slug,
         featured: p.featured
       })));
     }
-  }, [supabasePosts, loading, error]);
+  }, [sqlitePosts, loading, error]);

-  // Convert Supabase posts to display format
-  const blogPosts = supabasePosts.map(convertSupabaseBlogPost);
+  // Convert SQLite posts to display format
+  const blogPosts = sqlitePosts.map(convertSQLiteBlogPost);

@@ .. @@
             {/* Stats */}
             <div className="flex flex-wrap items-center justify-center gap-6">
               <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                 <div className="text-2xl font-bold text-white mb-1">
-                  {supabasePosts.length}
+                  {sqlitePosts.length}
                 </div>
                 <div className="text-sm text-white/80">Articles</div>
               </div>