'use client'

import { useEffect, useState } from 'react'

import { useCreateOrUpdateCellStyle, useFetchCellStyles } from '@/hooks/api/useCellStyles'
import { useCreateOrUpdateCell, useFetchCells } from '@/hooks/api/useCells'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import { utils, writeFile } from 'xlsx'

import { transformCellsToRows } from '@/utils/transformCells'

import FormulaDialog from './FormulaDialog'
import TableDialog from './TableDialog'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'

const TableComponent = ({ tableId }: { tableId: string }) => {
  const { data: cells, isLoading, error } = useFetchCells(tableId)
  const { data: cellStyles } = useFetchCellStyles(tableId)
  const createOrUpdateCell = useCreateOrUpdateCell()
  const createOrUpdateCellStyle = useCreateOrUpdateCellStyle()

  const totalRows = 16
  const totalColumns = Array.from(
    { length: 25 },
    (_, i) => String.fromCharCode(65 + i), // Генерация колонок A-Y
  )

  const rows = transformCellsToRows(cells || [], totalRows, totalColumns)

  const [selectedCell, setSelectedCell] = useState<{ row: number; column: string } | null>(null)
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null)
  const [highlightedColumn, setHighlightedColumn] = useState<string | null>(null)
  const [editedCells, setEditedCells] = useState<Record<string, any>>({})
  const [liveStyles, setLiveStyles] = useState<Record<string, any>>({})
  const [isFormulaDialogOpen, setIsFormulaDialogOpen] = useState(false)

  // Функция открытия модального окна
  const handleCreateFormula = () => {
    setIsFormulaDialogOpen(true)
  }

  // Функция закрытия модального окна
  const handleCloseFormulaDialog = () => {
    setIsFormulaDialogOpen(false)
  }

  const [formatOptions, setFormatOptions] = useState({
    textColor: '#000000',
    cellColor: '#ffffff',
  })

  const handleCellClick = (row: number, column: string) => {
    setSelectedCell({ row, column })
    setHighlightedRow(null)
    setHighlightedColumn(null)

    const cellKey = `${row}_${column}`
    const style = liveStyles[cellKey] || cellStyles?.find((s) => s.row === row && s.column === column)

    setFormatOptions({
      textColor: style?.textColor || '#000000',
      cellColor: style?.cellColor || '#ffffff',
    })
  }

  const handleRowClick = (row: number) => {
    setHighlightedRow(row)
    setHighlightedColumn(null)
    setSelectedCell(null)
  }

  const handleColumnClick = (column: string) => {
    setHighlightedColumn(column)
    setHighlightedRow(null)
    setSelectedCell(null)
  }

  const handleStyleChange = (key: 'textColor' | 'cellColor', value: string) => {
    if (!selectedCell) return

    const { row, column } = selectedCell
    const cellKey = `${row}_${column}`

    setLiveStyles((prev) => ({
      ...prev,
      [cellKey]: {
        ...prev[cellKey],
        [key]: value,
      },
    }))

    setFormatOptions((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const getCellStyle = (row: number, column: string) => {
    const cellKey = `${row}_${column}`
    const liveStyle = liveStyles[cellKey]
    const savedStyle = cellStyles?.find((style) => style.row === row && style.column === column)

    return {
      backgroundColor: liveStyle?.cellColor || savedStyle?.cellColor || 'transparent',
      color: liveStyle?.textColor || savedStyle?.textColor || 'inherit',
    }
  }

  const handleCellChange = (row: number, column: string, value: string) => {
    setEditedCells((prev) => ({
      ...prev,
      [`${row}_${column}`]: { tableId, row, column, value },
    }))
  }

  const handleExportToExcel = () => {
    const worksheetData = rows.map(
      (row) => totalColumns.map((col) => row[col]?.value || ''), // Исключаем номера строк и заголовки колонок
    )

    const worksheet = utils.aoa_to_sheet(worksheetData)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, 'Table Data')
    writeFile(workbook, `Table_${tableId}.xlsx`)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(editedCells).length > 0) {
        Object.values(editedCells).forEach((cell) => {
          createOrUpdateCell.mutate(cell)
        })
        setEditedCells({})
      }

      if (Object.keys(liveStyles).length > 0) {
        Object.entries(liveStyles).forEach(([key, style]) => {
          const [row, column] = key.split('_')
          createOrUpdateCellStyle.mutate({ tableId, row: Number(row), column, ...style })
        })
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [editedCells, liveStyles, createOrUpdateCell, createOrUpdateCellStyle])

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) return <p>Загрузка...</p>
  if (error) return <p>Ошибка: {error.message}</p>

  return (
    <div className="relative max-w-screen overflow-hidden">
      {/* Панель форматирования */}
      <div className="flex items-center gap-1 m-4 rounded-full bg-[#eae7f9] max-w-screen px-2">
        <div className="flex flex-col items-center justify-center p-2">
          <label htmlFor="textColor" className="mr-2 cursor-pointer">
            <Image src={'/icons/text.svg'} width={15} height={20} alt="Цвет текста" className="ml-2" />
          </label>
          <input
            type="color"
            id="textColor"
            value={formatOptions.textColor}
            onChange={(e) => handleStyleChange('textColor', e.target.value)}
            className="w-6 h-3 p-0 border-none"
          />
        </div>
        <div className="flex flex-col items-center justify-center p-2">
          <label htmlFor="cellColor" className="mr-2 cursor-pointer">
            <Image src="/icons/bg.svg" width={18} height={20} alt="Цвет фона" className="ml-2" />
          </label>
          <input
            type="color"
            id="cellColor"
            value={formatOptions.cellColor}
            onChange={(e) => handleStyleChange('cellColor', e.target.value)}
            className="w-6 h-3 p-0 border-none"
          />
        </div>
        <button onClick={handleExportToExcel} className="hover:bg-[#f0f0f0] ml-2 mb-1 p-2 rounded-xl transition">
          <Image src={'/icons/download.svg'} width={25} height={25} alt="Скачать" />
        </button>
        <button onClick={handlePrint} className="hover:bg-[#f0f0f0] ml-2 mb-1 p-2 rounded-xl transition">
          <Image src="/icons/print.svg" width={20} height={20} alt="Печать" />
        </button>
        <button onClick={handleCreateFormula} className="hover:bg-[#f0f0f0] ml-2 mb-1 p-2 rounded-xl transition">
          <Image src="/icons/formula.svg" width={25} height={25} alt="Создать формулу" />
        </button>

        <FormulaDialog isOpen={isFormulaDialogOpen} onClose={handleCloseFormulaDialog} />
      </div>

      <table className="max-w-screen border-collapse border border-gray-300 overflow-auto">
        <thead>
          <tr className="border-b border-gray-300 bg-gray-200">
            <th className="h-11 px-4 text-left font-medium text-muted-foreground sticky left-0 bg-gray-300" />
            {totalColumns.map((col) => (
              <th
                key={col}
                onClick={() => handleColumnClick(col)}
                className={`h-11 px-4 text-center font-medium text-muted-foreground cursor-pointer border-r border-b border-[#f0f0f0] bg-[#f0f0f0] ${
                  highlightedColumn === col ? 'bg-[#edebfb]' : ''
                }`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.rowNumber}
              className={`hover:bg-[#edebfb] border-b border-gray-100 ${
                highlightedRow === row.rowNumber ? 'bg-[#edebfb]' : ''
              }`}>
              <td
                onClick={() => handleRowClick(row.rowNumber)}
                className={`h-11 px-4 text-center sticky left-0 bg-gray-200 cursor-pointer ${
                  highlightedRow === row.rowNumber ? 'bg-[#edebfb]' : ''
                }`}>
                {row.rowNumber}
              </td>
              {totalColumns.map((col) => (
                <td
                  key={col}
                  onClick={() => handleCellClick(row.rowNumber, col)}
                  className={`h-11 px-4 text-left border-r border-gray-300 cursor-pointer ${
                    selectedCell?.row === row.rowNumber && selectedCell?.column === col
                      ? 'bg-[#d6d1fa]'
                      : highlightedColumn === col
                        ? 'bg-[#edebfb]'
                        : ''
                  }`}
                  style={getCellStyle(row.rowNumber, col)}>
                  <input
                    type="text"
                    defaultValue={row[col]?.value || ''}
                    onChange={(e) => handleCellChange(row.rowNumber, col, e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TableComponent
