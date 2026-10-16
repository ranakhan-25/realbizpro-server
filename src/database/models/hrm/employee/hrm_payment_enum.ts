/* eslint-disable prettier/prettier */

// Ei file e kono import nei, tai circular import hoy na.
// Allowance ar SaturationDeduction duto model ei file theke enum nibe.

export enum AllowanceType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export enum PaymentType {
  MONTHLY = 'monthly',
  DAILY = 'daily',
  HOURLY = 'hourly',
}
