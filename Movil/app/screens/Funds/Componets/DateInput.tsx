import React, { FC } from "react";
import { View } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { DateInputProps } from "./types";
import * as FormStyles from "./../Styles/FormStyles";
import { Button,Text } from "app/components"
export const DateInput: FC<DateInputProps> = ({ selectedStartDate, showStartDatePicker, setShowStartDatePicker, handleChange }) => (
  <View style={FormStyles.$formGroup}>
    <Text style={FormStyles.$label}>Fecha de inicio<Text style={FormStyles.$asterisk}> *</Text></Text>
    <Button
      style={FormStyles.$dateButton}
      textStyle={FormStyles.$dateButtonText}
      text={`${selectedStartDate.toLocaleDateString()}`}
      onPress={() => setShowStartDatePicker(true)}
    />
    {showStartDatePicker && (
      <RNDateTimePicker
        display="spinner"
        value={selectedStartDate}
        onChange={(event, date) => {
          if (date) {
            handleChange('startDate', date.toISOString());
          }
          setShowStartDatePicker(false);
        }}
      />
    )}
  </View>
);
