import React, { FC } from "react";
import { View, TextStyle, ViewStyle, Alert, Linking, TouchableOpacity } from "react-native";
import { Text, DetailItem } from "app/components";
import { colors, spacing, typography } from "app/theme";

interface IncentivesHistoryProps {
  data: any;
}

export const IncentivesHistory: FC<IncentivesHistoryProps> = ({ data }) => {
  const formattedDate = (date: string) =>
    new Date(date).toLocaleDateString("es-ES", {
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

  return (
    <View style={$card}>
      <View style={$header}>
        <Text style={$title}>{data.applicationPeriod.periodTitle}</Text>
      </View>

      <View>
        <DetailItem label="Estudiante" value={`${data.student.names} ${data.student.lastName} ${data.student.secondLastName}`} />
        <DetailItem label="Email" value={data.student.email} />
        <DetailItem label="Rut" value={data.student.rut} />
        <DetailItem label="Fecha de graduación" value={formattedDate(data.graduationDate)} />
        <DetailItem label="Producción científica" value={data.scientificProduction} />
        <DetailItem label="Participación en CENIA" value={data.ceniaParticipationActivities} />
        <DetailItem label="Justificación de beca no ANID" value={data.nonAnidScholarshipJustification || "No aplica"} />
        <DetailItem label="Otros financiamientos" value={data.otherProgramsFunding || "No aplica"} />
        <DetailItem label="Otras afiliaciones" value={data.otherCentersAffiliation || "No aplica"} />
      </View>

      {data.files && data.files.length > 0 && (
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
  marginBottom: 10,
};

const $title: TextStyle = {
  color: colors.palette.brandingPink,
  fontFamily: typography.primary.bold,
  fontSize: 20,
  marginBottom: 5,
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