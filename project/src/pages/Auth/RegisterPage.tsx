// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Leaf, Mail, Lock, User, Eye, EyeOff, Calendar, Phone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    dni: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { register, isLoading, user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const {
      name, surname, email, password, confirmPassword, phone, birthDate, dni
    } = formData;

    // Simple email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !surname || !email || !password || !confirmPassword || !phone || !birthDate || !dni) {
      setError('Por favor, completa todos los campos');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Por favor, introduce un correo electrónico válido');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!/^\d{8,}$/.test(dni)) {
      setError('El DNI debe tener al menos 8 dígitos numéricos');
      return;
    }

    if (!/^\d{9,}$/.test(phone)) {
      setError('El teléfono debe tener al menos 9 dígitos numéricos');
      return;
    }

    const fullName = `${name} ${surname}`;
    const success = await register(email, password, fullName, {
      name,
      surname,
      phone,
      birthDate,
      dni,
    });
    if (!success) {
      setError('Error al crear la cuenta. Por favor, intenta de nuevo.');
    } else {
      setSuccessMsg('¡Cuenta creada exitosamente! Redirigiendo...');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Únete a Veradec</h1>
          <p className="text-gray-600 dark:text-gray-400">Comienza tu viaje hacia la sostenibilidad</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <InputField label="Nombre" name="name" value={formData.name} onChange={handleChange} icon={<User />} placeholder="Juan" autoComplete="given-name" />
            <InputField label="Apellido" name="surname" value={formData.surname} onChange={handleChange} icon={<User />} placeholder="Pérez" autoComplete="family-name" />
            <InputField label="Correo Electrónico" name="email" type="email" value={formData.email} onChange={handleChange} icon={<Mail />} placeholder="tu@email.com" autoComplete="email" />
            <InputField label="Móvil" name="phone" type="tel" value={formData.phone} onChange={handleChange} icon={<Phone />} placeholder="987654321" autoComplete="tel" />
            <InputField label="Fecha de Nacimiento" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} icon={<Calendar />} autoComplete="bday" />
            <InputField label="DNI" name="dni" value={formData.dni} onChange={handleChange} placeholder="12345678" autoComplete="off" />
            <PasswordField
              label="Contraseña"
              name="password"
              value={formData.password}
              onChange={handleChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              autoComplete="new-password"
            />
            <PasswordField
              label="Confirmar Contraseña"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
              autoComplete="new-password"
            />

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            {successMsg && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <p className="text-sm text-green-700 dark:text-green-400">{successMsg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-green-600 dark:text-green-400 hover:underline font-medium">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

// COMPONENTES REUTILIZABLES

type InputFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  icon,
  type = "text",
  placeholder = "",
  autoComplete = "off"
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
    </div>
  </div>
);

type PasswordFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  autoComplete?: string;
};

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  name,
  value,
  onChange,
  showPassword,
  setShowPassword,
  autoComplete = "off"
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type={showPassword ? 'text' : 'password'}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="••••••••"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {showPassword ? <EyeOff /> : <Eye />}
      </button>
    </div>
  </div>
);
