import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, Leaf, Zap, Car, Trash2 } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Mock data for charts
  const carbonFootprintData = [
    { month: 'Ene', footprint: 2.8, target: 2.5 },
    { month: 'Feb', footprint: 2.6, target: 2.5 },
    { month: 'Mar', footprint: 2.4, target: 2.5 },
    { month: 'Abr', footprint: 2.3, target: 2.5 },
    { month: 'May', footprint: 2.1, target: 2.5 },
    { month: 'Jun', footprint: 2.0, target: 2.5 },
  ];

  const categoryBreakdown = [
    { name: 'Transporte', value: 35, color: '#3B82F6' },
    { name: 'Energía', value: 28, color: '#EF4444' },
    { name: 'Alimentación', value: 22, color: '#10B981' },
    { name: 'Residuos', value: 15, color: '#F59E0B' },
  ];

  const energyConsumption = [
    { month: 'Ene', consumption: 450, renewable: 120 },
    { month: 'Feb', consumption: 420, renewable: 140 },
    { month: 'Mar', consumption: 380, renewable: 160 },
    { month: 'Abr', consumption: 350, renewable: 180 },
    { month: 'May', consumption: 320, renewable: 200 },
    { month: 'Jun', consumption: 300, renewable: 220 },
  ];

  const weeklyActivities = [
    { day: 'Lun', recycling: 3, transport: 2, energy: 4 },
    { day: 'Mar', recycling: 2, transport: 3, energy: 3 },
    { day: 'Mié', recycling: 4, transport: 1, energy: 5 },
    { day: 'Jue', recycling: 3, transport: 2, energy: 4 },
    { day: 'Vie', recycling: 5, transport: 3, energy: 3 },
    { day: 'Sáb', recycling: 2, transport: 1, energy: 2 },
    { day: 'Dom', recycling: 1, transport: 1, energy: 3 },
  ];

  const achievements = [
    { title: 'Reductor de Carbono', description: 'Redujo su huella en 20%', icon: Leaf, color: 'bg-green-500', achieved: true },
    { title: 'Eco Guerrero', description: 'Participó en 10 eventos', icon: TrendingUp, color: 'bg-blue-500', achieved: true },
    { title: 'Energía Limpia', description: '50% energía renovable', icon: Zap, color: 'bg-yellow-500', achieved: false },
    { title: 'Transporte Verde', description: 'Uso transporte público 80%', icon: Car, color: 'bg-purple-500', achieved: true },
  ];

  const stats = [
    {
      title: 'Huella de Carbono',
      value: '2.0 ton CO₂',
      change: '-20%',
      trend: 'down',
      icon: Leaf,
      color: 'text-green-600'
    },
    {
      title: 'Energía Ahorrada',
      value: '150 kWh',
      change: '+15%',
      trend: 'up',
      icon: Zap,
      color: 'text-yellow-600'
    },
    {
      title: 'Residuos Reciclados',
      value: '45 kg',
      change: '+25%',
      trend: 'up',
      icon: Trash2,
      color: 'text-blue-600'
    },
    {
      title: 'Días Activos',
      value: '28',
      change: '+12%',
      trend: 'up',
      icon: Calendar,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Estadísticas Ambientales</h1>
          <p className="text-gray-600 dark:text-gray-400">Analiza tu progreso hacia la sostenibilidad</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-2">
          {(['week', 'month', 'year'] as Array<'week' | 'month' | 'year'>).map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {period === 'week' ? 'Semana' : period === 'month' ? 'Mes' : 'Año'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-opacity-10 ${stat.color.replace('text-', 'bg-')}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="h-4 w-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Carbon Footprint Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Evolución de Huella de Carbono</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={carbonFootprintData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="footprint" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Huella Actual"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#EF4444" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Meta"
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Distribución por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Energy Consumption */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Consumo de Energía</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={energyConsumption}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="consumption" 
                stackId="1"
                stroke="#EF4444" 
                fill="#EF4444"
                fillOpacity={0.6}
                name="Consumo Total"
              />
              <Area 
                type="monotone" 
                dataKey="renewable" 
                stackId="2"
                stroke="#10B981" 
                fill="#10B981"
                fillOpacity={0.8}
                name="Energía Renovable"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Actividades Semanales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyActivities}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Legend />
              <Bar dataKey="recycling" fill="#10B981" name="Reciclaje" />
              <Bar dataKey="transport" fill="#3B82F6" name="Transporte Verde" />
              <Bar dataKey="energy" fill="#F59E0B" name="Ahorro Energía" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Logros Ambientales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div 
                key={index} 
                className={`p-6 rounded-xl border-2 transition-all ${
                  achievement.achieved 
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${achievement.color} ${achievement.achieved ? 'opacity-100' : 'opacity-50'}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  {achievement.achieved && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
                <h4 className={`font-semibold mb-2 ${
                  achievement.achieved 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {achievement.title}
                </h4>
                <p className={`text-sm ${
                  achievement.achieved 
                    ? 'text-gray-600 dark:text-gray-300' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {achievement.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsPage;