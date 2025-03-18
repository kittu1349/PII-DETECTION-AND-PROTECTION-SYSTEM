import express from 'express';
import { getAllUsers } from '../controllers/admin.js';

const router = express.Router();

router.get('/admin-dashboard', getAllUsers);

export default router;