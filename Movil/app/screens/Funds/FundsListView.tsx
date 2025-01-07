import React, { FC } from "react"
import { FundsStackScreenProps } from "app/navigators"
import { useHeader } from "app/utils/useHeader"
import { Screen } from "../../components/Screen"
import { CallForFunds } from "./CallForFunds"
import { View } from "react-native"
import { CallForScholarships } from "./CallForScholarships"
import { CallForAnnouncements } from "./CallForAnnouncements"

interface ListViewProps extends FundsStackScreenProps<"FundsView"> {}
export const FundsListView: FC<ListViewProps> = (_props) => {
  useHeader({
    title: "Solicitudes",
  })

  return (
    <Screen preset="scroll">
      <View>
        <CallForFunds navigation={_props.navigation} />
        <CallForScholarships navigation={_props.navigation} />
        <CallForAnnouncements navigation={_props.navigation} />
      </View>
    </Screen>
  )
}