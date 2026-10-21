import { AuthProvider } from "react-admin";

export const authProvider: AuthProvider = {
  // called when the user attempts to log in
  async login({ username, password }) {
    //^ username = matricula -> password = clave de la materia
    if (username !== "123" || password !== "123") {
      throw new Error("auth.login_failed");
    }
    if (false) {
      throw new Error("auth.invalid_credentials");
    }
    localStorage.setItem("username", username);
  },
  // called when the user clicks on the logout button
  async logout() {
    localStorage.removeItem("username");
  },
  // called when the API returns an error
  async checkError({ status }: { status: number }) {
    if (status === 401 || status === 403) {
      localStorage.removeItem("username");
      throw new Error("auth.session_expired");
    }
  },
  // called when the user navigates to a new location, to check for authentication
  async checkAuth() {
    if (!localStorage.getItem("username")) {
      throw new Error("auth.auth_required");
    }
  },
};
