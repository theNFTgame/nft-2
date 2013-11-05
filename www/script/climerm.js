//
(function () {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if(!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      },
      timeToCall);
      lastTime = currTime + timeToCall;
      return id;
  };
  if(!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
  };
}());

var fntA = new Object();
  function showFrame(framename) {
    if(!framename){ framename = 'homepage'}
      $('.frame').hide();
    //if(framename !=='homepage' ){ };
    $('.' + framename ).show();
    setTimeout(function(){window.scrollTo(0, 0);}, 0);
  }
  function showSubFrame(framename,subframename) {
    if(!framename && !subframename) {return false;};
    showFrame(framename);
    $('.' + framename + ' .subframe').hide();
    $('.' + framename + ' .' + subframename).show();
  }
  function showMask(framename) {
    if(!framename){ $('.maskbox').hide();}
      $('.maskbox').hide();
    //if(framename !=='homepage' ){ };
    $('.' + framename ).show();
  }
  function showSubMask(framename,subframename) {
    if(!subframename) {
      $('.' + framename + ' .submask').hide();
      $('.maskbox').hide();
    }else{
      showMask(framename);
      $('.' + framename + ' .submask').hide();
      $('.' + framename + ' .' + subframename).show();
    }
  }


$(document).ready(function(){

  fntA.key = NewGuid();
  var AppRouter = Backbone.Router.extend({  
    routes : {  
        '' : 'levelfun', 
        'index' : 'levelfun', 
        'intro' : 'levelfun',
        'replay' : 'replayfun',
        // 'replay' : 'levelfun',
        'level' : 'levelfun',
        'climer' : 'climerfun',
        'run':'runfun',
        'coupon':'couponfun',
        'nocoupon':'nocouponfun',
        'more':'morefun',
        '*error' : 'renderError'  
    },
    levelfun : function() {
      console.log('mainfunc'); 
      
      // fntRun();
      if(!fntA.period){
        showSubFrame('homepage','levelbox');
        console.log('mainfunc call fntClimer');
        fntClimer();
      }
    },
    climerfun : function(){
      console.log('climerfun'); 
      showFrame('runbox');
      fntA.ClimerOn = false;
      fntA.TimerOn = false;
      
      fntA.gameLevel = 1;
      fntA.shakerecord = 0;
      fntA.ClimerAniStep = 60;
      fntA.ClimerAniMove = fntA.ClimerAniStep;
      fntA.defaultY  = -446;
      fntA.StepStarted = false;
      fntA.gameFinish =  false;
      fntA.climerRuning = false;
      fntA.period = 500; // icon speed
      fntA.climerRecord = 0;
      fntA.ClimerAniAllMove = 0;
      fntA.image0 = new Image();
      fntA.image0.src = 'img/map/map01.jpg';
      fntA.iconPower = new Image();
      fntA.player = new Image();
      fntA.iconPower.src = 'img/icon_power.png';
      var canvas = document.getElementById('myCanvas');
      var context = canvas.getContext('2d');
      var mapcanvas =  document.getElementById('mapCanvas');
      var ctx0 = mapcanvas.getContext('2d');
      ctx0.drawImage(fntA.image0,-10,-436,360,912);
      fntA.player.src = 'img/player/g0.png';
      ctx0.drawImage(fntA.player,20,-40,320,504);
      $('.nocouponbox').hide();
      $('.couponbox').hide();
      $('.recordbox').hide();
      $('.maskbg').hide();
      $('.mask').hide();
    },
    replayfun : function(){
      console.log('replay');
      delete fntA.gameOn;

      fntA.UpdateTime = (new Date()).getTime();
      
      $('.touch').hide();
      $('.recordbox').removeClass('recordwinbox').hide();
      $('.maskbg').hide();
      $('.mask').hide();
      $('.nocouponbox').hide();
      $('.couponbox').hide();
      showSubFrame('runbox','runningbox');
      $('.touchbox').show();
      $('.power').show();
      // $('.light').show();
      $(".connection").show();      
      $('#myCanvas').css('background-position','-144px -90px');
      var canvas = document.getElementById('myCanvas');
      var context = canvas.getContext('2d');
      var mapcanvas =  document.getElementById('mapCanvas');
      var ctx0 = mapcanvas.getContext('2d');
      ctx0.drawImage(fntA.image0,-10,-436,360,912);
      fntA.player.src = 'img/player/g0.png';
      ctx0.drawImage(fntA.player,20,-40,320,504);
      
      router.navigate('#/climer');
    },
    couponfun : function(){
      $('.mask').hide();
      $('.maskbg').show();
      $('.couponbox').show();
      $('.nocouponbox').hide();

    },
    nocouponfun : function() {
      $('.mask').hide();
      $('.maskbg').show();
      $('.couponbox').hide();
      $('.nocouponbox').show();
    },
    renderError : function(error) {  
      //  console.log('URL错误, 错误信息: ' + error); 
      //$('.link_home').show(); 
    }  
  }); 

  var router = new AppRouter();  
  Backbone.history.start(); 



  var requestAnimationFrame = window.requestAnimationFrame || 
                              window.mozRequestAnimationFrame || 
                              window.webkitRequestAnimationFrame || 
                              window.msRequestAnimationFrame;
                               
  // hopefully get a valid cancelAnimationFrame function!                     
  var cancelRAF = window.cancelAnimationFrame || 
                  window.mozCancelAnimationFrame || 
                  window.webkitCancelAnimationFrame || 
                  window.msCancelAnimationFrame;

  // create GUID 
  function G() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  function NewGuid() {
    return (G()+G());
  }
  function fRandomBy(under, over){ 
    switch(arguments.length){ 
      case 1: return parseInt(Math.random()*under+1); 
      case 2: return parseInt(Math.random()*(over-under+1) + under);  
      default: return 0; 
    } 
  }

  function postGameRecord(id,name,record,result){ 
    var postData = 'game_type=0&gamename=game2&score='+record + '&user_id=' + id + '&user_name=' + name + '&result=' +result ;
    //  console.log(postData);
    var tempIp = 'http://www.quyeba.com/event/explorerchallenge/'
    $.ajax({type:'POST',url: tempIp +'game/save',data:postData,
      success:function(json){
        //  console.log(json);
        //var jsdata = eval('('+json+')');  
        var jsdata = json;
        //  console.log('status='+ jsdata.status);
        if(result==='win'){
          if (jsdata.point === "success"){
            showSubMask('gamemask','winwithpoint');
          }else{
            showSubMask('gamemask','winwithoutpoint');
          } 
        }else{
          showSubMask('gamemask','lost');
        }

        //console.log('mid='+ jsdata.data.mid );
      },
      error: function(xhr, type){
        showSubMask('gamemask','lost');
      }
    });
  }
  function postGameRecordSingle(record){ 
  /*
  请先调用 game/save, 注意传入的game_type为1（单机游戏）和score，没有game_result。其它参数和双屏游戏相同。
  然后在刮奖时调用  game/reward获得优惠券号码。

  返回

  失败：
   {"result":"failed","message":"no game data found"}
  成功：
   {"result":"success","message":"","game_id":54,"user_id":"124578","user_name":"cgzhang2003","coupon_id":123,"coupon_code":xxx,"coupon_discount":null,"coupon_description":null}
  ​
  如果没有获奖则coupon_code为空。
  */
  if(!record){ var record = 'start';}
  var postData = 'game_type=1&gamename=game2&score='+record ;
  var tempIp = 'http://www.quyeba.com/event/explorerchallenge/';
  console.log(postData);

  $.ajax({type:'POST',url: tempIp +'game/save',data:postData,
    success:function(json){
        console.log(json);
      //var jsdata = eval('('+json+')');  
      var jsdata = json;
        console.log('status='+ jsdata.status);
      if(jsdata.result==='success'){
        if (jsdata.game_id != null){
          fntA.game_id = jsdata.game_id;
        }
      }

      //console.log('mid='+ jsdata.data.mid );
    },
    error: function(xhr, type){
      
    }
  });
}
//game/reward
function postGameRewardSingle(record){ 
  if(!record){ var record = 'lost';}
  var postData = 'game_type=1&gamename=game2&score='+record + '&game_id=' + fntA.game_id;
  var tempIp = 'http://www.quyeba.com/event/explorerchallenge/';
  console.log(postData);

  $.ajax({type:'POST',url: tempIp +'game/reward',data:postData,
    success:function(json){
        console.log(json);
        $('.recordbox').show();
        $('.maskbg').show();
        $('.touchbox').hide();
      //var jsdata = eval('('+json+')'); 
      //result: "success" 
      var jsdata = json;
        console.log(jsdata);
      if(jsdata.result==='success'){
        if (jsdata.coupon_code !== ''){
          $('.getcoupon').attr('href', '#/coupon');
          $('.couponbox .cp').html(jsdata.coupon_code);
        }else{
          $('.getcoupon').attr('href', '#/nocoupon');
        } 
      }else{
        $('.getcoupon').attr('href', '#/nocoupon');
      }

      //console.log('mid='+ jsdata.data.mid );
    },
    error: function(xhr, type){
      $('.getcoupon').attr('href', '#/nocoupon');
    }
  });
}
  function funMapload(){
    fntA.imgArr = [
      'img/map/map01.jpg'];
    fntA.playArr = [
      'img/player/g1_ok.png',
      'img/player/g2_ok.png',
      'img/player/g3_ok.png',
      'img/player/g4_ok.png'];
    fntA.playDownArr = [
      'img/player/g1_down.png',
      'img/player/g2_down.png',
      'img/player/g3_down.png',
      'img/player/g4_down.png'];
  }
  //climer game
  function fntClimer(){
    console.log('fntClimer' + fntA.TimerOn);
    funMapload();
    fntA.ClimerOn = false;
    fntA.TimerOn = false;
    fntA.image0 = new Image();
    fntA.image0.src = 'img/map/map01.jpg';
    fntA.iconPower = new Image();
    fntA.iconPower.src = 'img/icon_power.png';
    fntA.gameLevel = 1;
    fntA.shakerecord = 0;
    fntA.ClimerAniStep = 60;
    fntA.ClimerAniMove = fntA.ClimerAniStep;
    fntA.defaultY  = -446;
    fntA.StepStarted = false;
    fntA.gameFinish =  false;
    fntA.climerRuning = false;
    fntA.period = 450 + fRandomBy(0,100); // icon speed
    fntA.player = new Image();
    fntA.player.src = 'img/player/g0.png';
    fntA.climerRecord = 0;
    fntA.ClimerAniAllMove = 0;

    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var mapcanvas =  document.getElementById('mapCanvas');
    var ctx0 = mapcanvas.getContext('2d');
    //deafult
    ctx0.drawImage(fntA.image0,-10,-436,360,912);
    fntA.player.src = 'img/player/g0.png';
    ctx0.drawImage(fntA.player,20,-40,320,504);
    postGameRecordSingle();
    var myRectangle = {
      x: 400,
      y: 3,
      width: 20,
      height: 50,
      borderWidth: 0
    };

    function countdownNewTime(secs) {
      //countdown
      secs = Number(secs);
      for (var i = secs; i >= 0; i--) {
        (function(index) {
          setTimeout(function(){
          doUpdateTime(index);
        }, (secs - index) * 1000);
      })(i);
      }
    }
    function doUpdateTime(num) {
      //console.log('now countdown number is :' + num);
      if( num == 4 || num == 5 || num >= 6 || num == 3 || num == 1 || num == 2 || num == 0){
        // showSubMask('gamemask','connection');
        showSubMask('gamemask','howplay');
        showSubMask('touchbox','connection');
        $('.power').show();
        $('.light').show();
        console.log('show btn')
      }
    }
    function countdownClimerTime(secs) {
      //countdown
      secs = Number(secs);
      fntA.TimerOn = true;
      fntA.UpdateTime = (new Date()).getTime();
      var updateTime = fntA.UpdateTime;
      for (var i = secs; i >= 0; i--) {
        (function(index) {
          fntA.clickTimout = setTimeout(function(){
            if(updateTime ===fntA.UpdateTime){
              doUpdateClimerTime(index);
            }else{
              console.log('updateTime:'+ updateTime + ',fntA.UpdateTime:' + fntA.UpdateTime);
              return;
            }
        }, (secs - index) * 1000);
      })(i);
      }
    }
    function doUpdateClimerTime(num) {
      // console.log('countdonwTime:' + num + '\n' + 'fntA.ClimerOn:' +fntA.ClimerOn + ',fntA.TimerOn:' + fntA.TimerOn + ',fntA.UpdateTime:' + fntA.UpdateTime);
      if(num >0 ){
        if(fntA.ClimerOn && fntA.TimerOn){
          $('.light span').removeClass().addClass('lite'+num);
          $('.gamenote span').removeClass().addClass('note'+num);
        }
      }
      if(num === 0) {
          // stopAnimationClimer();
          stopAnimation();
          // fntA.ClimerOn = false;
          fntA.TimerOn = false;
          console.log( 'fntA.StepStarted :'+ fntA.StepStarted + ', fntA.gameFinish: ' + fntA.gameFinish  + ',fntA.climerRecord:' + fntA.climerRecord + ',fntA.climerRuning:' + fntA.climerRuning + ',fntA.gameResult:' + fntA.gameResult);
          // if((!fntA.StepStarted || !fntA.gameFinish) && fntA.climerRecord == 0 && !fntA.climerRuning && fntA.gameResult !=='lost'){
          // fntA.climerRecord:0,fntA.climerRuning:false
          if(fntA.gameLevel >1 && fntA.climerRecord==0 && !fntA.climerRuning && !fntA.gameFinish ){
            console.log( 'level 2~5 doUpdateClimerTime call down' );
            fntA.thisStpe = 'down';
            ClimerAnimate();
          }
          if(fntA.gameLevel == 1 && !fntA.StepStarted && !fntA.climerRuning){
            console.log( 'level=1 doUpdateClimerTime call down' );
            fntA.thisStpe = 'down';
            ClimerAnimate();
          }
      }
    }

    //start game 




    //start climer



    
    /*
    // NodeJS Server
    var nodejs_server = "222.73.241.60:8082";
    // connect
    var socket = io.connect("http://" + nodejs_server);
    socket.emit("send", {
        key: fntA.key,
        act: "pcenter"
    });

    socket.on("get_response", function (b) {
      var combine = b.key + "_" + b.act;
      console.log(combine);
      switch (combine) {
        // when open m.page，call enter event，then show the game
        case fntA.key + "_enter":
          console.log('enter');
          setTimeout(function () {
            if(!fntA.gameOn){
              showSubFrame('runbox','rundivbox');
              fntA.gameOn = true;
              ctx0.drawImage(fntA.image0,-10,-436,360,912);
              fntA.player.src = 'img/player/g0.png';
              ctx0.drawImage(fntA.player,20,-40,320,504);
              countdownNewTime(2);
            }
          }, 100);
          break;
        // shake event
        case fntA.key + "_changebg":
          stopAnimation();
          // console.log('fntA.ClimerOn:' +fntA.ClimerOn + ',fntA.TimerOn:' + fntA.TimerOn + ',fntA.UpdateTime:' + fntA.UpdateTime);
          if(fntA.ClimerOn && fntA.climerRecord==0 && !fntA.gameFinish){
            fntA.TimerOn = false;
            var g = canvas.width/2 - (canvas.width/10)*(fntA.gameLevel-1) + 4;
            console.log(fntA.x +',goal:' + g + ',canvas.width:'+ canvas.width);
            // fntA.gameLevel 
            if(fntA.x< g) {
              console.log('You win this step!');
              if(fntA.gameLevel<5){
                // $('#myCanvas').css('background-position','0px -' + fntA.gameLevel*30 + 'px');
                $('.gamenote span').removeClass().addClass('notes');
              }
              fntA.shakerecord = fntA.x;
              // fntA.StepStarted = true;
              // if(fntA.clickTimout){
              //   clearTimeout(fntA.clickTimout);
              //   console.log('clearTimeout(fntA.clickTimout)');
              // }
              // fntA.x = 999;
              fntA.climerRecord = 0;
              fntA.thisStpe = 'ok';
              ClimerAnimate();
              // fntA.gameLevel = fntA.gameLevel + 1;
            }else{
              console.log('You lost!');
              fntA.shakerecord = 0;
              fntA.climerRecord = 0;
              fntA.thisStpe = 'down';
              ClimerAnimate();
              // postGameRecord(fntA.playerId,fntA.playerName,fntA.x,fntA.gameResult);
            }
          }else{
            console.log('Your time is out.');
          }
          break;
      }
    });//socket.on
    */

    function drawRectangle(myRectangle, context) {
      // context.beginPath();
      // context.rect(myRectangle.x, myRectangle.y, myRectangle.width, myRectangle.height);
      // context.fillStyle = 'blue';
      // context.fill();
      // context.lineWidth = myRectangle.borderWidth;
      // context.strokeStyle = 'blue';
      // context.stroke();
      context.drawImage(fntA.iconPower,myRectangle.x,myRectangle.y,23,30);
    }
    function animate() {
      // update
      $('.power').show();
      if(fntA.gameLevel!=0){
        $('.light').show();
      }
      
      var time = (new Date()).getTime() - startTime;
      var amplitude = 130;

      // in ms
      var period = fntA.period;
      var centerX = canvas.width / 2 - myRectangle.width / 2;
      var nextX = amplitude * Math.sin(time * 2 * Math.PI / period) + centerX;

      myRectangle.x = nextX;
      if (/Android/.test(navigator.userAgent)) {
        var updateTime = fntA.UpdatePowerTime;
        if(updateTime !=fntA.UpdatePowerTime){
          myRectangle.y = 60;
        }else{
          myRectangle.y = 3;
        }
      }
      fntA.x = canvas.width - nextX;
      
      // clear
      context.clearRect(0, 0, 300, 60);

      // draw
      // drawRectangle(myRectangle, context);
      context.drawImage(fntA.iconPower,myRectangle.x,myRectangle.y,23,30);
      fntA.requestId = window.requestAnimationFrame(animate);
    }
    function ClimerAnimate() {
      $('.touchbox').hide();
      fntA.climerRuning = true;
      // clear
      ctx0.clearRect(0, 0, canvas.width, canvas.height);

      var nextStpe = fntA.thisStpe;
      // update
      // if(nextStpe == 'down'){
      //   fntA.player.src = 'img/player/g'+ fntA.gameLevel+'_down.png';
      // }else if( nextStpe == 'ok'){
      //   fntA.player.src = 'img/player/g'+ fntA.gameLevel+'_ok.png';
      //   if(fntA.gameLevel == 5){
      //     fntA.gameFinish = true;
      //   }
      // }
      fntA.player = new Image();
      fntA.player.src = 'img/player/g'+ fntA.gameLevel+'_ok.png';
      if(fntA.gameLevel == 5 || nextStpe =='down'){
        fntA.gameFinish = true;
      }
      

      var newY = 0 , newX = -10 ,playerNewX = -20 ,playerNewY = -60; //fntA.defaultY + ( fntA.ClimerAniStep - fntA.ClimerAniMove + 1) ;
      fntA.ClimerAniMove = fntA.ClimerAniMove - 0.35;
      // in ms
      switch (fntA.gameLevel) {
        case 1:
          if(fntA.climerRecord < 60 && fntA.climerRecord >= 0){
            playerNewX = -20;
            newY = -436;
          }
          if(fntA.climerRecord >= 60 && fntA.climerRecord < 80){
            playerNewX = -380;
            playerNewY = -50;
            newY = -425;
          }
          if(fntA.climerRecord >= 80 && fntA.climerRecord < 120){
            playerNewX = -740;
            playerNewY = -40;
            newY = -388;
          }
          if(fntA.climerRecord >= 120 ){
            playerNewX = -1095;
            playerNewY = -52;
            newY = -388;
            if(nextStpe == 'down'){
              fntA.player = new Image();
              fntA.player.src = 'img/player/down.png';
              playerNewX = -20;
              playerNewY = -80;
            }
          }
          if(fntA.climerRecord >= 140 && nextStpe == 'down'){
            fntA.player.src = 'img/player/down.png';
            playerNewX = -380;
            playerNewY = -30;
          }
        break;
        case 2:
          if(fntA.climerRecord < 60 && fntA.climerRecord >= 0){
            playerNewX = -20;
            newY = -388;
          }
          if(fntA.climerRecord >= 60 && fntA.climerRecord < 80){
            playerNewX = -380;
            playerNewY = -50;
            newY = -388;
          }
          if(fntA.climerRecord >= 80 && fntA.climerRecord < 120){
            playerNewX = -740;
            playerNewY = -20;
            newY = -298;
          }
          if(fntA.climerRecord >= 120 ){
            playerNewX = -1100;
            playerNewY = -20;
            newY = -296;
            if(nextStpe == 'down'){
              fntA.player = new Image();
              fntA.player.src = 'img/player/down.png';
              playerNewX = -20;
              playerNewY = -80;
            }
          }
          if(fntA.climerRecord >= 140 && nextStpe == 'down'){
            fntA.player.src = 'img/player/down.png';
            playerNewX = -380;
            playerNewY = -30;
          }
        break;
        case 3:
          if(fntA.climerRecord < 60 && fntA.climerRecord >= 0){
            playerNewX = -23;
            playerNewY = -25;
            newY = -296;
            newX = -20;
          }
          if(fntA.climerRecord >= 60 && fntA.climerRecord < 80){
            playerNewX = -380;
            playerNewY = -30;
            newY = -270;
            newX = -20;
          }
          if(fntA.climerRecord >= 80 && fntA.climerRecord < 120){
            playerNewX = -740;
            playerNewY = -20;
            newY = -240;
            newX = -26;
          }
          if(fntA.climerRecord >= 120 ){
            playerNewX = -1096;
            playerNewY = -20;
            newY = -240;
            newX = -30;
            if(nextStpe == 'down'){
              fntA.player = new Image();
              fntA.player.src = 'img/player/down.png';
              playerNewX = -20;
              playerNewY = -80;
            }
          }
          if(fntA.climerRecord >= 140 && nextStpe == 'down'){
            fntA.player.src = 'img/player/down.png';
            playerNewX = -380;
            playerNewY = -30;
          }
        break;
        case 4:
          if(fntA.climerRecord < 60 && fntA.climerRecord >= 0){
            playerNewX = 0;
            playerNewY = -30;
            newY = -236;
            newX = -20;
          }
          if(fntA.climerRecord >= 60 && fntA.climerRecord < 80){
            playerNewX = -360;
            playerNewY = -30;
            newY = -222;
            newX = -20;
          }
          if(fntA.climerRecord >= 80 && fntA.climerRecord < 120){
            playerNewX = -720;
            playerNewY = -20;
            newY = -212;
            newX = -30;
          }
          if(fntA.climerRecord >= 120 ){
            playerNewX = -1076;
            playerNewY = -20;
            newY = -210;
            newX = -38;
            if(nextStpe == 'down'){
              fntA.player = new Image();
              fntA.player.src = 'img/player/down.png';
              playerNewX = -20;
              playerNewY = -80;
            }
          }
          if(fntA.climerRecord >= 140 && nextStpe == 'down'){
            fntA.player.src = 'img/player/down.png';
            playerNewX = -380;
            playerNewY = -30;
          }
        break;
        case 5:
          if(fntA.climerRecord < 60 && fntA.climerRecord >= 0){
            playerNewX = -20;
            playerNewY = -30;
            newY = -186;
            newX = -40;
          }
          if(fntA.climerRecord >= 60 && fntA.climerRecord < 80){
            playerNewX = -380;
            playerNewY = -30;
            newY = -180;
            newX = -40;
          }
          if(fntA.climerRecord >= 80 && fntA.climerRecord < 120){
            playerNewX = -740;
            playerNewY = -27;
            newY = -160;
            newX = -40;
          }
          if(fntA.climerRecord >= 120 ){
            playerNewX = -1066;
            playerNewY = -27;
            newY = -150;
            newX = -30;
            if(nextStpe == 'down'){
              fntA.player = new Image();
              fntA.player.src = 'img/player/down.png';
              playerNewX = -20;
              playerNewY = -80;
            }
          }
          if(fntA.climerRecord >= 140 && nextStpe == 'down'){
            fntA.player.src = 'img/player/down.png';
            playerNewX = -380;
            playerNewY = -30;
          }
        break;
      }


      // draw
      // console.log('fntA.player.src:' + fntA.player.src + ',fntA.gameLevel:' + fntA.gameLevel + ',fntA.climerRecord:'+ fntA.climerRecord + ',xy:' + playerNewX + ',' + playerNewY );

      ctx0.drawImage(fntA.image0,newX,newY,360,912);
      
      ctx0.drawImage(fntA.player,playerNewX,playerNewY,1800,480);

      // animate
      if(fntA.ClimerAniMove < 0){
        stopAnimationClimer();
        fntA.StepStarted = true;
        fntA.climerRecord = 0;
        if(fntA.gameLevel == 5){
          // fntA.gameFinish = true;
          if(nextStpe == 'down'){
            fntA.gameResult = 'lost';
            $('.touch').hide();
          }else if(nextStpe == 'ok'){
            // showSubMask('gamemask','winwithpoint');
            fntA.gameResult = 'win';
            $('.recordbox').addClass('recordwinbox');
          }
          // postGameRecord(fntA.playerId,fntA.playerName,fntA.allmoveA,fntA.gameResult);
          postGameRewardSingle(fntA.gameResult);
        }else{

          if(nextStpe == 'down'){
            fntA.gameResult = 'lost';
            $('.touch').hide();
            // postGameRecord(fntA.playerId,fntA.playerName,fntA.allmoveA,fntA.gameResult);
            postGameRewardSingle(fntA.gameResult);
          }else if( nextStpe == 'ok'){
            // console.log('try for next stpe');
            $('.touchbox').show();
            $(".touch").show();
            fntA.defaultY = newY;
            myRectangle.x = fRandomBy(0,240);
            fntA.period = 400 + fRandomBy(50,140);

            if (/Android/.test(navigator.userAgent)) {
              $('#myCanvas').remove();
              var canvasDiv = document.getElementById('canvasDiv');
              var canvast = document.createElement('canvas');
              canvast.setAttribute('width', 256);
              canvast.setAttribute('height', 39);
              canvast.setAttribute('id', 'myCanvas');
              canvasDiv.appendChild(canvast);
              canvas = document.getElementById('myCanvas');
              context = canvas.getContext("2d");
              context.clearRect(0, 0, 300, 60);
              context.drawImage(fntA.iconPower,400,400,23,30);
              fntA.UpdatePowerTime = (new Date()).getTime();
            }
            
            $('#myCanvas').css('background-position','-'+ (144 - fntA.gameLevel*25) + 'px -90px');
            $('.gamenote span').removeClass().addClass('noten');
            fntA.gameLevel = fntA.gameLevel + 1;
            fntA.ClimerAniMove = fntA.ClimerAniStep;
            animate();
            fntA.ClimerOn = true;
            countdownClimerTime(6);
          }
        }
        fntA.climerRuning = false;
      }else{
        fntA.climerRecord = fntA.climerRecord + 1 ;
        fntA.ClimerRequestId = window.requestAnimationFrame(ClimerAnimate);
        // console.log('fntA.ClimerAniMove:'+ fntA.ClimerAniMove +',newY:'+ newY +',playerNewX:' + playerNewX);
      }
      
    }

    //init

    drawRectangle(myRectangle, context);
    var startTime = (new Date()).getTime();
    // animate(myRectangle, canvas, context, startTime);
    function stopAnimation(e) {
        // use the requestID to cancel the requestAnimationFrame call
        if (/Android/.test(navigator.userAgent)) {
          context.clearRect(0, 0, 300, 60);
          context.drawImage(fntA.iconPower,400,400,23,30);
        }
        cancelRAF(fntA.requestId);
    }
    function stopAnimationClimer(e) {
        // use the requestID to cancel the requestAnimationFrame call
        cancelRAF(fntA.ClimerRequestId);
    }
    function pauseAnimation(e) {
        // use the requestID to cancel the requestAnimationFrame call
        fntA.gameLevel = 0;
        if (/Android/.test(navigator.userAgent)) {
          $('#myCanvas').remove();
          var canvasDiv = document.getElementById('canvasDiv');
          var canvast = document.createElement('canvas');
          canvast.setAttribute('width', 256);
          canvast.setAttribute('height', 39);
          canvast.setAttribute('id', 'myCanvas');
          canvasDiv.appendChild(canvast);
          canvas = document.getElementById('myCanvas');
          context = canvas.getContext("2d");
          context.clearRect(0, 0, 300, 60);
          context.drawImage(fntA.iconPower,400,400,23,30);
          fntA.UpdatePowerTime = (new Date()).getTime();
        }
        animate();
    }
    //debug;
    function referee() {
      stopAnimation();
      if(fntA.gameLevel == 0){
        //check G
        var g = canvas.width/2;
        console.log(fntA.x +',goal:' + g + ',canvas.width:'+ canvas.width);
        if(fntA.x< g) {
          console.log('enter game');
          $('#myCanvas').css('background-position','0px -60px');
          setTimeout(function () {
            if(!fntA.gameOn){
              showSubFrame('runbox','runningbox');
              fntA.gameOn = true;
              // countdownNewTime(2);
              fntA.gameLevel = 1;
              // $('.power').hide();
              // $('.light').hide();
              // var canvas = document.getElementById('myCanvas');
              // var context = canvas.getContext('2d');
              // var mapcanvas =  document.getElementById('mapCanvas');
              // var ctx0 = mapcanvas.getContext('2d');
              // ctx0.drawImage(fntA.image0,-10,-436,360,912);
              // fntA.player.src = 'img/player/g0.png';
              // ctx0.drawImage(fntA.player,20,-40,320,504);
              router.navigate('#/climer');
              $(".connection").show();
              $(".touch").hide();
              $('#myCanvas').css('background-position','-144px -90px');
              showSubMask('gamemask','howplay');
              showSubMask('touchbox','connection');
              $('.power').show();
              $('.light').show();
              console.log('show btn')
            }
          }, 1200);
        }else{
          $('#myCanvas').css('background-position','0px -30px');
          setTimeout(function () {
            if (/Android/.test(navigator.userAgent)) {
              $('#myCanvas').remove();
              var canvasDiv = document.getElementById('canvasDiv');
              var canvast = document.createElement('canvas');
              canvast.setAttribute('width', 256);
              canvast.setAttribute('height', 39);
              canvast.setAttribute('id', 'myCanvas');
              canvasDiv.appendChild(canvast);
              canvas = document.getElementById('myCanvas');
              context = canvas.getContext("2d");
              context.drawImage(fntA.iconPower,400,400,23,30);
              fntA.UpdatePowerTime = (new Date()).getTime();
            }
            animate();
            $('#myCanvas').css('background-position','0px 0px');
            $(".touch").show();
          }, 600);
        }
      }else{
        if(fntA.ClimerOn && fntA.climerRecord==0 && !fntA.gameFinish){
            fntA.TimerOn = false;
            var g = canvas.width/2 - (canvas.width/10)*(fntA.gameLevel-1) + 4;
            console.log(fntA.x +',goal:' + g + ',canvas.width:'+ canvas.width);
            // fntA.gameLevel 
            if(fntA.x< g) {
              setTimeout(function () {
                console.log('You win this step!');
                if(fntA.gameLevel<5){
                  // $('#myCanvas').css('background-position','0px -' + fntA.gameLevel*30 + 'px');
                  $('.gamenote span').removeClass().addClass('notes');
                }
                fntA.shakerecord = fntA.x;
                fntA.climerRecord = 0;
                fntA.thisStpe = 'ok';
                ClimerAnimate();
                // fntA.gameLevel = fntA.gameLevel + 1;
              }, 200);
            }else{
              setTimeout(function () {
                console.log('You lost!');
                $(".touch").hide();
                fntA.shakerecord = 0;
                fntA.climerRecord = 0;
                fntA.thisStpe = 'down';
                ClimerAnimate();
                // postGameRecord(fntA.playerId,fntA.playerName,fntA.x,fntA.gameResult);
              }, 200);
            }
          }else{
            console.log('Your time is out.');
          }
      }
    }
    $(".get").on("click", function(){
        $("body").append('<p>' + fntA.x);
      });
    $(".clean").on("click", function(){
        $("p").remove();
      });
    $(".stop").on("click", function(){
        stopAnimation();
        $("body").append('<p>' + fntA.x);
      });
    $(".pause").on("click", function(){
        pauseAnimation();
        $("body").append('<p>' + fntA.x);
      });
    $(".touch").on("touchstart", function(ev){
      // var e = ev.originalEvent;
      $(".touch").hide();
      console.log(fntA.x);
      referee();
    });
    $(".replay").on("touchstart click", function(ev){
      // var e = ev.originalEvent;
      $('.nocouponbox').hide();
        $('.couponbox').hide();
        $('.recordbox').hide();
        $('.maskbg').hide();
        $('.mask').hide();
      // setTimeout(function () {
        router.navigate('#/replay');
      // }, 100);
      return false;
    });
    $(".connection").on("click", function(){
      // if(!fntA.startime){
        // showSubMask('gamemask');
        // $('.gamemask .countdown').html();
        clearTimeout();
        countdownClimerTime(6);
        
        animate();
        $(".connection").hide();
        $(".touch").show();
        fntA.ClimerOn = true;
        $('.nocouponbox').hide();
        $('.couponbox').hide();
        $('.recordbox').hide();
        $('.maskbg').hide();
        $('.mask').hide();
      // }
    });
    pauseAnimation();

  }//climer game

  //main run

  var pageUrl = 'http://www.quyeba.com/event/explorerchallenge/m_c.html'; 

  //fntA.gameLevel = 1;
  fntA.gameOn = false ;

  var loadedImages = 0;
  //run
  


});














