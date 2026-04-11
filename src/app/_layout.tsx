import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router"; 
import { useAuthStore } from "@/store/authStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { initialize, isLoading, isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isLoading) return; 

    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === "(auth)";
    const inChatGroup = segments[0] === "(chat)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (isAuthenticated && !inChatGroup) {
      router.replace("/(chat)");
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false, 
        animation: "fade", 
        animationDuration: 300 
      }} 
    />
  );
}