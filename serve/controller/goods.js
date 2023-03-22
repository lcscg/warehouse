const Goods = require("../db/db").Goods;
//下面这两个包用来生成时间
const moment = require("moment");
const objectIdToTimestamp = require("objectid-to-timestamp");
//数据库的操作
//根据条件查找
const findGoods = (type) => {
  return new Promise((resolve, reject) => {
    Goods.find(type)
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
    msg: "删除成功",
  };
};
// 查询
const getGoods = async (ctx) => {
  const query = ctx.request.query;
  if (query.type) query.type = { $regex: new RegExp(query.type, "i") };
  if (query.type || query.owner || query.genre) {
    console.log("query===", query);
    const data = await findGoods(query);
    ctx.body = {
      code: 200,
      data,
    };
  } else {
    const data = await findAllGoods();
    ctx.body = {
      code: 200,
      data,
    };
  }
};
// 修改
const updateGoods = async (ctx) => {
  const update = {
    type: ctx.request.body.type,
    owner: ctx.request.body.owner,
    genre: ctx.request.body.genre,
    num: Number(ctx.request.body.totalNum) - Number(ctx.request.body.sellNum),
    purchasePrice: ctx.request.body.purchasePrice,
    sellNum: Number(ctx.request.body.sellNum),
    totalNum: Number(ctx.request.body.totalNum),
    remark: ctx.request.body.remark,
  };
  const id = ctx.request.body.id;
  await new Promise((resolve, reject) => {
    Goods.updateOne({ id }, update).then((res) => {
      if (res.acknowledged && res.modifiedCount == 1) {
        console.log(11111111);
        ctx.body = {
          code: 200,
          msg: "修改成功",
        };
        resolve();
      } else {
        console.log(2222222);
        ctx.body = {
          code: 400,
          msg: "修改失败",
        };
        resolve();
      }
    });
  });
};
// 增加新数据
const addGoods = async (ctx) => {
  let goods = new Goods({
    type: ctx.request.body.type,
    owner: ctx.request.body.owner,
    genre: ctx.request.body.genre,
    num: ctx.request.body.totalNum - ctx.request.body.sellNum,
    purchasePrice: ctx.request.body.purchasePrice,
    sellNum: ctx.request.body.sellNum,
    totalNum: ctx.request.body.totalNum,
    remark: ctx.request.body.remark,
  });
  goods.createTime = moment(objectIdToTimestamp(goods._id)).format(
    "YYYY-MM-DD HH:mm:ss"
  );
  await new Promise((resolve, reject) => {
    goods
      .save()
      .then((res) => {
        console.log("res", res);
        ctx.body = {
          code: 200,
          msg: "创建成功",
        };
        resolve();
      })
      .catch((err) => {
        console.log("err", err);
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
