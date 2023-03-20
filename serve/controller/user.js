const User = require("../db/db").User;
//下面这两个包用来生成时间
const moment = require("moment");
const objectIdToTimestamp = require("objectid-to-timestamp");
//用于密码加密
const sha1 = require("sha1");
//createToken
const createToken = require("../token/createToken.js");
//数据库的操作
//根据用户名查找用户
const findUser = (username) => {
  return new Promise((resolve, reject) => {
    User.findOne({ username })
      .then((user) => {
        resolve(user);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
//找到所有用户
const findAllUsers = () => {
  return new Promise((resolve, reject) => {
    User.find()
      .then((user) => {
        resolve(user);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
//删除某个用户
const delUser = function (id) {
  return new Promise((resolve, reject) => {
    User.findOneAndRemove({ _id: id })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
//登录
const Login = async (ctx) => {
  //拿到账号和密码
  let username = ctx.request.body.username;
  let password = sha1(ctx.request.body.password); //解密
  let doc = await findUser(username);
  if (!doc) {
    ctx.body = {
      code:200,
      msg:'检查到用户名不存在'
    };
  } else if (doc.password === password) {
    //生成一个新的token,并存到数据库
    let token = createToken(username);
    doc.token = token;
    await new Promise((resolve, reject) => {
      doc
        .save()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
    ctx.body = {
      code: 200,
      username,
      token, //登录成功要创建一个新的token,应该存入数据库
      create_time: doc.create_time,
      msg:'登录成功'
    };
  } else {
    console.log("密码错误!");
    
    ctx.body = {
      code:200,
      success: false,
    };
  }
};
//注册
const Reg = async (ctx) => {
  let user = new User({
    username: ctx.request.body.username,
    password: sha1(ctx.request.body.password), //加密
    token: createToken(this.username), //创建token并存入数据库
  });
  //将objectid转换为用户创建时间(可以不用)
  user.create_time = moment(objectIdToTimestamp(user._id)).format(
    "YYYY-MM-DD HH:mm:ss"
  );
  console.log("user====", user);
  let doc = await findUser(user.username);
  if (doc) {
    console.log("用户名已经存在");
    ctx.body = {
      code: 400,
      msg: "用户名已经存在",
    };
  } else {
    await new Promise((resolve, reject) => {
      user
        .save()
        .then((res) => {
          ctx.body = {
            code: 200,
            msg: "注册成功",
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
  }
};
//获得所有用户信息
const GetAllUsers = async (ctx) => {
  //查询所有用户信息
  let doc = await findAllUsers();
  
  ctx.body = {
    code:200,
    succsess: "成功",
    result: doc,
  };
};
//删除某个用户
const DelUser = async (ctx) => {
  //拿到要删除的用户id
  let id = ctx.request.body.id;
  await delUser(id);
  
  ctx.body = {
    code:200,
    success: "删除成功",
  };
};
module.exports = {
  Login,
  Reg,
  GetAllUsers,
  DelUser,
};
