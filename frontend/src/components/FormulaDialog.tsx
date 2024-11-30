'use client';

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState } from 'react';
import { useCreateFormula } from '@/hooks/api/useFormulas';

interface FormulaDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const FormulaDialog: React.FC<FormulaDialogProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [implementation, setImplementation] = useState('');
  const createFormula = useCreateFormula();

  const handleSave = () => {
    if (!name || !implementation) {
      alert('Пожалуйста, заполните обязательные поля.');
      return;
    }

    createFormula.mutate(
      { name, description, implementation },
      {
        onSuccess: () => {
          onClose(); // Закрыть модалку после успешного сохранения
        },
        onError: (error) => {
          console.error(error);
          alert('Ошибка при сохранении формулы.');
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить формулу</DialogTitle>
          <DialogDescription>
            Укажите название, описание и реализацию формулы. Название и реализация обязательны для заполнения.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Введите название"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <textarea
            placeholder="Введите описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <textarea
            placeholder="Введите реализацию (например, =SUM(A1:A5))"
            value={implementation}
            onChange={(e) => setImplementation(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Сохранить
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormulaDialog;
