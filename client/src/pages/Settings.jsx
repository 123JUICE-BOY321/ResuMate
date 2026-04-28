import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser, deleteUser } from '../api';

const Settings = ({ user, setUser, handleLogout }) => {
  const [editName, setEditName] = useState(user?.name || '');
  const [editPassword, setEditPassword] = useState('');
  const navigate = useNavigate();

  const onSave = async (e) => {
    e.preventDefault();
    try {
      const dataToUpdate = { name: editName };
      if (editPassword) dataToUpdate.password = editPassword;
      
      const updatedUser = await updateUser(dataToUpdate);
      setUser(updatedUser);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = async () => {
    if(window.confirm("Are you sure? This will delete your account and reports forever.")) {
      try {
        await deleteUser();
        handleLogout();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex-grow pt-32 pb-12 px-6 max-w-3xl mx-auto w-full z-10 relative">
      <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Account Settings</h1>
      
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-6 mb-8">
              <img src={user?.avatar} alt="Avatar" className="w-20 h-20 rounded-full bg-black/30 border-2 border-white/20" />
              <div>
                  <h3 className="text-2xl font-bold text-white">{user?.name}</h3>
                  <p className="text-slate-400">@{user?.username}</p>
              </div>
          </div>

          <form onSubmit={onSave} className="space-y-6">
              <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Display Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500/50 outline-none focus:ring-1 focus:ring-sky-500/50 transition-all placeholder-slate-500" 
                    required 
                  />
              </div>
              <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">New Password (Optional)</label>
                  <input 
                    type="password" 
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Leave blank to keep current" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-sky-500/50 outline-none focus:ring-1 focus:ring-sky-500/50 transition-all placeholder-slate-500" 
                  />
              </div>
              <div className="flex justify-end pt-4">
                  <button type="submit" className="px-8 py-3 bg-sky-400/20 text-sky-400 border border-sky-400/50 backdrop-blur-md font-bold rounded-full hover:bg-sky-400/30 transition-all shadow-lg shadow-sky-400/10">
                    Save Changes
                  </button>
              </div>
          </form>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-red-500/20 p-8 shadow-2xl">
          <h3 className="text-red-400 font-bold text-xl mb-2">Danger Zone</h3>
          <p className="text-slate-400 text-sm mb-6">Once you delete your account, there is no going back. All your saved resume reports will be lost.</p>
          <button onClick={onDelete} className="px-8 py-3 bg-red-500/10 border border-red-500/30 text-red-400 font-bold rounded-full hover:bg-red-500/20 hover:text-red-300 backdrop-blur-md transition-all">
            Delete Account
          </button>
      </div>
    </div>
  );
};

export default Settings;
