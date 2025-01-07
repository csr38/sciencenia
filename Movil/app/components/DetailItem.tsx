import React from "react";
import { View, TextStyle } from "react-native";
import { Text } from "app/components";
import { colors, spacing } from "app/theme";

export const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | string[]; // Permite string, número o array de strings
}) => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString("es-CL"); // Formatea con puntos cada mil (ejemplo: 1.000, 10.000)
  };

  return (
    <View style={$detailContainer}>
      <Text style={$detail}>
        <Text style={$detailLabel} preset="bold">• {label}: </Text>
        {typeof value === "number" && <Text style={$detailValue}>$ {formatNumber(value)}</Text>}
        {typeof value === "string" && !Array.isArray(value) && <Text style={$detailValue}>{value}</Text>}
      </Text>
      {Array.isArray(value) &&
        value
          .filter((item) => item !== null && item !== undefined && item !== "null")
          .map((item, index) => (
            <Text key={index} style={$detailValueIndented}>• {item}</Text>
          ))}
    </View>
  );
};

const $detailContainer: TextStyle = {
  marginBottom: spacing.md,
};

const $detail: TextStyle = {
  fontSize: 16,
};

const $detailLabel: TextStyle = {
  color: colors.palette.brandingDarkerBlue,
};

const $detailValue: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontSize: 16,
};

const $detailValueIndented: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontSize: 16,
  marginLeft: spacing.md, // Solo para los elementos de la lista
};