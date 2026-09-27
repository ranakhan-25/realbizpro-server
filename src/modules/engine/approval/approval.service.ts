import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpClientService } from '../../../common/services/http-client.service';

@Injectable()
export class ApprovalService {
  private readonly engineApiUrl: string;

  constructor(
    private readonly httpClient: HttpClientService,
    private readonly configService: ConfigService,
  ) {
    this.engineApiUrl =
      this.configService.get<string>(
        'ENGINE_SERVICE_URL',
      );
  }

  /**
   * Approve a pending approval request
   * @param requestId - The approval request ID
   * @param comments - Optional comments
   * @param bearerToken - JWT bearer token for authentication
   */
  async approveRequest(
    requestId: number,
    userId: number,
    comments?: string,
  ) {
    const url = `${this.engineApiUrl}/api/v1/approvals/approve`;

    return await this.httpClient.post(
      url,
      { requestId, comments },
      userId,
    );
  }

  /**
   * Reject a pending approval request
   * @param requestId - The approval request ID
   * @param comments - Optional comments
   * @param bearerToken - JWT bearer token for authentication
   */
  async rejectRequest(
    requestId: number,
    userId: number,
    comments?: string,
  ) {
    const url = `${this.engineApiUrl}/api/v1/approvals/reject`;

    return await this.httpClient.post(
      url,
      { requestId, comments },
      userId,
    );
  }
}
