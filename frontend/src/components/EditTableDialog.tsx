'use client'

import { useEffect, useState } from 'react'

import { useFetchTableById, useUpdateTable } from '@/hooks/api/useTables'
import { useToast } from '@/hooks/use-toast'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface EditTableDialogProps {
  isOpen: boolean
  onClose: () => void
  tableId: string
}

const EditTableDialog: React.FC<EditTableDialogProps> = ({ isOpen, onClose, tableId }) => {
  const { toast } = useToast()

  const { data: table, isLoading } = useFetchTableById(tableId)
  const updateTable = useUpdateTable()
  const [tableName, setTableName] = useState<string>('')

  useEffect(() => {
    if (table) setTableName(table.name)
  }, [table])

  const handleSave = () => {
    if (!tableName) {
      toast({
        title: 'Название таблицы не может быть пустым',
        variant: 'destructive',
      })
      return
    }

    updateTable.mutate(
      { id: tableId, payload: { name: tableName } },
      {
        onSuccess: () => {
          toast({
            title: 'Название таблицы обновлено',
            variant: 'success',
          })
          onClose()
        },
        onError: () => {
          toast({
            title: 'Ошибка при обновлении таблицы',
            variant: 'destructive',
          })
        },
      },
    )
  }

  if (isLoading) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать таблицу</DialogTitle>
          <DialogDescription>Измените название таблицы.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
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

export default EditTableDialog
