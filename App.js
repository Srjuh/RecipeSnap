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

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [erroNome, setErroNome] = useState('');
  const [erroEmail, setErroEmail] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [erroConfirmar, setErroConfirmar] = useState('');

  const validarNome = (valor) => {
    setNome(valor);
    if (valor.trim().length < 3) {
      setErroNome('Mínimo 3 caracteres');
    } else {
      setErroNome('');
    }
  };

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
    if (confirmarSenha && valor !== confirmarSenha) {
      setErroConfirmar('As senhas não coincidem');
    } else if (confirmarSenha) {
      setErroConfirmar('');
    }
  };

  const validarConfirmarSenha = (valor) => {
    setConfirmarSenha(valor);
    if (valor !== senha) {
      setErroConfirmar('As senhas não coincidem');
    } else {
      setErroConfirmar('');
    }
  };

  const formularioValido =
    nome.trim().length >= 3 &&
    email.includes('@') &&
    email.includes('.') &&
    senha.length >= 6 &&
    senha === confirmarSenha &&
    aceitouTermos;

  const handleCadastro = () => {
    if (!formularioValido) return;
    setCarregando(true);
    // TODO: substituir pelo cadastro real
    setTimeout(() => {
      setCarregando(false);
      navigation.navigate('Login'); // volta para login após criar conta
    }, 1200);
  };

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
        {/* Cabeçalho */}
        <View style={styles.cabecalho}>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.setaVoltar}>←</Text>
          </TouchableOpacity>
          <Text style={styles.titulo}>Criar conta</Text>
          <Text style={styles.subtitulo}>Comece a cozinhar com o que você tem</Text>
        </View>

        {/* Campos */}
        <View>
          <View style={styles.campoContainer}>
            <Text style={styles.rotulo}>Nome completo</Text>
            <TextInput
              style={[styles.input, erroNome ? styles.inputErro : null]}
              placeholder="Seu nome"
              placeholderTextColor="#C4A882"
              autoCapitalize="words"
              value={nome}
              onChangeText={validarNome}
            />
            {erroNome ? <Text style={styles.textoErro}>{erroNome}</Text> : null}
          </View>

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
            {erroSenha ? (
              <Text style={styles.textoErro}>{erroSenha}</Text>
            ) : (
              <Text style={styles.dica}>Mínimo 6 caracteres</Text>
            )}
          </View>

          <View style={styles.campoContainer}>
            <Text style={styles.rotulo}>Confirmar senha</Text>
            <TextInput
              style={[styles.input, erroConfirmar ? styles.inputErro : null]}
              placeholder="••••••••"
              placeholderTextColor="#C4A882"
              secureTextEntry
              value={confirmarSenha}
              onChangeText={validarConfirmarSenha}
            />
            {erroConfirmar ? (
              <Text style={styles.textoErro}>{erroConfirmar}</Text>
            ) : confirmarSenha && senha === confirmarSenha ? (
              <Text style={styles.textoSucesso}>✓ Senhas coincidem</Text>
            ) : null}
          </View>

          {/* Termos */}
          <TouchableOpacity
            style={styles.termosContainer}
            onPress={() => setAceitouTermos(!aceitouTermos)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, aceitouTermos && styles.checkboxAtivo]}>
              {aceitouTermos && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termosTexto}>
              Li e aceito os{' '}
              <Text style={styles.termosLink}>Termos de Uso</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botaoPrimario,
              (!formularioValido || carregando) && styles.botaoDesabilitado,
            ]}
            onPress={handleCadastro}
            disabled={!formularioValido || carregando}
            activeOpacity={0.85}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.textoBotaoPrimario}>Criar conta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkLogin}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.textoLinkLogin}>
              Já tem uma conta?{' '}
              <Text style={styles.textoLinkLoginDestaque}>Entrar</Text>
            </Text>
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
    paddingHorizontal: 28,
    paddingTop: 56,
    paddingBottom: 40,
  },
  cabecalho: {
    marginBottom: 36,
  },
  botaoVoltar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E8D5C4',
    marginBottom: 20,
  },
  setaVoltar: {
    fontSize: 20,
    color: '#FF6B35',
    fontWeight: '600',
  },
  titulo: {
    fontSize: 28,
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
  textoSucesso: {
    fontSize: 12,
    color: '#38A169',
    marginTop: 5,
    marginLeft: 4,
  },
  dica: {
    fontSize: 12,
    color: '#C4A882',
    marginTop: 5,
    marginLeft: 4,
  },
  termosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 6,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E8D5C4',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxAtivo: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  termosTexto: {
    fontSize: 14,
    color: '#4A3728',
    flex: 1,
  },
  termosLink: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  botaoPrimario: {
    backgroundColor: '#FF6B35',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botaoDesabilitado: {
    backgroundColor: '#F0C4A8',
  },
  textoBotaoPrimario: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  linkLogin: {
    alignItems: 'center',
    marginTop: 20,
  },
  textoLinkLogin: {
    fontSize: 14,
    color: '#8A6A50',
  },
  textoLinkLoginDestaque: {
    color: '#FF6B35',
    fontWeight: '700',
  },
});