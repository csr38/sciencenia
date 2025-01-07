import React from "react";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { CallForAllStudents } from "app/screens/CallForAllStudents";
import { StudentDetail } from "app/screens/StudentDetail"

export type StudentsExecutiveNavigatorParamList = {
  StudentsView: undefined
  StudentDetailView: { email: string }
}

export type StudentsExecutiveStackScreenProps<T extends keyof StudentsExecutiveNavigatorParamList> = NativeStackScreenProps<
  StudentsExecutiveNavigatorParamList,
  T
>;

const Stack = createNativeStackNavigator<StudentsExecutiveNavigatorParamList>();

export const StudentsExecutiveNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="StudentsView">
      <Stack.Screen name="StudentsView" component={CallForAllStudents} />
      <Stack.Screen name="StudentDetailView" component={StudentDetail} />
    </Stack.Navigator>
  );
};
