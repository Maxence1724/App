import { db, parseJsonField, stringifyJsonField, BlogPost, Project, ContactMessage } from './database';

// Check if SQLite is available
export const isSQLiteAvailable = () => true;

// Blog Post Operations
export const blogService = {
  // Get all blog posts with optional filtering
  async getAllPosts(filters?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = 'SELECT * FROM blog_posts ORDER BY published_at DESC';
      const params: any[] = [];

      if (filters?.category) {
        query = 'SELECT * FROM blog_posts WHERE category = ? ORDER BY published_at DESC';
        params.push(filters.category);
      }

      if (filters?.featured !== undefined) {
        const whereClause = filters.category ? ' AND featured = ?' : ' WHERE featured = ?';
        query = query.replace(' ORDER BY', whereClause + ' ORDER BY');
        params.push(filters.featured ? 1 : 0);
      }

      if (filters?.limit) {
        query += ' LIMIT ?';
        params.push(filters.limit);
      }

      if (filters?.offset) {
        query += ' OFFSET ?';
        params.push(filters.offset);
      }

      const stmt = db.prepare(query);
      const rows = stmt.all(...params) as BlogPost[];
      
      // Parse JSON fields
      const data = rows.map(row => ({
        ...row,
        tags: parseJsonField(row.tags),
        featured: Boolean(row.featured)
      }));

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return { data: null, error };
    }
  },

  // Get a single blog post by slug
  async getPostBySlug(slug: string) {
    try {
      const stmt = db.prepare('SELECT * FROM blog_posts WHERE slug = ?');
      const row = stmt.get(slug) as BlogPost | undefined;

      if (!row) {
        return { data: null, error: new Error('Post not found') };
      }

      const data = {
        ...row,
        tags: parseJsonField(row.tags),
        featured: Boolean(row.featured)
      };

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return { data: null, error };
    }
  },

  // Create a new blog post
  async createPost(post: Omit<BlogPost, 'id' | 'created_at'>) {
    try {
      const stmt = db.prepare(`
        INSERT INTO blog_posts (
          title, slug, excerpt, content, author, published_at, updated_at,
          featured_image, tags, category, read_time, featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        post.title,
        post.slug,
        post.excerpt,
        post.content,
        post.author,
        post.published_at,
        post.updated_at,
        post.featured_image,
        stringifyJsonField(post.tags as any),
        post.category,
        post.read_time,
        post.featured ? 1 : 0
      );

      const newPost = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(result.lastInsertRowid) as BlogPost;
      const data = {
        ...newPost,
        tags: parseJsonField(newPost.tags),
        featured: Boolean(newPost.featured)
      };

      return { data, error: null };
    } catch (error) {
      console.error('Error creating blog post:', error);
      return { data: null, error };
    }
  },

  // Update a blog post
  async updatePost(id: string, updates: Partial<BlogPost>) {
    try {
      const fields = [];
      const values = [];

      Object.entries(updates).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'created_at') {
          fields.push(`${key} = ?`);
          if (key === 'tags') {
            values.push(stringifyJsonField(value as any));
          } else if (key === 'featured') {
            values.push(value ? 1 : 0);
          } else {
            values.push(value);
          }
        }
      });

      fields.push('updated_at = ?');
      values.push(new Date().toISOString());
      values.push(id);

      const stmt = db.prepare(`UPDATE blog_posts SET ${fields.join(', ')} WHERE id = ?`);
      stmt.run(...values);

      const updatedPost = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id) as BlogPost;
      const data = {
        ...updatedPost,
        tags: parseJsonField(updatedPost.tags),
        featured: Boolean(updatedPost.featured)
      };

      return { data, error: null };
    } catch (error) {
      console.error('Error updating blog post:', error);
      return { data: null, error };
    }
  },

  // Delete a blog post
  async deletePost(id: string) {
    try {
      const stmt = db.prepare('DELETE FROM blog_posts WHERE id = ?');
      stmt.run(id);
      return { error: null };
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return { error };
    }
  },

  // Search blog posts
  async searchPosts(query: string) {
    try {
      const stmt = db.prepare(`
        SELECT * FROM blog_posts 
        WHERE title LIKE ? OR excerpt LIKE ? OR content LIKE ?
        ORDER BY published_at DESC
      `);
      const searchTerm = `%${query}%`;
      const rows = stmt.all(searchTerm, searchTerm, searchTerm) as BlogPost[];
      
      const data = rows.map(row => ({
        ...row,
        tags: parseJsonField(row.tags),
        featured: Boolean(row.featured)
      }));

      return { data, error: null };
    } catch (error) {
      console.error('Error searching blog posts:', error);
      return { data: null, error };
    }
  },

  // Get featured posts
  async getFeaturedPosts(limit: number = 3) {
    try {
      const stmt = db.prepare('SELECT * FROM blog_posts WHERE featured = 1 ORDER BY published_at DESC LIMIT ?');
      const rows = stmt.all(limit) as BlogPost[];
      
      const data = rows.map(row => ({
        ...row,
        tags: parseJsonField(row.tags),
        featured: Boolean(row.featured)
      }));

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      return { data: null, error };
    }
  }
};

// Project Operations
export const projectService = {
  // Get all projects with optional filtering
  async getAllProjects(filters?: {
    category?: string;
    status?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = 'SELECT * FROM projects ORDER BY created_at DESC';
      const params: any[] = [];

      const conditions = [];
      if (filters?.category) {
        conditions.push('category = ?');
        params.push(filters.category);
      }
      if (filters?.status) {
        conditions.push('status = ?');
        params.push(filters.status);
      }
      if (filters?.featured !== undefined) {
        conditions.push('featured = ?');
        params.push(filters.featured ? 1 : 0);
      }

      if (conditions.length > 0) {
        query = query.replace('ORDER BY', `WHERE ${conditions.join(' AND ')} ORDER BY`);
      }

      if (filters?.limit) {
        query += ' LIMIT ?';
        params.push(filters.limit);
      }

      if (filters?.offset) {
        query += ' OFFSET ?';
        params.push(filters.offset);
      }

      const stmt = db.prepare(query);
      const rows = stmt.all(...params) as Project[];
      
      const data = rows.map(row => ({
        ...row,
        technologies: parseJsonField(row.technologies),
        images: parseJsonField(row.images),
        featured: Boolean(row.featured)
      }));

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching projects:', error);
      return { data: null, error };
    }
  },

  // Get a single project by ID
  async getProjectById(id: string) {
    try {
      const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
      const row = stmt.get(id) as Project | undefined;

      if (!row) {
        return { data: null, error: new Error('Project not found') };
      }

      const data = {
        ...row,
        technologies: parseJsonField(row.technologies),
        images: parseJsonField(row.images),
        featured: Boolean(row.featured)
      };

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching project:', error);
      return { data: null, error };
    }
  },

  // Create a new project
  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const stmt = db.prepare(`
        INSERT INTO projects (
          title, description, long_description, technologies, category, status,
          start_date, end_date, client, budget, images, featured, github_url, live_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        project.title,
        project.description,
        project.long_description,
        stringifyJsonField(project.technologies as any),
        project.category,
        project.status,
        project.start_date,
        project.end_date,
        project.client,
        project.budget,
        stringifyJsonField(project.images as any),
        project.featured ? 1 : 0,
        project.github_url,
        project.live_url
      );

      const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid) as Project;
      const data = {
        ...newProject,
        technologies: parseJsonField(newProject.technologies),
        images: parseJsonField(newProject.images),
        featured: Boolean(newProject.featured)
      };

      return { data, error: null };
    } catch (error) {
      console.error('Error creating project:', error);
      return { data: null, error };
    }
  },

  // Update a project
  async updateProject(id: string, updates: Partial<Project>) {
    try {
      const fields = [];
      const values = [];

      Object.entries(updates).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'created_at') {
          fields.push(`${key} = ?`);
          if (key === 'technologies' || key === 'images') {
            values.push(stringifyJsonField(value as any));
          } else if (key === 'featured') {
            values.push(value ? 1 : 0);
          } else {
            values.push(value);
          }
        }
      });

      fields.push('updated_at = ?');
      values.push(new Date().toISOString());
      values.push(id);

      const stmt = db.prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`);
      stmt.run(...values);

      const updatedProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Project;
      const data = {
        ...updatedProject,
        technologies: parseJsonField(updatedProject.technologies),
        images: parseJsonField(updatedProject.images),
        featured: Boolean(updatedProject.featured)
      };

      return { data, error: null };
    } catch (error) {
      console.error('Error updating project:', error);
      return { data: null, error };
    }
  },

  // Delete a project
  async deleteProject(id: string) {
    try {
      const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
      stmt.run(id);
      return { error: null };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { error };
    }
  },

  // Get featured projects
  async getFeaturedProjects(limit: number = 6) {
    try {
      const stmt = db.prepare('SELECT * FROM projects WHERE featured = 1 ORDER BY created_at DESC LIMIT ?');
      const rows = stmt.all(limit) as Project[];
      
      const data = rows.map(row => ({
        ...row,
        technologies: parseJsonField(row.technologies),
        images: parseJsonField(row.images),
        featured: Boolean(row.featured)
      }));

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      return { data: null, error };
    }
  }
};

// Contact Message Operations
export const contactService = {
  // Submit a new contact message
  async submitMessage(messageData: Omit<ContactMessage, 'id' | 'is_read' | 'created_at' | 'updated_at'>) {
    try {
      const stmt = db.prepare(`
        INSERT INTO contact_messages (name, email, subject, message, budget, timeline)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        messageData.name,
        messageData.email,
        messageData.subject,
        messageData.message,
        messageData.budget,
        messageData.timeline
      );

      const newMessage = db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(result.lastInsertRowid) as ContactMessage;
      const data = {
        ...newMessage,
        is_read: Boolean(newMessage.is_read)
      };

      return { data, error: null };
    } catch (error) {
      console.error('Error submitting contact message:', error);
      return { data: null, error };
    }
  },

  // Get all contact messages
  async getAllMessages(filters?: {
    is_read?: boolean;
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = 'SELECT * FROM contact_messages ORDER BY created_at DESC';
      const params: any[] = [];

      if (filters?.is_read !== undefined) {
        query = 'SELECT * FROM contact_messages WHERE is_read = ? ORDER BY created_at DESC';
        params.push(filters.is_read ? 1 : 0);
      }

      if (filters?.limit) {
        query += ' LIMIT ?';
        params.push(filters.limit);
      }

      if (filters?.offset) {
        query += ' OFFSET ?';
        params.push(filters.offset);
      }

      const stmt = db.prepare(query);
      const rows = stmt.all(...params) as ContactMessage[];
      
      const data = rows.map(row => ({
        ...row,
        is_read: Boolean(row.is_read)
      }));

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      return { data: null, error };
    }
  },

  // Mark message as read/unread
  async updateMessageStatus(id: string, is_read: boolean) {
    try {
      const stmt = db.prepare('UPDATE contact_messages SET is_read = ?, updated_at = ? WHERE id = ?');
      stmt.run(is_read ? 1 : 0, new Date().toISOString(), id);

      const updatedMessage = db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(id) as ContactMessage;
      const data = {
        ...updatedMessage,
        is_read: Boolean(updatedMessage.is_read)
      };

      return { data, error: null };
    } catch (error) {
      console.error('Error updating message status:', error);
      return { data: null, error };
    }
  },

  // Delete a contact message
  async deleteMessage(id: string) {
    try {
      const stmt = db.prepare('DELETE FROM contact_messages WHERE id = ?');
      stmt.run(id);
      return { error: null };
    } catch (error) {
      console.error('Error deleting contact message:', error);
      return { error };
    }
  },

  // Get unread messages count
  async getUnreadCount() {
    try {
      const stmt = db.prepare('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0');
      const result = stmt.get() as { count: number };
      return { count: result.count, error: null };
    } catch (error) {
      console.error('Error getting unread count:', error);
      return { count: 0, error };
    }
  }
};

// Utility functions
export const utils = {
  // Generate a slug from a title
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },

  // Calculate reading time
  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  },

  // Format date
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};