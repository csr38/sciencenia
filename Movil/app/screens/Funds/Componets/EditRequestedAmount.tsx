import React, { FC } from "react";
import { View } from "react-native";
import { TextField ,Text} from "app/components";
import { AmountRequestedProps } from "./types"; 
import * as FormStyles from "./../Styles/FormStyles";


export const EditRequestedAmount: FC<AmountRequestedProps> = ({ formData, handleChange }) => {
    const amountString = formData.amountRequested?.toString();
    return (
    <View>
      <View style={FormStyles.$formGroup}>
        <Text style={FormStyles.$label}>
          Monto solicitado
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
        <TextField
          style={FormStyles.$input}
          value={amountString}
          onChangeText={(value) => handleChange('amountRequested', value)}
        />

      </View>
    </View>
    )
};
