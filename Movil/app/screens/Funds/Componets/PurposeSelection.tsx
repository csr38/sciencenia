import React, { FC } from "react";
import { View } from "react-native";
import { PurposeSelectionProps } from "./types"; 
import * as FormStyles from "./../Styles/FormStyles";
import { Text, Toggle } from "app/components"
export const PurposeSelection: FC<PurposeSelectionProps> = ({ formData, handleToggle }) => (
  <View style={FormStyles.$formGroup}>
    <Text style={FormStyles.$label}>Seleccione un Motivo:<Text style={FormStyles.$asterisk}> *</Text></Text>
    <View style={FormStyles.$switchContainer}>
      {["Asistencia a conferencia", "Visita de colaboración científica", "Pasantía breve", "Invitación a Chile de un investigador/a internacional", "Otro"].map((purpose) => (
        <View style={FormStyles.$switchRow} key={purpose}>
          <Text style={FormStyles.$switchText}>{purpose}</Text>
          <Toggle variant="switch"
            value={formData.purpose === purpose}
            onValueChange={() => handleToggle(purpose)}
          />
        </View>
      ))}
    </View>
  </View>
);
