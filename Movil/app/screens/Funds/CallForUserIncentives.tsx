import React from "react"
import { View, TextStyle, ViewStyle, TouchableOpacity } from "react-native"
import { Text } from "app/components"
import { colors, spacing, typography } from "app/theme"
import { useNavigation } from "@react-navigation/native"

interface CallForUserIncentivesProps {
  title: string
  incentive: any
  files?: string[]  
}

export const CallForUserIncentives: React.FC<CallForUserIncentivesProps> = ({
  title,
  incentive,
  files,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprobada":
        return colors.palette.acceptedGreen
      case "Rechazada":
        return colors.palette.rejectedRed
      case "Pendiente":
        return colors.palette.pendingYellow
      default:
        return colors.palette.brandingGray
    }
  }
  const navigation = useNavigation()

  const humanizeDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }
  const handlePress = () => {
    // @ts-ignore
    navigation.navigate("ShowIncentiveDetail", {
      incentiveRequest: incentive,
      files: files,
      title: title,
    })
  }
  return (
    <TouchableOpacity onPress={handlePress} style={$card}>
      <View style={$header}>
        <View style={$titleContainer}>
          <Text style={$title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
        </View>
        <View style={$statusContainer}>
          <Text style={[$statusText, { backgroundColor: getStatusColor(incentive.status) }]}>{incentive.status}</Text>
        </View>
      </View>
      {incentive.status === "Pendiente" && (
        <Text style={$content}>Tu solicitud está pendiente de revisión.</Text>
      )}
      {incentive.status === "Aprobada" && (
        <Text style={$content}>
          Tu solicitud fue aprobada el {humanizeDate(new Date(incentive.updatedAt))}.
        </Text>
      )}
      {incentive.status === "Rechazada" && (
        <Text style={$content}>Tu solicitud ha sido rechazada.</Text>
      )}
    </TouchableOpacity>
  )
}

const $card: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  borderRadius: 8,
  elevation: 4,
  marginHorizontal: 10,
  marginTop: 7,
  marginBottom: 10,
  padding: 15,
  shadowColor: colors.palette.brandingBlack,
  shadowOpacity: 0.2,
  shadowRadius: 4,
}

const $content: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontFamily: typography.primary.normal,
  fontSize: 16,
  marginBottom: spacing.sm,
  marginTop: 10,
}

const $header: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
}
  
const $statusContainer: ViewStyle = {
  flexShrink: 0,
}

const $statusText: TextStyle = {
  borderRadius: 16,
  color: colors.palette.brandingWhite,
  fontFamily: typography.primary.bold,
  fontSize: 12,
  overflow: "hidden",
  paddingHorizontal: 10,
  paddingVertical: 5,
  textAlign: "center",
}
  
const $title: TextStyle = {
  color: colors.palette.brandingDarkerBlue,
  flexShrink: 1,
  flexWrap: "wrap",
  fontFamily: typography.primary.bold,
  fontSize: 18,
  fontWeight: "bold",
}
  
const $titleContainer: ViewStyle = {
  flex: 1,
  marginRight: 10,
}
