/* eslint-disable import/first */
/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
if (__DEV__) {
  // Load Reactotron in development only.
  // Note that you must be using metro's `inlineRequires` for this to work.
  // If you turn it off in metro.config.js, you'll have to manually import it.
  require("./devtools/ReactotronConfig.ts")
}
import "./utils/gestureHandler"
import { useRootStore } from "./store"
import "./i18n"
import "./utils/ignoreWarnings"
import { useFonts } from "expo-font"
import React, { useEffect } from "react"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import * as Linking from "expo-linking"
import { AppNavigator, useNavigationPersistence } from "./navigators"
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary"
import * as storage from "./utils/storage"
import { customFontsToLoad } from "./theme"
import Config from "./config"
import {Auth0Provider} from 'react-native-auth0';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { requestNotificationPermission, getFirebaseToken, createNotificationChannel, requestPostNotificationPermission } from './services/api/firebaseNotifications';
import * as Notifications from 'expo-notifications';
import BackgroundFetch from 'react-native-background-fetch';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Mensaje recibido en segundo plano:', remoteMessage);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: remoteMessage.notification?.title || 'Notificación',
      body: remoteMessage.notification?.body || 'Tienes un nuevo mensaje',
    },
    trigger: null,
  });
});

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

// Web linking configuration
const prefix = Linking.createURL("/")
const config = {
  screens: {
    Login: {
      path: "",
    },
    Welcome: "welcome",
    Demo: {
      screens: {
        DemoShowroom: {
          path: "showroom/:queryIndex?/:itemIndex?",
        },
        DemoDebug: "debug",
        DemoPodcastList: "podcast",
        DemoCommunity: "community",
      },
    },
  },
}

interface AppProps {
  hideSplashScreen: () => Promise<boolean>
}

/**
 * This is the root component of our app.
 * @param {AppProps} props - The props for the `App` component.
 * @returns {JSX.Element} The rendered `App` component.
 */
function App(props: AppProps) {
  const { hideSplashScreen } = props
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  const [areFontsLoaded] = useFonts(customFontsToLoad)

  const hasHydrated = useRootStore((state) => state._hasHydrated)
  useEffect(() => {
    // If your initialization scripts run very fast, it's good to show the splash screen for just a bit longer to prevent flicker.
    // Slightly delaying splash screen hiding for better UX; can be customized or removed as needed,
    // Note: (vanilla Android) The splash-screen will not appear if you launch your app via the terminal or Android Studio. Kill the app and launch it normally by tapping on the launcher icon. https://stackoverflow.com/a/69831106
    // Note: (vanilla iOS) You might notice the splash-screen logo change size. This happens in debug/development mode. Try building the app for release.
    if (hasHydrated) {
      setTimeout(hideSplashScreen, 500)
    }

    const initializeFirebase = async () => {
      await requestNotificationPermission();
      await requestPostNotificationPermission();
      await createNotificationChannel();
    };

    initializeFirebase();

    const configureBackgroundFetch = () => {
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 15, // Intervalo en minutos (mínimo 15 minutos)
          stopOnTerminate: false,  // Continúa ejecutándose después de que la app se cierre
          startOnBoot: true,       // Comienza al reiniciar el dispositivo
        },
        async (taskId) => {
          console.log('[BackgroundFetch] Tarea ejecutada:', taskId);

          // Aquí haces cualquier lógica en segundo plano, como sincronización de datos
          const token = await getFirebaseToken();
          if (token) {
            console.log('Sincronizando token FCM:', token);
            // Aquí puedes enviar el token al backend o realizar tareas similares
          }

          // Llama a finish() para indicar que la tarea ha terminado
          BackgroundFetch.finish(taskId);
        },
        (error) => {
          console.error('[BackgroundFetch] Error al configurar:', error);
        }
      );

      // Iniciar Background Fetch
      BackgroundFetch.start();
    };

    configureBackgroundFetch();

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Notificación recibida en primer plano:', remoteMessage);
      Alert.alert(
        remoteMessage.notification?.title || 'Notificación',
        remoteMessage.notification?.body || 'Sin contenido'
      );
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notificación que abrió la app:', remoteMessage);
    });

    const checkInitialNotification = async () => {
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        console.log('App abierta desde notificación:', initialNotification);
      }
    };

    checkInitialNotification();

    return unsubscribe;
  }, [hasHydrated])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!hasHydrated || !isNavigationStateRestored || !areFontsLoaded) {
    return null
  }

  const linking = {
    prefixes: [prefix],
    config,
  }

  // Load Auth0 domain and client ID from .env file
  const domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN;
  const clientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID;

  // Assert the environment variables exist
  if (!domain) {
    throw new Error('EXPO_PUBLIC_AUTH0_DOMAIN environment variable is required');
  }
  if (!clientId) {
    throw new Error('EXPO_PUBLIC_AUTH0_CLIENT_ID environment variable is required');
  }

  // otherwise, we're ready to render the app
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
      <Auth0Provider domain={domain} clientId={clientId}>
          <AppNavigator
            linking={linking}
            initialState={initialNavigationState}
            onStateChange={onNavigationStateChange}
          />
        </Auth0Provider>
        <Toast />
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}

export default App
