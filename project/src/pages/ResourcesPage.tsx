import React, { useEffect, useState } from 'react';
import { MapPin, Search, Plus, Recycle, ShoppingBag, Store, Calendar } from 'lucide-react';
import { EcoResource } from '../types';
import UserMap from './UserMap';
import { collection, getDocs,addDoc, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../lib/firebase"; // Asegúrate de tener esta configuración


const ResourcesPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [resources, setResources] = useState<EcoResource[]>([]);
  

  // Mock resources data
  const fetchResources = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const snapshot = await getDocs(collection(db, `users/${user.uid}/lugares`));
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as EcoResource[];

  setResources(data);
};

useEffect(() => {
  fetchResources();
}, []);

 
  const resourceTypes = [
    { key: 'all', label: 'Todos', icon: MapPin, color: 'bg-gray-500' },
    { key: 'recycling', label: 'Reciclaje', icon: Recycle, color: 'bg-green-500' },
    { key: 'organic-market', label: 'Mercados Orgánicos', icon: ShoppingBag, color: 'bg-blue-500' },
    { key: 'bulk-store', label: 'Tiendas a Granel', icon: Store, color: 'bg-purple-500' },
    { key: 'event', label: 'Eventos', icon: Calendar, color: 'bg-orange-500' }
  ];
  const handleVerEnMapa = (lat: number, lng: number) => {
  const url = `https://www.google.com/maps?q=${lat},${lng}`;
  window.open(url, '_blank');
  };
  const handleDelete = async (id: string) => {
  const user = auth.currentUser;
  if (!user) return;

  if (confirm("¿Seguro que deseas eliminar este recurso?")) {
    try {
      await deleteDoc(doc(db, `users/${user.uid}/lugares/${id}`));
      fetchResources(); // Vuelve a cargar la lista
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el recurso.");
    }
  }
};

  const filteredResources = resources.filter(resource => {
    const matchesType = !selectedType || selectedType === 'all' || resource.type === selectedType;
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

 const AddResourceForm = ({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('recycling');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return alert("Debes iniciar sesión para agregar un recurso.");

    setIsSubmitting(true);

    try {
      const newResource = {
        name,
        type,
        description,
        contact,
        location: {
          address,
          lat: 0, // puedes integrar geocoding aquí si lo deseas
          lng: 0
        }
      };

      await addDoc(collection(db, `users/${user.uid}/lugares`), newResource);
      onAdd(); // actualiza lista
      onClose(); // cierra modal
    } catch (error) {
      console.error("Error al agregar recurso:", error);
      alert("Hubo un error al guardar el recurso.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Agregar Recurso</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
           
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nombre del Lugar
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          type="text"
          className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Ej: Centro de Reciclaje"
        />
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="recycling">Reciclaje</option>
              <option value="organic-market">Mercado Orgánico</option>
              <option value="bulk-store">Tienda a Granel</option>
              <option value="event">Evento</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dirección
            </label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              type="text"
              className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Dirección completa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Describe los servicios o productos..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contacto (opcional)
            </label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              type="text"
              className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Teléfono o email"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              {isSubmitting ? 'Guardando...' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
          <MapPin className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Recursos Ecológicos</h1>
        <p className="text-gray-600 dark:text-gray-400">Encuentra puntos verdes, mercados orgánicos y eventos cerca de ti</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar recursos..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          {/* Add Resource Button */}
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Agregar Recurso</span>
          </button>
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          {resourceTypes.map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.key}
                onClick={() => setSelectedType(type.key === 'all' ? null : type.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  (!selectedType && type.key === 'all') || selectedType === type.key
                    ? `${type.color} text-white`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
          <h3 className="text-xl font-bold mb-2">Mapa Interactivo</h3>
          <p>Vista de recursos por ubicación geográfica</p>
        </div>
        <div className="h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
          
        
              <div className="h-64">
               <UserMap />
               </div>

          </div>
      
          
        </div>
      </div>

      {/* Resources List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((resource) => {
          const resourceType = resourceTypes.find(t => t.key === resource.type);
          const Icon = resourceType?.icon || MapPin;
          
          return (
            <div key={resource.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${resourceType?.color || 'bg-gray-500'}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{resource.name}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {resourceType?.label || resource.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 mb-4">{resource.description}</p>

              {/* Location */}
              <div className="flex items-start space-x-2 mb-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{resource.location.address}</span>
              </div>

              {/* Contact */}
              {resource.contact && (
             <div className="flex items-center justify-between gap-2 mt-4">
                  <button
                    onClick={() => handleVerEnMapa(resource.location.lat, resource.location.lng)}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                  >
                    Ver en mapa
                  </button>
                  <button
                    onClick={() => handleDelete(resource.id)}
                    className="text-red-600 dark:text-red-400 hover:underline text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </div>

              )}
            </div>
          );
        })}
   
    

  </div>

  {/* No Results */}
  {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No se encontraron recursos</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Intenta con otros términos de búsqueda o agrega un nuevo recurso.
          </p>
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddForm && (
        <AddResourceForm
          onClose={() => setShowAddForm(false)}
          onAdd={() => {
            // vuelve a cargar los datos desde Firebase
            fetchResources(); // define fetchResources fuera del useEffect
          }}
        />
      )}
    </div>
  );
};

export default ResourcesPage;