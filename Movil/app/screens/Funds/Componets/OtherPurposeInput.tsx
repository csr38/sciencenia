import React, { FC } from "react";
import { View } from "react-native";
import { OtherPurposeInputProps } from "./types";
import { Text,TextField } from "app/components";
import * as FormStyles from "./../Styles/FormStyles";

export const OtherPurposeInput: FC<OtherPurposeInputProps> = ({ formData, handleChange }) => (
  formData.purpose === 'Otro' ? (
    <View style={FormStyles.$formGroup}>
      <Text style={FormStyles.$label}>Si su respuesta anterior fue "Otro" indique el motivo:<Text style={FormStyles.$asterisk}> *</Text></Text>
      <TextField
        style={FormStyles.$textarea}
        multiline
        value={formData.otherPurpose}
        onChangeText={(value) => handleChange('otherPurpose', value)}
        placeholder="Por favor, especifique"
      />
    </View>
  ) : null
);
