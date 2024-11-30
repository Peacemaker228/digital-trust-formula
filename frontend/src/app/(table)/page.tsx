'use client'

import { useState } from 'react'

import { useDeleteTable, useFetchTables, useUpdateTable } from '@/hooks/api/useTables'
import { toast, useToast } from '@/hooks/use-toast'
import { Pen, Trash } from 'lucide-react'
import Image from 'next/image'

import EditTableDialog from '@/components/EditTableDialog'
import TableComponent from '@/components/TableComponent'
import TableDialog from '@/components/TableDialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToastAction } from '@/components/ui/toast'

export default function Home() {
  const { toast } = useToast()

  const { data: tables, isLoading, error } = useFetchTables()
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false)
  const [isEditTableDialogOpen, setIsEditTableDialogOpen] = useState(false)

  const deleteTable = useDeleteTable()
  const handleTableChange = (tableId: string) => setSelectedTableId(tableId)

  // Открыть модалку добавления таблицы
  const handleOpenTableDialog = () => { if (selectedTableId === null) {
    toast({
      title: 'Таблица не выбрана',
      variant: 'destructive',
    })
    return
  }
  setIsTableDialogOpen(true)}
  const handleCloseTableDialog = () => setIsTableDialogOpen(false)

  // Открыть модалку редактирования таблицы
  const handleOpenEditTableDialog = () => setIsEditTableDialogOpen(true)
  
  const handleCloseEditTableDialog = () => setIsEditTableDialogOpen(false)

  // Удаление таблицы
  const handleDeleteTable = () => {
    if (!selectedTableId) {
      toast({
        title: 'Таблица не выбрана',
        variant: 'destructive',
      })
      return
    }

    if (confirm('Вы уверены, что хотите удалить эту таблицу?')) {
      deleteTable.mutate(selectedTableId, {
        onSuccess: () => {
          toast({
            title: 'Таблица успешно удалена',
            variant: 'success',
          })
          setSelectedTableId(null) // Сбрасываем выбранную таблицу
        },
        onError: () => {
          toast({
            title: 'Ошибка при удалении таблицы',
            variant: 'destructive',
          })
        },
      })
    }
  }

  if (isLoading) return <p>Загрузка таблиц...</p>
  if (error) return <p>Ошибка загрузки таблиц: {error.message}</p>

  return (
    <div className="max-w-screen max-h-screen">
      <TableComponent tableId={selectedTableId || ''} />
      <div className="bg-[#eae7f9] w-full flex px-14 py-2 gap-2">
        <Select onValueChange={handleTableChange} defaultValue={selectedTableId || undefined}>
          <SelectTrigger className="w-36 max-w-xs border border-gray-300 rounded-lg px-3 py-2">
            <SelectValue placeholder="Выберите таблицу" />
          </SelectTrigger>
          <SelectContent>
            {tables?.map((table) => (
              <SelectItem key={table.id} value={table.id}>
                {table.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Добавление таблицы */}
        <button onClick={handleOpenTableDialog} className="hover:bg-[#f0f0f0] ml-2 mb-1 p-2 rounded-xl transition">
          <Image src="/icons/plus.svg" width={15} height={15} alt="Добавить таблицу" />
        </button>

        {/* Удаление таблицы */}
        <button onClick={handleDeleteTable} className="hover:bg-[#f0f0f0] ml-2 mb-1 p-2 rounded-xl transition">
          <Trash width={15} height={15} />
        </button>

        {/* Редактирование таблицы */}
        <button onClick={handleOpenEditTableDialog} className="hover:bg-[#f0f0f0] ml-2 mb-1 p-2 rounded-xl transition">
          <Pen width={15} height={15} />
        </button>
      </div>

      {/* Модалка добавления таблицы */}
      <TableDialog isOpen={isTableDialogOpen} onClose={handleCloseTableDialog} />

      {/* Модалка редактирования таблицы */}
      {selectedTableId && (
        <EditTableDialog
          isOpen={isEditTableDialogOpen}
          onClose={handleCloseEditTableDialog}
          tableId={selectedTableId}
        />
      )}
    </div>
  )
}
