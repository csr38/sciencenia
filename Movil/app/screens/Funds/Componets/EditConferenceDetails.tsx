import React, { FC } from "react";
import { View } from "react-native";
import { TextField ,Text} from "app/components";
import { EditConferenceDetailsProps } from "./types"; 
import * as FormStyles from "./../Styles/FormStyles";
import { PaperSelector } from "./PaperSelector";
import EditSelectedFiles from "./EditSelectedFiles";

export const EditConferenceDetails: FC<EditConferenceDetailsProps> = ({ formData, id, handleChange, selectFile }) => (
  formData.purpose === 'Asistencia a conferencia' ? (
    <View>
      <View style={FormStyles.$formGroup}>
        <Text style={FormStyles.$label}>
          Nombre de la Conferencia
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
        <TextField
          style={FormStyles.$input}
          value={formData.conferenceName}
          onChangeText={(value) => handleChange('conferenceName', value)}
        />
      <PaperSelector label="Comprobante de Conferencia" onPress={selectFile} />
      <EditSelectedFiles files={formData.files} fundingRequestId={id}/>
      </View>
    </View>
  ) : null
);
