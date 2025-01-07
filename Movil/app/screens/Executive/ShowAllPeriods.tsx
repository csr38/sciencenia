import React, { FC, useState, useCallback } from "react";
import { View, FlatList, TextStyle, ViewStyle } from "react-native";
import { Text, LoadingIndicator, Button, Screen } from "app/components";
import { colors, typography } from "app/theme";
import { ApplicationPeriod, api } from "app/services/api";
import { useHeader } from "app/utils/useHeader";
import { useFocusEffect } from "@react-navigation/native";
import { IncentiveBudgetDetail } from "./IncentiveBudgetDetail";

interface ShowAllPeriodsProps {
  navigation: any;
}

export const ShowAllPeriods: FC<ShowAllPeriodsProps> = ({ navigation }) => {
  const [periods, setPeriods] = useState<ApplicationPeriod[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchPeriods = async () => {
        try {
          setLoading(true);
          const response = await api.getApplicationPeriods();
          
          if (response.kind === "ok") {
            setPeriods(response.applicationPeriods);
          } else {
            console.error("Invalid response kind:", response.kind);
            setError(true);
          }
        } catch (err) {
          console.error("Error fetching periods:", err);
          setError(true);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPeriods();
      return () => {
        setPeriods([]);
      };
    }, [])
  );

  useHeader({
    title: "Periodos de aplicación",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  });

  if (isLoading) {
    return <LoadingIndicator backgroundColor={colors.background} />;
  }

  if (error) {
    return (
      <View style={$errorContainer}>
        <Text style={$errorText}>Error al cargar los periodos. Intenta de nuevo más tarde.</Text>
      </View>
    );
  }

  const handleEdit = (periodId: number) => {
    navigation.navigate("EditPeriod", { id: periodId });
  };

  const handleViewApplications = (periodId: number) => {
    navigation.navigate("ShowIncentivesHistory", { id: periodId });
};

  const renderPeriod = ({ item }: { item: ApplicationPeriod }) => {
    const { id, periodTitle, startDate, endDate, statusApplication, periodDescription ,totalBudget,usedBudget} = item;
    const formattedStartDate = new Date(startDate).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedEndDate = new Date(endDate).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <View style={$card}>
        <View style={$cardContent}>
          <Text style={$title}>{periodTitle}</Text>
          <Text style={$content}>{periodDescription}</Text>
          <Text></Text>
          <Text style={$subtitle}>Detalles:</Text>
          <Text style={$content}>• Inicio: {formattedStartDate}</Text>
          <Text style={$content}>• Fin: {formattedEndDate}</Text>
          <Text style={$content}>• Estado: {statusApplication}</Text>
          <Text></Text>
          <IncentiveBudgetDetail totalBudget={totalBudget} usedBudget={usedBudget} textStyle={$content} subtitleStyle={$subtitle}/>
        </View>
        <View style={$buttonContainer}>
          <Button
            text="Editar"
            onPress={() => handleEdit(id)}
            style={$editButton}
            textStyle={$textEditButton}
            pressedStyle={$pressedEditButton}
          />
          <Button
            text="Ver Postulaciones"
            onPress={() => handleViewApplications(id)}
            style={$viewButton}
            textStyle={$textViewButton}
            pressedStyle={$pressedViewButton}
          />
        </View>
      </View>
    );
  };

  return (
    <Screen>
      <FlatList
        data={periods}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPeriod}
        contentContainerStyle={$listContainer}
      />
    </Screen>
  );
};

const $listContainer: ViewStyle = {
  backgroundColor: colors.background,
  padding: 15,
};

const $card: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  borderRadius: 8,
  elevation: 4,
  marginVertical: 10,
  padding: 15,
  paddingHorizontal: 20,
  shadowColor: colors.palette.brandingBlack,
  shadowOpacity: 0.2,
  shadowRadius: 4,
};

const $cardContent: ViewStyle = {
  marginBottom: 10,
};

const $subtitle: TextStyle = {
  color: colors.palette.brandingDarkerBlue,
  fontFamily: typography.primary.bold,
  fontSize: 16,
  marginTop: 5,
  marginBottom: 7,
};

const $title: TextStyle = {
  color: colors.palette.brandingPink,
  fontFamily: typography.primary.bold,
  fontSize: 20,
  marginBottom: 10,
};

const $content: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontFamily: typography.primary.normal,
  fontSize: 16,
  marginTop: 5,
};

const $buttonContainer: ViewStyle = {
  marginTop: 10,
  flexDirection: "row",
  justifyContent: "space-between",
};

const $editButton: ViewStyle = {
  padding: 10,
  borderRadius: 8,
  backgroundColor: colors.palette.brandingDarkBlue,
  borderColor: colors.palette.brandingDarkBlue,
};

const $textEditButton: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 16,
};

const $pressedEditButton: ViewStyle = {
  backgroundColor: colors.palette.brandingDarkerBlue,
  borderColor: colors.palette.brandingDarkerBlue,
};

const $viewButton: ViewStyle = {
  padding: 10,
  borderRadius: 8,
  backgroundColor: colors.palette.brandingPink,
  borderColor: colors.palette.brandingPink,
};

const $textViewButton: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 16,
};

const $pressedViewButton: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderColor: colors.palette.brandingMediumPink,
};

const $errorContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: colors.background,
};

const $errorText: TextStyle = {
  color: "red",
  fontSize: 16,
  textAlign: "center",
};
