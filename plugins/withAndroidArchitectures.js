const { withGradleProperties } = require('@expo/config-plugins');

/**
 * Expo config plugin: limit the Android native build to 32- and 64-bit ARM
 * (`armeabi-v7a`, `arm64-v8a`) by setting `reactNativeArchitectures` in
 * gradle.properties. Drops the x86 / x86_64 ABIs (emulator-only), which roughly
 * halves the native-library payload.
 *
 * For the AAB this is what matters: the bundle then contains only the two ARM
 * ABIs, and the Play Store delivers a per-ABI APK to each device — so real
 * phones download just their own ABI. (Standalone universal APKs built via
 * `assembleRelease` also shrink, since x86/x86_64 are no longer compiled in.)
 *
 * The `android/` folder is generated (not committed), so this re-applies on
 * every `expo prebuild`.
 */
const ARCHITECTURES = 'armeabi-v7a,arm64-v8a';

module.exports = function withAndroidArchitectures(config) {
  return withGradleProperties(config, (cfg) => {
    const key = 'reactNativeArchitectures';
    const existing = cfg.modResults.find((item) => item.type === 'property' && item.key === key);
    if (existing) {
      existing.value = ARCHITECTURES;
    } else {
      cfg.modResults.push({ type: 'property', key, value: ARCHITECTURES });
    }
    return cfg;
  });
};
