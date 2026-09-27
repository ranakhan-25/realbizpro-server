import * as admin from 'firebase-admin';
import { Provider } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

export const FirebaseProvider: Provider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: () => {
    if (admin.apps.length) {
      return admin;
    }

    let serviceAccount:
      admin.ServiceAccount | undefined;
    const serviceAccountJson =
      process.env.FIREBASE_SERVICE_ACCOUNT;

    if (serviceAccountJson) {
      try {
        serviceAccount = JSON.parse(
          serviceAccountJson,
        );
      } catch {
        throw new Error(
          'FIREBASE_SERVICE_ACCOUNT must contain valid JSON',
        );
      }
    }

    if (!serviceAccount) {
      const credentialPaths = [
        process.env.GOOGLE_APPLICATION_CREDENTIALS
          ? path.resolve(
              process.cwd(),
              process.env
                .GOOGLE_APPLICATION_CREDENTIALS,
            )
          : undefined,
        path.resolve(
          __dirname,
          '../firebase-service-account.json',
        ),
        path.resolve(
          __dirname,
          '../../firebase-service-account.json',
        ),
        path.resolve(
          __dirname,
          '../../../config/firebase-service-account.json',
        ),
        path.resolve(
          process.cwd(),
          'config/firebase-service-account.json',
        ),
        path.resolve(
          process.cwd(),
          'firebase-service-account.json',
        ),
      ].filter((candidate): candidate is string =>
        Boolean(candidate),
      );

      const serviceAccountPath =
        credentialPaths.find((candidate) =>
          fs.existsSync(candidate),
        );

      if (serviceAccountPath) {
        serviceAccount = JSON.parse(
          fs.readFileSync(
            serviceAccountPath,
            'utf8',
          ),
        );
      }
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount,
        ),
      });
      return admin;
    }

    console.warn(
      'Firebase credentials are not configured. FCM sending is disabled; set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS to enable it.',
    );

    const unavailable = () =>
      new Error(
        'Firebase is not configured. Set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS to enable FCM.',
      );

    return {
      messaging: () => ({
        send: async () => {
          throw unavailable();
        },
        sendEachForMulticast: async () => {
          throw unavailable();
        },
      }),
    } as unknown as typeof admin;
  },
};
