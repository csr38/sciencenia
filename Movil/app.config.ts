import { ExpoConfig, ConfigContext } from "@expo/config"

/**
 * Use ts-node here so we can use TypeScript for our Config Plugins
 * and not have to compile them to JavaScript
 */
require("ts-node/register")

/**
 * @param config ExpoConfig coming from the static config app.json if it exists
 * 
 * You can read more about Expo's Configuration Resolution Rules here:
 * https://docs.expo.dev/workflow/configuration/#configuration-resolution-rules
 */
module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  const existingPlugins = config.plugins ?? []

  return {
    extra: {
      eas: {
        projectId: "10970d21-9101-47ec-b134-073fa7d604e0"
      }
    },
    ...config,
    plugins: [
      ...existingPlugins,
      require("./plugins/withCustomManifest").default,
      // require("./plugins/withSplashScreen").withSplashScreen,
      [
        "react-native-auth0",
        {
          domain: "scenia-hub.us.auth0.com",
        },
      ],
    ],
  }
}
