"use client";
import { useState } from "react";
import { FiInstagram, FiYoutube, FiGlobe, FiFacebook, FiLinkedin } from "react-icons/fi";

export default function FloatingSocialMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const redesSociais = [
    {
      nome: "Instagram",
      icone: <FiInstagram size={18} />,
      url: "https://www.instagram.com/futuretechbr/",
      cor: "#e1306c"
    },
    {
      nome: "YouTube",
      icone: <FiYoutube size={18} />,
      url: "https://www.youtube.com/channel/UCWajNYhJCLLm6efWmUKOjNg",
      cor: "#ff0000"
    },
    {
      nome: "Site",
      icone: <FiGlobe size={18} />,
      url: "https://future.com.br/",
      cor: "#1e90ff"
    },
    {
      nome: "Facebook",
      icone: <FiFacebook size={18} />,
      url: "https://www.facebook.com/futureonface",
      cor: "#1877f2"
    },
    {
      nome: "LinkedIn",
      icone: <FiLinkedin size={18} />,
      url: "https://www.linkedin.com/company/futuretechnologiesbr",
      cor: "#0a66c2"
    }
  ];

  return (
    <div className="floating-menu">
      <button
        className="floating-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "×" : "+"}
      </button>

      {isOpen && (
        <div className="social-menu">
          <div className="menu-header">Nossas Redes</div>
          <ul className="menu-list">
            {redesSociais.map((rede, index) => (
              <li key={index} className="menu-item">
                <a href={rede.url} target="_blank" rel="noopener noreferrer">
                  <span
                    className="icon-wrapper"
                    style={{ backgroundColor: rede.cor }}
                  >
                    {rede.icone}
                  </span>
                  <span className="icon-label">{rede.nome}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
