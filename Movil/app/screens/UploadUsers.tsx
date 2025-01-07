import React, { useState } from "react"
import { View, Alert, TextStyle, ViewStyle } from "react-native"
import DocumentPicker from 'react-native-document-picker'
import { Text, Button, Screen } from "app/components"
import { colors, typography, spacing } from "app/theme"
import { useHeader } from "../utils/useHeader"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { navigate } from "app/navigators"
import { useAuth0 } from 'react-native-auth0';
import { api } from "app/services/api";
import { LoadingIndicator } from '../components/LoadingIndicator'

interface FileUpload {
  uri: string;
  name: string;
  type: string;
}

const UploadUsers = () => {
  const { clearSession } = useAuth0()
  const [isUploading, setIsUploading] = useState(false);

  useHeader({
    title: "Subir archivos",
  })

  const selectFile = async (type: string) => {
    try {
      const result = await DocumentPicker.pick({type: [DocumentPicker.types.xlsx, DocumentPicker.types.csv],})
      await handleUpload(result[0], type);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Selección de archivo cancelada')
      } else {
        Alert.alert('Error al seleccionar archivo')
      }
    }
  }

  const handleQuitSession = async () => {
    await clearSession();
    await AsyncStorage.removeItem('authToken');
    navigate("Login");
  };

  const handleUpload = async (file:any, uploadType:string) => {
    if (!file) {
      Alert.alert('Por favor, selecciona un archivo .csv o .excel');
      return;
    }
  
    const formData = new FormData();
    const fileToUpload: FileUpload = {
      uri: file.uri, 
      name: file.name, 
      type: file.type,
    };

    formData.append('file', fileToUpload as any);

    try {
      setIsUploading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error de autenticación', 'No se encontró un token de autenticación.');
        await clearSession();
        await AsyncStorage.removeItem('authToken');
        navigate("Login");
        return;
      }
      const uploadResponse = await api.uploadFile(formData, uploadType!, token);

      if ('kind' in uploadResponse) {
        const errorMessage = uploadResponse?.data?.userMessage || "No se pudo subir el archivo. Por favor intenta de nuevo.";
        Alert.alert("Error", errorMessage);
      } else {
        Alert.alert("Éxito", "Archivo subido correctamente");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al intentar subir el archivo.");
    } finally {
    setIsUploading(false);
  }
  };

  if (isUploading) return <LoadingIndicator />

  return (
    <Screen preset="scroll" style={$container}>
      {/* Cargar estudiantes */}
      <View style={$card}>
        <Text style={$title}>Cargar estudiantes</Text>
        <Text style={$description}>
          Sube un archivo CSV que contenga a los estudiantes que quieres cargar a la plataforma
        </Text>
        <Button 
          style={$button} 
          textStyle={$buttonText} 
          pressedStyle={$buttonPressed}
          text="Seleccionar archivo"
          onPress={() => { selectFile('estudiantes') }}
        />
      </View>

      {/* Cargar investigadores */}
      <View style={$card}>
        <Text style={$title}>Cargar investigadores</Text>
        <Text style={$description}>
          Sube un archivo CSV que contenga a los investigadores que quieres cargar a la plataforma
        </Text>
        <Button 
          style={$button} 
          textStyle={$buttonText} 
          pressedStyle={$buttonPressed}
          text="Seleccionar archivo"
          onPress={() => { selectFile('investigadores') }}
        />
      </View>

      {/* Cargar investigaciones */}
      <View style={$card}>
        <Text style={$title}>Cargar investigaciones</Text>
        <Text style={$description}>
          Sube un archivo CSV que contenga las investigaciones que quieres cargar a la plataforma
        </Text>
        <Button 
          style={$button} 
          textStyle={$buttonText} 
          pressedStyle={$buttonPressed}
          text="Seleccionar archivo"
          onPress={() => { selectFile('investigaciones') }}
        />
      </View>
      <Button
        text="Cerrar Sesión"
        onPress={handleQuitSession}
        style={$logoutButton}
        textStyle={$logoutButtonText}
        pressedStyle={$logoutButtonPressed}
      />
    </Screen>
  )
}

const $logoutButton: ViewStyle = {
  alignItems: 'center',
  backgroundColor: colors.palette.brandingPink,
  borderColor: colors.palette.brandingPink,
  borderRadius: 8,
  justifyContent: 'center',
  marginBottom: spacing.xxl,
  marginTop: spacing.lg,
  paddingVertical: spacing.md,
  marginHorizontal: spacing.md,
};

const $logoutButtonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderRadius: 8,
  borderColor: colors.palette.brandingMediumPink,
};

const $logoutButtonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 16,
  fontWeight: 'bold',
};

const $card: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  borderRadius: 8,
  margin: 10,
  padding: 15,
  paddingVertical: 20,
  elevation: 4,
  shadowColor: colors.palette.brandingBlack,
  shadowOpacity: 0.2,
  shadowRadius: 6,
  shadowOffset: { width: 2, height: 2 },
};

const $container: ViewStyle = {
  paddingVertical: 20,
  backgroundColor: colors.palette.brandingWhite,
  flex: 1,
  paddingHorizontal: 10,
}

const $title: TextStyle = {
  fontSize: 20,
  fontFamily: typography.primary.bold,
  color: colors.palette.brandingDarkBlue,
  marginBottom: 10,
}

const $description: TextStyle = {
  fontSize: 14,
  fontFamily: typography.primary.normal,
  color: colors.palette.brandingDarkBlue,
  marginBottom: 20,
}

const $button: ViewStyle = {
  backgroundColor: colors.palette.brandingPink,
  borderColor: colors.palette.brandingPink,
  paddingVertical: 8, 
  paddingHorizontal: 0,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
}

const $buttonText: TextStyle = {
  fontFamily: typography.primary.medium,
  color: colors.palette.neutral100,
  fontSize: 16,
}

const $buttonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderRadius: 12,
  borderColor: colors.palette.brandingMediumPink,
}

export { UploadUsers }
