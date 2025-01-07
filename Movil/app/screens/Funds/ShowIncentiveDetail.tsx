import React from "react"
import { View, Text, TextStyle, ViewStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"
import { useNavigation } from "@react-navigation/native";
import { useHeader } from "app/utils/useHeader";
import { Screen, Button } from "app/components";
import FileList from "../FundApplications/FileList ";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FundsNavigatorParamList } from "app/navigators";
import { ExecutiveResponseData } from "./Componets/ExecutiveResponseData";

type ShowIncentiveDetailProps = NativeStackScreenProps<FundsNavigatorParamList, 'ShowIncentiveDetail'>

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

const ShowIncentiveDetail =  ({ route }: ShowIncentiveDetailProps) => {
  const navigation = useNavigation();
  const { incentiveRequest, files, title } = route.params
  useHeader({
    title: "Detalle de la solicitud",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  });

  return (
    <Screen preset="scroll" style={$container}>
      <Text style={$title}>{title}</Text>
      <View style={$section}>
        <DetailItem label="• Estado: " value={incentiveRequest.status} />
        <FundingRequestDisplay amountRequested={incentiveRequest.amountRequested} label={"• Monto Solicitado:"}/>
        <ExecutiveResponseData formData={incentiveRequest} />


        <View  style={$detailItemContainer}>
          <Text style={$label}>
            • ID de la solicitud:
            <Text style={$value}> {incentiveRequest.id}</Text> 
          </Text>
        </View>

        <DetailItem label="• Fecha de Graduacion: " value={incentiveRequest.graduationDate} />
        <DetailItem label="• Produccion cientifica: " value={incentiveRequest.scientificProduction} />
        {files?.length > 0 && <FileList files={files} />}
        <View style={$buttonPosition}>
          {incentiveRequest.status === "Pendiente" && (
            <Button 
              style={$button}
              textStyle={$buttonText}
              pressedStyle={$buttonPressed}
              text="Editar"
              // @ts-ignore
              onPress={() => navigation.navigate("EditIncentiveRequest", { incentiveRequest })}
            />
          )}
        </View>
      </View>
    </Screen>
  );
};

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
  elevation: 4,
}

const $title: TextStyle = {
  color: colors.palette.brandingPink,
  fontFamily: typography.primary.bold,
  fontSize: 24,
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

export default ShowIncentiveDetail;
