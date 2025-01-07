import React, {  FC, useState} from "react"
import { View, Alert, ViewStyle, TextStyle } from 'react-native';
import { Button,Text, TextField } from "app/components"
import { useHeader } from "app/utils/useHeader";
import { Screen } from "../../components/Screen";
import { useAuth0 } from "react-native-auth0";
import { colors, spacing } from "../../theme";
import { api } from "app/services/api";
import { AudienceSelection } from "./AudienceSelection";

interface CreateNotificationProps {
    navigation: any; 
  }
  
const initialErrorsState = {
    title: false,
    description: false,
    targetAudiences: false,
};

export const CreateNotification: FC<CreateNotificationProps> = (_props) =>{
  const { getCredentials } = useAuth0();
  const [, setErrors] = useState(initialErrorsState);
  const [formData, setFormData] = useState({
    title: "", 
    description: "", 
    targetAudiences: [] as string[],
  });
  const resetForm = () => {
    setFormData({
        title: "", 
        description: "", 
        targetAudiences: [] as string[],
      });
  };
  
  const validateForm = () => {
    const newErrors = {
      ...initialErrorsState,
      title: !formData.title,
      description: !formData.description,
      targetAudiences: formData.targetAudiences.length === 0,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  useHeader(
    {
      title: "Nuevo Anuncio",
      leftIcon: "back",
      onLeftPress: () => _props.navigation.goBack(),
    },
  );

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    try {
      const credentials = await getCredentials();
      if (!credentials) {
        Alert.alert("Error", "No se pudo obtener el token de acceso.");
        return;
      }
      const accessToken = credentials.accessToken;
      const response = await api.createAnnouncement(formData, accessToken);
  
      if ("ok" in response) {
        if (response.ok) {
          Alert.alert("Éxito", "Solicitud enviada exitosamente.");
          _props.navigation.goBack()
        } else {
          console.error("Error:", response.problem);
          resetForm(); 
        }
      } else {
        console.error("Respuesta no válida:", response);
        resetForm();
      }

    } catch(error) {
      Alert.alert("Error", "Hubo un problema al enviar la solicitud.");
      console.error("Submission error:", error);
      resetForm(); 
    }
  };
  
  return (
    <Screen preset="scroll" contentContainerStyle={$container}>
      <View style={$formGroup}>
          <Text style={$label}>
            Título del anuncio
          </Text>
          <TextField
            value={formData.title}
            onChangeText={(value) => handleChange('title', value)}
            placeholder="Nombre del anuncio"
          />
      </View>
      <View style={$formGroup}>
          <Text style={$label}>
            Indique una descripción acerca del anuncio
          </Text>
          <TextField
            style={$textarea}
            multiline
            value={formData.description}
            onChangeText={(value) => handleChange('description', value)}
            placeholder="Descripción"
          />
      </View>

      <View style={$formGroup}>
        <Text style={$label}>Público objetivo</Text>
        <AudienceSelection 
          formData={formData} 
          handleToggle={(value) => handleChange('targetAudiences', value)}
        />
      </View>

      <Button 
        style={$formButton}
        textStyle={$formButtonText}
        pressedStyle={$formButtonPressed}
        onPress={handleSubmit} 
        text="Enviar Solicitud"
      />
    </Screen>
  );
};


const $container: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  padding: 20,
  flexGrow: 1,
}

const $formButton: ViewStyle = {
  alignSelf: "stretch",
  backgroundColor: colors.palette.brandingPink,
  borderColor: colors.palette.brandingPink,
  borderRadius: 8,
  justifyContent: "center",
  marginBottom: spacing.md,
  marginTop: spacing.lg,
  paddingVertical: spacing.md,
};

const $formButtonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 16,
  fontWeight: 'bold',
};

const $formButtonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderRadius: 8,
  borderColor: colors.palette.brandingMediumPink,
};

const $formGroup: ViewStyle = {
  marginBottom: 15,
}

const $label: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontSize: 17,
  fontWeight: "bold",
  marginBottom: 5,
}

const $textarea: TextStyle = {
  minHeight: 60,
  padding: 10,
};
