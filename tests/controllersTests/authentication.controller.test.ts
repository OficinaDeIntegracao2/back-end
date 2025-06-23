import "reflect-metadata";
import AuthenticationController from "../../src/controller/authentication.controller";
import { AuthenticationService } from "../../src/service/authentication.service";
import { Request, Response } from "express";
import { HttpStatus } from "../../src/common/http-status.common";

describe("AuthenticationController", () => {
  let controller: AuthenticationController;
  let mockAuthService: jest.Mocked<AuthenticationService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    mockAuthService = {
      authenticate: jest.fn(),
    } as unknown as jest.Mocked<AuthenticationService>;

    controller = new AuthenticationController(mockAuthService);

    sendMock = jest.fn();
    statusMock = jest.fn(() => ({ send: sendMock })) as any;

    res = {
      status: statusMock,
    };
  });

  it("must return 201", async () => {
    req = {
      body: {
        email: "doug@test.com",
        password: "123456",
      },
    };

    const user = {
      id: "1",
      email: "doug@test.com",
      name: "douglas",
      role: "PROFESSOR",
    };

    const token = "jwt-token-123";

    mockAuthService.authenticate.mockResolvedValue({
      user,
      token,
    });

    await controller.login(req as Request, res as Response);

    expect(mockAuthService.authenticate).toHaveBeenCalledWith(
      "doug@test.com",
      "123456"
    );
    expect(statusMock).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(sendMock).toHaveBeenCalledWith({ user, token });
  });

  it("must return 400", async () => {
    req = {
      body: {
        email: "mateus@email.com",
        password: "aaaa",
      },
    };

    const error = new Error("Invalid email or password");

    mockAuthService.authenticate.mockResolvedValue({ error });

    await controller.login(req as Request, res as Response);

    expect(mockAuthService.authenticate).toHaveBeenCalledWith(
      "mateus@email.com",
      "aaaa"
    );
    expect(statusMock).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(sendMock).toHaveBeenCalledWith({ error: error.message });
  });
});
