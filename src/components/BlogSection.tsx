@@ .. @@
 import React, { useEffect, useRef, useState } from 'react';
 import { ArrowRight, Calendar, Clock, User, BookOpen, Sparkles } from 'lucide-react';
 import { useBlogPosts } from '../hooks/useSupabase';
-import { isSupabaseAvailable } from '../lib/supabase';
+import { isSQLiteAvailable } from '../lib/sqlite';

@@ .. @@
   // Debug logging
   useEffect(() => {
     console.log('=== BlogSection Debug ===');
     console.log('BlogSection - Posts:', featuredPosts);
     console.log('BlogSection - Loading:', loading);
     console.log('BlogSection - Error:', error);
     console.log('BlogSection - Posts count:', featuredPosts.length);
     if (featuredPosts.length > 0) {
       console.log('BlogSection - Featured posts details:', featuredPosts.map(p => ({
         title: p.title,
         slug: p.slug,
         featured: p.featured,
         published_at: p.published_at
       })));
     }
-    console.log('BlogSection - Supabase available:', isSupabaseAvailable());
-    console.log('BlogSection - Environment check:', {
-      supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing',
-      supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
-    });
-    
-    // Test direct Supabase connection
-    if (isSupabaseAvailable()) {
-      console.log('=== Testing direct Supabase connection ===');
-      import('../lib/supabase').then(({ supabase }) => {
-        if (supabase) {
-          supabase
-            .from('blog_posts')
-            .select('*', { count: 'exact', head: true })
-            .then(({ count, error }) => {
-              console.log('Direct count query result:', { count, error });
-            });
-        }
-      });
-    }
+    console.log('BlogSection - SQLite available:', isSQLiteAvailable());
   }, [featuredPosts, loading, error]);

@@ .. @@
                 {/* Tags */}
                 <div className="flex flex-wrap gap-2 mb-6">
-                  {post.tags.slice(0, 3).map((tag, tagIndex) => (
+                  {(Array.isArray(post.tags) ? post.tags : []).slice(0, 3).map((tag, tagIndex) => (
                     <span 
                       key={tagIndex}
                       className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors duration-200"