export enum PfStatusEnum {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export enum PfLoanApplicationTypeEnum {
  NEW_LOAN = 'NEW_LOAN',
  LOAN_OPENING = 'LOAN_OPENING',
}

export enum PfLoanStatusEnum {
  WAITING = 'WAITING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  PAID = 'PAID',
}

export enum PfInterestMethodEnum {
  NO_INTEREST = 'NO_INTEREST',
  FLAT_RATE = 'FLAT_RATE',
  REDUCING_BALANCE = 'REDUCING_BALANCE',
}

export enum PfServiceAgeFromEnum {
  JOINING_DATE = 'JOINING_DATE',
  CONFIRMATION_DATE = 'CONFIRMATION_DATE',
}

export enum PfDeductOnEnum {
  GROSS = 'GROSS',
  BASIC = 'BASIC',
  ELIGIBLE_SALARY = 'ELIGIBLE_SALARY',
  FIXED = 'FIXED',
}
