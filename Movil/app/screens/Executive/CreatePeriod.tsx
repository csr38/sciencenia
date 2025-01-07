import React, {  FC, useState} from "react"
import { View, Alert, ViewStyle, TextStyle } from 'react-native';
import { Button,Text, TextField } from "app/components"
import { useHeader } from "app/utils/useHeader";
import { Screen } from "../../components/Screen";
import { useAuth0 } from "react-native-auth0";
import { colors, spacing } from "../../theme";
import { api } from "app/services/api";
import {CustomDatePicker} from "app/components/CustomDatePicker";

interface CreatePeriodProps {
  navigation: any; 
}

const initialErrorsState = {
  periodTitle: false,
  periodDescription: false,
  startDate: false,
  endDate: false,
};

export const CreatePeriod: FC<CreatePeriodProps> = (_props) =>{
  const { getCredentials } = useAuth0();
  const [, setErrors] = useState(initialErrorsState);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [formData, setFormData] = useState({
    periodTitle: "", 
    periodDescription: "", 
    startDate: '',
    endDate: '',
    totalBudget: {
      BachelorDegree:'',
      Doctorate:'',
      MasterDegree:''
    },
  });

  const resetForm = () => {
    setFormData({
      periodTitle: "", 
      periodDescription: "", 
      startDate: '',
      endDate: '',
      totalBudget: {
        BachelorDegree:'',
        Doctorate:'',
        MasterDegree:''
      },
    });
  };
  
  const validateForm = () => {
    const newErrors = {
      ...initialErrorsState,
      purpose: !formData.periodTitle,
      resultingWork: !formData.periodDescription,
      destination: !formData.startDate,
      durationPeriod: !formData.endDate,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  useHeader(
    {
      title: "Nuevo Periodo de Becas",
      leftIcon: "back",
      onLeftPress: () => _props.navigation.goBack(),
    },
  );

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    try {
      const credentials = await getCredentials();
      if (!credentials) {
        Alert.alert("Error", "No se pudo obtener el token de acceso.");
        return;
      }
      const accessToken = credentials.accessToken;
      const response = await api.createIncentivePeriod(formData, accessToken);

      if ("ok" in response) {
        if (response.ok) {
          Alert.alert("Éxito", "Solicitud enviada exitosamente.");
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

  const updateTotalBudget = (degree: string, value: string) => {
    setFormData({
      ...formData,
      totalBudget: { 
        ...formData.totalBudget, 
        [degree]: parseInt(value, 10) || 0 
      }
    });
  };
  
  return (
    <Screen preset="scroll" contentContainerStyle={$container}>
      <View style={$formGroup}>
        <Text style={$label}>
          Indique el nombre de la beca
        </Text>
        <TextField
          value={formData.periodTitle}
          onChangeText={(value) => handleChange('periodTitle', value)}
          placeholder="Nombre de la beca"
        />
      </View>
      <View style={$formGroup}>
        <Text style={$label}>
          Indique una descripción acerca de la beca
        </Text>
        <TextField
          style={$textarea}
          multiline
          value={formData.periodDescription}
          onChangeText={(value) => handleChange('periodDescription', value)}
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
          Ingrese la cantidad de dinero destinada a pregado
        </Text>
        <TextField
          numericOnly={true}
          numberOfLines={1}
          value={formData.totalBudget.BachelorDegree}
          onChangeText={(value) => updateTotalBudget('BachelorDegree', value)}
          placeholder="Cantidad para Pregado"
        />
      </View>
      <View style={$formGroup}>
        <Text style={$label}>
          Ingrese la cantidad de dinero destinada a magister
        </Text>
        <TextField
          numericOnly={true}
          numberOfLines={1}
          value={formData.totalBudget.MasterDegree}
          onChangeText={(value) => updateTotalBudget('MasterDegree', value)}
          placeholder="Cantidad para Magister"
        />
      </View>
      <View style={$formGroup}>
        <Text style={$label}>
          Ingrese la cantidad de dinero destinada a doctorado
        </Text>
        <TextField
          numericOnly={true}
          numberOfLines={1}
          value={formData.totalBudget.Doctorate}
          onChangeText={(value) => updateTotalBudget('Doctorate', value)}
          placeholder="Cantidad para Doctorado"
        />
      </View>
      <Button 
        style={$formButton}
        textStyle={$formButtonText}
        pressedStyle={$formButtonPressed}
        onPress={handleSubmit} 
        text="Crear Periodo" />
    </Screen>
  );
};


const $container: ViewStyle = {
  backgroundColor: colors.palette.brandingWhite,
  padding: 20,
  flexGrow: 1,
  justifyContent: "center",
}

const $formButton: ViewStyle = {
  alignSelf: "stretch",
  backgroundColor: colors.palette.brandingPink,
  borderColor: colors.palette.brandingPink,
  borderRadius: 8,
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