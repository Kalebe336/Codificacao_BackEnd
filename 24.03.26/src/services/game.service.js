const game = [
    {id: 1, name: 'Sonic', ano: '2015', preco: '30.00'},
    {id: 2, name: 'Mario', ano: '2010', preco: '45.00'},
    {id: 3, name: 'Minecraft', ano: '2011', preco: '57.00'}
]

export class GameService {
    getAll() {
        return game
    }
}