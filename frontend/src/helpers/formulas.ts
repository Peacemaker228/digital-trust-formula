// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormulaImplementation = (...args: any[]) => any

export const formulas: { name: string; implementation: FormulaImplementation }[] = [
  {
    name: '=SUM',
    implementation: (data: string[]) => data.reduce((acc, val) => acc + Number(val), 0),
  },
  {
    name: '=AVERAGE',
    implementation: (data: number[]) => data.reduce((acc, val) => acc + val, 0) / data.length,
  },
  {
    name: '=MAX',
    implementation: (data: number[]) => Math.max(...data),
  },
  {
    name: '=MIN',
    implementation: (data: number[]) => Math.min(...data),
  },
  {
    name: '=IF',
    implementation: (value: number) => (value > 100 ? 'Greater than 100' : 'Less than or equal to 100'),
  },
  {
    name: '=CONCATENATE',
    implementation: (f1: string, g1: string) => `${f1} ${g1}`,
  },
  {
    name: '=DATE',
    implementation: (year: number, month: number, day: number) => new Date(year, month, day),
  },
  {
    name: '=TODAY',
    implementation: () => new Date().toLocaleDateString(),
  },
  {
    name: '=VLOOKUP',
    implementation: (lookupValue: any, table: any[][], colIndex: number) =>
      table.find((row) => row[0] === lookupValue)?.[colIndex - 1] || null,
  },
  {
    name: '=SUBSTITUTE',
    implementation: (text: string, oldValue: string, newValue: string) =>
      text.replace(new RegExp(oldValue, 'g'), newValue),
  },
  {
    name: '=TEXT',
    implementation: (value: number) => value.toFixed(2),
  },
  {
    name: '=TRIM',
    implementation: (text: string) => text.trim(),
  },
  {
    name: '=ROUND',
    implementation: (value: number, decimals: number) => Number(value.toFixed(decimals)),
  },
  {
    name: '=DAY',
    implementation: (date: Date) => date.getDate(),
  },
  {
    name: '=MONTH',
    implementation: (date: Date) => date.getMonth() + 1,
  },
  {
    name: '=YEAR',
    implementation: (date: Date) => date.getFullYear(),
  },
  {
    name: '=LOOKUP',
    implementation: (lookupValue: any, keys: any[], values: any[]) => {
      const index = keys.indexOf(lookupValue)
      return index !== -1 ? values[index] : null
    },
  },
  {
    name: '=VALUE',
    implementation: (text: string) => parseFloat(text),
  },
  {
    name: '=COUNT',
    implementation: (data: any[]) => data.filter((val) => typeof val === 'number').length,
  },
  {
    name: '=COUNTIF',
    implementation: (data: number[], condition: number) => data.filter((value) => value > condition).length,
  },
  {
    name: '=PRODUCT',
    implementation: (data: number[]) => data.reduce((acc, val) => acc * val, 1),
  },
  {
    name: '=VAR',
    implementation: (data: number[]) => {
      const mean = data.reduce((acc, val) => acc + val, 0) / data.length
      return data.reduce((acc, val) => acc + (val - mean) ** 2, 0) / (data.length - 1)
    },
  },
  {
    name: '=SQRT',
    implementation: (value: number) => Math.sqrt(value),
  },
  {
    name: '=REPLACE',
    implementation: (text: string, start: number, length: number, newText: string) =>
      text.substring(0, start - 1) + newText + text.substring(start - 1 + length),
  },
  {
    name: '=FIND',
    implementation: (text: string, search: string) => text.indexOf(search) + 1,
  },
  {
    name: '=RIGHT',
    implementation: (text: string, length: number) => text.slice(-length),
  },
  {
    name: '=LEFT',
    implementation: (text: string, length: number) => text.slice(0, length),
  },
  {
    name: '=TEXT',
    implementation: (date: Date) =>
      date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
  },
  {
    name: '=COUNTA',
    implementation: (data: any[]) => data.filter((val) => val !== null && val !== undefined && val !== '').length,
  },
  {
    name: '=AVERAGEIF',
    implementation: (data: number[], condition: number) => {
      const filtered = data.filter((value) => value > condition)
      return filtered.reduce((acc, val) => acc + val, 0) / filtered.length
    },
  },
  {
    name: '=SUMIF',
    implementation: (data: number[], condition: number) =>
      data.filter((value) => value > condition).reduce((acc, val) => acc + val, 0),
  },
  {
    name: '=COUNTBLANK',
    implementation: (data: any[]) => data.filter((val) => val === null || val === undefined || val === '').length,
  },
  {
    name: '=ISNUMBER',
    implementation: (value: any) => typeof value === 'number',
  },
  {
    name: '=NOW',
    implementation: () => new Date().toLocaleString(),
  },
  {
    name: '=TEXTJOIN',
    implementation: (data: string[]) => data.join(','),
  },
  {
    name: '=UNIQUE',
    implementation: (data: any[]) => [...new Set(data)],
  },
  {
    name: '=FILTER',
    implementation: (data: any[]) => data.filter((val) => val !== null && val !== undefined && val !== ''),
  },
  {
    name: '=SORT',
    implementation: (data: any[]) => [...data].sort(),
  },
]
