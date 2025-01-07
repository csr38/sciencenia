import messaging from '@react-native-firebase/messaging';
// eslint-disable-next-line react-native/split-platform-components
import { Platform, PermissionsAndroid } from 'react-native';
import * as Notifications from 'expo-notifications';

export const requestPostNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      // console.log('Permiso para POST_NOTIFICATIONS concedido.');
    } else {
      // console.log('Permiso para POST_NOTIFICATIONS denegado.');
    }
  }
};

export const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log('Permisos de notificación habilitados');
  } else {
    // console.log('Permisos de notificación denegados');
  }
};

export const getFirebaseToken = async (): Promise<string | null> => {
  try {
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    return null;
  }
};

export const createNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default_channel_id', {
      name: 'Default Channel',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
    // console.log('Canal de notificaciones creado');
  }
};