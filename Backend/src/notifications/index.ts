import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import type { ServiceAccount } from 'firebase-admin';

let firebaseInitialized = false;

if (process.env.FIREBASE_CREDENTIALS) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
    });
    firebaseInitialized = true;
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
  }
} else {
  console.warn('FIREBASE_CREDENTIALS environment variable is not defined. Notifications will not be sent.');
}

export const sendPushNotification = async (token: string, title: string, body: string) => {
  if (!firebaseInitialized) {
    console.warn('Firebase is not initialized. Skipping push notification.');
    return;
  }

  if (!token || !title || !body) {
    console.error('Token, title and body are required');
    return;
  }

  const message = {
    notification: {
      title,
      body,
    },
    token,
  };

  try {
    const response = await getMessaging().send(message);
    console.log('Notification sent:', response);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};