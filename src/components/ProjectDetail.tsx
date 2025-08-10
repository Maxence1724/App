@@ .. @@
 import React from 'react';
 import { Calendar, Clock, User, Share2, Twitter, Linkedin, Facebook, Tag, Home, ExternalLink, Github, ArrowLeft, Star, Code, Layers } from 'lucide-react';
 import { useProject } from '../hooks/useSupabase';
-import { Project as SupabaseProject } from '../lib/supabase';
+import { Project as SQLiteProject } from '../lib/database';
 import Navigation from './Navigation';

-// Convert Supabase project to display format
-const convertSupabaseProject = (project: SupabaseProject) => ({
+// Convert SQLite project to display format
+const convertSQLiteProject = (project: SQLiteProject) => ({
   id: project.id,
   title: project.title,
   description: project.description,
   longDescription: project.long_description,
-  technologies: project.technologies,
+  technologies: Array.isArray(project.technologies) ? project.technologies : [],
   category: project.category,
   status: project.status,
   startDate: project.start_date,
   endDate: project.end_date,
   client: project.client,
   budget: project.budget,
-  images: project.images,
+  images: Array.isArray(project.images) ? project.images : [],
   featured: project.featured,
   githubUrl: project.github_url,
   liveUrl: project.live_url,
@@ .. @@
 const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId, onBack, onNavigateHome, onNavigateToBlog }) => {
-  // Fetch project from Supabase
-  const { project: supabaseProject, loading, error } = useProject(projectId);
+  // Fetch project from SQLite
+  const { project: sqliteProject, loading, error } = useProject(projectId);
   
   // Convert to display format
-  const project = supabaseProject ? convertSupabaseProject(supabaseProject) : null;
+  const project = sqliteProject ? convertSQLiteProject(sqliteProject) : null;