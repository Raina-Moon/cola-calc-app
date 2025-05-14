module.exports = {
  expo: {
    name: "cola-calc-app",
    slug: "cola-calc-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/sipsense.png",
    scheme: "colacalcapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
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
    plugins: [],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      API_URL: "http://54.161.66.184:5000/api",
    },
  },
};
