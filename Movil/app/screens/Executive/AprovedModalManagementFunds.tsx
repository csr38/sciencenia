import React, { FC, useCallback, useEffect, useState } from "react";
import { Modal, View, TextStyle, ViewStyle, Alert } from "react-native";
import { Button, Text, TextField } from "app/components";
import { colors, spacing, typography } from "app/theme";
import { api } from "app/services/api";
import { useAuth0 } from "react-native-auth0";
import RNPickerSelect from 'react-native-picker-select';
import { modalPickerSelectStyles } from 'app/theme/pickerSelect';


interface AprovedModalManagementFundsProps {
  isVisible: boolean;
  reason: string;
  amountGranted: string;
  setReason: (reason: string) => void;
  setAmountGranted: (reason: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onBudgetSelect: (id: number) => void; 
}

export const AprovedModalManagementFunds: FC<AprovedModalManagementFundsProps> = ({
  isVisible,
  reason,
  amountGranted,
  setReason,
  onConfirm,
  onCancel,
  setAmountGranted,
  onBudgetSelect, 
}) => {
  const [budgets, setBudgets] = useState<any[]>([]); 
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null); 
  const { getCredentials } = useAuth0();

  useEffect(() => {
    if (isVisible) {
      fetchFunds();
    }
  }, [isVisible]);

  const fetchFunds = useCallback(async () => {
    try {
      const credentials = await getCredentials();
      if (!credentials) {
        Alert.alert("Error", "No se pudo obtener el token de acceso.");
        return;
      }
      const accessToken = credentials.accessToken;
      const response = await api.getActiveFundManagment(accessToken);

      if (response && response.data) {
        setBudgets(response.data.budgets);
      } else {
        console.error("Error al obtener fondos:", response);
      }
    } catch (error) {
      console.error("Error inesperado al obtener fondos:", error);
    }
  }, []);

  const handleBudgetSelect = (id: string) => {
    const selectedId = parseInt(id, 10);
    setSelectedBudgetId(selectedId);
    onBudgetSelect(selectedId); 
  };

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={$modalOverlay}>
        <View style={$modalContent}>
          <Text style={$modalTitle}>
            Escriba el motivo y los fondos que se le asignarán al estudiante
          </Text>
          <TextField
            multiline
            containerStyle={$textInput}
            inputWrapperStyle={$inputWrapper}
            textBackgroundColor={colors.palette.brandingWhite}
            placeholder="Motivo"
            value={reason}
            onChangeText={setReason}
          />
          <TextField
            numericOnly
            numberOfLines={1}
            containerStyle={$textInput}
            inputWrapperStyle={$inputWrapper}
            textBackgroundColor={colors.palette.brandingWhite}
            placeholder="Cantidad a entregar"
            value={amountGranted}
            onChangeText={setAmountGranted}
          />
          <RNPickerSelect
            onValueChange={(value) => handleBudgetSelect(value)}
            items={budgets.map((budget) => ({
              label: `${(budget.totalBudget - budget.usedBudget).toLocaleString()} - ${budget.budgetTitle}`,
              value: budget.id.toString(),
            }))}
            placeholder={{ label: "Seleccione una opción", value: null }}
            value={selectedBudgetId?.toString()}
            style={modalPickerSelectStyles}
            useNativeAndroidPickerStyle={false}
          />

          <View style={$modalButtons}>
            <Button
              style={$aproveButton}
              textStyle={$buttonText}
              text="Confirmar"
              onPress={onConfirm}
            />
            <Button
              style={$declineButton}
              textStyle={$buttonText}
              text="Cancelar"
              onPress={onCancel}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const $aproveButton: ViewStyle = {
  backgroundColor: colors.palette.brandingPink,
  borderRadius: 8,
  justifyContent: "center",
  marginBottom: spacing.md,
  marginTop: spacing.lg,
  paddingVertical: spacing.md,
  borderColor: colors.palette.brandingPink,
};

const $buttonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 16,
  fontWeight: "bold",
};

const $declineButton: ViewStyle = {
  backgroundColor: colors.palette.brandingDarkerBlue,
  borderRadius: 8,
  justifyContent: "center",
  marginBottom: spacing.md,
  marginTop: spacing.lg,
  paddingVertical: spacing.md,
  borderColor: colors.palette.brandingDarkerBlue,
};

const $modalOverlay: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
};

const $modalContent: ViewStyle = {
  width: "90%",
  backgroundColor: colors.palette.brandingWhite,
  borderRadius: 10,
  padding: spacing.lg,
  elevation: 5,
};

const $modalTitle: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: spacing.md,
  color: colors.palette.brandingBlack,
};

const $textInput: TextStyle = {
  borderColor: colors.palette.brandingGray,
  borderRadius: 5,
  backgroundColor: colors.palette.brandingWhite,
  marginBottom: spacing.md,
  fontSize: 16,
  fontFamily: typography.primary.normal,
};

const $inputWrapper: TextStyle = {
  paddingVertical: spacing.xxs,
  backgroundColor: colors.palette.brandingWhite,
};

const $modalButtons: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
};
