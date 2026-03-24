import express from 'express';
import { GameService } from '../services/game.service.js';

const route = express.Router();
const service = new GameService();

route.get('/', (req, res) =>{
    const data = service.getAll();
    return res.json(data);
})

export default route;