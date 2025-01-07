export interface PurposeSelectionProps {
    formData: {
      purpose: string;                   
    };
    handleToggle: (purpose: string) => void; 
}
export interface AudienceSelectionProps {
  formData: {
    targetAudiences: string[];                                     
  };
  handleToggle: (targetAudiences: string[]) => void; 
}

export interface OtherPurposeInputProps {
    formData: {
      purpose: string;                   
      otherPurpose: string;              
    };
    handleChange: (field: string, value: string) => void; 
}
export interface DateInputProps {
    selectedStartDate: Date;              
    showStartDatePicker: boolean;         
    setShowStartDatePicker: (show: boolean) => void;  
    handleChange: (field: string, value: string) => void; 
}
export interface FinancingOptionsProps {
    formData: {
        financingType: string[];
        otherFinancingType: string;
      };
  handleCheckboxChange: (value: string) => void;
}
export interface OtherFinancingInputProps {
    formData: {
      financingType: string[];
      otherFinancingType: string;
    };
    handleChange: (field: string, value: string) => void;
}
export interface OutsideFinancingToggleProps {
    formData: {
      outsideFinancing: boolean;
    };
    handleChange: (field: string, value: boolean) => void;
}
export interface OutsideFinancingDetailsProps {
    formData: {
      outsideFinancing: boolean;
      outsideFinancingSponsors: string;
    };
    handleChange: (field: string, value: string) => void;
}
export interface ConferenceDetailsProps {
    formData: {
      purpose: string;
      conferenceName: string;
      conferenceRanking: string;
      researchName: string;
      researchAbstract: string;
      acknowledgment: string;
      outsideAcknowledgment: string,
      outsideAcknowledgmentName: string,
      participationType:string,
      files: any[];
    };
    handleChange: (field: string, value: string) => void;
    selectFile: () => void;
}
export interface EditConferenceDetailsProps {
  formData: {
    purpose: string;
    conferenceName: string;
    conferenceRanking: string;
    researchName: string;
    researchAbstract: string;
    acknowledgment: string;
    outsideAcknowledgment: string,
    outsideAcknowledgmentName: string,
    participationType:string,
    files: any[];
  };
  id: number;
  handleChange: (field: string, value: string) => void;
  selectFile: () => void;
}
export interface RequestTravelInformationProps {
    formData: {
      resultingWork: string;
      destination: string;
      durationPeriod: string;
    };
    handleChange: (field: string, value: string) => void;
    selectedStartDate: Date;
    showStartDatePicker: boolean;
    setShowStartDatePicker: (show: boolean) => void;
    setSelectedStartDate: (date: Date) => void;
}
export interface EditTravelInformationProps {
    formData: {
        resultingWork: string;
        destination: string;
        durationPeriod: string;
      };
      handleChange: (field: string, value: string) => void;
      selectedStartDate: Date;
      showStartDatePicker: boolean;
      setShowStartDatePicker: (show: boolean) => void;
      setSelectedStartDate: (date: Date) => void;
}
export interface PersonalInformationProps {
    formData: {
        university: string;
        address: string;
        city: string;
        phoneNumber: string;
    };
    handleChange: (field: string, value: string) => void;

}
export interface CeniaInformationProps {
    formData: {
        scientificProduction: string;
        ceniaParticipationActivities: string;
        otherSourcesANID: boolean;
        otherSourcesNotANID: boolean;
        anidScholarshipApplication: boolean;
        sourcesNotANID: string;
        files: any[];
        otherCentersAffiliation: string;
        nonAnidScholarshipJustification:string;
        otherProgramsFunding:string;
    };
    handleChange: (field: string, value: any) => void;
    selectFile :  () => void;

}
export interface PaperSelectorProps {
    label: string;
    onPress: () => void;
  }
  
  export interface AmountRequestedProps {
    formData: {
      amountRequested: string;
    };
    handleChange: (field: string, value: string) => void;

}
export interface ExecutiveResponseDataProps {
  formData: {
    status: string;
    response: string;
    amountGranted: string;
  };
}