import React, { FC } from "react";
import { View } from "react-native";
import * as FormStyles from "./../Styles/FormStyles";
import {Text, Toggle } from "app/components"
import { FinancingOptionsProps } from "./types";


const FinancingOptions: FC<FinancingOptionsProps> = ({ formData, handleCheckboxChange }) => (
  <View>
    <Text style={FormStyles.$label}>Financiamiento Solicitado
        <Text style={FormStyles.$asterisk}> *</Text>
      </Text>
      <View style={FormStyles.$checkboxGroup}>
    {[
      "Pasajes $1.200.000 pesos máximo para pasajes aéreos",
      "Viáticos (alojamiento + alimentación) $100.000 a $150.000 pesos máximo diarios",
      "Inscripción a conferencia",
      "Otro",
    ].map(option => (
      <View style={FormStyles.$checkboxContainer} key={option}>
        <Text style={FormStyles.$switchText}>{option}</Text>
        <Toggle
          variant="switch"
          value={formData.financingType.includes(option)}
          onValueChange={() => handleCheckboxChange(option)}
        />
      </View>
    ))}
    </View>
  </View>
);

export default FinancingOptions;
