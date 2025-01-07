import React, { FC, useState } from "react";
import { View, TextStyle, ViewStyle, Alert, Linking, TouchableOpacity, } from "react-native";
import { Button, Text, DetailItem } from "app/components";
import { colors, spacing, typography } from "app/theme";
import { useAuth0 } from "react-native-auth0";
import { api } from "app/services/api";
import { RejectionModal } from "./RejectionModal";
import { AprovedModalManagementFunds } from "./AprovedModalManagementFunds";

interface PendingFundProps {
  data:any
  navigation: any;
}
interface Payload {
  status: string;
  response?: string;
  amountGranted?:string;
  budgetId?:number;
}

export const PendingFund: FC<PendingFundProps> = ({ data, navigation }) => {
  const { getCredentials } = useAuth0();
  const [isModalVisible, setModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [responseReason, setResponseReason] = useState("");
  const [amountGranted, setAmountGranted] = useState("");
  const [budgetId, setBudgetId] = useState<number>(0);
  const [isAprovedModalVisible, setAprovedModalVisible] = useState(false);

  const formattedDate = new Date(data.startDate).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric"
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

      const payload: Payload = { status };
      if (reason) {
        payload.response = reason;
      }
      const response = await api.updateFundsStatus(data.id, payload, accessToken);
      if ("ok" in response) {
        Alert.alert("Beca Actualizada correctamente");
        setModalVisible(false);
        navigation.goBack()
        
      } 
       else {
       
        console.error("Error al obtener periodos de aplicación:", response);
        setModalVisible(false);
        navigation.navigate('ShowFundsHistory')
      }
    } catch (error) {
      console.error("Error inesperado al obtener periodos de aplicación:", error)
      setModalVisible(false);
      navigation.navigate('ShowFundsHistory')
    }
  };
  const resetFields = () => {
    setRejectionReason("");
    setResponseReason("");
    setAmountGranted("");
    setBudgetId(0);
  };
  const handleRejection = () => {
    if (rejectionReason.trim() === "") {
      Alert.alert("Motivo requerido", "Por favor, escribe un motivo para rechazar la solicitud.");
      return;
    }
    handleSubmit("Rechazada", rejectionReason);
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
    const handleSetBudgetId = (id: number) => {
      setBudgetId(id);
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
  
      const payload: Payload = { status, response:reason, amountGranted, budgetId };
  
      const response = await api.updateFundsStatus(data.id, payload, accessToken);
      if ("ok" in response) {
        Alert.alert("Solicitud de recursos Actualizada correctamente");
        setAprovedModalVisible(false);
        navigation.goBack()
      } else if (response.kind === "budget-limit-exceeded"){
        
          Alert.alert("Error", "El límite de presupuesto ha sido superado.");
          setAprovedModalVisible(false);
          resetFields();
          navigation.navigate('ShowFundsHistory')
        }
      
      else {

        Alert.alert("Hubo un error porfavor intente nuevamente");
        setAprovedModalVisible(false);
        console.error("Error al obtener periodos de aplicación:", response);
        resetFields();
        navigation.navigate('ShowFundsHistory')
      }
    } catch (error) {
      console.error("Error inesperado al obtener periodos de aplicación:", error);
      resetFields();
      navigation.navigate('ShowFundsHistory')
    }
  };
  
  return (
    <View style={$card}>
      <View style={$header}>
        <Text style={$title}>
        {data?.applicant
        ? `Postulación para recursos por parte de ${data.applicant.names} ${data.applicant.lastName} para ${data.purpose}`
        : "Datos del solicitante no disponibles"}
        </Text>
      </View>
      <View style={$descriptionContainer}>
        <DetailItem label="Destino" value={data.destination} />
        <DetailItem label="Duración" value={data.durationPeriod} />
        <DetailItem label="Financiamiento solicitado" value={data.financingType.join(", ")} />
        <DetailItem label="Fecha de inicio" value={formattedDate} />
        {data.purpose === "Asistencia a conferencia" && data.files.length > 0 && (
          <View>
            <Text style={$content}>• Documentos adjuntos:</Text>
            {data.files.map((file: any, index: number) => (
              <TouchableOpacity key={index} onPress={() => openLink(file.url)} style={$fileItem}>
                <Text>• </Text>
                <Text style={$link}>{file.fileName}</Text>
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
          text="Aprobar"
          onPress={() =>setAprovedModalVisible(true)}
        />
        <Button
          style={$declineButton}
          textStyle={$buttonText}
          pressedStyle={$declinebuttonPressed}
          text="Rechazar"
          onPress={() => setModalVisible(true)}
        />
      </View>
      <RejectionModal
        isVisible={isModalVisible}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        onConfirm={handleRejection}
        onCancel={() => setModalVisible(false)}
      />
      <AprovedModalManagementFunds 
        isVisible={isAprovedModalVisible} 
        reason={responseReason} 
        amountGranted={amountGranted} 
        setAmountGranted={handleSetGrantedAmount} 
        setReason={handleSetResponseReason} 
        onCancel={() => setAprovedModalVisible(false)} 
        onConfirm={handleAproved}
        onBudgetSelect={handleSetBudgetId}
      />
    </View>
  );
};

const $buttonContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
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

const $buttonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 16,
  fontWeight: 'bold',
};

const $aprovebuttonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderRadius: 8,
  borderColor: colors.palette.brandingMediumPink,
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

const $declinebuttonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingGray,
  borderRadius: 8,
  borderColor: colors.palette.brandingGray,
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
  color: colors.palette.brandingDarkerBlue,
  fontFamily: typography.primary.bold,
  fontSize: 16,
};

const $link: TextStyle = {
  fontSize: 16,
  color: colors.palette.brandingDarkBlue,
  marginVertical: spacing.sm,
  textDecorationLine: "underline",
};

const $fileItem: ViewStyle = {
  flexDirection: "row", // Alineación horizontal entre punto y texto
  alignItems: "center", // Alinea verticalmente los elementos
  paddingLeft: 15,
};

const $descriptionContainer: ViewStyle = {
  display:"flex",
  marginTop: 15,
  marginBottom: spacing.md,
};

const $header: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
};

const $title: TextStyle = {
  color: colors.palette.brandingPink,
  fontFamily: typography.primary.bold,
  fontSize: 20,
  flexShrink: 1,
  flexWrap: "wrap",
};

export default PendingFund;
