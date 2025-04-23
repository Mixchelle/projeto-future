"use client";

import Image from "next/image";
import logo from "@/assets/logo3.png";
import { JSX, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiLogOut } from "react-icons/fi";
import Link from "next/link";
import "@/styles/SideBar.css";
import Header from "./Header";

interface SidebarProps {
  menuItems: { name: string; icon: JSX.Element; path: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<{ name: string; type: string }>({ name: "", type: "" });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          name: parsedUser.nome || "Usuário",
          type: parsedUser.role || "Tipo não definido",
        });
      } catch (error) {
        console.error("Erro ao fazer parse do user no localStorage:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear(); 
    router.push("/login"); 
  };
  

  return (
    <>
      <Header className={isCollapsed ? "collapsed-header" : ""} />

      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`} role="navigation" aria-label="Menu lateral">
        <div className="sidebar-header">
          <button
            className="menu-button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
            aria-expanded={!isCollapsed}
          >
            <FiMenu size={24} aria-hidden="true" />
          </button>
        </div>

        {!isCollapsed && (
          <div className="user-section">
  <Image src={logo} alt="Logo da Empresa" className="user-avatar" width={60} height={60} />
  <p className="user-name" data-testid="user-name">
    {user.name || "Usuário"}
  </p>
  <p className="user-type" data-testid="user-type">
    {user.type || "Tipo não definido"}
  </p>
</div>
        )}

        <nav className="menu-items">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className={`menu-link ${pathname === item.path ? "active" : ""}`}
              aria-current={pathname === item.path ? "page" : undefined}
            >
              {item.icon}
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="logout-section">
          <button
            className="logout-button"
            onClick={handleLogout}
            aria-label="Sair da conta"
          >
            <FiLogOut size={20} aria-hidden="true" />
            {!isCollapsed && <span>Sair</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
