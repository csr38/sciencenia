import React from 'react';
import { ActivityIndicator, View, ViewStyle } from 'react-native';
import { colors } from 'app/theme';

interface LoadingIndicatorProps {
  backgroundColor?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ backgroundColor }) => (
  <View style={[{ backgroundColor: backgroundColor || colors.palette.brandingWhite }, $containerStyle]}>
    <ActivityIndicator size="large" color={colors.palette.brandingPink} />
  </View>
);

const $containerStyle: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
};