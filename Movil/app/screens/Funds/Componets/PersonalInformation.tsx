import React, { FC } from "react";
import { View, } from "react-native";
import { TextField,Text} from "app/components"; 
import { PersonalInformationProps } from "./types";
import * as FormStyles from "./../Styles/FormStyles";

const PersonalInformation: FC<PersonalInformationProps> = ({
  formData,
  handleChange,

}) => (
  <View>
      <View style={FormStyles.$formGroup}>
        <Text style={FormStyles.$label}>Dirección
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
        <TextField
          value={formData.address}
          onChangeText={(text) => handleChange("address", text)}
          placeholder="Ingrese Dirección"
        />
      </View>

      <View style={FormStyles.$formGroup}>
        <Text style={FormStyles.$label}>Ciudad
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
        <TextField  
          value={formData.city}
          onChangeText={(text) => handleChange("city", text)}
          placeholder="Ingrese Ciudad"
        />
      </View>
  </View>
);

export default PersonalInformation;
