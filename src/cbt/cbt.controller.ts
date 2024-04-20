import { Controller, Get, Post, Body, UseGuards} from '@nestjs/common';
import { CbtService } from './cbt.service';
import { CreateCbtDto } from './dto/create-cbt.dto';
import { RateCbtDto } from './dto/rate-cbt.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('cbt')
export class CbtController {
  constructor(private readonly cbtService: CbtService) {}

  @Get('all-cbt-methods')
   async getAllCBTMethods() {
    return this.cbtService.getAllCBTMethods();
  }

  @Post()
  async create(@Body() createCbtDto: CreateCbtDto) {
    return this.cbtService.createCBTMethod(createCbtDto);
  }
  
  @Post('rate-cbt')
  async rateCBT(@Body() rateCBTDto: RateCbtDto) {
    return await this.cbtService.rateCbtMethod(rateCBTDto);
  }

}
