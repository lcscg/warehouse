const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port: 8080, // 端口号
    hot: true, //热更新
    proxy: {
      // 配置跨域
      "/api": {
        target: "http://localhost:8888",
        changeOrigin: true, //改变源
        pathRewrite: {
          "^/": "",
        },
      },
    },
  },
});
