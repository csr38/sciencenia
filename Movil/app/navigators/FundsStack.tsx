import React from "react"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { CreateFundRequest, CreateIncentiveRequest, FundApplicationDetailScreen, FundApplicationScreen, FundsListView } from "app/screens"
import { FundingRequest } from "app/services/api"
import { AvailableScholarshipsScreen } from "app/screens/Funds/AvailableScholarshipsScreen"
import { AvailableAnnouncementsScreen } from "app/screens/Funds/AvailableAnnouncementsScreen"
import { UserScholarshipsScreen } from "app/screens/Funds/UserScholarshipsScreen"
import ShowIncentiveDetail from "app/screens/Funds/ShowIncentiveDetail"
import EditFundingRequestScreen from 'app/screens/FundApplications/EditFundingRequestScreen';
import EditIncentiveRequestScreen from "app/screens/Funds/EditIncentiveRequestScreen"
import { CreateAnnouncementRequest } from "app/screens/Funds/CreateAnnouncementRequest"
import { NotAvailableAnnouncements } from "app/screens/Funds/NotAvailableAnnouncements"


export type FundsNavigatorParamList = {
  FundsView: undefined
  ViewFundsRequests: undefined
  ShowFundingRequest: {
    fundingRequest: FundingRequest
  }
  CreateFundRequest: undefined
  CreateIncentiveRequest: undefined
  ShowAvailableScholarships: undefined
  ShowUserScholarships: undefined
  ShowIncentiveDetail: { incentiveRequest: any, files:any[],title:string};
  EditFundingRequest: { fundingRequest: FundingRequest }
  EditIncentiveRequest: { incentiveRequest: any }
  AvailableAnnouncements: undefined
  CreateAnnouncementRequest: undefined
  NotAvailableAnnouncements: undefined
}

export type FundsStackScreenProps<T extends keyof FundsNavigatorParamList> = NativeStackScreenProps<
  FundsNavigatorParamList,
  T
>

const Stack = createNativeStackNavigator<FundsNavigatorParamList>()
export const FundsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="FundsView">
      <Stack.Screen name="FundsView" component={FundsListView} />
      <Stack.Screen name="ViewFundsRequests" component={FundApplicationScreen} />
      <Stack.Screen name="ShowFundingRequest" component={FundApplicationDetailScreen} />
      <Stack.Screen name="CreateFundRequest" component={CreateFundRequest} />
      <Stack.Screen name="CreateIncentiveRequest" component={CreateIncentiveRequest} />
      <Stack.Screen name="ShowAvailableScholarships" component={AvailableScholarshipsScreen} />
      <Stack.Screen name="ShowUserScholarships" component={UserScholarshipsScreen} />
      <Stack.Screen name="ShowIncentiveDetail" component={ShowIncentiveDetail} />
      <Stack.Screen name="EditFundingRequest" component={EditFundingRequestScreen} />
      <Stack.Screen name="EditIncentiveRequest" component={EditIncentiveRequestScreen} />
      <Stack.Screen name="AvailableAnnouncements" component={AvailableAnnouncementsScreen} />
      <Stack.Screen name="CreateAnnouncementRequest" component={CreateAnnouncementRequest} />
      <Stack.Screen name="NotAvailableAnnouncements" component={NotAvailableAnnouncements} />
    </Stack.Navigator>
  )
}
