import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erroEmail, setErroEmail] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const validarEmail = (valor) => {
    setEmail(valor);
    if (!valor.includes('@') || !valor.includes('.')) {
      setErroEmail('Informe um e-mail válido');
    } else {
      setErroEmail('');
    }
  };

  const validarSenha = (valor) => {
    setSenha(valor);
    if (valor.length < 6) {
      setErroSenha('Mínimo 6 caracteres');
    } else {
      setErroSenha('');
    }
  };

const handleLogin = () => {
  let valido = true;
  if (!email || !email.includes('@')) {
    setErroEmail('Informe um e-mail válido');
    valido = false;
  }
  if (!senha || senha.length < 6) {
    setErroSenha('Mínimo 6 caracteres');
    valido = false;
  }
  if (!valido) return;

  setCarregando(true);
  setTimeout(() => {
    setCarregando(false);
    navigation.replace('Main');
  }, 1200);
};

  const formularioValido =
    email.includes('@') && email.includes('.') && senha.length >= 6;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8F3" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.cabecalho}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcone}>🍽️</Text>
          </View>
          <Text style={styles.nomeApp}>RecipeSnap</Text>
          <Text style={styles.subtitulo}>Cozinhe com o que você tem</Text>
        </View>

        {/* Campos */}
        <View>
          <View style={styles.campoContainer}>
            <Text style={styles.rotulo}>E-mail</Text>
            <TextInput
              style={[styles.input, erroEmail ? styles.inputErro : null]}
              placeholder="seu@email.com"
              placeholderTextColor="#C4A882"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={validarEmail}
            />
            {erroEmail ? <Text style={styles.textoErro}>{erroEmail}</Text> : null}
          </View>

          <View style={styles.campoContainer}>
            <Text style={styles.rotulo}>Senha</Text>
            <TextInput
              style={[styles.input, erroSenha ? styles.inputErro : null]}
              placeholder="••••••••"
              placeholderTextColor="#C4A882"
              secureTextEntry
              value={senha}
              onChangeText={validarSenha}
            />
            {erroSenha ? <Text style={styles.textoErro}>{erroSenha}</Text> : null}
          </View>

          <TouchableOpacity
            style={[
              styles.botaoPrimario,
              (!formularioValido || carregando) && styles.botaoDesabilitado,
            ]}
            onPress={handleLogin}
            disabled={!formularioValido || carregando}
            activeOpacity={0.85}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.textoBotaoPrimario}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divisor}>
            <View style={styles.linhaDivisor} />
            <Text style={styles.textoDivisor}>ou</Text>
            <View style={styles.linhaDivisor} />
          </View>

          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={() => navigation.navigate('Cadastro')}
            activeOpacity={0.85}
          >
            <Text style={styles.textoBotaoSecundario}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoIcone: {
    fontSize: 36,
  },
  nomeApp: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  subtitulo: {
    fontSize: 15,
    color: '#8A6A50',
    marginTop: 6,
  },
  campoContainer: {
    marginBottom: 18,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A3728',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8D5C4',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A1A',
  },
  inputErro: {
    borderColor: '#E53E3E',
  },
  textoErro: {
    fontSize: 12,
    color: '#E53E3E',
    marginTop: 5,
    marginLeft: 4,
  },
  botaoPrimario: {
    backgroundColor: '#FF6B35',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoDesabilitado: {
    backgroundColor: '#F0C4A8',
  },
  textoBotaoPrimario: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  divisor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  linhaDivisor: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8D5C4',
  },
  textoDivisor: {
    fontSize: 13,
    color: '#C4A882',
    fontWeight: '500',
  },
  botaoSecundario: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FF6B35',
  },
  textoBotaoSecundario: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '700',
  },
});