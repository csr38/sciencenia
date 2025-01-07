import React, { FC, useCallback, useEffect, useState } from "react";
import { TextStyle, ViewStyle, FlatList, Alert } from "react-native";
import { LoadingIndicator, Screen, Text } from "app/components";
import { colors, spacing } from "app/theme";
import { CreateFundManagementCard } from "./CreateFundManagementCard";
import { api } from "app/services/api";
import { useAuth0 } from "react-native-auth0";
import { useHeader } from "app/utils/useHeader";
import { FundManagmentInformation } from "./FundManagmentInformation";
import { useFocusEffect } from "@react-navigation/native";

interface ShowFundsManagmentProps {
  navigation: any;
}

export const ShowFundsManagment: FC<ShowFundsManagmentProps> = ({ navigation }) => {
  const { getCredentials } = useAuth0();
  const [funds, setFunds] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);

  useHeader({
    title: "Manejo de Fondos",
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
  
      let allFunds: any[] = [];
      let page = 1;  
  
      while (page <= totalPages) {
        const response = await api.getFundManagment(accessToken, page);
  
        if (response && response.data) {
          const newFunds = response.data.budgets;
          allFunds = [...allFunds, ...newFunds];
  
          if (response.data.totalPages !== totalPages) {
            setTotalPages(response.data.totalPages);  
          }
  
          page++;  
        } else {
          console.error("Error al obtener fondos:", response);
          break; 
        }
      }
  
      setFunds(allFunds); 
  
    } catch (error) {
      console.error("Error inesperado al obtener fondos:", error);
    }
  }, [getCredentials, totalPages]);  
  

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchFunds().finally(() => setLoading(false));
    }, [fetchFunds])
  );

  const renderFund = ({ item, index }: { item: any; index: number }) => (
    <FundManagmentInformation key={`${item.id}-${index}`} data={item} navigation={navigation} />
  );

  if (isLoading) {
    return <LoadingIndicator backgroundColor={colors.background} />;
  }

  return (
    <Screen style={$container}>
      <FlatList
        ListHeaderComponent={<CreateFundManagementCard navigation={navigation} />}
        data={funds}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={renderFund}
        ListEmptyComponent={<Text style={$emptyText}>No se encontraron fondos</Text>}
        contentContainerStyle={$listContainer}
      />
    </Screen>
  );
};

const $container: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
  paddingTop: spacing.md,
  paddingBottom: spacing.md,
};

const $emptyText: TextStyle = {
  textAlign: "center",
  color: colors.palette.neutral600,
  marginTop: spacing.md,
};

const $listContainer: ViewStyle = {
  paddingHorizontal: spacing.md,
  flexGrow: 1,
  paddingBottom: 60,
  minHeight: "100%",
};
