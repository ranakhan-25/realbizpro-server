export interface FaceEmbeddingResult {
  success: boolean;
  message?: string;
  employeeId: string;
  embedding: number[];
  algorithm: string;
  quality: number;
  liveness: boolean;
  imagesAccepted: number;
}

export interface FaceVerificationResult {
  success: boolean;
  matched: boolean;
  similarityScore: number;
  liveness: {
    isLive: boolean;
  };
  message?: string;
  attendanceCount?: number;
  isLate?: boolean;
  lateMinutes?: number;
  runningMonthLateDays?: number;
  runningMonthLateMinutes?: number;
  attendanceSubmittedSuccessfully?: boolean;
  attendanceStatus?: string;
  attendanceTime?: string;
  shiftInTime?: string;
  shiftOutTime?: string;
  attendanceLocation?: AttendanceLocationResult;
}

export interface AttendanceLocationResult {
  latitude?: string;
  longitude?: string;
  locationName?: string;
  googleMapsUrl?: string;
}

export interface FaceImageUploadResult {
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
  metadata?: Record<string, unknown>;
}

export interface ForwardAuthContext {
  authorization?: string;
}

export interface AttendanceVerificationResult {
  success: boolean;
  employeeCode: string;
  matched: boolean;
  isLive: boolean;
  similarityScore: number;
  message?: string;
  attendanceCount?: number;
  punchType?: 'IN' | 'OUT';
  isLate?: boolean;
  lateMinutes?: number;
  earlyOutMinutes?: number;
  overtimeMinutes?: number;
  remainingMinutesUntilShiftEnd?: number;
  runningMonthLateDays?: number;
  runningMonthLateMinutes?: number;
  attendanceSubmittedSuccessfully?: boolean;
  attendanceStatus?: string;
  attendanceDate?: string;
  attendanceTime?: string;
  shiftInTime?: string;
  shiftOutTime?: string;
  attendanceLocation?: AttendanceLocationResult;
  rawAttendanceTime?: string;
}

export interface FaceRegistrationResponse {
  id: number;
  uuid: string;
  employeeId: number;
  employeeCode: string;
  faceRegistered: boolean;
  embeddingAlgorithm: string;
  faceQuality: number | null;
  livenessVerified: boolean;
  faceRegisteredAt: Date;
  uploadedImages: FaceImageUploadResult[];
}
