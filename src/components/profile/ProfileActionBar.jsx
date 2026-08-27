import React, { useState } from 'react'
import { Save, XCircle, Trash2, Check, AlertTriangle } from 'lucide-react'

export default function ProfileActionBar({ onSave, onCancel, onDeleteProfile, isSaving = false }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <div
      style={{
        marginTop: 28,
        padding: '18px 24px',
        background: '#FFFFFF',
        borderRadius: 20,
        border: '1.5px solid #E2E8F0',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Danger Action Button: Delete Profile */}
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          style={{
            height: 42,
            padding: '0 18px',
            borderRadius: 12,
            border: '1px solid #FECACA',
            background: '#FEF2F2',
            color: '#DC2626',
            fontFamily: 'Sora, sans-serif',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            transition: 'all 0.15s ease'
          }}
        >
          <Trash2 size={15} />
          <span>Delete Profile</span>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Secondary Action Button: Cancel */}
        <button
          type="button"
          onClick={onCancel}
          style={{
            height: 42,
            padding: '0 20px',
            borderRadius: 12,
            border: '1px solid #CBD5E1',
            background: '#FFFFFF',
            color: '#475569',
            fontFamily: 'Sora, sans-serif',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            transition: 'all 0.15s ease'
          }}
        >
          <XCircle size={15} />
          <span>Cancel</span>
        </button>

        {/* Primary Action Button: Save Changes */}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          style={{
            height: 42,
            padding: '0 24px',
            borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
            color: '#FFFFFF',
            fontFamily: 'Sora, sans-serif',
            fontSize: 13,
            fontWeight: 700,
            cursor: isSaving ? 'wait' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
            opacity: isSaving ? 0.8 : 1,
            transition: 'all 0.15s ease'
          }}
        >
          {isSaving ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving Master Data...</span>
            </>
          ) : (
            <>
              <Save size={15} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Delete Profile Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle size={28} />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-800 font-sans">Delete Student Profile?</h4>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                This action is permanent and will clear all master telemetry metrics, saved projects, custom skills, and preferences.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full justify-center mt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  onDeleteProfile && onDeleteProfile()
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md"
              >
                Yes, Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
