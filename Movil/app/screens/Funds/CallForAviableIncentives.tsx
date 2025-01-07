import React, { FC } from "react";
import { View, TextStyle, ViewStyle } from "react-native";
import { Button,Text } from "app/components";
import { colors,typography } from "app/theme";
import { ApplicationPeriod } from "app/services/api";

interface CallForAvailableIncentivesProps {
  navigation: any; 
  applicationPeriod: ApplicationPeriod
}

export const CallForAvailableIncentives: FC<CallForAvailableIncentivesProps> = ({ navigation, applicationPeriod}) => {
  const currentDate = new Date();
  const startDate = new Date(applicationPeriod.startDate);
  const endDate = new Date(applicationPeriod.endDate);
  const isPeriodStarted = currentDate >= startDate && currentDate <= endDate;
  const formattedStartDate = startDate.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  
  return (
    <View style={$card}>
      <View style={$header}>
        <Text style={$title}>{applicationPeriod.periodTitle}</Text>
          <View >
            <Text style={$statusText}>{applicationPeriod.statusApplication}</Text>
          </View>
      </View>
      <Text style={$content}>{applicationPeriod.periodDescription}</Text>
      <View style={$buttonContainer}>
        {isPeriodStarted ? (
          <Button 
            text="Postular" 
            style={$button}
            textStyle={$buttonText}
            pressedStyle={$buttonPressed}
            onPress={() => navigation.navigate("CreateIncentiveRequest", { applicationPeriod })} 
          />
        ) : (
          <>
            <Text style={$startDateText}>Comienza el {formattedStartDate}</Text>
            <Button 
              text={"Postulación aún no inicia"}
              disabled
              style={$disabledButton}
              textStyle={$disabledButtonText}
            />
          </>
        )}
      </View>
    </View>
  );
};

const $button: ViewStyle = {
  backgroundColor: colors.palette.brandingPink,
  borderRadius: 8,
  borderColor: colors.palette.brandingPink,
};

const $buttonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontFamily: typography.primary.normal,
  fontSize: 16,
};

const $buttonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderColor: colors.palette.brandingMediumPink,
};

const $disabledButton: ViewStyle = {
  backgroundColor: colors.palette.brandingLightPink, 
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 8,
  borderColor: colors.palette.brandingDarkBlue,
};

const $disabledButtonText: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontFamily: typography.primary.normal,
  fontSize: 16,
};

const $startDateText: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontFamily: typography.primary.normal,
  fontSize: 16,
  marginTop: 4,
  marginBottom: 10,
};

const $buttonContainer: ViewStyle = {
  flexDirection: "column", 
  justifyContent: "flex-start",
  marginTop: 15,
  alignItems: "flex-start", 
};


const $card: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  borderRadius: 8,
  elevation: 4,
  margin: 10,
  padding: 15,
  shadowColor: colors.palette.brandingBlack,
  shadowOpacity: 0.2,
  shadowRadius: 4,
}

const $content: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontFamily: typography.primary.normal,
  fontSize: 16,
  marginTop: 10,
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
  fontSize: 18,
  fontFamily: typography.primary.bold,
  flexShrink: 1,
  flexWrap: "wrap",
  marginRight: 10,
  color: colors.palette.brandingDarkerBlue,
}