// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const reactDoctor = require('eslint-plugin-react-doctor').default;

module.exports = defineConfig([
  expoConfig,
  reactDoctor.configs.recommended,
  reactDoctor.configs['react-native'],
  {
    rules: {
      // React Compiler is not enabled in this project (no babel plugin / no
      // app.json experiments.reactCompiler), so the manual useMemo calls in
      // app/(tabs)/calendar.tsx are load-bearing, not dead weight.
      'react-doctor/react-compiler-no-manual-memoization': 'off',
      // These images are static bundled require() assets, not remote URLs, so
      // expo-image's network caching is moot. expo-image also ships native
      // code, and adding it would invalidate the existing dev-client build
      // currently used for simulator QA. Intentional use of react-native Image.
      'react-doctor/rn-prefer-expo-image': 'off',
      // TouchableOpacity + activeOpacity is a deliberate design choice across
      // these screens; switching to Pressable changes the press-feedback
      // semantics and warrants a design review rather than a lint autofix.
      'react-doctor/rn-prefer-pressable': 'off',
    },
  },
  {
    ignores: ['dist/*'],
  },
  {
    // jest.mock() factories are hoisted, so their module references must use
    // require() rather than a top-level import.
    files: ['**/__tests__/**', '**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]);
