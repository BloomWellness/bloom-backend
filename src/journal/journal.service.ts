import {
  BadRequestException,
  Get,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { CreateJournalDto } from './dto/create-journal.dto';
import { Utilities } from 'src/utils/Utilities';
import { MoodSetRequestBody } from './dto/mood.dto';
import { DateJournalRequestBody } from './dto/datejournal.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/decorator/user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { log } from 'console';
import { MoodCountResponseBody } from './dto/mood-count.dto';
import { JournalResponseBody } from './dto/journal.dto';
import { MoodCountResponseDto } from './dto/mood-count-response.dto';

@Injectable()
export class JournalService {
  utilities: Utilities;
  constructor(private prismaService: PrismaService) {}

  async moodCountMonthWise(user: any, dateJournalRequestBody: DateJournalRequestBody) {
    const userExist = await this.prismaService.user.findFirst({
      where: { email: user.email },
    });
    if (userExist === null) {
      throw new BadRequestException('Token not valid');
    }
    const startOfMonth = new Date(dateJournalRequestBody.date);
    startOfMonth.setDate(1); // Set the date to the first day of the month
    const st = this.formatDateForDatabase(startOfMonth.toISOString());
    
    const end = new Date(startOfMonth); // Create a copy of startOfMonth

    end.setMonth(end.getMonth() + 1); // Move to the next month
    end.setDate(end.getDate() - 1); // Move back one day to get the last day of the current month

    const endOfMonth = this.formatDateForDatabase(end.toISOString());

    log('startOfMonth', st);
    log('endOfMonth', endOfMonth);

    const moodCount = await this.prismaService.mood.groupBy({
      by: ['isMood'], // Group by mood
      where: {
        userId: userExist.id,
        // date: { // Filter by date range
        //   gte: st.toString(),
        //   lte: endOfMonth.toString(),
        // },
      },
      _count: { // Count occurrences within each mood group
        isMood: true, // Alias the count as "count" (optional)
      },
    });
    log('moodCount', moodCount);

    const moodCountResponse :MoodCountResponseBody[] = [];

    moodCount.forEach((each: any) => {
      if (each.isMood === 'HAPPY') {
        const mc = {
          mood: each.isMood,
          count: each._count,
      }
      moodCountResponse.push(mc);
    }
       else if (each.isMood === 'SAD')
       {
        const mc = {
          mood: each.isMood,
          count: each._count,
        }
        moodCountResponse.push(mc);
      }
       else if (each.isMood === 'DEPRESSED') 
       {
        const mc = {
          mood: each.isMood,
          count: each._count,
        }
        moodCountResponse.push(mc);
      } 
      else if (each.isMood === 'OK') 
      {
        const mc = {
          mood: each.isMood,
          count: each._count,
        }
        moodCountResponse.push(mc);
      }
    });
    const moodResponseBody: MoodCountResponseDto = {
      moodcount: moodCountResponse,
    }
    // return moodCountResponse;
    return moodResponseBody
  
  }

    formatDateForDatabase(dateTimeString: string) {
    // Split the string at 'T'
    const parts = dateTimeString.split('T');
    // Remove trailing 'Z' from the date part
    const datePart = parts[0].slice(0, -1);
    // Replace 'T' with a space (or your desired separator)
    const timePart = parts[1].replace('Z', '');
    return `${datePart} ${timePart}`;
  }

  async setMood(moodSetRequestBody: MoodSetRequestBody, user: any) {
   
    const userExist = await this.prismaService.user.findFirst({
      where: { email: user.email },
    });
    if (userExist === null) {
      throw new BadRequestException('Token not valid');
    }
    
    const todayMood = await this.prismaService.mood.findFirst({
      where: {
        userId: userExist.id,
        date:{lte : moodSetRequestBody.date} ,
      },
    });
    
    if (todayMood !== null) {
      await this.prismaService.mood.update({
        where: { id: todayMood.id },
        data: {
          ...todayMood,
          isMood: String(moodSetRequestBody.mood),
        },
      });
      return true;
    } else {
      // const userId: string = String(userExist.id);
    
      const newMood = await this.prismaService.mood.create({
        data: {
          userId: userExist.id,
          date: moodSetRequestBody.date,
          isMood: moodSetRequestBody.mood,
          },
        });

      return true;
    }
  }

  async create(createJournalDto: CreateJournalDto, userInfo: any) {
    log('createJournalDto', createJournalDto)
    const user = await this.prismaService.user.findFirst({
      where: { email: userInfo.email },
    });
    if (user === null) {
      throw new BadRequestException(this.utilities.LOGIN_ERROR);
    }
    const startOfDay = new Date(createJournalDto.date);
    startOfDay.setHours(0, 0, 0, 0);
    log('startOfDay', startOfDay)
    if (createJournalDto.sources_of_hope !== null) {
      const sourcesOfHopeExist = await this.prismaService.journal.findFirst({
        where: {
          userId: user.id,
          strategyType: 'SOURCES_OF_HOPE',
          date: startOfDay,
        },
      });
      console.log('sourcesOfHopeExist', sourcesOfHopeExist)
      if (sourcesOfHopeExist !== null) {
        await this.prismaService.journal.update({
          where: { id: sourcesOfHopeExist.id },
          data: {
            ...sourcesOfHopeExist,
            description: createJournalDto.sources_of_hope,
            image: createJournalDto.sources_of_hope_image,
          },
        });
      }else{
        await this.prismaService.journal.create({
          data: {
            userId: user.id,
            strategyType: 'SOURCES_OF_HOPE',
            description: createJournalDto.sources_of_hope,
            image: createJournalDto.sources_of_hope_image,
            // date: createJournalDto.date,
            date: startOfDay,
          },
        });
      }
    }

    if (createJournalDto.helpful_activites !== null) {
      const helpfulActivitiesExist = await this.prismaService.journal.findFirst(
        {
          where: {
            userId: user.id,
            strategyType: 'HELPFUL_ACTIVITES',
            date: startOfDay,
          },
        },
      );
      if (helpfulActivitiesExist !== null) {
        await this.prismaService.journal.update({
          where: { id: helpfulActivitiesExist.id },
          data: {
            ...helpfulActivitiesExist,
            description: createJournalDto.helpful_activites,
            image: createJournalDto.helpful_activites_image,
          },
        });
      }
      else{

        await this.prismaService.journal.create({
          data: {
            userId: user.id,
            strategyType: 'HELPFUL_ACTIVITES',
            description: createJournalDto.helpful_activites,
            image: createJournalDto.helpful_activites_image,
            // date: createJournalDto.date,
            date: startOfDay,
          },
        });
      }
    }

    if (createJournalDto.self_care_strategies !== null) {
      const selfCareStrategiesExist =
        await this.prismaService.journal.findFirst({
          where: {
            userId: user.id,
            strategyType: 'SELF_CARE_STRATEGIES',
            date: startOfDay,
          },
        });
      if (selfCareStrategiesExist !== null) {
        await this.prismaService.journal.update({
          where: { id: selfCareStrategiesExist.id },
          data: {
            ...selfCareStrategiesExist,
            description: createJournalDto.self_care_strategies,
            image: createJournalDto.self_care_strategies_image,
          },
        });
      } else{
        await this.prismaService.journal.create({
          data: {
            userId: user.id,
            strategyType: 'SELF_CARE_STRATEGIES',
            description: createJournalDto.self_care_strategies,
            image: createJournalDto.self_care_strategies_image,
            // date: createJournalDto.date,
            date: startOfDay,
          },
        });
      }
    }


    if (createJournalDto.red_flags !== null) {
      const redFlagsExist = await this.prismaService.journal.findFirst({
        where: {
          userId: user.id,
          strategyType: 'RED_FLAGS',
          date: startOfDay,
        },
      });
      if (redFlagsExist !== null) {
        await this.prismaService.journal.update({
          where: { id: redFlagsExist.id },
          data: {
            ...redFlagsExist,
            description: createJournalDto.red_flags,
            image: createJournalDto.red_flags_image,
          },
        });
      }
      else{
        await this.prismaService.journal.create({
          data: {
            userId: user.id,
            strategyType: 'RED_FLAGS',
            description: createJournalDto.red_flags,
            image: createJournalDto.red_flags_image,
            // date: createJournalDto.date,
            date: startOfDay,
          },
        });
      }
    }
    return {true: true};
  }

  async specificDateJournal(dateJournalRequestBody: DateJournalRequestBody, user: any) {
    const isUserExist = await this.prismaService.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (isUserExist === null) {
      throw new BadRequestException('User not found');
    }
    const startOfDay = new Date(dateJournalRequestBody.date);
    startOfDay.setHours(0, 0, 0, 0);

    const source_of_hope = await this.prismaService.journal.findFirst({
      where: {
        userId: isUserExist.id,
        strategyType: 'SOURCES_OF_HOPE',
        date: startOfDay,
      }
    });

    const helpful_activites = await this.prismaService.journal.findFirst({
      where: {
        userId: isUserExist.id,
        strategyType: 'HELPFUL_ACTIVITES',
        date: startOfDay,
      }
    });

    const red_flags = await this.prismaService.journal.findFirst({
      where: {
        userId: isUserExist.id,
        strategyType: 'RED_FLAGS',
        date: startOfDay,
      }
    });

    const self_care_strategies = await this.prismaService.journal.findFirst({
      where: {
        userId: isUserExist.id,
        strategyType: 'SELF_CARE_STRATEGIES',
        date: startOfDay,
      }
    }); 

    const journalList = {
      sources_of_hope: source_of_hope != null ? source_of_hope.description : 'No sources of hope found',
      sources_of_hope_image: source_of_hope != null ? source_of_hope.image : 'No image found',
      helpful_activites: helpful_activites != null ? helpful_activites.description : 'No helpful activites found',
      helpful_activites_image: helpful_activites != null ? helpful_activites.image : 'No image found',
      red_flags: red_flags != null ? red_flags.description : 'No red flags found',
      red_flags_image: red_flags != null ? red_flags.image : 'No image found',
      self_care_strategies: self_care_strategies != null ? self_care_strategies.description : 'No self care strategies found',
      self_care_strategies_image: self_care_strategies != null ? self_care_strategies.image : 'No image found',
      date : dateJournalRequestBody.date
    };
    
    return journalList;
  }

  async findJournalHighlight(user: any, dateJournal: DateJournalRequestBody) {
    const isUserExist = await this.prismaService.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (isUserExist === null) {
      throw new BadRequestException('User not found');
    }
    log(isUserExist.id)
    const startOfMonth = new Date(dateJournal.date);

    const sohjournals = await this.prismaService.journal.findMany({
      where: {
        userId: isUserExist.id,
        strategyType: 'SOURCES_OF_HOPE',
        date: {
          gt: startOfMonth,
        },
      }
    });

    if (sohjournals.length !== 0) 
    {
      sohjournals.sort(() => Math.random() - 0.5);
      var randomSourceOfHope = sohjournals[0];
    }

    const redflagsJournals = await this.prismaService.journal.findMany({
      where: {
        userId: isUserExist.id,
        strategyType: 'RED_FLAGS',
        date: {
          gt: startOfMonth,
        },
      }
    });

    if(redflagsJournals.length !== 0){
    redflagsJournals.sort(() => Math.random() - 0.5);
    var randomRedFlags = redflagsJournals[0];}

    const selfCareStrategiesJournals = await this.prismaService.journal.findMany({
      where: {
        userId: isUserExist.id,
        strategyType: 'SELF_CARE_STRATEGIES',
        date: {
          gt: startOfMonth,
        },
      }
    });

    if(selfCareStrategiesJournals.length !== 0){
    selfCareStrategiesJournals.sort(() => Math.random() - 0.5);
    var randomSelfCareStrategies = selfCareStrategiesJournals[0];}

    const helpfulActivitesJournals = await this.prismaService.journal.findMany({
      where: {
        userId: isUserExist.id,
        strategyType: 'HELPFUL_ACTIVITES',
        date: {
          gt: startOfMonth,
        },
      }
    });

    if(helpfulActivitesJournals.length !== 0){
    helpfulActivitesJournals.sort(() => Math.random() - 0.5);
    var randomHelpfulActivites = helpfulActivitesJournals[0];}

// ################################## FIX THIS ########################################
      log('randomSourceOfHope', randomSourceOfHope)
      log('randomRedFlags', randomRedFlags)
      log('randomSelfCareStrategies', randomSelfCareStrategies)
      log('randomHelpfulActivites', randomHelpfulActivites)
// ################################## FIX THIS ########################################
    const journalResponse =
      {
        "sources_of_hope": {
        'description': randomSourceOfHope != null && randomSourceOfHope.description ? randomSourceOfHope.description : 'No sources of hope found',
        'image': randomSourceOfHope != null && randomSourceOfHope.image ? randomSourceOfHope.image : 'No image found',
        'date': randomSourceOfHope != null && randomSourceOfHope.date ? randomSourceOfHope.date : 'No date found'
        },
        "red_flags": {
          'description': randomRedFlags != null && randomRedFlags.description ? randomRedFlags.description : 'No red flags found',
          'image': randomRedFlags != null && randomRedFlags.image ? randomRedFlags.image : 'No image found',
          'date': randomRedFlags != null && randomRedFlags.date ? randomRedFlags.date : 'No date found'
        },
        "self_care_strategies": {
          'description': randomSelfCareStrategies != null && randomSelfCareStrategies.description ? randomSelfCareStrategies.description : 'No self care strategies found',
          'image': randomSelfCareStrategies != null && randomSelfCareStrategies.image ? randomSelfCareStrategies.image : 'No image found',
          'date': randomSelfCareStrategies != null && randomSelfCareStrategies.date ? randomSelfCareStrategies.date : 'No date found'
        },
        "helpful_activites": {
          'description': randomHelpfulActivites != null && randomHelpfulActivites.description ? randomHelpfulActivites.description : 'No helpful activites found',
          'image': randomHelpfulActivites != null && randomHelpfulActivites.image ? randomHelpfulActivites.image : 'No image found',
          'date': randomHelpfulActivites != null && randomHelpfulActivites.date ? randomHelpfulActivites.date : 'No date found'
        } 
      }

    return journalResponse;
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async me(@User() user) {
    console.log(user);
  }
}
