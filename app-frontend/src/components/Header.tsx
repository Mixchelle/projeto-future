"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import "@/styles/Header.css";
import logo from "@/assets/f3smlogo.png";

interface HeaderProps {
  className?: string;
  
}

const Header: React.FC<HeaderProps> = ({className }) => {
  const [pageTitle, setPageTitle] = useState("Home");
  const [timeLeft, setTimeLeft] = useState(45 * 60);
    const router = useRouter();
  const pathname = usePathname();

  // Define o título da página baseado na última parte da rota
  useEffect(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments.length ? pathSegments[pathSegments.length - 1] : "Home";

    // Converte a primeira letra para maiúscula
    const formattedTitle = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    setPageTitle(formattedTitle);
  }, [pathname]);

  // Função para reiniciar o cronômetro
  const resetTimer = () => {
    setTimeLeft(15 * 60); // Reinicia para 15 minutos
  };

  // Monitorar inatividade do usuário
  useEffect(() => {
    const handleUserActivity = () => {
      resetTimer(); // Reinicia o cronômetro ao detectar atividade
    };

    // Event listeners para detectar interações do usuário
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);

    // Limpar event listeners ao desmontar o componente
    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
    };
  }, []);

  // Cronômetro regressivo
  useEffect(() => {
    if (timeLeft <= 0) {
      localStorage.clear(); 
      router.push("/login");
    }
    

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, router]);

  // Formata o tempo para MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <header data-testid="header" className={`header ${className || ""}`} role="banner">
      <div className="header-content">
        {/* Logo e Nome do Sistema */}
        <div className="logo-container">
          <Image src={logo} alt="Logo" width={50} height={50} />
          <div className="titulo">
         <div className="titulo-1">
          <span >FS
          <span className="orange">3</span>  
            M</span>
            </div>
          <span className="system-subname">Future Security Maturity Monitoring & Management</span>
          </div>
        </div>

        {/* Espaçamento entre os elementos */}
        <div className="header-spacer"></div>

        {/* Sessão, Cronômetro e Nome da Página */}
        {/* <div className="session-info">
          <span className="session" aria-hidden="true">Sessão</span>
          <span className="timer" aria-live="polite">{formatTime(timeLeft)}</span>
          <h1 className="page-title">{pageTitle}</h1>
        </div> */}
      </div>
    </header>
  );
};

export default Header;