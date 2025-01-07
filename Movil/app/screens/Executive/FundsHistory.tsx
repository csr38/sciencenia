import React, { FC } from "react";
import { View, TextStyle, ViewStyle, Alert, Linking, TouchableOpacity } from "react-native";
import { Text, DetailItem } from "app/components";
import { colors, spacing, typography } from "app/theme";

interface FundsHistoryProps {
  data: any;
  navigation: any;
}

export const FundsHistory: FC<FundsHistoryProps> = ({ data, navigation }) => {
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
  const applicantNames = data.applicant?.names || 'Nombre no disponible';
  const applicantLastName = data.applicant?.lastName || 'Apellido no disponible';

  return (
    <View style={$card}>
      <View style={$header}>
        <Text style={$title}>Solicitud de recursos por {applicantNames} {applicantLastName} para {data.purpose}</Text>
      </View>
      <View style={$descriptionContainer}>
        <DetailItem label="Destino" value={data.destination} />
        <DetailItem label="Duración" value={data.durationPeriod} />
        <DetailItem label="Financiamiento solicitado" value={data.financingType} />
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
    </View>
  );
};

const $card: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  borderRadius: 8,
  elevation: 4,
  margin: 10,
  padding: 15,
  paddingHorizontal: 20,
  shadowColor: colors.palette.brandingBlack,
  shadowOpacity: 0.2,
  shadowRadius: 4,
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

const $descriptionContainer: ViewStyle = {
  marginTop: 10,
  display: "flex",
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