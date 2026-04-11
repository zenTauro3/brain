import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/authStore";

export default function Register() {
  const router = useRouter();
  const { register } = useAuthStore();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) {
      return setError("Please fill all fields");
    }

    setLoading(true);
    setError(null);

    try {
      await register(form);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => router.push("(auth)")}
            style={styles.back}
          >
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the Axon ecosystem today</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              placeholder="Username"
              placeholderTextColor="#444"
              style={styles.input}
              onChangeText={(t) => setForm({ ...form, username: t })}
            />
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#444"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(t) => setForm({ ...form, email: t })}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#444"
              secureTextEntry
              style={styles.input}
              onChangeText={(t) => setForm({ ...form, password: t })}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.btn, loading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.btnText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.linkText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 25 },
  back: { marginTop: 10, marginBottom: 20 },
  header: { marginBottom: 30 },
  title: { color: "#fff", fontSize: 36, fontWeight: "bold" },
  subtitle: { color: "#555", fontSize: 18, marginTop: 10 },
  form: { gap: 20 },
  input: {
    backgroundColor: "#0D0D0D",
    color: "#fff",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#1A1A1A",
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  errorText: { color: "#FF453A", textAlign: "center", marginTop: 10 },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  footerText: { color: "#555", fontSize: 16 },
  linkText: { color: "#007AFF", fontSize: 16, fontWeight: "bold" },
});
