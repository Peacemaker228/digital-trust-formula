import prisma from '../prismaClient';
import { evaluate, parse } from 'mathjs';
import { CustomError } from '../utils/customError';

// Типы данных
type CellReference = {
  tableId: string;
  row: number;
  column: string;
};

type ParsedFormula = {
  formula: string;
  references: CellReference[];
};

// Утилита для преобразования ячейки, например, `A1` → { row: 1, column: 'A' }
const parseCellReference = (cell: string): CellReference => {
  const match = cell.match(/([A-Z]+)(\d+)/);
  if (!match) throw new Error(`Invalid cell reference: ${cell}`);

  return {
    tableId: '', // Добавим позднее, при вычислениях
    column: match[1],
    row: parseInt(match[2], 10),
  };
};

// Парсинг формул и извлечение ссылок на ячейки
const parseFormula = (formula: string, tableId: string): ParsedFormula => {
  const cellReferences: CellReference[] = [];
  const replacedFormula = formula.replace(/[A-Z]+\d+/g, (match) => {
    const ref = parseCellReference(match);
    ref.tableId = tableId;
    cellReferences.push(ref);
    return `cell_${ref.row}_${ref.column}`;
  });

  return { formula: replacedFormula, references: cellReferences };
};

// Вычисление значения формулы
const evaluateFormula = async (
  tableId: string,
  formula: string
): Promise<number> => {
  // Парсинг формулы и извлечение ссылок
  const { formula: parsedFormula, references } = parseFormula(formula, tableId);

  // Проверка существования всех упомянутых ячеек
  const cells = await Promise.all(
    references.map(async (ref) => {
      const cell = await prisma.cell.findUnique({
        where: {
          tableId_row_column: {
            tableId: ref.tableId,
            row: ref.row,
            column: ref.column,
          },
        },
      });

      if (!cell) {
        throw new CustomError(`Referenced cell ${ref.column}${ref.row} does not exist`, 400);
      }

      return {
        ref,
        value: cell.value !== null ? parseFloat(cell.value) : 0,
      };
    })
  );

  // Подготовка переменных для подстановки в формулу
  const scope: Record<string, number> = {};
  cells.forEach(({ ref, value }) => {
    scope[`cell_${ref.row}_${ref.column}`] = value;
  });

  // Обработка вычислений и проверка ошибок
  try {
    const result = evaluate(parsedFormula, scope);

    if (!Number.isFinite(result)) {
      throw new CustomError('Division by zero error', 400);
    }

    return result;
  } catch (error: any) {
    throw new CustomError(`Error evaluating formula: ${error.message}`, 400);
  }
};

// Обновление связанных ячеек
const updateDependentCells = async (tableId: string, row: number, column: string): Promise<void> => {
  const dependents = await prisma.cell.findMany({
    where: {
      formula: {
        contains: `${column}${row}`, // Упоминание в формуле
      },
    },
  });

  for (const dependent of dependents) {
    if (dependent.formula) {
      const newValue = await evaluateFormula(tableId, dependent.formula);
      await prisma.cell.update({
        where: {
          id: dependent.id,
        },
        data: { value: newValue.toString() },
      });
    }
  }
};

// Поддержка кастомных формул
const registerCustomFormula = async (
  name: string,
  implementation: string
): Promise<void> => {
  await prisma.customFormula.create({
    data: {
      name,
      implementation,
    },
  });
};

const evaluateCustomFormula = async (
  name: string,
  args: any[]
): Promise<number> => {
  const formula = await prisma.customFormula.findUnique({
    where: { name },
  });

  if (!formula) throw new Error(`Custom formula ${name} not found`);

  // Динамическое выполнение кода
  const func = new Function('args', formula.implementation);
  return func(args);
};

export {
  evaluateFormula,
  updateDependentCells,
  registerCustomFormula,
  evaluateCustomFormula,
};
