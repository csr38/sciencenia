import React, { FC, useState, useEffect } from "react";
import { View, ViewStyle, TextStyle } from "react-native";
import { Button, TextField, LoadingIndicator } from "app/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "app/services/api";
import { colors, typography } from "app/theme";
import Toast from "react-native-toast-message";
import { navigate } from "app/navigators";
import { useHeader } from "app/utils/useHeader";
import { RouteProp } from "@react-navigation/native";
import { FundsExecutiveNavigatorParamList } from "app/navigators/FundsExecutiveStack";

interface EditAnnouncementProps {
  route: RouteProp<FundsExecutiveNavigatorParamList, "EditAnnouncement">;
  navigation: any;
}

export const EditAnnouncement: FC<EditAnnouncementProps> = ({ route, navigation }) => {
  const { id: announcementId } = route.params;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useHeader({
    title: "Editar anuncio",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const getAnnouncement = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        await AsyncStorage.removeItem("authToken");
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Sesión expirada",
          text2: "Por favor, inicia sesión nuevamente.",
        });
        return;
      }

      const response = await api.getAnnouncementById(announcementId, token);
      if ("kind" in response) {
        console.error("Error fetching period data:", response);
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error inesperado",
          text2: "No se pudieron obtener los datos del período.",
        });
      } else {
        setFormData(response.data);
      }
    } catch (error) {
      console.error("Error al obtener los datos del período:", error);
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error inesperado",
        text2: "No se pudieron obtener los datos del período.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAnnouncement();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        await AsyncStorage.removeItem("authToken");
        navigate("Login");
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Sesión expirada",
          text2: "Por favor, inicia sesión nuevamente.",
        });
        return;
      }

      const response = await api.updateAnnouncement(announcementId, formData, token);
      if ("kind" in response) {
        console.error("Error updating period:", response);
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error inesperado",
          text2: "Ocurrió un error al intentar actualizar el período.",
        });
        return;
      } else {
        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Actualización exitosa",
          text2: "El período fue actualizado correctamente.",
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error actualizando el período:", error);
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error inesperado",
        text2: "Ocurrió un error al intentar actualizar el período.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator backgroundColor={colors.background} />;
  }

  return (
    <View style={$container}>
      <TextField
        label="Título del anuncio"
        LabelTextProps={{ style: $label}}
        value={formData.title}
        onChangeText={(text) => handleInputChange("title", text)}
        containerStyle={$input}
      />
      <TextField
        label="Descripción del anuncio"
        LabelTextProps={{ style: $label}}
        value={formData.description}
        multiline
        numberOfLines={4}
        onChangeText={(text) => handleInputChange("description", text)}
        containerStyle={$input}
      />
      <Button
        text="Actualizar"
        onPress={handleSubmit}
        disabled={isLoading}
        style={$button}
        textStyle={$buttonText}
        pressedStyle={$pressedButton}
      />
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
  padding: 20,
  backgroundColor: colors.background,
};

const $input: ViewStyle = {
  marginBottom: 15,
};

const $label: TextStyle = {
  color: colors.palette.brandingDarkerBlue,
  fontSize: 17,
  fontWeight: "bold",
};

const $button: ViewStyle = {
  backgroundColor: colors.palette.brandingPink,
  borderRadius: 8,
  borderColor: colors.palette.brandingPink,
};

const $buttonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 16,
  fontFamily: typography.primary.bold,
};

const $pressedButton: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderColor: colors.palette.brandingMediumPink,
};