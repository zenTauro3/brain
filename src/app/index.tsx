import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function PantallaInicial() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>🧠 Brain App</Text>
      <Text
        style={{ fontSize: 16, marginTop: 10, color: "gray", marginBottom: 30 }}
      >
        Estructura Pro configurada al 100%
      </Text>

      <Link
        href="/login"
        style={{ color: "blue", fontSize: 18, fontWeight: "bold", padding: 10 }}
      >
        Ir a Iniciar Sesión 🚀
      </Link>
    </View>
  );
}
