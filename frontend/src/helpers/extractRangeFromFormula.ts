export function extractRangeFromFormula(formula: string): string[] {
  // Ищем диапазон в формате (A1:A10)
  const rangeMatch = formula.match(/\(([^)]+)\)/)

  if (rangeMatch) {
    // Получаем диапазон в виде строки
    const range = rangeMatch[1]

    // Разделяем диапазон на начало и конец
    const [start, end] = range.split(':')

    // Извлекаем данные для начала диапазона
    const startMatch = start.match(/([A-Z]+)(\d+)/)
    const endMatch = end.match(/([A-Z]+)(\d+)/)

    if (startMatch && endMatch) {
      const startColumn = startMatch[1] // Столбец (буквы)
      const startRow = parseInt(startMatch[2], 10) // Строка (цифры)

      const endColumn = endMatch[1] // Столбец (буквы)
      const endRow = parseInt(endMatch[2], 10) // Строка (цифры)

      // Если столбцы одинаковые, формируем массив строк
      if (startColumn === endColumn) {
        const cells: string[] = []
        for (let row = startRow; row <= endRow; row++) {
          cells.push(`${startColumn}${row}`)
        }
        return cells
      }
    }
  }

  return []
}
