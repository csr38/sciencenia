import React, { FC, useState, useCallback } from "react";
import { View, FlatList, TextStyle, ViewStyle } from "react-native";
import { Text, LoadingIndicator, Button, Screen } from "app/components";
import { colors, typography } from "app/theme";
import { Announcements, api } from "app/services/api";
import { useHeader } from "app/utils/useHeader";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth0 } from "react-native-auth0";
import { navigate } from "app/navigators";

interface ShowAllAnnouncementsProps {
  navigation: any;
}

export const ShowAllAnnouncements: FC<ShowAllAnnouncementsProps> = ({ navigation }) => {
  const [announcements, setAnnouncements] = useState<Announcements[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { clearSession } = useAuth0();

  useFocusEffect(
    useCallback(() => {
      const fetchAnnouncements = async () => {
        try {
          setLoading(true);
          const token = await AsyncStorage.getItem("authToken");
          if (!token) {
            await clearSession();
            await AsyncStorage.removeItem("authToken");
            navigate("Login");
            console.error("No se encontró el token de autenticación");
            return;
          }

          const response = await api.getAnnouncements(token);
          if ("ok" in response) {
            console.log("Anuncios recibidos del backend:", response.data);
            setAnnouncements(response.data);
          } else {
            console.error("Invalid response kind:", response);
            setError(true);
          }
          
        } catch (err) {
          console.error("Error fetching announcements:", err);
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchAnnouncements();
      return () => {
        setAnnouncements([]);
      };
    }, [])
  );

  useHeader({
    title: "Anuncios",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  });

  if (isLoading) {
    return <LoadingIndicator backgroundColor={colors.background} />;
  }

  if (error) {
    return (
      <Screen style={$errorContainer}>
        <Text style={$errorText}>Error al cargar los anuncios. Intenta de nuevo más tarde.</Text>
      </Screen>
    );
  }

  const renderAnnouncement = ({ item }: { item: Announcements }) => {
    const { id, title, description } = item;

    return (
      <View style={$card}>
        <View style={$cardContent}>
          <Text style={$title}>{title}</Text>
          <Text style={$content}>{description}</Text>
        </View>
        <View style={$buttonsContainer}>
          <Button
            text="Editar"
            onPress={() => navigation.navigate("EditAnnouncement", { id })}
            style={$editButton}
            textStyle={$editButtonText}
            pressedStyle={$pressedEditButton}
          />
          <Button
            text="Ver postulaciones"
            onPress={() => navigation.navigate("AnnouncementDetails", { id })}
            style={$viewButton}
            textStyle={$viewButtonText}
            pressedStyle={$pressedViewButton}
          />
        </View>
      </View>
    );
  };

  return (
    <Screen>
      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAnnouncement}
        contentContainerStyle={$listContainer}
      />
    </Screen>
  );
};

const $listContainer: ViewStyle = {
  padding: 10,
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

const $buttonsContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between", 
  marginTop: 10,
};

const $viewButton: ViewStyle = {
  backgroundColor: colors.palette.brandingPink,
  padding: 10,
  borderRadius: 8,
  borderColor: colors.palette.brandingPink,
};

const $viewButtonText: TextStyle = {
  color: colors.palette.brandingWhite,
};

const $pressedViewButton: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderColor: colors.palette.brandingMediumPink,
};


const $editButton: ViewStyle = {
  backgroundColor: colors.palette.brandingDarkBlue,
  padding: 10,
  borderRadius: 8,
  borderColor: colors.palette.brandingDarkBlue,
};

const $editButtonText: TextStyle = {
  color: colors.palette.brandingWhite,
};

const $pressedEditButton: ViewStyle = {
  backgroundColor: colors.palette.brandingDarkerBlue,
  borderColor: colors.palette.brandingDarkerBlue,
};

const $errorContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};

const $errorText: TextStyle = {
  fontSize: 16,
  textAlign: "center",
};
