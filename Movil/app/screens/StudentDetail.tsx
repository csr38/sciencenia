import React, { FC, useState, useCallback } from "react";
import { View, ViewStyle, TextStyle, ScrollView } from "react-native";
import { Text, TextField, Button } from "app/components";
import RNPickerSelect from "react-native-picker-select";
import { StudentsExecutiveNavigatorParamList } from "app/navigators/StudentsExecutiveStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors, spacing, typography } from "app/theme";
import { pickerSelectStyle } from "app/theme/pickerSelect";
import { useHeader } from "../utils/useHeader";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api"
import { useFocusEffect } from "@react-navigation/native";
import { useAuth0 } from 'react-native-auth0';
import { navigate } from "app/navigators";

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

type StudentDetailProps = NativeStackScreenProps<StudentsExecutiveNavigatorParamList, "StudentDetailView">;

const StudentDetail: FC<StudentDetailProps> = ({ route, navigation }) => {
  const student = route.params;
  const [userBack, setUserBack] = useState<UserBack>(student as UserBack);
  const { clearSession } = useAuth0();

  const fetchStudentData = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      await clearSession();
      await AsyncStorage.removeItem('authToken');
      navigate("Login");
      console.error("No se encontró el token de autenticación");
      return;
    }

    try {
      const response = await api.getUserByEmail(userBack.email, token);
      if ('ok' in response) {
        if (response.ok && response.data) {
          setUserBack(response.data);
        } else {
          console.error("Error al obtener los datos del usuario:", response.problem);
        }
      } else {
        console.error("Error inesperado:", response);
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStudentData();
    }, [])
  );

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        await clearSession();
        await AsyncStorage.removeItem('authToken');
        navigate("Login");
        console.error("No se encontró el token de autenticación");
        return;
      }
      const response = await api.updateUser(userBack.email, {
        names: userBack.names,
        lastName: userBack.lastName,
        secondLastName: userBack.secondLastName,
        phoneNumber: userBack.phoneNumber,
        rut: userBack.rut,
        gender: userBack.gender,
        academicDegree: userBack.academicDegree,
        institution: userBack.institution,
        researchLines: userBack.researchLines,
        entryYear: userBack.entryYear,
        fullNameDegree: userBack.fullNameDegree,
      }, userBack.email, token);

      if ("kind" in response) {
        console.error("Error:", response.kind);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error',
          text2: 'No se pudo actualizar el perfil.',
        });
      } else if (response.ok && response.data) {
        setUserBack({
          ...userBack,
          ...response.data,
        });
        
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Perfil actualizado',
          text2: 'La información se actualizó correctamente.',
        });
        navigation.goBack();
      } else {
        console.error('Error al actualizar el perfil:', response.problem);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error',
          text2: 'No se pudo actualizar el perfil.',
        });
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error',
        text2: 'No se pudo actualizar el perfil.',
      });
    }
  };

  useHeader({
    title: "Editar perfil del estudiante",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  });

  return (
    <ScrollView style={$container}>
      <Text preset="heading" style={$sectionHeader}>
        {userBack.names} {userBack.lastName} {userBack.secondLastName}
      </Text>

      {/* Email */}
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>Email</Text>
        <TextField
          value={userBack.email}
          onChangeText={(text) =>
            setUserBack((prevState) => ({ ...prevState, email: text || "" }))
        }
        />
      </View>

      {/* Género */}
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          Género
        </Text>
        <RNPickerSelect
          onValueChange={(value) =>
            setUserBack((prevState) => ({
              ...prevState,
              gender: value,
            }))
          }
          items={[
            { label: 'Masculino', value: 'Masculino' },
            { label: 'Femenino', value: 'Femenino' },
            { label: 'Prefiero no decir', value: 'Prefiero no decir' },
          ]}
          placeholder={{ label: 'Seleccione su género', value: null }}
          value={userBack.gender}
          style={pickerSelectStyle}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      {/* RUT */}
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>RUT</Text>
        <TextField
          value={userBack.rut}
          onChangeText={(text) =>
            setUserBack((prevState) => ({ ...prevState, rut: text || "" }))
          }
        />
      </View>

      {/* Celular */}
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>Celular</Text>
        <TextField
          value={userBack.phoneNumber}
          onChangeText={(text) =>
            setUserBack((prevState) => ({ ...prevState, phoneNumber: text || "" }))
          }
        /> 
      </View>
          
      {/* Grado */}
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>Grado</Text>
        <TextField
          value={userBack.academicDegree}
          onChangeText={(text) =>
          setUserBack((prevState) => ({ ...prevState, academicDegree: text || "" }))
          }
        />
      </View>

      {/* Líneas de Investigación */}
      <View style={$formGroup}>
      <Text preset="formLabel" style={$label}>Línea de Investigación</Text>
      <TextField
          value={Array.isArray(userBack.researchLines) ? userBack.researchLines.join(', ') : ""}
          onChangeText={(text) =>
          setUserBack((prevState) => ({
              ...prevState,
              researchLines: text ? text.split(',').map((item) => item.trim()) : [],
          }))
          }
      />
      </View>

      {/* Botón para actualizar */}
      <Button
        text="Actualizar Perfil"
        onPress={handleSubmit}
        style={$submitButton}
        textStyle={$submitButtonText}
        pressedStyle={$submitButtonPressed}
      />
    </ScrollView>
  );
};

const $container: ViewStyle = {
  flex: 1,
  padding: spacing.lg,
  backgroundColor: colors.palette.neutral100,
};

const $formGroup: ViewStyle = {
  marginBottom: spacing.md,
};

const $label: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontSize: 16,
  marginBottom: spacing.sm,
};

const $sectionHeader: TextStyle = {
  color: colors.palette.brandingPink,
  fontSize: 22,
  fontFamily: typography.primary.bold,
  marginBottom: spacing.md,
};

const $submitButton: ViewStyle = {
  backgroundColor: colors.palette.brandingDarkBlue,
  borderRadius: 8,
  borderColor: colors.palette.brandingDarkBlue,
  justifyContent: "center",
  paddingVertical: spacing.md,
  marginTop: spacing.lg,
  marginBottom: 60,
};

const $submitButtonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingDarkerBlue,
  borderColor: colors.palette.brandingDarkerBlue,
};

const $submitButtonText: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 16,
};

export { StudentDetail };
