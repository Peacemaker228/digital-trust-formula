'use client'

import { useState } from 'react'

import { useCreateTable, useFetchTables } from '@/hooks/api/useTables'
import { useToast } from '@/hooks/use-toast'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TableDialogProps {
  isOpen: boolean
  onClose: () => void
}

const TableDialog: React.FC<TableDialogProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast()
  const [newTableName, setNewTableName] = useState('')
  const createTable = useCreateTable()

  const handleSave = () => {
    if (!newTableName) {
      toast({
        title: 'Название таблицы не может быть пустым',
        variant: 'destructive',
      })
      return
    }

    createTable.mutate(
      { name: newTableName },
      {
        onSuccess: (data) => {
          toast({
            title: 'Таблица создана',
            variant: 'success',
          })
          onClose() // Закрыть модалку
        },
        onError: (error) => {
          toast({
            title: 'Ошибка при создании таблицы',
            variant: 'destructive',
          })
        },
      },
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Управление таблицами</DialogTitle>
          <DialogDescription>Выберите таблицу для работы или создайте новую таблицу.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Создать новую таблицу:</label>
            <input
              type="text"
              placeholder="Введите название"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              Отмена
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
              Сохранить
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TableDialog
