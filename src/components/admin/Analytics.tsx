@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { TrendingUp, Eye, Users, Calendar, BarChart3, PieChart, Activity } from 'lucide-react';
-import { supabase, blogService, projectService, isSupabaseAvailable } from '../../lib/supabase';
+import { blogService, projectService, isSQLiteAvailable } from '../../lib/sqlite';
 import { blogPosts as mockBlogPosts } from '../../data/blogPosts';

@@ .. @@
   const fetchAnalytics = async () => {
     setLoading(true);
     setError(null);

-    // Use mock data if Supabase is not available
-    if (!isSupabaseAvailable()) {
+    // Use mock data if SQLite is not available
+    if (!isSQLiteAvailable()) {
       try {
         const posts = mockBlogPosts;
         const projects = []; // Empty array for projects
@@ .. @@
     }

     try {
-      // Fetch real data from Supabase
+      // Fetch real data from SQLite
       const [postsResult, projectsResult] = await Promise.all([
         blogService.getAllPosts(),
         projectService.getAllProjects()