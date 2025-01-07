import React, { FC, useState, useEffect } from "react"
import { ViewStyle, TextStyle, ImageStyle } from "react-native"
import { Button, Screen, Text, LoadingIndicator, AutoImage } from "../components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { useAuth0 } from "react-native-auth0"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from 'react-native-toast-message'
import { getFirebaseToken } from "../services/api/firebaseNotifications"
import { api } from "../services/api"
import { jwtDecode } from "jwt-decode"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = (_props) => {
  const { authorize, isLoading, user, getCredentials } = useAuth0()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const clearCredentials = async () => {
      try {
        await AsyncStorage.removeItem("authToken");
      } catch (error) {
        console.error("Error limpiando credenciales:", error);
      }
    };
  
    clearCredentials();
  }, []);

  const onLogin = async () => {
    setLoading(true)
    try {
      await authorize({
        audience: process.env.EXPO_PUBLIC_AUTH0_AUDIENCE,
        scope: "openid profile email",
      })
      const credentials = await getCredentials()
      if (!credentials) {
        setLoading(false)
        return
      }

      await AsyncStorage.setItem("authToken", credentials.accessToken)

      const decodedToken = jwtDecode<{ email?: string }>(credentials.idToken)
      const email = decodedToken?.email

      const token = await getFirebaseToken();
      api.updateFirebaseToken(email, token);
    } catch (e) {
      console.error("Error during login:", e)
      if (e instanceof Error) {
        showErrorToast("Error during login: " + e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const showErrorToast = (message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
    })
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="login-heading" text="Bienvenido" preset="heading" style={$welcome} />
      <Text
        text="Inicia sesión con tu cuenta CENIA para acceder a todas las funciones de la app."
        preset="subheading"
        style={$welcomeDetails}
      />

      <AutoImage
        style={$mascotIcon}
        source={require("../../assets/images/mascot-icon.png")}
      />

      {isLoading || loading ? (
        <LoadingIndicator backgroundColor={colors.background} />
      ) : user ? (
        <Text 
          text={`Ya has iniciado sesión como ${user?.name}`}preset="subheading"
          style={$welcomeDetails}
        />
      ) : (
        <Button
          testID="login-button"
          text="Iniciar sesión"
          style={$tapButton}
          textStyle={$tapButtonText}
          preset="reversed"
          onPress={onLogin}
          disabled={loading}
        />
      )}
    </Screen>
  )
}

const $mascotIcon: ImageStyle = {
  width: 300,
  height: 300,
  marginTop: spacing.xl,
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxxl,
  paddingHorizontal: spacing.lg,
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  backgroundColor: colors.background,
}

const $welcome: TextStyle = {
  marginBottom: spacing.sm,
  color: colors.palette.brandingDarkBlue,
  fontSize: 40,
  fontWeight: "bold",
}

const $welcomeDetails: TextStyle = {
  textAlign: "center",
  fontSize: 18,
  color: colors.palette.brandingBlack,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xl,
  minWidth: 220,
  minHeight: 60,
  paddingVertical: spacing.md,
  borderRadius: 8,
  backgroundColor: colors.palette.brandingPink,
}

const $tapButtonText: TextStyle = {
  fontSize: 20,
  fontWeight: "bold",
}