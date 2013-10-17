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
      // console.log(echoUid);
      if(echoUid !==''){
        fntA.playerId = echoUid;
        fntA.playername = echoName;
        //router.navigate('run');
        showSubFrame('runbox','qrcodebox');
        // fntRun();
        fntClimer();
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
          fntA.gameOn =  false;
          fntA.gameFinish =  false;
          fntA.shakerecord = 0;
          fntA.shakeEng = 0;
          $('.playrecord').html('0米');
          router.navigate('run');
          $('.gamemask .countdown').html('');
          var ctxMini =  document.getElementById('minimap').getContext('2d');
          ctxMini.clearRect(0,0,320,456);
          _smq.push(['pageview', '/replay', '再战一次']);
        // }
        showSubFrame('runbox','qrcodebox');
        // fntRun();
        fntClimer();
        $('.iframbox').html('');
        //$('.iframbox iframe').attr('src','');
        _smq.push(['pageview', '/run', '跑步']);
      }
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
    var postData = 'game_type=0&score='+record + '&user_id=' + id + '&user_name=' + name + '&result=' +result ;
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
        fntA.playerName = jsdata.user_name;
        fntA.playerId = jsdata.user_id;
        fntA.playerAvatar = 'http://tnf-avatar.b0.upaiyun.com/'+jsdata.user_avatar;
        router.navigate('run');
        showSubFrame('runbox','qrcodebox');

        $('.playerinfoa .playername').html(fntA.playerName);
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
    fntClimer();
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
        fntA.playerName = jsdata.user_name;
        fntA.playerId = jsdata.user_id;
        fntA.playerAvatar = jsdata.user_avatar;
        $('.playerinfoa .playername').html(fntA.playerName);
        router.navigate('run');
        showSubFrame('runbox','qrcodebox');
        //console.log('mid='+ jsdata.data.mid );
      },
      error: function(xhr, type){
        //  console.log('Ajax error!')
      }
    });
    // fntRun();
    fntClimer();
  }
  function funMapload(){
    fntA.imgArr = [
      'img/map/map01.jpg'];
    fntA.pathArr = [
      'img/map/map01.gif'];
  }

  //climer game
  function fntClimer(){
    console.log('fntClimer');

    fntA.ClimerOn = false;
    fntA.image0 = new Image();
    fntA.image0.src = 'img/map/map01.jpg';
    fntA.gameLevel = 1;
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var mapcanvas =  document.getElementById('mapCanvas');
    var ctx0 = mapcanvas.getContext('2d');

    
    var myRectangle = {
      x: 20,
      y: 0,
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
      if( num == 5 || num >= 6 ){
        showSubMask('gamemask','howplay');
        $('.gamemask .countdown').html('');
      }
      if( num == 4 || num == 1 || num == 2 || num == 3 ){
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
      for (var i = secs; i >= 0; i--) {
        (function(index) {
          setTimeout(function(){
          doUpdateClimerTime(index);
        }, (secs - index) * 1000);
      })(i);
      }
    }
    function doUpdateClimerTime(num) {
      //console.log('now countdown number is :' + num);
      if(num >0 ){
        console.log('ClimerTime:' + num + '\n');
        console.log(fntA.ClimerOn);
        if(fntA.ClimerOn){
          $('.light span').removeClass().addClass('lite'+num);
          $('.gamenote span').removeClass().addClass('note'+num);
        }
      }
      if(num === 0) {
        if(!fntA.startime){
          console.log('ClimerTime:' + num + '\n');
          clearTimeout();
          stopAnimation();
          fntA.ClimerOn = false;
          console.log(fntA.ClimerOn);
          fntA.gameResult = "lost";
          postGameRecord(fntA.playerId,fntA.playerName,fntA.x,fntA.gameResult);
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
              ctx0.drawImage(fntA.image0,-20,-446,360,912);
              countdownNewTime(3);
            }
          }, 500);
          break;
        // shake event
        case fntA.key + "_changebg":
          if(fntA.ClimerOn){
            stopAnimation();
            console.log(fntA.x);
            // fntA.gameLevel 
            if(fntA.x< (canvas.width - (canvas.width/10)*(fntA.gameLevel-1) )){
              console.log('You win this step!');
            }else{
              console.log('You lost!');
              fntA.gameResult = "lost";
              postGameRecord(fntA.playerId,fntA.playerName,fntA.x,fntA.gameResult);
            }
          }else{
            console.log('Your time is out.');
          }
          console.log('stop the Animation.');
          
          break;
      }
    });//socket.on

    function drawRectangle(myRectangle, context) {
      context.beginPath();
      context.rect(myRectangle.x, myRectangle.y, myRectangle.width, myRectangle.height);
      context.fillStyle = 'blue';
      context.fill();
      context.lineWidth = myRectangle.borderWidth;
      context.strokeStyle = 'blue';
      context.stroke();
    }
    function animate() {
      // update
      var time = (new Date()).getTime() - startTime;
      var amplitude = 160;

      // in ms
      var period = 1000;
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


    drawRectangle(myRectangle, context);
    var startTime = (new Date()).getTime();
    // animate(myRectangle, canvas, context, startTime);
    function stopAnimation(e) {
        // use the requestID to cancel the requestAnimationFrame call
        cancelRAF(fntA.requestId);
    }
    function pauseAnimation(e) {
        // use the requestID to cancel the requestAnimationFrame call
        animate();
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
    $(".connection").on("click", function(){
      if(!fntA.startime){
        showSubMask('gamemask');
        $('.gamemask .countdown').html();
        clearTimeout();
        countdownClimerTime(6);
        animate();
        fntA.ClimerOn = true;
      }
    });

  }//climer game

  //main run

  var pageUrl = 'http://www.quyeba.com/event/explorerchallenge/m_c.html'; 

  //fntA.gameLevel = 1;
  fntA.shakerecord = 0;  
  fntA.gameOn = false ;
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


