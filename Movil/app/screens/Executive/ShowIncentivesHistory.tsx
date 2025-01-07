import React, { FC, useCallback, useState, useEffect } from "react";
import { View, FlatList, Alert, TextStyle, ViewStyle } from "react-native";
import { colors, spacing } from "app/theme";
import { useHeader } from "app/utils/useHeader";
import { IncentivesHistory } from "./IncentivesHistory";
import { api } from "app/services/api";
import { LoadingIndicator, Text, Screen, Button } from "app/components";
import { useAuth0 } from "react-native-auth0";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { FundsExecutiveNavigatorParamList } from "app/navigators/FundsExecutiveStack";
import { PendingIncentive } from "./PendingIncentive";

type ShowIncentivesHistoryScreenProps = {
    route: RouteProp<FundsExecutiveNavigatorParamList, "ShowIncentivesHistory">;
    navigation: any;
};

export const ShowIncentivesHistory: FC<ShowIncentivesHistoryScreenProps> = ({ route, navigation }) => {
  const { getCredentials } = useAuth0();
  const [incentives, setIncentives] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<"Aprobada" | "Rechazada" | "Pendiente">("Aprobada");
  const { id: applicationPeriodId } = route.params;

  useHeader({
    title: "Historial de Becas",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  });

  const fetchIncentives = useCallback(async () => {
    try {
      const credentials = await getCredentials();
      if (!credentials) {
        Alert.alert("Error", "No se pudo obtener el token de acceso.");
        return;
      }
      const accessToken = credentials.accessToken;
      const response = await api.getFilteredScholarships(applicationPeriodId, statusFilter, accessToken);

      if (response && response.data && Array.isArray(response.data.data)) {
        setIncentives(response.data.data);
      } else {
        console.error("Error al obtener incentivos:", response);
      }
    } catch (error) {
      console.error("Error inesperado al obtener incentivos:", error);
    }
  }, [statusFilter]);

  useFocusEffect (
    useCallback(() => {
    setLoading(true);
    fetchIncentives().finally(() => setLoading(false));
  }, [fetchIncentives]));

  const handleStatusChange = (status: "Aprobada" | "Rechazada" | "Pendiente") => {
    setStatusFilter(status);
  };

  if (isLoading) {
    return <LoadingIndicator backgroundColor={colors.background} />;
  }

  const renderIncentive = ({ item }: { item: any }) => (
    <IncentivesHistory key={item.id} data={item} />
  );
  const renderPendingIncentive = ({ item }: { item: any }) => (
    <PendingIncentive key={item.id} data={item} navigation={navigation} /> 
  );
  const renderPendientesContent = () => {
    const pendientesData = incentives.filter(incentive => incentive.status === "Pendiente");
    return (
      <FlatList
        data={pendientesData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPendingIncentive}
        ListEmptyComponent={<Text style={$emptyText}>No se encontraron incentivos pendientes</Text>}
        contentContainerStyle={$listContainer}
      />
    );
  };
  return (
    <Screen contentContainerStyle={$container}>
      {statusFilter === "Pendiente" ? (
        renderPendientesContent()
      ) : (
        <FlatList
          data={incentives}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderIncentive}
          ListEmptyComponent={<Text style={$emptyText}>No se encontraron incentivos</Text>}
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
          onPress={() =>  handleStatusChange("Pendiente")}
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