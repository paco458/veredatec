import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Leaf, 
  Car, 
  Home, 
  Utensils, 
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
 
  TrendingUp,
  Target,
  Award,
  Zap,
 
  X,
  BarChart3,
  Plane,
  Bus,
  Thermometer,
  Apple,
  Recycle,
  ShoppingBag
} from 'lucide-react';
import { CarbonFootprintResult } from '../types';

const FootprintPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<CarbonFootprintResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState({
    transport: {
      carMiles: '',
      flightHours: '',
      publicTransport: ''
    },
    energy: {
      electricity: '',
      heating: '',
      renewable: null as boolean | null
    },
    food: {
      meat: '',
      local: '',
      organic: null as boolean | null
    },
    waste: {
      recycling: '',
      composting: null as boolean | null,
      plastic: ''
    }
  });

  const steps = [
    {
      title: 'Transporte',
      subtitle: 'Tu movilidad diaria',
      icon: Car,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      questions: [
        {
          key: 'carMiles',
          label: '¿Cuántos kilómetros manejas por semana?',
          type: 'number',
          unit: 'km',
          required: true,
          placeholder: 'Ej: 150',
          icon: Car
        },
        {
          key: 'flightHours',
          label: '¿Cuántas horas de vuelo tomas al año?',
          type: 'number',
          unit: 'horas',
          required: true,
          placeholder: 'Ej: 10',
          icon: Plane
        },
        {
          key: 'publicTransport',
          label: '¿Cuántas veces usas transporte público por semana?',
          type: 'number',
          unit: 'veces',
          required: true,
          placeholder: 'Ej: 5',
          icon: Bus
        }
      ]
    },
    {
      title: 'Energía en Casa',
      subtitle: 'Tu consumo energético',
      icon: Home,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      questions: [
        {
          key: 'electricity',
          label: '¿Cuál es tu consumo mensual de electricidad?',
          type: 'number',
          unit: 'kWh',
          required: true,
          placeholder: 'Ej: 300',
          icon: Zap
        },
        {
          key: 'heating',
          label: '¿Cuánto gastas en calefacción/AC al mes?',
          type: 'number',
          unit: 'USD',
          required: true,
          placeholder: 'Ej: 80',
          icon: Thermometer
        },
        {
          key: 'renewable',
          label: '¿Usas energías renovables en tu hogar?',
          type: 'boolean',
          required: true,
          icon: Leaf
        }
      ]
    },
    {
      title: 'Alimentación',
      subtitle: 'Tus hábitos alimentarios',
      icon: Utensils,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      questions: [
        {
          key: 'meat',
          label: '¿Cuántas veces comes carne por semana?',
          type: 'number',
          unit: 'veces',
          required: true,
          placeholder: 'Ej: 4',
          icon: Utensils
        },
        {
          key: 'local',
          label: '¿Qué porcentaje de tu comida es local?',
          type: 'number',
          unit: '%',
          required: true,
          placeholder: 'Ej: 60',
          icon: Apple
        },
        {
          key: 'organic',
          label: '¿Prefieres alimentos orgánicos?',
          type: 'boolean',
          required: true,
          icon: Leaf
        }
      ]
    },
    {
      title: 'Residuos',
      subtitle: 'Tu gestión de desechos',
      icon: Trash2,
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      questions: [
        {
          key: 'recycling',
          label: '¿Qué porcentaje de tus residuos reciclas?',
          type: 'number',
          unit: '%',
          required: true,
          placeholder: 'Ej: 70',
          icon: Recycle
        },
        {
          key: 'composting',
          label: '¿Haces compostaje en casa?',
          type: 'boolean',
          required: true,
          icon: Leaf
        },
        {
          key: 'plastic',
          label: '¿Cuántos productos de plástico de un solo uso usas por día?',
          type: 'number',
          unit: 'productos',
          required: true,
          placeholder: 'Ej: 3',
          icon: ShoppingBag
        }
      ]
    }
  ];

  const validateStep = (stepIndex: number) => {
    const stepKeys = ['transport', 'energy', 'food', 'waste'];
    const stepKey = stepKeys[stepIndex];
    const stepData = steps[stepIndex];
    const stepAnswers = answers[stepKey as keyof typeof answers];
    const newErrors: Record<string, string> = {};

    stepData.questions.forEach(question => {
      if (question.required) {
        const value = stepAnswers[question.key as keyof typeof stepAnswers];
        if (question.type === 'boolean') {
          if (value === null || value === undefined) {
            newErrors[question.key] = 'Este campo es obligatorio';
          }
        } else {
          if (!value || value === '') {
            newErrors[question.key] = 'Este campo es obligatorio';
          } else if (question.type === 'number') {
            const numValue = parseFloat(value as string);
            if (isNaN(numValue) || numValue < 0) {
              newErrors[question.key] = 'Ingresa un número válido mayor o igual a 0';
            }
            if (question.unit === '%' && numValue > 100) {
              newErrors[question.key] = 'El porcentaje no puede ser mayor a 100';
            }
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateFootprint = () => {
    const transport = (parseFloat(answers.transport.carMiles) * 0.2) + 
                     (parseFloat(answers.transport.flightHours) * 90) - 
                     (parseFloat(answers.transport.publicTransport) * 0.1);
    
    const energy = (parseFloat(answers.energy.electricity) * 0.5) + 
                   (parseFloat(answers.energy.heating) * 0.8) - 
                   (answers.energy.renewable ? 500 : 0);
    
    const food = (parseFloat(answers.food.meat) * 6.5) - 
                 (parseFloat(answers.food.local) * 0.02) - 
                 (answers.food.organic ? 100 : 0);
    
    const waste = (parseFloat(answers.waste.plastic) * 0.5) - 
                  (parseFloat(answers.waste.recycling) * 0.01) - 
                  (answers.waste.composting ? 50 : 0);

    const total = Math.max(0.5, (transport + energy + food + waste) / 1000);

    const tips = [];
    if (transport > 500) tips.push('Considera usar más transporte público o bicicleta para reducir emisiones');
    if (energy > 400) tips.push('Invierte en electrodomésticos eficientes y considera energía renovable');
    if (food > 300) tips.push('Reduce el consumo de carne y compra más productos locales');
    if (waste > 200) tips.push('Aumenta el reciclaje y reduce el uso de plásticos de un solo uso');
    
    if (tips.length === 0) {
      tips.push('¡Excelente! Mantén tus hábitos sostenibles');
      tips.push('Comparte tu experiencia con otros para inspirar el cambio');
      tips.push('Considera ser un embajador ambiental en tu comunidad');
    }

    setResult({
      total: Math.round(total * 10) / 10,
      categories: {
        transport: Math.max(0, Math.round(transport / 100 * 10) / 10),
        energy: Math.max(0, Math.round(energy / 100 * 10) / 10),
        food: Math.max(0, Math.round(food / 100 * 10) / 10),
        waste: Math.max(0, Math.round(waste / 100 * 10) / 10)
      },
      tips
    });
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        calculateFootprint();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleAnswer = (stepIndex: number, questionKey: string, value: string | number | boolean | null) => {
    const stepKeys = ['transport', 'energy', 'food', 'waste'];
    const stepKey = stepKeys[stepIndex];
    
    setAnswers(prev => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey as keyof typeof prev],
        [questionKey]: value
      }
    }));

    // Clear error for this field
    if (errors[questionKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionKey];
        return newErrors;
      });
    }
  };

  const resetCalculator = () => {
    setCurrentStep(0);
    setResult(null);
    setErrors({});
    setAnswers({
      transport: { carMiles: '', flightHours: '', publicTransport: '' },
      energy: { electricity: '', heating: '', renewable: null },
      food: { meat: '', local: '', organic: null },
      waste: { recycling: '', composting: null, plastic: '' }
    });
  };

  const getImpactLevel = (total: number) => {
    if (total < 2) return { level: 'Excelente', color: 'text-green-600', icon: Award };
    if (total < 4) return { level: 'Bueno', color: 'text-yellow-600', icon: Target };
    return { level: 'Mejorable', color: 'text-red-600', icon: TrendingUp };
  };

  // Category icons mapping
  const categoryIcons = {
    transport: Car,
    energy: Zap,
    food: Apple,
    waste: Recycle
  };

  const categoryNames = {
    transport: 'Transporte',
    energy: 'Energía',
    food: 'Alimentación',
    waste: 'Residuos'
  };

  const categoryColors = {
    transport: 'from-blue-500 to-cyan-600',
    energy: 'from-yellow-500 to-orange-600',
    food: 'from-green-500 to-emerald-600',
    waste: 'from-red-500 to-pink-600'
  };

  if (result) {
    const impact = getImpactLevel(result.total);
    const ImpactIcon = impact.icon;

    return (
      <div className="min-h-screen  from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4"
            >
              <Leaf className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Tu Huella de Carbono</h1>
            <p className="text-gray-600 dark:text-gray-400">Resultados de tu evaluación ambiental</p>
          </motion.div>

          {/* Main Result */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 mb-8 relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-full -translate-y-32 translate-x-32 opacity-50"></div>
            
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
                className="inline-flex items-center justify-center w-40 h-40 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mb-6 relative"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 border-4 border-white/30 rounded-full"
                />
                <div className="text-center text-white">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-4xl font-bold"
                  >
                    {result.total}
                  </motion.div>
                  <div className="text-sm opacity-90">ton CO₂/año</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-6"
              >
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${impact.color} bg-opacity-10`}>
                  <ImpactIcon className={`h-5 w-5 ${impact.color}`} />
                  <span className={`font-semibold ${impact.color}`}>{impact.level}</span>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
              >
                Tu huella anual es de {result.total} toneladas de CO₂
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-gray-600 dark:text-gray-400"
              >
                {result.total < 2 
                  ? '¡Increíble! Estás por debajo del promedio mundial' 
                  : result.total < 4 
                    ? 'Estás en el promedio, pero puedes mejorar' 
                    : 'Hay grandes oportunidades de mejora'}
              </motion.p>
            </div>
          </motion.div>

          {/* Categories Breakdown - Improved Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 mb-8 relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500 to-blue-500"></div>
              <div className="absolute top-4 left-4 w-32 h-32 bg-white rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-24 h-24 bg-white rounded-full"></div>
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Desglose por Categoría
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Analiza el impacto de cada área de tu vida
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(result.categories).map(([category, value], index) => {
                  const Icon = categoryIcons[category as keyof typeof categoryIcons];
                  const categoryName = categoryNames[category as keyof typeof categoryNames];
                  const categoryColor = categoryColors[category as keyof typeof categoryColors];
                  const maxValue = Math.max(...Object.values(result.categories));
                  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 1.3 + index * 0.1 }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -5,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                      }}
                      className="group relative"
                    >
                      {/* Card Background */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-600 transition-all duration-300 group-hover:border-transparent">
                        {/* Gradient Overlay on Hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${categoryColor} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                        
                        <div className="relative z-10">
                          {/* Icon */}
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${categoryColor} rounded-2xl mb-4 shadow-lg`}
                          >
                            <Icon className="h-8 w-8 text-white" />
                          </motion.div>

                          {/* Value */}
                          <div className="text-center mb-4">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 1.5 + index * 0.1, type: "spring", stiffness: 200 }}
                              className="text-3xl font-bold text-gray-900 dark:text-white mb-1"
                            >
                              {value}
                            </motion.div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              ton CO₂
                            </div>
                          </div>

                          {/* Category Name */}
                          <div className="text-center mb-4">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                              {categoryName}
                            </h4>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Impacto relativo
                              </span>
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {Math.round(percentage)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ 
                                  delay: 1.7 + index * 0.1, 
                                  duration: 1,
                                  ease: "easeOut"
                                }}
                                className={`h-3 bg-gradient-to-r ${categoryColor} rounded-full relative`}
                              >
                                {/* Shine effect */}
                                <motion.div
                                  animate={{
                                    x: ['-100%', '100%'],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 2 + index * 0.2
                                  }}
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                />
                              </motion.div>
                            </div>
                          </div>

                          {/* Impact Level Indicator */}
                          <div className="mt-4 text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              percentage > 70 ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                              percentage > 40 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            }`}>
                              {percentage > 70 ? '🔴 Alto' :
                               percentage > 40 ? '🟡 Medio' :
                               '🟢 Bajo'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Summary Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {Object.values(result.categories).reduce((a, b) => a + b, 0).toFixed(1)}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Total Calculado</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {Math.max(...Object.values(result.categories)).toFixed(1)}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Mayor Impacto</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Object.values(result.categories).filter(v => v > 0).length}
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Áreas Activas</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Leaf className="h-6 w-6 mr-2 text-green-600" />
              Consejos Personalizados
            </h3>
            <div className="space-y-4">
              {result.tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
                >
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl mb-4"
              >
                🌳
              </motion.div>
              <h3 className="text-2xl font-bold mb-4">¡Cada acción cuenta!</h3>
              <p className="text-lg mb-6 opacity-90">
                Para compensar tu huella, necesitarías plantar aproximadamente{' '}
                <span className="font-bold text-yellow-300">{Math.ceil(result.total * 40)} árboles</span> al año.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetCalculator}
                  className="px-8 py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Calcular de Nuevo
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/30 hover:bg-white/30 transition-colors"
                >
                  Compartir Resultado
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];
  const stepKeys = ['transport', 'energy', 'food', 'waste'];
  const currentAnswers = answers[stepKeys[currentStep] as keyof typeof answers];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4"
          >
            <Calculator className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Calculadora de Huella Ecológica
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Descubre tu impacto ambiental y cómo reducirlo
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Paso {currentStep + 1} de {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 ${currentStepData.bgColor}`}
          >
            {/* Step Header */}
            <div className="flex items-center space-x-4 mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`p-4 rounded-xl bg-gradient-to-r ${currentStepData.color}`}
              >
                <currentStepData.icon className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentStepData.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentStepData.subtitle}
                </p>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {currentStepData.questions.map((question, index) => (
                <motion.div
                  key={question.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="space-y-3"
                >
                  <label className="block text-lg font-medium text-gray-900 dark:text-white">
                    {question.label}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {question.type === 'number' ? (
                    <div className="relative">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 relative">
                          <input
                            type="number"
                            min="0"
                            step={question.unit === '%' ? '1' : '0.1'}
                            max={question.unit === '%' ? '100' : undefined}
                            value={currentAnswers[question.key as keyof typeof currentAnswers] as string || ''}
                            onChange={(e) => handleAnswer(currentStep, question.key, e.target.value)}
                            className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 ${
                              errors[question.key] 
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                            } text-gray-900 dark:text-white`}
                            placeholder={question.placeholder}
                          />
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                            {question.unit}
                          </div>
                        </div>
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl">
                          <question.icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </div>
                      </div>
                      {errors[question.key] && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center space-x-2 mt-2 text-red-600"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">{errors[question.key]}</span>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAnswer(currentStep, question.key, true)}
                          className={`flex-1 py-4 px-6 rounded-xl border-2 transition-all duration-200 ${
                            currentAnswers[question.key as keyof typeof currentAnswers] === true
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                              : errors[question.key]
                                ? 'border-red-300 hover:border-red-400'
                                : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700'
                          } text-center font-medium`}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="h-5 w-5" />
                            <span>Sí</span>
                          </div>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAnswer(currentStep, question.key, false)}
                          className={`flex-1 py-4 px-6 rounded-xl border-2 transition-all duration-200 ${
                            currentAnswers[question.key as keyof typeof currentAnswers] === false
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                              : errors[question.key]
                                ? 'border-red-300 hover:border-red-400'
                                : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700'
                          } text-center font-medium`}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <X className="h-5 w-5" />
                            <span>No</span>
                          </div>
                        </motion.button>
                      </div>
                      {errors[question.key] && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center space-x-2 text-red-600"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">{errors[question.key]}</span>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center"
        >
          {currentStep > 0 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Anterior</span>
            </motion.button>
          ) : (
            <div />
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <span>{currentStep === steps.length - 1 ? 'Calcular Huella' : 'Siguiente'}</span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default FootprintPage;