import React from "react";
import { View, ScrollView, TextStyle, ViewStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useHeader } from "../../utils/useHeader";
import { Text, Button } from 'app/components';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors, spacing, typography } from "app/theme";
import { FundsNavigatorParamList } from "app/navigators";
import FileList from "./FileList ";
import { ExecutiveResponseData } from "../Funds/Componets/ExecutiveResponseData";

const DetailItem = ({ label, value }: { label: string, value?: string | string[] }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;

  const displayValue = Array.isArray(value)
    ? value.join(", ")
    : value.includes("T")
    ? formatDate(value)
    : value;

  return (
    <View style={$detailItemContainer}>
      <Text style={$label}>
        {label}
        <Text style={$value}>{displayValue}</Text> 
      </Text>
    </View>
  );
};
const FundingRequestDisplay = ({ amountRequested, label }:{ amountRequested:string,label:string }) => {
  const formatToCLP = (amount) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount);
  };

  return <View style={$detailItemContainer}>
  <Text style={$label}>
    {label}
    <Text style={$value}>{formatToCLP(amountRequested)}</Text> 
  </Text>
</View>;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : date.toISOString().split("T")[0];
};

type Props = NativeStackScreenProps<FundsNavigatorParamList, 'ShowFundingRequest'>;
const ApplicationDetailScreen = ({ route }: Props) => {
  const { fundingRequest } = route.params;
  const navigation = useNavigation();
  const filteredFinancingType = fundingRequest.financingType.filter(type => type !== "null");
  useHeader({
    title: "Detalle de la solicitud",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
    
  });
  

  return (
    <ScrollView style={$container}>
      <Text style={$title}>{fundingRequest.purpose} - {fundingRequest.destination}</Text>
      <View style={$section}>
        <View style={$card}>
          <DetailItem label="• Estado: " value={fundingRequest.status} />
          <DetailItem label="• Motivo: " value={fundingRequest.purpose} />
          <DetailItem label="• Destino: " value={fundingRequest.destination} />
          <FundingRequestDisplay amountRequested={fundingRequest.amountRequested} label={"• Monto Solicitado:"}/>
          <ExecutiveResponseData formData={fundingRequest} />
          <DetailItem label="• Fecha de inicio: " value={fundingRequest.startDate} />
          <DetailItem label="• Tipo de financiamiento: " value={filteredFinancingType} />
          <DetailItem label="• Explicación de otro financiamiento: " value={fundingRequest.otherFinancingTsype} />
          <DetailItem label="• Nombre de la conferencia: " value={fundingRequest.conferenceName} />
          {
            // @ts-ignore
            fundingRequest.files?.length > 0 && <FileList files={fundingRequest.files} />
          }
        </View>
        <View style={$buttonPosition}>
          {fundingRequest.status === "Pendiente" && (
            <Button
              style={$button}
              textStyle={$buttonText}
              pressedStyle={$buttonPressed}
              text="Editar"
              // @ts-ignore
              onPress={() => navigation.navigate("EditFundingRequest", { fundingRequest })}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const $card: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  borderRadius: 10,
  padding: spacing.md,
  shadowColor: colors.palette.brandingBlack,
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 4,
}

const $container: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  flex: 1,
  paddingHorizontal: spacing.md,
  paddingTop: spacing.md,
}

const $label: TextStyle = {
  color: colors.palette.brandingDarkerBlue,
  fontFamily: typography.primary.bold,
  fontSize: 16,
}

const $section: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  borderRadius: 10,
  marginBottom: spacing.lg,
  padding: spacing.md,
  shadowColor: colors.palette.brandingBlack,
  shadowOpacity: 0.1,
  shadowRadius: 10,
}

const $title: TextStyle = {
  color: colors.palette.brandingPink,
  fontFamily: typography.primary.bold,
  fontSize: 24,
  marginTop: spacing.md,
  marginBottom: spacing.md,
}

const $value: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontFamily: typography.primary.normal,
  fontSize: 16,
  marginLeft: spacing.xs,
}

const $detailItemContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  marginBottom: spacing.md,
}

const $button: ViewStyle = {
  backgroundColor: colors.palette.brandingPink,
  borderRadius: 8,
  borderColor: colors.palette.brandingPink,
  marginTop: spacing.lg,
  width: "40%", 
}

const $buttonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontFamily: typography.primary.bold,
  fontSize: 16,
}

const $buttonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderColor: colors.palette.brandingMediumPink,
}

const $buttonPosition: ViewStyle = {
  alignItems: "center",
}

export default ApplicationDetailScreen;
