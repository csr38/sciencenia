import React, { FC } from "react";
import { View } from "react-native";
import { TextField,Text } from "app/components";
import { OutsideFinancingDetailsProps } from "./types"; 
import * as FormStyles from "./../Styles/FormStyles";

export const OutsideFinancingDetails: FC<OutsideFinancingDetailsProps> = ({ formData, handleChange }) => (
  formData.outsideFinancing ? (
    <View style={FormStyles.$formGroup}>
      <Text style={FormStyles.$label}>¿Cuáles?</Text>
      <TextField
        style={FormStyles.$textarea}
        multiline
        value={formData.outsideFinancingSponsors}
        onChangeText={(value) => handleChange('outsideFinancingSponsors', value)}
      />
    </View>
  ) : null
);
