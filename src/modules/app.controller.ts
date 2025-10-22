import { IsPublic } from "@/common/decorators/public.decorator";
import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
@IsPublic()
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get("api")
    getHello(): string {
        return this.appService.getHello();
    }
}
