import axiosInstance from "@/axios/axiosInstance";

export const apiService = {
  auth: {
    login: (data: object) => axiosInstance.post("/auth/login", data),
    register: (data: object) => axiosInstance.post("/auth/register", data),
    refresh: (data: object) => axiosInstance.post("/auth/refresh", data),
    logout: () => axiosInstance.post("/auth/logout"),
  },

  user: {
    getProfile: () => axiosInstance.get("/user/profile"),
    updateProfile: (data: object) => axiosInstance.put("/user/profile", data),
    getAllUsers: () => axiosInstance.get("/user"),
    getUserById: (id: string) => axiosInstance.get(`/user/${id}`),
    deleteUser: (id: string) => axiosInstance.delete(`/user/${id}`),
  },

  posts: {
    getAll: () => axiosInstance.get("/posts"),
    getById: (id: string) => axiosInstance.get(`/posts/${id}`),
    create: (data: object) => axiosInstance.post("/posts", data),
    update: (id: string, data: object) =>
      axiosInstance.put(`/posts/${id}`, data),
    delete: (id: string) => axiosInstance.delete(`/posts/${id}`),
  },

  video: {
    getAll: (page: number = 1, limit: number = 12) =>
      axiosInstance.get(`/video?page=${page}&limit=${limit}`),

    getById: (id: string) => axiosInstance.get(`/video/${id}`),

    create: (data: { name: string; link: string }) =>
      axiosInstance.post("/video", data),

  },

  upload: {
    single: (file, onProgress) => {
      const formData = new FormData();
      formData.append("file", file);

      return axiosInstance.post("/upload/single", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;

          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );

          if (onProgress) onProgress(percent);
        },
      });
    },
  },
};
