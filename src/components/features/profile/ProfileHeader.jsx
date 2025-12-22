// UBICACIÓN: /src/components/features/profile/ProfileHeader.jsx
import React, { useState, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../../../services/firebase';
import { User, PencilSimple, Check, X, Camera } from '@phosphor-icons/react';

export default function ProfileHeader() {
  const { user, role } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.displayName || '');
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const handleSave = async () => {
    if (!newName.trim()) return;
    setLoading(true);

    try {
      await updateProfile(auth.currentUser, { displayName: newName });
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { name: newName });

      setIsEditing(false);
      window.location.reload(); 
    } catch (error) {
      console.error("Error al actualizar nombre:", error);
      alert("Hubo un problema al guardar el nombre.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);

    try {
      // 1. Crear referencia en Storage con ruta: users/{uid}/profile.jpg
      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);

      // 2. Subir el archivo
      await uploadBytes(storageRef, file);

      // 3. Obtener la URL de descarga
      const photoURL = await getDownloadURL(storageRef);

      // 4. Actualizar el perfil de Firebase Auth
      await updateProfile(auth.currentUser, { photoURL });

      // 5. Actualizar el documento en Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { photoURL });

      // 6. Recargar para ver el cambio
      window.location.reload();
    } catch (error) {
      console.error("Error al subir foto:", error);
      alert("Error al subir la foto. Intenta de nuevo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCancel = () => {
    setNewName(user.displayName || '');
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-4 mb-8 animate-fade-in">
      {/* AVATAR (FOTO) CON BOTÓN DE CAMBIO */}
      <div className="relative group">
          <img 
            src={user.photoURL} 
            alt="Avatar" 
            className="w-20 h-20 rounded-full border-2 border-brand-gold p-1 object-cover shadow-lg shadow-black/50" 
          />
          {/* Badge de usuario */}
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-brand-gold text-black flex items-center justify-center rounded-full text-xs font-bold border-2 border-black z-10">
              <User weight="fill" />
          </div>
          
          {/* Botón de cambiar foto (Aparece en hover) */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPhoto}
            className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20"
          >
            {uploadingPhoto ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Camera size={24} className="text-white" weight="fill" />
            )}
          </button>

          {/* Input de archivo oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            disabled={uploadingPhoto}
            className="hidden"
          />
      </div>

      {/* INFORMACIÓN Y EDICIÓN */}
      <div className="flex-1">
          {isEditing ? (
            // --- MODO EDICIÓN ---
            <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-brand-charcoal border-b-2 border-brand-gold text-white text-xl font-bold px-2 py-1 w-full focus:outline-none"
                  autoFocus
                />
                <button 
                  onClick={handleSave} 
                  disabled={loading}
                  className="bg-green-600 text-white p-2 rounded-full hover:bg-green-500 transition shadow-lg"
                >
                  <Check weight="bold" />
                </button>
                <button 
                  onClick={handleCancel}
                  className="bg-gray-700 text-gray-300 p-2 rounded-full hover:bg-gray-600 transition shadow-lg"
                >
                  <X weight="bold" />
                </button>
            </div>
          ) : (
            // --- MODO VISUALIZACIÓN ---
            <div className="flex items-center gap-2 group">
                <h2 className="text-2xl font-bold text-white leading-tight truncate">
                  {user.displayName}
                </h2>
                {/* Botón lápiz que aparece suavemente */}
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-brand-gold p-1 rounded transition-colors opacity-100 sm:opacity-50 sm:group-hover:opacity-100"
                >
                  <PencilSimple size={20} weight="duotone" />
                </button>
            </div>
          )}

          {/* ETIQUETAS INFORMATIVAS (Solo visibles si no editas) */}
          {!isEditing && (
            <>
              <p className="text-gray-400 text-xs mb-2">{user.email}</p>
              <div className="flex gap-2">
                  <span className="text-[10px] font-black bg-brand-gold text-black px-2 py-0.5 rounded uppercase tracking-wider">
                  {role === 'trainer' ? 'COACH' : 'ATLETA PRO'}
                  </span>
                  <span className="text-[10px] font-bold border border-white/10 text-gray-400 px-2 py-0.5 rounded uppercase tracking-wider">
                  Membresía Activa
                  </span>
              </div>
            </>
          )}
      </div>
    </div>
  );
}
