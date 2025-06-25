import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Upload,
  Search,
  Download,
  Trash2,
  Eye,
  FolderPlus,
  Folder,
} from "lucide-react";
import { UserFile } from "../types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { storage, db, auth } from "../lib/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const initialFiles: UserFile[] = [
  {
    id: "1",
    name: "Reporte_Huella_Carbono_2024.pdf",
    type: "application/pdf",
    size: 2048576,
    uploadDate: new Date(2024, 0, 15),
    category: "reportes",
    url: "#",
  },
];

const categoryOptions = [
  { key: "reportes", label: "Reportes" },
  { key: "certificados", label: "Certificados" },
  { key: "facturas", label: "Facturas" },
  { key: "guias", label: "Guías" },
  { key: "imagenes", label: "Imágenes" },
];

const FilesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<"all" | string>(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(
          collection(db, "files"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const loadedFiles: UserFile[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            type: data.type,
            size: data.size,
            uploadDate: data.uploadDate.toDate(),
            category: data.category,
            url: data.url,
          };
        });
        setFiles(loadedFiles);
      }
    });

    return () => unsubscribe();
  }, []);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [files, setFiles] = useState<UserFile[]>(initialFiles);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadCategory, setUploadCategory] = useState<string>("reportes");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { key: "all", label: "Todos los archivos", count: files.length },
    ...categoryOptions.map((opt) => ({
      key: opt.key,
      label: opt.label,
      count: files.filter((f) => f.category === opt.key).length,
    })),
  ];

  const filteredFiles = files.filter((file) => {
    const matchesCategory =
      selectedCategory === "all" || file.category === selectedCategory;
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  
  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadFiles(Array.from(e.target.files));
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setUploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle upload
  const handleUpload = async () => {
    if (!auth.currentUser || uploadFiles.length === 0) return;

    const userId = auth.currentUser.uid;

    const uploadPromises = uploadFiles.map(async (file) => {
      const filePath = `users/${userId}/${uploadCategory}/${file.name}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const newFile: UserFile = {
        id: `${Date.now()}-${Math.random()}`, // id temporal
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date(),
        category: uploadCategory,
        url,
      };

      await addDoc(collection(db, "files"), {
        ...newFile,
        userId,
      });

      return newFile;
    });

    await Promise.all(uploadPromises);

    // ✅ Recargar todos los archivos actualizados desde Firestore
    const q = query(collection(db, "files"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const freshFiles: UserFile[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        type: data.type,
        size: data.size,
        uploadDate: data.uploadDate.toDate(),
        category: data.category,
        url: data.url,
      };
    });

    // ✅ Mostrar todos los archivos y limpiar estado
    setFiles(freshFiles);
    setSelectedCategory("all");
    setShowUploadModal(false);
    setUploadFiles([]);
    setUploadCategory("reportes");
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    const fileToDelete = files.find((f) => f.id === id);
    if (!fileToDelete || !auth.currentUser) return;

    try {
      const fileRef = ref(
        storage,
        `users/${auth.currentUser.uid}/${fileToDelete.category}/${fileToDelete.name}`
      );
      // Eliminar archivo de Storage una vez
      await deleteObject(fileRef).catch((error) => {
        if (error.code === "storage/object-not-found") {
          console.warn("Archivo ya no existe en Storage.");
        } else {
          throw error;
        }
      });

      // Eliminar TODOS los documentos de Firestore con ese nombre
      const q = query(
        collection(db, "files"),
        where("userId", "==", auth.currentUser.uid),
        where("name", "==", fileToDelete.name)
      );
      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "files", docSnap.id))
      );
      await Promise.all(deletePromises);

      // Eliminar del estado local
      setFiles((prevFiles) => prevFiles.filter((f) => f.id !== id));

      console.log("Archivo y metadatos eliminados correctamente");
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  // Handle download (mock)
  const handleDownload = async (file: UserFile) => {
    try {
      const fileRef = ref(
        storage,
        `users/${auth.currentUser?.uid}/${file.category}/${file.name}`
      );
      const url = await getDownloadURL(fileRef);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  };
  // Handle preview (mock)
  const handlePreview = (file: UserFile) => {
    window.open(file.url, "_blank");
  };

  // Returns an icon component based on file type
  const getFileIcon = (type: string, file?: UserFile) => {
    if (type.startsWith("image")) return <img src={file?.url || ""} alt="img" className="h-5 w-5" />;
    if (type === "application/pdf") return <FileText className="h-5 w-5 text-red-500" />;
    if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
      return <FileText className="h-5 w-5 text-blue-500" />;
    if (type === "application/vnd.ms-excel" || type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      return <FileText className="h-5 w-5 text-green-500" />;
    return <FileText className="h-5 w-5 text-gray-400" />;
  };

  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Subir Archivo
          </h3>
          <button
            onClick={() => {
              setShowUploadModal(false);
              setUploadFiles([]);
              setUploadCategory("reportes");
            }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center mb-6 cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            // ✅ Evita conflicto si se hace clic en el
            if (target.tagName !== "LABEL" && target.tagName !== "BUTTON") {
              fileInputRef.current?.click();
            }
          }}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Arrastra y suelta tus archivos aquí
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
            o haz clic para seleccionar
          </p>
          <input
            type="file"
            multiple
            className="hidden"
            id="file-upload"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer transition-colors"
          >
            Seleccionar Archivos
          </label>
          {uploadFiles.length > 0 && (
            <ul className="mt-4 text-left text-sm text-gray-700 dark:text-gray-200">
              {uploadFiles.map((file, idx) => (
                <li key={idx} className="truncate">
                  {file.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categoría
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
          >
            {categoryOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setShowUploadModal(false);
              setUploadFiles([]);
              setUploadCategory("reportes");
            }}
            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
            disabled={uploadFiles.length === 0}
            onClick={handleUpload}
          >
            Subir
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mis Archivos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organiza y gestiona tus documentos ambientales
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="mt-4 sm:mt-0 flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Upload className="h-5 w-5" />
          <span>Subir Archivo</span>
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Categorías
            </h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedCategory === category.key
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Folder className="h-4 w-4" />
                    <span className="text-sm">{category.label}</span>
                  </div>
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full flex items-center space-x-2 px-3 py-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                <FolderPlus className="h-4 w-4" />
                <span className="text-sm">Nueva Carpeta</span>
              </button>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search and Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar archivos..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  aria-label="Vista de cuadrícula"
                >
                  <div className="grid grid-cols-2 gap-1 w-4 h-4">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  aria-label="Vista de lista"
                >
                  <div className="space-y-1 w-4 h-4">
                    <div className="bg-current h-1 rounded"></div>
                    <div className="bg-current h-1 rounded"></div>
                    <div className="bg-current h-1 rounded"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
          {/* Files Display */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded bg-gray-100 dark:bg-gray-700">
                        {file.type.startsWith("image") ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <FileText className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <button
                          className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                          aria-label="Previsualizar"
                          onClick={() => handlePreview(file)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                          aria-label="Descargar"
                          onClick={() => handleDownload(file)}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Eliminar"
                          onClick={() => handleDelete(file.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <h4
                      className="font-medium text-gray-900 dark:text-white mb-2 truncate"
                      title={file.name}
                    >
                      {file.name}
                    </h4>
                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                      <p>{formatFileSize(file.size)}</p>
                      <p>{format(file.uploadDate, "PPP", { locale: es })}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Nombre
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Tamaño
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Fecha
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map((file) => (
                      <tr
                        key={file.id}
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">
                              {getFileIcon(file.type, file)}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {format(file.uploadDate, "PPP", { locale: es })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                              aria-label="Previsualizar"
                              onClick={() => handlePreview(file)}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                              aria-label="Descargar"
                              onClick={() => handleDownload(file)}
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              aria-label="Eliminar"
                              onClick={() => handleDelete(file.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {filteredFiles.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No se encontraron archivos
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm
                    ? "Intenta con otros términos de búsqueda"
                    : "Sube tu primer archivo para comenzar"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Upload Modal */}
      {showUploadModal && <UploadModal />}
    </div>
  );
};

export default FilesPage;
