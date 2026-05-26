"use client"

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title: string; 
  message: string; 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-[#1a1a1a] p-6 border border-gray-800 shadow-2xl">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-gray-400">{message}</p>
        
        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 rounded-md transition-all"
          >
            Batal
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-all shadow-lg shadow-red-900/20"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}