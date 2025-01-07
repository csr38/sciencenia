/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export interface UserIncentive {
  id: number;
  status: string;
  statusTutor: string;
  tutorResponse: string | null;
  startDate: string; 
  deadline: string;  
  address: string;
  city: string;
  phoneNumber: string;
  bankName: string;
  bankAccountType: string;
  bankAccountNumber: number;
  amountRequested: number | null;
  otherSourcesANID: boolean;
  otherSourcesNotANID: boolean;
  sourcesNotANID: string;
  studentId: number;
  applicationPeriodId: number;
  createdAt: string;  
  updatedAt: string;  
}

export interface ScholarshipResponse {
  message: string;
}


export interface UserResponse {
  names: string;
  lastName: string;
  secondLastName: string;
  phoneNumber: string;
  rut: string;
  email: string;
  gender: string;
  researchLines?: string[];
  institution?: string;
  academicDegree?: string;
  entryYear?: string;
  tutors?: Array<{
    id: number;
    names: string;
    lastName: string;
    secondLastName: string;
    email: string;
  }>;
  fullNameDegree?: string;
  picture?: {
    url: string;
  }
}

export interface ThesisResponse {
  id: number
  endDate: string;
  resourcesRequested: boolean;
  startDate: string;
  status: string;
  title: string;
}
export interface UserIncentivesResponse {
  total: number;
  pages: number;
  currentpage: number;
  data: UserIncentive[];
}


export interface FundingRequest {
  id: number;
  role: string;
  purpose: string;
  otherPurpose?: string;
  tasksToDo?: string;
  resultingWork?: string;
  destination: string;
  startDate: string;
  durationPeriod: string;
  financingType: string[];
  otherFinancingType?: string;
  outsideFinancing: boolean;
  outsideFinancingSponsors?: string;
  conferenceName: string;
  conferenceRanking: string;
  researchName: string;
  researchAbstract: string;
  acknowledgment: string;
  acknowledgmentProof?: string;
  outsideAcknowledgment: string;
  outsideAcknowledgmentName?: string;
  participationType: string;
  amountRequested?:string;
  amountGranted?:string;
  status: string;
  applicantId: number;
  createdAt: string;
  updatedAt: string;
  files?: any[];
  response?: string;
}


export interface ApplicationPeriod {
  id: number;
  periodTitle: string;
  periodDescription: string;
  statusApplication: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  totalBudget:any;
  usedBudget:any;
}

export interface Announcements {
  id: number;
  title: string;
  description: string;
  targetAudiences: string[];
}

export interface User {
  names: string;
  lastName: string;
  secondLastName: string;
  phoneNumber: string;
  rut: string;
  email: string;
  gender: string;
  academicDegree: string;
  institution: string;
  researchLines: string[];
  entryYear: string;
  tutorEmail: string;
  tutorName: string;
  fullNameDegree: string;
}

export interface Research {
  id: number;
  doi: string;
  authors: string[];
  title: string;
  journal: string;
  volume: string;
  yearPublished: number;
  firstPage: number;
  lastPage: number;
  notes: string;
  indexed: string;
  funding: string;
  researchLines: string[];
  progressReport: number;
  ceniaParticipants: { name: string; role: string }[];
  roleParticipations: string[];
  link: string;
  anidNotes: string;
}

export interface SearchParams {
  query?: string
  minYear?: string
  maxYear?: string
  author?: string
  doi?: string
  page?: number
}

/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
