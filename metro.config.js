const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
require('./scripts/env-config.cjs').generate();

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
