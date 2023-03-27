//server.js
const Koa = require("koa");
const app = new Koa();
//router
const Router = require("koa-router");
//父路由
const router = new Router();
const koaBody = require("koa-body");
const static = require("koa-static");
//__dirname为文件所在的当前目录，app.js所在就是为根目录，这样我们可以直接localhost:3001/文件名，以此来读取文件
app.use(
  static(__dirname + "/download", {
    index: false, // 默认为true  访问的文件为index.html  可以修改为别的文件名或者false
    hidden: false, // 是否同意传输隐藏文件
    defer: true, // 如果为true，则在返回next()之后进行服务，从而允许后续中间件先进行响应
  })
);
// 注册中间件
app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小限制，默认格式: 2MB
    },
  })
);
//引入数据库操作方法
const UserController = require("./controller/user.js");
const GoodsController = require("./controller/goods.js");
const Configuration = require("./controller/configuration.js");

//checkToken作为中间件存在
const checkToken = require("./token/checkToken.js");
//登录
const loginRouter = new Router();
loginRouter.post("/login", UserController.Login);
//注册
const registerRouter = new Router();
registerRouter.post("/register", UserController.Reg);
//获取所有用户
const userRouter = new Router();
userRouter.get("/user", checkToken, UserController.GetAllUsers);
//删除某个用户
const delUserRouter = new Router();
delUserRouter.post("/delUser", checkToken, UserController.DelUser);

// 更新仓库
const getGoodsRouter = new Router();
getGoodsRouter.get("/getGoods", checkToken, GoodsController.getGoods);
const getSellRouter = new Router();
getSellRouter.get("/getSell", checkToken, GoodsController.getSell);
const updateGoodsRouter = new Router();
updateGoodsRouter.post("/updateGoods", checkToken, GoodsController.updateGoods);
const DelGoodsRouter = new Router();
DelGoodsRouter.post("/delGoods", checkToken, GoodsController.DelGoods);
const addGoodsRouter = new Router();
addGoodsRouter.post("/addGoods", checkToken, GoodsController.addGoods);
const uploadRouter = new Router();
uploadRouter.post("/upload", checkToken, GoodsController.upload);
const exportRouter = new Router();
exportRouter.get("/exportExcel", checkToken, GoodsController.exportExcel);
const delArrayRouter = new Router();
delArrayRouter.post("/delArrayGoods", checkToken, GoodsController.delArrayGoods);
const sellGoodsRouter = new Router();
sellGoodsRouter.post("/sellGoods", checkToken, GoodsController.sellGoods);

// 配置项
const getConfigurationRouter = new Router();
getConfigurationRouter.get(
  "/getConfiguration",
  checkToken,
  Configuration.getConfiguration
);
const updateConfigurationRouter = new Router();
updateConfigurationRouter.post(
  "/updateConfiguration",
  checkToken,
  Configuration.updateConfiguration
);

router.use(
  "/api",
  getConfigurationRouter.routes(),
  getConfigurationRouter.allowedMethods()
);
router.use(
  "/api",
  updateConfigurationRouter.routes(),
  updateConfigurationRouter.allowedMethods()
);

router.use("/api", getGoodsRouter.routes(), getGoodsRouter.allowedMethods());
router.use(
  "/api",
  updateGoodsRouter.routes(),
  updateGoodsRouter.allowedMethods()
);
router.use("/api", exportRouter.routes(), exportRouter.allowedMethods());
router.use("/api", DelGoodsRouter.routes(), DelGoodsRouter.allowedMethods());
router.use("/api", addGoodsRouter.routes(), addGoodsRouter.allowedMethods());
router.use("/api", uploadRouter.routes(), uploadRouter.allowedMethods());
router.use("/api", delArrayRouter.routes(), delArrayRouter.allowedMethods());
router.use("/api", sellGoodsRouter.routes(), sellGoodsRouter.allowedMethods());

//装载上面四个子路由
router.use("/api", loginRouter.routes(), loginRouter.allowedMethods());
router.use("/api", registerRouter.routes(), registerRouter.allowedMethods());
router.use("/api", userRouter.routes(), userRouter.allowedMethods());
router.use("/api", delUserRouter.routes(), delUserRouter.allowedMethods());
router.use("/api", getSellRouter.routes(), getSellRouter.allowedMethods());

//加载路由中间件
app.use(router.routes()).use(router.allowedMethods());
app.listen(8888, () => {
  console.log("The server is running at http://localhost:" + 8888);
});
