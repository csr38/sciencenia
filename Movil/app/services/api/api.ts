/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type {
  ApiConfig,
  UserResponse,
  ThesisResponse,
  UserIncentivesResponse,
  FundingRequest,
  ApplicationPeriod,
  ScholarshipResponse,
  User,
  
} from "./api.types"

type GeneralApiProblemWithData = GeneralApiProblem & { data?: any };

if (!Config.API_URL) {
  throw new Error("API_URL must be defined in the configuration.");
}

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */

export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  async createUser(
    requesterUser: string,
    nickname: string,
    email: string,
  ): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.post("users/", {
      requesterUser,
      nickname,
      email,
      tutorEmail: "tutor@email.com",
    })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return response
  }

  async getUserByEmail(
    email: string,
    token: string,
  ): Promise<ApiResponse<UserResponse> | GeneralApiProblem> {
    const response: ApiResponse<UserResponse> = await this.apisauce.get(
      `users/${email}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return response
  }

  /**
   * Actualiza los detalles del usuario con el email proporcionado.
   * @param email - El email del usuario que se actualizará.
   * @param updatedFields - Los campos a actualizar.
   * @param requesterEmail - El email del usuario solicitante.
   */
  async updateUser(
    email: string,
    updatedFields: Partial<UserResponse>,
    requesterEmail: string,
    token: string,
  ): Promise<ApiResponse<UserResponse> | GeneralApiProblem> {
    const response: ApiResponse<UserResponse> = await this.apisauce.patch(
      `users/${email}`,
      {
        ...updatedFields,
        requesterEmail,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return response
  }

  async getUserRole(
    email: string,
  ): Promise<{ kind: "ok"; roleId: number } | GeneralApiProblem> {
    const response: ApiResponse<{ roleId: number }> = await this.apisauce.get(
      `users/getUserRole/${email}`,
      {},
    )
  
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
  
    return {
      kind: "ok",
      roleId: response.data?.roleId ?? 0, // Devuelve 0 si no hay roleId
    }
  }

  async createThesis(
    email: string,
    title: string,
  ): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.post("thesis/", {
      email,
      title,
    })
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return response
  }

  async getThesisByEmail(
    userEmail: string,
    token: string,
  ): Promise<ApiResponse<ThesisResponse> | GeneralApiProblem> {
    const response: ApiResponse<ThesisResponse> = await this.apisauce.get(
      `thesis/${userEmail}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return response
  }

  async updateThesis(
    idThesis: number,
    updatedFields: Partial<ThesisResponse>,
    token: string,
  ): Promise<ApiResponse<ThesisResponse> | GeneralApiProblem> {
    const response: ApiResponse<ThesisResponse> = await this.apisauce.patch(
      `thesis/${idThesis}`,
      updatedFields,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return response
  }

  async getUserIncentives(
    token: string,
  ): Promise<{kind: "ok"; incentives: UserIncentivesResponse} | GeneralApiProblem> {
    const response: ApiResponse<UserIncentivesResponse> = await this.apisauce.get(
      `scholarship`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return {
      kind: "ok",
      incentives: response.data ?? {
        total: 0,
        pages: 0,
        currentpage: 0,
        data: [],
      },
    }
  }

  async createIncentiveRequest(
    formData: any,
    token: string
  ): Promise<ApiResponse<ScholarshipResponse> | GeneralApiProblem> {
    const response: ApiResponse<ScholarshipResponse> = await this.apisauce.post(
      'scholarship',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', 
        },
      }
    );
    if (!response.ok) {
      if (response.data && response.data.message) {
        return response; 
      }

      const problem = getGeneralApiProblem(response);
      if (problem) {
        return problem;
      }
    }
    return response;
  }

  async createFundRequest(
    formData: any,
    token: string
  ): Promise<ApiResponse<any> | GeneralApiProblem> {
   
    const response: ApiResponse<any> = await this.apisauce.post(
      'request',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', 
        },
      }
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
  
    return response;
  }

  async getFundRequests(
    userEmail: string,
    token: string,
  ): Promise<{ kind: "ok"; fundingRequests: FundingRequest[] } | GeneralApiProblem> {
    const response: ApiResponse<FundingRequest[]> = await this.apisauce.get(
      `request/${userEmail}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return {
      kind: "ok",
      fundingRequests: response.data ?? [],
    }
  }

  async getApplicationPeriods(): Promise<
    { kind: "ok"; applicationPeriods: ApplicationPeriod[] } | GeneralApiProblem
  > {
    const response: ApiResponse<ApplicationPeriod[]> = await this.apisauce.get("applicationPeriod")

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    try {
      ;(response.data || []).forEach((period) => {
        period.createdAt = new Date(period.createdAt)
        period.updatedAt = new Date(period.updatedAt)
        period.startDate = new Date(period.startDate)
        period.endDate = new Date(period.endDate)
      })
    } catch (error) {
      throw Error(`Error converting dates: ${error}`)
    }
    return {
      kind: "ok",
      applicationPeriods: response.data ?? [],
    }
  }

  async getStudents(token: string): Promise<ApiResponse<User[]> | GeneralApiProblem> {
    const response: ApiResponse<User[]> = await this.apisauce.get(
      "users?role=estudiante",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async getResearchById(id: number): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.get(`research/${id}`)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return response
  }

  async getPendingFundsRequests(token: string): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.get("request/status/Pendiente",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return response
  }

  async getFilteredFundsRequests(
    token: string,
    status: string
  ): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.get("request/status/" + status,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    return response
  }

  async getPendingIncentiveRequests(token: string): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.get("scholarship",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return response
  }

  async createIncentivePeriod(
    formData: any, 
    token: string
  ): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.post(
      'applicationPeriod', 
      formData, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async updateIncentiveStatus(
    incentiveID: string,
    formData: any,
    token: string,
  ): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.patch(
      `scholarship/${incentiveID}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return response
  }

  async getFilteredScholarships(
    applicationPeriodId: number,
    status: string,
    token: string,
  ): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.get(
      `scholarship?applicationPeriodId=${applicationPeriodId}&status=${status}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async updateApplicationPeriod(
    periodId: number,
    formData: any,
    token: string,
  ): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.patch(
      `applicationPeriod/${periodId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async getApplicationPeriodById(
    periodId: number,
    token: string,
  ): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.get(
      `applicationPeriod/${periodId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async updateFundsStatus(
      FundId: string,
      formData: any,
      token: string,
    ): Promise<ApiResponse<any> | GeneralApiProblem> {
      const response: ApiResponse<any> = await this.apisauce.patch(
        `request/${FundId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return response
  }

  async getResearchers(): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.get("researcher");

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return response
  }

  async getResearcherByEmail(
    email: string,
  ): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.get(
      `researcher/${email}`,
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return response
  }

  async uploadProfilePicture(
    token: string,
    file: any
  ): Promise<ApiResponse<any> | GeneralApiProblem> {
    const formData = new FormData();
    // @ts-ignore
    formData.append('file', {
        uri: file.uri,
        name: file.fileName,
        type: file.type,
    });

    const response: ApiResponse<any> = await this.apisauce.post(
      "users/uploadPicture",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async uploadFile(
    formData: FormData,
    uploadType: string,
    token: string
  ): Promise<ApiResponse<any> | GeneralApiProblemWithData> {
    let endpoint: string;
  
    if (uploadType === 'estudiantes') {
      endpoint = 'users/upload';
    } else if (uploadType === 'investigadores') {
      endpoint = 'researcher/upload/researchers';
    } else if (uploadType === 'investigaciones') {
      endpoint = 'research/upload';
    } else {
      return { kind: 'bad-data' };
    }
  
    const response: ApiResponse<any> = await this.apisauce.post(endpoint, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    });
  
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) {
        return { ...problem, data: response.data };
      }
    }
    return response;
  }

  async searchResearch(query: string): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.post("research/search", {
      filters: {
        title: query,
      }
    });

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }  

  async getResearcherStudents(researcherEmail:string): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.get(`userResearcher/researcher/${researcherEmail}`,
      {},

    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return response
  }

  async updateFundRequest(
    requestId: number,
    updatedFields: any,
    token: string, 
  ): Promise<ApiResponse<FundingRequest> | GeneralApiProblem> {
    const response: ApiResponse<FundingRequest> = await this.apisauce.patch(
      `request/${requestId}`,
      updatedFields,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
  
    return response;
  }

  async updateIncentiveRequest(
    incentiveId: number,
    updatedFields: any,
    token: string,
  ): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.patch(
      `scholarship/${incentiveId}`,
      updatedFields,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async updateFirebaseToken(
    email: string,
    token: string,
  ): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.patch(
      `users/updateFirebaseToken/${email}`,
      { firebaseToken: token }
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async searchResearchOnAnyField(page: number, query: string): Promise<ApiResponse<any> | GeneralApiProblem> {
    try {
      const response: ApiResponse<any> = await this.apisauce.post(
        "research/searchAnyField?page=" + page,
        {
          searchTerm: query, 
        }
      );
  
      if (!response.ok) {
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
  
      return response;
    } catch (error) {
      console.error("Error inesperado en searchResearchOnAnyField:", error);
      return { kind: "bad-data" };
    }
  }

  async createFundManagment(
    formData: any, 
    token: string
  ): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.post(
      'budget', 
      formData, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async getFundManagment(
    token: string,
    page: number
  ): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.get(
      `budget`,  
      { page },  
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async getActiveFundManagment(
    token: string
  ): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.get(
      `budget?status=Activo`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async updateFundsManagement(
    id: number,
    formData: any,
    token: string,
  ): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.patch(
      `budget/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }
    return response
  }
  
  async createAnnouncement(formData: any, token: string): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.post(
      'announcement',
      formData, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async getActiveAnnouncements(token: string): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.get(
      `announcement/active`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async getAnnouncements(token:string): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.get(
      `announcement`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async createAnnouncementRequest(announcementId: number, formData: any, token: string): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.post(
      `userAnnouncement/${announcementId}/register`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async getStudentsInAnnouncement(announcementId: number, token: string): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.get(
      `userAnnouncement/${announcementId}/students`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async getAnnouncementById(applicationId: number, token: string): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.get(
      `announcement/${applicationId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async updateAnnouncement(announcementId: number, formData: any, token: string): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.patch(
      `announcement/${announcementId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async getAvailableAnnouncements(token: string): Promise<ApiResponse<any> | GeneralApiProblem> {
    const response: ApiResponse<any> = await this.apisauce.get(
      `announcement/available`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async attachFundFile (
    requestId: number,
    updatedFields: FormData,
    token: string, 
    ): Promise<ApiResponse<FundingRequest> | GeneralApiProblem> {
    const response: ApiResponse<FundingRequest> = await this.apisauce.post(
      `request/${requestId}/attachFiles`,
      updatedFields,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', 
        },
      },
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async attachIncentiveFile (
    requestId: number,
    updatedFields: FormData,
    token: string, 
    ): Promise<ApiResponse<FundingRequest> | GeneralApiProblem> {
    const response: ApiResponse<FundingRequest> = await this.apisauce.post(
      `scholarship/${requestId}/attachFiles`,
      updatedFields,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', 
        },
      },
    );
    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }



  async deleteFundFiles(
    requestId: number,
    fileId: number,
    token: string, 
    ): Promise<ApiResponse<FundingRequest> | GeneralApiProblem> {
    const response: ApiResponse<FundingRequest> = await this.apisauce.delete(
      `request/${requestId}/removeFile/${fileId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }

  async deleteScholarshipFiles(
    requestId: number,
    fileId: number,
    token: string, 
    ): Promise<ApiResponse<FundingRequest> | GeneralApiProblem> {
    const response: ApiResponse<FundingRequest> = await this.apisauce.delete(
      `scholarship/${requestId}/removeFile/${fileId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }
    return response;
  }
}


// Singleton instance of the API for convenience
export const api = new Api()
