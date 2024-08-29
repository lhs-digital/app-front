import api from "./api";

class UserService {
  async login(email, password, rememberMe) {
    try {
      const response = await api.post(`/login`, {
        email,
        password,
      });

      const token = response.data;

      if (rememberMe) {
        localStorage.setItem("token", token.token);
        localStorage.setItem("rememberMe", rememberMe);

        const expiresAt = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
        localStorage.setItem("expiresAt", expiresAt);
      } else {
        localStorage.setItem("token", token.token);
      }

      return response.data;
    } catch (error) {
      console.error("Login falhou:", error);
      throw error;
    }
  }

  async logout() {
    try {
      await api.post(`/logout`);
    } catch (error) {
      console.error("Logout falhou:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("expiresAt");
    }
  }
}

// eslint-disable-next-line
export default new UserService();