//接口模块
//后台模块
var express = require('express'),
	router = express.Router(),
	User = require('../models/User.js');

//统一返回格式
var responseData;

router.use(function(req,res,next){
	responseData = {
		code: 1 ,
		msg:''
	}
	next();
});

//注册
router.post('/user/register',function(req,res,next){
	console.log(req.body);
	var username = req.body.username;
	var password = req.body.password;
	var repassword = req.body.repassword;

	//基础逻辑判断
	if(username === ''){
		responseData.code = 0;
		responseData.msg = '用户名不能为空';
		res.json(responseData);
		return ;
	}

	if(password === ''){
		responseData.code = 0;
		responseData.msg = '密码不能为空';
		res.json(responseData);
		return ;
	}

	if(password !== repassword){
		responseData.code = 0;
		responseData.msg = '两次输入密码不一致';
		res.json(responseData);
		return ;
	}

	//检查用户名
	User.findOne({
		username:username
	})
	.then(function(userInfo){
		console.log(userInfo);
		if(userInfo){
			responseData.code = 0;
			responseData.msg = '该用户名已经被注册';
			res.json(responseData);
			return ;
		}
		var user = new User({
			username:username,
			password:password
		});
		return user.save();
	})
	.then(function(newUserInfo){
		responseData.msg = '注册成功';
		res.json(responseData);
	})

});

//登录
router.post('/user/login',function(req,res,next){
	console.log(req.body);
	var username = req.body.username;
	var password = req.body.password;

	//基础逻辑判断
	if(username === ''){
		responseData.code = 0;
		responseData.msg = '用户名不能为空';
		res.json(responseData);
		return ;
	}

	if(password === ''){
		responseData.code = 0;
		responseData.msg = '密码不能为空';
		res.json(responseData);
		return ;
	}

	//检查用户名
	User.findOne({
		username:username,
		password:password
	})
	.then(function(userInfo){
		console.log(userInfo);
		if(!userInfo){
			responseData.code = 0;
			responseData.msg = '该用户名或密码错误';
			res.json(responseData);
			return ;
		}
		responseData.msg = '登录成功';
		responseData.userinfo = {
			_id:userInfo._id,
			username:userInfo.username
		};
		req.cookies.set('userInfo',JSON.stringify(responseData.userinfo));
		res.json(responseData);
	});
	

});

module.exports = router;