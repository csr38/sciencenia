import React, { useEffect, useState } from "react";
import { View, ViewStyle, TextStyle, } from "react-native";
import { Text } from "app/components";
import { Icon } from "app/components/Icon";
import * as FormStyles from "./../Styles/FormStyles";
import { colors } from "app/theme";
import { api } from "app/services/api";
import { Alert } from "react-native";
import { useAuth0 } from "react-native-auth0";

interface EditSelectedFilesProps {
  files: { id: number; fileName: string }[]; 
  fundingRequestId: number;
}

const EditSelectedFiles: React.FC<EditSelectedFilesProps> = ({
  files: initialFiles,
  fundingRequestId,
}) => {
  const [files, setFiles] = useState(initialFiles);
  const { getCredentials } = useAuth0();

  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  const handleDelete = async (fileId: number) => {
    try {
      const credentials = await getCredentials()
      if (!credentials) {
        Alert.alert("Error", "No se pudo obtener el token de acceso.");
        return;
      }
      const accessToken = credentials.accessToken;
      const response = await api.deleteFundFiles(fundingRequestId, fileId, accessToken);
      if ("ok" in response && response.ok) {
        const updatedFiles = files.filter((file) => file.id !== fileId);
        setFiles(updatedFiles);
      } else {
        Alert.alert("Error", "No se pudo eliminar el archivo.");
      }
    } catch (error) {
      console.error("Error eliminando el archivo:", error);
      Alert.alert("Error", "Ocurrió un error al intentar eliminar el archivo.");
    }
  };
    
    if (files.length === 0) return null;
  
    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={FormStyles.$label}>Archivos seleccionados:</Text>
        {files.map((file, index) => (
          <View key={file.id || index} style={$fileRow}>
            <Text style={$fileName}>
              {file.fileName || file.name || "Archivo sin nombre"}
            </Text>
            <Icon 
              icon="x"
              size={20}
              color={colors.palette.brandingPink}
              containerStyle={$icon}
              onPress={() => handleDelete(file.id)}
            />
          </View>
        ))}
      </View>
    );
  };
  

const $fileRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginVertical: 5,
  }
const $fileName: TextStyle = {
  flex: 1,
  marginRight: 10,
  }
const $icon: TextStyle = {
  padding: 5,
  }

export default EditSelectedFiles;


