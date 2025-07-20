import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { Icon } from '@iconify/react';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const ProfilePage: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/user/profile');
        setUser(data);
        setName(data.name);
        setEmail(data.email);
      } catch {
        setError("Erreur de récupération des données utilisateur");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleUpdate = async () => {
    setUpdateError('');
    if (password && password !== confirmPassword) return setUpdateError('Les mots de passe ne correspondent pas');
    const updateData: any = {};
    if (name !== user?.name) updateData.name = name;
    if (email !== user?.email) updateData.email = email;
    if (password) updateData.password = password;
    if (!Object.keys(updateData).length) return setUpdateError("Aucune modification");

    try {
      await api.put('/user/profile', updateData);
      setUser(prev => prev ? { ...prev, ...updateData } : null);
      setUpdateSuccess("Profil mis à jour");
      setTimeout(password ? logout : () => setEditOpen(false), 2000);
    } catch {
      setUpdateError("Erreur lors de la mise à jour");
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Layout>
      <div className="mb-6">
        <p className="text-gray-700 font-poppins mb-4">Gérez vos informations personnelles.</p>
        <hr className="mb-6" />
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {loading ? (
          <div className="flex flex-col items-center justify-center my-12">
            <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-gray-700 font-poppins">Chargement de votre profil...</p>
          </div>
        ) : user ? (
          <div className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p-6">
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl shadow-md mb-2">
                {user.name?.[0].toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold text-brown-800 font-poppins">{user.name}</h2>
              <p className="flex items-center text-sm text-gray-600 mt-1 font-poppins">
                <Icon icon="mdi:calendar" className="mr-1 text-gray-400 text-base" /> Membre depuis {formatDate(user.created_at)}
              </p>
            </div>
            <hr className="my-4" />
            <div className="mb-4">
              <p className="flex items-center text-sm text-gray-600 font-poppins">
                <Icon icon="mdi:email" className="mr-2 text-orange-500 text-base" /> Email
              </p>
              <p className="text-brown-900 font-poppins mt-1">{user.email}</p>
            </div>
            <button
              onClick={() => setEditOpen(true)}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-md font-poppins"
            >
              <Icon icon="mdi:account-edit" className="mr-2 inline-block" /> Modifier mon profil
            </button>
          </div>
        ) : null}

        {editOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-brown-800 mb-4 font-poppins">Modifier mon profil</h3>
              {updateError && <div className="text-red-600 text-sm mb-2">{updateError}</div>}
              {updateSuccess && <div className="text-green-600 text-sm mb-2">{updateSuccess}</div>}
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-poppins pl-10"
                    placeholder="Nom"
                  />
                  <Icon icon="mdi:account" className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-poppins pl-10"
                    placeholder="Email"
                  />
                  <Icon icon="mdi:email" className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-poppins pl-10 pr-10"
                    placeholder="Nouveau mot de passe"
                  />
                  <Icon icon="mdi:lock" className="absolute left-3 top-2.5 text-gray-400" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5">
                    <Icon icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} className="text-gray-400" />
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none font-poppins pl-10 ${password !== confirmPassword && confirmPassword ? 'border-red-500' : 'focus:ring-2 focus:ring-orange-500'}`}
                    placeholder="Confirmer le mot de passe"
                  />
                  <Icon icon="mdi:lock" className="absolute left-3 top-2.5 text-gray-400" />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 text-gray-600 font-poppins hover:bg-gray-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-poppins rounded-xl shadow"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;