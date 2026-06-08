// Dynamic Expo config. `app.json` remains the source of truth for all static
// config — Expo passes it in as `config` here, and we only override the Android
// versionCode so CI can auto-increment it per release (Play Store rejects
// duplicate versionCodes).
//
// `ANDROID_VERSION_CODE` is set by the CI build (to github.run_number). When it
// is unset (local dev) we fall back to the value in app.json.
module.exports = ({ config }) => {
  const fromEnv = parseInt(process.env.ANDROID_VERSION_CODE ?? '', 10);
  const versionCode = Number.isFinite(fromEnv) ? fromEnv : (config.android?.versionCode ?? 1);

  // Google Sign-In on iOS needs the reversed iOS client ID as a URL scheme.
  // Derive it from the iOS client ID env so it isn't hardcoded; when unset the
  // plugin is left as-is (Android/dev unaffected).
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';
  const iosUrlScheme = iosClientId
    ? `com.googleusercontent.apps.${iosClientId.replace('.apps.googleusercontent.com', '')}`
    : '';
  const plugins = (config.plugins ?? []).map((plugin) => {
    const name = Array.isArray(plugin) ? plugin[0] : plugin;
    if (name === '@react-native-google-signin/google-signin' && iosUrlScheme) {
      return [name, { iosUrlScheme }];
    }
    return plugin;
  });

  return {
    ...config,
    android: {
      ...config.android,
      versionCode,
    },
    plugins,
  };
};
