import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/authStore";

export default function Login() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!form.email || !form.password)
      return setError("Please fill all fields");

    console.log()

    setLoading(true);
    setError(null);
    
    try {
      await login(form);
    } catch (err: any) {
      setError(err.error?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/(auth)')} style={styles.back}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to your Axon account</Text>
      </View>

      <View style={styles.form}>
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
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.btnText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{"Don't have an account? "}</Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.linkText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 25 },
  back: { marginTop: 20, marginBottom: 30 },
  header: { marginBottom: 40 },
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
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 40 },
  footerText: { color: "#555", fontSize: 16 },
  linkText: { color: "#007AFF", fontSize: 16, fontWeight: "bold" },
});
