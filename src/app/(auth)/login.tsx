// Archivo: src/app/(auth)/login.tsx
import { Link, useRouter } from "expo-router"; // <-- Añadido el Link aquí
import { useState } from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// En el futuro usaremos estos imports reales:
// import { useAuthStore } from '@/store/authStore';
// import { loginAPI } from '@/api/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Obtenemos los márgenes seguros del dispositivo (arriba, abajo, etc.)
  const insets = useSafeAreaInsets();

  // Función simulada (hasta que instalemos las dependencias reales)
  const iniciarSesion = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor, rellena todos los campos");
      return;
    }
    console.log("Simulando Login:", { email, password });
    Alert.alert("¡Hecho!", "Login simulado correctamente.");
    // router.replace('/'); // Descomenta esto para probar la redirección
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: insets.top + 40 },
            ]}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            {/* --- CABECERA --- */}
            <View style={styles.header}>
              <Text style={styles.logoIcon}>🧠</Text>
              <Text style={styles.title}>Te damos la bienvenida</Text>
              <Text style={styles.subtitle}>
                Inicia sesión para conectar con tu cerebro IA.
              </Text>
            </View>

            {/* --- FORMULARIO --- */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ejemplo@correo.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Introduce tu contraseña"
                  placeholderTextColor="#999"
                  secureTextEntry
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={iniciarSesion}>
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
            </View>

            {/* ESTA ES LA MAGIA: Un espaciador invisible que empuja el footer hacia abajo */}
            <View style={{ flex: 1, minHeight: 40 }} />

            {/* --- PIE DE PÁGINA --- */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>¿No tienes cuenta?</Text>

              {/* Usamos Link con replace para no acumular historial, y asChild para que el TouchableOpacity funcione bien dentro */}
              <Link href="/register" replace asChild>
                <TouchableOpacity>
                  <Text style={styles.registerText}>Regístrate gratis</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Estilos limpios y corregidos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1, // Esto hace que el scroll ocupe todo el espacio disponible
    paddingHorizontal: 25,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 40,
    alignItems: "flex-start",
  },
  logoIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    fontWeight: "400",
    lineHeight: 22,
  },
  form: {
    // Hemos quitado el flex: 1 de aquí para que no rompa el scroll
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 30,
    marginTop: -5,
  },
  forgotPasswordText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footer: {
    // Hemos quitado marginTop: "auto"
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  registerText: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "600",
  },
});
