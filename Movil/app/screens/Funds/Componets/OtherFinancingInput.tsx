import React, { FC } from "react";
import { View } from "react-native";
import { TextField ,Text} from "app/components";
import { OtherFinancingInputProps } from "./types"; 
import * as FormStyles from "./../Styles/FormStyles";

export const OtherFinancingInput: FC<OtherFinancingInputProps> = ({ formData, handleChange }) => (
  formData.financingType.includes('Otro') ? (
    <View style={FormStyles.$formGroup}>
      <Text style={FormStyles.$label}>Si selecciono Otro, por favor describa:</Text>
      <TextField
        style={FormStyles.$textarea}
        multiline
        value={formData.otherFinancingType}
        onChangeText={(value) => handleChange('otherFinancingType', value)}
      />
    </View>
  ) : null
);
