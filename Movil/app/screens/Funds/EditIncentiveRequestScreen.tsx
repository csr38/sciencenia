import React, { useState, FC } from "react";
import { Alert, View, ViewStyle, TextStyle } from "react-native";
import { TextField, Button, Text } from "app/components";
import { FundsStackScreenProps } from "app/navigators";
import { useHeader } from "app/utils/useHeader";
import { Screen } from "../../components/Screen";
import { useAuth0 } from "react-native-auth0";
import { api } from "app/services/api";
import { colors } from "app/theme"
import DocumentPicker from "react-native-document-picker";
import { PaperSelector } from "./Componets/PaperSelector";
import * as FormStyles from "./Styles/FormStyles";
import EditIncentiveSelectedFiles from "./Componets/EditIncentiveSelectedFiles";
import { CustomDatePicker } from "app/components/CustomDatePicker";
import { EditRequestedAmount } from "./Componets/EditRequestedAmount";

interface FileUpload {
  uri: string;
  name: string;
  type: string;
  size?: any;
  content?: any;
}

interface EditIncentiveRequestProps
  extends FundsStackScreenProps<"EditIncentiveRequest"> {}

export const EditIncentiveRequestScreen: FC<EditIncentiveRequestProps> = ({
  route,
  navigation,
}) => {
  const { incentiveRequest } = route.params;
  const { getCredentials } = useAuth0();
  const [selectedStartDate, setSelectedStartDate] = useState(
    new Date(incentiveRequest.graduationDate || Date.now())
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useHeader({
    title: "Editar solicitud",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  });

  const [formData, setFormData] = useState({
    ...incentiveRequest,
    files: incentiveRequest.files || [],
  });

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
  
      const fileToUpload: FileUpload = {
        uri: result[0].uri,
        name: result[0].name,
        type: result[0].type,
      };
  
      await handleUpload(fileToUpload);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert("Selección de archivo cancelada");
      } else {
        Alert.alert("Error al seleccionar archivo");
        console.error(err);
      }
    }
  };
  
  const handleUpload = async (file: FileUpload) => {
    if (!file) {
      Alert.alert("Por favor, selecciona un archivo");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("files", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
  
      const credentials = await getCredentials();
      if (!credentials) {
        Alert.alert("Error", "No se pudo obtener el token de acceso.");
        return;
      }
  
      const accessToken = credentials.accessToken;
      const response = await api.attachIncentiveFile(incentiveRequest.id, formData, accessToken);
  
      if ("ok" in response) {
        if (response.ok) {
          Alert.alert("Éxito", "Archivo subidio exitosamente.");
          setFormData((prevFormData) => ({
            ...prevFormData,
            files: [
              ...prevFormData.files,
              { id: response.data.id, fileName: file.name },
            ],
          }));
        } else {
          Alert.alert("Error", "No se pudo subir el archivo.");
          console.error("Error:", response.problem);
        }
      } else {
        Alert.alert("Error", "Respuesta no válida.");
        console.error("Respuesta no válida:", response);
      }
      
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert("Selección de archivo cancelada");
      } else {
        Alert.alert("Error al seleccionar archivo");
        console.error(err);
      }
    }
  };

  
  
  const handleChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const {
      graduationDate,
      scientificProduction,
      ceniaParticipationActivities,
    } = formData;
    if (
      !graduationDate ||
      !scientificProduction ||
      !ceniaParticipationActivities
    ) {
      Alert.alert("Error", "Por favor, complete todos los campos obligatorios.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const allowedFields = ["graduationDate", "scientificProduction", "files","amountRequested"];
      const filteredFormData: any = {};

    allowedFields.forEach((field) => {
      if (formData[field] !== undefined) {
        filteredFormData[field] = formData[field];
      }
    });

      const data = new FormData();
      for (const key in filteredFormData) {
        if (key === "files") {
          filteredFormData.files.forEach((file, index) => {
            data.append(`files`, file);
          });
        } else {
          data.append(key, filteredFormData[key]);
        }
      }

      const credentials = await getCredentials();
      if (!credentials) {
        Alert.alert("Error", "No se pudo obtener el token de acceso.");
        return;
      }
      const accessToken = credentials.accessToken;
      const response = await api.updateIncentiveRequest(
        incentiveRequest.id,
        data,
        accessToken
      );

      if ("ok" in response && response.ok) {
        Alert.alert("Éxito", "Cambios guardados exitosamente.");
        navigation.navigate("FundsView");
      } else {
        Alert.alert("Error", "Hubo un problema al guardar los cambios.");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al guardar los cambios.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen preset="auto" contentContainerStyle={FormStyles.$container} style={$backgroundColor}>
      <View style={FormStyles.$formGroup}>
        <Text style={FormStyles.$label}>
          Fecha de graduación
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
        <CustomDatePicker
          date={selectedStartDate}
          onChangeDate={(date) => {
            setSelectedStartDate(date);
            handleChange("graduationDate", date.toISOString());
          }}
        />
      </View>
      <View style={FormStyles.$formGroup}>
        <Text style={FormStyles.$label}>Producción Científica
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
        <TextField
          value={formData.scientificProduction}
          onChangeText={(text) => handleChange("scientificProduction", text)}
          placeholder="Escriba su titulo"
        />
      </View>
      <PaperSelector label="Agregue el paper a presentar" onPress={selectFile} />
      <EditIncentiveSelectedFiles files={formData.files} incentiveRequestId={incentiveRequest.id} />
      <EditRequestedAmount formData={formData} handleChange={handleChange} />
      <Button 
        text="Guardar Cambios"
        onPress={handleSave}
        disabled={isSubmitting}
        style={$button}
        pressedStyle={$buttonPressed}
        textStyle={$textButton}
      />
    </Screen>
  );
};

const $backgroundColor: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite, 
}

const $button: ViewStyle = {
  marginTop: 20,
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
  fontWeight: "bold",
  fontSize: 16, 
}

export default EditIncentiveRequestScreen;