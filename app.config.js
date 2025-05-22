module.exports = {
  expo: {
    name: "SipSense",
    slug: "Sipsense",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/sipsenselogo.png",
    scheme: "Sipsense",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    owner:"raina_moon",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.rainamoon.sipsense",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      }
    },
    android: {
      package: "com.mds64.sipsense",
      versionCode: 5,
      adaptiveIcon: {
        foregroundImage: "./assets/images/sipsense.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/sipsense.png",
    },
    plugins: ["expo-font"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      API_URL: "https://sipsense.raina-moon.com/api",
      eas: {
        projectId: "2ab2104b-7930-406d-bd1f-b171cfdb4633",
      },
    },
  },
};
