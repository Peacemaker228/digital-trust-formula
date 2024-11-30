import { Cell, CreateOrUpdateCellPayload } from '@/helpers/types'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchCells = async (tableId: string): Promise<Cell[]> => {
  const response = await apiClient.get<Cell[]>(`/cells`, {
    params: { table_id: tableId },
  })
  return response.data
}

export const createOrUpdateCell = async (payload: CreateOrUpdateCellPayload): Promise<Cell> => {
  const response = await apiClient.post<Cell>('/cells', payload)
  return response.data
}
