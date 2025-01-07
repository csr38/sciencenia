import React, { FC, useState } from 'react';
import { Platform, ViewStyle, TextStyle } from 'react-native';
import { Button } from 'app/components';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { colors, typography } from 'app/theme';

interface CustomDatePickerProps {
  date: Date;
  onChangeDate: (date: Date) => void;
}

export const CustomDatePicker: FC<CustomDatePickerProps> = ({ date, onChangeDate }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      onChangeDate(selectedDate);
    }
  };

  return (
    <>
      <Button
        text={date.toLocaleDateString()}
        onPress={() => setShowDatePicker(true)}
        style={$dateButton}
        textStyle={$dateButtonText}
      />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </>
  );
};

const $dateButton: ViewStyle = {
  backgroundColor: colors.palette.neutral200,
  justifyContent: 'flex-start',
  minHeight: 46,
};

const $dateButtonText: TextStyle = {
  fontFamily: typography.primary.normal,
  color: colors.palette.neutral600,

};
