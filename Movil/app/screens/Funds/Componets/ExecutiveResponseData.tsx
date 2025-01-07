import React, { FC } from "react";
import { TextStyle, View, ViewStyle } from "react-native";
import { TextField ,Text} from "app/components";
import { ExecutiveResponseDataProps } from "./types"; 
import { colors, spacing, typography } from "app/theme";
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
export const ExecutiveResponseData: FC<ExecutiveResponseDataProps> = ({ formData }) => {

  if (formData.status === "Rechazada" ||formData.status === "Rechazado") {
    return (
      <View>
        <DetailItem label="• Solucion Ejecutivo: " value={formData.response} />
      </View>
    );
  }if (formData.status === "Aprobada") {
    return (
        <View>
        <FundingRequestDisplay amountRequested={formData.amountGranted} label={"• Monto Otorgado:"}/>
        <DetailItem label="• Solucion Ejecutivo: " value={formData.response} />
  
      </View>
    );
  }
  else{
    return null
  }
};
const $label: TextStyle = {
    color: colors.palette.brandingDarkerBlue,
    fontFamily: typography.primary.bold,
    fontSize: 16,
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