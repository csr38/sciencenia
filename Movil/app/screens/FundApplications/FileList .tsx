import React from 'react';
import { View, TouchableOpacity, TextStyle, Alert,Linking } from 'react-native';
import { colors } from "../../theme"; 
import { Text } from 'app/components';
interface FileListProps {
  files: any[];
}

const FileList: React.FC<FileListProps> = ({ files }) => {
    const openLink = async (url: string) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert("Error", "No se puede abrir el enlace.");
        }
      };
    return (
        <View>
          <Text style={$label}>• Archivos:</Text>
          {files.map((file) => (
            <TouchableOpacity
              key={file.id}
              onPress={() => openLink(file.url)} 
              style={$fileContainer}
            >
              <Text>
                <Text>• </Text>
                <Text style={$fileLink}>{file.fileName}</Text> 
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )
};

const $fileContainer: TextStyle = {
  marginLeft: 10,
  marginBottom: 5,
};

const $label: TextStyle = {
  fontSize: 16,
  color: colors.palette.brandingDarkerBlue,
  fontWeight: "bold",
  marginBottom: 4,
};

const $fileLink: TextStyle = {
  color: colors.palette.brandingDarkBlue,
  fontSize: 16,
  textDecorationLine: "underline",
  marginVertical: 4,
};

export default FileList;
