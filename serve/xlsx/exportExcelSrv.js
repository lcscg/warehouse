//接收上传的excel文件，保存解析返回objects
const xlsx = require("node-xlsx");
const fs = require("fs");
const path = require("path");

async function exExcel(ctx, data, options, url) {
  const buffer = xlsx.build([{ name: "Sheet1", data: data, options: options }]);
  const filePath = path.resolve(__dirname, url);
  fs.writeFile(filePath, buffer, function (err) {
    if (err) throw err;
    console.log("导出成功！");
  });
}

module.exports = {
  exExcel,
};
