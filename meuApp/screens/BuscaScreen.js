import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'https://www.themealdb.com/api/json/v1/1';

export default function BuscaScreen({ navigation }) {
  const [ingrediente, setIngrediente] = useState('');
  const [ingredientes, setIngredientes] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [buscaFeita, setBuscaFeita] = useState(false);
  const [erro, setErro] = useState('');

  // Adiciona ingrediente como tag
  const adicionarIngrediente = () => {
    const valor = ingrediente.trim().toLowerCase();
    if (!valor) return;
    if (ingredientes.includes(valor)) {
      setIngrediente('');
      return;
    }
    setIngredientes((prev) => [...prev, valor]);
    setIngrediente('');
  };

  // Remove ingrediente da lista
  const removerIngrediente = (item) => {
    setIngredientes((prev) => prev.filter((i) => i !== item));
  };

  // Busca receitas na TheMealDB pelo primeiro ingrediente,
  // depois filtra localmente pelos demais
const buscarReceitas = useCallback(async () => {
    if (ingredientes.length === 0) {
      setErro('Adicione pelo menos um ingrediente.');
      return;
    }
    setErro('');
    setCarregando(true);
    setBuscaFeita(false);
    setReceitas([]);

    try {
      const response = await fetch(
        `${API_URL}/search.php?s=${encodeURIComponent(ingredientes[0])}`
      );
      const data = await response.json();

      if (!data.meals) {
        setBuscaFeita(true);
        setCarregando(false);
        return;
      }

      // Com apenas 1 ingrediente: retorna direto
      if (ingredientes.length === 1) {
        setReceitas(data.meals);
        setBuscaFeita(true);
        setCarregando(false);
        return;
      }

      // Com 2+ ingredientes: busca detalhes e filtra localmente
      const detalhes = await Promise.all(
        data.meals.slice(0, 20).map((meal) =>
          fetch(`${API_URL}/lookup.php?i=${meal.idMeal}`)
            .then((r) => r.json())
            .then((d) => d.meals?.[0])
        )
      );

      const filtradas = detalhes.filter((meal) => {
        if (!meal) return false;
        const ingsReceita = [];
        for (let i = 1; i <= 20; i++) {
          const ing = meal[`strIngredient${i}`];
          if (ing && ing.trim()) ingsReceita.push(ing.toLowerCase());
        }
        return ingredientes.every((ing) =>
          ingsReceita.some((r) => r.includes(ing))
        );
      });

      setReceitas(filtradas);
    } catch {
      setErro('Erro ao buscar receitas. Verifique sua conexão.');
    } finally {
      setCarregando(false);
      setBuscaFeita(true);
    }
  }, [ingredientes]);

  const renderTag = (item) => (
    <TouchableOpacity
      key={item}
      style={styles.tag}
      onPress={() => removerIngrediente(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.tagTexto}>{item}</Text>
      <Text style={styles.tagX}>✕</Text>
    </TouchableOpacity>
  );

  const renderReceita = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() =>
        navigation.navigate('Detalhe', { idMeal: item.idMeal })
      }
    >
      <Image
        source={{ uri: item.strMealThumb }}
        style={styles.cardImagem}
        resizeMode="cover"
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardNome} numberOfLines={2}>
          {item.strMeal}
        </Text>
        <View style={styles.cardRodape}>
          {item.strCategory ? (
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>{item.strCategory}</Text>
            </View>
          ) : null}
          <Text style={styles.cardSeta}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8F3" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitulo}>O que temos hoje? 🍳</Text>
            <Text style={styles.headerSub}>Informe os ingredientes disponíveis</Text>
          </View>
          <TouchableOpacity style={styles.perfilBtn} activeOpacity={0.7}>
            <Text style={styles.perfilIcone}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Input de ingrediente */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Adicionar ingrediente..."
            placeholderTextColor="#C4A882"
            value={ingrediente}
            onChangeText={setIngrediente}
            onSubmitEditing={adicionarIngrediente}
            returnKeyType="done"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.addBtn}
            onPress={adicionarIngrediente}
            activeOpacity={0.8}
          >
            <Text style={styles.addBtnTexto}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Tags dos ingredientes */}
        {ingredientes.length > 0 && (
          <View style={styles.tagsArea}>
            <Text style={styles.tagsRotulo}>Ingredientes selecionados</Text>
            <View style={styles.tagsLinha}>
              {ingredientes.map(renderTag)}
            </View>
          </View>
        )}

        {/* Erro de validação */}
        {erro ? <Text style={styles.textoErro}>{erro}</Text> : null}

        {/* Botão buscar */}
        <TouchableOpacity
          style={[
            styles.botaoBuscar,
            (ingredientes.length === 0 || carregando) &&
              styles.botaoBuscarDesabilitado,
          ]}
          onPress={buscarReceitas}
          disabled={ingredientes.length === 0 || carregando}
          activeOpacity={0.85}
        >
          {carregando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.botaoBuscarTexto}>🔍  Buscar receitas</Text>
          )}
        </TouchableOpacity>

        {/* Contador de resultados */}
        {buscaFeita && !carregando && (
          <Text style={styles.contador}>
            {receitas.length > 0
              ? `${receitas.length} receita${receitas.length > 1 ? 's' : ''} encontrada${receitas.length > 1 ? 's' : ''}`
              : 'Nenhuma receita encontrada para esses ingredientes.'}
          </Text>
        )}

        {/* Lista de receitas */}
        <FlatList
          data={receitas}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderReceita}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            buscaFeita && !carregando && receitas.length === 0 ? (
              <View style={styles.vazio}>
                <Text style={styles.vazioIcone}>😕</Text>
                <Text style={styles.vazioTexto}>
                  Tente outros ingredientes ou remova alguns da lista.
                </Text>
              </View>
            ) : null
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 13,
    color: '#8A6A50',
    marginTop: 2,
  },
  perfilBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8D5C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfilIcone: {
    fontSize: 18,
  },

  // Input
  inputRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8D5C4',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#1A1A1A',
  },
  addBtn: {
    width: 50,
    backgroundColor: '#FF6B35',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnTexto: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 30,
  },

  // Tags
  tagsArea: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  tagsRotulo: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8A6A50',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tagsLinha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  tagTexto: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  tagX: {
    color: '#FFCDB8',
    fontSize: 11,
    fontWeight: '700',
  },

  // Erro
  textoErro: {
    fontSize: 13,
    color: '#E53E3E',
    marginHorizontal: 20,
    marginBottom: 10,
  },

  // Botão buscar
  botaoBuscar: {
    backgroundColor: '#FF6B35',
    marginHorizontal: 20,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 16,
  },
  botaoBuscarDesabilitado: {
    backgroundColor: '#F0C4A8',
  },
  botaoBuscarTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Contador
  contador: {
    fontSize: 13,
    color: '#8A6A50',
    marginHorizontal: 20,
    marginBottom: 12,
    fontWeight: '500',
  },

  // Lista
  lista: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },

  // Card de receita
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  cardImagem: {
    width: 90,
    height: 90,
  },
  cardInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  cardNome: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 20,
  },
  cardRodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#FFF0E8',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeTexto: {
    fontSize: 11,
    color: '#FF6B35',
    fontWeight: '600',
  },
  cardSeta: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '700',
  },

  // Estado vazio
  vazio: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 40,
  },
  vazioIcone: {
    fontSize: 40,
    marginBottom: 12,
  },
  vazioTexto: {
    fontSize: 14,
    color: '#8A6A50',
    textAlign: 'center',
    lineHeight: 22,
  },
});