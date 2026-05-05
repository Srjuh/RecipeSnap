import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Linking,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'https://www.themealdb.com/api/json/v1/1';

export default function DetalheScreen({ route, navigation }) {
  const { idMeal } = route.params;

  const [receita, setReceita] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [abaAtiva, setAbaAtiva] = useState('ingredientes'); // 'ingredientes' | 'preparo'

  useEffect(() => {
    buscarDetalhe();
  }, [idMeal]);

  const buscarDetalhe = async () => {
    setCarregando(true);
    setErro('');
    try {
      const response = await fetch(`${API_URL}/lookup.php?i=${idMeal}`);
      const data = await response.json();
      if (data.meals && data.meals.length > 0) {
        setReceita(data.meals[0]);
      } else {
        setErro('Receita não encontrada.');
      }
    } catch {
      setErro('Erro ao carregar receita. Verifique sua conexão.');
    } finally {
      setCarregando(false);
    }
  };

  // Extrai lista de ingredientes + medidas da receita
  const extrairIngredientes = (meal) => {
    const lista = [];
    for (let i = 1; i <= 20; i++) {
      const ingrediente = meal[`strIngredient${i}`];
      const medida = meal[`strMeasure${i}`];
      if (ingrediente && ingrediente.trim()) {
        lista.push({
          ingrediente: ingrediente.trim(),
          medida: medida ? medida.trim() : '',
        });
      }
    }
    return lista;
  };

  // Divide o modo de preparo em passos (por número ou por parágrafo)
  const extrairPassos = (instrucoes) => {
    if (!instrucoes) return [];
    // Tenta separar por padrão "1. 2. 3." ou por linhas
    const porNumero = instrucoes.split(/\r?\n(?=\d+\.)/);
    if (porNumero.length > 2) {
      return porNumero.map((p) => p.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
    }
    return instrucoes
      .split(/\r?\n\r?\n|\r\n\r\n/)
      .map((p) => p.replace(/\r?\n/g, ' ').trim())
      .filter(Boolean);
  };

  if (carregando) {
    return (
      <SafeAreaView style={styles.centro}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.carregandoTexto}>Carregando receita...</Text>
      </SafeAreaView>
    );
  }

  if (erro) {
    return (
      <SafeAreaView style={styles.centro}>
        <Text style={styles.erroIcone}>😕</Text>
        <Text style={styles.erroTexto}>{erro}</Text>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
          <Text style={styles.btnVoltarTexto}>← Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const ingredientes = extrairIngredientes(receita);
  const passos = extrairPassos(receita.strInstructions);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* Imagem hero + botão voltar sobreposto */}
        <View style={styles.heroWrapper}>
          <Image
            source={{ uri: receita.strMealThumb }}
            style={styles.heroImagem}
            resizeMode="cover"
          />
          {/* Gradiente simulado com View */}
          <View style={styles.heroGradiente} />

          <TouchableOpacity
            style={styles.btnVoltarHero}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.btnVoltarHeroTexto}>←</Text>
          </TouchableOpacity>

          {/* Badges sobre a imagem */}
          <View style={styles.heroBadges}>
            {receita.strCategory ? (
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeTexto}>{receita.strCategory}</Text>
              </View>
            ) : null}
            {receita.strArea ? (
              <View style={[styles.heroBadge, styles.heroBadgeArea]}>
                <Text style={styles.heroBadgeTexto}>{receita.strArea}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Conteúdo principal */}
        <View style={styles.conteudo}>
          {/* Título */}
          <Text style={styles.titulo}>{receita.strMeal}</Text>

          {/* Tags da receita */}
          {receita.strTags ? (
            <View style={styles.tagsLinha}>
              {receita.strTags.split(',').map((tag) =>
                tag.trim() ? (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagTexto}>{tag.trim()}</Text>
                  </View>
                ) : null
              )}
            </View>
          ) : null}

          {/* Abas */}
          <View style={styles.abas}>
            <TouchableOpacity
              style={[styles.aba, abaAtiva === 'ingredientes' && styles.abaAtiva]}
              onPress={() => setAbaAtiva('ingredientes')}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.abaTexto, abaAtiva === 'ingredientes' && styles.abaTextoAtivo]}
              >
                🧂 Ingredientes ({ingredientes.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.aba, abaAtiva === 'preparo' && styles.abaAtiva]}
              onPress={() => setAbaAtiva('preparo')}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.abaTexto, abaAtiva === 'preparo' && styles.abaTextoAtivo]}
              >
                👨‍🍳 Preparo
              </Text>
            </TouchableOpacity>
          </View>

          {/* Conteúdo das abas */}
          {abaAtiva === 'ingredientes' ? (
            <View style={styles.secao}>
              {ingredientes.map(({ ingrediente, medida }, index) => (
                <View key={index} style={styles.ingredienteItem}>
                  <View style={styles.ingredienteEsquerda}>
                    <View style={styles.ingredienteBullet}>
                      <Text style={styles.ingredienteBulletTexto}>{index + 1}</Text>
                    </View>
                    <Text style={styles.ingredienteNome}>{ingrediente}</Text>
                  </View>
                  {medida ? (
                    <View style={styles.medidaBadge}>
                      <Text style={styles.medidaTexto}>{medida}</Text>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.secao}>
              {passos.length > 0 ? (
                passos.map((passo, index) => (
                  <View key={index} style={styles.passoItem}>
                    <View style={styles.passoNumeroWrapper}>
                      <Text style={styles.passoNumero}>{index + 1}</Text>
                      {index < passos.length - 1 && <View style={styles.passoLinha} />}
                    </View>
                    <Text style={styles.passoTexto}>{passo}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.semDados}>Instruções não disponíveis.</Text>
              )}
            </View>
          )}

          {/* Botão YouTube */}
          {receita.strYoutube ? (
            <TouchableOpacity
              style={styles.btnYoutube}
              onPress={() => Linking.openURL(receita.strYoutube)}
              activeOpacity={0.85}
            >
              <Text style={styles.btnYoutubeTexto}>▶  Assistir no YouTube</Text>
            </TouchableOpacity>
          ) : null}

          {/* Fonte */}
          {receita.strSource ? (
            <TouchableOpacity
              style={styles.btnFonte}
              onPress={() => Linking.openURL(receita.strSource)}
              activeOpacity={0.85}
            >
              <Text style={styles.btnFonteTexto}>🔗  Ver receita original</Text>
            </TouchableOpacity>
          ) : null}

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },

  // Estados de carregamento / erro
  centro: {
    flex: 1,
    backgroundColor: '#FFF8F3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  carregandoTexto: {
    marginTop: 14,
    fontSize: 15,
    color: '#8A6A50',
  },
  erroIcone: {
    fontSize: 48,
    marginBottom: 12,
  },
  erroTexto: {
    fontSize: 15,
    color: '#8A6A50',
    textAlign: 'center',
    marginBottom: 24,
  },
  btnVoltar: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FF6B35',
    borderRadius: 14,
  },
  btnVoltarTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },

  // Hero
  heroWrapper: {
    position: 'relative',
    height: 280,
  },
  heroImagem: {
    width: '100%',
    height: '100%',
  },
  heroGradiente: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(255,248,243,0.6)',
  },
  btnVoltarHero: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  btnVoltarHeroTexto: {
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '700',
  },
  heroBadges: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  heroBadge: {
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroBadgeArea: {
    backgroundColor: '#8A6A50',
  },
  heroBadgeTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Conteúdo
  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 30,
    letterSpacing: -0.4,
    marginBottom: 10,
  },

  // Tags
  tagsLinha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#FFF0E8',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#F0D0B8',
  },
  tagTexto: {
    color: '#FF6B35',
    fontSize: 12,
    fontWeight: '600',
  },

  // Abas
  abas: {
    flexDirection: 'row',
    backgroundColor: '#F2E8DF',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  aba: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  abaAtiva: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  abaTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A6A50',
  },
  abaTextoAtivo: {
    color: '#FF6B35',
  },

  // Seção genérica
  secao: {
    marginBottom: 20,
  },
  semDados: {
    fontSize: 14,
    color: '#8A6A50',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },

  // Ingredientes
  ingredienteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E0D0',
  },
  ingredienteEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  ingredienteBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF0E8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFD5BC',
  },
  ingredienteBulletTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6B35',
  },
  ingredienteNome: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
    flex: 1,
  },
  medidaBadge: {
    backgroundColor: '#F2E8DF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
  },
  medidaTexto: {
    fontSize: 13,
    color: '#8A6A50',
    fontWeight: '600',
  },

  // Passos de preparo
  passoItem: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 14,
  },
  passoNumeroWrapper: {
    alignItems: 'center',
    width: 28,
  },
  passoNumero: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B35',
    textAlign: 'center',
    lineHeight: 28,
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    overflow: 'hidden',
  },
  passoLinha: {
    flex: 1,
    width: 2,
    backgroundColor: '#F0D0B8',
    marginTop: 4,
    marginBottom: 0,
    minHeight: 16,
  },
  passoTexto: {
    flex: 1,
    fontSize: 14,
    color: '#3A2A1A',
    lineHeight: 22,
    paddingBottom: 20,
  },

  // Botões externos
  btnYoutube: {
    backgroundColor: '#FF0000',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnYoutubeTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  btnFonte: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E8D5C4',
    marginBottom: 12,
  },
  btnFonteTexto: {
    color: '#8A6A50',
    fontSize: 15,
    fontWeight: '700',
  },
});