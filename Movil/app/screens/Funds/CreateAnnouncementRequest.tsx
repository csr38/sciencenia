import React, { useState, FC } from "react";
import { Alert, View, ViewStyle, TextStyle } from "react-native";
import { Button, Text, TextField } from "app/components";
import { useHeader } from "app/utils/useHeader";
import { Screen } from "../../components/Screen";
import { api } from "app/services/api";
import * as FormStyles from "./Styles/FormStyles";
import { colors, spacing, typography } from "app/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface CreateAnnouncementRequestProps {
  navigation: any;
  route: any;
}

export const CreateAnnouncementRequest: FC<CreateAnnouncementRequestProps> = ({ navigation, route }) => {
  const [motivation, setMotivation] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { announcementId, announcementTitle, announcementDescription } = route.params;



  useHeader({
    title: "Postular a Anuncio",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  });

  const handleChange = (value: string) => {
    setMotivation(value);
  };

  const validateForm = () => {
    if (!motivation) {
      Alert.alert("Error", "Por favor, ingresa tu motivación.");
      return false;
    }
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
            Alert.alert("Error", "No se encontró el token de autenticación.");
            return;
        }
        const response = await api.createAnnouncementRequest(announcementId, { motivationMessage: motivation }, token);

      if ("ok" in response) {
        Alert.alert("Éxito", "Solicitud de anuncio enviada exitosamente.");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Hubo un problema al enviar la solicitud.");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un error al enviar la solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen preset="auto" contentContainerStyle={FormStyles.$container} style={$container}>
      <Text style={$title}>{announcementTitle}</Text>
      <View style={FormStyles.$formGroup}>
        <Text style={FormStyles.$label}>
          Descripción del Anuncio
        </Text>
        <Text style={$description}>
          {announcementDescription}
        </Text>
        <Text style={FormStyles.$label}>
          Motivación
        </Text>
        <TextField
          style={FormStyles.$input}
          value={motivation}
          onChangeText={handleChange}
          placeholder="Escribe tu motivación aquí"
          multiline
        />
      </View>

      <Button
        text="Postular"
        onPress={handleSubmit}
        disabled={isSubmitting}
        style={$button}
        pressedStyle={$buttonPressed}
        textStyle={$textButton}
      />
    </Screen>
  );
};

const $container: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
}

const $title: TextStyle = {
  fontSize: 20,
  marginBottom: spacing.lg,
  color: colors.palette.brandingPink,
  fontFamily: typography.primary.bold,
}

const $description: TextStyle = {
  fontSize: 16,
  marginBottom: spacing.md,
  color: colors.palette.brandingDarkerBlue,
}

const $button: ViewStyle = {
  backgroundColor: colors.palette.brandingPink,
  borderRadius: 8,
  borderColor: colors.palette.brandingPink,
}

const $buttonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderRadius: 8,
  borderColor: colors.palette.brandingMediumPink,
}

const $textButton: TextStyle = {
  color: colors.palette.brandingWhite,
}

