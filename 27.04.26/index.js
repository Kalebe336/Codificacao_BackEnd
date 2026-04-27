import fs from 'fs/promises';

const file = new URL('./fruits.json', import.meta.url);

async function ensureFile() {
  try {
    await fs.access(file);
  } catch (err) {
    // If file doesn't exist, create with an empty array
    await fs.writeFile(file, '[]', 'utf-8');
  }
}

async function readFruits() {
  await ensureFile();
  const raw = await fs.readFile(file, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    // If parsing fails, reset to empty array to avoid crashes
    await fs.writeFile(file, '[]', 'utf-8');
    return [];
  }
}

async function writeFruits(fruits) {
  const data = JSON.stringify(fruits, null, 2);
  await fs.writeFile(file, data, 'utf-8');
}

async function getAllFruits() {
  return await readFruits();
}

async function getFruitById(id) {
  const fruits = await readFruits();
  return fruits.find(f => f.id === Number(id)) || null;
}

async function createFruit(nome) {
  const fruits = await readFruits();
  const alreadyExists = fruits.some(
    item => String(item.nome).toLowerCase() === String(nome).toLowerCase()
  );
  if (alreadyExists) return null;

  const newId = fruits.length > 0 ? Math.max(...fruits.map(f => f.id)) + 1 : 1;
  const newFruit = { id: newId, nome };
  fruits.push(newFruit);
  await writeFruits(fruits);
  return newFruit;
}

async function updateFruit(id, novoNome) {
  const fruits = await readFruits();
  const idx = fruits.findIndex(f => f.id === Number(id));
  if (idx === -1) return null;
  fruits[idx].nome = novoNome;
  await writeFruits(fruits);
  return fruits[idx];
}

async function deleteFruit(id) {
  const fruits = await readFruits();
  const initialLen = fruits.length;
  const filtered = fruits.filter(f => f.id !== Number(id));
  if (filtered.length === initialLen) return false;
  await writeFruits(filtered);
  return true;
}

// Small demo when running directly: lists, gets, creates (if not present), updates and deletes
if (process.argv[1] && process.argv[1].endsWith('index.js')) {
  (async () => {
    console.log('Todas as frutas:');
    console.log(await getAllFruits());

    console.log('\nBuscar fruta por id (1):');
    console.log(await getFruitById(1));

    console.log('\nTentar criar "Abacaxi" (não duplicará se já existir):');
    const created = await createFruit('Abacaxi');
    console.log(created ? created : 'Abacaxi já existe — não foi criada.');

    console.log('\nAtualizar id=1 para "Maçã Gala":');
    console.log(await updateFruit(1, 'Maçã Gala'));

    console.log('\nRemover id=3 (se existir):');
    console.log(await deleteFruit(3));

    console.log('\nLista final:');
    console.log(await getAllFruits());
  })().catch(err => {
    console.error('Erro na execução de demonstração:', err);
    process.exitCode = 1;
  });
}

export {
  readFruits,
  writeFruits,
  getAllFruits,
  getFruitById,
  createFruit,
  updateFruit,
  deleteFruit,
};