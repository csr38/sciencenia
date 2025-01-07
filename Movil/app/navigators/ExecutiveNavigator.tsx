import React from "react"
import { colors, spacing, typography } from "../theme"
import { DebugScreen } from "../screens"
import { Icon } from "../components"
import { TextStyle, ViewStyle } from "react-native"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { FundsExecutiveNavigator, FundsExecutiveNavigatorParamList } from "app/navigators/FundsExecutiveStack"
import { UploadUsers } from "app/screens/UploadUsers"
import { StudentsExecutiveNavigator, StudentsExecutiveNavigatorParamList } from "./StudentsExecutiveStack"
import { ObservatoryNavigator, ObservatoryNavigatorParamList } from "./ObservatoryStack"
import { ResearchersNavigator, ResearchersNavigatorParamList } from "./ResearchersStack"

export type ExecutiveTabParamList = {
  Funds: NavigatorScreenParams<FundsExecutiveNavigatorParamList>
  Researchers: NavigatorScreenParams<ResearchersNavigatorParamList>
  Observatory: NavigatorScreenParams<ObservatoryNavigatorParamList>
  Students: NavigatorScreenParams<StudentsExecutiveNavigatorParamList>
  Configuration: undefined
  Debug: undefined
}

export type ExecutiveNavigatorScreenProps<T extends keyof ExecutiveTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<ExecutiveTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<ExecutiveTabParamList>()

function ExecutiveNavigator({ bottom }: { bottom: number }) {
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
        component={FundsExecutiveNavigator}
        options={{
          tabBarLabel: "Fondos",
          tabBarIcon: ({ focused }) => (
            <Icon icon="funds" color={focused ? colors.tint : undefined} size={30} />
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
        name="Students"
        component={StudentsExecutiveNavigator}
        options={{
          tabBarLabel: "Estudiantes",
          tabBarIcon: ({ focused }) => (
            <Icon icon="students" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Configuration"
        component={UploadUsers}
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

export { ExecutiveNavigator }