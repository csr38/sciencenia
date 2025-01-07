import React, {  FC, useState} from "react"
import {  Alert, TextStyle, ViewStyle} from 'react-native';
import { Button } from "app/components"
import { FundsStackScreenProps } from "app/navigators"
import { useHeader } from "app/utils/useHeader";
import { Screen } from "../../components/Screen";
import { useAuth0 } from "react-native-auth0";
import { api } from 'app/services/api';
import { useRootStore } from "app/store";
import DocumentPicker from 'react-native-document-picker'
import { PurposeSelection } from "./Componets/PurposeSelection";
import { OtherPurposeInput } from "./Componets/OtherPurposeInput";
import FinancingOptions from "./Componets/FinancingOptions";
import { OtherFinancingInput } from "./Componets/OtherFinancingInput";
import { OutsideFinancingToggle } from "./Componets/OutsideFinancingToggle";
import { OutsideFinancingDetails } from "./Componets/OutsideFinancingDetails";
import { ConferenceDetails } from "./Componets/ConferenceDetails";
import * as FormStyles from "./Styles/FormStyles";
import RequestTravelInformation from "./Componets/RequestTravelInformation";
import { colors, typography } from "app/theme";
import AmountRequested from "./Componets/AmountRequested";

interface FileUpload {
  uri: string;
  name: string;
  type: string;
  size:any;
  content:any;
}
interface CreateFundRequestProps extends FundsStackScreenProps<"CreateFundRequest"> {}
const initialErrorsState = {
  purpose: false,
  otherPurpose: false,
  resultingWork: false,
  destination: false,
  startDate: false,
  durationPeriod: false,
  financingType: false,
  conferenceName: false,
  conferenceRanking: false,
  researchName: false,
  researchAbstract: false,
  acknowledgment: false,
  amountRequested: false,
};

export const CreateFundRequest: FC<CreateFundRequestProps> = (_props) =>{
  const { getCredentials } = useAuth0();
  const [, setErrors] = useState(initialErrorsState);
  const userEmail = useRootStore((state) => state.user?.email)
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    emailApplicant: userEmail, 
    role: "estudiante", 
    purpose: '',
    otherPurpose: '',
    tasksToDo: '', 
    resultingWork: '',
    destination: '',
    startDate: '',
    durationPeriod: '',
    financingType: [] as string[],
    outsideFinancing: false,
    otherFinancingType: '',
    outsideFinancingSponsors: '',
    conferenceName: '',
    conferenceRanking: '',
    researchName: '',
    researchAbstract: '',
    acknowledgment: '',
    outsideAcknowledgment: '',
    outsideAcknowledgmentName: '',
    participationType: '',
    amountRequested:'' ,
    status: "Pendiente"  ,
    files:[] as any[],
  });
  const resetForm = () => {
    setFormData({
      emailApplicant: userEmail, 
      role: 'estudiante',
      purpose: '',
      otherPurpose: '',
      tasksToDo: '',
      resultingWork: '',
      destination: '',
      startDate: '',
      durationPeriod: '',
      financingType: [] as string[],
      outsideFinancing: false,
      otherFinancingType: '',
      outsideFinancingSponsors: '',
      conferenceName: '',
      conferenceRanking: '',
      researchName: '',
      researchAbstract: '',
      acknowledgment: '',
      outsideAcknowledgment: '',
      outsideAcknowledgmentName: '',
      participationType: '',
      amountRequested:'' ,
      status: "Pendiente",
      files:[] as any[],
    });
  };
  
  const validateForm = () => {
    const newErrors = {
      ...initialErrorsState,
      purpose: !formData.purpose,
      otherPurpose: formData.purpose === 'Otro' && !formData.otherPurpose,
      resultingWork: !formData.resultingWork,
      destination: !formData.destination,
      durationPeriod: !formData.durationPeriod,
      amountRequested: !formData.durationPeriod,
      financingType: formData.financingType.length === 0,
      conferenceName: formData.purpose === 'Asistencia a conferencia' && !formData.conferenceName,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  useHeader(
    {
      title: "Nueva Solicitud",
      leftIcon: "back",
      onLeftPress: () => _props.navigation.goBack(),
    },
  );

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };
  const handleToggle = (option: string) => {
    const newMotive = formData.purpose === option ? "" : option; 
    setFormData({ ...formData, purpose: newMotive }); 
  };
  const handleCheckboxChange = (value: string) => {
    const updatedFinancingType = formData.financingType.includes(value)
      ? formData.financingType.filter(item => item !== value)
      : [...formData.financingType, value];
    setFormData({ ...formData, financingType: updatedFinancingType });
  };
  const selectFile = async () => {
    console.log("File picker opened"); 
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
      Alert.alert('Por favor, selecciona un archivo .csv o .excel');
      return;
    }

    // @ts-ignore
    const fileToUpload: FileUpload = {
      uri: file.uri, 
      name: file.name, 
      type: file.type,
    };
    formData.files.push(fileToUpload);
  console.log(formData);

  handleChange('files', formData.files)
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios.");
      return;
    }
    setIsSubmitting(true); 
    try {
      const data = new FormData();
      for (const key in formData) {
        if (key === 'files') {
          formData.files.forEach((file) => {
            data.append('files', file);
          });
        } else if (key === 'financingType') {
            formData.financingType.forEach((type) => {
              if ( formData.financingType.length === 1) {
                data.append('financingType', type);
                // @ts-ignore
                data.append('financingType', null)
              }else{
                data.append('financingType', type);
              }
          });
        } else {
          // @ts-ignore
          data.append(key, formData[key]);
        }
      }
    
      const credentials = await getCredentials();
      if (!credentials) {
        Alert.alert("Error", "No se pudo obtener el token de acceso.");
        return;
      }
      const accessToken = credentials.accessToken;
      const response = await api.createFundRequest(data, accessToken);
  
      if ("ok" in response) {
        if (response.ok) {
          Alert.alert("Éxito", "Solicitud enviada exitosamente.");
        _props.navigation.navigate("FundsView"); 
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
    }finally {
      setIsSubmitting(false); 
    }
  };
  
  return (
    <Screen preset="scroll" contentContainerStyle={FormStyles.$container}>
      <PurposeSelection formData={formData} handleToggle={handleToggle} />
      <OtherPurposeInput formData={formData} handleChange={handleChange} />
      <RequestTravelInformation
        formData={formData}
        handleChange={handleChange}
        selectedStartDate={selectedStartDate}
        showStartDatePicker={showStartDatePicker}
        setShowStartDatePicker={setShowStartDatePicker}
        setSelectedStartDate={setSelectedStartDate}
      />
      <FinancingOptions formData={formData} handleCheckboxChange={handleCheckboxChange} />
      <OtherFinancingInput formData={formData} handleChange={handleChange} />
      <OutsideFinancingToggle formData={formData} handleChange={handleChange} />
      <OutsideFinancingDetails formData={formData} handleChange={handleChange} />
      <ConferenceDetails formData={formData} handleChange={handleChange} selectFile={selectFile} />
      <AmountRequested formData={formData} handleChange={handleChange}/>
      <Button
        style={$button}
        textStyle={$buttonText}
        pressedStyle={$buttonPressed}
        onPress={handleSubmit}
        disabled={isSubmitting}>
          Enviar Solicitud
      </Button>
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
