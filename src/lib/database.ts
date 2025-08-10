import Database from 'better-sqlite3';
import path from 'path';

// Database Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  updated_at?: string;
  featured_image: string;
  tags: string;
  category: string;
  read_time: number;
  featured: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  long_description: string;
  technologies: string;
  category: string;
  status: 'in-progress' | 'completed' | 'archived';
  start_date: string;
  end_date?: string;
  client?: string;
  budget?: string;
  images: string;
  featured: boolean;
  github_url?: string;
  live_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  budget?: string;
  timeline?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

// Initialize SQLite database
const dbPath = path.join(process.cwd(), 'portfolio.db');
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
export const initializeDatabase = () => {
  // Create blog_posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT 'FOULON Maxence',
      published_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT,
      featured_image TEXT,
      tags TEXT DEFAULT '[]',
      category TEXT NOT NULL,
      read_time INTEGER DEFAULT 5,
      featured BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Create projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      long_description TEXT,
      technologies TEXT DEFAULT '[]',
      category TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('in-progress', 'completed', 'archived')),
      start_date TEXT NOT NULL,
      end_date TEXT,
      client TEXT,
      budget TEXT,
      images TEXT DEFAULT '[]',
      featured BOOLEAN DEFAULT 0,
      github_url TEXT,
      live_url TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Create contact_messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      budget TEXT,
      timeline TEXT,
      is_read BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
    
    CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
    CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
    CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
    
    CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
    CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read);
  `);

  // Insert sample data if tables are empty
  const blogCount = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get() as { count: number };
  if (blogCount.count === 0) {
    insertSampleBlogPosts();
  }

  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
  if (projectCount.count === 0) {
    insertSampleProjects();
  }
};

// Helper functions to parse JSON fields
export const parseJsonField = (field: string | null): any[] => {
  if (!field) return [];
  try {
    return JSON.parse(field);
  } catch {
    return [];
  }
};

export const stringifyJsonField = (field: any[]): string => {
  return JSON.stringify(field || []);
};

// Insert sample blog posts
const insertSampleBlogPosts = () => {
  const insertBlogPost = db.prepare(`
    INSERT INTO blog_posts (
      title, slug, excerpt, content, author, published_at, featured_image, 
      tags, category, read_time, featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const samplePosts = [
    {
      title: "L'avenir du Design UI/UX : Tendances 2024",
      slug: 'avenir-design-ui-ux-tendances-2024',
      excerpt: 'Découvrez les tendances qui façonnent l\'avenir du design d\'interface et d\'expérience utilisateur en 2024. De l\'IA générative aux interfaces immersives.',
      content: '<p>Le monde du design UI/UX évolue à une vitesse fulgurante. En 2024, nous assistons à une révolution silencieuse qui redéfinit notre approche de la création d\'interfaces digitales.</p><h2>L\'Intelligence Artificielle au Service du Design</h2><p>L\'IA générative transforme radicalement notre processus créatif. Des outils comme Midjourney et DALL-E permettent aux designers de générer des concepts visuels en quelques secondes, libérant ainsi du temps pour se concentrer sur la stratégie et l\'expérience utilisateur.</p>',
      author: 'FOULON Maxence',
      published_at: '2024-01-15 10:00:00',
      featured_image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
      tags: JSON.stringify(['UI/UX', 'Tendances', 'IA', 'Design']),
      category: 'Design',
      read_time: 5,
      featured: 1
    },
    {
      title: 'Design System : Créer une Cohérence Visuelle',
      slug: 'design-system-coherence-visuelle',
      excerpt: 'Comment construire un design system robuste qui garantit la cohérence visuelle et améliore l\'efficacité des équipes de développement.',
      content: '<p>Un design system bien conçu est la colonne vertébrale de tout produit digital réussi. Il garantit la cohérence, améliore l\'efficacité et facilite la collaboration entre designers et développeurs.</p>',
      author: 'FOULON Maxence',
      published_at: '2024-01-08 14:30:00',
      featured_image: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg',
      tags: JSON.stringify(['Design System', 'Composants', 'Documentation']),
      category: 'Méthodologie',
      read_time: 4,
      featured: 0
    },
    {
      title: 'UX Research : Comprendre ses Utilisateurs',
      slug: 'ux-research-comprendre-utilisateurs',
      excerpt: 'Les méthodes essentielles de recherche utilisateur pour créer des produits qui répondent vraiment aux besoins de votre audience.',
      content: '<p>La recherche utilisateur est le fondement de tout bon design UX. Sans comprendre ses utilisateurs, on ne peut créer des expériences véritablement utiles et engageantes.</p>',
      author: 'FOULON Maxence',
      published_at: '2024-01-01 09:15:00',
      featured_image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
      tags: JSON.stringify(['UX Research', 'Utilisateurs', 'Tests']),
      category: 'Research',
      read_time: 6,
      featured: 1
    }
  ];

  samplePosts.forEach(post => {
    insertBlogPost.run(
      post.title, post.slug, post.excerpt, post.content, post.author,
      post.published_at, post.featured_image, post.tags, post.category,
      post.read_time, post.featured
    );
  });
};

// Insert sample projects
const insertSampleProjects = () => {
  const insertProject = db.prepare(`
    INSERT INTO projects (
      title, description, long_description, technologies, category, status,
      start_date, end_date, client, budget, images, featured, github_url, live_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const sampleProjects = [
    {
      title: 'FinTech Mobile Revolution',
      description: 'Application bancaire mobile révolutionnaire avec IA intégrée',
      long_description: 'Révolution complète de l\'expérience bancaire mobile avec intelligence artificielle intégrée, interface ultra-intuitive et sécurité quantique.',
      technologies: JSON.stringify(['React Native', 'TypeScript', 'Node.js', 'MongoDB', 'AI/ML', 'Blockchain']),
      category: 'mobile',
      status: 'completed',
      start_date: '2023-06-01',
      end_date: '2024-01-15',
      client: 'FinTech Corp',
      budget: '50k-100k €',
      images: JSON.stringify(['https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg']),
      featured: 1,
      github_url: 'https://github.com/example/fintech-app',
      live_url: 'https://fintech-demo.example.com'
    },
    {
      title: 'Neural Analytics Dashboard',
      description: 'Dashboard d\'analyse prédictive avec visualisations temps réel',
      long_description: 'Plateforme d\'analyse avancée utilisant l\'intelligence artificielle pour fournir des insights prédictifs en temps réel.',
      technologies: JSON.stringify(['React', 'D3.js', 'Python', 'TensorFlow', 'PostgreSQL', 'Docker']),
      category: 'web',
      status: 'completed',
      start_date: '2023-09-01',
      end_date: '2024-02-28',
      client: 'Analytics Inc',
      budget: '30k-50k €',
      images: JSON.stringify(['https://images.pexels.com/photos/590020/pexels-photo-590020.jpg']),
      featured: 0,
      github_url: 'https://github.com/example/analytics-dashboard',
      live_url: 'https://analytics-demo.example.com'
    }
  ];

  sampleProjects.forEach(project => {
    insertProject.run(
      project.title, project.description, project.long_description,
      project.technologies, project.category, project.status,
      project.start_date, project.end_date, project.client, project.budget,
      project.images, project.featured, project.github_url, project.live_url
    );
  });
};

// Initialize database on import
initializeDatabase();