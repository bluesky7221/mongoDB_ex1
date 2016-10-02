// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongoose = require("mongoose");
var port = process.env.PORT || 3099;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// DB setting
mongoose.connect(process.env.MONGO_DB); // 1
var db = mongoose.connection; // 2
mongoose.Promise = global.Promise;

// Routing
app.use(express.static(__dirname + '/public'));

// 3﻿
db.once("open", function(){
 console.log("DB connected");
});
// 4
db.on("error", function(err){
 console.log("DB ERROR : ", err);
});


io.on('connection', function (socket) {
console.log("io connected");
var addedUser = false;

//define scheme
var userSchema = mongoose.Schema({
  username: String,
  message: String
  });
/*
var userSchema = mongoose.Schema({
  current_aroma: 2, //현재 선택된 향 //String형
  low_temperature: 2, //온도 낮을 때 향
  middle_temperature: 2, //온도 중간일 때 향
  high_temperature: 2, //온도 높을 때 향
  frequency: 16, //온도 뿌릴 주기를 분으로 //32비트 정수형
  is_auto: 8 //자동, 수동 여부 //Boolean형
});
*/

//create model with mongodb collection & scheme
var User;
try {
  User = mongoose.model('users');
} catch (error) {
  User = mongoose.model('users', userSchema); //(collection명, 스키마객체명)
}

// when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    console.log("start new message");
    // we tell the client to execute 'new message'
    socket.emit('new message', {
      username: socket.username,
      message: data
    });

    var database = socket.username;
    var message = data;
    console.log("받은 데이터 : " + database + ", " + message);


    //JSON을 이용해 스키마 포맷에 맞춰서 저장하고자하는 키와 값을 다음과 같이 저장
    var user = new User({'username':database, 'message':message});
    //user객체를 save 메서드를 이용해서 저장
    user.save(function(err,silence){
      if(err)
      {
        console.log(err);
        return;
      }
      console.log("Inserted");
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    console.log("start add user");
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;

    socket.emit('login', {
      username: socket.username
    });
  });

  socket.on('delete message', function (message) {
    console.log("start del msg");

    var user = User.find({'message':message});
    user.remove(function(err) {
      if(err)
      {
        consle.log(err);
        return;
      }
      console.log("delete msg - " + message);
    });
  });

  socket.on('update message', function (message) {
    console.log("start up msg");

    User.findOne({'message':message}, function(err,user) {
      if(err) {
        console.log(err);
        return;
      }
      user.message = "update complete";
      user.save(function(err,silence){
        if(err)
        {
          console.log(err);
          return;
        }
        console.log("update");
      });
    });
  });

socket.on('show All message', function () {
  console.log("start show all msg");

  User.find({}, function(err,docs) {
    if(err) console.log('err');
    console.log(docs);
    socket.emit('showAll', {
      docs: docs
    });
  });
});

});









/*
////데이터 삽입
var current_aroma = "사과";
var low_temperature = "낮은 딸기";
var middle_temperature = "중간 딸기";
var high_temperature = "높은 딸기";
var frequency = 10;
var is_auto = true;
//JSON을 이용해 스키마 포맷에 맞춰서 저장하고자하는 키와 값을 다음과 같이 저장
var user = new User({'current_aroma':current_aroma,'low_temperature':low_temperature,
'middle_temperature':middle_temperature,'high_temperature':high_temperature,
'frequency':frequency, 'is_auto':is_auto})
//user객체를 save 메서드를 이용해서 저장
user.save(function(err,silence){
  if(err)
  {
    console.log(err);
    return;
  }
  console.log("Inserted");
});
////
*/

////데이터 삭제
