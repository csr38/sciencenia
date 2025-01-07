import React, { FC } from "react"
import { ViewStyle, View } from "react-native"
import { colors } from "../theme"
import { useHeader } from 'app/utils/useHeader'
import { Screen } from "../components/Screen"
import { CallForPeriodCreation } from "./Executive/CallForPeriodCreation"
import { FundsExecutiveStackScreenProps } from "../navigators/FundsExecutiveStack"
import { CallForIncentivesHistory } from "./Executive/CallForIncentivesHistory"
import { CallForFundsHistory } from "./Executive/CallForFundsHistory"
import { CallForFundsAviableMoneyManagement } from "./Executive/CallForFundsAviableMoneyManagement"
import { CallForNotificationCreation } from "./Executive/CallForNotificationCreation"
import { CallForAnnouncementsHistory } from "./Executive/CallForAnnouncementHistory"

interface FundsExecutiveScreenProps extends FundsExecutiveStackScreenProps<"FundsExecutiveView"> {}

export const ExecutiveScreen: FC<FundsExecutiveScreenProps> = (_props) => {

  useHeader({ title: "Fondos" }, [])

  return (
    <Screen style={$container} preset="scroll">
      <View style={$cardWrapper}>
        <CallForNotificationCreation  navigation={_props.navigation}/>
      </View>
      <View style={$cardWrapper}>
        <CallForAnnouncementsHistory  navigation={_props.navigation}/>
      </View>
      <View style={$cardWrapper}>
        <CallForPeriodCreation  navigation={_props.navigation}/>
      </View>
      <View style={$cardWrapper}>
        <CallForIncentivesHistory  navigation={_props.navigation}/>
      </View>
      <View style={$cardWrapper}>
        <CallForFundsHistory  navigation={_props.navigation}/>
      </View>
      <View style={$cardWrapper}>
        <CallForFundsAviableMoneyManagement  navigation={_props.navigation}/>
      </View>
    </Screen>
  )
}


const $container: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  paddingHorizontal: 10,
}

const $cardWrapper: ViewStyle = {
  marginVertical: 5,
}
