import "reflect-metadata";
import { AuthenticationService } from "../../src/service/authentication.service";
import BadCredentialsError from "../../src/service/error/bad-credentials.error";
import { Constant } from "../../src/common/constant.common";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Mocks
jest.mock("jsonwebtoken");
jest.mock("bcrypt");

describe("AuthenticationService", () => {
  let service: AuthenticationService;

  const mockUser = {
    id: "user1",
    email: "teste@email.com",
    name: "Douglas",
    password: "12345",
    role: "PROFESSOR",
  };

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockDbConfig = {
    getClient: () => prismaMock,
  };

  const mockEnvConfig = {
    getStringValue: jest.fn((key: string) => {
      if (key === Constant.JWT_SECRET) return "secret";
      return "";
    }),
  };

  beforeEach(() => {
    service = new AuthenticationService(
      mockDbConfig as any,
      mockEnvConfig as any
    );
    jest.clearAllMocks();
  });

  it("deve autenticar com credenciais válidas e retornar token e usuário", async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mocked-jwt-token");

    const result = await service.authenticate(
      "teste@email.com",
      "validPassword"
    );

    expect(result.error).toBeUndefined();
    expect(result.token).toBe("mocked-jwt-token");
    expect(result.user?.email).toBe("teste@email.com");
    expect(jwt.sign).toHaveBeenCalledWith(
      { sub: mockUser.id, role: mockUser.role },
      "secret",
      { expiresIn: "1d" }
    );
  });

  it("deve retornar erro se o usuário não for encontrado", async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await service.authenticate(
      "notfound@example.com",
      "anyPassword"
    );

    expect(result.error).toBeInstanceOf(BadCredentialsError);
    expect(result.token).toBeUndefined();
    expect(result.user).toBeUndefined();
  });

  it("deve retornar erro se a senha for inválida", async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const result = await service.authenticate(
      "teste@email.com",
      "wrongPassword"
    );

    expect(result.error).toBeInstanceOf(BadCredentialsError);
    expect(result.token).toBeUndefined();
    expect(result.user).toBeUndefined();
  });

  it("deve capturar erros inesperados e retornar o erro", async () => {
    (prismaMock.user.findUnique as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const result = await service.authenticate(
      "teste@email.com",
      "anyPassword"
    );

    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe("DB error");
  });
});
