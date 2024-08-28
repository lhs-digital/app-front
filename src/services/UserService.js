import api from "./api";

class UserService {
  async login(email, password) {
    try {
      const response = await api.post(`/login`, {
        email,
        password,
      });

      const token = response.data;

      localStorage.setItem("token", token.token);

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
    }
  }
}

// eslint-disable-next-line
export default new UserService();