import React, { FC } from "react";
import { View, } from "react-native";
import { TextField,Text} from "app/components"; 
import { AmountRequestedProps } from "./types";
import * as FormStyles from "./../Styles/FormStyles";

const AmountRequested: FC<AmountRequestedProps> = ({
  formData,
  handleChange,

}) => (
  <View>
      <View style={FormStyles.$formGroup}>
        <Text style={FormStyles.$label}>Seleccione el monto a solicitar
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
        <TextField
          value={formData.amountRequested}
          onChangeText={(text) => handleChange("amountRequested", text)}
          placeholder="Monto"
        />
      </View>
  </View>
);

export default AmountRequested;
