@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { BarChart3, FileText, Briefcase, Users, Settings, Plus, Search, Filter, Eye, Edit, Trash2, Calendar, TrendingUp, MessageCircle } from 'lucide-react';
-import { supabase, blogService, projectService, contactService } from '../../lib/supabase';
+import { blogService, projectService, contactService } from '../../lib/sqlite';
 import BlogManager from './BlogManager';
 import ProjectManager from './ProjectManager';
 import MessagesManager from './MessagesManager';
@@ .. @@
   const fetchStats = async () => {
     setLoading(true);
     try {
-      // Fetch real data from Supabase
+      // Fetch real data from SQLite
       const [postsResult, projectsResult, messagesResult, unreadResult] = await Promise.all([
         blogService.getAllPosts(),
         projectService.getAllProjects(),