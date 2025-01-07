import React, { FC, useState } from "react";
import { Alert, ViewStyle, TextStyle } from "react-native";
import { Button } from "app/components";
import { FundsStackScreenProps } from "app/navigators";
import { useHeader } from "app/utils/useHeader";
import { Screen } from "../../components/Screen";
import { useAuth0 } from "react-native-auth0";
import { api } from "app/services/api";
import DocumentPicker from "react-native-document-picker";
import { EditConferenceDetails } from "app/screens/Funds/Componets/EditConferenceDetails";
import * as FormStyles from "app/screens/Funds/Styles/FormStyles";
import EditTravelInformation from "app/screens/Funds/Componets/EditTravelInformation";
import { colors } from "app/theme"
import { EditRequestedAmount } from "../Funds/Componets/EditRequestedAmount";


interface FileUpload {
  uri: string;
  name: string;
  type: string;
}

interface EditFundingRequestProps extends FundsStackScreenProps<"EditFundingRequest"> {}

export const EditFundingRequestScreen: FC<EditFundingRequestProps> = ({ route, navigation }) => {
  const { fundingRequest } = route.params;
  const { getCredentials } = useAuth0();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ ...fundingRequest });
  const [selectedStartDate, setSelectedStartDate] = useState(new Date(formData.startDate));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);


  useHeader({
    title: "Editar Solicitud",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  });

  const handleChange = (name: string, value: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, 
    }));
  };

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.pick({ type: [DocumentPicker.types.pdf] });
      const fileToUpload: FileUpload = {
        uri: result[0].uri,
        name: result[0].name,
        type: result[0].type,
      };

      const formData = new FormData();
      formData.append('files', {
        uri: fileToUpload.uri,
        name: fileToUpload.name,
        type: fileToUpload.type,
      });

      const credentials = await getCredentials();
      if (!credentials) {
        Alert.alert("Error", "No se pudo obtener el token de acceso.");
        return;
      }
      const accessToken = credentials.accessToken;
      const response = await api.attachFundFile(fundingRequest.id, formData, accessToken);

      if ("ok" in response) {
        if (response.ok) {
          Alert.alert("Éxito", "Archivo subidio exitosamente.");
          const newFile = { id: response.data.id, fileName: fileToUpload.name };
          setFormData((prevFormData) => ({
            ...prevFormData,
            files: [...(prevFormData.files || []), newFile],
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const allowedFields = ["destination", "startDate", "durationPeriod", "amountRequested", "conferenceName", "files"];
      const filteredFormData: any = {};

      allowedFields.forEach((field) => {
        if (formData[field] !== undefined) {
          filteredFormData[field] = formData[field];
        }
      });


      const data = new FormData();
      for (const key in filteredFormData) {
        data.append(key, filteredFormData[key]);
      }


      const credentials = await getCredentials();
      if (!credentials) {
        Alert.alert("Error", "No se pudo obtener el token de acceso.");
        return;
      }
      const accessToken = credentials.accessToken;
      const response = await api.updateFundRequest(fundingRequest.id, data, accessToken);

      if ("ok" in response) {
        if (response.ok) {
          Alert.alert("Éxito", "Solicitud actualizada exitosamente.");
          navigation.navigate("ViewFundsRequests");
        } else {
          Alert.alert("Error", "No se pudo actualizar la solicitud.");
          console.error("Error:", response.problem);
        }
      } else {
        Alert.alert("Error", "Respuesta no válida.");
        console.error("Respuesta no válida:", response);
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al actualizar la solicitud.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen preset="scroll" contentContainerStyle={FormStyles.$container} style={$backgroundColor}>
      <EditTravelInformation
        formData={formData}
        handleChange={handleChange}
        selectedStartDate={new Date(formData.startDate)}
        setSelectedStartDate={setSelectedStartDate}
        showStartDatePicker={showStartDatePicker}
        setShowStartDatePicker={setShowStartDatePicker}
      />
      <EditConferenceDetails formData={formData} id={fundingRequest.id} handleChange={handleChange} selectFile={selectFile} />
      <EditRequestedAmount formData={formData} handleChange={handleChange} />
      <Button
        style={$button}
        pressedStyle={$buttonPressed}
        textStyle={$textButton}
        onPress={handleSubmit}
        disabled={isSubmitting}>
          Guardar cambios
      </Button>
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

export default EditFundingRequestScreen;
