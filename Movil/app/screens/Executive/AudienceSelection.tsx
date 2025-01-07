import React, { FC } from "react";
import { View } from "react-native";
import * as FormStyles from "../Funds/Styles/FormStyles";
import { Text, Toggle } from "app/components";
import { AudienceSelectionProps } from "../Funds/Componets/types";

export const AudienceSelection: FC<AudienceSelectionProps> = ({ formData, handleToggle }) => (
  <View style={FormStyles.$formGroup}>
    <View style={FormStyles.$switchContainer}>
      {["Grado de Doctorado", "Equivalente a Magister", "Grado de Licenciatura o Título Profesional"].map((targetAudiences) => (
        <View style={FormStyles.$switchRow} key={targetAudiences}>
          <Text style={FormStyles.$switchText}>{targetAudiences}</Text>
          <Toggle
            variant="switch"
            value={formData.targetAudiences.includes(targetAudiences)} 
            onValueChange={(value) => {
                if(value){
                    handleToggle(formData.targetAudiences.concat(targetAudiences));
                }else{
                    handleToggle(formData.targetAudiences.filter((audience) => audience !== targetAudiences));
                }
            }} 
          />
        </View>
      ))}
    </View>
  </View>
);
