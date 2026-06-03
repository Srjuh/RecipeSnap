import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Define como as notificações aparecem quando o app está em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Solicita permissão de notificação ao usuário.
 * Retorna true se concedida, false caso contrário.
 */
export async function solicitarPermissao() {
  const { status: statusAtual } = await Notifications.getPermissionsAsync();

  if (statusAtual === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Envia notificação imediata ao favoritar uma receita.
 * @param {string} nomeReceita
 */
export async function notificarFavorito(nomeReceita) {
  const permitido = await solicitarPermissao();
  if (!permitido) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '❤️ Receita favoritada!',
      body: `"${nomeReceita}" foi salva nos seus favoritos.`,
      sound: true,
    },
    trigger: null, // dispara imediatamente
  });
}

/**
 * Agenda uma notificação diária lembrando o usuário de cozinhar.
 * Dispara todo dia às 12h. Cancela qualquer agendamento anterior.
 */
export async function agendarNotificacaoDiaria() {
  const permitido = await solicitarPermissao();
  if (!permitido) return;

  // Cancela agendamentos anteriores para não duplicar
  await Notifications.cancelAllScheduledNotificationsAsync();

  const mensagens = [
    'O que vai sair do forno hoje? 🍳',
    'Que tal experimentar uma receita nova? 🥘',
    'Você tem ingredientes esperando por você! 🧄',
    'Hora de cozinhar algo delicioso! 🍽️',
    'Seus favoritos estão com saudade de você 😋',
  ];

  const mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🍴 RecipeSnap',
      body: mensagem,
      sound: true,
    },
    trigger: {
      hour: 12,
      minute: 0,
      repeats: true,
    },
  });
}

/**
 * Cancela a notificação diária agendada.
 */
export async function cancelarNotificacaoDiaria() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
