import { Router, type Request, type Response } from 'express';
import prisma from '../prismaClient';

const router = Router();

/**
 * @route POST /cellStyles
 * @description Создает или обновляет стиль для ячейки.
 * @param {Request} req - Запрос, содержащий тело с параметрами:
 *   @param {string} req.body.tableId - ID таблицы.
 *   @param {number} req.body.row - Номер строки ячейки.
 *   @param {string} req.body.column - Номер столбца ячейки.
 *   @param {string} [req.body.textColor] - Цвет текста ячейки.
 *   @param {string} [req.body.cellColor] - Цвет фона ячейки.
 *   @param {string} [req.body.font] - Шрифт текста ячейки.
 *   @param {string} [req.body.borderStyle] - Стиль границ ячейки ('top', 'bottom', 'left', 'right', 'all').
 * @param {Response} res - Ответ сервера.
 *   @returns {201} Возвращает созданный или обновленный стиль.
 *   @returns {400} Если отсутствуют обязательные параметры.
 *   @returns {500} Если произошла ошибка сервера.
 * @returns {Promise<void>}
 */
router.post('/cellStyles', async (req: Request, res: Response): Promise<void> => {
  const { tableId, row, column, textColor, cellColor, font, borderStyle } = req.body;

  if (!tableId || !row || !column) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const cellStyle = await prisma.cellStyle.upsert({
      where: {
        tableId_row_column: { tableId, row, column },
      },
      update: { textColor, cellColor, font, borderStyle },
      create: { tableId, row, column, textColor, cellColor, font, borderStyle },
    });

    res.status(201).json(cellStyle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save cell style' });
  }
});

/**
 * @route GET /cellStyles
 * @description Получает стили для всех ячеек таблицы.
 * @param {Request} req - Запрос с параметрами:
 *   @param {string} req.query.table_id - ID таблицы.
 * @param {Response} res - Ответ сервера.
 *   @returns {200} Список стилей ячеек в формате JSON.
 *   @returns {400} Если отсутствует обязательный параметр table_id.
 *   @returns {500} Если произошла ошибка сервера.
 * @returns {Promise<void>}
 */
router.get('/cellStyles', async (req: Request, res: Response): Promise<void> => {
  const { table_id } = req.query;

  if (!table_id) {
    res.status(400).json({ error: 'Table ID is required' });
    return;
  }

  try {
    const cellStyles = await prisma.cellStyle.findMany({
      where: { tableId: String(table_id) },
    });

    res.json(cellStyles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cell styles' });
  }
});

export default router;
