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

  return {
    ...config,
    android: {
      ...config.android,
      versionCode,
    },
  };
};
