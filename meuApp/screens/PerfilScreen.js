import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getFavoritos, limparFavoritos } from '../utils/favoritos';
import {
  agendarNotificacaoDiaria,
  cancelarNotificacaoDiaria,
  solicitarPermissao,
} from '../utils/notificacoes';

export default function PerfilScreen({ navigation }) {
  const [totalFavoritos, setTotalFavoritos] = useState(0);
  const [notificacaoAtiva, setNotificacaoAtiva] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getFavoritos().then((lista) => setTotalFavoritos(lista.length));
    }, [])
  );

  const handleToggleNotificacao = async (valor) => {
    if (valor) {
      const permitido = await solicitarPermissao();
      if (!permitido) {
        Alert.alert(
          'Permissão negada',
          'Ative as notificações nas configurações do celular para usar esse recurso.'
        );
        return;
      }
      await agendarNotificacaoDiaria();
      setNotificacaoAtiva(true);
      Alert.alert('✅ Ativado!', 'Você receberá um lembrete diário às 12h para cozinhar algo novo.');
    } else {
      await cancelarNotificacaoDiaria();
      setNotificacaoAtiva(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => navigation.replace('Login'),
      },
    ]);
  };

  const handleLimparFavoritos = () => {
    if (totalFavoritos === 0) {
      Alert.alert('Favoritos', 'Você não tem receitas favoritas salvas.');
      return;
    }
    Alert.alert('Limpar favoritos', 'Remover todas as receitas favoritas?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar tudo',
        style: 'destructive',
        onPress: async () => {
          await limparFavoritos();
          setTotalFavoritos(0);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8F3" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>👨‍🍳</Text>
          </View>
          <Text style={styles.nomeUsuario}>Bem-vindo!</Text>
          <Text style={styles.subUsuario}>RecipeSnap · Sua conta</Text>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumero}>{totalFavoritos}</Text>
            <Text style={styles.statLabel}>Favoritas</Text>
          </View>
          <View style={styles.statDivisor} />
          <View style={styles.statCard}>
            <Text style={styles.statNumero}>∞</Text>
            <Text style={styles.statLabel}>Receitas</Text>
          </View>
          <View style={styles.statDivisor} />
          <View style={styles.statCard}>
            <Text style={styles.statNumero}>🍽️</Text>
            <Text style={styles.statLabel}>Cozinhando</Text>
          </View>
        </View>

        {/* Notificações */}
        <Text style={styles.secaoTitulo}>Notificações</Text>
        <View style={styles.grupo}>
          <View style={styles.item}>
            <View style={[styles.itemIconeWrapper, { backgroundColor: '#FFF8E8' }]}>
              <Text style={styles.itemIcone}>🔔</Text>
            </View>
            <View style={styles.itemTextos}>
              <Text style={styles.itemTitulo}>Lembrete diário</Text>
              <Text style={styles.itemSub}>Receba uma dica às 12h para cozinhar</Text>
            </View>
            <Switch
              value={notificacaoAtiva}
              onValueChange={handleToggleNotificacao}
              trackColor={{ false: '#E8D5C4', true: '#FF6B35' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.separador} />
          <View style={styles.item}>
            <View style={[styles.itemIconeWrapper, { backgroundColor: '#FFF0E8' }]}>
              <Text style={styles.itemIcone}>❤️</Text>
            </View>
            <View style={styles.itemTextos}>
              <Text style={styles.itemTitulo}>Ao favoritar</Text>
              <Text style={styles.itemSub}>Confirmação ao salvar uma receita</Text>
            </View>
            <View style={styles.badgeAtivo}>
              <Text style={styles.badgeAtivoTexto}>Sempre ativo</Text>
            </View>
          </View>
        </View>

        {/* Dados */}
        <Text style={styles.secaoTitulo}>Dados</Text>
        <View style={styles.grupo}>
          <TouchableOpacity
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Favoritos')}
          >
            <View style={[styles.itemIconeWrapper, { backgroundColor: '#FFF0E8' }]}>
              <Text style={styles.itemIcone}>🗂️</Text>
            </View>
            <View style={styles.itemTextos}>
              <Text style={styles.itemTitulo}>Receitas favoritas</Text>
              <Text style={styles.itemSub}>{totalFavoritos} salvas</Text>
            </View>
            <Text style={styles.itemSeta}>›</Text>
          </TouchableOpacity>

          <View style={styles.separador} />

          <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={handleLimparFavoritos}>
            <View style={[styles.itemIconeWrapper, { backgroundColor: '#FFF0E8' }]}>
              <Text style={styles.itemIcone}>🗑️</Text>
            </View>
            <View style={styles.itemTextos}>
              <Text style={styles.itemTitulo}>Limpar favoritos</Text>
              <Text style={styles.itemSub}>Remove todas as receitas salvas</Text>
            </View>
            <Text style={styles.itemSeta}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Sobre */}
        <Text style={styles.secaoTitulo}>Sobre</Text>
        <View style={styles.grupo}>
          <View style={styles.item}>
            <View style={[styles.itemIconeWrapper, { backgroundColor: '#E8F4FF' }]}>
              <Text style={styles.itemIcone}>🌐</Text>
            </View>
            <View style={styles.itemTextos}>
              <Text style={styles.itemTitulo}>API utilizada</Text>
              <Text style={styles.itemSub}>TheMealDB — gratuita</Text>
            </View>
          </View>
          <View style={styles.separador} />
          <View style={styles.item}>
            <View style={[styles.itemIconeWrapper, { backgroundColor: '#F0FFF4' }]}>
              <Text style={styles.itemIcone}>📦</Text>
            </View>
            <View style={styles.itemTextos}>
              <Text style={styles.itemTitulo}>Versão</Text>
              <Text style={styles.itemSub}>RecipeSnap 1.0.0</Text>
            </View>
          </View>
          <View style={styles.separador} />
          <View style={styles.item}>
            <View style={[styles.itemIconeWrapper, { backgroundColor: '#FFF8E8' }]}>
              <Text style={styles.itemIcone}>👨‍💻</Text>
            </View>
            <View style={styles.itemTextos}>
              <Text style={styles.itemTitulo}>Desenvolvido por</Text>
              <Text style={styles.itemSub}>Breno & Sergio</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout} activeOpacity={0.85}>
          <Text style={styles.btnLogoutTexto}>Sair da conta</Text>
        </TouchableOpacity>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F3' },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },

  avatarSection: { alignItems: 'center', paddingVertical: 24 },
  avatarContainer: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#FF6B35',
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    shadowColor: '#FF6B35', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  avatarEmoji: { fontSize: 42 },
  nomeUsuario: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.3 },
  subUsuario: { fontSize: 13, color: '#8A6A50', marginTop: 4 },

  statsRow: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 18,
    paddingVertical: 20, marginBottom: 24, borderWidth: 1, borderColor: '#F0E0D0',
  },
  statCard: { flex: 1, alignItems: 'center' },
  statNumero: { fontSize: 22, fontWeight: '800', color: '#FF6B35', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#8A6A50', fontWeight: '500' },
  statDivisor: { width: 1, backgroundColor: '#F0E0D0', marginVertical: 4 },

  secaoTitulo: {
    fontSize: 12, fontWeight: '700', color: '#8A6A50',
    textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: 10, marginLeft: 4,
  },
  grupo: {
    backgroundColor: '#FFFFFF', borderRadius: 18,
    borderWidth: 1, borderColor: '#F0E0D0', marginBottom: 24, overflow: 'hidden',
  },
  item: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  itemIconeWrapper: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  itemIcone: { fontSize: 20 },
  itemTextos: { flex: 1 },
  itemTitulo: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  itemSub: { fontSize: 12, color: '#8A6A50', marginTop: 2 },
  itemSeta: { fontSize: 20, color: '#C4A882', fontWeight: '300' },
  separador: { height: 1, backgroundColor: '#F0E0D0', marginLeft: 70 },

  badgeAtivo: {
    backgroundColor: '#F0FFF4', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: '#C6F6D5',
  },
  badgeAtivoTexto: { fontSize: 11, color: '#38A169', fontWeight: '600' },

  btnLogout: {
    backgroundColor: '#FFFFFF', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', borderWidth: 1.5, borderColor: '#E53E3E',
  },
  btnLogoutTexto: { color: '#E53E3E', fontSize: 16, fontWeight: '700' },
});
