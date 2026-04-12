import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router"; 
import { useAuthStore } from "@/store/authStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { initialize, isLoading, isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  
  const navigationState = useRootNavigationState(); 

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!navigationState?.key || isLoading) return; 

    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(app)");
    }
    
  }, [isAuthenticated, isLoading, segments, router, navigationState?.key]); 

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 300,
      }}
    />
  );
}