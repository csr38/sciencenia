import React, { FC, useEffect, useState } from 'react';
import { View, TextStyle, ViewStyle, ImageStyle, TouchableOpacity } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import { colors, spacing } from '../theme';
import { Screen, Button, LoadingIndicator, AutoImage, Text } from 'app/components';
import { navigate } from 'app/navigators';
import { StudentNavigatorScreenProps } from 'app/navigators/StudentNavigator';
import { useHeader } from 'app/utils/useHeader';
import EditStudentProfileFormScreen from './StudentProfile/EditStudentProfileFormScreen';
import EditThesisFormScreen from './StudentProfile/EditThesisFormScreen';
import { api } from 'app/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { launchImageLibrary, MediaType } from 'react-native-image-picker';


interface SettingsScreenProps extends StudentNavigatorScreenProps<'Settings'> {}

export const SettingsScreen: FC<SettingsScreenProps> = (_props) => {
  const { user, isLoading, clearSession } = useAuth0();
  const [imageUpdated, setImageUpdated] = useState(false);
  const [userBack, setUserBack] = useState({
    names: '',
    lastName: '',
    secondLastName: '',
    phoneNumber: '',
    rut: '',
    email: '',
    gender: '',
    academicDegree: '',
    institution: '',
    researchLines: [""],
    entryYear: '',
    tutors: [
      {
        id: 0,
        names: '',
        lastName: '',
        secondLastName: '',
        email: ''
      }
    ] as { id: number; names: string; lastName: string; secondLastName: string; email: string }[],
    fullNameDegree: '',
    picture: { url: '' },
  });

  const [thesisBack, setThesisBack] = useState({
    id: 0,
    thesisTitle: '',
    thesisStatus: '',
    thesisStartDate: '',
    thesisEndDate: '',
    resourcesRequested: false,
  });

  // Estado de carga
  const [loading, setLoading] = useState<boolean>(true);
  const [picture, setPicture] = useState<string>('');

  useHeader(
    {
      title: 'Ajustes',
    },
    []
  );

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoading && user && user.nickname && user.email) {
        try {
          setLoading(true);
          const token = await AsyncStorage.getItem("authToken");
          if (!token) {
            await clearSession();
            await AsyncStorage.removeItem('authToken');
            navigate("Login");
            console.error('No se encontró el token de autenticación');
            return;
          }

          const userResponse = await api.getUserByEmail(user.email, token);
          if ("kind" in userResponse) {
            console.error("Error:", userResponse.kind);
          } else {
            if (userResponse.ok && userResponse.data) {
              setUserBack({
                names: userResponse.data.names,
                lastName: userResponse.data.lastName,
                secondLastName: userResponse.data.secondLastName,
                phoneNumber: userResponse.data.phoneNumber,
                rut: userResponse.data.rut,
                email: userResponse.data.email,
                gender: userResponse.data.gender,
                academicDegree: userResponse.data.academicDegree ?? "",
                institution: userResponse.data.institution ?? "",
                researchLines: userResponse.data.researchLines ?? [""],
                entryYear: userResponse.data.entryYear ?? "2021-12-08",
                tutors: userResponse.data.tutors ?? [
                  {
                    id: 0,
                    names: '',
                    lastName: '',
                    secondLastName: '',
                    email: ''
                  }
                ],
                fullNameDegree: userResponse.data.fullNameDegree ?? "",
                picture: userResponse.data.picture ?? { url: "" },
              });

              if (userResponse.data.picture?.url) {
                setPicture(userResponse.data.picture.url);
              } else {
                setPicture(user?.picture ?? '');
              }
            }
          }

          const ThesisResponse = await api.getThesisByEmail(user.email, token);
          if ("kind" in ThesisResponse) {
            console.error("Error:", ThesisResponse.kind);
          } else {
            if (ThesisResponse.ok && ThesisResponse.data) {
              setThesisBack({
                id: ThesisResponse.data.id,
                thesisTitle: ThesisResponse.data.title,
                thesisStatus: ThesisResponse.data.status,
                thesisStartDate: ThesisResponse.data.startDate,
                thesisEndDate: ThesisResponse.data.endDate,
                resourcesRequested: ThesisResponse.data.resourcesRequested,
              });
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [isLoading, user, imageUpdated]);

  if (isLoading || loading) {
    return (
      <LoadingIndicator />
    );
  }

  const handleProfileSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        await clearSession();
        await AsyncStorage.removeItem('authToken');
        navigate("Login");
        console.error('No se encontró el token de autenticación');
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
      } else {
        if (response.ok) {
          console.log('Perfil actualizado correctamente');
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Perfil actualizado',
            text2: 'La información del perfil se actualizó correctamente.',
            visibilityTime: 3000,
            autoHide: true,
          });
        } else {
          console.error('Error al actualizar el perfil:', response.problem);
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Error',
            text2: 'No se pudo actualizar la tesis.',
          });
        }
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error',
        text2: 'No se pudo actualizar la tesis.',
      });
    }
  };

  const handleThesisSave = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        await clearSession();
        await AsyncStorage.removeItem('authToken');
        navigate("Login");
        console.error('No se encontró el token de autenticación');
        return;
      }
      const response = await api.updateThesis(thesisBack.id, {
        title: thesisBack.thesisTitle,
        status: thesisBack.thesisStatus,
        startDate: thesisBack.thesisStartDate,
        endDate: thesisBack.thesisEndDate,
        resourcesRequested: thesisBack.resourcesRequested,
      }, token);

      if ("kind" in response) {
        console.error("Error:", response.kind);
      } else {
        if (response.ok) {
          console.log('Tesis actualizada correctamente');
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Tesis actualizada',
            text2: 'La información de la tesis se actualizó correctamente.',
            visibilityTime: 3000,
            autoHide: true,
          });
        } else {
          console.error('Error al actualizar la tesis:', response.problem);
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Error',
            text2: 'No se pudo actualizar la tesis.',
          });
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error',
        text2: 'No se pudo actualizar la tesis.',
      });
    }
  };

  const handleQuitSession = async () => {
    await clearSession();
    await AsyncStorage.removeItem('authToken');
    navigate("Login");
  };

  const handleProfilePicturePress = async () => {
    try {
      const options = {
        mediaType: 'photo' as MediaType,
        includeBase64: false,
        maxHeight: 150,
        maxWidth: 150,
      };
      launchImageLibrary(options, async (response) => {
        if (response.didCancel) {
          console.log("Selección de imagen cancelada por el usuario");
        } else if (response.errorCode) {
          console.error("Error con el selector de imagen:", response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
  
          const token = await AsyncStorage.getItem("authToken");
          if (!token) {
            await clearSession();
            await AsyncStorage.removeItem('authToken');
            navigate("Login");
            console.error("No se encontró el token de autenticación");
            return;
          }

          const apiResponse = await api.uploadProfilePicture(token, asset);
          if (apiResponse) {
            if ("kind" in apiResponse) {
              console.error("Error:", apiResponse.kind);
            } else {
              console.log("Archivo subido exitosamente:", apiResponse.data);
              setImageUpdated(prev => !prev); 
            }
          }
        }
      });
    } catch (error) {
      console.error("Error al seleccionar o subir archivo:", error);
    }
  };

  return (
    <Screen preset="scroll" contentContainerStyle={$container}>
      {/* Imagen de perfil */}
      <View style={$imageContainer}>
        <TouchableOpacity onPress={handleProfilePicturePress}>
          <AutoImage
            source={{ uri: picture }}
            maxWidth={150}
            maxHeight={150}
            style={$profileImage}
          />
        </TouchableOpacity>
      </View>

      <EditStudentProfileFormScreen
        userBack={userBack}
        setUserBack={setUserBack}
        handleProfileSubmit={handleProfileSubmit}
      />

      {/* Separador */}
      <View style={$separator} />

      {thesisBack.id !== 0 ? (
        <EditThesisFormScreen
          thesisBack={thesisBack}
          setThesisBack={setThesisBack}
          handleThesisSave={handleThesisSave}
        />
      ) : (
        <Text style={$notThesisText}>Este estudiante no tiene generada una tesis</Text>
      )}

      {/* Separador */}
      <View style={$separator} />

      {/* Botón de Cerrar Sesión */}
      <Button
        text="Cerrar Sesión"
        onPress={handleQuitSession}
        style={$logoutButton}
        textStyle={$logoutButtonText}
        pressedStyle={$logoutButtonPressed}
      />
    </Screen>
  );
};

const $container = {
  backgroundColor: colors.palette.brandingWhite,
  padding: spacing.md,
};

const $logoutButton: ViewStyle = {
  alignItems: 'center',
  backgroundColor: colors.palette.brandingPink,
  borderRadius: 8,
  justifyContent: 'center',
  marginBottom: spacing.md,
  marginTop: spacing.lg,
  paddingVertical: spacing.md,
  borderColor: colors.palette.brandingPink,
};

const $logoutButtonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderRadius: 8,
  borderColor: colors.palette.brandingMediumPink,
};

const $logoutButtonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 16,
  fontWeight: 'bold',
};

const $separator: ViewStyle = {
  backgroundColor: colors.palette.neutral400,
  height: 1,
  marginVertical: spacing.md,
};

const $imageContainer: ViewStyle = {
  alignSelf: 'center',
  marginTop: spacing.sm,
  marginBottom: spacing.lg,
  backgroundColor: colors.palette.brandingWhite,
  borderRadius: 75,
  width: 150,
  height: 150,
  shadowColor: colors.palette.brandingDarkerBlue,
  shadowOffset: { width: 4, height: 6 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 3,
};

const $profileImage: ImageStyle = {
  borderRadius: 75,
  width: 150,
  height: 150,
  borderWidth: 3,
  borderColor: colors.palette.brandingMediumPink,
  backgroundColor: colors.palette.brandingWhite,
};

const $notThesisText: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontSize: 16,
  marginBottom: spacing.md,
  marginTop: spacing.md,
  textAlign: 'center',
};