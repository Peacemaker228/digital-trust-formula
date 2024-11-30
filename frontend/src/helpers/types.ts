export type Cell = {
  id: string
  tableId: string
  row: number
  column: string
  value: string | null
  formula: string | null
  updatedAt: string
}

export type CreateOrUpdateCellPayload = {
  tableId: string
  row: number
  column: string
  value?: string
  formula?: string
}

export type CellStyle = {
  id: string
  tableId: string
  row: number
  column: string
  textColor?: string
  cellColor?: string
  font?: string
  borderStyle?: string
}

export type CreateOrUpdateCellStylePayload = {
  tableId: string
  row: number
  column: string
  textColor?: string
  cellColor?: string
  font?: string
  borderStyle?: string
}

export type Formula = {
  id: string
  name: string
  description?: string
  implementation: string
  createdAt: string
}

export type CreateFormulaPayload = {
  name: string
  description?: string
  implementation: string
}

export type Table = {
  id: string
  name: string
  createdAt: string
  cells?: {
    id: string
    row: number
    column: string
    value: string | null
    formula: string | null
  }[]
}

export type CreateTablePayload = {
  name: string
}

export type UpdateTablePayload = {
  name: string
}
