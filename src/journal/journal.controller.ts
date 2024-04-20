import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JournalService } from './journal.service';
import { CreateJournalDto } from './dto/create-journal.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/decorator/user.decorator';
import { MoodSetRequestBody } from './dto/mood.dto';
import { DateJournalRequestBody } from './dto/datejournal.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @UseGuards(JwtGuard)
  @Post('mood')
  async setMood(@User() user, @Body() moodSetRequestBody: MoodSetRequestBody) {
    return await this.journalService.setMood(moodSetRequestBody, user);
  }

  @UseGuards(JwtGuard)
  @Post('mood-progress')
  async moodCountMonthWise(@User() user, @Body() dateJournalRequestBody: DateJournalRequestBody){
    return await this.journalService.moodCountMonthWise(user, dateJournalRequestBody);
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(@User() user, @Body() createJournalDto: CreateJournalDto) {
    return await this.journalService.create(createJournalDto, user);
  }

  @UseGuards(JwtGuard)
  @Post('date-journals')
  async specificDateJournal(@User() user, @Body() dateJournalRequestBody: DateJournalRequestBody) {
    return await this.journalService.specificDateJournal(dateJournalRequestBody, user);
  }

  @UseGuards(JwtGuard)
  @Post('journal-highlight')
  async findJournalHighlight(
    @User() user,
    @Body() dateJournal: DateJournalRequestBody,
  ) {
    return await this.journalService.findJournalHighlight(user, dateJournal);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async me(@User() user) {
    console.log(user);
    return 'ok';
  }
}
