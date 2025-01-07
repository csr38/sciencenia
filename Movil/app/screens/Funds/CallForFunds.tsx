import React, { FC } from "react";
import { View, TextStyle, ViewStyle } from "react-native";
import { Button,Text } from "app/components";
import { colors,typography } from "app/theme";

interface CallForFundsProps {
  navigation: any; 
}

export const CallForFunds: FC<CallForFundsProps> = ({ navigation }) => {
  return (
    <View style={$card}>
      <View style={$header}>
        <Text style={$title}>Solicitudes de Recursos para Viajes</Text>
        <View style={$descriptionContainer}>
          <View >
            <Text style={$statusText}>Disponible</Text>
          </View>
        </View>
      </View>

      <Text style={$content}>Solicita recursos para conferencias, colaboraciones científicas, etc.</Text>

      <View style={$buttonContainer}>
        <Button
          text="Solicitar"
          style={$button}
          pressedStyle={$buttonPressed}
          textStyle={$textButton}
          onPress={() => navigation.navigate("CreateFundRequest")}/>
        <Button
          text="Mis Solicitudes"
          style={$button}
          pressedStyle={$buttonPressed}
          textStyle={$textButton}
          onPress={() => navigation.navigate("ViewFundsRequests")}/>
      </View>
    </View>
  );
};

const $button: ViewStyle = {
  backgroundColor: colors.palette.brandingPink,
  borderRadius: 8,
  borderColor: colors.palette.brandingPink,
}

const $buttonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderRadius: 8,
  borderColor: colors.palette.brandingMediumPink,
}

const $textButton: TextStyle = {
  color: colors.palette.brandingWhite,
}

const $buttonContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 26,
}

const $card: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  borderRadius: 8,
  elevation: 5,
  margin: 10,
  padding: 15,
  shadowColor: colors.palette.brandingBlack,
  shadowOpacity: 0.2,
  shadowRadius: 4,
  marginBottom: 20,
  marginTop: 20,
}

const $content: TextStyle = {
  color: colors.palette.brandingDarkerBlue,
  fontFamily: typography.primary.normal,
  fontSize: 18,
  marginTop: 15,
}

const $descriptionContainer: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
}

const $header: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
}

const $statusText: TextStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderRadius: 16,
  color: colors.palette.brandingWhite,
  fontFamily: typography.primary.bold,
  fontSize: 12,
  height: 30,
  lineHeight: 30,
  overflow: "hidden",
  paddingEnd: 10,
  paddingStart: 10,
  textAlign: "center",
}

const $title: TextStyle = {
  color: colors.palette.brandingPink,
  fontFamily: typography.primary.bold,
  fontSize: 20,
  flexShrink: 1,
  flexWrap: "wrap",
}