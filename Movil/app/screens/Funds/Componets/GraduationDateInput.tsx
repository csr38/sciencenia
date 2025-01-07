import React, { FC } from "react";
import { View } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { DateInputProps } from "./types";
import * as FormStyles from "./../Styles/FormStyles";
import { Button,Text } from "app/components"


export const GraduationDateInput: FC<DateInputProps> = ({ selectedStartDate, showStartDatePicker, setShowStartDatePicker, handleChange }) => (
  <View style={FormStyles.$formGroup}>
    <Text style={FormStyles.$label}>Fecha de graduación<Text style={FormStyles.$asterisk}> *</Text></Text>
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
            handleChange('graduationDate', date.toISOString());
          }
          setShowStartDatePicker(false);
        }}
      />
    )}
  </View>
);
