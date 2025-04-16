import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL = "http://127.0.0.1:8000/api/token/";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // Adicionado estado para o usuário
  const router = useRouter();

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(API_URL, {
        email, 
        password,
      });

      const { access, refresh, user } = response.data; // Extrai os dados da resposta

      // Salva token e dados do usuário
      setToken(access);
      setUser(user); // Armazena os dados do usuário no estado
      
      // Armazena no localStorage
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      // Redireciona com base na role do usuário
      switch(user.role) {
        case "gestor":
          router.push("/gestor");
          break;
        case "funcionario":
          router.push("/analista");
          break;
        case "subcliente":
        case "cliente":
        default:
          router.push("/cliente");
      }

    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, token, user }; // Retorna também o user
}