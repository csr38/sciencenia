import React, { FC } from "react";
import { View, TextStyle, ViewStyle } from "react-native";
import { Button, Text } from "app/components";
import { colors, spacing, typography } from "app/theme";

interface CallForResearchersProps {
  navigation: any; 
}

export const CallForResearchers: FC<CallForResearchersProps> = ({ navigation }) => {
  return (
    <View style={$card}>
      <View style={$header}>
        <Text style={$title} text="Muestra los distintos investigadores y accede a sus perfiles"/>
      </View>      
        <Button 
          text="Ver Investigadores" 
          style={$pinkButton}
          textStyle={$pinkButtonText}
          pressedStyle={$pinkButtonPressed}
          onPress={() => {
            
            navigation.navigate('ShowResearchers')
          }}
        />
      </View>
  );
};



const $pinkButton: ViewStyle = {
  alignSelf: "stretch", 
  flex: 1, 
  backgroundColor: colors.palette.brandingPink,
  borderRadius: 8,
  justifyContent: "center",
  marginBottom: spacing.md,
  marginTop: spacing.lg,
  paddingVertical: spacing.md,
};

const $pinkButtonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 16,
  fontWeight: 'bold',
};
const $pinkButtonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
};

const $card: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  borderRadius: 8,
  elevation: 2,
  margin: 10,
  padding: 15,
  shadowColor: colors.palette.brandingBlack,
  shadowOpacity: 0.2,
  shadowRadius: 4,
};



const $header: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
};

const $title: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontFamily: typography.primary.bold,
  fontSize: 18,
  flexShrink: 1,
  flexWrap: "wrap",
};
