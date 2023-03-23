const Goods = require("../db/db").Goods;
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
  console.log(1111111111111);
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
};
