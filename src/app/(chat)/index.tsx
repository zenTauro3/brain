import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "@/store/authStore";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
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

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionBtn}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
          <Text style={styles.optionText}>Account Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionBtn}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          <Text style={styles.optionText}>Notifications</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={logout}
      >
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
  header: {
    marginTop: 10,
    marginBottom: 30,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D0D0D",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1A1A1A",
    marginBottom: 30,
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
  userInfo: {
    flex: 1,
  },
  userName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  userEmail: {
    color: "#888",
    fontSize: 14,
    marginTop: 4,
  },
  optionsContainer: {
    gap: 15,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D0D0D",
    padding: 18,
    borderRadius: 12,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 15,
    fontWeight: "500",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 69, 58, 0.1)", // Un rojo transparente muy sutil
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 69, 58, 0.3)",
    marginBottom: 20, // SafeAreaView se encarga del margen real del dispositivo
  },
  logoutText: {
    color: "#FF453A", // Rojo destructivo estándar de iOS
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
