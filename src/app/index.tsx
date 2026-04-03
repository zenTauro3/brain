import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/authStore";

export default function RootIndex() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return null;

  return isAuthenticated ? (
    <Redirect href="/(chat)" />
  ) : (
    <Redirect href="/(auth)" />
  );
}
