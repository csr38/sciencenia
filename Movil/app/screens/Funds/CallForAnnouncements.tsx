import React, { FC } from "react";
import { View, TextStyle, ViewStyle } from "react-native";
import { Button, Text } from "app/components";
import { colors, typography } from "app/theme";

interface CallForAnnouncementsProps {
  navigation: any; 
}

export const CallForAnnouncements: FC<CallForAnnouncementsProps> = ({ navigation }) => {
  return (
    <View style={$card}>
      <View style={$header}>
        <Text style={$title}>Anuncios</Text>
      </View>
      
      <Text style={$content}>Revisa los anuncios nuevos</Text>
      
      <View style={$buttonContainer}>
        <Button
          style={$button}
          pressedStyle={$buttonPressed}
          textStyle={$textButton}
          text="Ver anuncios"
          onPress={() => navigation.navigate("AvailableAnnouncements")} />
          <Button
          style={$button}
          pressedStyle={$buttonPressed}
          textStyle={$textButton}
          text="Mis solicitudes"
          onPress={() => navigation.navigate("NotAvailableAnnouncements")} />
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

const $header: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
}

const $title: TextStyle = {
  color: colors.palette.brandingPink,
  fontFamily: typography.primary.bold,
  fontSize: 20,
  flexShrink: 1,
  flexWrap: "wrap",
}