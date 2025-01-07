import React, { FC, useEffect, useState } from "react";
import { TouchableOpacity, Alert, Linking, View, ViewStyle, TextStyle } from "react-native";
import { Text, Screen, LoadingIndicator, DetailItem } from "app/components";
import { colors, spacing } from "../theme";
import Toast from "react-native-toast-message";
import { useHeader } from "app/utils/useHeader";
import { ObservatoryStackScreenProps } from "app/navigators/ObservatoryStack";
import { Research } from "app/services/api/api.types";
import { api } from "app/services/api";

type ResearchScreenProps = ObservatoryStackScreenProps<"ResearchView">;

export const ResearchScreen: FC<ResearchScreenProps> = ({ route, navigation }) => {
  const { id } = route.params;
  const [researchData, setResearchData] = useState<Research | null>(null);
  const [loading, setLoading] = useState(true);

  useHeader({
    title: "Investigación",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getResearchById(id);
        
        if ("kind" in response) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "No se pudieron cargar los datos.",
          });
          return;
        } else {
          setResearchData(response.data);
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
    };
    fetchData();
  }, []);

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "No se puede abrir el enlace.");
    }
  };

  if (loading) {
    return (
      <LoadingIndicator />
    );
  }

  if (!researchData) {
    return (
      <Screen style={$container}>
        <Text style={$detail}>No se encontraron datos.</Text>
      </Screen>
    );
  }

  return (
    <Screen style={$container} preset="scroll">
        <View style={$card}>
          <Text preset="bold" style={$title}>
            {researchData.title}
          </Text>
          <DetailItem label="Autor(es)" value={researchData.authors.join("; ")} />
          <DetailItem label="Año" value={researchData.yearPublished.toString()} />
          <DetailItem label="DOI" value={researchData.doi} />
          <DetailItem label="Revista" value={researchData.journal} />
          <DetailItem label="Páginas" value={`${researchData.firstPage} - ${researchData.lastPage}`} />
          <DetailItem label="Línea de investigación" value={researchData.researchLines.join(", ")} />
          {researchData.notes ? (<Text style={$detail}>Notas: {researchData.notes}</Text>) : null}

          <TouchableOpacity onPress={() => openLink(researchData.link)}>
            <Text style={$link}>Ver más detalles</Text>
          </TouchableOpacity>
        </View>
        <Toast />
    </Screen>
  );
};

const $container: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  flex: 1,
  padding: spacing.md,
};

const $card: ViewStyle = {
  flexGrow: 1,
  marginHorizontal: spacing.md,
  backgroundColor: colors.palette.brandingWhite,
  marginTop: spacing.xxl,
  padding: spacing.md,
  paddingTop: spacing.lg,
  marginBottom: spacing.sm,
  borderRadius: spacing.xs,
  shadowColor: colors.palette.brandingBlack,
  shadowOffset: { width: 2, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 3,
};

const $title: TextStyle = {
  fontSize: 24,
  marginBottom: spacing.lg,
  color: colors.palette.brandingPink,
};

const $detail: TextStyle = {
  fontSize: 16,
  marginBottom: spacing.md,
  color: colors.palette.brandingDarkBlue,
};

const $link: TextStyle = {
  fontSize: 16,
  color: colors.palette.brandingDarkBlue,
  marginVertical: spacing.sm,
  textDecorationLine: "underline",
};
