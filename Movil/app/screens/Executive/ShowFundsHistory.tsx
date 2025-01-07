import React, { FC, useCallback, useState, useEffect } from "react";
import { View, FlatList, Alert, TextStyle, ViewStyle } from "react-native";
import { colors, spacing } from "app/theme";
import { useHeader } from "app/utils/useHeader";
import { FundsHistory } from "./FundsHistory";
import { api } from "app/services/api";
import { LoadingIndicator, Text, Button, Screen } from "app/components";
import { useAuth0 } from "react-native-auth0";
import { PendingFund } from "./PendingFund";
import { useFocusEffect } from "@react-navigation/native";

interface ShowFundsHistoryProps {
  navigation: any;
}

export const ShowFundsHistory: FC<ShowFundsHistoryProps> = ({ navigation }) => {
  const { getCredentials } = useAuth0();
  const [funds, setFunds] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<"Aprobada" | "Rechazada" | "Pendiente">("Aprobada");

  useHeader({
    title: "Historial de Recursos",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  });

  const fetchFunds = useCallback(async () => {
    try {
      const credentials = await getCredentials();
      if (!credentials) {
        Alert.alert("Error", "No se pudo obtener el token de acceso.");
        return;
      }
      const accessToken = credentials.accessToken;
      const response = await api.getFilteredFundsRequests(accessToken, statusFilter);

      if (response && response.data && Array.isArray(response.data.data)) {
        setFunds(response.data.data);
      } else {
        console.error("Error al obtener fondos:", response);
      }
    } catch (error) {
      console.error("Error inesperado al obtener fondos:", error);
    }
  }, [statusFilter]);

  useFocusEffect(
    useCallback(() => {
    setLoading(true);
    fetchFunds().finally(() => setLoading(false));
  }, [fetchFunds]));

  const handleStatusChange = (status: "Aprobada" | "Rechazada" | "Pendiente" ) => {
    setStatusFilter(status);
  };

  if (isLoading) {
    return <LoadingIndicator backgroundColor={colors.background} />;
  }

  const renderFund = ({ item }: { item: any }) => (
    <FundsHistory key={item.id} data={item} navigation={navigation} />
  );

  const renderPendingFund = ({ item }: { item: any }) => (
    <PendingFund key={item.id} data={item} navigation={navigation} />
  );

  const renderPendingContent = () => {
    if (statusFilter === "Pendiente") {
      const pendingFunds = funds.filter(fund => fund.status === "Pendiente");
      return (
        <FlatList
          data={pendingFunds}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPendingFund}
          ListEmptyComponent={<Text style={$emptyText}>No se encontraron solicitudes pendientes</Text>}
          contentContainerStyle={$listContainer}
        />
      );
    }
  };

  return (
    <Screen contentContainerStyle={$container}>
      {statusFilter === "Pendiente" ? (
        renderPendingContent()
      ) : (
        <FlatList
          data={funds}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFund}
          ListEmptyComponent={<Text style={$emptyText}>No se encontraron fondos</Text>}
          contentContainerStyle={$listContainer}
        />
      )}

      <View style={$buttonContainer}>
        <Button
          text="Aprobadas"
          style={statusFilter === "Aprobada" ? $selectedButtonStyle : $filterButtonStyle}
          textStyle={$filterButtonText}
          pressedStyle={$filterButtonPressedStyle}
          onPress={() => handleStatusChange("Aprobada")}
        />
        <Button
          text="Pendientes"
          style={statusFilter === "Pendiente" ? $selectedButtonStyle : $filterButtonStyle}
          textStyle={$filterButtonText}
          pressedStyle={$filterButtonPressedStyle}
          onPress={() => handleStatusChange("Pendiente")}
        />
        <Button
          text="Rechazadas"
          style={statusFilter === "Rechazada" ? $selectedButtonStyle : $filterButtonStyle}
          textStyle={$filterButtonText}
          pressedStyle={$filterButtonPressedStyle}
          onPress={() => handleStatusChange("Rechazada")}
        />
      </View>
    </Screen>
  );
};

const $filterButtonStyle: ViewStyle = {
  backgroundColor: colors.palette.brandingLightPink,
  borderColor: colors.palette.brandingLightPink,
  borderRadius: 8,
};

const $filterButtonPressedStyle: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderColor: colors.palette.brandingMediumPink,
};

const $selectedButtonStyle: ViewStyle = {
  ...$filterButtonStyle,
  backgroundColor: colors.palette.brandingPink,
  borderColor: colors.palette.brandingPink,
};

const $filterButtonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 16,
};

const $container: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  flex: 1,
};

const $buttonContainer: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  paddingVertical: 10,
  flexDirection: "row",
  justifyContent: "space-evenly",
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  alignItems: "center", 
  paddingHorizontal: spacing.sm,
};

const $emptyText: TextStyle = {
  textAlign: "center",
  color: colors.palette.neutral600,
  marginTop: spacing.md,
};

const $listContainer: ViewStyle = {
  paddingHorizontal: spacing.sm,
  paddingTop: spacing.xxs,
  flexGrow: 1,
  paddingBottom: 100,
  minHeight: "100%",
};