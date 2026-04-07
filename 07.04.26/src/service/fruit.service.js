const fruits = [
    { id: 1, name: 'Maça' },
    { id: 2, name: 'Pera' }
];

export class FruitsService {
    getAll() {
        return fruits;
    }

    getById(id) {
        return fruits.find(f => f.id === id) ?? null;
    }

    updatePartial(id, data) {
        const idx = fruits.findIndex(f => f.id === id);
        if (idx === -1) return null;

        fruits[idx].name = data.name
        return fruits;
    }

    replace(id, data) {
        const idx = fruits.findIndex(f => f.id === id);
        if (idx === -1) return null;

        // Substitui tudo, mas garante que o ID continue o mesmo
        const replaced = { id: fruits[idx].id, ...data };
        fruits[idx] = replaced;
        return replaced;
    }
}