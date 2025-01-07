import React, { FC } from "react";
import { View, ViewStyle, TextStyle } from "react-native";
import { Text,Button} from "app/components"; 
import { PaperSelectorProps } from "./types";
import * as FormStyles from "./../Styles/FormStyles";
import { colors, typography } from "app/theme";

export const PaperSelector: FC<PaperSelectorProps> = ({ label, onPress }) => {
  return (
    <View style={FormStyles.$formGroup}>
      <Text style={FormStyles.$labelWithMarginTop}>
        {label}
        <Text style={FormStyles.$asterisk}> *</Text>
      </Text>
      <Button
        style={$button}
        textStyle={$buttonText}
        pressedStyle={$buttonPressed}
        text="Selecciona un paper"
        onPress={onPress}
      />
    </View>
  );
};

const $button: ViewStyle = {
  marginTop: 20,
  marginBottom: 10,
  backgroundColor: colors.palette.brandingPink,
  borderColor: colors.palette.brandingPink,
  borderRadius: 8,
};

const $buttonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontFamily: typography.primary.bold,
  fontSize: 16,
};

const $buttonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderColor: colors.palette.brandingMediumPink,
};
