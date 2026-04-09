import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
// Importación correcta para evitar el warning de 'deprecated'
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Redirect } from "expo-router";
import { useAuthStore } from "@/store/authStore";

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  if (!isLoading && isAuthenticated) return <Redirect href="/(chat)" />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../../assets/images/brain.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Axon</Text>
        <Text style={styles.tagline}>Zero friction for your Intelligence.</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btnBlue}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.btnText}>Log In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.btnText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000", 
    paddingHorizontal: 25 
  },
  content: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  logo: { 
    width: 280, 
    height: 280 
  },
  title: { 
    color: "#fff", 
    fontSize: 50, 
    fontWeight: "900", 
    marginTop: 20 
  },
  tagline: { 
    color: "#888", 
    fontSize: 18, 
    textAlign: "center", 
    marginTop: 10 
  },
  footer: { 
    gap: 15, 
    marginBottom: 20
  },
  btnBlue: {
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: "#333",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  btnText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "700" 
  },
});