import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  BookOpen, 
  MapPin, 
  Users, 
  FileText, 
  BarChart3,
  Leaf,
  Award,
  Target,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { User } = useAuth();

  const stats = [
    { label: 'Tu Huella de Carbono', value: '2.4 ton CO₂', change: '-12%', positive: true },
    { label: 'Días Activo', value: '45', change: '+15%', positive: true },
    { label: 'Recursos Compartidos', value: '8', change: '+3', positive: true },
    { label: 'Eventos Participados', value: '12', change: '+4', positive: true },
  ];

  const quickActions = [
    {
      title: 'Calcular Huella Ecológica',
      description: 'Evalúa tu impacto ambiental',
      icon: Calculator,
      href: '/footprint',
      color: 'bg-green-500'
    },
    {
      title: 'Leer Blog Verde',
      description: 'Últimas noticias ambientales',
      icon: BookOpen,
      href: '/blog',
      color: 'bg-blue-500'
    },
    {
      title: 'Explorar Recursos',
      description: 'Encuentra puntos verdes cerca',
      icon: MapPin,
      href: '/resources',
      color: 'bg-purple-500'
    },
    {
      title: 'Únete a la Comunidad',
      description: 'Conecta con otros activistas',
      icon: Users,
      href: '/community',
      color: 'bg-orange-500'
    },
    {
      title: 'Gestionar Archivos',
      description: 'Organiza tus documentos',
      icon: FileText,
      href: '/files',
      color: 'bg-teal-500'
    },
    {
      title: 'Ver Estadísticas',
      description: 'Analiza tu progreso',
      icon: BarChart3,
      href: '/stats',
      color: 'bg-indigo-500'
    },
  ];

  const recentTips = [
    {
      title: 'Reduce el uso de plástico',
      description: 'Usa bolsas reutilizables para las compras',
      impact: 'Alto impacto'
    },
    {
      title: 'Ahorra energía en casa',
      description: 'Desconecta dispositivos que no uses',
      impact: 'Medio impacto'
    },
    {
      title: 'Usa transporte público',
      description: 'Reduce tu huella de carbono diaria',
      impact: 'Alto impacto'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">¡Hola, Muchas gracias por aportar al cambio!</h1>
            <p className="text-green-100 text-lg">
              Bienvenido a tu dashboard ambiental. Juntos construimos un futuro más sostenible.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Leaf className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`flex items-center text-sm font-medium ${
                stat.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="h-4 w-4 mr-1" />
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{action.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Environmental Tips */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Consejos Personalizados</h3>
            <Target className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {recentTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{tip.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tip.description}</p>
                  <span className={`inline-block text-xs px-2 py-1 rounded-full mt-2 ${
                    tip.impact === 'Alto impacto' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {tip.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Actividad Reciente</h3>
            <Award className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <Calculator className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Calculaste tu huella de carbono</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hace 2 días</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Leíste un artículo sobre energía solar</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hace 4 días</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Te uniste a un evento de limpieza</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hace 1 semana</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;