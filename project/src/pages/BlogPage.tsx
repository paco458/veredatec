import React, { useState } from 'react';
import { BookOpen, Search, Tag, Calendar, User, ArrowRight, Plus } from 'lucide-react';
import { BlogPost } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock blog posts
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'La Revolución de la Energía Solar en Latinoamérica',
      content: 'La energía solar está transformando el panorama energético de la región. Países como Chile y México lideran la adopción de tecnologías solares...',
      author: 'María González',
      publishDate: new Date(2024, 0, 15),
      tags: ['energía-renovable', 'solar', 'latinoamérica'],
      imageUrl: 'https://images.pexels.com/photos/9875436/pexels-photo-9875436.jpeg'
    },
    {
      id: '2',
      title: 'Cómo Reducir Residuos Plásticos en el Hogar',
      content: 'Pequeños cambios en nuestros hábitos diarios pueden generar un gran impacto. Descubre estrategias prácticas para minimizar el uso de plásticos...',
      author: 'Carlos Mendoza',
      publishDate: new Date(2024, 0, 12),
      tags: ['residuos', 'plástico', 'hogar', 'sostenibilidad'],
      imageUrl: 'https://images.pexels.com/photos/3850512/pexels-photo-3850512.jpeg'
    },
    {
      id: '3',
      title: 'Agricultura Urbana: Cultivando en la Ciudad',
      content: 'Los huertos urbanos no solo proporcionan alimentos frescos, sino que también mejoran la calidad del aire y crean espacios comunitarios...',
      author: 'Ana Rodríguez',
      publishDate: new Date(2024, 0, 10),
      tags: ['agricultura-urbana', 'alimentación', 'comunidad'],
      imageUrl: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg'
    },
    {
      id: '4',
      title: 'Transporte Sostenible: El Futuro de la Movilidad',
      content: 'Desde bicicletas eléctricas hasta transporte público eficiente, exploramos las alternativas que están cambiando nuestras ciudades...',
      author: 'Diego Torres',
      publishDate: new Date(2024, 0, 8),
      tags: ['transporte', 'movilidad', 'ciudades'],
      imageUrl: 'https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg'
    },
    {
      id: '5',
      title: 'Biodiversidad: Protegiendo Nuestros Ecosistemas',
      content: 'La conservación de la biodiversidad es crucial para mantener el equilibrio ecológico. Conoce los esfuerzos de conservación más importantes...',
      author: 'Lucía Herrera',
      publishDate: new Date(2024, 0, 5),
      tags: ['biodiversidad', 'conservación', 'ecosistemas'],
      imageUrl: 'https://images.pexels.com/photos/3127880/pexels-photo-3127880.jpeg'
    }
  ];

  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const CreatePostForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Crear Nuevo Artículo</h3>
          <button
            onClick={() => setShowCreateForm(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título del Artículo
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Escribe un título llamativo..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contenido
            </label>
            <textarea
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Comparte tu conocimiento sobre sostenibilidad..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Etiquetas (separadas por comas)
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="sostenibilidad, medio-ambiente, consejos"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Publicar Artículo
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
          <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Blog Verde</h1>
        <p className="text-gray-600 dark:text-gray-400">Noticias, consejos y soluciones para un mundo más sostenible</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar artículos..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          {/* Create Post Button */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Crear Artículo</span>
          </button>
        </div>

        {/* Tags Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedTag
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Todos
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredPosts.map((post) => (
          <article key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Featured Image */}
            {post.imageUrl && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <div className="p-6">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {post.content}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(post.publishDate, 'PPP', { locale: es })}</span>
                </div>
              </div>

              {/* Read More */}
              <button className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors">
                Leer más
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* No Results */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No se encontraron artículos</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Intenta con otros términos de búsqueda o etiquetas diferentes.
          </p>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateForm && <CreatePostForm />}
    </div>
  );
};

export default BlogPage;