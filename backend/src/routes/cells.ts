import { Router, type Request, type Response } from 'express';
import prisma from '../prismaClient';
import { evaluateFormula, updateDependentCells } from '../services/cellCalculationService';

const router = Router();

/**
 * @route POST /cells
 * @description Создает или обновляет ячейку в таблице. Если указана формула, она вычисляется.
 * @param {Request} req - Запрос, содержащий тело с параметрами:
 *   @param {string} req.body.tableId - ID таблицы, к которой принадлежит ячейка.
 *   @param {number} req.body.row - Номер строки ячейки.
 *   @param {string} req.body.column - Номер столбца ячейки.
 *   @param {string} [req.body.value] - Значение ячейки (если формула не указана).
 *   @param {string} [req.body.formula] - Формула для вычисления значения ячейки.
 * @param {Response} res - Ответ сервера.
 *   @returns {201} Возвращает созданную или обновленную ячейку.
 *   @returns {400} Если отсутствуют обязательные параметры.
 *   @returns {500} Если произошла ошибка сервера.
 * @returns {Promise<void>}
 */
router.post('/cells', async (req: Request, res: Response): Promise<void> => {
  const { tableId, row, column, value, formula } = req.body;

  if (!tableId || !row || !column) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    // Вычисляем новое значение, если указана формула
    const computedValue = formula ? await evaluateFormula(tableId, formula) : value;

    const cell = await prisma.cell.upsert({
      where: {
        tableId_row_column: { tableId, row, column },
      },
      update: { value: computedValue?.toString(), formula },
      create: { tableId, row, column, value: computedValue?.toString(), formula },
    });

    // Обновление зависимых ячеек
    await updateDependentCells(tableId, row, column);

    res.status(201).json(cell);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to save cell', details: error.message });
  }
});

/**
 * @route GET /cells
 * @description Получает список всех ячеек, связанных с указанной таблицей.
 * @param {Request} req - Запрос с параметрами:
 *   @param {string} req.query.table_id - ID таблицы, ячейки которой нужно получить.
 * @param {Response} res - Ответ сервера.
 *   @returns {200} Список ячеек в формате JSON.
 *   @returns {400} Если отсутствует обязательный параметр table_id.
 *   @returns {500} Если произошла ошибка сервера.
 * @returns {Promise<void>}
 */
router.get('/cells', async (req: Request, res: Response): Promise<void> => {
  const { table_id } = req.query;

  if (!table_id) {
    res.status(400).json({ error: 'Table ID is required' });
    return;
  }

  try {
    const cells = await prisma.cell.findMany({
      where: { tableId: String(table_id) },
    });

    res.json(cells);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cells' });
  }
});

export default router;
