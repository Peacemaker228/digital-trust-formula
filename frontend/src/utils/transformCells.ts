import { Cell } from '@/helpers/types'

export const generateEmptyTable = (rows: number, columns: string[]) => {
  const emptyTable: Record<string, any>[] = []

  for (let i = 1; i <= rows; i++) {
    const row: Record<string, any> = { rowNumber: i }
    columns.forEach((col) => {
      row[col] = { value: '', formula: null } // Пустая ячейка
    })
    emptyTable.push(row)
  }

  return emptyTable
}

export const transformCellsToRows = (
  cells: Cell[],
  totalRows: number,
  totalColumns: string[],
): Record<string, any>[] => {
  const baseTable = generateEmptyTable(totalRows, totalColumns)

  const rowMap: Record<number, Record<string, any>> = {}
  baseTable.forEach((row) => {
    rowMap[row.rowNumber] = row
  })

  cells.forEach((cell) => {
    if (rowMap[cell.row]) {
      rowMap[cell.row][cell.column] = {
        value: cell.value,
        formula: cell.formula,
        updatedAt: cell.updatedAt,
      }
    }
  })

  return baseTable
}
