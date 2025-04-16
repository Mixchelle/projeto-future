"use client";
import { useState, useEffect } from "react";
import { useLogin } from "@/hooks/useLogin"; // Importando o hook de login
import { useRouter } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa"; 
import Image from "next/image";
import logoGRande from '@/assets/Logo Vertical - Branco.png';
import fs3mLogo from '@/assets/f3smlogo.png';

export default function LoginPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [email, setEmail] = useState("cliente@example.com");
  const [password, setPassword] = useState("123456");
  const { login, loading, error } = useLogin(); // Hook de login
  const router = useRouter();



  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <main className="login-main-container">
      <div className={`login-container ${isMobile ? "mobile" : ""}`}>
        {/* Lado do Formulário */}
        <section className="form-section">
          <Image className="logo-pequeno" src={fs3mLogo} alt="logo fs3m" />
          <div className="brand-header">
            <h1>
              <span className="letter">F</span>
              <span className="letter">S</span>
              <span className="letter-3">3</span>
              <span className="letter">M</span>
            </h1>
            <p className="system-description">
              Future Security Maturity Monitoring & Management
            </p>
          </div>

          {/* Formulário de Login */}
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input 
                type="password" 
                placeholder="Senha" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            {/* Exibir erro se houver */}
            {error && <p className="error-message">{error}</p>}

            {/* Botão "Esqueceu a Senha?" */}
            <div className="forgot-password-container">
              <button className="forgot-password-btn">Esqueceu a senha?</button>
            </div>

            <div className="divider"></div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Entrando..." : "Login"}
            </button>
          </form>
        </section>

        {/* Lado do Branding (Só aparece em telas maiores) */}
        {!isMobile && (
          <section className="brand-section">
            <Image className="logo-direita" src={logoGRande} alt="logo da future" />
          </section>
        )}
      </div>
    </main>
  );
}
