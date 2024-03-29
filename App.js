import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen  from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';

export default function App() {


  const Stack  = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options = {{headerShown:false}} name="Login" component={LoginScreen} />
        <Stack.Screen options = {{headerShown:false}} name="Home" component={HomeScreen} />
        <Stack.Screen options = {{headerShown:false}} name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
      
    </NavigationContainer>
  );

  }
