import React, { FC, useState, useCallback } from "react";
import { View, FlatList, ViewStyle, TextStyle, TouchableOpacity } from "react-native";
import { Text, TextField, Screen } from "app/components";
import { StudentsExecutiveStackScreenProps } from "app/navigators/StudentsExecutiveStack";
import { colors, spacing } from "app/theme";
import { api } from 'app/services/api';
import { useHeader } from "../utils/useHeader";
import Toast from "react-native-toast-message";
import { LoadingIndicator } from '../components/LoadingIndicator';
import { navigate } from 'app/navigators';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth0 } from "react-native-auth0";
import { useFocusEffect } from "@react-navigation/native";

interface UserBack {
  names: string;
  lastName: string;
  secondLastName: string;
  phoneNumber: string;
  rut: string;
  email: string;
  gender: string;
  academicDegree?: string;
  institution?: string;
  researchLines?: string[];
  entryYear?: string;
  tutorEmail?: string;
  tutorName?: string;
  fullNameDegree?: string;
}

interface StudentsExecutiveScreenProps extends StudentsExecutiveStackScreenProps<"StudentsView"> {}

export const CallForAllStudents: FC<StudentsExecutiveScreenProps> = (_props) => {
  const { clearSession } = useAuth0();
  const [students, setStudents] = useState<UserBack[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useHeader({ title: "Estudiantes" }, []);

  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        await clearSession();
        await AsyncStorage.removeItem('authToken');
        navigate("Login");
        console.error("No se encontró el token de autenticación");
        return;
      }
      const response = await api.getStudents(token);
      if ("kind" in response) {
        Toast.show({ type: "error", text1: "Error", text2: "No se pudieron obtener los estudiantes." });
      } else {
        setStudents(response.data as UserBack[]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchStudents();
    }, [])
  );

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const filteredStudents = students
    .filter((student) => {
      const fullName = `${student.names} ${student.lastName} ${student.secondLastName}`.toLowerCase();
      const searchWords = searchTerm.toLowerCase().split(" ");
      return searchWords.every((word) => fullName.includes(word));
    })
    .sort((a, b) => (a.lastName || "").localeCompare(b.lastName || ""));

  const renderStudent = ({ item }: { item: UserBack }) => (
    <TouchableOpacity style={$item} onPress={() => navigate("StudentDetailView", { email: item.email })}>
      <Text preset="bold" style={$title}>{`${item.names} ${item.lastName} ${item.secondLastName}`}</Text>
      <Text style={$email}>{item.email}</Text>
    </TouchableOpacity>
  );

  if (isLoading) return <LoadingIndicator />;

  return (
    <Screen style={$container}>
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.email}
        renderItem={renderStudent}
        ListEmptyComponent={<Text style={$emptyText}>No se encontraron estudiantes</Text>}
        contentContainerStyle={$listContainer}
      />
      <View style={$fixedSearchContainer}>
        <TextField
          textBackgroundColor={colors.palette.brandingWhite}
          style={$searchInput}
          containerStyle={$inputContainer}
          inputWrapperStyle={$inputWrapperStyle}
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChangeText={handleSearch}
        />
      </View>
      <Toast />
    </Screen>
  );
};

const $container: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
}

const $listContainer: ViewStyle = {
  paddingHorizontal: spacing.md,
  paddingTop: spacing.md,
  flexGrow: 1,
  paddingBottom: 90,
  minHeight: "100%",
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
  color: colors.palette.brandingDarkBlue,
}

const $emptyText: TextStyle = {
  textAlign: "center",
  color: colors.palette.neutral600,
  marginTop: spacing.md,
}