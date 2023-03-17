const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭eslint
  lintOnSave: false,
  // 去除sourceMap
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");
    config.optimization.minimizer("terser").tap((args) => {
      args[0].parallel = 4;
      args[0].terserOptions.compress.warnings = true;
      args[0].terserOptions.compress.drop_debugger = true; // 打掉debug
      args[0].terserOptions.compress.drop_console = true; // 打掉console
      return args;
    });
  },
});
