@@ .. @@
-import { useState, useEffect, useMemo } from 'react';
-import { supabase, BlogPost, Project, isSupabaseAvailable } from '../lib/supabase';
+import { useState, useEffect } from 'react';
+import { BlogPost, Project } from '../lib/database';
+import { blogService, projectService, isSQLiteAvailable } from '../lib/sqlite';
 import { blogPosts as mockBlogPosts } from '../data/blogPosts';

@@ .. @@
   useEffect(() => {
     fetchPosts();
   }, [filters]);

   const fetchPosts = async () => {
     setLoading(true);
     setError(null);
     
-    console.log('=== DEBUG: fetchPosts called ===');
-    console.log('Supabase available:', isSupabaseAvailable());
-    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Not set');
-    console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set');
-    console.log('Filters:', filters);
+    console.log('=== DEBUG: fetchPosts called ===');
+    console.log('SQLite available:', isSQLiteAvailable());
+    console.log('Filters:', filters);

-    // Try Supabase first, fallback to mock data if it fails
+    // Try SQLite first, fallback to mock data if it fails
     try {
-      if (isSupabaseAvailable()) {
-        console.log('=== Trying Supabase ===');
+      if (isSQLiteAvailable()) {
+        console.log('=== Trying SQLite ===');
         try {
-          let query = supabase!
-            .from('blog_posts')
-            .select('*')
-            .order('published_at', { ascending: false });
-          
-          console.log('Base query created');
-
-          if (filters?.category) {
-            query = query.eq('category', filters.category);
-            console.log('Added category filter:', filters.category);
-          }
-
-          if (filters?.featured !== undefined) {
-            query = query.eq('featured', filters.featured);
-            console.log('Added featured filter:', filters.featured);
-          }
-
-          if (filters?.limit) {
-            query = query.limit(filters.limit);
-            console.log('Added limit:', filters.limit);
-          }
-
-          if (filters?.offset) {
-            query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
-            console.log('Added offset range:', filters.offset);
-          }
-
-          console.log('Executing query...');
-          const { data, error } = await query;
+          const { data, error } = await blogService.getAllPosts(filters);
           
-          console.log('Query result - Data:', data);
-          console.log('Query result - Error:', error);
+          console.log('SQLite query result - Data:', data);
+          console.log('SQLite query result - Error:', error);

           if (error) {
-            console.error('Supabase error:', error);
+            console.error('SQLite error:', error);
             throw error;
           }

-          console.log('Supabase data received:', data);
+          console.log('SQLite data received:', data);
           console.log('Number of posts:', data?.length || 0);
           setPosts(data || []);
-        } catch (supabaseError) {
-          console.warn('Supabase fetch failed, falling back to mock data:', supabaseError);
-          throw supabaseError; // Re-throw to trigger fallback
+        } catch (sqliteError) {
+          console.warn('SQLite fetch failed, falling back to mock data:', sqliteError);
+          throw sqliteError; // Re-throw to trigger fallback
         }
       } else {
-        console.log('Supabase not available, using mock data');
-        throw new Error('Supabase not configured');
+        console.log('SQLite not available, using mock data');
+        throw new Error('SQLite not configured');
       }
     } catch (err) {
       console.warn('Primary data source failed, using mock data fallback:', err);
@@ .. @@
       
       // Fallback to mock data
       let filteredData = mockBlogPosts.map(post => ({
         id: post.id,
         title: post.title,
         slug: post.slug,
         excerpt: post.excerpt,
         content: post.content,
         author: post.author,
         published_at: post.publishedAt,
         updated_at: post.updatedAt,
         featured_image: post.featuredImage,
-        tags: post.tags,
+        tags: post.tags.join(','),
         category: post.category,
         read_time: post.readTime,
         featured: post.featured,
         created_at: post.publishedAt
       }));

@@ .. @@
     fetchProjects();
   }, [filters]);

   const fetchProjects = async () => {
     setLoading(true);
     setError(null);

-    // Use empty array if Supabase is not available
-    if (!isSupabaseAvailable()) {
+    // Use empty array if SQLite is not available
+    if (!isSQLiteAvailable()) {
       setProjects([]);
       setLoading(false);
       return;
     }

     try {
-      const { data, error } = await supabase
-        .from('projects')
-        .select('*')
-        .order('created_at', { ascending: false });
+      const { data, error } = await projectService.getAllProjects(filters);

       if (error) throw error;

-      let filteredData = data || [];
-
-      if (filters?.category) {
-        filteredData = filteredData.filter(project => project.category === filters.category);
-      }
-
-      if (filters?.status) {
-        filteredData = filteredData.filter(project => project.status === filters.status);
-      }
-
-      if (filters?.featured !== undefined) {
-        filteredData = filteredData.filter(project => project.featured === filters.featured);
-      }
-
-      if (filters?.limit) {
-        filteredData = filteredData.slice(0, filters.limit);
-      }
-
-      setProjects(filteredData);
+      setProjects(data || []);
     } catch (err) {
       setError(err instanceof Error ? err.message : 'An error occurred');
     } finally {
@@ .. @@
     fetchPost();
   }, [slug]);

   const fetchPost = async () => {
     setLoading(true);
     setError(null);

     try {
-      if (isSupabaseAvailable()) {
-        console.log('Fetching post from Supabase:', slug);
+      if (isSQLiteAvailable()) {
+        console.log('Fetching post from SQLite:', slug);
         
-        const { data, error } = await supabase!
-          .from('blog_posts')
-          .select('*')
-          .eq('slug', slug)
-          .single();
+        const { data, error } = await blogService.getPostBySlug(slug);

         if (error) {
-          console.error('Supabase error:', error);
+          console.error('SQLite error:', error);
           throw error;
         }

         if (data) {
-          console.log('Post loaded from Supabase:', data.title);
+          console.log('Post loaded from SQLite:', data.title);
           setPost(data);
         } else {
           setError('Article non trouvé');
@@ .. @@
             updated_at: mockPost.updatedAt,
             featured_image: mockPost.featuredImage,
-            tags: mockPost.tags,
+            tags: mockPost.tags.join(','),
             category: mockPost.category,
             read_time: mockPost.readTime,
             featured: mockPost.featured,
@@ .. @@
     fetchProject();
   }, [id]);

   const fetchProject = async () => {
     setLoading(true);
     setError(null);

-    // Return error if Supabase is not available
-    if (!isSupabaseAvailable()) {
+    // Return error if SQLite is not available
+    if (!isSQLiteAvailable()) {
       setError('Projet non trouvé');
       setLoading(false);
       return;
     }

     try {
-      const { data, error } = await supabase
-        .from('projects')
-        .select('*')
-        .eq('id', id)
-        .single();
+      const { data, error } = await projectService.getProjectById(id);

       if (error) throw error;
       setProject(data);
     } catch (err) {