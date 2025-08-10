@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, Tag, Briefcase, Save, X, Upload } from 'lucide-react';
-import { supabase, projectService } from '../../lib/supabase';
+import { projectService } from '../../lib/sqlite';

 interface Project {
@@ .. @@
   long_description: string;
-  technologies: string[];
+  technologies: string;
   category: string;
   status: 'in-progress' | 'completed' | 'archived';
   start_date: string;
   end_date?: string;
   client?: string;
   budget?: string;
-  images: string[];
+  images: string;
   featured: boolean;
   github_url?: string;
   live_url?: string;
@@ .. @@
                 <div className="flex flex-wrap gap-1 mb-4">
-                  {project.technologies.slice(0, 3).map((tech, index) => (
+                  {(Array.isArray(project.technologies) ? project.technologies : []).slice(0, 3).map((tech, index) => (
                     <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                       {tech}
                     </span>
                   ))}
-                  {project.technologies.length > 3 && (
-                    <span className="text-xs text-gray-500">+{project.technologies.length - 3}</span>
+                  {(Array.isArray(project.technologies) ? project.technologies : []).length > 3 && (
+                    <span className="text-xs text-gray-500">+{(Array.isArray(project.technologies) ? project.technologies : []).length - 3}</span>
                   )}
                 </div>

@@ .. @@
 const ProjectEditor: React.FC<ProjectEditorProps> = ({ project, onSave, onCancel, loading = false }) => {
   const [formData, setFormData] = useState<Partial<Project>>(project || {});
-  const [technologies, setTechnologies] = useState<string>(project?.technologies?.join(', ') || '');
-  const [imageUrls, setImageUrls] = useState<string>(project?.images?.join('\n') || '');
+  const [technologies, setTechnologies] = useState<string>(
+    Array.isArray(project?.technologies) ? project.technologies.join(', ') : (project?.technologies || '')
+  );
+  const [imageUrls, setImageUrls] = useState<string>(
+    Array.isArray(project?.images) ? project.images.join('\n') : (project?.images || '')
+  );

   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     onSave({
       ...formData,
-      technologies: technologies.split(',').map(tech => tech.trim()).filter(Boolean),
-      images: imageUrls.split('\n').map(url => url.trim()).filter(Boolean)
+      technologies: JSON.stringify(technologies.split(',').map(tech => tech.trim()).filter(Boolean)),
+      images: JSON.stringify(imageUrls.split('\n').map(url => url.trim()).filter(Boolean))
     });
   };