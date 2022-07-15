import axios from "axios";

export class HttpRequestHandler {
  public call(method: string, url: string, options: any) {
    try {
      if (method === "GET") {
        return axios.get(url, options);
      }
      // POST
      if (method === "POST") {
        return axios({
          method: method.toLowerCase(),
          url,
          data: {
            ...options,
          },
        });
      }
    } catch (err) {
      console.log("Request failed: ", err);
      throw err;
    }
  }
}
