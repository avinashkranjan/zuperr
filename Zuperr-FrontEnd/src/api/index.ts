import { BACKEND_API_URL } from "@src/lib/config";
import axios, { AxiosRequestConfig } from "axios";

const axiosClient = axios.create({
  baseURL: `${BACKEND_API_URL}/api`,
});
// Response interceptor to handle invalid token
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data.message === "Invalid Token") {
      window.location.href = "/signin";
      localStorage.clear();
    }
    return Promise.reject(error);
  }
);

const get = async <T>(URL: string): Promise<T> => {
  const authToken = localStorage.getItem("authToken");
  return axiosClient
    .get<T>(URL, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((response) => response.data);
};

const post = async <T>(URL: string, payload: object | FormData): Promise<T> => {
  const authToken = localStorage.getItem("authToken");

  const isFormData = payload instanceof FormData;

  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${authToken}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
  };

  return axiosClient
    .post<T>(URL, payload, config)
    .then((response) => response.data);
};

const put = async <T>(URL: string, payload: object): Promise<T> => {
  const authToken = localStorage.getItem("authToken");
  return axiosClient
    .put<T>(URL, payload, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((response) => response.data);
};

const patch = async <T>(URL: string, payload: object): Promise<T> => {
  const authToken = localStorage.getItem("authToken");
  return axiosClient
    .patch<T>(URL, payload, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((response) => response.data);
};

const remove = async <T>(URL: string): Promise<T> => {
  const authToken = localStorage.getItem("authToken");
  return axiosClient
    .delete<T>(URL, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((response) => response.data);
};

export { get, post, put, patch, remove };
