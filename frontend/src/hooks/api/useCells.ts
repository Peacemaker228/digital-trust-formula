'use client'

import { Cell, CreateOrUpdateCellPayload } from '@/helpers/types'
import { createOrUpdateCell, fetchCells } from '@/services/cellService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Хук для получения списка ячеек
export const useFetchCells = (tableId: string) => {
  return useQuery<Cell[]>({
    queryKey: ['cells', tableId],
    queryFn: () => fetchCells(tableId),
    enabled: !!tableId,
  })
}

// Хук для создания или обновления ячейки
export const useCreateOrUpdateCell = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateOrUpdateCellPayload) => createOrUpdateCell(payload),
    onSuccess: (_, { tableId }) => {
      queryClient.invalidateQueries({
        queryKey: ['cells', tableId],
      })
    },
  })
}
