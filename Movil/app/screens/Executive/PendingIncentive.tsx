import React, { FC, useState } from "react";
import { View, TextStyle, ViewStyle, Alert, TouchableOpacity, Linking } from "react-native";
import { Button, Text } from "app/components";
import { colors, spacing, typography } from "app/theme";
import { useAuth0 } from "react-native-auth0";
import { api } from "app/services/api";
import { AprovedModal } from "./AprovedModal";
import { RejectionModal } from "./RejectionModal";

interface PendingIncentiveProps {
  data: any;
  navigation: any;
}
interface Payload {
  status: string;
  response: string;
  amountGranted: string;
}

export const PendingIncentive: FC<PendingIncentiveProps> = ({ data, navigation}) => {
  const { getCredentials } = useAuth0();
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [responseReason, setResponseReason] = useState("");
  const [amountGranted, setAmountGranted] = useState("");
  const [isAprovedModalVisible, setAprovedModalVisible] = useState(false);

  const formattedGraduationDate = new Date(data.graduationDate).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "No se puede abrir el enlace.");
    }
  };

  const handleSubmit = async (status: string, reason?: string) => {
    try {
      const credentials = await getCredentials();
      if (!credentials) {
        Alert.alert("Error", "No se pudo obtener el token de acceso.");
        return;
      }
      const accessToken = credentials.accessToken;
      const payload: any = {
        emailStudent: data.student.email,
        status,
      };

      if (reason) {
        payload.response = reason;
      }

      const response = await api.updateIncentiveStatus(data.id, payload, accessToken);

      if ("ok" in response) {
        Alert.alert("Beca actualizada correctamente");
        navigation.goBack();
      } else {
        console.error("Error al actualizar el estado:", response);
      }
    } catch (error) {
      console.error("Error inesperado al actualizar el estado:", error);
    }
  };

  const openRejectionModal = () => {
    setModalVisible(true);
  };
  const openAprovedModal = () => {
    setAprovedModalVisible(true);
  };


  const submitRejection = () => {
    if (!rejectionReason.trim()) {
      Alert.alert("Error", "El motivo de rechazo no puede estar vacío.");
      return;
    }
    handleSubmit("Rechazada", rejectionReason);
    setModalVisible(false);
    setRejectionReason(""); 
  };
  const handleAproved = () => {
  if (responseReason.trim() === "") {
    Alert.alert("Motivo requerido", "Por favor, escribe un motivo para ceptar la solicitud.");
    return;
  }
  if (!amountGranted || amountGranted.trim() === "") {
    Alert.alert("Monto requerido", "Por favor, ingresa el monto otorgado.");
    return;
  }
  handleSubmitAproved("Aprobada", responseReason, amountGranted);
};
  const handleSetResponseReason = (reason: string) => {
    setResponseReason(reason);
  };
  const handleSetGrantedAmount = (amountGranted: string) => {
    setAmountGranted(amountGranted);
  };

const handleSubmitAproved = async (status: string, reason?: string, amountGranted?: string) => {
  try {
    if (!reason) {
      Alert.alert("Error", "Por favor, ingresa el motivo del rechazo.");
      return;
    }
    if (!amountGranted) {
      Alert.alert("Error", "Por favor, ingresa el monto otorgado.");
      return;
    }

    const credentials = await getCredentials();
    if (!credentials) {
      Alert.alert("Error", "No se pudo obtener el token de acceso.");
      return;
    }
    const accessToken = credentials.accessToken;

    const payload: Payload = { status, response:reason, amountGranted };

    const response = await api.updateIncentiveStatus(data.id, payload, accessToken);
    if ("ok" in response) {
      Alert.alert("Beca actualizada correctamente");
      setAprovedModalVisible(false);
      navigation.goBack()
    } else {
      Alert.alert("Hubo un error porfavor intente nuevamente");
      setAprovedModalVisible(false);
      console.error("Error al obtener periodos de aplicación:", response);
    }
  } catch (error) {
    console.error("Error inesperado al obtener periodos de aplicación:", error);
  }
};

  return (
    <View style={$card}>
      <View style={$header}>
        <Text style={$title}>
          Postulación estudiante {data.student.names} {data.student.lastname};{" "}
          {data.applicationPeriod.periodTitle}
        </Text>
      </View>
      <View style={$descriptionContainer}>
        <Text style={$content}>• Grado Académico: {data.student.academicDegree}</Text>
        <Text style={$content}>• Institución: {data.student.institution}</Text>
        <Text style={$content}>• Producción científica: {data.scientificProduction}</Text>
        <Text style={$content}>• Teléfono: {data.student.phoneNumber}</Text>
        <Text style={$content}>• Participación en Cenia: {data.ceniaParticipationActivities}</Text>
        <Text style={$content}>• Graduación: {formattedGraduationDate}</Text>
        {data.files.length > 0 && (
          <View>
            {data.files.map((file: any, index: number) => (
              <TouchableOpacity key={index} onPress={() => openLink(file.url)}>
                <Text style={$link}>• Archivo: {file.fileName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <View style={$buttonContainer}>
        <Button
          style={$aproveButton}
          textStyle={$buttonText}
          pressedStyle={$aprovebuttonPressed}
          text={`Aprobar`}
          onPress={openAprovedModal}
        />
        <Button
          style={$declineButton}
          textStyle={$buttonText}
          pressedStyle={$declinebuttonPressed}
          text={`Rechazar`}
          onPress={openRejectionModal}
        />
      </View>

    
      <RejectionModal
        isVisible={isModalVisible}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        onConfirm={submitRejection}
        onCancel={() => setModalVisible(false)}
      />
      <AprovedModal 
        isVisible={isAprovedModalVisible} 
        reason={responseReason} 
        amountGranted={amountGranted} 
        setAmountGranted={handleSetGrantedAmount} 
        setReason={handleSetResponseReason} 
        onCancel={() => setAprovedModalVisible(false)} 
        onConfirm={handleAproved}/>
    </View>
  );
};

const $buttonContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 15,
};

const $aproveButton: ViewStyle = {
  backgroundColor: colors.palette.brandingPink,
  borderRadius: 8,
  justifyContent: "center",
  marginBottom: spacing.md,
  marginTop: spacing.lg,
  paddingVertical: spacing.md,
  borderColor: colors.palette.brandingPink,
};

const $declineButton: ViewStyle = {
  backgroundColor: colors.palette.brandingDarkerBlue,
  borderRadius: 8,
  justifyContent: "center",
  marginBottom: spacing.md,
  marginTop: spacing.lg,
  paddingVertical: spacing.md,
  borderColor: colors.palette.brandingDarkerBlue,
};

const $aprovebuttonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderRadius: 8,
  borderColor: colors.palette.brandingMediumPink,
};

const $declinebuttonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingGray,
  borderRadius: 8,
  borderColor: colors.palette.brandingGray,
};

const $buttonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 16,
  fontWeight: 'bold',
};

const $card: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  borderRadius: 8,
  elevation: 2,
  margin: 10,
  padding: 15,
  paddingHorizontal: 20,
  shadowColor: colors.palette.brandingBlack,
  shadowOpacity: 0.2,
  shadowRadius: 4,
};

const $content: TextStyle = {
  color: colors.palette.brandingBlack,
  fontFamily: typography.primary.normal,
  fontSize: 16,
  marginTop: 10,
};

const $descriptionContainer: ViewStyle = {
  display:"flex"
};

const $header: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
};

const $title: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontFamily: typography.primary.bold,
  fontSize: 20,
  flexShrink: 1,
  flexWrap: "wrap",
};

const $link: TextStyle = {
  fontSize: 16,
  color: colors.palette.brandingDarkBlue,
  marginVertical: spacing.sm,
  textDecorationLine: "underline",
};
