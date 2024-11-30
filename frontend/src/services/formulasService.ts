import { CreateFormulaPayload, Formula } from '@/helpers/types'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchFormulas = async (): Promise<Formula[]> => {
  const response = await apiClient.get<Formula[]>('/formulas')
  return response.data
}

export const createFormula = async (payload: CreateFormulaPayload): Promise<Formula> => {
  const response = await apiClient.post<Formula>('/formulas', payload)
  return response.data
}
