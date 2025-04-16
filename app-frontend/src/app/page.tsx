"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verifica se está no cliente antes de acessar localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");
      
      if (token && userString) {
        try {
          const user = JSON.parse(userString);
          
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
        } catch (error) {
          console.error("Error parsing user data:", error);
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    }
  }, [router]);

  // Mostra uma tela de carregamento enquanto verifica o login
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        Verificando autenticação...
      </h1>
    </div>
  );
}