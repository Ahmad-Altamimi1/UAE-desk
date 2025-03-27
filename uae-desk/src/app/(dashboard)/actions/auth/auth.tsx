"use server";
import { ILogin } from "@/entities/dashboard";
import { AuthService } from "@/lib/api/services/dashboard/auth";
import { z } from "zod";

interface LoginState {
  success: boolean;
  data: {
    password: string;
    email: string;
  };
  error: string | null;
}

export async function handleLogin(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  "use server";

  const validatedFields = z
    .object({
      username: z.string().min(1),
      password: z.string().min(3),
      email: z.string().email(),
    })
    .safeParse({
      username: formData.get("username"),
      password: formData.get("password"),
      email: formData.get("email"),
    });

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid form data",
      data: {
        email: "",
        password: "",
      },
    };
  }

  const rawFormData = {
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  };

  try {
    const loginResponse = await AuthService.login(
      rawFormData as Omit<ILogin, "id">
    );

    return { success: true, data: loginResponse, error: null };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      data: { email: "", password: "" },
    };
  }
}
