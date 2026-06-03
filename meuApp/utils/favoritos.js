import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@recipesnap:favoritos';

/**
 * Retorna a lista completa de receitas favoritas salvas.
 * @returns {Promise<Array>}
 */
export async function getFavoritos() {
  try {
    const json = await AsyncStorage.getItem(CHAVE);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

/**
 * Verifica se uma receita (por idMeal) está nos favoritos.
 * @param {string} idMeal
 * @returns {Promise<boolean>}
 */
export async function isFavorito(idMeal) {
  const lista = await getFavoritos();
  return lista.some((r) => r.idMeal === idMeal);
}

/**
 * Adiciona ou remove uma receita dos favoritos (toggle).
 * Retorna true se adicionou, false se removeu.
 * @param {object} receita - objeto completo da refeição (TheMealDB)
 * @returns {Promise<boolean>}
 */
export async function toggleFavorito(receita) {
  const lista = await getFavoritos();
  const jaExiste = lista.some((r) => r.idMeal === receita.idMeal);

  let novaLista;
  if (jaExiste) {
    novaLista = lista.filter((r) => r.idMeal !== receita.idMeal);
  } else {
    // Salva apenas os campos necessários para economizar espaço
    const resumo = {
      idMeal: receita.idMeal,
      strMeal: receita.strMeal,
      strMealThumb: receita.strMealThumb,
      strCategory: receita.strCategory || '',
      strArea: receita.strArea || '',
    };
    novaLista = [resumo, ...lista];
  }

  await AsyncStorage.setItem(CHAVE, JSON.stringify(novaLista));
  return !jaExiste;
}

/**
 * Remove um favorito pelo idMeal.
 * @param {string} idMeal
 */
export async function removerFavorito(idMeal) {
  const lista = await getFavoritos();
  const novaLista = lista.filter((r) => r.idMeal !== idMeal);
  await AsyncStorage.setItem(CHAVE, JSON.stringify(novaLista));
}

/**
 * Limpa todos os favoritos.
 */
export async function limparFavoritos() {
  await AsyncStorage.removeItem(CHAVE);
}
