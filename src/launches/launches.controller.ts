import { Body, Controller, Delete, Post, Put } from "@nestjs/common";
import { LaunchesService } from "./launches.service";


@Controller()
export class LaunchesController {
    constructor(private readonly launchService: LaunchesService) { }

    @Post('launches/')
    async create(@Body() data: any) {
        const { launch, payMethodLaunch, userId } = data;        
        return await this.launchService.createLaunch(launch, payMethodLaunch, userId);
    }

    @Put('launches/:id')
    async update(@Body() data: any, @Body('id') id: string) {
        throw new Error('Method not implemented.');
        // const { launch, payMethodLaunch, userId } = data;
        // return await this.launchService.updateLaunch(launch, payMethodLaunch, userId, id);
    }

    @Delete('launches/:id')
    async delete(@Body('id') id: string) {
        throw new Error('Method not implemented.');
        // return await this.launchService.deleteLaunch(id);
    }
}