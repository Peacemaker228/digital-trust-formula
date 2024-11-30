'use client'

import { CellStyle, CreateOrUpdateCellStylePayload } from '@/helpers/types'
import { createOrUpdateCellStyle, fetchCellStyles } from '@/services/cellStylesService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Хук для получения стилей ячеек
export const useFetchCellStyles = (tableId: string) => {
  return useQuery<CellStyle[], Error>({
    queryKey: ['cellStyles', tableId],
    queryFn: () => fetchCellStyles(tableId),
    enabled: !!tableId,
  })
}

// Хук для создания или обновления стиля ячейки
export const useCreateOrUpdateCellStyle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateOrUpdateCellStylePayload) => createOrUpdateCellStyle(payload),
    onSuccess: (_, { tableId }) => {
      queryClient.invalidateQueries({
        queryKey: ['cellStyles', tableId],
      })
    },
  })
}
