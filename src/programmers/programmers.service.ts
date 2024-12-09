import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserData } from '../interface/programmers.interface';

@Injectable()
export class ProgrammersService {
  private readonly PROGRAMMERS_SIGN_IN_URL: string;
  private readonly PROGRAMMERS_RECORD_URL: string;
  private readonly PROGRAMMERS_ID: string;
  private readonly PROGRAMMERS_PW: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.PROGRAMMERS_SIGN_IN_URL =
      'https://programmers.co.kr/api/v1/account/sign-in';
    this.PROGRAMMERS_RECORD_URL =
      'https://programmers.co.kr/api/v1/users/record';
    this.PROGRAMMERS_ID =
      this.configService.get<string>('PROGRAMMERS_ID') || '';
    this.PROGRAMMERS_PW =
      this.configService.get<string>('PROGRAMMERS_PW') || '';
  }

  async signInProgrammers(): Promise<string[]> {
    try {
      const response = await this.httpService.axiosRef.post(
        this.PROGRAMMERS_SIGN_IN_URL,
        { user: { email: this.PROGRAMMERS_ID, password: this.PROGRAMMERS_PW } },
      );

      return response.headers['set-cookie'];
    } catch (error) {
      console.log('Failed to sign in: ', error);
    }
  }

  async getProgrammersRecordInfo(): Promise<UserData> {
    const cookie: string[] = await this.signInProgrammers();

    try {
      const response = await this.httpService.axiosRef.get(
        this.PROGRAMMERS_RECORD_URL,
        {
          headers: {
            Cookie: cookie.join(';'),
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log('Failed to data fatch: ', error);
    }
  }
}
