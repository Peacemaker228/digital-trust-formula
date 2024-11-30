import { Router, type Request, type Response } from 'express';
import prisma from '../prismaClient';

const router = Router();

/**
 * @route POST /formulas
 * @description Создает новую кастомную формулу.
 * @param {Request} req - Запрос, содержащий тело с параметрами:
 *   @param {string} req.body.name - Имя кастомной формулы.
 *   @param {string} [req.body.description] - Описание формулы (опционально).
 *   @param {string} req.body.implementation - Реализация формулы в виде строки кода JavaScript/TypeScript.
 * @param {Response} res - Ответ сервера.
 *   @returns {201} Возвращает созданную формулу.
 *   @returns {400} Если отсутствуют обязательные параметры.
 *   @returns {500} Если произошла ошибка при сохранении формулы.
 * @returns {Promise<void>}
 */
router.post('/formulas', async (req: Request, res: Response): Promise<void> => {
  const { name, description, implementation } = req.body;

  if (!name || !implementation) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const formula = await prisma.customFormula.create({
      data: { name, description, implementation },
    });

    res.status(201).json(formula);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save formula' });
  }
});

/**
 * @route GET /formulas
 * @description Получает список всех кастомных формул.
 * @param {Request} req - Запрос без параметров.
 * @param {Response} res - Ответ сервера.
 *   @returns {200} Список формул в формате JSON.
 *   @returns {500} Если произошла ошибка при получении формул.
 * @returns {Promise<void>}
 */
router.get('/formulas', async (req: Request, res: Response): Promise<void> => {
  try {
    const formulas = await prisma.customFormula.findMany();
    res.json(formulas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch formulas' });
  }
});

export default router;
