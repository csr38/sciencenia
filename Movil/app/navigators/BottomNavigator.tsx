import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StudentNavigator } from "./StudentNavigator"
import { ExecutiveNavigator } from "./ExecutiveNavigator"
import { useAuth0 } from "react-native-auth0"
import { api } from 'app/services/api';
import React, { useEffect, useState } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Text, LoadingIndicator, Button } from "app/components";
import { colors, spacing } from "app/theme"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from 'app/navigators';


// export type MainTabParamList = {
//   Funds: NavigatorScreenParams<FundsNavigatorParamList>
//   Settings: undefined
//   Debug: undefined
//   // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
// }

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
// export type BottomNavigatorScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
//   BottomTabScreenProps<MainTabParamList, T>,
//   AppStackScreenProps<keyof AppStackParamList>
// >

// const Tab = createBottomTabNavigator<MainTabParamList>()

/**
 * This is the main navigator for the demo screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `DemoNavigator`.
 */
export function BottomNavigator() {
  const { bottom } = useSafeAreaInsets()
  const { user, clearSession } = useAuth0()
  const [role, setRole] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)


  const fetchUserRole = async (email: string) => {
    try {
      const response = await api.getUserRole(email)
      response.kind = "ok"
      if (response.kind === "ok") {
        setRole(response.roleId)
      } else {
        throw new Error("Error al obtener el rol")
      }
    } catch (e) {
      console.error("Error al obtener el rol:", e)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && user.email) {
      fetchUserRole(user.email)
    }
  }, [user])

  if (loading) {
    return (
        <LoadingIndicator />
    )
  }

  const handleQuitSession = async () => {
    await clearSession();
    await AsyncStorage.removeItem('authToken');
    navigate("Login");
  };

  if (error) {
    return (
      <View style={$containerStyle}>
        <Text>Ocurrió un error al obtener el rol del usuario.</Text>
        <Button
          text="Salir"
          onPress={handleQuitSession}
          style={$logoutButton}
          textStyle={$logoutButtonText}
          pressedStyle={$logoutButtonPressed}
        />
      </View>
    )
  }

  return role === 1 ? (
    <ExecutiveNavigator bottom={bottom} />
  ) : (
    <StudentNavigator bottom={bottom} />
  )
}

const $containerStyle: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
}

const $logoutButton: ViewStyle = {
  alignItems: 'center',
  backgroundColor: colors.palette.brandingPink,
  borderRadius: 8,
  justifyContent: 'center',
  marginBottom: spacing.md,
  marginTop: spacing.lg,
  paddingVertical: spacing.md,
};

const $logoutButtonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
};

const $logoutButtonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 16,
  fontWeight: 'bold',
};