import { Router, type Request, type Response } from 'express';
import prisma from '../prismaClient';

const router = Router();

/**
 * @route GET /tables
 * @description Получает список всех таблиц.
 * @param {Request} req - Запрос без параметров.
 * @param {Response} res - Ответ сервера.
 *   @returns {200} Список таблиц в формате JSON.
 *   @returns {500} Если произошла ошибка при получении таблиц.
 * @returns {Promise<void>}
 */
router.get('/tables', async (req: Request, res: Response): Promise<void> => {
  try {
    const tables = await prisma.table.findMany();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
});

/**
 * @route POST /tables
 * @description Создает новую таблицу.
 * @param {Request} req - Запрос, содержащий тело с параметрами:
 *   @param {string} req.body.name - Имя новой таблицы.
 * @param {Response} res - Ответ сервера.
 *   @returns {201} Возвращает созданную таблицу.
 *   @returns {400} Если отсутствует параметр name.
 *   @returns {500} Если произошла ошибка при создании таблицы.
 * @returns {Promise<void>}
 */
router.post('/tables', async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Table name is required' });
    return;
  }

  try {
    const table = await prisma.table.create({ data: { name } });
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create table' });
  }
});

/**
 * @route GET /tables/:id
 * @description Получает информацию о конкретной таблице, включая её ячейки.
 * @param {Request} req - Запрос с параметрами:
 *   @param {string} req.params.id - ID таблицы.
 * @param {Response} res - Ответ сервера.
 *   @returns {200} Информация о таблице в формате JSON.
 *   @returns {404} Если таблица не найдена.
 *   @returns {500} Если произошла ошибка при получении таблицы.
 * @returns {Promise<void>}
 */
router.get('/tables/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const table = await prisma.table.findUnique({
      where: { id },
      include: { cells: true },
    });

    if (!table) {
      res.status(404).json({ error: 'Table not found' });
      return;
    }

    res.json(table);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch table' });
  }
});

/**
 * @route PATCH /tables/:id
 * @description Обновляет информацию о таблице.
 * @param {Request} req - Запрос с параметрами:
 *   @param {string} req.params.id - ID таблицы.
 *   @param {string} req.body.name - Новое имя таблицы.
 * @param {Response} res - Ответ сервера.
 *   @returns {200} Обновленная информация о таблице.
 *   @returns {400} Если отсутствует параметр name.
 *   @returns {500} Если произошла ошибка при обновлении таблицы.
 * @returns {Promise<void>}
 */
router.patch('/tables/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Table name is required' });
    return;
  }

  try {
    const table = await prisma.table.update({
      where: { id },
      data: { name },
    });

    res.json(table);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update table' });
  }
});

export default router;
