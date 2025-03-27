import { ILogin } from "@/entities/dashboard";
import { fetchCUDApi } from "../../serverCore";

export const AuthService = {
  login: (data: Omit<ILogin, "id">) =>
    fetchCUDApi<ILogin, Omit<ILogin, "id">>("login", "POST", data),
  //   logout: () => fetchCUDApi<ILogin>(`/users/${id}`, "POST"),
};
