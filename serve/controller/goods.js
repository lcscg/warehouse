const Goods = require("../db/db").Goods;
const Sell = require("../db/db").Sell;
//下面这两个包用来生成时间
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const uploadExcelSrv = require("../xlsx/uploadExcelSrv");
const exportExcelSrv = require("../xlsx/exportExcelSrv");
const objectIdToTimestamp = require("objectid-to-timestamp");
const { set } = require("nprogress");
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

// 批量删除

const delArrayGoods = async (ctx) => {
  //拿到要删除的用户id
  console.log(ctx.request.body);
  let ids = ctx.request.body.ids;
  console.log(1111111111111);
  const res = await Goods.deleteMany({
    _id: { $in: ids },
  });
  console.log(`Deleted ${res.deletedCount} documents`);
  ctx.body = {
    code: 200,
    msg: "删除成功",
  };
};
// 查询
const getGoods = async (ctx) => {
  const query = ctx.request.query;
  // 数量
  const limit = parseInt(ctx.request.query.limit) || 10;
  // 页码
  const page = parseInt(ctx.request.query.page);
  const skip = (page - 1) * limit;

  if (query.type) query.type = { $regex: new RegExp(query.type, "i") };
  if (query.type || query.owner || query.genre) {
    delete query.limit
    delete query.pages
    delete query.page
    delete query.total
    const data = await Goods.find(query).skip(skip).limit(limit);
    const total = await Goods.countDocuments(query);
    ctx.body = {
      code: 200,
      data,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  } else {
    const data = await Goods.find().skip(skip).limit(limit);
    const total = await Goods.countDocuments();
    ctx.body = {
      code: 200,
      data,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }
};

// 出售记录
const getSell = async (ctx) => {
  const query = ctx.request.query;
  // 数量
  const limit = parseInt(ctx.request.query.limit) || 10;
  // 页码
  const page = parseInt(ctx.request.query.page);
  const skip = (page - 1) * limit;

  if (query.type) query.type = { $regex: new RegExp(query.type, "i") };
  if (query.type) {
    const data = await Sell.find({ type: query.type }).skip(skip).limit(limit);
    const total = await Sell.countDocuments(query);
    ctx.body = {
      code: 200,
      data,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  } else {
    const data = await Sell.find().skip(skip).limit(limit);
    const total = await Sell.countDocuments();
    ctx.body = {
      code: 200,
      data,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
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
        ctx.body = {
          code: 200,
          msg: "修改成功",
        };
        resolve();
      } else {
        ctx.body = {
          code: 400,
          msg: "修改失败",
        };
        resolve();
      }
    });
  });
};
// 出售
const sellGoods = async (ctx) => {
  // 出售
  let sell = new Sell({
    type: ctx.request.body.type,
    purchasePrice: ctx.request.body.purchasePrice,
    sellPrice: ctx.request.body.sellPrice,
    sellNum: Number(ctx.request.body.sell),
    remark: ctx.request.body.remark2,
  });
  sell.createTime = moment(objectIdToTimestamp(sell._id)).format(
    "YYYY-MM-DD HH:mm:ss"
  );
  sell.save().then((res) => {
    ctx.body = {
      code: 200,
      msg: "出售成功",
    };
  });
  // 更新仓库
  const data = await findGoods({ _id: ctx.request.body._id });
  console.log(data);
  const sellNum = data[0].sellNum + Number(ctx.request.body.sell);
  const update = {
    num: Number(ctx.request.body.totalNum) - sellNum,
    sellPrice: ctx.request.body.sellPrice,
    sellNum: sellNum,
    totalNum: Number(ctx.request.body.totalNum),
    remark: ctx.request.body.remark,
  };
  const id = ctx.request.body.id;
  await Goods.updateOne({ id }, update);
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
// 导入excel
const upload = async (ctx) => {
  const getRes = await uploadExcelSrv.getExcelObjs(ctx);
  await new Promise((resolve, reject) => {
    if (getRes.status) {
      if (getRes.datas.length > 1) {
        console.log("暂时不支持多个sheet存在");
      } else {
        //得到的是数组
        const objs = getRes.datas[0];
        const data = objs.map((item) => {
          return {
            type: item["型号"],
            owner: item["所属人"],
            genre: item["类型"],
            num: item["库存数量"],
            purchasePrice: item["买入价格"],
            sellNum: item["卖出数量"],
            totalNum: item["总数量"],
            remark: item["备注"],
          };
        });
        Goods.insertMany(data).then((res) => {
          ctx.body = {
            code: 200,
            msg: "导入成功",
          };
          // 定义要删除的文件路径
          const filePath = path.join(__dirname, "../fileUpload/" + getRes.name);
          // 确认文件存在
          if (fs.existsSync(filePath)) {
            // 删除文件
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(err);
                return;
              }
              console.log("文件已删除");
            });
          } else {
            console.log("文件不存在");
          }
          resolve();
        });
      }
    }
  });
};
// 导出excel
const exportExcel = async (ctx) => {
  const data = await findAllGoods();
  const dbData = [
    [
      "型号",
      "所属人",
      "类型",
      "库存数量",
      "买入价格",
      "卖出数量",
      "总数量",
      "备注",
    ],
  ];
  data.forEach((item) => {
    dbData.push([
      item.type,
      item.owner,
      item.genre,
      item.num,
      item.purchasePrice,
      item.sellNum,
      item.totalNum,
      item.remark,
    ]);
  });
  const options = {
    "!cols": [{ width: 15 }, { width: 10 }, { width: 10 }],
  };
  const url = "../download/仓库.xlsx";
  await exportExcelSrv.exExcel(ctx, dbData, options, url);
  ctx.body = {
    code: 200,
    url: "http://localhost:8888/仓库.xlsx",
  };
};
module.exports = {
  getGoods,
  updateGoods,
  DelGoods,
  addGoods,
  upload,
  exportExcel,
  delArrayGoods,
  sellGoods,
  getSell,
};
