import express from 'express';

import userRoutes from './user.routes.js';
import employeeRoutes from './employee.routes.js';
import projectRoutes from './project.routes.js';
import clientRoutes from './client.routes.js';
import taskRoutes from './task.routes.js';
import serviceRoutes from './service.routes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/employees', employeeRoutes);
router.use('/projects', projectRoutes);
router.use('/clients', clientRoutes);
router.use('/tasks', taskRoutes);
router.use('/services', serviceRoutes);

export default router;