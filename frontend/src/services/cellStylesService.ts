import { CellStyle, CreateOrUpdateCellStylePayload } from '@/helpers/types'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchCellStyles = async (tableId: string): Promise<CellStyle[]> => {
  const response = await apiClient.get<CellStyle[]>(`/cellStyles`, {
    params: { table_id: tableId },
  })
  return response.data
}

export const createOrUpdateCellStyle = async (payload: CreateOrUpdateCellStylePayload): Promise<CellStyle> => {
  const response = await apiClient.post<CellStyle>('/cellStyles', payload)
  return response.data
}
