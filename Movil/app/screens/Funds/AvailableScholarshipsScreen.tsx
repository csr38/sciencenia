import React, { FC, useCallback, useState } from "react"
import { LoadingIndicator, Screen } from "app/components"
import { CallForAvailableIncentives } from "./CallForAviableIncentives"
import { api, ApplicationPeriod } from "app/services/api"
import { useFocusEffect } from "@react-navigation/native"
import { colors } from "app/theme"
import { useHeader } from "app/utils/useHeader"
import { useAuth0 } from "react-native-auth0"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { navigate } from "app/navigators"
import { ViewStyle } from "react-native"

interface AvailableScholarshipsScreenProps {
  navigation: any
}

interface UserIncentive {
  id: number
  status: string
  statusTutor: string
  tutorResponse: string | null
  startDate: string
  deadline: string
  address: string
  city: string
  phoneNumber: string
  bankName: string
  bankAccountType: string
  bankAccountNumber: number
  amountRequested: number | null
  otherSourcesANID: boolean
  otherSourcesNotANID: boolean
  sourcesNotANID: string
  studentId: number
  applicationPeriodId: number
  createdAt: string
  updatedAt: string
}

export const AvailableScholarshipsScreen: FC<AvailableScholarshipsScreenProps> = ({ navigation }) => {
  const { user, clearSession } = useAuth0();
  const [incentiveRequests, setIncentiveRequests] = useState<UserIncentive[]>([])
  const [applicationPeriods, setApplicationPeriods] = useState<ApplicationPeriod[]>([])
  const [isLoadingPage, setLoading] = useState<boolean>(true)

  useHeader({
    title: "Becas disponibles",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  });

  const fetchApplicationPeriods = useCallback(async () => {
    try {
      const response = await api.getApplicationPeriods()
      if (response.kind === "ok") {
        setApplicationPeriods(response.applicationPeriods)
      } else {
        console.error("Error al obtener periodos de aplicación:", response)
      }
    } catch (error) {
      console.error("Error inesperado al obtener periodos de aplicación:", error)
    }
  }, [])

  const fetchIncentivesApplied = useCallback(async () => {
    if (user?.email) {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          await clearSession();
          await AsyncStorage.removeItem('authToken');
          navigate("Login");
          console.error('No se encontró el token de autenticación');
          return;
        }
        const userResponse = await api.getUserIncentives(token)
        if (userResponse.kind === "ok") {
          setIncentiveRequests(userResponse.incentives.data)
        } else {
          console.error("Error al obtener las becas del usuario:", userResponse)
        }
      } catch (error) {
        console.error("Error inesperado al obtener becas del usuario:", error)
      }
    }
  }, [user?.email])

  useFocusEffect (
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true)
        await Promise.all([fetchIncentivesApplied(), fetchApplicationPeriods()])
        setLoading(false)
      }
      fetchData()
    }, [fetchIncentivesApplied, fetchApplicationPeriods])
  )

  const studentApplicationIds = new Set(
    incentiveRequests.map((request) => request.applicationPeriodId)
  )

  const availableIncentives = applicationPeriods.filter(
    (period) => period.statusApplication === "Activo" && !studentApplicationIds.has(period.id)
  )

  if (isLoadingPage) {
    return (
      <LoadingIndicator backgroundColor={colors.palette.brandingWhite}/>
    )
  }

  const combinedData = [...availableIncentives, ...incentiveRequests]

  return (
    <Screen preset="scroll" style={$container}>
      {combinedData.map((item) => {
        if ("statusApplication" in item) {
          return (
            <CallForAvailableIncentives
              key={`ap-${item.id}`}
              navigation={navigation}
              applicationPeriod={item}
            />
          );
        }

        return null;
      })}
    </Screen>
  );
}

const $container: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
}