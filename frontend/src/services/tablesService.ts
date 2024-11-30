import { CreateTablePayload, Table, UpdateTablePayload } from '@/helpers/types'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchTables = async (): Promise<Table[]> => {
  const response = await apiClient.get<Table[]>('/tables')
  return JSON.parse(JSON.stringify(response.data)) // Преобразуем в plain object
}

export const fetchTableById = async (id: string): Promise<Table> => {
  const response = await apiClient.get<Table>(`/tables/${id}`)
  return JSON.parse(JSON.stringify(response.data)) // Преобразуем в plain object
}

export const createTable = async (payload: CreateTablePayload): Promise<Table> => {
  const response = await apiClient.post<Table>('/tables', payload)
  return JSON.parse(JSON.stringify(response.data)) // Преобразуем в plain object
}

export const updateTable = async (id: string, payload: UpdateTablePayload): Promise<Table> => {
  const response = await apiClient.patch<Table>(`/tables/${id}`, payload)
  return JSON.parse(JSON.stringify(response.data)) // Преобразуем в plain object
}
