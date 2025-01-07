import React from "react";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { CreatePeriod, ExecutiveScreen, ShowPendingIncentiveRequest, CreateNotification } from "app/screens";
import { ShowPendingFundsRequets } from "app/screens/Executive/ShowPendingFundsRequets";
import { ShowFundsHistory } from "app/screens/Executive/ShowFundsHistory";
import { ShowAllPeriods } from "app/screens/Executive/ShowAllPeriods";
import { ShowAllAnnouncements } from "app/screens/Executive/ShowAllAnnouncements";
import { ShowIncentivesHistory } from "app/screens/Executive/ShowIncentivesHistory";
import { UpdatePeriodForm } from "app/screens/Executive/UpdatePeriodForm";
import { CreateMoneyManagementFund } from "app/screens/Executive/CreateMoneyManagementFund";
import { ShowFundsManagment } from "app/screens/Executive/ShowFundsManagment";
import { EditFundsManagement } from "app/screens/Executive/EditFundsManagment";
import { AnnouncementDetails } from "app/screens/Executive/AnnouncementDetails";
import { EditAnnouncement } from "app/screens/Executive/EditAnnouncement";

export type FundsExecutiveNavigatorParamList = {
    FundsExecutiveView: undefined
    CreatePeriod:undefined
    ShowPendingIncentiveRequest:undefined
    ShowPendingFundsRequets:undefined
    ShowFundsHistory: undefined
    ShowAllPeriods: undefined
    ShowIncentivesHistory: { id: number };
    EditPeriod: { id: number };
    CreateFundManagement:undefined
    ShowFundsManagment:undefined
    EditFundManagement:{ data: any }
    CreateNotification: undefined;
    ShowAllAnnouncements: undefined;
    AnnouncementDetails: { id: number };
    EditAnnouncement: { id: number };
};

export type FundsExecutiveStackScreenProps<T extends keyof FundsExecutiveNavigatorParamList> = NativeStackScreenProps<
FundsExecutiveNavigatorParamList,
    T
>;

const Stack = createNativeStackNavigator<FundsExecutiveNavigatorParamList>();

export const FundsExecutiveNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="FundsExecutiveView">
            <Stack.Screen name="FundsExecutiveView" component={ExecutiveScreen} />
            <Stack.Screen name="CreatePeriod" component={CreatePeriod} />
            <Stack.Screen name="ShowPendingIncentiveRequest" component={ShowPendingIncentiveRequest} />
            <Stack.Screen name="ShowPendingFundsRequets" component={ShowPendingFundsRequets} />
            <Stack.Screen name="ShowFundsHistory" component={ShowFundsHistory} />
            <Stack.Screen name="ShowAllPeriods" component={ShowAllPeriods} />
            <Stack.Screen name="ShowIncentivesHistory" component={ShowIncentivesHistory} />
            <Stack.Screen name="EditPeriod" component={UpdatePeriodForm} />
            <Stack.Screen name="CreateFundManagement" component={CreateMoneyManagementFund} />
            <Stack.Screen name="ShowFundsManagment" component={ShowFundsManagment} />
            <Stack.Screen name="EditFundManagement" component={EditFundsManagement} />
            <Stack.Screen name="CreateNotification" component={CreateNotification} />
            <Stack.Screen name="ShowAllAnnouncements" component={ShowAllAnnouncements} />
            <Stack.Screen name="AnnouncementDetails" component={AnnouncementDetails} />
            <Stack.Screen name="EditAnnouncement" component={EditAnnouncement} />
        </Stack.Navigator>
    );
};

