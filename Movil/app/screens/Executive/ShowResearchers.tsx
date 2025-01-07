import React, { FC, useCallback, useState } from "react";
import { ViewStyle, FlatList, TextStyle, View, TouchableOpacity } from "react-native";
import { Screen } from "../../components/Screen";
import { colors, spacing } from "app/theme";
import { useHeader } from "app/utils/useHeader";
import { LoadingIndicator, Text, TextField } from "app/components";
import { api } from "app/services/api";
import Toast from "react-native-toast-message";
import { ResearchersStackScreenProps } from "app/navigators/ResearchersStack";
import { useFocusEffect } from "@react-navigation/native";

interface ResearchersScreenProps extends ResearchersStackScreenProps<"ResearchersView"> {}

export const ShowResearchers: FC<ResearchersScreenProps> = (_props) => {
  const [researchers, setResearchers] = useState<any[]>([]);
  const [filteredResearchers, setFilteredResearchers] = useState<any[]>([]);
  const [isLoadingPage, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");

  useHeader({
    title: "Investigadores",
  });

  const fetchResearchers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getResearchers();

      if ("kind" in response) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No se pudieron cargar los datos.",
        });
        return;
      } else {
        if (response.data && response.ok) {
          setResearchers(response.data);
          setFilteredResearchers(response.data);
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudieron cargar los datos.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchResearchers();
    }, [])
  );

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    if (query) {
      const filtered = researchers.filter((researcher) =>
        `${researcher.names} ${researcher.lastName} ${researcher.secondLastName || ""} ${researcher.rut || ""} ${researcher.email || ""} ${researcher.researchLines || ""}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      setFilteredResearchers(filtered);
    } else {
      setFilteredResearchers(researchers); 
    }
  };

  const renderResearcherItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={$item}
        // @ts-ignore: Ignorar porque la propiedad 'origin' puede ser opcionalmente añadida y fue añadida para aceptar navegacion desde settings
        onPress={() => _props.navigation.navigate("ResearcherView", { email: item.email, origin: 'Researchers' })}
      >
        <Text preset="bold" style={$title}>{item.names} {item.lastName} {item.secondLastName}</Text>
        <Text style={$email}>Email: {item.email}</Text>
        <Text style={$rut}>RUT: {item.rut}</Text>
        <Text style={$rut}>Research Line: {item.researchLines}</Text>
      </TouchableOpacity>
    )
  }

  if (isLoadingPage) {
    return (
      <LoadingIndicator backgroundColor={colors.palette.brandingWhite} />
    );
  }

  return (
    <Screen>
      <FlatList
        data={filteredResearchers}
        keyExtractor={(item) => item.email}
        renderItem={renderResearcherItem}
        ListEmptyComponent={<Text style={$emptyText}>No se encontraron investigadores</Text>}
        contentContainerStyle={$listContainer}
      />
      <View style={$fixedSearchContainer}>
        <TextField
          textBackgroundColor={colors.palette.brandingWhite}
          style={$searchInput}
          containerStyle={$inputContainer}
          inputWrapperStyle={$inputWrapperStyle}
          placeholder="Nombres, email, rut o linea de investigación"
          value={searchTerm}
          onChangeText={handleSearch}
        />
      </View>
    </Screen>
  );
};
const $inputContainer: ViewStyle = {
  paddingHorizontal: spacing.sm,
  borderRadius: spacing.md,
  paddingVertical: spacing.xxs,
}

const $inputWrapperStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "flex-start",
  borderWidth: 2,
  borderRadius: 8,
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.palette.brandingLightPink,
  overflow: "hidden",
}

const $listContainer: ViewStyle = {
  paddingHorizontal: spacing.md,
  paddingTop: spacing.md,
  flexGrow: 1,
  paddingBottom: 90,
  minHeight: "100%",
  backgroundColor: colors.palette.brandingWhite,
}

const $fixedSearchContainer: ViewStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: spacing.sm,
  backgroundColor: colors.palette.neutral100,
  borderTopWidth: 1,
  borderColor: colors.palette.brandingLightPink,
}

const $searchInput: ViewStyle = {
  height: 32,
  backgroundColor: colors.palette.brandingWhite,
  marginBottom: 0,
}

const $item: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.brandingWhite,
  padding: spacing.md,
  marginBottom: spacing.sm,
  borderRadius: spacing.xs,
  shadowColor: colors.palette.brandingBlack,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 2,
}

const $title: TextStyle = {
  fontSize: 16,
  marginBottom: spacing.xs,
  color: colors.palette.brandingPink,
}

const $email: TextStyle = {
  fontSize: 14,
  color: colors.palette.brandingDarkerBlue,
}

const $emptyText: TextStyle = {
  textAlign: "center",
  color: colors.palette.neutral600,
  marginTop: spacing.md,
}

const $rut: TextStyle = {
  fontSize: 12,
  color: colors.palette.neutral500,
  marginTop: spacing.xxs,
}