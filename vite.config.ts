@@ .. @@
 import { defineConfig } from 'vite';
 import react from '@vitejs/plugin-react';

 // https://vitejs.dev/config/
 export default defineConfig({
   plugins: [react()],
+  define: {
+    global: 'globalThis',
+  },
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           vendor: ['react', 'react-dom'],
           icons: ['lucide-react'],
-          supabase: ['@supabase/supabase-js']
+          sqlite: ['better-sqlite3']
         }
       }
     },
     chunkSizeWarningLimit: 1000
   },
   optimizeDeps: {
     exclude: ['lucide-react'],
     include: ['react', 'react-dom']
   },
   server: {
     hmr: {
       overlay: false
     }
   }
 });