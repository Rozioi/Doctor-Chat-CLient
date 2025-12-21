import axios, { type AxiosInstance } from "axios";
import type {
  ApiResponse,
  Balance,
  Chat,
  CreateChatRequest,
  CreateDoctorRequest,
  CreatePaymentRequest,
  CreateReviewRequest,
  CreateUserRequest,
  DoctorInput,
  LoginRequest,
  Payment,
  Review,
  User,
} from "./types";

export const api: AxiosInstance = axios.create({
  baseURL: "https://frightfully-desirable-baboon.cloudpub.ru/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error("Network error occurred"));
    }

    const errorMessage =
      error.response.data?.error || error.message || "An error occurred";
    return Promise.reject(new Error(errorMessage));
  },
);

api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

class ApiClient {
  async checkedServer(): Promise<ApiResponse<unknown>> {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to check server",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  async createUser(data: CreateUserRequest): Promise<ApiResponse<User>> {
    try {
      const response = await api.post<ApiResponse<User>>("/users", data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to create user",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }
  async getUserByTelegramId(telegramId: string): Promise<ApiResponse<User>> {
    try {
      const response = await api.get<User>(`/users/check/${telegramId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "User not found",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  async loginUser(data: LoginRequest): Promise<ApiResponse<User>> {
    try {
      const response = await api.post<{
        success: boolean;
        user?: User;
        message?: string;
        error?: string;
      }>("/users/login", data);
      if (response.data.success && response.data.user) {
        return {
          success: true,
          data: response.data.user,
        };
      }
      return {
        success: false,
        error: response.data.error || "Failed to login",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to login",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }
  async createDoctor(
    data: CreateDoctorRequest | Omit<CreateDoctorRequest, "telegramData">,
  ): Promise<ApiResponse<DoctorInput>> {
    try {
      const { telegramData, ...doctorData } = data as CreateDoctorRequest;

      const response = await api.post<DoctorInput>("/doctors", doctorData);

      if (response.data) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        error: "Failed to create doctor",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to create doctor",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }
  async getDoctorById(
    id: string | number,
  ): Promise<ApiResponse<DoctorInput & { id: number; user?: User }>> {
    try {
      const response = await api.get(`/doctors/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to get doctor",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }
  async getDoctorByUserId(
    userId: string | number,
  ): Promise<ApiResponse<DoctorInput & { id: number; user?: User }>> {
    try {
      const response = await api.get(`/doctors/user/${userId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to get doctor profile",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }
  async getDoctors(): Promise<
    ApiResponse<(DoctorInput & { id: number; user?: User })[]>
  > {
    try {
      const response = await api.get("/doctors");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to get doctors",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }
  async updateDoctor(
    id: string | number,
    data: Partial<DoctorInput>,
  ): Promise<ApiResponse<DoctorInput & { id: number; user?: User }>> {
    try {
      const response = await api.put(`/doctors/${id}`, data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to update doctor",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  async createChat(data: CreateChatRequest): Promise<ApiResponse<Chat>> {
    try {
      const response = await api.post<Chat>("/chats", data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to create chat",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  async getChats(telegramId?: string): Promise<ApiResponse<Chat[]>> {
    try {
      const params = telegramId ? { telegramId } : {};
      const response = await api.get<Chat[]>("/chats", { params });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to get chats",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  async uploadAvatar(
    file: File,
  ): Promise<ApiResponse<{ path: string; url: string }>> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Используем прямой URL для загрузки, так как /upload не в /api/v1
      const uploadUrl =
        api.defaults.baseURL?.replace("/api/v1", "") ||
        "https://famously-sumptuous-diamondback.cloudpub.ru";
      const response = await axios.post<{
        message: string;
        path: string;
        originalSize: number;
        compressedSize: number;
      }>(`${uploadUrl}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.path) {
        const fileName = response.data.path.replace(/^uploads\//, "");
        const fileUrl = `${uploadUrl}/uploads/${fileName}`;
        return {
          success: true,
          data: {
            path: response.data.path,
            url: fileUrl,
          },
        };
      }

      return {
        success: false,
        error: "Failed to upload file",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to upload avatar",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  async updateUserPhotoUrl(
    telegramId: string,
    photoUrl: string,
  ): Promise<ApiResponse<User>> {
    try {
      const response = await api.put<{
        success: boolean;
        user?: User;
        error?: string;
      }>(`/users/${telegramId}`, { photoUrl });

      if (response.data.success && response.data.user) {
        return {
          success: true,
          data: response.data.user,
        };
      }

      return {
        success: false,
        error: response.data.error || "Failed to update user",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to update user",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  async sendChatInvite(
    patientId: string,
    doctorId: number,
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    try {
      const response = await api.post<{
        success: boolean;
        message: string;
        error?: string;
      }>("/chats/invite", {
        patientId,
        doctorId,
      });

      if (response.data.success) {
        return {
          success: true,
          data: {
            success: response.data.success,
            message: response.data.message,
          },
        };
      }

      return {
        success: false,
        error: response.data.error || "Failed to send chat invite",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to send chat invite",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  async getBalance(telegramId?: string): Promise<ApiResponse<Balance>> {
    try {
      const params = telegramId ? { telegramId } : {};
      const response = await api.get<{
        success: boolean;
        data: Balance;
        error?: string;
      }>("/balance", { params });
      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      return {
        success: false,
        error: response.data.error || "Failed to get balance",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to get balance",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  async createPayment(
    data: CreatePaymentRequest,
  ): Promise<ApiResponse<Payment>> {
    try {
      const response = await api.post<{
        success: boolean;
        data: Payment;
        error?: string;
      }>("/payments", data);
      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      return {
        success: false,
        error: response.data.error || "Failed to create payment",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to create payment",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  async getPayments(telegramId?: string): Promise<ApiResponse<Payment[]>> {
    try {
      const params = telegramId ? { telegramId } : {};
      const response = await api.get<{
        success: boolean;
        data: Payment[];
        error?: string;
      }>("/payments", { params });
      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      return {
        success: false,
        error: response.data.error || "Failed to get payments",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to get payments",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  async addToBalance(
    amount: number,
    telegramId?: string,
  ): Promise<ApiResponse<Balance>> {
    try {
      const response = await api.post<{
        success: boolean;
        data: Balance;
        error?: string;
      }>("/balance/add", { amount, telegramId });
      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      return {
        success: false,
        error: response.data.error || "Failed to add to balance",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to add to balance",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  /**
   * Генерирует PDF документ
   */
  async generatePDF(
    data: GeneratePDFRequest,
  ): Promise<ApiResponse<PDFDocument>> {
    try {
      const response = await api.post<{
        success: boolean;
        data: PDFDocument;
        error?: string;
      }>("/pdf/generate", data);
      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      return {
        success: false,
        error: response.data.error || "Failed to generate PDF",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to generate PDF",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  /**
   * Загружает PDF файл
   */
  async uploadPDF(data: UploadPDFRequest): Promise<ApiResponse<PDFDocument>> {
    try {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("documentType", data.documentType);
      if (data.userId) {
        formData.append("userId", String(data.userId));
      }
      if (data.chatId) {
        formData.append("chatId", String(data.chatId));
      }
      if (data.metadata) {
        formData.append("metadata", JSON.stringify(data.metadata));
      }

      const response = await api.post<{
        success: boolean;
        data: PDFDocument;
        error?: string;
      }>("/pdf/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      return {
        success: false,
        error: response.data.error || "Failed to upload PDF",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to upload PDF",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  /**
   * Получает PDF документ по ID
   */
  async getPDFDocument(id: number): Promise<ApiResponse<PDFDocument>> {
    try {
      const response = await api.get<{
        success: boolean;
        data: PDFDocument;
        error?: string;
      }>(`/pdf/${id}`);
      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      return {
        success: false,
        error: response.data.error || "Failed to get PDF document",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to get PDF document",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  /**
   * Получает URL для доступа к PDF файлу
   */
  getPDFFileUrl(id: number): string {
    const baseUrl = api.defaults.baseURL?.replace("/api/v1", "") || "";
    return `${baseUrl}/api/v1/pdf/${id}/file`;
  }

  /**
   * Получает список PDF документов пользователя
   */
  async getPDFDocumentsByUser(
    userId: number,
  ): Promise<ApiResponse<PDFDocument[]>> {
    try {
      const response = await api.get<{
        success: boolean;
        data: PDFDocument[];
        error?: string;
      }>(`/pdf/user/${userId}`);
      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      return {
        success: false,
        error: response.data.error || "Failed to get PDF documents",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to get PDF documents",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  /**
   * Получает список PDF документов чата
   */
  async getPDFDocumentsByChat(
    chatId: number,
  ): Promise<ApiResponse<PDFDocument[]>> {
    try {
      const response = await api.get<{
        success: boolean;
        data: PDFDocument[];
        error?: string;
      }>(`/pdf/chat/${chatId}`);
      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      return {
        success: false,
        error: response.data.error || "Failed to get PDF documents",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to get PDF documents",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  /**
   * Удаляет PDF документ
   */
  async deletePDFDocument(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete<{
        success: boolean;
        message?: string;
        error?: string;
      }>(`/pdf/${id}`);
      if (response.data.success) {
        return {
          success: true,
        };
      }
      return {
        success: false,
        error: response.data.error || "Failed to delete PDF document",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to delete PDF document",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  /**
   * Создает отзыв на врача
   */
  async createReview(data: CreateReviewRequest): Promise<ApiResponse<Review>> {
    try {
      const response = await api.post<{
        success: boolean;
        data?: Review;
        error?: string;
      }>("/reviews", data);
      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      return {
        success: false,
        error: response.data.error || "Failed to create review",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to create review",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  /**
   * Получает отзывы на врача
   */
  async getReviewsByDoctor(
    doctorProfileId: number,
  ): Promise<ApiResponse<Review[]>> {
    try {
      const response = await api.get<{
        success: boolean;
        data?: Review[];
        error?: string;
      }>(`/reviews/doctor/${doctorProfileId}`);
      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      return {
        success: false,
        error: response.data.error || "Failed to get reviews",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to get reviews",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }

  /**
   * Получает отзыв по ID чата
   */
  async getReviewByChat(chatId: number): Promise<ApiResponse<Review>> {
    try {
      const response = await api.get<{
        success: boolean;
        data?: Review;
        error?: string;
      }>(`/reviews/chat/${chatId}`);
      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }
      return {
        success: false,
        error: response.data.error || "Failed to get review",
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to get review",
        };
      }
      return {
        success: false,
        error: "Unknown error occurred",
      };
    }
  }
}

export const apiClient = new ApiClient();
