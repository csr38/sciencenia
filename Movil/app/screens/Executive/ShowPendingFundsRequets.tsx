import React, { FC, useCallback, useState } from "react";
import { ViewStyle,Alert,FlatList, TextStyle} from "react-native";
import { colors, spacing, } from "app/theme";
import { useHeader } from "app/utils/useHeader";
import { PendingFund } from "./PendingFund";
import { api } from "app/services/api";
import { useFocusEffect } from "@react-navigation/native";
import { LoadingIndicator , Text, Screen } from "app/components";
import { useAuth0 } from "react-native-auth0";

interface ShowPendingFundsRequetsProps {
  navigation: any; 
}

export const ShowPendingFundsRequets: FC<ShowPendingFundsRequetsProps> = ({ navigation }) => {
  const { getCredentials } = useAuth0();
  const [pendingFunds, setPendingFunds] = useState<any[]>([]);
  const [isLoadingPage, setLoading] = useState<boolean>(true)
  useHeader(
      {
        title: "Recursos Pendientes",
        leftIcon: "back",
        onLeftPress: () => navigation.goBack(),
      },
    );
  const fetchPendingFunds = useCallback(async () => {
    try {
      const credentials = await getCredentials();
      if (!credentials) {
        Alert.alert("Error", "No se pudo obtener el token de acceso.");
        return;
      }
      const accessToken = credentials.accessToken;
      const response = await api.getPendingFundsRequests(accessToken)
      if (response && response.data && Array.isArray(response.data.data)) {
        const filteredFunds = response.data.data.filter(
          (fund) => fund.status === "Pendiente"

        );
        setPendingFunds(filteredFunds);
      } else {
        console.error("Error al obtener periodos de aplicación:", response)
      }
    } catch (error) {
      console.error("Error inesperado al obtener periodos de aplicación:", error)
    }
  }, [])

  useFocusEffect (
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true)
        await Promise.all([fetchPendingFunds()])
        setLoading(false)
      }
      fetchData()
    }, [ fetchPendingFunds]))
  if (isLoadingPage) {
    return (
      <LoadingIndicator backgroundColor={colors.background}/>
    )
  }

  const handleStatusUpdated = () => {
    fetchPendingFunds();
  };

  const renderPendingFund = ({ item }: { item: any }) => (
     <PendingFund key={item.id} data={item} onStatusUpdated={handleStatusUpdated} navigation={navigation} />
  )
  return (
    <Screen contentContainerStyle={$container}>
      <FlatList
        data={pendingFunds}
        keyExtractor={(item) => item.id}
        renderItem={renderPendingFund}
        ListEmptyComponent={<Text style={$emptyText}>No se encontraron solicitudes a recursos pendientes</Text>}
        contentContainerStyle={$listContainer}
      />
    </Screen>
  );
};


const $container: ViewStyle = {
    backgroundColor: colors.palette.brandingWhite,
    padding: 20,
  }
  const $emptyText: TextStyle = {
    textAlign: "center",
    color: colors.palette.neutral600,
    marginTop: spacing.md,
  }
  const $listContainer: ViewStyle = {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    flexGrow: 1,
    paddingBottom: 60,
    minHeight: "100%",
  }