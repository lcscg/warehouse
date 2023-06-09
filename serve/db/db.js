//db.js
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/warehouse");
let db = mongoose.connection;
// 防止Mongoose: mpromise 错误
mongoose.Promise = global.Promise;
db.on("error", function () {
  console.log("数据库连接出错！");
});
db.on("open", function () {
  console.log("数据库连接成功！");
});
//声明schema
// 用户
const userSchema = mongoose.Schema({
  username: String,
  password: String,
  token: String,
  create_time: Date,
});

// 仓库
const goodSchema = mongoose.Schema({
  type: String,
  owner: String,
  genre: String,
  num: Number,
  purchasePrice: {
    type: String,
    required: true,
    get: function (price) {
      return new Intl.NumberFormat("zh-CN", {
        style: "currency",
        currency: "CNY",
      }).format(price);
    },
  },
  sellPrice: {
    type: String,
    required: true,
    get: function (price) {
      return new Intl.NumberFormat("zh-CN", {
        style: "currency",
        currency: "CNY",
      }).format(price);
    },
  },
  sellNum: Number,
  totalNum: Number,
  remark: String,
  createTime: Date,
});
// 出售记录
const sellSchema = mongoose.Schema({
  type: String,
  purchasePrice: {
    type: String,
    required: true,
    get: function (price) {
      return new Intl.NumberFormat("zh-CN", {
        style: "currency",
        currency: "CNY",
      }).format(price);
    },
  },
  sellPrice: {
    type: String,
    required: true,
    get: function (price) {
      return new Intl.NumberFormat("zh-CN", {
        style: "currency",
        currency: "CNY",
      }).format(price);
    },
  },
  sellNum: Number,
  remark: String,
  createTime: Date,
});
// 配置项
const configurationSchema = mongoose.Schema({
  type: Number, // 0:所属人,1:类型
  configurationData: Array,
});

//根据schema生成model
const model = {
  User: mongoose.model("User", userSchema),
  Goods: mongoose.model("Goods", goodSchema),
  Configuration: mongoose.model("Configuration", configurationSchema),
  Sell: mongoose.model("Sell", sellSchema),
};
module.exports = model;
