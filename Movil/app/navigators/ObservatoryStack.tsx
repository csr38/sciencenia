import React from "react"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { ObservatoryScreen } from "app/screens/ObservatoryScreen"
import { ResearchScreen } from "app/screens/ResearchScreen"

export type ObservatoryNavigatorParamList = {
  ObservatoryView: undefined
  ResearchView: {
    id: number
  }
}

export type ObservatoryStackScreenProps<T extends keyof ObservatoryNavigatorParamList> = NativeStackScreenProps<
  ObservatoryNavigatorParamList,
  T
>

const Stack = createNativeStackNavigator<ObservatoryNavigatorParamList>()
export const ObservatoryNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ObservatoryView">
      <Stack.Screen name="ObservatoryView" component={ObservatoryScreen} />
      <Stack.Screen name="ResearchView" component={ResearchScreen} />
    </Stack.Navigator>
  )
}
