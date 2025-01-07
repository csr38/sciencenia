import React from "react"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { ShowResearchers } from "app/screens"
import { Researcher } from "app/screens/Executive/Researcher"

export type ResearchersNavigatorParamList = {
  ResearchersView: undefined
  ResearcherView: {
    email: string
  }
}

export type ResearchersStackScreenProps<T extends keyof ResearchersNavigatorParamList> = NativeStackScreenProps<
  ResearchersNavigatorParamList,
  T
>

const Stack = createNativeStackNavigator<ResearchersNavigatorParamList>()
export const ResearchersNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ResearchersView">
      <Stack.Screen name="ResearchersView" component={ShowResearchers} />
      <Stack.Screen name="ResearcherView" component={Researcher} />
    </Stack.Navigator>
  )
}
