import { HttpRequestHandler } from "@/handlers/HttpRequestHandler";

export interface RequestHandler {
  call(method: string, url: string, options: any): Record<string, any>;
}

export class BackendService {
  private static instance: BackendService;

  constructor() {
    return;
  }

  public static getInstance() {
    if (!BackendService.instance) {
      this.instance = new BackendService();
    }
    return this.instance;
  }
  protected baseUrl = "http://localhost:7903";
  protected handler: HttpRequestHandler = new HttpRequestHandler();

  public getUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint.replace("^/", "")}`;
  }
}
