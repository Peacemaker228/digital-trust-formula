'use client'

import React, { useRef, useState } from 'react'

import { useFetchCells } from '@/hooks/api/useCells'
import { DndContext, DragEndEvent, useDraggable } from '@dnd-kit/core'
import { ChartArea } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'

import { transformCellsToRows } from '@/utils/transformCells'

export const TableComponent = ({ tableId }: { tableId: string }) => {
  const { data: cells, isLoading, error } = useFetchCells(tableId)

  const totalRows = 20
  const totalColumns = Array.from(
    { length: 25 },
    (_, i) => String.fromCharCode(65 + i), // Генерация колонок A-Y
  )

  const rows = transformCellsToRows(cells || [], totalRows, totalColumns)

  const [selectedCells, setSelectedCells] = useState<{ row: number; column: string }[]>([]) // Состояние выделенных ячеек
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]) // Данные для графика
  const [position, setPosition] = useState({ x: 50, y: 50 }) // Позиция графика на экране
  const [showGraph, setShowGraph] = useState(false)

  const tableRef = useRef<HTMLTableElement>(null) // Ссылка на таблицу для определения её границ

  const handleCellClick = (row: number, column: string) => {
    setSelectedCells((prev) => {
      const exists = prev.some((cell) => cell.row === row && cell.column === column)
      return exists ? prev.filter((cell) => !(cell.row === row && cell.column === column)) : [...prev, { row, column }]
    })
  }

  const handleChartAreaClick = () => {
    // Генерация данных для графика на основе выделенных ячеек
    const data = selectedCells.map(({ row, column }) => {
      const cellValue = rows[row - 1][column]?.value || 0
      return {
        name: `${row}-${column}`,
        value: parseFloat(cellValue) || 0,
      }
    })
    setChartData(data)
    setShowGraph((prevState) => !prevState)
  }

  // Перехват событий начала и окончания перетаскивания
  const handleDragEnd = (event: DragEndEvent) => {
    const { delta } = event
    const tableRect = tableRef.current?.getBoundingClientRect() // Получаем размеры таблицы

    // Проверка на пустые размеры таблицы
    if (tableRect) {
      const newX = Math.min(Math.max(position.x + delta.x, 0), tableRect.width - 100) // Ограничиваем по оси X (вместо tableRect.width можно вычесть ширину графика)
      const newY = Math.min(Math.max(position.y + delta.y, 0), tableRect.height - 100) // Ограничиваем по оси Y (вместо tableRect.height можно вычесть высоту графика)

      setPosition({ x: newX, y: newY })
    }
  }

  // Хук для перетаскивания графика
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: 'chart',
    data: { type: 'chart' },
  })

  console.log(attributes, listeners, 'use')

  const handleDragStart = () => {
    console.log('Drag started')
  }

  if (isLoading) return <p>Загрузка...</p>
  if (error) return <p>Ошибка: {error.message}</p>

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="relative w-full overflow-x-auto">
        <ChartArea className="cursor-pointer" onClick={handleChartAreaClick} />
        {showGraph && (
          <div
            onMouseDown={(e) => e.preventDefault()} // Чтобы предотвратить захват событий внутренним svg
            onDragStart={handleDragStart}
            ref={setNodeRef} // Привязка перетаскиваемого элемента
            {...listeners} // Обработчики для перетаскивания
            {...attributes} // Атрибуты для перетаскиваемого элемента
            style={{
              position: 'absolute',
              left: `${position.x}px`,
              top: `${position.y}px`,
              cursor: 'move',
              zIndex: 100,
              backgroundColor: 'white',
            }}>
            <BarChart width={730} height={250} data={chartData} style={{ pointerEvents: 'none' }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </div>
        )}
        <table className="w-full border-collapse table-auto border border-gray-300 relative" ref={tableRef}>
          <thead>
            <tr className="border-b border-gray-300 bg-gray-200">
              <th className="h-12 px-4 text-left font-medium text-muted-foreground sticky left-0 bg-gray-300" />
              {totalColumns.map((col) => (
                <th
                  key={col}
                  className="h-12 px-4 text-center font-medium text-muted-foreground border-r border-b border-[#f0f0f0] bg-[#f0f0f0]">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-[#edebfb] border-b border-gray-100">
                <td className="h-12 px-4 text-center sticky left-0 border-b border-r border-[#f0f0f0] bg-[#f0f0f0]">
                  {row.rowNumber}
                </td>
                {totalColumns.map((col) => (
                  <td
                    key={col}
                    onClick={() => handleCellClick(row.rowNumber, col)}
                    className={`h-12 px-4 text-left border-r border-gray-100 cursor-pointer ${
                      selectedCells.some((cell) => cell.row === row.rowNumber && cell.column === col)
                        ? 'bg-[#edebfb]'
                        : ''
                    }`}>
                    <input
                      type="text"
                      defaultValue={row[col]?.value || ''}
                      className="w-full bg-transparent focus:outline-none"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DndContext>
  )
}
