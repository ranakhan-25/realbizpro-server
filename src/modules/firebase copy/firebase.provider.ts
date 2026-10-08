import * as admin from 'firebase-admin';
import { Provider } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

export const FirebaseProvider: Provider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: (): any => {
    // If Firebase is already initialized, return the existing app
    if (admin.apps.length > 0) {
      return admin.app();
    }

    try {
      let serviceAccount:
        | admin.ServiceAccount
        | undefined;

      // 1. Try to get from environment variable (JSON string)
      const envServiceAccount =
        process.env.FIREBASE_SERVICE_ACCOUNT;
      if (envServiceAccount) {
        try {
          serviceAccount = JSON.parse(
            envServiceAccount,
          );
          console.log(
            'Firebase: Initializing using environment variable.',
          );
        } catch (e) {
          console.error(
            'Firebase: Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable.',
          );
        }
      }

      // 2. Try to get from file if not found in env
      if (!serviceAccount) {
        const serviceAccountPath = path.resolve(
          __dirname,
          '../../../config/firebase-service-account.json',
        );

        if (fs.existsSync(serviceAccountPath)) {
          serviceAccount = JSON.parse(
            fs.readFileSync(
              serviceAccountPath,
              'utf8',
            ),
          );
          console.log(
            'Firebase: Initializing using service account file.',
          );
        }
      }

      if (serviceAccount) {
        return admin.initializeApp({
          credential: admin.credential.cert(
            serviceAccount,
          ),
        });
      }

      // 3. Fallback: Mock implementation to avoid crashing the app
      console.warn(
        'Firebase: No service account found. Firebase features will be disabled.',
      );

      // Return a mock object that mimics firebase-admin for methods used in the app
      return {
        messaging: () => ({
          send: async (message: any) => {
            console.warn(
              'Firebase: messaging().send() called but Firebase is not configured.',
            );
            return 'mock-message-id';
          },
          sendEachForMulticast: async (
            message: any,
          ) => {
            console.warn(
              'Firebase: messaging().sendEachForMulticast() called but Firebase is not configured.',
            );
            return {
              successCount: 0,
              failureCount: 0,
              responses: [],
            };
          },
        }),
      } as any;
    } catch (error) {
      console.error(
        'Firebase: Unexpected error during initialization:',
        error,
      );
      // Still return a mock to avoid crashing the whole app
      return {
        messaging: () => ({
          send: async () => {
            throw new Error(
              'Firebase not configured',
            );
          },
          sendEachForMulticast: async () => {
            throw new Error(
              'Firebase not configured',
            );
          },
        }),
      } as any;
    }
  },
};
