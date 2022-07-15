import { BackendService } from "@/service/BackendService";
import { AxiosResponse } from "axios";

export class Auth extends BackendService {
  public async getAuthChallenge(): Promise<
    AxiosResponse<any, any> | undefined
  > {
    const res = await this.handler.call(
      "GET",
      this.getUrl("auth/challenge"),
      {}
    );
    console.log(res);
    return res;
  }

  public async login(config: {
    authCode: string;
    address: string;
  }): Promise<AxiosResponse<any, any> | undefined> {
    const { authCode, address } = config;
    const res = await this.handler.call("POST", this.getUrl("auth/token"), {
      authCode,
      address,
    });
    return res;
  }
}
