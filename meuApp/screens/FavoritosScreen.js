import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getFavoritos, removerFavorito, limparFavoritos } from '../utils/favoritos';

export default function FavoritosScreen({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Recarrega toda vez que a aba recebe foco
  useFocusEffect(
    useCallback(() => {
      carregarFavoritos();
    }, [])
  );

  const carregarFavoritos = async () => {
    setCarregando(true);
    const lista = await getFavoritos();
    setFavoritos(lista);
    setCarregando(false);
  };

  const handleRemover = (idMeal, nome) => {
    Alert.alert(
      'Remover favorito',
      `Remover "${nome}" dos favoritos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            await removerFavorito(idMeal);
            setFavoritos((prev) => prev.filter((r) => r.idMeal !== idMeal));
          },
        },
      ]
    );
  };

  const handleLimparTodos = () => {
    if (favoritos.length === 0) return;
    Alert.alert(
      'Limpar favoritos',
      'Remover todas as receitas favoritas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar tudo',
          style: 'destructive',
          onPress: async () => {
            await limparFavoritos();
            setFavoritos([]);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('Detalhe', { idMeal: item.idMeal })}
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
          {item.strArea ? (
            <View style={[styles.badge, styles.badgeArea]}>
              <Text style={[styles.badgeTexto, styles.badgeTextoArea]}>{item.strArea}</Text>
            </View>
          ) : null}
        </View>
      </View>
      <TouchableOpacity
        style={styles.btnRemover}
        onPress={() => handleRemover(item.idMeal, item.strMeal)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        activeOpacity={0.7}
      >
        <Text style={styles.btnRemoverIcone}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8F3" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitulo}>Favoritos ❤️</Text>
          <Text style={styles.headerSub}>
            {favoritos.length > 0
              ? `${favoritos.length} receita${favoritos.length > 1 ? 's' : ''} salva${favoritos.length > 1 ? 's' : ''}`
              : 'Nenhuma receita salva ainda'}
          </Text>
        </View>
        {favoritos.length > 0 && (
          <TouchableOpacity
            style={styles.btnLimpar}
            onPress={handleLimparTodos}
            activeOpacity={0.7}
          >
            <Text style={styles.btnLimparTexto}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.idMeal}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !carregando ? (
            <View style={styles.vazio}>
              <Text style={styles.vazioIcone}>🤍</Text>
              <Text style={styles.vazioTitulo}>Sem favoritos ainda</Text>
              <Text style={styles.vazioTexto}>
                Abra uma receita e toque no coração para salvá-la aqui.
              </Text>
              <TouchableOpacity
                style={styles.btnBuscar}
                onPress={() => navigation.navigate('Busca')}
                activeOpacity={0.85}
              >
                <Text style={styles.btnBuscarTexto}>🔍  Buscar receitas</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
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
  btnLimpar: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E8D5C4',
    backgroundColor: '#FFFFFF',
  },
  btnLimparTexto: {
    fontSize: 13,
    color: '#8A6A50',
    fontWeight: '600',
  },
  lista: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0E0D0',
    alignItems: 'center',
  },
  cardImagem: {
    width: 86,
    height: 86,
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
    marginBottom: 8,
  },
  cardRodape: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: '#FFF0E8',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeArea: {
    backgroundColor: '#F2E8DF',
  },
  badgeTexto: {
    fontSize: 11,
    color: '#FF6B35',
    fontWeight: '600',
  },
  badgeTextoArea: {
    color: '#8A6A50',
  },
  btnRemover: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  btnRemoverIcone: {
    fontSize: 14,
    color: '#C4A882',
    fontWeight: '700',
  },
  // Estado vazio
  vazio: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  vazioIcone: {
    fontSize: 52,
    marginBottom: 16,
  },
  vazioTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  vazioTexto: {
    fontSize: 14,
    color: '#8A6A50',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  btnBuscar: {
    backgroundColor: '#FF6B35',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  btnBuscarTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
