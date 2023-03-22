//server.js
const Koa = require("koa");
const app = new Koa();
//router
const Router = require("koa-router");
//父路由
const router = new Router();
//bodyparser:该中间件用于post请求的数据
const bodyParser = require("koa-bodyparser");
app.use(bodyParser());
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
const updateGoodsRouter = new Router();
updateGoodsRouter.post("/updateGoods", checkToken, GoodsController.updateGoods);
const DelGoodsRouter = new Router();
DelGoodsRouter.post("/delGoods", checkToken, GoodsController.DelGoods);
const addGoodsRouter = new Router();
addGoodsRouter.post("/addGoods", checkToken, GoodsController.addGoods);

// 配置项
const getConfigurationRouter = new Router();
getConfigurationRouter.get("/getConfiguration", checkToken, Configuration.getConfiguration);
const updateConfigurationRouter = new Router();
updateConfigurationRouter.post("/updateConfiguration", checkToken, Configuration.updateConfiguration);

router.use("/api", getConfigurationRouter.routes(), getConfigurationRouter.allowedMethods());
router.use("/api", updateConfigurationRouter.routes(), updateConfigurationRouter.allowedMethods());


router.use("/api", getGoodsRouter.routes(), getGoodsRouter.allowedMethods());
router.use("/api", updateGoodsRouter.routes(), updateGoodsRouter.allowedMethods());
router.use("/api", DelGoodsRouter.routes(), DelGoodsRouter.allowedMethods());
router.use("/api", addGoodsRouter.routes(), addGoodsRouter.allowedMethods());

//装载上面四个子路由
router.use("/api", loginRouter.routes(), loginRouter.allowedMethods());
router.use("/api", registerRouter.routes(), registerRouter.allowedMethods());
router.use("/api", userRouter.routes(), userRouter.allowedMethods());
router.use("/api", delUserRouter.routes(), delUserRouter.allowedMethods());


//加载路由中间件
app.use(router.routes()).use(router.allowedMethods());
app.listen(8888, () => {
  console.log("The server is running at http://localhost:" + 8888);
});
