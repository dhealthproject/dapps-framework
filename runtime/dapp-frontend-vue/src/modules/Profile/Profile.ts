import { BackendService } from "@/service/BackendService";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";

export class Profile extends BackendService {
  public async getMe(): Promise<AxiosResponse<any, any> | undefined> {
    const authHeader = Cookies.get("accessToken");
    if (authHeader) {
      const response = await this.handler.call("GET", this.getUrl("me"), {
        headers: {
          authorization: `Bearer ${authHeader}`,
        },
      });
      return response;
    }
  }
}
