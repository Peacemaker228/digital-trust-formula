'use client'

import { CreateFormulaPayload, Formula } from '@/helpers/types'
import { createFormula, fetchFormulas } from '@/services/formulasService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Хук для получения списка формул
export const useFetchFormulas = () => {
  return useQuery<Formula[], Error>({
    queryKey: ['formulas'],
    queryFn: fetchFormulas,
  })
}

// Хук для создания новой формулы
export const useCreateFormula = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateFormulaPayload) => createFormula(payload),
    onSuccess: () => {
      // Инвалидация данных после успешного добавления
      queryClient.invalidateQueries({
        queryKey: ['formulas'],
      })
    },
  })
}
