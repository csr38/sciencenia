import React, { FC } from "react";
import { Modal, View, ViewStyle, TextStyle } from "react-native";
import { Button, Text, TextField } from "app/components";
import { colors, spacing, typography } from "app/theme";
interface AprovedModalProps {
  isVisible: boolean;
  reason: string;
  amountGranted: string;
  setReason: (reason: string) => void;
  setAmountGranted: (reason: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AprovedModal: FC<AprovedModalProps> = ({
  isVisible,
  reason,
  amountGranted,
  setReason,
  onConfirm,
  onCancel,
  setAmountGranted,
}) => {
    if (!isVisible) return null; 
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
    <View style={$modalOverlay}>
      <View style={$modalContent}>
        <Text style={$modalTitle}>Escriba el motivo para aceptar y cuántos fondos le son asignados al estudiante</Text>
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
  fontWeight: 'bold',
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