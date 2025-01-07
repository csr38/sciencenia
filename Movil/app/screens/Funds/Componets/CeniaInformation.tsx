import React, { FC } from "react";
import { View } from "react-native";
import { TextField,Text,Toggle} from "app/components"; 
import { CeniaInformationProps } from "./types";
import * as FormStyles from "./../Styles/FormStyles";
import { PaperSelector } from "./PaperSelector";
import SelectedFiles from "./SelectedFiles";

const CeniaInformation: FC<CeniaInformationProps> = ({
  formData,
  handleChange,
  selectFile,

}) => (
  <View>
    <View style={FormStyles.$formGroup}>
        <Text style={FormStyles.$label}>Producción Científica
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
        <TextField
          value={formData.scientificProduction}
          onChangeText={(text) => handleChange("scientificProduction", text)}
          placeholder="Escriba su titulo"
        />
      </View>
      <PaperSelector label="Agregue el paper a presentar" onPress={selectFile} />
      <SelectedFiles files={formData.files} />

      <View style={FormStyles.$formGroup}>
        <Text style={FormStyles.$label}>Actividades de Participación CENIA
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
        <TextField
          value={formData.ceniaParticipationActivities}
          onChangeText={(text) => handleChange("ceniaParticipationActivities", text)}
          placeholder="Describa actividades"
        />
      </View>
      <View style={FormStyles.$formGroup}>
        <Text style={FormStyles.$label}>Afiliación a otros centros
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
        <TextField
          value={formData.otherCentersAffiliation}
          onChangeText={(text) => handleChange("otherCentersAffiliation", text)}
          placeholder="¿Participa en otros centros?"
        />
      </View>
      <View style={FormStyles.$formGroup}>
        <Text style={FormStyles.$label}>¿Ha recibido financiamiento de otras organizaciones?
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
        <TextField
          value={formData.otherProgramsFunding}
          onChangeText={(text) => handleChange("otherProgramsFunding", text)}
          placeholder="¿Ha recibido financiamiento de otras organizaciones?"
        />
      </View>
      <View style={FormStyles.$switchRow}>
      <Text style={FormStyles.$labelWithToggle}>
        ¿Ha postulado a la beca ANID? 
      <Text style={FormStyles.$asterisk}> *</Text>
       </Text>
      <Toggle
        variant="switch"
        value={formData.anidScholarshipApplication}
        onValueChange={(value) => handleChange("anidScholarshipApplication", value)}
      />
      </View>

      {!formData.anidScholarshipApplication && (
        <View style={FormStyles.$formGroup}>
          <Text style={FormStyles.$label}>
            Justificación de la no postulación
          <Text style={FormStyles.$asterisk}> *</Text>
        </Text>
          <TextField
        value={formData.nonAnidScholarshipJustification}
        onChangeText={(text) => handleChange("nonAnidScholarshipJustification", text)}
          placeholder="Justifique porque no se postulo a la beca"
          />
        </View>
        )}


    
  </View>
);

export default CeniaInformation;
