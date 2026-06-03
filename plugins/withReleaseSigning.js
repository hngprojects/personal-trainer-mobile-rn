const { Buffer } = require('buffer');
const fs = require('fs');
const path = require('path');
const {
  withAppBuildGradle,
  withGradleProperties,
  withDangerousMod,
} = require('@expo/config-plugins');

/**
 * Expo config plugin: sign the Android `release` build type with a real release
 * keystore instead of the debug key.
 *
 * The `android/` folder is generated (not committed), so this re-applies the
 * change on every `expo prebuild`. Credentials come from `.env` (also not
 * committed) — Expo loads .env into process.env when evaluating the config, and
 * because none are prefixed `EXPO_PUBLIC_`, they are never bundled into the app:
 *
 *   ANDROID_RELEASE_KEYSTORE_PATH       path to the .keystore (rel. to project root or absolute)
 *   ANDROID_RELEASE_KEYSTORE_BASE64     optional base64 of the keystore (CI); decoded to PATH
 *   ANDROID_RELEASE_KEY_ALIAS           key alias
 *   ANDROID_RELEASE_KEYSTORE_PASSWORD   keystore password
 *   ANDROID_RELEASE_KEY_PASSWORD        key password (defaults to keystore password)
 *
 * On prebuild this plugin: (1) patches app/build.gradle to point the release
 * build type at a release signingConfig, (2) materialises the keystore from
 * base64 when provided, and (3) writes the credentials into
 * android/gradle.properties (gitignored). When the env vars are absent the
 * release build transparently falls back to the debug key, so it never breaks.
 */
const GRADLE_PROP_STORE_FILE = 'FITCALL_RELEASE_STORE_FILE';
const GRADLE_PROP_STORE_PASSWORD = 'FITCALL_RELEASE_STORE_PASSWORD';
const GRADLE_PROP_KEY_ALIAS = 'FITCALL_RELEASE_KEY_ALIAS';
const GRADLE_PROP_KEY_PASSWORD = 'FITCALL_RELEASE_KEY_PASSWORD';

const RELEASE_SIGNING_CONFIG = `
        release {
            if (project.hasProperty('${GRADLE_PROP_STORE_FILE}')) {
                storeFile file(${GRADLE_PROP_STORE_FILE})
                storePassword ${GRADLE_PROP_STORE_PASSWORD}
                keyAlias ${GRADLE_PROP_KEY_ALIAS}
                keyPassword ${GRADLE_PROP_KEY_PASSWORD}
            }
        }`;

function readSigningEnv() {
  const storePassword = process.env.ANDROID_RELEASE_KEYSTORE_PASSWORD || '';
  const keyPassword = process.env.ANDROID_RELEASE_KEY_PASSWORD || storePassword;
  const keyAlias = process.env.ANDROID_RELEASE_KEY_ALIAS || '';
  const keystorePath = process.env.ANDROID_RELEASE_KEYSTORE_PATH || '';
  const keystoreBase64 = process.env.ANDROID_RELEASE_KEYSTORE_BASE64 || '';
  // Treat signing as configured only when we have a password, alias, and a way
  // to obtain the keystore (a path or inline base64).
  const configured = Boolean(storePassword && keyAlias && (keystorePath || keystoreBase64));
  return { storePassword, keyPassword, keyAlias, keystorePath, keystoreBase64, configured };
}

function resolveKeystoreAbs(projectRoot, keystorePath) {
  const p = keystorePath || 'fitcall-release.keystore';
  return path.isAbsolute(p) ? p : path.resolve(projectRoot, p);
}

// When the release credentials are present, both build types sign with the
// release key; otherwise they keep the debug key. Signing the debug build with
// the release key means `expo run:android` (dev) produces the SAME signing
// SHA-1 as release, so Google Sign-In / Firebase only need that one SHA-1.
const SIGNING_CONFIG_SELECTOR = `signingConfig project.hasProperty('${GRADLE_PROP_STORE_FILE}') ? signingConfigs.release : signingConfigs.debug`;

function applyReleaseSigning(contents) {
  let next = contents;

  // 1. Add a `release` signingConfig after the `debug { ... }` block, once.
  if (!next.includes(GRADLE_PROP_STORE_FILE)) {
    next = next.replace(
      /(signingConfigs\s*\{\s*debug\s*\{[\s\S]*?\}\s*)\}/,
      (_match, debugBlock) => `${debugBlock}${RELEASE_SIGNING_CONFIG}\n    }`,
    );
  }

  // 2. debug build type → release key when configured (dev builds match the
  //    registered release SHA-1).
  next = next.replace(
    /(buildTypes\s*\{\s*debug\s*\{\s*)signingConfig\s+signingConfigs\.debug/,
    `$1${SIGNING_CONFIG_SELECTOR}`,
  );

  // 3. release build type → release key when configured (debug fallback).
  next = next.replace(
    /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig\s+signingConfigs\.debug/,
    `$1${SIGNING_CONFIG_SELECTOR}`,
  );

  return next;
}

module.exports = function withReleaseSigning(config) {
  const env = readSigningEnv();

  // Always patch build.gradle so the release signingConfig exists; it only
  // takes effect when the gradle property below is present.
  config = withAppBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== 'groovy') {
      throw new Error('withReleaseSigning: expected app/build.gradle to be Groovy.');
    }
    cfg.modResults.contents = applyReleaseSigning(cfg.modResults.contents);
    return cfg;
  });

  if (!env.configured) {
    // No signing env provided → leave the debug fallback in place.
    return config;
  }

  // Materialise the keystore from base64 (CI / fresh clone) when provided.
  config = withDangerousMod(config, [
    'android',
    (cfg) => {
      const abs = resolveKeystoreAbs(cfg.modRequest.projectRoot, env.keystorePath);
      if (env.keystoreBase64) {
        fs.mkdirSync(path.dirname(abs), { recursive: true });
        fs.writeFileSync(abs, Buffer.from(env.keystoreBase64, 'base64'));
      } else if (!fs.existsSync(abs)) {
        console.warn(
          `[withReleaseSigning] Keystore not found at ${abs} and ANDROID_RELEASE_KEYSTORE_BASE64 is unset — the release build will fail to sign.`,
        );
      }
      return cfg;
    },
  ]);

  // Write the credentials Gradle reads at build time into gradle.properties.
  config = withGradleProperties(config, (cfg) => {
    const abs = resolveKeystoreAbs(cfg.modRequest.projectRoot, env.keystorePath).replace(
      /\\/g,
      '/',
    );
    const upsert = (key, value) => {
      const item = cfg.modResults.find((i) => i.type === 'property' && i.key === key);
      if (item) item.value = value;
      else cfg.modResults.push({ type: 'property', key, value });
    };
    upsert(GRADLE_PROP_STORE_FILE, abs);
    upsert(GRADLE_PROP_KEY_ALIAS, env.keyAlias);
    upsert(GRADLE_PROP_STORE_PASSWORD, env.storePassword);
    upsert(GRADLE_PROP_KEY_PASSWORD, env.keyPassword);
    return cfg;
  });

  return config;
};
