import React, { FC, useState } from "react";
import { View, ViewStyle, TextStyle, ScrollView } from "react-native";
import { Text, TextField, Button } from "app/components";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth0 } from "react-native-auth0";
import { navigate } from "app/navigators";
import { colors, spacing } from "app/theme";
import { api } from "app/services/api";
import { RouteProp } from "@react-navigation/native";
import { FundsExecutiveNavigatorParamList } from "app/navigators/FundsExecutiveStack";
import { useHeader } from "app/utils/useHeader";
import RNPickerSelect from "react-native-picker-select";
import { pickerSelectStyle } from "app/theme/pickerSelect";


interface EditFundsManagementProps {
    route: RouteProp<FundsExecutiveNavigatorParamList, "EditFundManagement">;
    navigation: any;
  }

const EditFundsManagement: FC<EditFundsManagementProps> =({ route, navigation }) => {
  const { clearSession } = useAuth0();
  const { data } = route.params; 
  const [formData, setFormData] = useState({ ...data });
  useHeader(
    {
      title: "Editar Fondo",
      leftIcon: "back",
      onLeftPress: () => navigation.goBack(),
    },
  );
  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        await clearSession();
        await AsyncStorage.removeItem("authToken");
        navigate("Login");
        console.error("No authentication token found");
        return;
      }

      if (
        !formData.budgetTitle ||
        !formData.fundingBudgetDescription ||
        !formData.status ||
        formData.totalBudget <= 0
      ) {
        Toast.show({    
          type: "error",
          position: "bottom",
          text1: "Validation Error",
          text2: "Rellene todos los campos",
        });
        return;
      }
      const response = await api.updateFundsManagement(formData.id, formData, token);
      if ("ok" in response) {
        Toast.show({
            type: "success",
            position: "bottom",
            text1: "Success",
            text2: "Funds information updated successfully.",
          });
          navigation.goBack()
      } 
       else {
       
        console.error("Error al obtener periodos de aplicación:", response);
      }
      
      
    } catch (error) {
      console.error("Error updating fund information:", error);
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error",
        text2: "No se pudo actualizar",
      });
    }
  };

  return (
    <ScrollView style={$container}>

      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          Budget Title
        </Text>
        <TextField
          value={formData.budgetTitle}
          onChangeText={(text) => handleInputChange("budgetTitle", text)}
        />
      </View>

      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          Funding Description
        </Text>
        <TextField
          value={formData.fundingBudgetDescription}
          onChangeText={(text) =>
            handleInputChange("fundingBudgetDescription", text)
          }
        />
      </View>

      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          Status
        </Text>
        <RNPickerSelect
          onValueChange={(value) => handleInputChange("status", value)}
          items={[
            { label: "Activo", value: "Activo" },
            { label: "Inactivo", value: "Inactivo" },
            { label: "Completado", value: "Completado" },
          ]}
          placeholder={{ label: "Seleccione un estado", value: null }}
          value={formData.status}
          style={pickerSelectStyle}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      <View style={$formGroup}>
        <Text preset="formLabel" style={$label}>
          Total Budget
        </Text>
        <TextField
          value={formData.totalBudget.toString()}
          keyboardType="numeric"
          onChangeText={(text) =>
            handleInputChange("totalBudget", parseFloat(text) || 0)
          }
        />
      </View>

      <Button
        text="Actualizar"
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
  fontSize: 17,
  marginBottom: spacing.xs,
  fontWeight: "bold",
};

const $submitButton: ViewStyle = {
  backgroundColor: colors.palette.brandingPink,
  borderRadius: 8,
  borderColor: colors.palette.brandingPink,
  justifyContent: "center",
  paddingVertical: spacing.md,
  marginTop: spacing.lg,
};

const $submitButtonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderColor: colors.palette.brandingMediumPink,
};

const $submitButtonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 17,
  fontWeight: "bold",
};

export { EditFundsManagement };
