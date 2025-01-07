import { StyleSheet } from 'react-native';
import { colors, typography } from '.';

export const pickerSelectStyle = StyleSheet.create({
  inputAndroid: {
    backgroundColor: colors.palette.neutral200,
    borderColor: colors.palette.neutral400,
    borderRadius: 4,
    borderWidth: 1,
    color: colors.text,
    fontFamily: typography.primary.normal,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputIOS: {
    backgroundColor: colors.palette.neutral200,
    borderColor: colors.palette.neutral400,
    borderRadius: 4,
    borderWidth: 1,
    fontFamily: typography.primary.normal,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});

export const modalPickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    backgroundColor: colors.palette.brandingWhite,
    borderColor: colors.palette.neutral400,
    borderRadius: 4,
    borderWidth: 1,
    color: colors.text,
    fontFamily: typography.primary.normal,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputIOS: {
    backgroundColor: colors.palette.neutral200,
    borderColor: colors.palette.neutral400,
    borderRadius: 4,
    borderWidth: 1,
    fontFamily: typography.primary.normal,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});