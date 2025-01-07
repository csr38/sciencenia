import React, { useEffect, FC, useState, useCallback } from "react"
import { TouchableOpacity, View, FlatList, TextStyle, Alert, ViewStyle } from "react-native"
import { useHeader } from "../../utils/useHeader"
import { LoadingIndicator, Text, ApplicationContainer, Screen } from "app/components"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { FundsNavigatorParamList, navigate } from "app/navigators"
import { api, FundingRequest } from "app/services/api"
import { useRootStore } from "app/store"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { colors, typography } from "../../theme"
import { useAuth0 } from "react-native-auth0"

const FundApplicationScreen: FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<FundsNavigatorParamList>>()
  const [fundingRequests, setFundingRequests] = useState<FundingRequest[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { clearSession } = useAuth0()
  const userEmail = useRootStore((state) => state.user?.email)

  const fetchFundingRequests = useCallback(async () => {
    if (!userEmail) {
      console.error('No se encontró el correo del usuario');
      return;
    }

    setIsLoading(true)
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert('Error de autenticación', 'No se encontró un token de autenticación.');
        await clearSession();
        await AsyncStorage.removeItem('authToken');
        navigate("Login");
        console.error('No se encontró el token de autenticación');
        return;
      }
      const response = await api.getFundRequests(userEmail, token)
      if (response.kind === "ok") {
        setFundingRequests(response.fundingRequests)
      } else {
        console.error("Error fetching funding requests:", response)
      }
    } catch (error) {
      console.error("Unexpected error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [userEmail])

  useHeader({
    title: "Mis Solicitudes a Recursos",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  })
  useFocusEffect (
    useCallback(() => {
      const fetchData = async () => {
        await Promise.all([fetchFundingRequests()])
      }
      fetchData()
    }, [fetchFundingRequests]))

  if (isLoading) {
    return (
      <LoadingIndicator backgroundColor={colors.palette.brandingWhite} />
    );
  }

  return (
    <Screen style={$container}>
      <FlatList
        style={{ backgroundColor: colors.palette.brandingWhite }}
        data={fundingRequests}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("ShowFundingRequest", { fundingRequest: item })}
          >
              <FundingRequestPreview fundingRequest={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={$empty}>No hay solicitudes disponibles.</Text>}
      />
    </Screen>
  )
}

const FundingRequestPreview: React.FC<{ fundingRequest: FundingRequest }> = ({ fundingRequest }) => {
  let title = `${fundingRequest.purpose} en ${fundingRequest.destination}`;

  if (fundingRequest.purpose === "Invitación a Chile de un investigador/a internacional"){
    title = "Invitación a investigador";
  }
  if (fundingRequest.purpose === "Otro") {
    title = "Solicitud Especial";
  }
  return (
    <ApplicationContainer
      title={title}
      status={fundingRequest.status}
      key={fundingRequest.id}
    >
      <Text style={$applicationDescription}>
        <Text style={$purposeBold}>Motivo:</Text> {fundingRequest.purpose}
      </Text>
    </ApplicationContainer>
  );
};

const $applicationDescription: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontSize: 15,
}

const $purposeBold: TextStyle = {
  fontFamily: typography.primary.bold,
  color: colors.palette.brandingDarkerBlue,
}

const $container: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
}

const $empty: TextStyle = {
  fontSize: 15,
  paddingVertical: "90%",
  height: "100%",
  width: "100%",
  textAlign: "center",
}


export default FundApplicationScreen