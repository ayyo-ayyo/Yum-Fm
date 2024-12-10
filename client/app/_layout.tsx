// app/layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      router.replace('/login');
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const customTheme = {
    dark: false,
    colors: {
      primary: '#D74938',
      background: '#F4D4A3',
      card: '#FFFFFF',
      text: '#333333',
      border: '#D74938',
      notification: '#D74938',
    },
  };

  return (
    <NavigationContainer>
    <ThemeProvider value={customTheme}>
       <Stack initialRouteName="login">
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="create-account" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
    </NavigationContainer>
  );
}
