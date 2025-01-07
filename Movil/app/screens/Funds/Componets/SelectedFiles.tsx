import React from "react";
import { View } from "react-native";
import { Text } from "app/components"; 
import * as FormStyles from "./../Styles/FormStyles";

interface SelectedFilesProps {
  files: { name: string }[];
}

const SelectedFiles: React.FC<SelectedFilesProps> = ({ files }) => {
  if (files.length === 0) return null; 

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={FormStyles.$label}>Archivo seleccionado:</Text>
      {files.map((file, index) => (
        <Text key={index}>{file.name}</Text> 
      ))}
    </View>
  );
};

export default SelectedFiles;
