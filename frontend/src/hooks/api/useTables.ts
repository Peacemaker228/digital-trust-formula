'use client'

import { CreateTablePayload, Table, UpdateTablePayload } from '@/helpers/types'
import { createTable, deleteTable, fetchTableById, fetchTables, updateTable } from '@/services/tablesService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Хук для получения списка таблиц
export const useFetchTables = () => {
  return useQuery<Table[], Error>({
    queryKey: ['tables'],
    queryFn: fetchTables,
  })
}

// Хук для получения информации о конкретной таблице
export const useFetchTableById = (id: string) => {
  return useQuery<Table, Error>({
    queryKey: ['tables', id],
    queryFn: () => fetchTableById(id),
    enabled: !!id, // Запрос выполняется только если передан ID
  })
}

// Хук для создания таблицы
export const useCreateTable = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTablePayload) => createTable(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
  })
}

// Хук для обновления таблицы
export const useUpdateTable = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTablePayload }) => updateTable(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
      queryClient.invalidateQueries({ queryKey: ['tables', id] })
    },
  })
}

export const useDeleteTable = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
    onError: (error) => {
      console.error('Failed to delete table:', error)
    },
  })
}
