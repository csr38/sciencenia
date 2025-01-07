import React, { FC, useCallback, useState } from "react";
import { View, FlatList, ViewStyle, TextStyle } from "react-native";
import { LoadingIndicator, Screen, Text, Button } from "app/components";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "app/theme";
import { useHeader } from "app/utils/useHeader";
import { api } from "app/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { navigate } from "app/navigators"
import { useAuth0 } from "react-native-auth0";

interface Announcement {
  id: number;
  title: string;
  description: string;
}

interface AvailableAnnouncementsScreenProps {
  navigation: any;
}

export const AvailableAnnouncementsScreen: FC<AvailableAnnouncementsScreenProps> = ({ navigation }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { clearSession } = useAuth0();


  useHeader({
    title: "Anuncios Disponibles",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  });
  
  const fetchAnnouncements = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
          await clearSession();
          await AsyncStorage.removeItem('authToken');
          navigate("Login");
          console.error('No se encontró el token de autenticación');
          return;
        }
      const response = await api.getActiveAnnouncements(token);
      if ("ok" in response) {
        const { notRegisteredAnnouncements } = response.data;
        if (notRegisteredAnnouncements && Array.isArray(notRegisteredAnnouncements)) {
          setAnnouncements(notRegisteredAnnouncements);
        } else {
          console.error("Error al obtener los anuncios:", response);
        }
      } else {
        console.error("Error al obtener los anuncios:", response);
      }
    } catch (error) {
      console.error("Error inesperado al obtener los anuncios:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchAnnouncements();
    }, [fetchAnnouncements])
  );

  if (isLoading) {
    return <LoadingIndicator backgroundColor={colors.background} />;
  }

  if (!announcements.length) {
    return (
      <View style={$emptyContainer}>
        <Text style={$emptyText}>No hay anuncios disponibles.</Text>
      </View>
    );
  }

  const renderAnnouncement = ({ item }: { item: Announcement }) => (
    <View style={$announcementCard}>
      <Text style={$title}>{item.title}</Text>
      <Text style={$description}>{item.description}</Text>
      <View style={$buttonContainer}>
      <Button
        text="Postular"
        onPress={() =>
          navigation.navigate("CreateAnnouncementRequest", {
            announcementId: item.id,
            announcementTitle: item.title,
            announcementDescription: item.description,
          })
        }
        style={$button}
        pressedStyle={$buttonPressed}
        textStyle={$textButton}
      />
      </View>
    </View>
  );

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

const $buttonContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 15,
};

const $listContainer: ViewStyle = {
  padding: 16,
  backgroundColor: colors.background,
};

const $announcementCard: ViewStyle = {
  marginBottom: 16,
  padding: 16,
  borderRadius: 8,
  backgroundColor: colors.palette.brandingWhite,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 4,
};

const $title: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
  color: colors.palette.brandingPink,
  marginBottom: 8,
};

const $description: TextStyle = {
  fontSize: 16,
  color: colors.palette.brandingDarkBlue,
};

const $emptyContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: colors.background,
};

const $emptyText: TextStyle = {
  fontSize: 16,
  color: colors.palette.brandingGray,
};

const $button: ViewStyle = {
  backgroundColor: colors.palette.brandingPink,
  borderRadius: 8,
  borderColor: colors.palette.brandingPink,
};

const $buttonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderRadius: 8,
  borderColor: colors.palette.brandingMediumPink,
};

const $textButton: TextStyle = {
  color: colors.palette.brandingWhite,
};