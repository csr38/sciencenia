import React, { FC } from "react";
import { View, } from "react-native";
import { TextField,Text} from "app/components"; 
import { EditTravelInformationProps } from "./types";
import * as FormStyles from "./../Styles/FormStyles";
import { CustomDatePicker } from 'app/components/CustomDatePicker';

const EditTravelInformation: FC<EditTravelInformationProps> = ({
  formData,
  handleChange,
  selectedStartDate,
  showStartDatePicker,
  setSelectedStartDate,
}) => (
  <View>
    <View style={FormStyles.$formGroup}>
    </View>
    <View style={FormStyles.$formGroup}>
      <Text style={FormStyles.$label}>
        Destino
        <Text style={FormStyles.$asterisk}> *</Text>
      </Text>
      <TextField
        style={FormStyles.$input}
        value={formData.destination}
        onChangeText={(value) => handleChange('destination', value)}
        placeholder="Escriba el destino de su viaje"
      />
    </View>

    <View style={FormStyles.$formGroup}>
      <Text style={FormStyles.$label}>
        Fecha de Inicio
        <Text style={FormStyles.$asterisk}> *</Text>
      </Text>
      
      <CustomDatePicker
        date={selectedStartDate}
        onChangeDate={(date) => {
          setSelectedStartDate(date);
          handleChange('startDate', date.toISOString());
        }}
      />
    </View>


    <View style={FormStyles.$formGroup}>
      <Text style={FormStyles.$label}>
        Duración del Periodo
        <Text style={FormStyles.$asterisk}> *</Text>
      </Text>
      <TextField
        style={FormStyles.$input}
        value={formData.durationPeriod}
        onChangeText={(value) => handleChange('durationPeriod', value)}
        placeholder="Escriba la duración de su viaje"
      />
    </View>
  </View>
);

export default EditTravelInformation;
