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
      '' : 'mainfunc', 
      'index' : 'mainfunc', 
      'reg' : 'regfunc',
      'run':'runfunc',
      'run/:action':'runfunc',
      '*error' : 'renderError'  
    },
    mainfunc : function() {
      //  console.log('mainfunc'); 
      var echoUid = $('.userinfo').attr('data-userid');
      var echoName = $('.userinfo').attr('data-username');
      var echoAvatar = $('.userinfo').attr('data-avatar');
      // console.log(echoUid + ',' + echoName);
      if(echoUid != null){
        fntA.playerId = echoUid;
        fntA.playername = echoName;
        fntA.playerAvatar = echoAvatar;
        // console.log(fntA);
        //router.navigate('run');
        $('.playerinfo .playername').html(fntA.playername);
        $('.playerinfo img').attr('src',fntA.playerAvatar);
        // console.log('fntA.playername:' + fntA.playername);
        showSubFrame('runbox','qrcodebox');
        // fntRun();
        if(!fntA.period){
          console.log('mainfunc call fntClimer');
          fntClimer();
        }
        
        $('.iframbox iframe').attr('src','');
        _smq.push(['pageview', '/qrcode', '扫描二维码']);
      }else{
        showSubFrame('homepage','loginbox');
        $('.errormsg').hide();
        $('.iframbox iframe').attr('src','http://www.quyeba.com/explorer/#_challenge');
        _smq.push(['pageview', '/login', '登陆']);
        //http://www.quyeba.com/explorer/#_challenge
      }
      // temp
      // showSubFrame('runbox','rundivbox');
    }, 
    regfunc : function() {
      //alert("111");
      //console.log('levelfunc'); 
      showSubFrame('homepage','registerbox');
      _smq.push(['pageview', '/reg', '注册']);
    }, 
    shakefunc : function (level){
      if(!level){ fntA.level = 1 };
      fntA.level = level;
      showFrame('energybox');
    },
    runfunc : function (action){
      // console.log('fntA.playerId=' + fntA.playerId);
      // if(!fntA.playerId){
      //   router.navigate('index');
      //   showFrame('homepage');
      //   showSubFrame('homepage','loginbox');
      //   $('.iframbox iframe').attr('src','http://www.quyeba.com/explorer/#_challenge');
      //   _smq.push(['pageview', '/login', '登陆']);
      // }else{
         // console.log(action);
        if(action == 'replay'){
          // router.navigate('run');
          console.log('replay call fntClimer');
          // fntA.gameOn = null;
          delete fntA.gameOn;
          fntA.gameFinish = false;
          fntA.ClimerOn = false;
          fntA.gameLevel = 1;
          fntA.player = new Image();
          fntA.gameResult = 'replay';
          fntA.ClimerAniMove = fntA.ClimerAniStep;
          $('#myCanvas').css('background-position','0px 0px');
          fntA.player.src = 'img/player/g0.png';
          router.navigate('');
          _smq.push(['pageview', '/replay', '再战一次']);
        }
        showSubFrame('runbox','qrcodebox');
        // fntRun();
        if(!fntA.period){
          console.log('#run call fntClimer');
          fntClimer();
        }
        $('.iframbox').html('');
        //$('.iframbox iframe').attr('src','');
        _smq.push(['pageview', '/run', '攀岩']);
      // }
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
  function postLogin(){
    //  console.log('post login');
    var userName  = $('#uname').val()
    ,   userPwd = $('#upwd').val()
    ,   postData;
    if (!userName || !userPwd){
      alert("请完整填写信息！")
      return false;
    }
    var reMail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    //  console.log(userName.match(reMail));
    if(userName.match(reMail)){
      postData = 'email=' + userName + '&password=' + userPwd ;
    }else{
      postData = 'name=' + userName + '&password=' + userPwd ;
    }
    //  console.log(postData);
    var tempIp = 'http://www.quyeba.com/event/explorerchallenge/'
    $.ajax({type:'POST',url: tempIp +'user/login',data:postData,
      success:function(json){
        //  console.log(json);
        //var jsdata = eval('('+json+')');  
        var jsdata = json;
        if(jsdata.result ==='failed'){
          $('.loginbox .errormsg').show();
          return false;
        }
        //  console.log(jsdata);
        fntA.playername = jsdata.user_name;
        fntA.playerId = jsdata.user_id;
        fntA.playerAvatar = 'http://tnf-avatar.b0.upaiyun.com/'+jsdata.user_avatar;
        router.navigate('run');
        showSubFrame('runbox','qrcodebox');

        $('.playerinfoa .playername').html(fntA.playername);
        if(jsdata.user_avatar!==''){
          $('.playerinfoa img').attr('src',fntA.playerAvatar);
        }
        $('.loginbox .errormsg').hide();
        
        //console.log('mid='+ jsdata.data.mid );
      },
      error: function(xhr, type){
        //  console.log('Ajax error!')
        $('.loginbox .errormsg').show();
      }
    });
    // fntRun();
    if(!fntA.period){
      console.log('pose login call fntClimer');
          fntClimer();
        }
  }
  function postRegister(){
    var userName  = $('#regumail').val()
    ,   userMail  = $('#reguname').val()
    ,   userPwd = $('#regupwd').val()
    ,   userPwd2 = $('#regupwd2').val()
    ,   postData;
    if (!userName || !userPwd || !userMail || !userPwd2){
      $('.registerbox .errormsg').html('请完整填写信息！').show();
      return false;
    }
    if(userPwd!==userPwd2){
      $('.registerbox .errormsg').html('请确认两次输入密码相同！').show();
      return false;
    }
    $('.loginbox .errormsg').hide();
    var reMail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    //  console.log('post register, regumail=' + userMail + ', valmail=' + userMail.match(reMail));
    // if(userMail.match(reMail)){
    //   alert("请正确填写邮箱信息！")
    //   return false;
    // }
    postData = 'name=' + userName + '&email=' + userMail + '&password=' + userPwd ;
    //  console.log(postData);
    var tempIp = 'http://www.quyeba.com/event/explorerchallenge/'
    $.ajax({type:'POST',url: tempIp +'user/register',data:postData,
      success:function(json){
        //  console.log(json);
        //var jsdata = eval('('+json+')');
        var jsdata = json;
        if(jsdata.result ==='failed'){
          $('.registerbox .errormsg').html('注册失败，您的邮箱或昵称已被注册').show();
          return false;
        }
        //console.log('status='+ jsdata.result);
        fntA.playername = jsdata.user_name;
        fntA.playerId = jsdata.user_id;
        fntA.playerAvatar = jsdata.user_avatar;
        $('.playerinfoa .playername').html(fntA.playername);
        router.navigate('run');
        showSubFrame('runbox','qrcodebox');
        //console.log('mid='+ jsdata.data.mid );
      },
      error: function(xhr, type){
        //  console.log('Ajax error!')
      }
    });
    // fntRun();
    if(!fntA.period){
          fntClimer();
        }
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
    fntA.period = 500; // icon speed
    fntA.player = new Image();
    fntA.player.src = 'img/player/g0.png';
    fntA.climerRecord = 0;
    fntA.ClimerAniAllMove = 0;

    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var mapcanvas =  document.getElementById('mapCanvas');
    var ctx0 = mapcanvas.getContext('2d');

    
    var myRectangle = {
      x: fRandomBy(0,40),
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
      if( num == 4 || num == 5 || num >= 6 || num == 3 ){
        showSubMask('gamemask','howplay');
        $('.gamemask .countdown').html('');
      }
      if( num == 1 || num == 2 ){
        // showSubMask('gamemask','connection');
        showSubMask('gamemask','howplay');
      }
      if(num === 0) {
        showSubMask('gamemask','connection');
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
          if((!fntA.StepStarted || !fntA.gameFinish) && fntA.climerRecord == 0 && !fntA.climerRuning && fntA.gameResult !=='lost'){
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
            if(fntA.gameLevel==5){ g = g + 20; }
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
              // postGameRecord(fntA.playerId,fntA.playername,fntA.x,fntA.gameResult);
            }
          }else{
            console.log('Your time is out.');
          }
          break;
      }
    });//socket.on

    function drawRectangle(myRectangle, context) {
      // context.beginPath();
      // context.rect(myRectangle.x, myRectangle.y, myRectangle.width, myRectangle.height);
      // context.fillStyle = 'blue';
      // context.fill();
      // context.lineWidth = myRectangle.borderWidth;
      // context.strokeStyle = 'blue';
      // context.stroke();
      context.drawImage(fntA.iconPower,myRectangle.x,myRectangle.y,23,23);
    }
    function animate() {
      // update
      var time = (new Date()).getTime() - startTime;
      var amplitude = 160;

      // in ms
      var period = fntA.period;
      var centerX = canvas.width / 2 - myRectangle.width / 2;
      var nextX = amplitude * Math.sin(time * 2 * Math.PI / period) + centerX;

      myRectangle.x = nextX;
      fntA.x = canvas.width - nextX;

      // clear
      context.clearRect(0, 0, canvas.width, canvas.height);

      // draw
      drawRectangle(myRectangle, context);
      fntA.requestId = window.requestAnimationFrame(animate);
    }
    function ClimerAnimate() {
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
      console.log('fntA.player.src:' + fntA.player.src + ',fntA.gameLevel:' + fntA.gameLevel + ',fntA.climerRecord:'+ fntA.climerRecord + ',xy:' + playerNewX + ',' + playerNewY );

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
          }else if(nextStpe == 'ok'){
            // showSubMask('gamemask','winwithpoint');
            fntA.gameResult = 'win';
          }
          postGameRecord(fntA.playerId,fntA.playername,fntA.allmoveA,fntA.gameResult);
          
        }else{

          if(nextStpe == 'down'){
            fntA.gameResult = 'lost';
            postGameRecord(fntA.playerId,fntA.playername,fntA.allmoveA,fntA.gameResult);
          }else if( nextStpe == 'ok'){
            // console.log('try for next stpe');
            fntA.defaultY = newY;
            $('#myCanvas').css('background-position','0px -' + fntA.gameLevel*30 + 'px');
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
        cancelRAF(fntA.requestId);
    }
    function stopAnimationClimer(e) {
        // use the requestID to cancel the requestAnimationFrame call
        cancelRAF(fntA.ClimerRequestId);
    }
    function pauseAnimation(e) {
        // use the requestID to cancel the requestAnimationFrame call
        animate();
    }
    //debug;

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
    $(".connection").on("click", function(){
      // if(!fntA.startime){
        showSubMask('gamemask');
        $('.gamemask .countdown').html();
        clearTimeout();
        countdownClimerTime(6);
        animate();
        fntA.ClimerOn = true;
      // }
    });

  }//climer game

  //main run

  var pageUrl = 'http://www.quyeba.com/event/explorerchallenge/m_c.html'; 

  //fntA.gameLevel = 1;
  fntA.gameOn = false ;

  var loadedImages = 0;
  //run
  
  var newUrl = pageUrl +"?key=" +fntA.key;
  $("#qrcode").append("<img src='http://chart.apis.google.com/chart?chs=320x320&cht=qr&chld=H|2&chl="+ newUrl + "&choe=UTF-8' />");
  console.log( newUrl);
  //postRegiste
  $(".btn_register").on("click", function(){
    postRegister();
  });
  //login
  $(".btn_login").on("click", function(){
    postLogin();
  });
  $(".btn_login").on("click", function(){
    postLogin();
  });

});


