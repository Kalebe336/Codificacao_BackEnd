import express from 'express';
import { FruitsService } from '../service/fruit.service.js';

const router = express.Router();
const service = new FruitsService();

// PATCH /fruits/:id - atualizar parcialmente
router.patch('/:id', (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'id inválido' });

        const payload = req.body;
        if (!payload || typeof payload !== 'object') return res.status(400).json({ error: 'payload inválido' });

        if (payload.name !== undefined && typeof payload.name !== 'string') {
            return res.status(422).json({ error: 'campo "name" deve ser string' });
        }

        const updated = service.updatePartial(id, payload);
        if (!updated) return res.status(404).json({ error: 'fruta não encontrada' });

        return res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
});

// PUT /fruits/:id - substituir todos os dados
router.put('/:id', (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'id inválido' });

        const payload = req.body;
        if (payload.name === undefined || typeof payload.name !== 'string') {
            return res.status(422).json({ error: 'campo "name" obrigatório e deve ser string' });
        }

        const replaced = service.replace(id, payload);
        if (!replaced) return res.status(404).json({ error: 'fruta não encontrada' });

        return res.status(200).json(replaced);
    } catch (err) {
        next(err);
    }
});

export default router;