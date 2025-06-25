import React, { useState } from 'react';
import { Calculator, Leaf, Car, Home, Utensils, Trash2 } from 'lucide-react';
import { CarbonFootprintResult } from '../types';

type Answers = {
  transport: {
    carMiles: number;
    flightHours: number;
    publicTransport: number;
  };
  energy: {
    electricity: number;
    heating: number;
    renewable: boolean;
  };
  food: {
    meat: number;
    local: number;
    organic: boolean;
  };
  waste: {
    recycling: number;
    composting: boolean;
    plastic: number;
  };
};

const FootprintPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<CarbonFootprintResult | null>(null);
  const [answers, setAnswers] = useState<Answers>({
    transport: {
      carMiles: 0,
      flightHours: 0,
      publicTransport: 0
    },
    energy: {
      electricity: 0,
      heating: 0,
      renewable: false
    },
    food: {
      meat: 0,
      local: 0,
      organic: false
    },
    waste: {
      recycling: 0,
      composting: false,
      plastic: 0
    }
  });

  const steps = [
    {
      title: 'Transporte',
      icon: Car,
      color: 'bg-blue-500',
      questions: [
        {
          key: 'carMiles',
          label: '¿Cuántos kilómetros manejas por semana?',
          type: 'number',
          unit: 'km'
        },
        {
          key: 'flightHours',
          label: '¿Cuántas horas de vuelo tomas al año?',
          type: 'number',
          unit: 'horas'
        },
        {
          key: 'publicTransport',
          label: '¿Cuántas veces usas transporte público por semana?',
          type: 'number',
          unit: 'veces'
        }
      ]
    },
    {
      title: 'Energía en Casa',
      icon: Home,
      color: 'bg-yellow-500',
      questions: [
        {
          key: 'electricity',
          label: '¿Cuál es tu consumo mensual de electricidad?',
          type: 'number',
          unit: 'kWh'
        },
        {
          key: 'heating',
          label: '¿Cuánto gastas en calefacción/AC al mes?',
          type: 'number',
          unit: 'USD'
        },
        {
          key: 'renewable',
          label: '¿Usas energías renovables?',
          type: 'boolean'
        }
      ]
    },
    {
      title: 'Alimentación',
      icon: Utensils,
      color: 'bg-green-500',
      questions: [
        {
          key: 'meat',
          label: '¿Cuántas veces comes carne por semana?',
          type: 'number',
          unit: 'veces'
        },
        {
          key: 'local',
          label: '¿Qué porcentaje de tu comida es local?',
          type: 'number',
          unit: '%'
        },
        {
          key: 'organic',
          label: '¿Prefieres alimentos orgánicos?',
          type: 'boolean'
        }
      ]
    },
    {
      title: 'Residuos',
      icon: Trash2,
      color: 'bg-red-500',
      questions: [
        {
          key: 'recycling',
          label: '¿Qué porcentaje de tus residuos reciclas?',
          type: 'number',
          unit: '%'
        },
        {
          key: 'composting',
          label: '¿Haces compostaje?',
          type: 'boolean'
        },
        {
          key: 'plastic',
          label: '¿Cuántos productos de plástico de un solo uso usas por día?',
          type: 'number',
          unit: 'productos'
        }
      ]
    }
  ];

  const calculateFootprint = () => {
    // Simple calculation algorithm (in a real app, this would be more sophisticated)
    const transport = (answers.transport.carMiles * 0.2) + 
                     (answers.transport.flightHours * 90) - 
                     (answers.transport.publicTransport * 0.1);
    
    const energy = (answers.energy.electricity * 0.5) + 
                   (answers.energy.heating * 0.8) - 
                   (answers.energy.renewable ? 500 : 0);
    
    const food = (answers.food.meat * 6.5) - 
                 (answers.food.local * 0.02) - 
                 (answers.food.organic ? 100 : 0);
    
    const waste = (answers.waste.plastic * 0.5) - 
                  (answers.waste.recycling * 0.01) - 
                  (answers.waste.composting ? 50 : 0);

    const total = Math.max(0.5, (transport + energy + food + waste) / 1000);

    const tips = [];
    if (transport > 500) tips.push('Considera usar más transporte público o bicicleta');
    if (energy > 400) tips.push('Invierte en electrodomésticos eficientes y energía renovable');
    if (food > 300) tips.push('Reduce el consumo de carne y compra productos locales');
    if (waste > 200) tips.push('Aumenta el reciclaje y reduce el uso de plásticos de un solo uso');
    
    if (tips.length === 0) {
      tips.push('¡Excelente! Mantén tus hábitos sostenibles');
      tips.push('Comparte tu experiencia con otros para inspirar el cambio');
    }

    setResult({
      total: Math.round(total * 10) / 10,
      categories: {
        transport: Math.round(transport / 100 * 10) / 10,
        energy: Math.round(energy / 100 * 10) / 10,
        food: Math.round(food / 100 * 10) / 10,
        waste: Math.round(waste / 100 * 10) / 10
      },
      tips
    });
  };

  const handleAnswer = (stepIndex: number, questionKey: string, value: number | boolean) => {
    const stepKeys = ['transport', 'energy', 'food', 'waste'];
    setAnswers(prev => ({
      ...prev,
      [stepKeys[stepIndex]]: {
        ...prev[stepKeys[stepIndex] as keyof typeof prev],
        [questionKey]: value
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateFootprint();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetCalculator = () => {
    setCurrentStep(0);
    setResult(null);
    setAnswers({
      transport: { carMiles: 0, flightHours: 0, publicTransport: 0 },
      energy: { electricity: 0, heating: 0, renewable: false },
      food: { meat: 0, local: 0, organic: false },
      waste: { recycling: 0, composting: false, plastic: 0 }
    });
  };

  if (result) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tu Huella de Carbono</h1>
          <p className="text-gray-600 dark:text-gray-400">Resultados de tu evaluación ambiental</p>
        </div>

        {/* Results */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mb-4">
              <div className="text-center text-white">
                <div className="text-3xl font-bold">{result.total}</div>
                <div className="text-sm">ton CO₂/año</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Tu huella anual es de {result.total} toneladas de CO₂
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {result.total < 2 ? 'Excelente' : result.total < 4 ? 'Bueno' : 'Hay oportunidades de mejora'}
            </p>
          </div>

          {/* Categories Breakdown */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Object.entries(result.categories).map(([category, value]) => {
              const icons = { transport: Car, energy: Home, food: Utensils, waste: Trash2 };
              const colors = { 
                transport: 'bg-blue-500', 
                energy: 'bg-yellow-500', 
                food: 'bg-green-500', 
                waste: 'bg-red-500' 
              };
              const Icon = icons[category as keyof typeof icons];
              const color = colors[category as keyof typeof colors];

              return (
                <div key={category} className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${color} rounded-lg mb-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{value} ton</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{category}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Environmental Tips */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Consejos Personalizados</h3>
          <div className="space-y-4">
            {result.tips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p className="text-gray-700 dark:text-gray-300">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tree Visualization */}
        <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl p-8 text-white text-center">
          <div className="text-6xl mb-4">🌳</div>
          <h3 className="text-2xl font-bold mb-2">¡Cada acción cuenta!</h3>
          <p className="text-green-100 mb-6">
            Para compensar tu huella, necesitarías plantar aproximadamente {Math.ceil(result.total * 40)} árboles al año.
          </p>
          <button
            onClick={resetCalculator}
            className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
          >
            Calcular de Nuevo
          </button>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];
  const stepKeys = ['transport', 'energy', 'food', 'waste'];
  const currentAnswers = answers[stepKeys[currentStep] as keyof typeof answers];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
          <Calculator className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Calculadora de Huella Ecológica</h1>
        <p className="text-gray-600 dark:text-gray-400">Descubre tu impacto ambiental y cómo reducirlo</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Paso {currentStep + 1} de {steps.length}
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className={`p-3 rounded-lg ${currentStepData.color}`}>
            <currentStepData.icon className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{currentStepData.title}</h2>
        </div>

        <div className="space-y-6">
          {currentStepData.questions.map((question, index) => (
            <div key={index}>
              <label className="block text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                {question.label}
                {question.unit && (
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{question.unit}</span>
                )}
              </label>
              {question.type === 'number' ? (
                <input
                  type="number"
                  className="w-full py-3 px-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  value={currentAnswers[question.key as keyof typeof currentAnswers] || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleAnswer(currentStep, question.key, parseInt(e.target.value) || 0)
                  }
                  min={0}
                />
              ) : (
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleAnswer(currentStep, question.key, true)}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                      currentAnswers[question.key as keyof typeof currentAnswers] === true
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700'
                    }`}
                  >
                    Sí
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnswer(currentStep, question.key, false)}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                      currentAnswers[question.key as keyof typeof currentAnswers] === false
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700'
                    }`}
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            onClick={nextStep}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Calcular Huella' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FootprintPage;