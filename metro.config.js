const { getDefaultConfig } = require("expo/metro-config");
const { withRorkMetro } = require("@rork-ai/toolkit-sdk/metro");

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  fs: require.resolve("./mocks/empty.js"),
  http: require.resolve("./mocks/empty.js"),
  https: require.resolve("./mocks/empty.js"),
  url: require.resolve("./mocks/empty.js"),
  path: require.resolve("./mocks/empty.js"),
  stream: require.resolve("./mocks/empty.js"),
  zlib: require.resolve("./mocks/empty.js"),
};

module.exports = withRorkMetro(config);
