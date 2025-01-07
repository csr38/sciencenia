import React, { FC } from 'react';
import { View, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { Text, TextField, Button } from 'app/components';
import RNPickerSelect from 'react-native-picker-select';
import { colors, spacing, typography } from '../../theme';
import { pickerSelectStyle } from 'app/theme/pickerSelect';
import { useNavigation } from '@react-navigation/native';

interface UserBack {
  names: string;
  lastName: string;
  secondLastName: string;
  phoneNumber: string;
  rut: string;
  email: string;
  gender: string;
  academicDegree: string;
  institution: string;
  researchLines: string[];
  entryYear: string;
  tutors: {
    id: number;
    names: string;
    lastName: string;
    secondLastName: string;
    email: string;
  }[];
  fullNameDegree: string;
  picture: { url: string };
}

interface EditStudentProfileFormScreenProps {
  userBack: UserBack;
  setUserBack: React.Dispatch<React.SetStateAction<UserBack>>;
  handleProfileSubmit: () => void;
}

export const EditStudentProfileFormScreen: FC<EditStudentProfileFormScreenProps> = ({
  userBack,
  setUserBack,
  handleProfileSubmit,
}) => {
  const navigation = useNavigation();

  return (
    <>
      <Text preset="heading" style={$sectionHeader}>
        Editar Perfil
      </Text>

      {/* Nombres */}
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          Nombres
        </Text>
        <TextField
          value={userBack.names}
          onChangeText={(text) =>
            setUserBack((prevState) => ({
              ...prevState,
              names: text || '',
            }))
          }
        />
      </View>

      {/* Apellido Paterno */}
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          Apellido Paterno
        </Text>
        <TextField
          value={userBack.lastName}
          onChangeText={(text) =>
            setUserBack((prevState) => ({
              ...prevState,
              lastName: text || '',
            }))
          }
        />
      </View>

      {/* Apellido Materno */}
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          Apellido Materno
        </Text>
        <TextField
          value={userBack.secondLastName}
          onChangeText={(text) =>
            setUserBack((prevState) => ({
              ...prevState,
              secondLastName: text || '',
            }))
          }
        />
      </View>

      {/* Email */}
      <View style={$formGroup}>
      <Text preset="formLabel" style={$label}>
        Email
      </Text>
      <TextField
        value={userBack.email}
        editable={false}
        style={$nonEditableTextField}
        onChangeText={(text) =>
          setUserBack((prevState) => ({
            ...prevState,
            email: text.toLowerCase() || '',
          }))
        }
      />
      </View>

      {/* Grado Académico */}
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          Grado Académico
        </Text>
        <TextField
          value={userBack.academicDegree}
          onChangeText={(text) =>
            setUserBack((prevState) => ({
              ...prevState,
              academicDegree: text || '',
            }))
          }
        />
      </View>

      {/* Celular */}
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          Celular
        </Text>
        <TextField
          value={userBack.phoneNumber}
          onChangeText={(text) =>
            setUserBack((prevState) => ({
              ...prevState,
              phoneNumber: text || '',
            }))
          }
        />
      </View>

      {/* RUT */}
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          RUT
        </Text>
        <TextField
          value={userBack.rut}
          onChangeText={(text) =>
            setUserBack((prevState) => ({
              ...prevState,
              rut: text || '',
            }))
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

      {/* Institución */}
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          Institución
        </Text>
        <TextField
          value={userBack.institution}
          onChangeText={(text) =>
            setUserBack((prevState) => ({
              ...prevState,
              institution: text || '',
            }))
          }
        />
      </View>

      {/* Línea de Investigación */}
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          Línea de Investigación
        </Text>
        <TextField
          editable={false}
          style={$nonEditableTextField}
          value={Array.isArray(userBack.researchLines) ? userBack.researchLines.join(', ') : ""}
          onChangeText={(text) =>
            setUserBack((prevState) => ({
              ...prevState,
              researchLines: text.split(',').map((item) => item.trim()),
            }))
          }
        />
      </View>



      {/* Nombre del Tutor */}
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          Nombre del Tutor(es)
        </Text>
        {userBack.tutors && userBack.tutors.length > 0 ? (
          userBack.tutors.map((tutor, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                const origin = 'Settings';
                // @ts-ignore: Ignorar el error de tipo para navigate
                navigation.navigate('Researchers' as never, {
                  screen: 'ResearcherView',
                  params: { email: tutor.email, origin },
                } as never);
              }}
              style={$tutorContainer}
            >
              <Text style={$nonEditableTextField}>
                {tutor.names} {tutor.lastName}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={$tutorContainer}>
            <Text style={$tutorText}>No hay tutores disponibles</Text>
          </View>
        )}
      </View>


      <Button
        text="Actualizar Perfil"
        onPress={handleProfileSubmit}
        style={$submitButton}
        textStyle={$submitButtonText}
        pressedStyle={$submitButtonPressed}
      />
    </>
  );
};


const $formGroup: ViewStyle = {
  marginBottom: spacing.md,
};

const $nonEditableTextField: TextStyle = {
  color: colors.palette.neutral500,
};

const $label: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontSize: 16,
  marginBottom: spacing.sm,
};

const $sectionHeader: TextStyle = {
  color: colors.palette.brandingPink,
  fontSize: 22,
  fontWeight: 'bold',
  marginVertical: spacing.xxs,
};

const $submitButton: ViewStyle = {
  alignItems: 'center',
  backgroundColor: colors.palette.brandingDarkBlue,
  borderRadius: 8,
  justifyContent: 'center',
  marginBottom: spacing.lg,
  marginTop: spacing.md,
  paddingVertical: spacing.md,
  borderColor: colors.palette.brandingDarkBlue,
};

const $submitButtonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingDarkerBlue,
  borderRadius: 8,
  borderColor: colors.palette.brandingDarkerBlue,
};

const $submitButtonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 16,
  fontWeight: 'bold',
};

const $tutorContainer: ViewStyle = {
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.sm,
  backgroundColor: colors.palette.neutral200,
  borderWidth: 1,
  borderRadius: 4,
  borderColor: colors.palette.neutral400,
  marginBottom: spacing.xs,
  alignItems: 'flex-start',
};

const $tutorText: TextStyle = {
  color: colors.palette.neutral600,
  fontSize: 16,
  fontFamily: typography.primary.normal,
};

export default EditStudentProfileFormScreen;