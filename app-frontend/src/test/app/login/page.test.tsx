import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useLogin";

// Mock do useRouter
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock do hook de login
vi.mock("@/hooks/useLogin", () => ({
  useLogin: vi.fn(),
}));

// Mock do componente Image do Next.js
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // Ignora a validação de width/height para testes
    return <img {...props} />;
  },
}));

describe("LoginPage", () => {
  const mockPush = vi.fn();
  const mockLogin = vi.fn();
  
  beforeEach(() => {
    (useRouter as unknown as vi.Mock).mockReturnValue({ push: mockPush });
    
    // Mock básico do hook
    (useLogin as vi.Mock).mockReturnValue({
      login: mockLogin,
      loading: false,
      error: "",
      token: null,
      user: null,
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renderiza corretamente o formulário de login", () => {
    render(<LoginPage />);
    
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText("Future Security Maturity Monitoring & Management")).toBeInTheDocument();
  });

  it("atualiza os campos de email e senha", () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("Email") as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText("Senha") as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "teste@exemplo.com" } });
    fireEvent.change(passwordInput, { target: { value: "minhasenha" } });

    expect(emailInput.value).toBe("teste@exemplo.com");
    expect(passwordInput.value).toBe("minhasenha");
  });

  it("chama a função de login ao enviar o formulário", async () => {
    render(<LoginPage />);
    const button = screen.getByRole("button", { name: /login/i });

    fireEvent.click(button);

    expect(mockLogin).toHaveBeenCalledWith("cliente@example.com", "123456");
  });

  it("exibe a mensagem de erro quando há erro no login", () => {
    (useLogin as vi.Mock).mockReturnValue({
      login: mockLogin,
      loading: false,
      error: "Credenciais inválidas",
      token: null,
      user: null,
    });

    render(<LoginPage />);
    expect(screen.getByText("Credenciais inválidas")).toBeInTheDocument();
  });

  it("desabilita o botão de login quando loading está ativo", () => {
    (useLogin as vi.Mock).mockReturnValue({
      login: mockLogin,
      loading: true,
      error: "",
      token: null,
      user: null,
    });

    render(<LoginPage />);
    const button = screen.getByRole("button", { name: /entrando/i });
    expect(button).toBeDisabled();
  });

  it("não mostra a imagem do lado direito em telas mobile", () => {
    // Simula uma largura de tela de celular
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));
    
    render(<LoginPage />);
    expect(screen.queryByAltText("logo da future")).not.toBeInTheDocument();
  });

  it("mostra a imagem do lado direito em telas grandes", () => {
    // Simula uma largura de tela grande
    global.innerWidth = 1200;
    global.dispatchEvent(new Event('resize'));
    
    render(<LoginPage />);
    expect(screen.getByAltText("logo da future")).toBeInTheDocument();
  });
});