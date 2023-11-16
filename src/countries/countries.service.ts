import { Injectable } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { PrismaService } from 'src/prisma.service';
import { CustomResponser } from 'src/libs/custom-responer';

@Injectable()
export class CountriesService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    const countries = await this.prismaService.country.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    if (countries.length > 0) {
      return CustomResponser({
        devMessage: 'country-list-fetched-successfully',
        message: 'Country list fetched successfully',
        body: countries,
        statusCode: 200,
      });
    } else {
      return CustomResponser({
        devMessage: 'country-list-did-not-fetch-successfully',
        message: 'Country list did not fetch  successfully',
        body: null,
        statusCode: 403,
      });
    }
  }

  async findOne(id: number) {
    const country = await this.prismaService.country.findMany({
      where: {
        id,
      },
    });
    if (country.length > 0) {
      return CustomResponser({
        devMessage: 'country-fetched-successfully',
        message: 'Country  fetched successfully',
        body: country,
        statusCode: 200,
      });
    } else {
      return CustomResponser({
        devMessage: 'country-did-not-fetchsuccessfully',
        message: 'Country did not fetch  successfully',
        body: null,
        statusCode: 403,
      });
    }
  }
}
