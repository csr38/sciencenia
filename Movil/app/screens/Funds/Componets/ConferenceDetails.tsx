import React, { FC } from "react";
import { View } from "react-native";
import { TextField,  Toggle ,Text} from "app/components";
import { ConferenceDetailsProps } from "./types"; 
import * as FormStyles from "./../Styles/FormStyles";
import { PaperSelector } from "./PaperSelector";
import SelectedFiles from "./SelectedFiles";

export const ConferenceDetails: FC<ConferenceDetailsProps> = ({ formData, handleChange, selectFile }) => (
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
      </View>
      <View style={FormStyles.$formGroup}>
        <Text style={FormStyles.$label}>
          Ranking de la Conferencia (incluir fuente)
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
        <TextField
          style={FormStyles.$input}
          value={formData.conferenceRanking}
          onChangeText={(value) => handleChange('conferenceRanking', value)}
        />
      </View>
      <View style={FormStyles.$formGroup}>
        <Text style={FormStyles.$label}>
          Título del paper
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
        <TextField
          style={FormStyles.$input}
          value={formData.researchName}
          onChangeText={(value) => handleChange('researchName', value)}
        />
      </View>
      <View style={FormStyles.$formGroup}>
        <Text style={FormStyles.$label}>
          Abstract
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
        <TextField
          style={FormStyles.$textarea}
          multiline
          value={formData.researchAbstract}
          onChangeText={(value) => handleChange('researchAbstract', value)}
        />
      </View>
      <View style={FormStyles.$switchRow}>
        <Text style={FormStyles.$labelWithToggle}>
          El paper, ¿tiene acknowledgment Cenia?
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
        <Toggle
          variant="switch"
          value={formData.acknowledgment === 'Sí'}
          onValueChange={() =>
            handleChange(
            'acknowledgment',
            formData.acknowledgment === 'Sí' ? 'No' : 'Sí'
          )
        }
        />
      </View>
      <View style={FormStyles.$switchRow}>
        <Text style={FormStyles.$labelWithToggle}>
          El paper, ¿tiene asociado otro centro o institución en sus acknowledgments o afiliaciones?
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
        <Toggle
          variant="switch"
          value={formData.outsideAcknowledgment === 'Sí'}
          onValueChange={() =>
            handleChange(
            'outsideAcknowledgment',
            formData.outsideAcknowledgment === 'Sí' ? 'No' : 'Sí'
          )
        }
        />
      </View>
      {formData.outsideAcknowledgment === 'Sí' && (
        <View style={FormStyles.$formGroup}>
        <Text style={FormStyles.$label}>
        Nombre del centro o institución aparte de Cenia que el paper tiene asociado
        <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
      <TextField
        style={FormStyles.$input}
        value={formData.outsideAcknowledgmentName}
        onChangeText={(value) => handleChange('outsideAcknowledgmentName', value)}
        />
      </View>
      )}
      <View style={FormStyles.$formGroup}>
        <Text style={FormStyles.$label}>
        Tipo de Participación
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
        <TextField
          style={FormStyles.$input}
          value={formData.participationType}
          onChangeText={(value) => handleChange('participationType', value)}
        />
      </View>
      <PaperSelector label="Comprobante de Conferencia" onPress={selectFile} />
      <SelectedFiles files={formData.files} />
    </View>
  ) : null
);
