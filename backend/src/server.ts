import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger';
import tablesRoutes from './routes/tables';
import cellsRoutes from './routes/cells';
import formulasRoutes from './routes/formulas';
import cellStylesRoutes from './routes/cellStyles';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка CORS
app.use(cors({
  origin: ['http://localhost:4000'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Подключение маршрутов
app.use('/api', tablesRoutes);
app.use('/api', cellsRoutes);
app.use('/api', formulasRoutes);
app.use('/api', cellStylesRoutes);

// Подключение Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware для обработки ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});