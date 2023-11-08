import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen';
import LogInScreen from './components/LogInScreen';
import SignUpScreen from './components/SignUpScreen';
import { MenuProvider } from 'react-native-popup-menu';
import SplashScreen from './components/SplashScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <>
            <MenuProvider>
                <StatusBar style="auto" />
                <NavigationContainer>
                    <Stack.Navigator initialRouteName='SplashScreen' screenOptions={
                        {
                            headerShown: false,
                            gestureEnabled: false
                        }
                    }>
                        <Stack.Screen name="SplashScreen" component={SplashScreen}></Stack.Screen>
                        <Stack.Screen name="LogInScreen" component={LogInScreen}></Stack.Screen>
                        <Stack.Screen name="SignUpScreen" component={SignUpScreen}></Stack.Screen>
                        <Stack.Screen name="HomeScreen" component={HomeScreen}></Stack.Screen>
                    </Stack.Navigator>
                </NavigationContainer>
            </MenuProvider>
        </>
    );
}