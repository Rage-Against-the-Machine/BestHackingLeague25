
import React from 'react';
import Modal from './Modal';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, productName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Potwierdź Usunięcie">
      <div className="flex flex-col items-center text-center">
        <div className="bg-red-100 text-red-600 p-3 rounded-full border-4 border-red-200 mb-4">
          <AlertTriangle size={32} />
        </div>
        <p className="text-lg font-bold text-ink mb-2">
          Czy na pewno chcesz usunąć ten produkt?
        </p>
        <p className="text-sm text-ink-light mb-6 font-serif italic">
          "{productName}"
        </p>
        <p className="text-xs text-ink-light mb-6">
          Tej operacji nie można cofnąć. Produkt zostanie trwale usunięty z gazetki.
        </p>

        <div className="flex justify-end gap-3 w-full">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border-2 border-ink shadow-paper-sm hover:shadow-paper hover:-translate-y-0.5 transition-all font-bold"
          >
            Anuluj
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white border-2 border-red-800 shadow-paper-sm hover:shadow-paper hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2"
          >
            <Trash2 size={16} />
            Tak, usuń
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
