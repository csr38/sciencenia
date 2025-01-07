import React, { FC, useState, useEffect } from "react";
import { View, FlatList, TextStyle, ViewStyle, Alert } from "react-native";
import { Text, LoadingIndicator, Screen } from "app/components";
import { colors, typography } from "app/theme";
import { api } from "app/services/api";
import { useHeader } from "app/utils/useHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Applicant {
  id: number;
  email: string;
  motivationMessage: string;
}

interface AnnouncementDetailsProps {
  navigation: any;
  route: any;
}

export const AnnouncementDetails: FC<AnnouncementDetailsProps> = ({ navigation, route }) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const announcementId = route.params?.id;

  useHeader({
    title: "Postulantes",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  });

  useEffect(() => {
    const fetchAnnouncementDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          Alert.alert("Error", "No se encontró el token de autenticación.");
          return;
        }

        const applicantsResponse = await api.getStudentsInAnnouncement(announcementId, token);
        if ("ok" in applicantsResponse) {
          const students = applicantsResponse.data.students;
          if (students) {
            const formattedApplicants = students.map((student: any) => ({
              id: student.id,
              email: student.email,
              motivationMessage: student.UserAnnouncement?.motivationMessage, 
            }));
            setApplicants(formattedApplicants);
          }
        } else {
          console.error("Error al obtener los postulantes:", applicantsResponse);
          setError(true);
          return;
        }
      } catch (err) {
        console.error("Error fetching announcement details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncementDetails();
  }, [announcementId]);

  if (isLoading) {
    return <LoadingIndicator backgroundColor={colors.background} />;
  }

  if (error) {
    return (
      <View style={$errorContainer}>
        <Text style={$errorText}>Error al cargar los detalles del anuncio. Intenta de nuevo más tarde.</Text>
      </View>
    );
  }

  if (!applicants.length) {
    return (
      <View style={$errorContainer}>
        <Text style={$errorText}>No hay postulaciones.</Text>
      </View>
    );
  }

  const renderApplicant = ({ item }: { item: Applicant }) => (
    <View style={$applicantCard}>
      <Text style={$applicantEmail}>{item.email}</Text>
      <Text style={$applicantMotivation}>{item.motivationMessage}</Text>
    </View>
  );

  return (
    <Screen style={$container}>
      <View style={$applicantsSection}>
        <FlatList
          data={applicants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderApplicant}
          contentContainerStyle={$applicantListContainer}
        />
      </View>
    </Screen>
  );
};


const $container: ViewStyle = {
  flex: 1,
  padding: 16,
  backgroundColor: colors.background,
};

const $applicantsSection: ViewStyle = {
  marginTop: 5,
};

const $applicantListContainer: ViewStyle = {
  paddingVertical: 5,
  paddingHorizontal: 5,
};

const $applicantCard: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  borderRadius: 8,
  marginBottom: 10,
  padding: 15,
  shadowColor: colors.palette.brandingBlack,
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 4,
};

const $applicantEmail: TextStyle = {
  fontSize: 16,
  color: colors.palette.brandingPink,
  fontFamily: typography.primary.bold,
};

const $applicantMotivation: TextStyle = {
  fontSize: 14,
  color: colors.palette.brandingDarkBlue,
  marginTop: 5,
};

const $errorContainer: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};

const $errorText: TextStyle = {
  fontSize: 16,
  textAlign: "center",
};
