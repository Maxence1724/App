import { ExternalLink, Github, Eye, Calendar, Code, Layers, Zap, Star, Filter, Search, ArrowRight, Home } from 'lucide-react';
import { useProjects } from '../hooks/useSupabase';
import { Project as SQLiteProject } from '../lib/database';
import Navigation from './Navigation';

// Convert SQLite project to display format
const convertSQLiteProject = (project: SQLiteProject, index: number) => {
  const gradients = [
    'from-blue-600 via-purple-600 to-pink-600',
    'from-emerald-500 via-teal-500 to-cyan-600',
    'from-orange-500 via-red-500 to-pink-600',
    'from-purple-600 via-blue-600 to-cyan-600',
    'from-green-500 via-emerald-500 to-teal-600',
    'from-pink-500 via-purple-500 to-indigo-600'
  ];

  const bgGradients = [
    'from-blue-50 to-purple-50',
    'from-emerald-50 to-teal-50',
    'from-orange-50 to-red-50',
    'from-purple-50 to-blue-50',
    'from-green-50 to-emerald-50',
    'from-pink-50 to-purple-50'
  ];

  const typeLabels = {
    'web': 'Application Web',
    'mobile': 'Application Mobile',
    'desktop': 'Application Desktop',
    'api': 'API/Backend',
    'library': 'Bibliothèque',
    'tool': 'Outil',
    'game': 'Jeu',
    'other': 'Autre'
  };

  return {
    id: project.id,
    title: project.title,
    type: typeLabels[project.category as keyof typeof typeLabels] || 'Projet',
    description: project.long_description || project.description,
    image: project.images[0] || 'https://via.placeholder.com/400x300',
    tags: (Array.isArray(project.technologies) ? project.technologies : []).slice(0, 4),
    gradient: gradients[index % gradients.length],
    bgGradient: bgGradients[index % bgGradients.length],
    github: project.github_url,
    demo: project.demo_url,
    featured: project.featured,
    category: project.category,
    date: project.created_at
  };
};

interface ProjectsPageProps {
  onNavigateHome: () => void;
  onNavigateToBlog: () => void;
  onNavigateToProject: (projectId: string) => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigateHome, onNavigateToBlog, onNavigateToProject }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch projects from SQLite
  const { projects: sqliteProjects, loading, error } = useProjects();
  
  // Convert SQLite projects to display format
  const projects = React.useMemo(() => {
    return sqliteProjects.map(convertSQLiteProject);
  }, [sqliteProjects]);

  const categories = [
    { id: 'all', label: 'Tous les projets', icon: Layers },
    { id: 'web', label: 'Web', icon: Code },
    { id: 'mobile', label: 'Mobile', icon: Zap },
    { id: 'desktop', label: 'Desktop', icon: Code },
    { id: 'api', label: 'API/Backend', icon: Layers },
    { id: 'library', label: 'Bibliothèque', icon: Code },
    { id: 'tool', label: 'Outil', icon: Zap },
    { id: 'game', label: 'Jeu', icon: Star },
    { id: 'other', label: 'Autre', icon: Layers }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredProjects = filteredProjects.filter(project => project.featured);
  const regularProjects = filteredProjects.filter(project => !project.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation onNavigateHome={onNavigateHome} onNavigateToBlog={onNavigateToBlog} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des projets...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation onNavigateHome={onNavigateHome} onNavigateToBlog={onNavigateToBlog} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Erreur lors du chargement des projets</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation onNavigateHome={onNavigateHome} onNavigateToBlog={onNavigateToBlog} />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Mes <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Projets</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Découvrez mes créations, des applications web aux outils innovants, 
              chaque projet raconte une histoire de passion et d'innovation.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white mb-1">{sqliteProjects.length}</div>
                <div className="text-sm text-white/80">Projets</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white mb-1">{categories.length - 1}</div>
                <div className="text-sm text-white/80">Catégories</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white mb-1">{sqliteProjects.filter(p => p.featured).length}</div>
                <div className="text-sm text-white/80">Featured</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white/50 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              />
            </div>

            {/* Category Filter - Mobile Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl hover:bg-white transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filtres
              </button>
            </div>

            {/* Category Filter - Desktop */}
            <div className="hidden lg:flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Filter Menu */}
          {isFilterOpen && (
            <div className="lg:hidden mt-4 p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setIsFilterOpen(false);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <Star className="w-6 h-6 text-yellow-500" />
                <h2 className="text-3xl font-bold text-gray-900">Projets Mis en Avant</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} onNavigateToProject={onNavigateToProject} featured />
                ))}
              </div>
            </div>
          )}

          {/* Regular Projects */}
          {regularProjects.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {featuredProjects.length > 0 ? 'Autres Projets' : 'Tous les Projets'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} onNavigateToProject={onNavigateToProject} />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun projet trouvé</h3>
                <p className="text-gray-600 mb-6">
                  Essayez de modifier vos critères de recherche ou de sélectionner une autre catégorie.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    type: string;
    description: string;
    image: string;
    tags: string[];
    gradient: string;
    bgGradient: string;
    github?: string;
    demo?: string;
    date: string;
  };
  onNavigateToProject: (projectId: string) => void;
  featured?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onNavigateToProject, featured = false }) => {
  return (
    <div className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
      featured ? 'lg:col-span-1' : ''
    }`}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-90`}></div>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sm font-medium text-gray-900 rounded-full">
            {project.type}
          </span>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="w-4 h-4 text-gray-700" />
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4 text-gray-700" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {new Date(project.date).getFullYear()}
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onNavigateToProject(project.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 group-hover:shadow-lg"
        >
          <Eye className="w-4 h-4" />
          Voir le projet
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ProjectsPage;