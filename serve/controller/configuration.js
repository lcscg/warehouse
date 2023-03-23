const Configuration = require("../db/db").Configuration;
//数据库的操作
//根据条件查找
const findConfiguration = (type) => {
  return new Promise((resolve, reject) => {
    Configuration.find(type)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// 查询
const getConfiguration = async (ctx) => {
  const query = ctx.request.query;
  const data = await findConfiguration(query);
  ctx.body = {
    code: 200,
    data:data[0].configurationData,
  };
};
// 修改
const updateConfiguration = async (ctx) => {
  const update = {
    configurationData: ctx.request.body.data,
  };
  const type = ctx.request.body.type;
  await new Promise((resolve, reject) => {
    Configuration.updateOne({ type }, update).then((res) => {
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

module.exports = {
  getConfiguration,
  updateConfiguration,
};
