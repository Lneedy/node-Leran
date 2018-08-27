// 应用程序启动入口文件
var express = require('express');
	swig = require('swig'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	Cookies = require('cookies');
//创建应用
var App = express();


//设置静态文件托管
App.use('/public',express.static(__dirname +'/public'));

//(后缀,处理内容方法)
App.engine('html',swig.renderFile);

//设置模板文件存放的目录
App.set('views','./views');

//注册所使用的模板引擎 第一个参数必须是'view engine'
App.set('view engine','html');

//取消缓存(开发模式下)
swig.setDefaults({cache:false});

// bodyparser设置
App.use(bodyParser.urlencoded({extended:true}));

//设置cookie
App.use(function (req,res,next){
	req.cookies = new Cookies(req,res);
	req.userInfo = {};
	if(req.cookies.get('userInfo')){
		try{
			req.userInfo = JSON.parse(req.cookies.get('userInfo'));
		}catch(e){}
	}
	next();
});

//模块功能分类
App.use('/admin',require('./routes/admin'));
App.use('/api',require('./routes/api'));
App.use('',require('./routes/main'));

mongoose.connect('mongodb://localhost:27018/blog',function(err){
	if(err){
		console.log('数据库连接失败');
	}else{
		console.log('数据库连接成功');
		//监听
		App.listen(8081);
	}
});


