import { colors, spacing, typography } from "../../../theme";
import { TextStyle, ViewStyle } from "react-native";
export const $asterisk: TextStyle = {
    color: colors.palette.brandingPink,
  };
  
  export const $checkboxContainer: ViewStyle = {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  };
  
  export const $checkboxGroup: ViewStyle = {
    marginVertical: 10,
  };
  
  export const $container: ViewStyle = {
    backgroundColor: colors.palette.brandingWhite,
    padding: 20,
  };
  
  export const $dateButton: ViewStyle = {
    alignItems: "center",
    backgroundColor: colors.palette.neutral200,
    justifyContent: "flex-start",
  };
  
  export const $dateButtonText: TextStyle = {
    fontFamily: typography.fonts.quicksand.light,
  };
  
  export const $pinkButton: ViewStyle = {
    alignSelf: "stretch",
    flex: 1,
    backgroundColor: colors.palette.brandingPink,
    borderRadius: 8,
    justifyContent: "center",
    marginBottom: spacing.md,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  };
  
  export const $pinkButtonText: TextStyle = {
    color: colors.palette.brandingWhite,
    fontSize: 16,
    fontWeight: "bold",
  };
  
  export const $formGroup: ViewStyle = {
    marginBottom: 15,
  };
  
  export const $input: TextStyle = {
    borderColor: colors.palette.brandingDarkBlue,
    color: colors.palette.brandingGray,
  };
  
  export const $label: TextStyle = {
    color: colors.palette.brandingDarkBlue,
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
    marginRight: 10,
  };

  export const $labelWithMarginTop: TextStyle = {
    color: colors.palette.brandingDarkBlue,
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 15,
    marginRight: 10,
  };
  
  export const $radioContainer: ViewStyle = {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  };
  
  export const $radioGroup: ViewStyle = {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  };
  
  export const $switchContainer: ViewStyle = {
    marginTop: 10,
  };
  
  export const $switchRow: ViewStyle = {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  };
  
  export const $switchText: TextStyle = {
    flexShrink: 1,
    flexWrap: "wrap",
    marginRight: 10,
  };
  
  export const $textarea: TextStyle = {
    borderColor: colors.palette.brandingGray,
    minHeight: 60,
    padding: 10,
  };

  
  export const $formGroupToggle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  };
  
  export const $textArea: TextStyle = {
    height: 100,
    textAlignVertical: 'top',
  };
  export const $labelWithToggle: TextStyle = {
    marginVertical: 6,
    flexShrink: 1,
    flexWrap: "wrap",
    marginRight: 10,
    color: colors.palette.brandingDarkBlue,
    fontSize: 16,
    fontWeight: "bold",
  };
  
