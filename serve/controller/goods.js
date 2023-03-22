const Goods = require("../db/db").Goods;
//下面这两个包用来生成时间
const moment = require("moment");
const objectIdToTimestamp = require("objectid-to-timestamp");
//用于密码加密
const sha1 = require("sha1");
//createToken
const createToken = require("../token/createToken.js");
//数据库的操作
//根据型号查找
const findGoods = (type) => {
  return new Promise((resolve, reject) => {
    Goods.findOne({ type })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
//找到所有
const findAllGoods = () => {
  return new Promise((resolve, reject) => {
    Goods.find()
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
//删除某个
const delGoods = function (id) {
  return new Promise((resolve, reject) => {
    Goods.findOneAndRemove({ _id: id })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
//删除某个
const DelGoods = async (ctx) => {
  //拿到要删除的用户id
  let id = ctx.request.body.id;
  await delGoods(id);
  ctx.body = {
    code: 200,
    success: "删除成功",
  };
};
// 获取全部
const getGoods = async (ctx) => {
  const data = await findAllGoods();
  ctx.body = {
    code: 200,
    data,
  };
};
// 修改
const updateGoods = async (ctx) => {
  const update = {
    type: ctx.request.body.username,
    owner: ctx.request.body.username,
    genre: ctx.request.body.username,
    num: ctx.request.body.username,
    purchasePrice: ctx.request.body.username,
    sellNum: ctx.request.body.username,
    totalNum: ctx.request.body.username,
    remark: ctx.request.body.username,
  };
  new Promise((resolve, reject) => {
    Goods.updateOne({ id }, update).then((res) => {
      console.log('修改数据返回=======',res);
      ctx.body = {
        code: 200,
        msg: "修改成功",
      };
      resolve();
    });
  });
};
// 增加新数据
const addGoods = async (ctx) => {
  let goods = new Goods({
    type: ctx.request.body.username,
    owner: ctx.request.body.username,
    genre: ctx.request.body.username,
    num: ctx.request.body.username,
    purchasePrice: ctx.request.body.username,
    sellNum: ctx.request.body.username,
    totalNum: ctx.request.body.username,
    remark: ctx.request.body.username,
    createTime: moment(objectIdToTimestamp(goods._id)).format(
      "YYYY-MM-DD HH:mm:ss"
    ),
  });
  new Promise((resolve, reject) => {
    goods
      .save()
      .then((res) => {
        ctx.body = {
          code: 200,
          msg: "创建成功",
        };
        resolve();
      })
      .catch((err) => {
        ctx.body = {
          code: 400,
          msg: err,
        };
        reject();
      });
  });
};
module.exports = {
  getGoods,
  updateGoods,
  DelGoods,
  addGoods,
};
