import { ConfigPlugin, withAndroidManifest } from '@expo/config-plugins';
import fs from 'fs';
import path from 'path';

const withCustomManifest: ConfigPlugin = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;

    // Agregar xmlns:tools al manifest
    if (!androidManifest.manifest.$['xmlns:tools']) {
      androidManifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    // Verifica si application está definida
    const application = androidManifest.manifest.application?.[0];
    if (!application) {
      throw new Error('No se encontró el elemento <application> en el AndroidManifest.xml');
    }

    // Asegúrate de que no exista ya el meta-data
    const existingMetaData = application['meta-data'] || [];
    const metaDataExists = existingMetaData.some(
      (item: { $: { 'android:name': string } }) =>
        item.$['android:name'] === 'com.google.firebase.messaging.default_notification_channel_id'
    );

    if (!metaDataExists) {
      (existingMetaData as any).push({
        $: {
          'android:name': 'com.google.firebase.messaging.default_notification_channel_id',
          'android:value': 'default_channel_id',
          'tools:replace': 'android:value',
        },
      });

      application['meta-data'] = existingMetaData;
    }

    // Modificar android/build.gradle para agregar la dependencia
    const buildGradlePath = path.join(config.modRequest.projectRoot, 'android/build.gradle');
    const buildGradle = fs.readFileSync(buildGradlePath, 'utf8');

    let updatedGradle = buildGradle;
    if (!buildGradle.includes("classpath('com.google.gms:google-services:4.4.2')")) {
      updatedGradle = updatedGradle.replace(
        /dependencies \{/,
        match => `${match}\n        classpath('com.google.gms:google-services:4.4.2')`
      );
    }

    // Guardar los cambios en android/build.gradle
    if (updatedGradle !== buildGradle) {
      fs.writeFileSync(buildGradlePath, updatedGradle, 'utf8');
      console.log('Archivo build.gradle actualizado correctamente.');
    } else {
      console.log('No se realizaron cambios en build.gradle.');
    }

    const buildGradleAppPath = path.join(config.modRequest.projectRoot, 'android/app/build.gradle');
    const buildGradleApp = fs.readFileSync(buildGradleAppPath, 'utf8');

    const changes = [
      {
        check: "apply plugin: 'com.google.gms.google-services'",
        searchPattern: /apply plugin: "com.android.application"/,
        replacement: `apply plugin: "com.android.application"\napply plugin: "com.google.gms.google-services"`
      },
      {
        check: "manifestPlaceholders = [auth0Domain: \"scenia-hub.us.auth0.com\", auth0Scheme: \"com.cenia.scienceniahub.auth0\", firebaseNotificationChannel: \"default_channel_id\"]",
        searchPattern: /\/\/ @generated begin react-native-auth0-manifest-placeholder[^]*?\/\/ @generated end react-native-auth0-manifest-placeholder/,
        replacement: `    // @generated begin react-native-auth0-manifest-placeholder - expo prebuild (DO NOT MODIFY) sync-85ed9668b18d9009b0fa04a96457e3e617fa75f0
        manifestPlaceholders = [auth0Domain: "scenia-hub.us.auth0.com", auth0Scheme: "com.cenia.scienceniahub.auth0", firebaseNotificationChannel: "default_channel_id"]
        // @generated end react-native-auth0-manifest-placeholder`
      },
      {
        check: "implementation platform('com.google.firebase:firebase-bom:33.6.0')",
        searchPattern: /dependencies \{/,
        replacement: `dependencies {\n    implementation platform('com.google.firebase:firebase-bom:33.6.0')`
      },
      {
        check: "implementation 'com.google.firebase:firebase-analytics'",
        searchPattern: /dependencies \{/,
        replacement: `dependencies {\n    implementation 'com.google.firebase:firebase-analytics'`
      }
    ];

    let updatedGradleApp = buildGradleApp;

    changes.forEach(({ check, searchPattern, replacement }) => {
      if (!buildGradleApp.includes(check)) {
        if (searchPattern.test(buildGradleApp)) {
          // Reemplazar el bloque completo, incluyendo comentarios generados
          updatedGradleApp = updatedGradleApp.replace(searchPattern, replacement);
        } else {
          // Insertar manualmente si no existe el bloque
          const insertAt = replacement.includes('manifestPlaceholders')
            ? /defaultConfig \{/ // Insertar en defaultConfig
            : /dependencies \{/; // Insertar en dependencies
    
          updatedGradleApp = updatedGradleApp.replace(
            insertAt,
            match => `${match}\n    ${replacement}`
          );
        }
      }
    });
    

    if (updatedGradleApp !== buildGradleApp) {
      fs.writeFileSync(buildGradleAppPath, updatedGradleApp, 'utf8');
      console.log('Archivo app/build.gradle actualizado correctamente.');
    } else {
      console.log('No se realizaron cambios en app/build.gradle.');
    }

    return config;
  });
};

export default withCustomManifest;