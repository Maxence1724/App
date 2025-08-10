import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Calendar, Clock, User, BookOpen, Sparkles } from 'lucide-react';
import { useBlogPosts } from '../hooks/useSupabase';
import { isSQLiteAvailable } from '../lib/sqlite';

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
    console.log('BlogSection - SQLite available:', isSQLiteAvailable());
  }, [featuredPosts, loading, error]);

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {(Array.isArray(post.tags) ? post.tags : []).slice(0, 3).map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>