import React, { FC } from "react";
import { Modal, View, ViewStyle, TextStyle } from "react-native";
import { Button, Text, TextField } from "app/components";
import { colors, spacing, typography } from "app/theme";

interface RejectionModalProps {
  isVisible: boolean;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RejectionModal: FC<RejectionModalProps> = ({
  isVisible,
  rejectionReason,
  setRejectionReason,
  onConfirm,
  onCancel,
}) => {
  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={$modalOverlay}>
        <View style={$modalContent}>
          <Text style={$modalTitle}>Escribe el motivo del rechazo</Text>
          <TextField
            multiline
            containerStyle={$textInput}
            inputWrapperStyle={$inputWrapper}
            textBackgroundColor={colors.palette.brandingWhite}
            placeholder="Motivo"
            value={rejectionReason}
            onChangeText={setRejectionReason}
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
  marginBottom: 15,
  textAlign: "center",
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
  width: "100%",
};

const $buttonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 16,
  fontWeight: "bold",
};
