import React, { useState, FC} from "react";
import { Alert, View, ViewStyle, TextStyle } from "react-native";
import { Button, Text } from "app/components";
import { FundsStackScreenProps } from "app/navigators";
import { useHeader } from "app/utils/useHeader";
import { Screen } from "../../components/Screen";
import { useAuth0 } from "react-native-auth0";
import { api } from 'app/services/api';
import { ScholarshipResponse } from 'app/services/api/api.types';
import { useRootStore } from "app/store";
import DocumentPicker from 'react-native-document-picker'
import PersonalInformation from "./Componets/PersonalInformation";
import CeniaInformation from "./Componets/CeniaInformation";
import * as FormStyles from "./Styles/FormStyles";
import { CustomDatePicker } from 'app/components/CustomDatePicker';
import { colors, typography } from "app/theme";
import AmountRequested from "./Componets/AmountRequested";

interface FileUpload {
  uri: string;
  name: string;
  type: string;
  size:any;
  content:any;
}
interface CreateIncentiveRequestProps extends FundsStackScreenProps<"CreateIncentiveRequest"> {}

export const CreateIncentiveRequest: FC<CreateIncentiveRequestProps> = (_props) => {
  const { getCredentials } = useAuth0();
  const userEmail = useRootStore((state) => state.user?.email);
  const { applicationPeriod } = (_props.route.params as unknown) as { applicationPeriod: any };
  const [selectedStartDate3, setSelectedStartDate3] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useHeader(
    {
      title: "Nueva postulación",
      leftIcon: "back",
      onLeftPress: () => _props.navigation.goBack(),
    },
  );

  const [formData, setFormData] = useState({
    emailStudent: userEmail,
    applicationPeriodId: applicationPeriod.id,
    university: "",
    address: "",
    city: "",
    phoneNumber: "",
    otherSourcesANID: false,
    otherSourcesNotANID: false,
    sourcesNotANID: "",
    graduationDate: "",
    scientificProduction: "",
    anidScholarshipApplication: false,
    ceniaParticipationActivities: "",
    otherCentersAffiliation:"",
    nonAnidScholarshipJustification:"",
    otherProgramsFunding:"",
    amountRequested:'' ,
    files:[] as any[],
  });
  const resetForm = () => {
    setFormData({
      emailStudent: userEmail,
      applicationPeriodId: applicationPeriod.id,
      university: "",
      address: "",
      city: "",
      phoneNumber: "",
      otherSourcesANID: false,
      otherSourcesNotANID: false,
      sourcesNotANID: "",
      graduationDate: "",
      scientificProduction: "",
      anidScholarshipApplication: false,
      ceniaParticipationActivities: "",
      otherCentersAffiliation:"",
      nonAnidScholarshipJustification:"",
      otherProgramsFunding:"",
      amountRequested:'' ,
      files:[] as any[],
    });
  };

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.pick({type: [DocumentPicker.types.pdf],})
      await handleUpload(result[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Selección de archivo cancelada')
      } else {
        Alert.alert('Error al seleccionar archivo')
        console.error(err)
      }
    }
  }

  const handleUpload = async (file:any) => {
    if (!file) {
      Alert.alert('Por favor, selecciona un archivo');
      return;
    }
  
    const fileToUpload: FileUpload = {
      uri: file.uri, 
      name: file.name, 
      type: file.type,
    };
    formData.files.push(fileToUpload);
  console.log(formData);

  handleChange('files', formData.files)
  };

  const handleChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const {  address, city, graduationDate, scientificProduction, ceniaParticipationActivities } = formData;
    if (
        !address || 
        !city || 
        !graduationDate || 
        !scientificProduction || 
        !ceniaParticipationActivities) {
      Alert.alert("Error", "Por favor, complete todos los campos obligatorios.");
      return false;
    }
    return true;
  };

const errorMessages: { [key: string]: string } = {
  "Scholarship already exists": " Ya postulaste a esta beca.",
};
  
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  setIsSubmitting(true);
  try {
    const data = new FormData();
      for (const key in formData) {
        if (key === 'files') {
          formData.files.forEach((file, index) => {
            data.append(`files`, file);
          });
        
        } else {
          data.append(key, formData[key]);
        }
      }
    const credentials = await getCredentials();
    if (!credentials) {
      Alert.alert("Error", "No se pudo obtener el token de acceso.");
      return;
    }
    const accessToken = credentials.accessToken;
    const response = await api.createIncentiveRequest(data, accessToken);

    if ('ok' in response) {
      if ("data" in response && response.data !== null) {
        const scholarshipResponse = response.data as ScholarshipResponse;
        const translatedMessage = errorMessages[scholarshipResponse.message] || scholarshipResponse.message;
        if (scholarshipResponse.message) {
          Alert.alert("Error", `${translatedMessage}`);
        } else {
          Alert.alert("Éxito", "Solicitud enviada exitosamente.");
          _props.navigation.navigate("FundsView");
        }
      } else if (response.ok) {
        Alert.alert("Éxito", "Solicitud enviada exitosamente.");
        _props.navigation.navigate("FundsView");
      } else {
        Alert.alert("Error", "Hubo un problema al enviar la solicitud.");
      }
    } else {
      Alert.alert("Error", "Hubo un problema general al enviar la solicitud.");
    }
    resetForm(); 
  } catch (error) {
    Alert.alert("Error", "Hubo un problema al enviar la solicitud.");
    resetForm();
  }finally {
    setIsSubmitting(false); 
  }
};

  return (
    <Screen preset="auto" contentContainerStyle={FormStyles.$container}>
      <PersonalInformation formData={formData} handleChange={handleChange} />
      <View style={FormStyles.$formGroup}>
        <Text style={FormStyles.$label}>
          Fecha de graduación
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
        <CustomDatePicker
          date={selectedStartDate3}
          onChangeDate={(date) => {
            setSelectedStartDate3(date);
            handleChange('graduationDate', date.toISOString());
          }}
        />
      </View>
      <CeniaInformation formData={formData} handleChange={handleChange} selectFile={selectFile}/>
      <AmountRequested formData={formData} handleChange={handleChange}/>
      <Button
        style={$button}
        textStyle={$buttonText}
        pressedStyle={$buttonPressed}
        text="Enviar Solicitud"
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </Screen>
  );
};

const $button: ViewStyle = {
  marginTop: 20,
  marginBottom: 10,
  backgroundColor: colors.palette.brandingPink,
  borderColor: colors.palette.brandingPink,
  borderRadius: 8,
};

const $buttonText: TextStyle = {
  color: colors.palette.brandingWhite,
  fontFamily: typography.primary.bold,
  fontSize: 16,
};

const $buttonPressed: ViewStyle = {
  backgroundColor: colors.palette.brandingMediumPink,
  borderColor: colors.palette.brandingMediumPink,
};
