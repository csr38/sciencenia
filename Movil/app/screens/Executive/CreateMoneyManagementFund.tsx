import React, {  FC, useState} from "react"
import { View, Alert, ViewStyle, TextStyle } from 'react-native';
import { Button,Text, TextField } from "app/components"
import { useHeader } from "app/utils/useHeader";
import { Screen } from "../../components/Screen";
import { useAuth0 } from "react-native-auth0";
import { colors, spacing } from "../../theme";
import { api } from "app/services/api";
import {CustomDatePicker} from "app/components/CustomDatePicker";

interface CreateMoneyManagementFundProps {
    navigation: any; 
  }
  
const initialErrorsState = {
    periodTitle: false,
    periodDescription: false,
    startDate: false,
    endDate: false,
};

export const CreateMoneyManagementFund: FC<CreateMoneyManagementFundProps> = (_props) =>{
  const { getCredentials } = useAuth0();
  const [, setErrors] = useState(initialErrorsState);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [formData, setFormData] = useState({
    budgetTitle : "", 
    fundingBudgetDescription : "", 
    startDate: '',
    endDate: '',
    status : '',
    totalBudget: '',
    
  });
  const resetForm = () => {
    setFormData({
        budgetTitle : "", 
        fundingBudgetDescription: "", 
        startDate: '',
        endDate: '',
        status : '',
        totalBudget: '',
      });
  };
  
  const validateForm = () => {
    const newErrors = {
      ...initialErrorsState,
      purpose: !formData.budgetTitle ,
      resultingWork: !formData.fundingBudgetDescription ,
      destination: !formData.startDate,
      durationPeriod: !formData.endDate,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  useHeader(
    {
      title: "Crear nuevo Fondo de Recursos",
      leftIcon: "back",
      onLeftPress: () => _props.navigation.goBack(),
    },
  );

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };
  const parseIntValue = (value: string): number => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
  };
  const handleNumberChange = (name: string, value: any) => {
    const parsedValue = name === 'totalBudget' ? parseIntValue(value) : value;
    setFormData({ ...formData, [name]: parsedValue });
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    try {
        handleChange('status',"Activo")
      const credentials = await getCredentials();
      if (!credentials) {
        Alert.alert("Error", "No se pudo obtener el token de acceso.");
        return;
      }
      const accessToken = credentials.accessToken;
      const response = await api.createFundManagment(formData, accessToken);
  
      if ("ok" in response) {
        if (response.ok) {
          Alert.alert("Éxito", "Fondo creado correctamente");
          _props.navigation.goBack()
        } else {
          console.error("Error:", response.problem);
          resetForm(); 
        }
      } else {
        console.error("Respuesta no válida:", response);
        resetForm();
      }

    } catch(error) {
      Alert.alert("Error", "Hubo un problema al enviar la solicitud.");
      console.error("Submission error:", error);
      resetForm(); 
    }
  };

  
  return (
    <Screen preset="scroll" contentContainerStyle={$container}>
      <View style={$formGroup}>
        <Text style={$label}>
          Indique el nombre del Fondo
        </Text>
        <TextField
          numberOfLines={1}
          value={formData.budgetTitle}
          onChangeText={(value) => handleChange('budgetTitle', value)}
          placeholder="Nombre del Manejo de Fondos"
        />
      </View>
      <View style={$formGroup}>
        <Text style={$label}>
          Indique una descripción
        </Text>
        <TextField
          style={$textarea}
          multiline
          value={formData.fundingBudgetDescription}
          onChangeText={(value) => handleChange('fundingBudgetDescription', value)}
          placeholder="Descripcion"
        />
      </View>
      <View style={$formGroup}>
        <Text style={$label}>
          Fecha de inicio
        </Text>
        <CustomDatePicker
          date={selectedStartDate}
          onChangeDate={(date) => {
            setSelectedStartDate(date);
            handleChange('startDate', date.toISOString());
          }}
        />
      </View>
      <View style={$formGroup}>
        <Text style={$label}>
          Fecha de término
        </Text>
        <CustomDatePicker
          date={selectedEndDate}
          onChangeDate={(date) => {
            setSelectedEndDate(date);
            handleChange('endDate', date.toISOString());
          }}
        />
      </View>
      <View style={$formGroup}>
        <Text style={$label}>
          Presupuesto Total
        </Text>
        <TextField
          numberOfLines={1}
          numericOnly
          value={formData.totalBudget}
          onChangeText={(value) => handleNumberChange('totalBudget', value)}
          placeholder="Presupuesto total"
        />
      </View>
      <Button 
        style={$formButton}
        textStyle={$formButtonText}
        pressedStyle={$formButtonPressed}
        onPress={handleSubmit} 
        text="Enviar Solicitud" />
    </Screen>
  );
};


const $container: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  padding: 20,
  justifyContent: "center",
}

const $formButton: ViewStyle = {
  alignSelf: "stretch",
  backgroundColor: colors.palette.brandingPink,
  borderRadius: 8,
  borderColor: colors.palette.brandingPink,
  justifyContent: "center",
  marginBottom: spacing.md,
  marginTop: spacing.lg,
  paddingVertical: spacing.md,
};

const $formButtonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontSize: 16,
  fontWeight: 'bold',
};

const $formButtonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderColor: colors.palette.brandingMediumPink,
};

const $formGroup: ViewStyle = {
  marginBottom: 15,
}

const $label: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontSize: 16,
  fontWeight: "bold",
  marginBottom: 5,
}

const $textarea: TextStyle = {
  borderColor: colors.palette.brandingGray,
  minHeight: 60,
  padding: 10,
}