import React, { FC } from "react";
import { View, TextStyle, ViewStyle, TouchableOpacity,  } from "react-native";
import { DetailItem, Text } from "app/components";
import { colors,  typography } from "app/theme";

interface FundManagmentInformationProps {
  data: {
    budgetTitle: string;
    createdAt: string;
    endDate: string;
    fundingBudgetDescription: string;
    id: number;
    startDate: string;
    status: string;
    totalBudget: number;
    updatedAt: string;
    usedBudget: number;
  };
  navigation:any;
}

export const FundManagmentInformation: FC<FundManagmentInformationProps> = ({ data,navigation }) => {
  const formattedStartDate = new Date(data.startDate).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  

  const formattedEndDate = new Date(data.endDate).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const remainingBudget = data.totalBudget - data.usedBudget;
  return (
    <TouchableOpacity style={$card}  
    onPress={() => navigation.navigate("EditFundManagement", { data: data })}
    >
      <View style={$header}>
        <Text style={$title}>{data.budgetTitle}</Text>
      </View>
      <View style={$descriptionContainer}>
        <DetailItem label="Descripción" value={data.fundingBudgetDescription} />
        <DetailItem label="Estado" value={data.status} />
        <DetailItem label="ID del la disponibilidad de Fondos" value={data.id} />
        <DetailItem label="Fecha de inicio" value={formattedStartDate} />
        <DetailItem label="Fecha de finalización" value={formattedEndDate} />
        <DetailItem label="Presupuesto total" value={data.totalBudget} />
        <DetailItem label="Presupuesto utilizado" value={data.usedBudget} />
        <DetailItem label="Presupuesto restante" value={remainingBudget} />
      </View>
    </TouchableOpacity>
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
  display: "flex",
  marginTop: 15,
};
