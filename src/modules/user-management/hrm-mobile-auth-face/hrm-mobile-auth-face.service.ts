import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  InjectConnection,
  InjectModel,
} from '@nestjs/sequelize';
import { AxiosError } from 'axios';
import FormData from 'form-data';
import { firstValueFrom } from 'rxjs';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateHrmMobileAuthFaceDto } from './dto/create-hrm-mobile-auth-face.dto';
import { VerifyFaceAttendanceDto } from './dto/verify-face-attendance.dto';
import type {
  AttendanceVerificationResult,
  AttendanceLocationResult,
  FaceEmbeddingResult,
  FaceImageUploadResult,
  FaceRegistrationResponse,
  FaceVerificationResult,
  ForwardAuthContext,
} from './interfaces/face-auth.interface';
import {
  FACE_AUTH_ALLOWED_MIME_TYPES,
  FACE_AUTH_EXTERNAL_AUTHENTICATE_ENDPOINT,
  FACE_AUTH_EXTERNAL_TIMEOUT_MS,
  FACE_AUTH_MAX_IMAGES,
  FACE_AUTH_MIN_IMAGES,
} from './face-auth.constants';
import { StatusEnum } from '@/database/enum/status.enum';

export enum AttendanceDayStatusEnum {
  PRESENT = 'PRESENT',
  LATE_PRESENT = 'LATE_PRESENT',
  ABSENT = 'ABSENT',
}

export enum HrmAttendanceDeviceDataSourceEnum {
  MOBILE = 'MOBILE',
  DEVICE = 'DEVICE',
}

export type HrmMobileAuthUser = any;
export type HrmEmployee = any;
export type HrmOfficeTime = any;
export type HrmAttendanceDeviceData = any;

type AttendancePunchHistoryItem = {
  punchTime: string;
  latitude?: string | null;
  longitude?: string | null;
  locationName?: string | null;
  attendanceSourceType?: string | null;
};

type MobileAttendancePunchResult = {
  attendance: any | null;
  punchType: 'IN' | 'OUT';
  lateMinutes: number;
  earlyOutMinutes: number;
  overtimeMinutes: number;
};

const FACE_AUTH_ENROLL_TOKEN =
  'Q8mX2Lp9Vn4Kz7RwT1Hy5Jc6Df3BaEsU';
const FACE_AUTH_API_KEY_HEADER = 'X-API-Key';
const FACE_AUTH_ENROLL_ENDPOINT = '/api/enroll';

@Injectable()
export class HrmMobileAuthFaceService {
  private readonly logger = new Logger(
    HrmMobileAuthFaceService.name,
  );
  private readonly externalFaceAuthBaseUrl: string;
  private readonly externalFaceAuthAuthenticateEndpoint: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {
    const configuredFaceAuthBaseUrl =
      this.configService
        .get<string>(
          'FACE_AUTH_EXTERNAL_BASE_URL',
        )
        ?.trim();
    const configuredPythonAiBaseUrl =
      this.configService
        .get<string>('PYTHON_AI_BASE_URL')
        ?.trim();

    this.externalFaceAuthBaseUrl =
      this.normalizeBaseUrl(
        configuredFaceAuthBaseUrl ||
          'http://217.217.248.182:8000',
        'FACE_AUTH_EXTERNAL_BASE_URL',
      );
    this.externalFaceAuthAuthenticateEndpoint =
      this.configService
        .get<string>(
          'FACE_AUTH_EXTERNAL_AUTHENTICATE_ENDPOINT',
        )
        ?.trim() ||
      FACE_AUTH_EXTERNAL_AUTHENTICATE_ENDPOINT;

    if (!configuredFaceAuthBaseUrl) {
      this.logger.warn(
        `FACE_AUTH_EXTERNAL_BASE_URL is not set; using default ${this.externalFaceAuthBaseUrl}. PYTHON_AI_BASE_URL=${configuredPythonAiBaseUrl || 'unset'}`,
      );
    }

    this.logger.log(
      `Face auth config resolved: baseUrl=${this.externalFaceAuthBaseUrl}, enrollEndpoint=${FACE_AUTH_ENROLL_ENDPOINT}, verifyEndpoint=${this.externalFaceAuthAuthenticateEndpoint}`,
    );
  }
  async create(
    dto: CreateHrmMobileAuthFaceDto,
    file: Express.Multer.File,
    authContext?: ForwardAuthContext,
    createdBy?: number,
  ): Promise<{
    success: boolean;
    faceRegistered: boolean;
    data: FaceRegistrationResponse;
    message: string;
  }> {
    const startedAt = Date.now();
    this.validateFaceFiles([file], 1, 1);

    const enrollment = await this.enrollFace(
      dto.employeeCode,
      file,
    );
    const alreadyEnrolled =
      this.isFaceAlreadyEnrolledError(
        enrollment.message,
      );
    if (!enrollment.success) {
      if (alreadyEnrolled) {
        const user =
          await this.markFaceRegistered(
            dto.employeeCode,
            createdBy,
          );

        throw new ConflictException({
          message:
            enrollment.message ||
            'Employee code already enrolled.',
          data: {
            faceRegistered: true,
            employeeCode: dto.employeeCode,
            userId: user.id,
          },
        });
      }

      throw new BadRequestException({
        message:
          enrollment.message ||
          'Face enrollment failed.',
        data: {
          faceRegistered: false,
          employeeCode: dto.employeeCode,
        },
      });
    }

    const user = await this.markFaceRegistered(
      dto.employeeCode,
      createdBy,
    );

    const uploadedImage =
      this.buildFaceUploadResult(
        'registration',
        file,
        authContext,
      );
    const saved =
      this.buildFaceRegistrationResponse(
        user,
        enrollment,
        uploadedImage,
      );

    this.logger.log(
      `Face registration completed for employeeCode=${dto.employeeCode} in ${Date.now() - startedAt}ms; imagesAccepted=${enrollment.imagesAccepted}; live=${enrollment.liveness}; quality=${enrollment.quality}`,
    );

    return {
      success: true,
      faceRegistered: true,
      data: saved,
      message: 'Face registered successfully.',
    };
  }

  private validateFaceFiles(
    files: Express.Multer.File[],
    minImages: number = FACE_AUTH_MIN_IMAGES,
    maxImages: number = FACE_AUTH_MAX_IMAGES,
  ): void {
    const allowedMimeTypes =
      FACE_AUTH_ALLOWED_MIME_TYPES as readonly string[];

    if (files.length < minImages) {
      throw new BadRequestException(
        `Minimum ${minImages} image(s) required.`,
      );
    }

    if (files.length > maxImages) {
      throw new BadRequestException(
        `Maximum ${maxImages} image(s) allowed.`,
      );
    }

    for (const file of files) {
      if (
        !allowedMimeTypes.includes(file.mimetype)
      ) {
        throw new BadRequestException(
          `Unsupported file type ${file.mimetype}. Allowed types: ${FACE_AUTH_ALLOWED_MIME_TYPES.join(', ')}`,
        );
      }
    }
  }

  /**
   * Verification flow:
   * 1. Accept one in-memory image.
   * 2. Send employee_code as query param and file in multipart body.
   * 3. Return only the external face verification result.
   */
  async verifyAttendance(
    dto: VerifyFaceAttendanceDto,
    file: Express.Multer.File,
    authContext?: ForwardAuthContext,
    createdBy?: number,
  ): Promise<AttendanceVerificationResult> {
    const startedAt = Date.now();
    this.validateFaceFiles([file], 1, 1);
    const verification = await this.verifyFace(
      dto.employeeCode,
      file,
    );
    const verificationCapture =
      this.buildFaceUploadResult(
        'verification',
        file,
        authContext,
      );
    const attendanceTime =
      verification.attendanceTime ||
      new Date().toISOString();
    const attendanceLocation =
      verification.attendanceLocation ||
      this.buildAttendanceLocationResult(dto);

    this.logger.log(
      `Face verification completed for employeeCode=${dto.employeeCode} in ${Date.now() - startedAt}ms; matched=${verification.matched}; live=${verification.liveness.isLive}; similarity=${verification.similarityScore}`,
    );

    if (!verification.success) {
      throw new ForbiddenException(
        this.buildFaceVerificationFailureMessage(
          verification,
        ),
      );
    }

    const savedResult =
      await this.saveMobileAttendancePunchData(
        dto.employeeCode,
        attendanceTime,
        attendanceLocation,
        verificationCapture,
      );

    const savedAttendance =
      savedResult?.attendance ?? null;
    const punchType =
      savedResult?.punchType ?? 'IN';
    const lateMinutes =
      punchType === 'IN'
        ? (savedResult?.lateMinutes ??
          savedAttendance?.lateIn ??
          verification.lateMinutes ??
          0)
        : (savedAttendance?.lateIn ?? 0);
    const earlyOutMinutes =
      savedResult?.earlyOutMinutes ??
      savedAttendance?.earlyOut ??
      0;
    const overtimeMinutes =
      savedResult?.overtimeMinutes ??
      savedAttendance?.overtime ??
      0;
    const remainingMinutesUntilShiftEnd =
      earlyOutMinutes > 0 ? earlyOutMinutes : 0;

    const attendanceSubmittedSuccessfully =
      verification.attendanceSubmittedSuccessfully ??
      verification.success;
    const attendanceCount =
      verification.attendanceCount ??
      (attendanceSubmittedSuccessfully ? 1 : 0);
    const runningMonthLateDays =
      verification.runningMonthLateDays;
    const runningMonthLateMinutes =
      verification.runningMonthLateMinutes;
    const isLate =
      savedAttendance?.lateIn !== undefined
        ? savedAttendance.lateIn > 0
        : (verification.isLate ??
          lateMinutes > 0);
    const attendanceStatus =
      savedAttendance?.dayStatus ??
      verification.attendanceStatus ??
      (isLate ? 'LATE_PRESENT' : 'PRESENT');
    const shiftInTime =
      verification.shiftInTime ?? null;
    const shiftOutTime =
      verification.shiftOutTime ?? null;

    const successMessage =
      this.buildAttendanceSuccessMessage({
        punchType,
        attendanceLocation,
        lateMinutes,
        earlyOutMinutes,
        overtimeMinutes,
        runningMonthLateDays,
        runningMonthLateMinutes,
      });

    const attendanceTimeValue =
      this.parsePunchTime(attendanceTime) ||
      new Date();
    const formattedAttendanceTime =
      this.formatDisplayTime(attendanceTimeValue);
    const formattedAttendanceDate =
      this.formatDisplayDate(attendanceTimeValue);

    return {
      success: true,
      employeeCode: dto.employeeCode,
      matched: verification.matched,
      isLive: verification.liveness.isLive,
      similarityScore:
        verification.similarityScore,
      attendanceCount,
      punchType,
      isLate,
      lateMinutes:
        punchType === 'IN' ? lateMinutes : 0,
      earlyOutMinutes,
      overtimeMinutes,
      remainingMinutesUntilShiftEnd,
      attendanceSubmittedSuccessfully,
      attendanceStatus,
      attendanceDate: formattedAttendanceDate,
      attendanceTime: formattedAttendanceTime,
      shiftInTime: shiftInTime || undefined,
      shiftOutTime: shiftOutTime || undefined,
      attendanceLocation,
      runningMonthLateDays,
      runningMonthLateMinutes,
      message: successMessage,
      rawAttendanceTime:
        typeof attendanceTime === 'string'
          ? attendanceTime
          : attendanceTimeValue.toISOString(),
    };
  }

  private buildFaceMultipartFormData(
    image: Express.Multer.File,
  ): FormData {
    const formData = new FormData();
    formData.append('file', image.buffer, {
      filename: image.originalname,
      contentType: image.mimetype,
      knownLength: image.size,
    });

    return formData;
  }

  private async enrollFace(
    employeeIdentifier: string,
    image: Express.Multer.File,
  ): Promise<FaceEmbeddingResult> {
    const formData =
      this.buildFaceMultipartFormData(image);

    const enrollUrl = new URL(
      this.buildUrl(
        this.externalFaceAuthBaseUrl,
        FACE_AUTH_ENROLL_ENDPOINT,
      ),
    );
    enrollUrl.searchParams.set(
      'employee_code',
      employeeIdentifier,
    );
    this.logger.log(
      `Face enroll request => url=${enrollUrl.toString()} employeeCode=${employeeIdentifier} fileName=${image.originalname} fileType=${image.mimetype} fileSize=${image.size}`,
    );

    const response = await firstValueFrom(
      this.httpService.post(
        enrollUrl.toString(),
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            [FACE_AUTH_API_KEY_HEADER]:
              FACE_AUTH_ENROLL_TOKEN,
          },
          timeout: FACE_AUTH_EXTERNAL_TIMEOUT_MS,
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        },
      ),
    ).catch((error) => {
      return this.handleAxiosError(
        error,
        'Face enrollment API request failed',
        enrollUrl.toString(),
        employeeIdentifier,
      );
    });

    const data = this.flattenResponsePayload(
      response.data,
    );
    const success =
      this.readBoolean(data, [
        'success',
        'ok',
        'status',
      ]) ??
      (response.status >= 200 &&
        response.status < 300);
    const imagesAccepted =
      this.readNumber(data, [
        'imagesCount',
        'images_count',
        'imagesAccepted',
        'images_accepted',
      ]) ?? 1;
    const quality =
      this.readNumber(data, [
        'quality',
        'score',
        'average_quality_score',
      ]) ?? 0;
    const liveness =
      this.readBoolean(data, [
        'liveness',
        'liveliness',
        'is_live',
        'isLive',
        'live',
      ]) ??
      (response.status >= 200 &&
        response.status < 300);
    const algorithm = String(
      data.algorithm ??
        data.embedding_algorithm ??
        'external-face-auth',
    );

    return {
      success,
      message:
        String(
          data.message ?? data.detail ?? '',
        ) || undefined,
      employeeId: String(
        data.employee_id ??
          data.employeeId ??
          employeeIdentifier,
      ),
      embedding: Array.isArray(data.embedding)
        ? (data.embedding as number[])
        : [],
      algorithm,
      quality,
      liveness,
      imagesAccepted,
    };
  }

  private async verifyFace(
    employeeIdentifier: string,
    image: Express.Multer.File,
  ): Promise<FaceVerificationResult> {
    const formData =
      this.buildFaceMultipartFormData(image);

    const verifyUrl = new URL(
      this.buildUrl(
        this.externalFaceAuthBaseUrl,
        this.externalFaceAuthAuthenticateEndpoint,
      ),
    );
    verifyUrl.searchParams.set(
      'employee_code',
      employeeIdentifier,
    );
    this.logger.log(
      `Face verify request => url=${verifyUrl.toString()} employeeCode=${employeeIdentifier} fileName=${image.originalname} fileType=${image.mimetype} fileSize=${image.size}`,
    );

    const response = await firstValueFrom(
      this.httpService.post(
        verifyUrl.toString(),
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            [FACE_AUTH_API_KEY_HEADER]:
              FACE_AUTH_ENROLL_TOKEN,
          },
          timeout: FACE_AUTH_EXTERNAL_TIMEOUT_MS,
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        },
      ),
    ).catch((error) => {
      return this.handleAxiosError(
        error,
        'Face verification API request failed',
        verifyUrl.toString(),
        employeeIdentifier,
      );
    });

    const data = this.flattenResponsePayload(
      response.data,
    );
    const upstreamMessage = String(
      data.message ?? data.detail ?? '',
    ).trim();
    const success =
      this.isUpstreamAuthenticationSuccessful(
        response.status,
        upstreamMessage,
      );
    const similarityScore =
      this.readNumber(data, [
        'similarity_score',
        'similarityScore',
        'score',
        'confidence',
      ]) ?? 0;
    const matched =
      this.readBoolean(data, [
        'matched',
        'is_match',
        'isMatched',
        'match',
      ]) ?? similarityScore >= 0.5;
    const isLive =
      this.readBoolean(data, [
        'liveness',
        'liveliness',
        'is_live',
        'isLive',
        'live',
      ]) ?? false;
    const attendanceStatus =
      String(
        data.attendance_status ??
          data.attendanceStatus ??
          data.day_status ??
          data.dayStatus ??
          '',
      ).trim() || undefined;
    const attendanceCount =
      this.readNumber(data, [
        'attendance_count',
        'attendanceCount',
        'count',
        'total_attendance',
        'totalAttendance',
      ]) ?? undefined;
    const attendanceSubmittedSuccessfully =
      this.readBoolean(data, [
        'attendance_submitted_successfully',
        'attendanceSubmittedSuccessfully',
        'submittedSuccessfully',
        'isSubmitted',
        'attendanceSubmitted',
      ]) ?? undefined;
    const upstreamIsLate =
      this.readBoolean(data, [
        'isLate',
        'is_late',
        'late',
        'lateStatus',
      ]) ?? undefined;
    const lateMinutes =
      this.readNumber(data, [
        'late_minutes',
        'lateMinutes',
        'late_minute',
        'lateMinute',
        'late_by_minutes',
        'lateByMinutes',
      ]) ?? undefined;
    const runningMonthLateDays =
      this.readNumber(data, [
        'running_month_late_days',
        'runningMonthLateDays',
        'late_days',
        'lateDays',
        'late_in_month',
        'lateInMonth',
        'late_absent_days',
        'lateAbsentDays',
      ]) ?? undefined;
    const runningMonthLateMinutes =
      this.readNumber(data, [
        'running_month_late_minutes',
        'runningMonthLateMinutes',
        'total_late_minutes',
        'totalLateMinutes',
        'late_in_month_minutes',
        'lateInMonthMinutes',
        'late_minutes_month',
      ]) ?? undefined;
    const attendanceTime =
      this.readText(data, [
        'attendance_time',
        'attendanceTime',
        'checked_at',
        'checkedAt',
        'timestamp',
        'attended_at',
      ]) || undefined;
    const shiftInTime =
      this.readText(data, [
        'shift_in_time',
        'shiftInTime',
        'office_in_time',
        'officeInTime',
        'shift_start_time',
        'shiftStartTime',
      ]) || undefined;
    const shiftOutTime =
      this.readText(data, [
        'shift_out_time',
        'shiftOutTime',
        'office_out_time',
        'officeOutTime',
        'shift_end_time',
        'shiftEndTime',
      ]) || undefined;
    const locationLatitude =
      this.readText(data, [
        'latitude',
        'lat',
        'location_latitude',
        'locationLatitude',
      ]) || undefined;
    const locationLongitude =
      this.readText(data, [
        'longitude',
        'lng',
        'lon',
        'location_longitude',
        'locationLongitude',
      ]) || undefined;
    const locationName =
      this.readText(data, [
        'location_name',
        'locationName',
        'place_name',
        'placeName',
        'address',
      ]) || undefined;

    return {
      success,
      matched,
      similarityScore,
      liveness: {
        isLive,
      },
      message: upstreamMessage || undefined,
      attendanceCount,
      isLate: upstreamIsLate,
      lateMinutes,
      runningMonthLateDays,
      runningMonthLateMinutes,
      attendanceSubmittedSuccessfully,
      attendanceStatus,
      attendanceTime,
      shiftInTime,
      shiftOutTime,
      attendanceLocation:
        locationLatitude ||
        locationLongitude ||
        locationName
          ? {
              latitude: locationLatitude,
              longitude: locationLongitude,
              locationName,
              googleMapsUrl:
                locationLatitude &&
                locationLongitude
                  ? this.buildGoogleMapsUrl(
                      locationLatitude,
                      locationLongitude,
                    )
                  : undefined,
            }
          : undefined,
    };
  }

  private buildFaceVerificationFailureMessage(
    verification: FaceVerificationResult,
  ): string {
    if (!verification.liveness.isLive) {
      return 'Liveness verification failed. Please use a live face and try again.';
    }

    if (!verification.matched) {
      return `Face does not match the registered employee face. Similarity score: ${verification.similarityScore}.`;
    }

    const upstreamMessage =
      verification.message?.trim();
    if (
      upstreamMessage &&
      upstreamMessage.toLowerCase() !==
        'authentication failed'
    ) {
      return upstreamMessage;
    }

    return `Face verification failed. Similarity score: ${verification.similarityScore}. Please try again.`;
  }

  private inferAttendanceLateStatus(
    attendanceStatus?: string,
    message?: string,
  ): boolean {
    const normalizedStatus =
      attendanceStatus?.trim().toLowerCase() ||
      '';
    if (
      normalizedStatus.includes('late') ||
      normalizedStatus.includes('l.present')
    ) {
      return true;
    }

    const normalizedMessage =
      message?.trim().toLowerCase() || '';
    if (
      normalizedMessage.includes('late') ||
      normalizedMessage.includes('after shift') ||
      normalizedMessage.includes('late present')
    ) {
      return true;
    }

    return false;
  }

  private calculateLateMinutes(
    attendanceTime?: string,
    shiftInTime?: string,
  ): number | undefined {
    if (!attendanceTime || !shiftInTime) {
      return undefined;
    }

    const attendanceDate = new Date(
      attendanceTime,
    );
    if (Number.isNaN(attendanceDate.getTime())) {
      return undefined;
    }

    const shiftClock =
      this.parseClockTime(shiftInTime);
    if (!shiftClock) {
      return undefined;
    }

    const shiftDate = new Date(attendanceDate);
    shiftDate.setHours(
      shiftClock.hours,
      shiftClock.minutes,
      shiftClock.seconds,
      0,
    );

    const diffMs =
      attendanceDate.getTime() -
      shiftDate.getTime();
    if (diffMs <= 0) {
      return 0;
    }

    return Math.ceil(diffMs / 60_000);
  }

  private parseClockTime(value: string):
    | {
        hours: number;
        minutes: number;
        seconds: number;
      }
    | undefined {
    const normalized = value.trim();
    const match = normalized.match(
      /^(\d{1,2}):(\d{2})(?::(\d{2}))?/,
    );
    if (!match) {
      const parsedDate = new Date(normalized);
      if (Number.isNaN(parsedDate.getTime())) {
        return undefined;
      }

      return {
        hours: parsedDate.getHours(),
        minutes: parsedDate.getMinutes(),
        seconds: parsedDate.getSeconds(),
      };
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    const seconds = Number(match[3] || 0);
    if (
      !Number.isFinite(hours) ||
      !Number.isFinite(minutes) ||
      !Number.isFinite(seconds)
    ) {
      return undefined;
    }

    return { hours, minutes, seconds };
  }

  private buildAttendanceSuccessMessage(params: {
    punchType: 'IN' | 'OUT';
    attendanceLocation?: AttendanceLocationResult;
    lateMinutes?: number;
    earlyOutMinutes?: number;
    overtimeMinutes?: number;
    runningMonthLateDays?: number;
    runningMonthLateMinutes?: number;
  }): string {
    const {
      punchType,
      attendanceLocation,
      lateMinutes = 0,
      earlyOutMinutes = 0,
      overtimeMinutes = 0,
      runningMonthLateDays,
      runningMonthLateMinutes,
    } = params;

    const locationPart =
      attendanceLocation?.locationName
        ? ` at ${attendanceLocation.locationName}`
        : '';

    const baseAction =
      punchType === 'OUT'
        ? `Attendance check-out successfully submitted${locationPart}.`
        : `Attendance successfully submitted${locationPart}.`;

    const parts = [baseAction];

    if (punchType === 'IN') {
      if (lateMinutes > 0) {
        parts.push(
          `Late by ${lateMinutes} minute(s).`,
        );
      }
      if (
        runningMonthLateDays !== undefined ||
        runningMonthLateMinutes !== undefined
      ) {
        parts.push(
          `Running month late: ${runningMonthLateDays ?? 0} day(s), ${runningMonthLateMinutes ?? 0} minute(s).`,
        );
      }
    } else {
      if (earlyOutMinutes > 0) {
        parts.push(
          `${earlyOutMinutes} minute(s) remaining until shift ends.`,
        );
      } else if (overtimeMinutes > 0) {
        parts.push(
          `Overtime: ${overtimeMinutes} minute(s).`,
        );
      }
    }

    return parts.join(' ');
  }

  private buildAttendanceLocationResult(
    dto: VerifyFaceAttendanceDto,
  ): AttendanceLocationResult | undefined {
    const latitude =
      dto.latitude?.trim() || undefined;
    const longitude =
      dto.longitude?.trim() || undefined;
    const locationName =
      dto.locationName?.trim() || undefined;

    if (
      !latitude &&
      !longitude &&
      !locationName
    ) {
      return undefined;
    }

    return {
      latitude,
      longitude,
      locationName,
      googleMapsUrl:
        latitude && longitude
          ? this.buildGoogleMapsUrl(
              latitude,
              longitude,
            )
          : undefined,
    };
  }

  private parsePunchTime(
    value?: string,
  ): Date | null {
    if (!value) {
      return null;
    }

    const fallback = new Date(value);
    return Number.isNaN(fallback.getTime())
      ? null
      : fallback;
  }

  private toAttendanceDateString(
    date: Date,
  ): string {
    return date.toLocaleDateString('en-CA', {
      timeZone: 'Asia/Dhaka',
    });
  }

  private formatDisplayTime(
    date: Date | string,
  ): string {
    const d =
      typeof date === 'string'
        ? new Date(date)
        : date;
    if (isNaN(d.getTime()))
      return String(date || '');
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(d);
  }

  private formatDisplayDate(
    date: Date | string,
  ): string {
    const d =
      typeof date === 'string'
        ? new Date(date)
        : date;
    if (isNaN(d.getTime()))
      return String(date || '');
    const formatter = new Intl.DateTimeFormat(
      'en-GB',
      {
        timeZone: 'Asia/Dhaka',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      },
    );
    return formatter
      .format(d)
      .replace(/\//g, '-');
  }

  private normalizeTime(
    value?: string | null,
  ): string | null {
    const normalized = String(value || '').trim();
    return normalized.length ? normalized : null;
  }

  private combineDateTime(
    date: Date | string,
    time: string,
    isNextDay = false,
  ): Date {
    const d =
      typeof date === 'string'
        ? new Date(date)
        : date;
    let dateStr: string;
    if (!isNaN(d.getTime())) {
      dateStr = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Dhaka',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(d);
    } else {
      dateStr = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Dhaka',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date());
    }

    const timeClean = (time || '00:00:00').trim();
    const parts = timeClean.split(':');
    const h = (parts[0] || '00').padStart(2, '0');
    const m = (parts[1] || '00').padStart(2, '0');
    const s = (parts[2] || '00').padStart(2, '0');

    let res = new Date(
      `${dateStr}T${h}:${m}:${s}+06:00`,
    );
    if (isNextDay) {
      res = new Date(
        res.getTime() + 24 * 60 * 60 * 1000,
      );
    }
    return res;
  }

  private addMinutes(
    date: Date,
    minutes: number,
  ): Date {
    return new Date(
      date.getTime() + minutes * 60_000,
    );
  }

  private parseShiftDifferenceMinutes(
    value?: string | null,
  ): number {
    const normalized = String(value || '').trim();

    if (!normalized) {
      return 0;
    }

    if (/^\d+$/.test(normalized)) {
      return Number(normalized);
    }

    if (normalized.includes(':')) {
      const [hours = '0', minutes = '0'] =
        normalized.split(':');
      return (
        (Number(hours) || 0) * 60 +
        (Number(minutes) || 0)
      );
    }

    return 0;
  }

  private async getLatestShiftDifferenceMinute(
    transaction?: Transaction,
  ): Promise<number> {
    const shiftDifference =
      await this.findOneWithDeletedAtFallback(
        (options) =>
          (
            this as any
          ).shiftDifferenceModel.findOne(options),
        {
          order: [['createdAt', 'DESC']],
          transaction,
        },
      );

    return this.parseShiftDifferenceMinutes(
      (shiftDifference as any)?.time,
    );
  }

  private async findOfficeTimeForEmployee(
    employee: Pick<HrmEmployee, 'shiftId'>,
    transaction?: Transaction,
  ): Promise<HrmOfficeTime | null> {
    if (!employee.shiftId) {
      return null;
    }

    return this.findOneWithDeletedAtFallback(
      (options) =>
        (this as any).officeTimeModel.findOne(
          options,
        ),
      {
        where: {
          shiftId: employee.shiftId,
          status: StatusEnum.ACTIVE,
        },
        order: [
          ['isAllOffice', 'DESC'],
          ['effectiveFrom', 'DESC'],
          ['updatedAt', 'DESC'],
          ['id', 'DESC'],
        ],
        transaction,
      },
    );
  }

  private async findAttendanceForEmployeeDate(
    employeeId: number,
    date: string,
    transaction?: Transaction,
  ) {
    return this.findOneWithDeletedAtFallback(
      (options) =>
        (this as any).attendanceModel.findOne(
          options,
        ),
      {
        where: {
          hrmEmployeeId: employeeId,
          date,
        },
        order: [
          ['updatedAt', 'DESC'],
          ['id', 'DESC'],
        ],
        transaction,
      },
    );
  }

  private async findAttendanceDevicePunchesForEmployeeDate(
    cardNo: number,
    date: string,
    transaction?: Transaction,
  ) {
    const { start, end } =
      this.buildAttendanceDateRange(date);

    return this.findOneWithDeletedAtFallback(
      (options) =>
        (this as any).attendanceDeviceDataModel
          .unscoped()
          .findAll(options),
      {
        where: {
          cardNo,
          punchTime: {
            [Op.gte]: start,
            [Op.lte]: end,
          },
        },
        order: [
          ['punchTime', 'ASC'],
          ['id', 'ASC'],
        ],
        transaction,
      },
    );
  }

  private buildAttendanceDateRange(
    date: string,
  ): {
    start: Date;
    end: Date;
  } {
    return {
      start: new Date(`${date}T00:00:00+06:00`),
      end: new Date(`${date}T23:59:59.999+06:00`),
    };
  }

  private buildAttendancePunchHistoryItem(
    punch: Pick<
      HrmAttendanceDeviceData,
      | 'punchTime'
      | 'latitude'
      | 'longitude'
      | 'locationName'
      | 'attendanceSourceType'
    >,
  ): AttendancePunchHistoryItem | null {
    const punchTime =
      punch.punchTime instanceof Date
        ? punch.punchTime
        : punch.punchTime
          ? new Date(punch.punchTime)
          : null;

    if (
      !punchTime ||
      Number.isNaN(punchTime.getTime())
    ) {
      return null;
    }

    return {
      punchTime: punchTime.toISOString(),
      latitude: punch.latitude ?? null,
      longitude: punch.longitude ?? null,
      locationName: punch.locationName ?? null,
      attendanceSourceType:
        punch.attendanceSourceType ?? null,
    };
  }

  private buildAttendanceLocationSnapshot(
    punch: AttendancePunchHistoryItem | null,
    capture?: FaceImageUploadResult,
  ): Record<string, unknown> | null {
    if (!punch) {
      return null;
    }

    return {
      punchTime: punch.punchTime,
      latitude: punch.latitude ?? null,
      longitude: punch.longitude ?? null,
      locationName: punch.locationName ?? null,
      attendanceSourceType:
        punch.attendanceSourceType ?? null,
      googleMapsUrl:
        punch.latitude && punch.longitude
          ? this.buildGoogleMapsUrl(
              punch.latitude,
              punch.longitude,
            )
          : null,
      capture: capture
        ? {
            url: capture.url,
            originalName: capture.originalName,
            mimeType: capture.mimeType,
            size: capture.size,
            metadata: capture.metadata ?? null,
          }
        : null,
    };
  }

  private getEffectiveFlexibleMinutes(
    officeTime: HrmOfficeTime | null,
    shiftDifferenceMinute: number,
  ): number {
    return typeof officeTime?.flexibleInMin ===
      'number'
      ? officeTime.flexibleInMin
      : shiftDifferenceMinute;
  }

  private calculateLateMinutesWithFlex(
    inTime: Date,
    shiftIn: string,
    flexInMin = 5,
  ): number {
    const shiftDate = this.combineDateTime(
      inTime,
      shiftIn,
    );
    const allowedInDate = this.addMinutes(
      shiftDate,
      flexInMin,
    );

    return this.calculatePositiveMinutes(
      inTime,
      allowedInDate,
    );
  }

  private calculateEarlyMinutes(
    outTime: Date,
    shiftOut: string,
  ): number {
    const shiftDate = this.combineDateTime(
      outTime,
      shiftOut,
    );

    return this.calculatePositiveMinutes(
      shiftDate,
      outTime,
    );
  }

  private calculateOvertimeMinutes(
    outTime: Date,
    shiftOut: string,
  ): number {
    const shiftDate = this.combineDateTime(
      outTime,
      shiftOut,
    );

    return this.calculatePositiveMinutes(
      outTime,
      shiftDate,
    );
  }

  private calculatePositiveMinutes(
    laterTime: Date,
    earlierTime: Date,
  ): number {
    const diffMs =
      laterTime.getTime() - earlierTime.getTime();

    if (diffMs <= 0) {
      return 0;
    }

    return Math.ceil(diffMs / 60_000);
  }

  private calculateDurationText(
    laterTime: Date,
    earlierTime: Date,
  ): string {
    const diffMs =
      laterTime.getTime() - earlierTime.getTime();

    if (diffMs <= 0) {
      return '00:00:00';
    }

    const totalSeconds = Math.ceil(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(
      (totalSeconds % 3600) / 60,
    );
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map((part) =>
        String(part).padStart(2, '0'),
      )
      .join(':');
  }

  private buildAttendanceTimingSummary(params: {
    punchInTime: Date;
    punchOutTime?: Date | null;
    shiftInTime: string;
    shiftOutTime?: string | null;
    flexibleInMinutes: number;
  }): {
    lateIn: number;
    lateInDuration: string | null;
    earlyOut: number;
    earlyOutDuration: string | null;
    overtime: number;
    overtimeDuration: string | null;
  } {
    const shiftInDate = this.combineDateTime(
      params.punchInTime,
      params.shiftInTime,
    );
    const allowedInDate = this.addMinutes(
      shiftInDate,
      params.flexibleInMinutes,
    );
    const lateIn = this.calculatePositiveMinutes(
      params.punchInTime,
      allowedInDate,
    );
    const lateInDuration =
      this.calculateDurationText(
        params.punchInTime,
        allowedInDate,
      );

    if (
      !params.punchOutTime ||
      !params.shiftOutTime
    ) {
      return {
        lateIn,
        lateInDuration,
        earlyOut: 0,
        earlyOutDuration: null,
        overtime: 0,
        overtimeDuration: null,
      };
    }

    const isOvernight =
      params.shiftOutTime && params.shiftInTime
        ? this.parseShiftDifferenceMinutes(
            params.shiftOutTime,
          ) <
          this.parseShiftDifferenceMinutes(
            params.shiftInTime,
          )
        : false;

    const shiftOutDate = this.combineDateTime(
      params.punchOutTime || params.punchInTime,
      params.shiftOutTime,
      isOvernight,
    );

    return {
      lateIn,
      lateInDuration,
      earlyOut: this.calculatePositiveMinutes(
        shiftOutDate,
        params.punchOutTime,
      ),
      earlyOutDuration:
        this.calculateDurationText(
          shiftOutDate,
          params.punchOutTime,
        ),
      overtime: this.calculatePositiveMinutes(
        params.punchOutTime,
        shiftOutDate,
      ),
      overtimeDuration:
        this.calculateDurationText(
          params.punchOutTime,
          shiftOutDate,
        ),
    };
  }

  private resolveAttendanceDayStatus(
    lateMinutes: number,
  ): AttendanceDayStatusEnum {
    return lateMinutes > 0
      ? AttendanceDayStatusEnum.LATE_PRESENT
      : AttendanceDayStatusEnum.PRESENT;
  }

  private async saveMobileAttendancePunchData(
    employeeCode: string,
    punchTime?: string,
    attendanceLocation?: AttendanceLocationResult,
    verificationCapture?: FaceImageUploadResult,
  ): Promise<MobileAttendancePunchResult | null> {
    let persistenceStage = 'parse-punch-time';
    const punchTimeValue =
      this.parsePunchTime(punchTime);

    if (!punchTimeValue) {
      this.logger.warn(
        `Skipping mobile attendance save for employeeCode=${employeeCode}; punchTime is missing or invalid.`,
      );
      return null;
    }

    return this.sequelize
      .transaction(async (transaction) => {
        persistenceStage = 'find-employee';
        const employee =
          await this.findOneWithDeletedAtFallback(
            (options) =>
              (this as any).employeeModel.findOne(
                options,
              ),
            {
              where: { employeeCode },
              attributes: [
                'id',
                'employeeCode',
                'cardNo',
                'shiftId',
                'employeeStatus',
                'officeId',
                'officeTypeId',
                'isRostering',
              ],
              transaction,
            },
          );

        if (!employee) {
          this.logger.warn(
            `Skipping mobile attendance save for employeeCode=${employeeCode}; employee not found.`,
          );
          return null;
        }

        const punchDate =
          this.toAttendanceDateString(
            punchTimeValue,
          );
        const shiftDifferenceMinute =
          await this.getLatestShiftDifferenceMinute(
            transaction,
          );
        const officeTime =
          await this.findOfficeTimeForEmployee(
            employee as any,
            transaction,
          );
        const cardNo = Number(
          (employee as any)?.cardNo?.trim(),
        );
        const persistedLocationName =
          this.truncateForLegacyVarchar(
            attendanceLocation?.locationName,
            255,
          );

        const deviceDataPayload = {
          cardNo,
          punchTime: punchTimeValue,
          attendanceSourceType:
            HrmAttendanceDeviceDataSourceEnum.MOBILE,
          latitude: attendanceLocation?.latitude,
          longitude:
            attendanceLocation?.longitude,
          locationName: persistedLocationName,
        };

        this.logger.debug(
          `Mobile attendance persistence started: employeeCode=${employeeCode}, locationNameLength=${persistedLocationName?.length ?? 0}, latitudeLength=${attendanceLocation?.latitude?.length ?? 0}, longitudeLength=${attendanceLocation?.longitude?.length ?? 0}, captureUrlLength=${verificationCapture?.url.length ?? 0}`,
        );

        if (
          Number.isFinite(
            deviceDataPayload.cardNo,
          )
        ) {
          persistenceStage =
            'insert-attendance-device-data';
          await (
            this as any
          ).attendanceDeviceDataModel.create(
            deviceDataPayload,
            { transaction },
          );
        }

        persistenceStage =
          'create-or-update-hrm-attendance';
        const syncResult =
          await this.syncAttendanceFromMobilePunch(
            {
              employee: employee as any,
              cardNo: Number.isFinite(cardNo)
                ? cardNo
                : null,
              punchTime: punchTimeValue,
              punchDate,
              shiftDifferenceMinute,
              officeTime,
              attendanceLocation,
              verificationCapture,
              transaction,
            },
          );

        persistenceStage =
          'insert-mobile-attendance-data';
        await (
          this as any
        ).mobileAttendanceDataModel.create(
          {
            hrmEmployeeId: (employee as any)?.id,
            employeeCode: (employee as any)
              ?.employeeCode,
            hrmAttendanceId:
              syncResult.attendance?.id ?? null,
            punchTime: punchTimeValue,
            punchDate: punchDate as any,
            attendanceSourceType:
              HrmAttendanceDeviceDataSourceEnum.MOBILE,
            latitude:
              attendanceLocation?.latitude,
            longitude:
              attendanceLocation?.longitude,
            locationName: persistedLocationName,
          },
          { transaction },
        );

        return syncResult;
      })
      .catch((error: unknown) => {
        this.logAttendancePersistenceError(
          error,
          persistenceStage,
          employeeCode,
        );
        throw error;
      });
  }

  private async syncAttendanceFromMobilePunch(params: {
    employee: Pick<
      HrmEmployee,
      | 'id'
      | 'shiftId'
      | 'employeeCode'
      | 'officeId'
      | 'officeTypeId'
      | 'departmentId'
      | 'designationId'
      | 'gradeId'
      | 'isRostering'
    >;
    cardNo: number | null;
    punchTime: Date;
    punchDate: string;
    shiftDifferenceMinute: number;
    officeTime: HrmOfficeTime | null;
    attendanceLocation?: AttendanceLocationResult;
    verificationCapture?: FaceImageUploadResult;
    transaction: Transaction;
  }): Promise<MobileAttendancePunchResult> {
    const {
      employee,
      cardNo,
      punchTime,
      punchDate,
      shiftDifferenceMinute,
      officeTime,
      attendanceLocation,
      verificationCapture,
      transaction,
    } = params;

    const attendance =
      await this.findAttendanceForEmployeeDate(
        employee.id,
        punchDate,
        transaction,
      );
    const shiftId = Number(
      (attendance as any)?.hrmShiftId ||
        employee.shiftId ||
        officeTime?.shiftId ||
        0,
    );

    if (!shiftId) {
      this.logger.warn(
        `Skipping mobile attendance sync for employeeCode=${employee.employeeCode}; shift is missing.`,
      );
      return {
        attendance,
        punchType: 'IN',
        lateMinutes: 0,
        earlyOutMinutes: 0,
        overtimeMinutes: 0,
      };
    }

    const shiftInTime = this.normalizeTime(
      (attendance as any)?.shiftInTime ||
        officeTime?.shiftStartTime ||
        '09:00:00',
    );
    const shiftOutTime = this.normalizeTime(
      (attendance as any)?.shiftOutTime ||
        officeTime?.shiftEndTime ||
        '18:00:00',
    );
    const flexibleInMinutes =
      typeof officeTime?.flexibleInMin ===
      'number'
        ? officeTime.flexibleInMin
        : 5;
    const diffMinutes =
      shiftDifferenceMinute > 0
        ? shiftDifferenceMinute
        : 30;
    const isRostering = Boolean(
      employee.isRostering,
    );

    const devicePunches = Number.isFinite(
      cardNo ?? NaN,
    )
      ? await this.findAttendanceDevicePunchesForEmployeeDate(
          cardNo,
          punchDate,
          transaction,
        )
      : [];
    const rawPunchHistory =
      (devicePunches as any[]).length > 0
        ? devicePunches
        : [
            {
              punchTime,
              latitude:
                attendanceLocation?.latitude,
              longitude:
                attendanceLocation?.longitude,
              locationName:
                attendanceLocation?.locationName,
              attendanceSourceType:
                HrmAttendanceDeviceDataSourceEnum.MOBILE,
            },
          ];
    const punchHistory = (
      rawPunchHistory as any[]
    )
      .map((item: any) =>
        this.buildAttendancePunchHistoryItem(
          item,
        ),
      )
      .filter(
        (
          item,
        ): item is AttendancePunchHistoryItem =>
          Boolean(item),
      );

    const currentPunchLocation =
      attendanceLocation
        ? this.buildAttendanceLocationSnapshot(
            {
              punchTime: punchTime.toISOString(),
              latitude:
                attendanceLocation.latitude ??
                null,
              longitude:
                attendanceLocation.longitude ??
                null,
              locationName:
                attendanceLocation.locationName ??
                null,
              attendanceSourceType:
                HrmAttendanceDeviceDataSourceEnum.MOBILE,
            },
            verificationCapture,
          )
        : null;

    if (!shiftInTime) {
      this.logger.warn(
        `Skipping mobile attendance sync for employeeCode=${employee.employeeCode}; shift in time is missing.`,
      );
      return {
        attendance,
        punchType: 'IN',
        lateMinutes: 0,
        earlyOutMinutes: 0,
        overtimeMinutes: 0,
      };
    }

    const shiftInDate = this.combineDateTime(
      punchTime,
      shiftInTime,
    );
    const allowedInDate = this.addMinutes(
      shiftInDate,
      flexibleInMinutes,
    );

    const isOvernight =
      shiftOutTime && shiftInTime
        ? this.parseShiftDifferenceMinutes(
            shiftOutTime,
          ) <
          this.parseShiftDifferenceMinutes(
            shiftInTime,
          )
        : false;

    const shiftOutDate = this.combineDateTime(
      punchTime,
      shiftOutTime,
      isOvernight,
    );

    const earlyOut =
      this.calculatePositiveMinutes(
        shiftOutDate,
        punchTime,
      );
    const earlyOutDuration =
      this.calculateDurationText(
        shiftOutDate,
        punchTime,
      );
    const overtime =
      this.calculatePositiveMinutes(
        punchTime,
        shiftOutDate,
      );
    const overtimeDuration =
      this.calculateDurationText(
        punchTime,
        shiftOutDate,
      );

    let shouldBeInPunch = false;

    if (!isRostering) {
      // Non-roster employee:
      // The 1st punch of the current date is the IN punch.
      // If attendance record does not exist or inDatetime is not set yet, this is the IN punch.
      shouldBeInPunch =
        !attendance ||
        !(attendance as any).inDatetime;
    } else {
      // Roster employee:
      // Punch within the shift difference window around shift in time (e.g. ±30 min) is the IN punch.
      const inWindowStart = this.addMinutes(
        shiftInDate,
        -diffMinutes,
      );
      const inWindowEnd = this.addMinutes(
        shiftInDate,
        diffMinutes,
      );
      shouldBeInPunch =
        punchTime >= inWindowStart &&
        punchTime <= inWindowEnd;
    }

    if (!attendance) {
      if (shouldBeInPunch) {
        // 1st punch / IN punch: Calculate Present / L.Present with flexible minutes
        const isLate = punchTime > allowedInDate;
        const lateIn = isLate
          ? this.calculatePositiveMinutes(
              punchTime,
              allowedInDate,
            )
          : 0;
        const lateInDuration = isLate
          ? this.calculateDurationText(
              punchTime,
              allowedInDate,
            )
          : '00:00:00';
        const dayStatus = isLate
          ? AttendanceDayStatusEnum.LATE_PRESENT
          : AttendanceDayStatusEnum.PRESENT;

        const createdAttendance = await (
          this as any
        ).attendanceModel.create(
          {
            hrmEmployeeId: employee.id,
            hrmShiftId: shiftId,
            inDatetime: punchTime,
            outDatetime: null,
            shiftInTime,
            shiftOutTime,
            dayStatus,
            remarks: null,
            punchHistory,
            inLocation: currentPunchLocation,
            outLocation: null,
            lateIn,
            lateInDuration,
            earlyOut: 0,
            earlyOutDuration: null,
            overtime: 0,
            overtimeDuration: null,
            date: punchDate as any,
          } as any,
          { transaction },
        );

        return {
          attendance: createdAttendance,
          punchType: 'IN',
          lateMinutes: isLate ? lateIn : 0,
          earlyOutMinutes: 0,
          overtimeMinutes: 0,
        };
      } else {
        // Punch is outside the IN window (e.g. roster employee punched OUT without earlier IN punch)
        const createdAttendance = await (
          this as any
        ).attendanceModel.create(
          {
            hrmEmployeeId: employee.id,
            hrmShiftId: shiftId,
            inDatetime: null,
            outDatetime: punchTime,
            shiftInTime,
            shiftOutTime,
            dayStatus:
              AttendanceDayStatusEnum.PRESENT,
            remarks: null,
            punchHistory,
            inLocation: null,
            outLocation: currentPunchLocation,
            lateIn: 0,
            lateInDuration: '00:00:00',
            earlyOut,
            earlyOutDuration:
              earlyOut > 0
                ? earlyOutDuration
                : null,
            overtime,
            overtimeDuration:
              overtime > 0
                ? overtimeDuration
                : null,
            date: punchDate as any,
          } as any,
          { transaction },
        );

        return {
          attendance: createdAttendance,
          punchType: 'OUT',
          lateMinutes: 0,
          earlyOutMinutes:
            earlyOut > 0 ? earlyOut : 0,
          overtimeMinutes:
            overtime > 0 ? overtime : 0,
        };
      }
    }

    // Attendance record already exists for this date
    if (
      shouldBeInPunch &&
      (!(attendance as any).inDatetime ||
        isRostering)
    ) {
      // IN punch update: recalculate lateIn and dayStatus based on shiftInTime + flexibleInMinutes
      const isLate = punchTime > allowedInDate;
      const lateIn = isLate
        ? this.calculatePositiveMinutes(
            punchTime,
            allowedInDate,
          )
        : 0;
      const lateInDuration = isLate
        ? this.calculateDurationText(
            punchTime,
            allowedInDate,
          )
        : '00:00:00';
      const dayStatus = isLate
        ? AttendanceDayStatusEnum.LATE_PRESENT
        : AttendanceDayStatusEnum.PRESENT;

      const updatePayload: Record<
        string,
        unknown
      > = {
        hrmShiftId: shiftId,
        shiftInTime,
        shiftOutTime,
        punchHistory,
        inDatetime: punchTime,
        inLocation:
          currentPunchLocation ??
          (attendance as any).inLocation,
        lateIn,
        lateInDuration,
        dayStatus,
      };

      if ((attendance as any).outLocation) {
        updatePayload.outLocation = (
          attendance as any
        ).outLocation;
      }

      await (attendance as any).update(
        updatePayload,
        {
          transaction,
        },
      );

      return {
        attendance,
        punchType: 'IN',
        lateMinutes: isLate ? lateIn : 0,
        earlyOutMinutes: 0,
        overtimeMinutes: 0,
      };
    }

    // Subsequent punch -> Treated as OUT punch.
    // Preserves existing dayStatus, lateIn, lateInDuration (ignores Present / L.Present logic for out punches)
    const updatePayload: Record<string, unknown> =
      {
        hrmShiftId: shiftId,
        shiftInTime,
        shiftOutTime,
        punchHistory,
        outDatetime: punchTime,
        outLocation:
          currentPunchLocation ??
          (attendance as any).outLocation,
        earlyOut,
        earlyOutDuration:
          earlyOut > 0 ? earlyOutDuration : null,
        overtime,
        overtimeDuration:
          overtime > 0 ? overtimeDuration : null,
      };

    if ((attendance as any).inLocation) {
      updatePayload.inLocation = (
        attendance as any
      ).inLocation;
    }

    await (attendance as any).update(
      updatePayload,
      {
        transaction,
      },
    );

    return {
      attendance,
      punchType: 'OUT',
      lateMinutes:
        (attendance as any).lateIn ?? 0,
      earlyOutMinutes:
        earlyOut > 0 ? earlyOut : 0,
      overtimeMinutes:
        overtime > 0 ? overtime : 0,
    };
  }

  private buildGoogleMapsUrl(
    latitude: string,
    longitude: string,
  ): string {
    return `https://www.google.com/maps?q=${encodeURIComponent(`${latitude},${longitude}`)}`;
  }

  private truncateForLegacyVarchar(
    value: string | undefined,
    maxLength: number,
  ): string | undefined {
    return value
      ? Array.from(value)
          .slice(0, maxLength)
          .join('')
      : value;
  }

  private logAttendancePersistenceError(
    error: unknown,
    stage: string,
    employeeCode: string,
  ): void {
    const databaseError = error as {
      message?: string;
      name?: string;
      parent?: {
        code?: string;
        detail?: string;
        table?: string;
        column?: string;
        constraint?: string;
        routine?: string;
      };
      original?: {
        code?: string;
        detail?: string;
        table?: string;
        column?: string;
        constraint?: string;
        routine?: string;
      };
    };
    const postgresError =
      databaseError.parent ??
      databaseError.original;

    this.logger.error(
      `Mobile attendance persistence failed: stage=${stage}, employeeCode=${employeeCode}, errorName=${databaseError.name ?? 'unknown'}, message=${databaseError.message ?? 'unknown'}, pgCode=${postgresError?.code ?? 'unknown'}, table=${postgresError?.table ?? 'unknown'}, column=${postgresError?.column ?? 'unknown'}, constraint=${postgresError?.constraint ?? 'unknown'}, detail=${postgresError?.detail ?? 'unknown'}, routine=${postgresError?.routine ?? 'unknown'}`,
      databaseError instanceof Error
        ? databaseError.stack
        : undefined,
    );
  }

  private isMissingDeletedAtColumnError(
    error: unknown,
  ): boolean {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'object' &&
            error !== null &&
            'message' in error
          ? String(
              (error as { message?: unknown })
                .message ?? '',
            )
          : String(error ?? '');

    return /column ["'`]deleted_at["'`] does not exist/i.test(
      message,
    );
  }

  private async findOneWithDeletedAtFallback<T>(
    finder: (
      options: Record<string, unknown>,
    ) => Promise<T>,
    options: Record<string, unknown>,
  ): Promise<T> {
    try {
      return await finder(options);
    } catch (error) {
      if (
        !this.isMissingDeletedAtColumnError(error)
      ) {
        throw error;
      }

      this.logger.warn(
        'Retrying attendance lookup without paranoid filtering because deleted_at is missing from the table schema.',
      );

      return finder({
        ...options,
        paranoid: false,
      });
    }
  }

  private isUpstreamAuthenticationSuccessful(
    status: number,
    message: string,
  ): boolean {
    if (status < 200 || status >= 300) {
      return false;
    }

    const normalizedMessage = message
      .trim()
      .toLowerCase();

    if (!normalizedMessage) {
      return true;
    }

    const failureHints = [
      'fail',
      'failed',
      'invalid',
      'mismatch',
      'not match',
      'denied',
      'unauthorized',
      'forbidden',
    ];
    if (
      failureHints.some((hint) =>
        normalizedMessage.includes(hint),
      )
    ) {
      return false;
    }

    const successHints = [
      'success',
      'successful',
      'authenticated',
      'verified',
      'match',
    ];

    return successHints.some((hint) =>
      normalizedMessage.includes(hint),
    );
  }

  private flattenResponsePayload(
    payload: unknown,
  ): Record<string, unknown> {
    if (
      payload &&
      typeof payload === 'object' &&
      !Array.isArray(payload)
    ) {
      const record = payload as Record<
        string,
        unknown
      >;
      const data = record.data;
      if (
        data &&
        typeof data === 'object' &&
        !Array.isArray(data)
      ) {
        return {
          ...record,
          ...(data as Record<string, unknown>),
        };
      }

      return record;
    }

    return {};
  }

  private readBoolean(
    data: Record<string, unknown>,
    keys: string[],
  ): boolean | undefined {
    for (const key of keys) {
      const value = data[key];
      if (typeof value === 'boolean') {
        return value;
      }
      if (typeof value === 'number') {
        return value !== 0;
      }
      if (typeof value === 'string') {
        const normalized = value
          .trim()
          .toLowerCase();
        if (
          ['true', '1', 'yes', 'y'].includes(
            normalized,
          )
        ) {
          return true;
        }
        if (
          ['false', '0', 'no', 'n'].includes(
            normalized,
          )
        ) {
          return false;
        }
      }
    }

    return undefined;
  }

  private readText(
    data: Record<string, unknown>,
    keys: string[],
  ): string | undefined {
    for (const key of keys) {
      const value = data[key];
      if (typeof value === 'string') {
        const normalized = value.trim();
        if (normalized) {
          return normalized;
        }
      }

      if (
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        return String(value);
      }
    }

    return undefined;
  }

  private readNumber(
    data: Record<string, unknown>,
    keys: string[],
  ): number | undefined {
    for (const key of keys) {
      const value = data[key];
      if (
        typeof value === 'number' &&
        Number.isFinite(value)
      ) {
        return value;
      }
      if (
        typeof value === 'string' &&
        value.trim()
      ) {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }
    }

    return undefined;
  }

  private async handleAxiosError(
    error: unknown,
    context: string,
    requestUrl?: string,
    employeeCode?: string,
  ): Promise<never> {
    if (error instanceof BadGatewayException) {
      throw error;
    }
    if (error instanceof UnauthorizedException) {
      throw error;
    }

    const axiosError = error as AxiosError<
      Record<string, unknown>
    >;
    const status = axiosError.response?.status;
    const errorCode =
      axiosError.code || 'UNKNOWN';
    const responseData =
      axiosError.response?.data;
    const details = String(
      axiosError.response?.data?.message ||
        axiosError.response?.data?.detail ||
        axiosError.message ||
        context,
    );

    this.logger.error(
      `${context}: url=${requestUrl || 'unknown'} code=${errorCode} status=${status || 'no-response'} message=${details}`,
    );
    if (responseData !== undefined) {
      this.logger.error(
        `${context}: response=${JSON.stringify(responseData)}`,
      );
    }

    if (
      errorCode === 'ECONNABORTED' ||
      status === 504
    ) {
      throw new GatewayTimeoutException(
        'Face AI service timed out.',
      );
    }

    if (
      status === 409 ||
      this.isFaceAlreadyEnrolledError(details)
    ) {
      const faceRegistered = employeeCode
        ? await this.resolveFaceRegisteredState(
            employeeCode,
          )
        : false;

      throw new ConflictException({
        message:
          details ||
          'Employee code already enrolled.',
        data: {
          employeeCode,
          faceRegistered,
        },
      });
    }

    if (!status) {
      this.logger.error(
        `${context}: no HTTP response received. This usually means the upstream host/port is unreachable, refused the connection, or timed out.`,
      );
      throw new ServiceUnavailableException(
        'Face AI service is unavailable.',
      );
    }

    if (status === 401 || status === 403) {
      throw new UnauthorizedException(details);
    }

    if (status === 400 || status === 422) {
      throw new BadRequestException(details);
    }

    if (status >= 500) {
      throw new BadGatewayException(details);
    }

    throw new BadGatewayException(details);
  }

  private async resolveFaceRegisteredState(
    employeeCode: string,
  ): Promise<boolean> {
    const user = await (
      this as any
    ).mobileAuthUserModel.findOne({
      where: { employeeCode },
      attributes: ['faceRegistered'],
    });

    return Boolean(user?.faceRegistered);
  }

  private isFaceAlreadyEnrolledError(
    message?: string,
  ): boolean {
    const normalized = message
      ?.trim()
      .toLowerCase();
    if (!normalized) {
      return false;
    }

    return (
      normalized.includes('already enrolled') ||
      normalized.includes('already registered') ||
      normalized.includes(
        'duplicate enrollment',
      ) ||
      normalized.includes('face already exists')
    );
  }

  private normalizeBaseUrl(
    value: string,
    configName: string,
  ): string {
    const sanitized = value.trim();

    try {
      const parsedUrl = new URL(sanitized);
      return parsedUrl.origin;
    } catch {
      throw new BadGatewayException(
        `${configName} is not a valid absolute URL.`,
      );
    }
  }

  private buildUrl(
    baseUrl: string,
    path: string,
  ): string {
    return new URL(
      path,
      `${baseUrl}/`,
    ).toString();
  }

  private buildFaceUploadResult(
    mode: 'registration' | 'verification',
    file: Express.Multer.File,
    authContext?: ForwardAuthContext,
  ): FaceImageUploadResult {
    return {
      url: `temporary://face-auth/${mode}/${Date.now()}-${file.originalname}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      metadata: {
        temporary: true,
        source: 'external-face-auth',
        mode,
        forwardedAuthHeader: Boolean(
          authContext?.authorization,
        ),
        note:
          mode === 'registration'
            ? 'Registration used the outbound face auth API and returned no persisted upload URL.'
            : 'Verification used the outbound face auth API and returned no persisted upload URL.',
      },
    };
  }

  private buildFaceRegistrationResponse(
    user: HrmMobileAuthUser,
    enrollment: FaceEmbeddingResult,
    uploadedImage: FaceImageUploadResult,
  ): FaceRegistrationResponse {
    return {
      id: user.id,
      uuid:
        user.uuid ??
        `${user.employeeCode}-${Date.now()}`,
      employeeId: user.employeeId,
      employeeCode: user.employeeCode,
      faceRegistered: true,
      embeddingAlgorithm:
        enrollment.algorithm ||
        'external-face-auth',
      faceQuality:
        enrollment.quality !== undefined
          ? Number(enrollment.quality)
          : null,
      livenessVerified: enrollment.liveness,
      faceRegisteredAt:
        user.updatedAt ?? new Date(),
      uploadedImages: [
        {
          ...uploadedImage,
          metadata: {
            ...(uploadedImage.metadata || {}),
            externalEnrollment: true,
            employeeCode: user.employeeCode,
            fileName: uploadedImage.originalName,
            imagesAccepted:
              enrollment.imagesAccepted,
            liveness: enrollment.liveness,
            embeddingAlgorithm:
              enrollment.algorithm,
          },
        },
      ],
    };
  }

  private async markFaceRegistered(
    employeeCode: string,
    createdBy?: number,
  ): Promise<HrmMobileAuthUser> {
    const user = await (
      this as any
    ).mobileAuthUserModel.findOne({
      where: { employeeCode },
    });

    if (!user) {
      throw new BadRequestException(
        `Mobile auth user not found for employee code ${employeeCode}.`,
      );
    }

    await user.update({
      faceRegistered: true,
      ...(createdBy !== undefined && {
        updatedBy: createdBy,
      }),
    });

    return user;
  }
}
