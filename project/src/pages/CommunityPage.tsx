import React, { useState } from 'react';
import { Users, Calendar, MapPin, Plus, MessageCircle, Heart, Share2 } from 'lucide-react';
import { Event } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type TabKey = 'events' | 'posts' | 'groups';

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('events');
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Mock events data
  const events: Event[] = [
    {
      id: '1',
      title: 'Limpieza de Playa Costanera Sur',
      description: 'Únete a nosotros para limpiar la costa y proteger la vida marina. Traeremos todos los materiales necesarios.',
      date: new Date(2024, 1, 15, 9, 0),
      location: 'Playa dulce',
      organizer: 'EcoVoluntarios BA',
      type: 'local',
      attendees: ['user1', 'user2', 'user3']
    },
    {
      id: '2',
      title: 'Webinar: Energías Renovables en el Hogar',
      description: 'Aprende cómo implementar soluciones de energía solar y eólica en tu hogar con expertos del sector.',
      date: new Date(2024, 1, 20, 19, 0),
      location: 'Virtual - Zoom',
      organizer: 'GreenTech ',
      type: 'virtual',
      attendees: ['user1', 'user4', 'user5']
    },
    {
      id: '3',
      title: 'Plantación de Árboles en Reserva Ecológica',
      description: 'Ayúdanos a reforestar la reserva ecológica. Una actividad perfecta para toda la familia.',
      date: new Date(2024, 1, 25, 8, 30),
      location: 'Reserva Ecológica ',
      organizer: 'Fundación Verde',
      type: 'local',
      attendees: ['user2', 'user3', 'user6']
    }
  ];

  const communityPosts = [
    {
      id: '1',
      author: 'María González',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop&crop=face',
      content: '¡Increíble jornada de reciclaje en el barrio! Logramos recolectar más de 200kg de materiales reciclables. 🌱♻️',
      timestamp: new Date(2024, 0, 10, 14, 30),
      likes: 24,
      comments: 8,
      image: 'https://images.pexels.com/photos/3850512/pexels-photo-3850512.jpeg?w=400&h=300&fit=crop'
    },
    {
      id: '2',
      author: 'Carlos Mendoza',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop&crop=face',
      content: 'Compartiendo mi huerto urbano después de 6 meses. ¡Los tomates están increíbles! ¿Alguien más cultiva en casa?',
      timestamp: new Date(2024, 0, 8, 16, 45),
      likes: 31,
      comments: 12,
      image: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?w=400&h=300&fit=crop'
    }
  ];

  const groups = [
    {
      id: '1',
      name: 'EcoVoluntarios',
      description: 'Grupo dedicado a actividades de voluntariado ambiental en la ciudad',
      members: 156,
      image: 'https://images.pexels.com/photos/2990644/pexels-photo-2990644.jpeg?w=300&h=200&fit=crop'
    },
    {
      id: '2',
      name: 'Huertos Urbanos  Sostenibles',
      description: 'Comunidad de personas interesadas en la agricultura urbana y sostenible',
      members: 89,
      image: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?w=300&h=200&fit=crop'
    },
    {
      id: '3',
      name: 'Energía Renovable Hogareña',
      description: 'Intercambio de experiencias sobre implementación de energías limpias en el hogar',
      members: 203,
      image: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?w=300&h=200&fit=crop'
    }
  ];

  const CreateEventForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Crear Evento</h3>
          <button
            onClick={() => setShowCreateEvent(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título del Evento
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Ej: Limpieza de parque local"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Describe el evento..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hora
              </label>
              <input
                type="time"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ubicación
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Dirección o 'Virtual'"
            />
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setShowCreateEvent(false)}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Crear Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const CreatePostForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Crear Publicación</h3>
          <button
            onClick={() => setShowCreatePost(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ¿Qué quieres compartir?
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Comparte tu experiencia ambiental..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Imagen (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setShowCreatePost(false)}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Publicar
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
          <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Comunidad Verde</h1>
        <p className="text-gray-600 dark:text-gray-400">Conecta, colabora y crea impacto ambiental juntos</p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { key: 'events', label: 'Eventos', icon: Calendar },
            { key: 'posts', label: 'Publicaciones', icon: MessageCircle },
            { key: 'groups', label: 'Grupos', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Events Tab */}
          {activeTab === 'events' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Próximos Eventos</h2>
                <button
                  onClick={() => setShowCreateEvent(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Crear Evento</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map(event => (
                  <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{event.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.type === 'virtual' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {event.type === 'virtual' ? 'Virtual' : 'Presencial'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        {format(event.date, 'PPP p', { locale: es })}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4 mr-2" />
                        {event.attendees.length} participantes
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Por {event.organizer}
                      </span>
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors">
                        Unirse
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Publicaciones de la Comunidad</h2>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Publicar</span>
                </button>
              </div>

              <div className="space-y-6">
                {communityPosts.map(post => (
                  <div key={post.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{post.author}</h4>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">•</span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            {format(post.timestamp, 'PPp', { locale: es })}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
                      </div>
                    </div>

                    {post.image && (
                      <div className="mb-4">
                        <img
                          src={post.image}
                          alt="Post content"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400">
                      <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                        <Heart className="h-5 w-5" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                        <MessageCircle className="h-5 w-5" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
                        <Share2 className="h-5 w-5" />
                        <span>Compartir</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Grupos de la Comunidad</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Crear Grupo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map(group => (
                  <div key={group.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={group.image}
                      alt={group.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{group.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{group.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {group.members} miembros
                        </span>
                        <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">
                          Unirse
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateEvent && <CreateEventForm />}
      {showCreatePost && <CreatePostForm />}
    </div>
  );
};

export default CommunityPage;