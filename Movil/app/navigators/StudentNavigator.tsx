import React from "react"
import { colors, spacing, typography } from "../theme"
import { DebugScreen, SettingsScreen } from "../screens"
import { FundsNavigator, FundsNavigatorParamList } from "./FundsStack"
import { ObservatoryNavigator, ObservatoryNavigatorParamList } from "./ObservatoryStack"
import { Icon } from "../components"
import { TextStyle, ViewStyle } from "react-native"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { ResearchersNavigator, ResearchersNavigatorParamList } from "./ResearchersStack"


export type StudentTabParamList = {
  Funds: NavigatorScreenParams<FundsNavigatorParamList>
  Observatory: NavigatorScreenParams<ObservatoryNavigatorParamList>
  Researchers: NavigatorScreenParams<ResearchersNavigatorParamList>
  Settings: undefined
  Debug: undefined
}

export type StudentNavigatorScreenProps<T extends keyof StudentTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<StudentTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<StudentTabParamList>()

function StudentNavigator({ bottom }: { bottom: number }) {
  const isDebug = __DEV__

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="Funds"
        component={FundsNavigator}
        options={{
          tabBarLabel: "Fondos",
          tabBarIcon: ({ focused }) => (
            <Icon icon="funds" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Observatory"
        component={ObservatoryNavigator}
        options={{
          tabBarLabel: "Observatorio",
          tabBarIcon: ({ focused }) => (
            <Icon icon="observatory" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Researchers"
        component={ResearchersNavigator}
        options={{
          tabBarLabel: "Investigadores",
          tabBarIcon: ({ focused }) => (
            <Icon icon="researchers" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Ajustes",
          tabBarIcon: ({ focused }) => (
            <Icon icon="config" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />
      {isDebug && (
        <Tab.Screen
          name="Debug"
          // @ts-ignore
          component={DebugScreen}
          options={{
            tabBarLabel: "Debug",
            tabBarIcon: ({ focused }) => (
              <Icon icon="ladybug" color={focused ? colors.tint : "gray"} size={30} />
            ),
          }}
        />
      )}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  borderTopColor: colors.palette.neutral100,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
}

export { StudentNavigator }