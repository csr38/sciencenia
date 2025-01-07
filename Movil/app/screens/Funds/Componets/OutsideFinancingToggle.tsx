import React, { FC } from "react";
import { View, ViewStyle, TextStyle } from "react-native";
import { Toggle, Text } from "app/components";
import { OutsideFinancingToggleProps } from "./types";
import {
  $label,
  $radioContainer,
  $asterisk,
} from "./../Styles/FormStyles";

export const OutsideFinancingToggle: FC<OutsideFinancingToggleProps> = ({ formData, handleChange }) => (
  <View style={$labelWithToggle}>
    <Text style={$label}>
      ¿Estás postulando a otras fuentes de financiamiento?
      <Text style={$asterisk}> *</Text>
    </Text>
    <View style={$toggleContainer}>
      <View style={$radioContainer}>
        <View style={$textToggleContainer}>
          <Text style={$textMargin}>
            {formData.outsideFinancing ? "Sí" : "No"}
          </Text>
          <Toggle
            variant="switch"
            value={formData.outsideFinancing}
            onValueChange={() => handleChange('outsideFinancing', !formData.outsideFinancing)}
          />
        </View>
      </View>
    </View>
  </View>
);

const $textToggleContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};

const $textMargin: TextStyle = {
  marginRight: 8,
};

const $toggleContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
};

const $labelWithToggle: ViewStyle ={
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 10,
}