import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { 
  Leaf, 
  ArrowRight, 
  Calculator, 
  Users, 
  MapPin, 
  BookOpen,
  Sparkles,
  Wind,
  Droplets,
  Sun
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    controls.start({
      rotate: 360,
      transition: { duration: 20, repeat: Infinity, ease: "linear" }
    });
  }, [controls]);

  // Floating particles animation
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  const features = [
    {
      icon: Calculator,
      title: 'Calcula tu Huella',
      description: 'Mide tu impacto ambiental con nuestra calculadora avanzada',
      color: 'from-green-400 to-emerald-600'
    },
    {
      icon: Users,
      title: 'Únete a la Comunidad',
      description: 'Conecta con personas comprometidas con el medio ambiente',
      color: 'from-blue-400 to-cyan-600'
    },
    {
      icon: MapPin,
      title: 'Encuentra Recursos',
      description: 'Descubre puntos verdes y recursos ecológicos cerca de ti',
      color: 'from-purple-400 to-violet-600'
    },
    {
      icon: BookOpen,
      title: 'Aprende y Comparte',
      description: 'Accede a contenido educativo y comparte tus experiencias',
      color: 'from-orange-400 to-red-500'
    }
  ];

  return (
    <>
      <div className="min-h-screen relative overflow-hidden overflow-x-hidden bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-10 left-10 sm:top-20 sm:left-20 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-r from-green-400/30 to-emerald-500/30 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-r from-blue-400/30 to-cyan-500/30 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          {/* ...resto sin cambios... */}

          <motion.div
            className="hidden sm:block absolute w-6 h-6 bg-white/10 rounded-full blur-sm pointer-events-none"
            animate={{ x: mousePosition.x - 12, y: mousePosition.y - 12 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
          />
        </div>

        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-white/20 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Animated Icons */}
        <motion.div
          className="absolute top-32 right-32"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Leaf className="h-12 w-12 text-green-300/60" />
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-32"
          animate={{
            x: [0, 20, 0],
            rotate: [0, -15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Wind className="h-10 w-10 text-blue-300/60" />
        </motion.div>

        <motion.div
          className="absolute top-1/3 left-1/4"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Droplets className="h-8 w-8 text-cyan-300/60" />
        </motion.div>

        <motion.div
          className="absolute top-1/4 right-1/3"
          animate={controls}
        >
          <Sun className="h-16 w-16 text-yellow-300/50" />
        </motion.div>

        {/* Mouse follower effect */}
        <motion.div
          className="absolute w-6 h-6 bg-white/10 rounded-full blur-sm pointer-events-none"
          animate={{
            x: mousePosition.x - 12,
            y: mousePosition.y - 12,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 28
          }}
        />
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Navigation */}
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-between items-center p-6 md:p-8"
          >
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="p-3 bg-white/10 backdrop-blur-sm rounded-xl"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Leaf className="h-8 w-8 text-green-300" />
              </motion.div>
              <span className="text-2xl font-bold text-white">Veradec</span>
            </motion.div>

            <div className="flex space-x-4">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 text-white/90 hover:text-white transition-colors"
                >
                  Iniciar Sesión
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Registrarse
                </motion.button>
              </Link>
            </div>
          </motion.nav>

          {/* Hero Section */}
          <div className="flex-1 flex items-center justify-center px-6 md:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mb-8"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-green-400/20 to-emerald-500/20 backdrop-blur-sm rounded-full mb-8"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(34, 197, 94, 0.3)",
                      "0 0 40px rgba(34, 197, 94, 0.5)",
                      "0 0 20px rgba(34, 197, 94, 0.3)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-16 w-16 text-green-300" />
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-7xl font-bold text-white mb-6"
              >
                Construye un{' '}
                <motion.span
                  className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Futuro Verde
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Únete a la revolución ambiental. Calcula tu huella ecológica, 
                descubre recursos sostenibles y conecta con una comunidad 
                comprometida con el planeta.
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>Comenzar Ahora</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </motion.button>
                </Link>

                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    Explorar Demo
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="px-6 md:px-8 pb-16"
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -10,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                    }}
                    className="group p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <motion.div
                      className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg mb-4`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="px-6 md:px-8 pb-16"
          >
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {[
                  { number: "10K+", label: "Usuarios Activos" },
                  { number: "50K+", label: "Toneladas CO₂ Reducidas" },
                  { number: "500+", label: "Recursos Ecológicos" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.7 + index * 0.1 }}
                    className="p-6"
                  >
                    <motion.div
                      className="text-4xl md:text-5xl font-bold text-white mb-2"
                      animate={{
                        textShadow: [
                          "0 0 10px rgba(34, 197, 94, 0.5)",
                          "0 0 20px rgba(34, 197, 94, 0.8)",
                          "0 0 10px rgba(34, 197, 94, 0.5)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {stat.number}
                    </motion.div>
                    <div className="text-white/70 text-lg">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;