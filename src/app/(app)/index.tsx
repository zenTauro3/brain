import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router"; // Quitamos Stack, ya no lo usamos
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuthStore } from "@/store/authStore";

// Definimos la estructura de un mensaje
interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

export default function AppScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Para no pisar la barra de notificaciones
  const { user } = useAuthStore();
  
  const [inputText, setInputText] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  // Referencia a la lista para hacer scroll automático hacia abajo
  const flatListRef = useRef<FlatList>(null);

  // Mensaje de bienvenida inicial
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `¡Hola, ${user?.username || "humano"}! Soy Axon AI. ¿En qué te puedo ayudar hoy?`,
      sender: "ai",
    },
  ]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "user",
    };
    
    setMessages((prev) => [...prev, newUserMsg]);
    setInputText("");
    setIsLoadingAI(true);

    // Simulamos petición
    setTimeout(() => {
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Esta es una respuesta simulada de Axon AI. ¡Pronto me conectaré a tu backend de NestJS!",
        sender: "ai",
      };
      setMessages((prev) => [...prev, newAiMsg]);
      setIsLoadingAI(false);
    }, 1500);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === "user";

    return (
      <View style={[styles.messageWrapper, isUser ? styles.messageWrapperUser : styles.messageWrapperAI]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={14} color="#fff" />
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.aiMessageText]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* ✨ CUSTOM HEADER ✨ */}
      <View style={[styles.customHeader, { paddingTop: Math.max(insets.top, 10) }]}>
        <View style={styles.headerTitleContainer}>
          <Ionicons name="infinite" size={24} color="#fff" />
          <Text style={styles.headerTitle}>Axon AI</Text>
        </View>

        <TouchableOpacity 
          style={styles.profileBtn} 
          onPress={() => router.push("/(app)/profile")}
        >
          {/* 🛡️ EL BUG SOLUCIONADO AQUÍ ABAJO 🛡️ */}
          <Text style={styles.profileBtnText}>
            {user?.username?.charAt(0)?.toUpperCase() || "U"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- CONTENEDOR DEL CHAT (Protegido contra el teclado) --- */}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0} 
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* --- ÁREA DE INPUT --- */}
        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 15) }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Escribe tu mensaje..."
              placeholderTextColor="#666"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={2000}
            />
            
            <TouchableOpacity 
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
              onPress={handleSend}
              disabled={!inputText.trim() || isLoadingAI}
            >
              {isLoadingAI ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="arrow-up" size={20} color={inputText.trim() ? "#fff" : "#555"} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  keyboardView: {
    flex: 1,
  },
  
  // ✨ Estilos del Custom Header
  customHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  headerTitleContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  profileBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: "#1A1A1A",
    justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#333"
  },
  profileBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 16,
  },
  messageWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    maxWidth: "85%",
  },
  messageWrapperUser: {
    alignSelf: "flex-end",
  },
  messageWrapperAI: {
    alignSelf: "flex-start",
  },
  aiAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 4,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: "#fff",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "#1A1A1A",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#000",
  },
  aiMessageText: {
    color: "#E5E5E5",
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#111",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#1A1A1A",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  textInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 2,
  },
  sendButtonDisabled: {
    backgroundColor: "#333",
  },
});