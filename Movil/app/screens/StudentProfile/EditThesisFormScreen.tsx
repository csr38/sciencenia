import React, { FC, useState } from 'react';
import { View, Platform, TextStyle, ViewStyle } from 'react-native';
import { Text, TextField, Button } from 'app/components';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { colors, spacing, typography } from '../../theme';

interface ThesisBack {
  id: number;
  thesisTitle: string;
  thesisStatus: string;
  thesisStartDate: string;
  thesisEndDate: string;
  resourcesRequested: boolean;
}

interface EditThesisFormScreenProps {
  thesisBack: ThesisBack;
  setThesisBack: React.Dispatch<React.SetStateAction<ThesisBack>>;
  handleThesisSave: () => void;
}

export const EditThesisFormScreen: FC<EditThesisFormScreenProps> = ({
  thesisBack,
  setThesisBack,
  handleThesisSave,
}) => {
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const onChangeEndDate = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setThesisBack((prevState) => ({
        ...prevState,
        thesisEndDate: selectedDate.toISOString(),
      }));
    }
  };

  return (
    <>
      <Text preset="heading" style={$sectionHeader}>
        Editar Tesis
      </Text>

      {/* Nombre de la Tesis */}
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          Nombre de la Tesis
        </Text>
        <TextField
          value={thesisBack.thesisTitle}
          onChangeText={(text) =>
            setThesisBack((prevState) => ({
              ...prevState,
              thesisTitle: text,
            }))
          }
        />
      </View>

      {/* Estado de la Tesis */}
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          Estado de la Tesis
        </Text>
        <TextField 
          value={thesisBack.thesisStatus ? 'En Proceso' : 'Finalizada terminada'}
          style={$nonEditableTextField}
          editable={false}
        />
      </View>

      {/* Inicio de Tesis */}
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          Inicio de Tesis
        </Text>
        <TextField
          value={new Date(thesisBack.thesisStartDate).toLocaleDateString()}
          style={$nonEditableTextField}
          editable={false}
        />
      </View>

      {/* Fecha de Finalización o Esperada de Finalización */}
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          {thesisBack.thesisStatus
            ? 'Fecha Esperada de Finalización'
            : 'Fecha de Finalización'}
        </Text>
        <Button
          text={new Date(thesisBack.thesisEndDate).toLocaleDateString()}
          onPress={() => setShowEndDatePicker(true)}
          style={$dateButton}
          textStyle={$dateButtonText} 
        />
        {showEndDatePicker && (
          <DateTimePicker
            value={new Date(thesisBack.thesisEndDate)}
            mode="date"
            display="default"
            onChange={onChangeEndDate}
          />
        )}
      </View>

      {/* Recursos Solicitados
      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          Recursos Solicitados
        </Text>
        <RNPickerSelect
          onValueChange={(value) =>
            setThesisBack((prevState) => ({
              ...prevState,
              resourcesRequested: value,
            }))
          }
          items={[
            { label: 'No', value: false },
            { label: 'Sí', value: true },
          ]}
          placeholder={{ label: 'Selecciona si pediste recursos', value: null }}
          value={thesisBack.resourcesRequested}
          style={pickerSelectStyle}
        />
      </View> */}

      <Button
        text="Actualizar Tesis"
        onPress={handleThesisSave}
        style={$saveButton}
        textStyle={$saveButtonText}
        pressedStyle={$saveButtonPressed}
      />
    </>
  );
};

const $dateButton: ViewStyle = {
  backgroundColor: colors.palette.neutral200,
  justifyContent: 'flex-start',
  minHeight: 46,
};

const $dateButtonText: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 16,
};

const $formGroup: ViewStyle = {
  marginBottom: spacing.md,
};

const $label: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontSize: 16,
  marginBottom: spacing.sm,
};

const $saveButton: ViewStyle = {
  alignItems: 'center',
  backgroundColor: colors.palette.brandingDarkBlue,
  borderRadius: 8,
  justifyContent: 'center',
  marginBottom: spacing.lg,
  marginTop: spacing.md,
  paddingVertical: spacing.md,
  borderColor: colors.palette.brandingDarkBlue,
};

const $saveButtonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingDarkerBlue,
  borderRadius: 8,
  borderColor: colors.palette.brandingDarkerBlue,
};

const $saveButtonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 16,
  fontWeight: 'bold',
};

const $sectionHeader: TextStyle = {
  color: colors.palette.brandingPink,
  fontSize: 22,
  fontWeight: 'bold',
  marginVertical: spacing.xxs,
};
const $nonEditableTextField: TextStyle = {
  color: colors.palette.neutral500,
};
export default EditThesisFormScreen;