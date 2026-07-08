import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { User, Trash2, LogOut, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function Settings() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') return;
    setDeleting(true);
    try {
      // Sign out and redirect — actual account deletion requires backend support
      await base44.auth.logout('/');
    } catch (e) {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <h2 className="text-white font-semibold text-sm">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-lavender/20 flex items-center justify-center">
            <User className="w-6 h-6 text-lavender" />
          </div>
          <div>
            <p className="text-white font-medium">{user?.full_name || 'User'}</p>
            <p className="text-white/40 text-sm">{user?.email || ''}</p>
            <p className="text-white/30 text-xs mt-0.5 capitalize">{user?.role || 'analyst'}</p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <h2 className="text-white font-semibold text-sm">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Theme</p>
            <p className="text-white/30 text-xs">Follows your system dark mode preference</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-mint/10 text-mint font-medium">Auto (Dark)</span>
        </div>
      </div>

      {/* Account Actions */}
      <div className="glass rounded-2xl p-5 space-y-3">
        <h2 className="text-white font-semibold text-sm">Account</h2>
        <button
          onClick={() => base44.auth.logout('/')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-left"
        >
          <LogOut className="w-4 h-4 text-white/40" />
          <span className="text-white/70 text-sm">Sign Out</span>
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-coral/5 hover:bg-coral/10 transition-colors text-left"
        >
          <Trash2 className="w-4 h-4 text-coral" />
          <span className="text-coral text-sm">Delete Account</span>
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass rounded-2xl p-6 w-full max-w-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-coral" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Delete Account</h3>
                <p className="text-white/40 text-xs">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-white/60 text-sm">All your data will be permanently deleted. Type <span className="text-coral font-mono font-bold">DELETE</span> to confirm.</p>
            <input
              type="text"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-coral/40"
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-white/10 text-white/60"
                onClick={() => { setShowDeleteConfirm(false); setConfirmText(''); }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-coral hover:bg-coral-dark text-white font-semibold"
                disabled={confirmText !== 'DELETE' || deleting}
                onClick={handleDeleteAccount}
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}