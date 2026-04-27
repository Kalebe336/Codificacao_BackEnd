// Importando o módulo 'fs/promises' para manipular arquivos de forma assíncrona
import fs from "fs/promises";

// =========================================================
// FUNÇÕES BASE DE LEITURA E ESCRITA
// =========================================================

// Função para ler o arquivo JSON e converter o texto em um array JavaScript
async function readFruits() {
  const data = await fs.readFile("./fruits.json", "utf-8");
  const fruits = JSON.parse(data);
  return fruits;
}

// Função para transformar o array em texto JSON e salvar no arquivo
async function writeFruits(fruits) {
  // Usando null e 2 no stringify para deixar o JSON identado e fácil de ler
  const data = JSON.stringify(fruits, null, 2);
  await fs.writeFile("./fruits.json", data, "utf-8");
}

// =========================================================
// FUNÇÕES DO CRUD BÁSICO
// =========================================================

// Retorna todas as frutas que estão salvas no arquivo
async function getAllFruits() {
  const fruits = await readFruits();
  return fruits;
}

// Busca uma fruta específica usando o seu ID
async function getFruitById(id) {
  const fruits = await readFruits();
  // Converte o id para número antes de comparar, evitando erros de busca
  const fruit = fruits.find(item => item.id === Number(id));
  return fruit;
}

// Atualiza o nome de uma fruta existente pelo ID
async function updateFruit(id, novoNome) {
  const fruits = await readFruits();
  const index = fruits.findIndex(item => item.id === Number(id));

  // Se o index for -1, significa que a fruta não foi encontrada no array
  if (index === -1) {
    return null;
  }

  // Altera o nome e salva o array inteiro novamente
  fruits[index].nome = novoNome;
  await writeFruits(fruits); 
  return fruits[index];
}

// Remove uma fruta do arquivo usando o ID
async function deleteFruit(id) {
  const fruits = await readFruits();
  const index = fruits.findIndex(item => item.id === Number(id));

  if (index === -1) {
    return false; // Retorna falso se não achar a fruta para deletar
  }

  // Remove 1 elemento a partir da posição (index) encontrada
  fruits.splice(index, 1);
  await writeFruits(fruits); // Grava o array atualizado no arquivo
  return true;
}

// =========================================================
// FUNÇÕES DOS DESAFIOS EXTRAS
// =========================================================

// Cadastra uma nova fruta (Desafio: sem duplicatas, com cor, preço e mensagens)
async function createFruit(nome, cor, preco) {
  const fruits = await readFruits();
  
  // Verifica se já existe alguma fruta com esse nome (ignorando maiúsculas/minúsculas)
  const alreadyExists = fruits.some(
    item => item.nome.toLowerCase() === nome.toLowerCase()
  );
  
  if (alreadyExists) {
    console.log(`Erro: A fruta '${nome}' já está cadastrada.`);
    return null; // Interrompe a função para não duplicar
  }

  // Monta o novo objeto incluindo os campos extras do desafio
  const newFruit = {
    id: fruits.length > 0 ? fruits[fruits.length - 1].id + 1 : 1,
    nome: nome,
    cor: cor,
    preco: preco
  };

  fruits.push(newFruit); 
  await writeFruits(fruits); 
  
  console.log(`Sucesso: Fruta '${nome}' cadastrada!`);
  return newFruit;
}

// Busca uma fruta pelo nome exato (Desafio: busca por nome)
async function getFruitByName(nome) {
  const fruits = await readFruits();
  const fruit = fruits.find(item => item.nome.toLowerCase() === nome.toLowerCase());

  if (fruit) {
    console.log(`Sucesso: Fruta '${nome}' encontrada.`);
  } else {
    console.log(`Aviso: Nenhuma fruta com o nome '${nome}' foi encontrada.`);
  }
  
  return fruit || null;
}

// Limpa todos os dados do arquivo JSON (Desafio: resetar arquivo)
async function resetFruits() {
  await writeFruits([]); // Passa um array vazio para sobrescrever tudo
  console.log("Sucesso: O arquivo fruits.json foi resetado e agora está vazio.");
}

// =========================================================
// TESTES (ÁREA DE EXECUÇÃO)
// =========================================================

// Aqui você testa o código na prática. 
// Remova as barras (//) para executar a função que quiser testar.

// 1. Cadastrando novas frutas (Testando desafio de cor e preço)
// await createFruit("Morango", "Vermelho", 8.50);
// await createFruit("Uva", "Roxa", 12.00);

// 2