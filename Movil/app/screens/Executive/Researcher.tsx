import React, { FC, useEffect, useState } from "react";
import { View, TextStyle, ViewStyle } from "react-native";
import { Text, Screen, LoadingIndicator, DetailItem } from "app/components";
import { colors, spacing } from "app/theme";
import Toast from "react-native-toast-message";
import { useHeader } from "app/utils/useHeader";
import { api } from "app/services/api";
import { ResearchersStackScreenProps } from "app/navigators/ResearchersStack";
import { StudentResearcherData } from "./StudentResearcherData";
import { ResearcherPicture } from "../Reseracher/ResearcherPicture";

type ResearcherScreenProps = ResearchersStackScreenProps<"ResearcherView">;

export const Researcher: FC<ResearcherScreenProps> = ({ route, navigation }) => {
  // @ts-ignore: Ignorar porque la propiedad 'origin' puede ser opcionalmente añadida y fue añadida para aceptar navegacion desde settings
  const { email, origin = 'Researchers' } = route.params || {};
  const [researcherData, setResearcherData] = useState<any | null>(null);
  const [researcherStudents, setResearcherStudents] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [picture, setPicture] = useState<string>('');

  useHeader({
    title: "Investigador",
    leftIcon: "back",
    onLeftPress: () => {
      if (origin === 'Settings') {
        navigation.reset({
          index: 0,
          // @ts-ignore: Ignorar porque la propiedad 'name' funciona y puede ser opcionalmente añadida y fue añadida para aceptar navegacion desde settings
          routes: [{ name: 'Settings' }],
        });
      } else {
        navigation.goBack();
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
      
        const response = await api.getResearcherByEmail(email);
        const response2 = await api.getResearcherStudents(email);
        if ("kind" in response) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "No se pudieron cargar los datos.",
          });
          return;
        }
        if ("kind" in response2) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "No se pudieron cargar los datos.",
          });
          return;
        } else {
          setResearcherData(response.data);
          setPicture(response.data.picture.url)
          setResearcherStudents(response2.data)
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

  if (loading) {
    return (
      <LoadingIndicator />
    );
  }

  if (!researcherData) {
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
          {researcherData.names} {researcherData.lastName}
        </Text>
        <ResearcherPicture picture={picture} />
        <DetailItem label="Email" value={researcherData.email} />
        <DetailItem label="Nationality" value={researcherData.national} />
        <DetailItem label="RUT" value={researcherData.rut} />
        <DetailItem label="Cargo" value={researcherData.charge} />
        <DetailItem label="Degree" value={researcherData.highestDegree} />
        <DetailItem label="Titulo" value={researcherData.highestTitle} />
        <DetailItem label="Phone" value={researcherData.phone} />
        <DetailItem label="State" value={researcherData.charge} />
        <DetailItem label="Research Line" value={researcherData.researchLines} />
        <StudentResearcherData students={researcherStudents} />
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
  marginTop: spacing.xs,
  marginBottom: spacing.lg,
  padding: spacing.md,
  paddingTop: spacing.lg,
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
