@@ .. @@
 import { ExternalLink, Github, Eye, Calendar, Code, Layers, Zap, Star, Filter, Search, ArrowRight, Home } from 'lucide-react';
 import { useProjects } from '../hooks/useSupabase';
-import { Project as SupabaseProject } from '../lib/supabase';
+import { Project as SQLiteProject } from '../lib/database';
 import Navigation from './Navigation';

-// Convert Supabase project to display format
-const convertSupabaseProject = (project: SupabaseProject, index: number) => {
+// Convert SQLite project to display format
+const convertSQLiteProject = (project: SQLiteProject, index: number) => {
   const gradients = [
     'from-blue-600 via-purple-600 to-pink-600',
     'from-emerald-500 via-teal-500 to-cyan-600',
@@ .. @@
     type: typeLabels[project.category as keyof typeof typeLabels] || 'Projet',
     description: project.long_description || project.description,
     image: project.images[0] || 'https://via.placeholder.com/400x300',
-    tags: project.technologies.slice(0, 4),
+    tags: (Array.isArray(project.technologies) ? project.technologies : []).slice(0, 4),
     gradient: gradients[index % gradients.length],
     bgGradient: bgGradients[index % bgGradients.length],
@@ .. @@
 const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigateHome, onNavigateToBlog, onNavigateToProject }) => {
   const [selectedCategory, setSelectedCategory] = useState('all');
   const [searchQuery, setSearchQuery] = useState('');
   const [isFilterOpen, setIsFilterOpen] = useState(false);

-  // Fetch projects from Supabase
-  const { projects: supabaseProjects, loading, error } = useProjects();
+  // Fetch projects from SQLite
+  const { projects: sqliteProjects, loading, error } = useProjects();
   
-  // Convert Supabase projects to display format
+  // Convert SQLite projects to display format
   const projects = React.useMemo(() => {
-    return supabaseProjects.map(convertSupabaseProject);
-  }, [supabaseProjects]);
+    return sqliteProjects.map(convertSQLiteProject);
+  }, [sqliteProjects]);

@@ .. @@
             {/* Stats */}
             <div className="flex flex-wrap items-center justify-center gap-6">
               <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
-                <div className="text-2xl font-bold text-white mb-1">{supabaseProjects.length}</div>
+                <div className="text-2xl font-bold text-white mb-1">{sqliteProjects.length}</div>
                 <div className="text-sm text-white/80">Projets</div>
               </div>
               <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
@@ -158,7 +158,7 @@ const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigateHome, onNavigate
                 <div className="text-sm text-white/80">Catégories</div>
               </div>
               <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
-                <div className="text-2xl font-bold text-white mb-1">{supabaseProjects.filter(p => p.featured).length}</div>
+                <div className="text-2xl font-bold text-white mb-1">{sqliteProjects.filter(p => p.featured).length}</div>
                 <div className="text-sm text-white/80">Featured</div>
               </div>
             </div>