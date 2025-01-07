import React, { FC, useCallback, useState } from "react";
import { ViewStyle,  FlatList, TextStyle } from "react-native";
import { Screen } from "../../components/Screen";
import { colors, spacing } from "app/theme";
import { PendingIncentive } from "./PendingIncentive";
import { useHeader } from "app/utils/useHeader";
import { useAuth0 } from "react-native-auth0";
import { LoadingIndicator, Text } from "app/components";
import { useFocusEffect } from "@react-navigation/native";

interface ShowPendingIncentiveRequestProps {
  navigation: any; 
  data:any;
}

export const ShowPendingIncentiveRequest: FC<ShowPendingIncentiveRequestProps> = ({ navigation ,data}) => {
  const [pendingIncentives, setPendingIncentives] = useState<any[]>([]);
  const [isLoadingPage, setLoading] = useState<boolean>(true);
  
  useHeader({
    title: "Becas Pendientes",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  });

  const fetchPendingIncentives = useCallback(async () => {
    try {
      setLoading(true); 
      setPendingIncentives(data) 
    } catch (error) {
      console.error("Error inesperado al obtener periodos de aplicación:", error);
    } finally {
      setLoading(false); 
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPendingIncentives();
    }, [fetchPendingIncentives])
  );


  if (isLoadingPage) {
    return <LoadingIndicator backgroundColor={colors.background} />;
  }

 

  const renderPendingIncentive = ({ item }: { item: any }) => (
    <PendingIncentive key={item.id} data={item} navigation={navigation} /> 
  );

  return (
    <Screen contentContainerStyle={$container}>
      <FlatList
        data={pendingIncentives}
        keyExtractor={(item) => item.id}
        renderItem={renderPendingIncentive}
        ListEmptyComponent={
          <Text style={$emptyText}>No se encontraron solicitudes a becas pendientes</Text>
        }
        contentContainerStyle={$listContainer}
      />
    </Screen>
  );
};

const $container: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  padding: 20,
};
const $emptyText: TextStyle = {
  textAlign: "center",
  color: colors.palette.neutral600,
  marginTop: spacing.md,
};
const $listContainer: ViewStyle = {
  paddingHorizontal: spacing.md,
  paddingTop: spacing.md,
  flexGrow: 1,
  paddingBottom: 60,
  minHeight: "100%",
};
