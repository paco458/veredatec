import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { UserCircle2 } from "lucide-react";

export default function SettingsPage() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("AuthContext debe estar dentro de un AuthProvider");
  }

  const { user } = auth;

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    birthDate: "",
    dni: "",
  });

  // Memoize fetchUserData to avoid unnecessary re-renders
  const fetchUserData = useCallback(async () => {
    if (user?.uid) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          name: data.name || "",
          surname: data.surname || "",
          email: data.email || user.email || "",
          phone: data.phone || "",
          birthDate: data.birthDate || "",
          dni: data.dni || "",
        });
      } else {
        setFormData(prev => ({
          ...prev,
          email: user.email || "",
        }));
      }
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user?.uid) {
      setError("Usuario no autenticado");
      return;
    }
    if (!formData.email) {
      setError("El correo electrónico no puede estar vacío");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { ...formData }, { merge: true });
      setEditing(false);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setError("No se pudo actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Mi cuenta</h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow">
        <div className="flex items-center space-x-4 mb-6">
          {user?.photoURL ? (
            <img alt="User avatar" className="w-16 h-16 rounded-full" src={user.photoURL} />
          ) : (
            <UserCircle2 className="w-16 h-16 text-gray-500" />
          )}
          <div>
            <h2 className="text-xl font-semibold">{formData.name} {formData.surname}</h2>
            <p className="text-gray-500">{formData.email || user?.email}</p>
            <p className="text-gray-500 text-sm">
              Miembro desde{" "}
              {user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : "desconocido"}
            </p>
          </div>
        </div>
        {editing ? (
          <form
            className="space-y-4"
            onSubmit={e => {
              e.preventDefault();
              handleSave();
            }}
            autoComplete="off"
          >
            <InputField label="Nombre" name="name" value={formData.name} onChange={handleChange} />
            <InputField label="Apellido" name="surname" value={formData.surname} onChange={handleChange} />
            <InputField label="Correo electrónico" name="email" type="email" value={formData.email} onChange={handleChange} />
            <InputField label="Número de teléfono" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            <InputField label="Fecha de nacimiento" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
            <InputField label="DNI" name="dni" value={formData.dni} onChange={handleChange} />
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-400"
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setError("");
                  fetchUserData();
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p><strong>Nombre:</strong> {formData.name}</p>
            <p><strong>Apellido:</strong> {formData.surname}</p>
            <p><strong>Email:</strong> {formData.email || user?.email}</p>
            <p><strong>Teléfono:</strong> {formData.phone}</p>
            <p><strong>Fecha de nacimiento:</strong> {formData.birthDate}</p>
            <p><strong>DNI:</strong> {formData.dni}</p>
            <button
              onClick={() => setEditing(true)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Editar perfil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

type InputFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

function InputField({ label, name, value, onChange, type = "text" }: InputFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        autoComplete="off"
      />
    </div>
  );
}
