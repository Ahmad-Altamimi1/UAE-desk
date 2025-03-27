import { ILogin } from "@/entities/dashboard";
import { fetchApi, fetchCUDApi } from "../../serverCore";
import endPoints from "../../endpoints/dashboard";

export const AuthService = {
  login: () => fetchApi<ILogin>("login"),
  getById: (id: number) => fetchApi<ILogin>(`/users/${id}`),
  create: (data: Omit<ILogin, "id">) =>
    fetchCUDAp<ILogin>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  // other methods
};
