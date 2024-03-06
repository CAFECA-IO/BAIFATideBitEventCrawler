import { Controller, Get, Query } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/events")
  async listEvents(
    @Query()
    query?: {
      begin?: number;
      end?: number;
      beginId?: number;
      endId?: number;
      limit: number;
    }
  ) {
    // Use the 'TideBitEvent' type as the return type
    return this.appService.listEvents(query);
  }
}
