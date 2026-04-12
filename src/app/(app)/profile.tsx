import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // ✨ Importamos el router

import { useAuthStore } from "@/store/authStore";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter(); // ✨ Lo inicializamos

  return (
    <SafeAreaView style={styles.container}>
      {/* ✨ Custom Header del Perfil con botón de volver */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 28 }} />{" "}
        {/* Espaciador fantasma para centrar el título */}
      </View>

      <View style={styles.userCard}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={40} color="#555" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.username || "Axon User"}</Text>
          <Text style={styles.userEmail}>
            {user?.email || "Cargando email..."}
          </Text>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Ionicons name="log-out-outline" size={24} color="#FF453A" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
  },
  // ✨ Estilos del nuevo Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Centra el texto y empuja los iconos a los lados
    marginTop: 10,
    marginBottom: 30,
  },
  backButton: {
    padding: 5,
    marginLeft: -5, // Compensa visualmente el margen
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  // ... (El resto de tus estilos se quedan exactamente igual) ...
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D0D0D",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1A1A1A",
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  userInfo: { flex: 1 },
  userName: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  userEmail: { color: "#888", fontSize: 14, marginTop: 4 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 69, 58, 0.1)",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 69, 58, 0.3)",
    marginBottom: 20,
  },
  logoutText: {
    color: "#FF453A",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
