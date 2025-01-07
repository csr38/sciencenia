import React, { FC } from "react";
import { View, TextStyle, ViewStyle } from "react-native";
import { Button, Text } from "app/components";
import { colors, typography } from "app/theme";

interface CallForPendingFundsRequestsProps {
  navigation: any; 
}

export const CallForPendingFundsRequests: FC<CallForPendingFundsRequestsProps> = ({ navigation }) => {
  return (
    <View style={$card}>
      <View style={$header}>
        <Text style={$title} text="Ver Postulaciones a Recursos Pendientes" />
      </View>
      <Text style={$description}>
        Ve las postulaciones a recursos de los estudiantes que estan pendientes de aprobacion o rechazo. 
      </Text>
      <Button 
        text="Ver Postulaciones a Recursos" 
        style={$pinkButton}
        textStyle={$pinkButtonText}
        pressedStyle={$pinkButtonPressed}
        onPress={() => {
          navigation.navigate('ShowPendingFundsRequets')
        }}
      />
    </View>
  );
};

const $card: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  borderRadius: 8,
  margin: 10,
  padding: 15,
  paddingVertical: 20,
  elevation: 4,
  shadowColor: colors.palette.brandingBlack,
  shadowOpacity: 0.2,
  shadowRadius: 6,
  shadowOffset: { width: 2, height: 2 },
};

const $description: TextStyle = {
  fontSize: 14,
  fontFamily: typography.primary.normal,
  color: colors.palette.brandingDarkBlue,
  marginBottom: 20,
}

const $header: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
};

const $pinkButton: ViewStyle = {
  backgroundColor: colors.palette.brandingPink,
  borderColor: colors.palette.brandingPink,
  paddingVertical: 8, 
  paddingHorizontal: 0,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
};

const $pinkButtonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 17,
  fontWeight: 'bold',
};

const $pinkButtonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderRadius: 14,
  borderColor: colors.palette.brandingMediumPink,
};

const $title: TextStyle = {
  fontSize: 20,
  fontFamily: typography.primary.bold,
  color: colors.palette.brandingDarkBlue,
  marginBottom: 10,
};
