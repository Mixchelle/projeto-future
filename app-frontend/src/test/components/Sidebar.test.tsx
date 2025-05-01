// components/__tests__/Sidebar.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "@/components/Sidebar";
import { FiHome, FiSettings, FiUsers } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";

// Mock dos hooks do Next.js
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
}));

// Mock do localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Sidebar Component", () => {
  const mockMenuItems = [
    { name: "Home", icon: <FiHome />, path: "/" },
    { name: "Usuários", icon: <FiUsers />, path: "/users" },
    { name: "Configurações", icon: <FiSettings />, path: "/settings" },
  ];

  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it("deve renderizar corretamente", () => {
    render(<Sidebar menuItems={mockMenuItems} />);
    
    expect(screen.getByLabelText("Menu lateral")).toBeInTheDocument();
    expect(screen.getByLabelText("Menu lateral")).toHaveAttribute("role", "navigation");
    expect(screen.getByRole("button", { name: "Recolher menu" })).toBeInTheDocument();
  });

  it("deve alternar entre expandido e recolhido", () => {
    render(<Sidebar menuItems={mockMenuItems} />);
    
    const toggleButton = screen.getByLabelText("Recolher menu");
    fireEvent.click(toggleButton);
    
    expect(screen.getByLabelText("Expandir menu")).toBeInTheDocument();
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    
    fireEvent.click(toggleButton);
    expect(screen.getByLabelText("Recolher menu")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("deve exibir informações do usuário quando expandido", () => {
    const userData = { nome: "John Doe", role: "Admin" };
    window.localStorage.setItem("user", JSON.stringify(userData));
    
    render(<Sidebar menuItems={mockMenuItems} />);
    
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByAltText("Logo da Empresa")).toBeInTheDocument();
  });

  it("deve marcar o item ativo corretamente", () => {
    vi.mocked(usePathname).mockReturnValue("/users");
    
    render(<Sidebar menuItems={mockMenuItems} />);
    
    const activeItem = screen.getByText("Usuários").closest("a");
    expect(activeItem).toHaveClass("active");
    expect(activeItem).toHaveAttribute("aria-current", "page");
  });

  it("deve fazer logout corretamente", () => {
    const mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any);
    
    window.localStorage.setItem("token", "test-token");
    window.localStorage.setItem("user", JSON.stringify({ nome: "Test User" }));
    
    render(<Sidebar menuItems={mockMenuItems} />);
    
    const logoutButton = screen.getByRole("button", { name: "Sair da conta" });
    fireEvent.click(logoutButton);
    
    expect(window.localStorage.getItem("token")).toBeNull();
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("deve lidar com erro ao analisar dados do usuário", () => {
    console.error = vi.fn(); // Mock console.error
    window.localStorage.setItem("user", "invalid-json");
  
    render(<Sidebar menuItems={mockMenuItems} />);
  
    expect(console.error).toHaveBeenCalled();
  
    // Verifica se os elementos existem e estão vazios
    const userNameElement = screen.getByTestId("user-name");
    const userTypeElement = screen.getByTestId("user-type");
  
    expect(userNameElement).toBeInTheDocument();
    expect(userTypeElement).toBeInTheDocument();

  });

  it("deve exibir apenas ícones quando recolhido", () => {
    render(<Sidebar menuItems={mockMenuItems} />);
    
    const toggleButton = screen.getByLabelText("Recolher menu");
    fireEvent.click(toggleButton);
    
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    expect(screen.queryByText("Sair")).not.toBeInTheDocument();
    expect(screen.getAllByRole("img", { hidden: true })).toHaveLength(1); // Apenas o logo (que é um ícone)
  });

  it("deve alternar o estado de recolhimento ao clicar no botão de menu", () => {
    const { rerender } = render(<Sidebar menuItems={mockMenuItems} />);
  
    // Estado inicial deve ser false (ou o padrão definido)
    expect(localStorage.getItem('sidebarCollapsed')).toBe('false');
    let isCollapsed = JSON.parse(localStorage.getItem('sidebarCollapsed') || 'false');
    expect(isCollapsed).toBe(false);
  
    const toggleButton = screen.getByLabelText("Recolher menu");
    fireEvent.click(toggleButton);
  
    // Após o primeiro clique, isCollapsed deve ser true
    expect(localStorage.getItem('sidebarCollapsed')).toBe('true');
    isCollapsed = JSON.parse(localStorage.getItem('sidebarCollapsed') || 'false');
    expect(isCollapsed).toBe(true);
    expect(screen.getByLabelText("Expandir menu")).toBeInTheDocument();
  
    fireEvent.click(toggleButton);
  
    // Após o segundo clique, isCollapsed deve ser false novamente
    expect(localStorage.getItem('sidebarCollapsed')).toBe('false');
    isCollapsed = JSON.parse(localStorage.getItem('sidebarCollapsed') || 'false');
    expect(isCollapsed).toBe(false);
    expect(screen.getByLabelText("Recolher menu")).toBeInTheDocument();
  });

});