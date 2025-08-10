@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, Tag, FileText, Save, X } from 'lucide-react';
-import { supabase, blogService, utils } from '../../lib/supabase';
+import { blogService, utils } from '../../lib/sqlite';
 import RichTextEditor from './RichTextEditor';

 interface BlogPost {
@@ .. @@
   featured_image: string;
-  tags: string[];
+  tags: string;
   category: string;
   read_time: number;
   featured: boolean;
@@ .. @@
   const handleSave = async (postData: Partial<BlogPost>) => {
     try {
       setLoading(true);
       
       // Generate slug if not provided
       if (!postData.slug && postData.title) {
         postData.slug = utils.generateSlug(postData.title);
       }
       
       // Calculate reading time if content is provided
       if (postData.content) {
         postData.read_time = utils.calculateReadingTime(postData.content);
       }

       let result;
       if (postData.id) {
         // Update existing post
         result = await blogService.updatePost(postData.id, postData);
       } else {
         // Create new post
         result = await blogService.createPost(postData as Omit<BlogPost, 'id' | 'created_at'>);
       }

       if (result.error) throw result.error;

       setIsEditing(false);
       setEditingPost(null);
       await fetchPosts(); // Refresh the list
     } catch (err) {
       setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
       console.error('Error saving post:', err);
     } finally {
       setLoading(false);
     }
   };

@@ .. @@
                           <div className="flex items-center gap-2 mt-1">
                             {post.featured && (
                               <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                 Featured
                               </span>
                             )}
                             <span className="text-xs text-gray-500">{post.read_time} min</span>
                           </div>
                         </div>
@@ .. @@
 const BlogEditor: React.FC<BlogEditorProps> = ({ post, onSave, onCancel, loading = false }) => {
   const [formData, setFormData] = useState<Partial<BlogPost>>(post || {});
-  const [tags, setTags] = useState<string>(post?.tags?.join(', ') || '');
+  const [tags, setTags] = useState<string>(
+    Array.isArray(post?.tags) ? post.tags.join(', ') : (post?.tags || '')
+  );

   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     onSave({
       ...formData,
-      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
+      tags: JSON.stringify(tags.split(',').map(tag => tag.trim()).filter(Boolean))
     });
   };