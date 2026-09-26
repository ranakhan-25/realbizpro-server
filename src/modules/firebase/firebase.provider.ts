import * as admin from 'firebase-admin';
import { Provider } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

export const FirebaseProvider: Provider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: () => {
    if (!admin.apps.length) {
      let serviceAccountPath = path.resolve(
        __dirname,
        '../firebase-service-account.json',
      );

      // If not found in modules folder, try root dist
      if (!fs.existsSync(serviceAccountPath)) {
        serviceAccountPath = path.resolve(
          __dirname,
          '../../firebase-service-account.json',
        );
      }

      // If still not found, try project root
      if (!fs.existsSync(serviceAccountPath)) {
        serviceAccountPath = path.resolve(
          process.cwd(),
          'firebase-service-account.json',
        );
      }

      if (!fs.existsSync(serviceAccountPath)) {
        throw new Error(
          `Firebase service account file not found at any expected location`,
        );
      }

      const serviceAccount = JSON.parse(
        fs.readFileSync(
          serviceAccountPath,
          'utf8',
        ),
      );

      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount,
        ),
      });
    }

    return admin;
  },
};
