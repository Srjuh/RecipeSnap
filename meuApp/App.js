import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';

import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import BuscaScreen from './screens/BuscaScreen';
import DetalheScreen from './screens/DetalheScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Busca" component={BuscaScreen} />
        <Stack.Screen name="Detalhe" component={DetalheScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);