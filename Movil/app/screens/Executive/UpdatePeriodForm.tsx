import React, { FC, useState, useEffect } from "react";
import { View, ViewStyle, TextStyle } from "react-native";
import { Button, TextField, LoadingIndicator } from "app/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "app/services/api";
import { colors } from "app/theme";
import Toast from "react-native-toast-message";
import { navigate } from "app/navigators";
import { useHeader } from "app/utils/useHeader";
import { RouteProp } from "@react-navigation/native";
import { FundsExecutiveNavigatorParamList } from "app/navigators/FundsExecutiveStack";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { pickerSelectStyle } from "app/theme/pickerSelect";

interface UpdatePeriodFormProps {
  route: RouteProp<FundsExecutiveNavigatorParamList, "EditPeriod">;
  navigation: any;
}

export const UpdatePeriodForm: FC<UpdatePeriodFormProps> = ({ route, navigation }) => {
  const { id: applicationPeriodId } = route.params;
  const [formData, setFormData] = useState({
    periodTitle: "",
    periodDescription: "",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    statusApplication: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useHeader({
    title: "Actualizar periodo",
    leftIcon: "back",
    onLeftPress: () => navigation.goBack(),
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const getPeriod = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        await AsyncStorage.removeItem("authToken");
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Sesión expirada",
          text2: "Por favor, inicia sesión nuevamente.",
        });
        return;
      }

      const response = await api.getApplicationPeriodById(applicationPeriodId, token);
      if ("kind" in response) {
        console.error("Error fetching period data:", response);
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error inesperado",
          text2: "No se pudieron obtener los datos del periodo.",
        });
      } else {
        setFormData(response.data);
      }
    } catch (error) {
      console.error("Error al obtener los datos del periodo:", error);
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error inesperado",
        text2: "No se pudieron obtener los datos del periodo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPeriod();
  }, []);

  const handleDateChange = (field: string, event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      setFormData({ ...formData, [field]: selectedDate.toISOString() });
    }
    field === "startDate" ? setShowStartDatePicker(false) : setShowEndDatePicker(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        await AsyncStorage.removeItem("authToken");
        navigate("Login");
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Sesión expirada",
          text2: "Por favor, inicia sesión nuevamente.",
        });
        return;
      }

      const response = await api.updateApplicationPeriod(applicationPeriodId, formData, token);
      if ("kind" in response) {
        console.error("Error updating period:", response);
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error inesperado",
          text2: "Ocurrió un error al intentar actualizar el periodo.",
        });
        return;
      } else {
        Toast.show({
          type: "success",
          position: "bottom",
          text1: "Actualización exitosa",
          text2: "El periodo fue actualizado correctamente.",
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error actualizando el periodo:", error);
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error inesperado",
        text2: "Ocurrió un error al intentar actualizar el periodo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator backgroundColor={colors.background} />;
  }

  return (
    <View style={$container}>
      <TextField
        label="Título del periodo"
        LabelTextProps={{
          style: $labelStyle,
        }}
        value={formData.periodTitle}
        onChangeText={(text) => handleInputChange("periodTitle", text)}
        containerStyle={$input}
      />
      <TextField
        label="Descripción del periodo"
        LabelTextProps={{
          style: $labelStyle,
        }}
        value={formData.periodDescription}
        multiline
        numberOfLines={4}
        onChangeText={(text) => handleInputChange("periodDescription", text)}
        containerStyle={$input}
      />
      <View style={$formGroup}>
        <Button
          text={`Fecha de inicio: ${new Date(formData.startDate).toLocaleDateString()}`}
          onPress={() => setShowStartDatePicker(true)}
          style={$dateButton}
          textStyle={$dateButtonText}
        />
        {showStartDatePicker && (
          <DateTimePicker
            value={new Date(formData.startDate)}
            mode="date"
            display="default"
            onChange={(event, date) => handleDateChange("startDate", event, date)}
          />
        )}
      </View>
      <View style={$formGroup}>
        <Button
          text={`Fecha de fin: ${new Date(formData.endDate).toLocaleDateString()}`}
          onPress={() => setShowEndDatePicker(true)}
          style={$dateButton}
          textStyle={$dateButtonText}
        />
        {showEndDatePicker && (
          <DateTimePicker
            value={new Date(formData.endDate)}
            mode="date"
            display="default"
            onChange={(event, date) => handleDateChange("endDate", event, date)}
          />
        )}
      </View>
      <View style={$formGroup}>
        <RNPickerSelect
          onValueChange={(value) => handleInputChange("statusApplication", value)}
          items={[
            { label: "Activo", value: "Activo" },
            { label: "Finalizado", value: "Finalizado" },
            { label: "Todavía no activo", value: "Todavía no activo" },
          ]}
          placeholder={{ label: "Seleccione el estado", value: null }}
          value={formData.statusApplication}
          style={pickerSelectStyle}
          useNativeAndroidPickerStyle={false}
        />
      </View>
      <Button
        style={$buttonStyle}
        textStyle={$textButtonStyle}
        pressedStyle={$buttonPressedStyle}
        text="Actualizar Periodo"
        onPress={handleSubmit}
        disabled={isLoading}
      />
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
  padding: 20,
  backgroundColor: colors.background,
};

const $formGroup: ViewStyle = {
  marginBottom: 15,
};

const $input: ViewStyle = {
  marginBottom: 15,
};

const $dateButton: ViewStyle = {
  padding: 10,
  backgroundColor: colors.palette.neutral200,
  borderRadius: 5,
};

const $dateButtonText: TextStyle = {
  textAlign: "left",
  width: "100%",
};

const $labelStyle: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontSize: 17,
  fontWeight: "bold",
};

const $buttonStyle: ViewStyle = {
  backgroundColor: colors.palette.brandingPink,
  borderColor: colors.palette.brandingPink,
  borderRadius: 8,
};

const $textButtonStyle: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 17,
  fontWeight: "bold",
};

const $buttonPressedStyle: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderColor: colors.palette.brandingMediumPink,
};