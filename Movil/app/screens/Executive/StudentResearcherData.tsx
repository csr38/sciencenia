import React from "react";
import { View, TextStyle } from "react-native";
import { colors, spacing } from "app/theme";
import { Text} from "app/components";

type Student = {
  user:{
    names: string;
    lastName: string;
  }
};

type StudentListProps = {
  students: Student[] | null;
};

export const StudentResearcherData: React.FC<StudentListProps> = ({ students }) => {
  return (
    <View >
      <Text style={$title} preset="bold">Estudiantes:</Text>
      {students && students.length > 0 ? (
        <View>
          {students.map((student, index) => (
            <Text key={index} style={$detail}>
                • {student.user.names} {student.user.lastName}
             </Text>
            ))}
        </View>
      ) : (
        <Text style={$detail}>No tiene estudiantes asignados</Text>
      )}
    </View>
  );
};


const $title: TextStyle = {
  fontSize: 24,
  marginTop: spacing.md,
  marginBottom: spacing.sm,
  color: colors.palette.brandingPink,
};

const $detail: TextStyle = {
  fontSize: 16,
  marginBottom: spacing.sm,
  color: colors.palette.brandingDarkBlue,
};
