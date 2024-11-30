'use client';

import { useFetchCells } from '@/hooks/api/useCells';
import { transformCellsToRows } from '@/utils/transformCells';
import { useState } from 'react';

const TableComponent = ({ tableId }: { tableId: string }) => {
  const { data: cells, isLoading, error } = useFetchCells(tableId);

  // Задаём размер таблицы
  const totalRows = 20;
  const totalColumns = Array.from({ length: 25 }, (_, i) =>
    String.fromCharCode(65 + i) // Генерация колонок A-Y
  );

  const rows = transformCellsToRows(cells || [], totalRows, totalColumns);

  // Состояния для выделения
  const [selectedCell, setSelectedCell] = useState<{ row: number; column: string } | null>(null);
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);
  const [highlightedColumn, setHighlightedColumn] = useState<string | null>(null);

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error.message}</p>;

  const handleCellClick = (row: number, column: string) => {
    setSelectedCell({ row, column });
    setHighlightedRow(null);
    setHighlightedColumn(null);
  };

  const handleRowClick = (row: number) => {
    setHighlightedRow(row);
    setSelectedCell(null);
    setHighlightedColumn(null);
  };

  const handleColumnClick = (column: string) => {
    setHighlightedColumn(column);
    setSelectedCell(null);
    setHighlightedRow(null);
  };

  return (
    <div className="relative w-full overflow-x-auto">
      <table className="w-full border-collapse table-auto border border-gray-300">
        {/* Заголовки таблицы */}
        <thead>
          <tr className="border-b border-gray-300 bg-gray-200">
            <th className="h-12 px-4 text-left font-medium text-muted-foreground sticky left-0 bg-gray-300" />
            {totalColumns.map((col) => (
              <th
                key={col}
                onClick={() => handleColumnClick(col)}
                className={`h-12 px-4 text-center font-medium text-muted-foreground cursor-pointer border-r border-b border-[#f0f0f0] bg-[#f0f0f0] ${
                  highlightedColumn === col ? 'bg-[#edebfb]' : ''
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* Тело таблицы */}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`hover:bg-[#edebfb] border-b border-gray-100 ${
                highlightedRow === row.rowNumber ? 'bg-[#edebfb]' : ''
              }`}
            >
              {/* Номер строки */}
              <td
                onClick={() => handleRowClick(row.rowNumber)}
                className={`h-12 px-4 text-center sticky left-0 cursor-pointer border-b border-r border-[#f0f0f0] bg-[#f0f0f0] ${
                  highlightedRow === row.rowNumber ? 'bg-[#edebfb]' : ''
                }`}
              >
                {row.rowNumber}
              </td>
              {/* Ячейки строки */}
              {totalColumns.map((col) => (
                <td
                  key={col}
                  onClick={() => handleCellClick(row.rowNumber, col)}
                  className={`h-12 px-4 text-left border-r border-gray-100 cursor-pointer ${
                    selectedCell?.row === row.rowNumber && selectedCell?.column === col
                      ? 'bg-[#edebfb]'
                      : highlightedColumn === col
                      ? 'bg-[#edebfb]'
                      : ''
                  }`}
                >
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
  );
};

export default TableComponent;
