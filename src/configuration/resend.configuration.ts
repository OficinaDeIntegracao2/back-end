import { Resend } from "resend";
import { singleton } from "tsyringe";
import EnvironmentConfiguration from "./environment.configuration";
import { Constant } from "@common/constant.common";

@singleton()
export class ResendConfiguration {
  private readonly client: Resend;

  constructor(
    private readonly environmentConfiguration: EnvironmentConfiguration
  ) {
    const apiKey = this.environmentConfiguration.getStringValue(Constant.RESEND_API_KEY);
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set in environment variables.");
    }
    this.client = new Resend(apiKey);
  }

  getClient(): Resend {
    return this.client;
  }
}