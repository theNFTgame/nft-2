// 
var fntA = new Object();
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
window.requestAFrame = (function () {
  return window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  // if all else fails, use setTimeout
  function (callback) {
    return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
  };
})();

// handle multiple browsers for cancelAnimationFrame()
window.cancelAFrame = (function () {
  return window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.oCancelAnimationFrame ||
  function (id) {
    window.clearTimeout(id);
  };
})();

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
    // console.log(combine);
    switch (combine) {
      // when open m.page，call enter event，then show the game
      case fntA.key + "_enter":
        setTimeout(function () {
          if(fntA.allmoveB==0){
            showSubFrame('runbox','rundivbox');
            
            if(!fntA.gameOn){
              
              fntA.gameOn = true;
              countdownNewTime(9);
            }
          }
        }, 500);
        break;
      // shake event
      case fntA.key + "_changebg":
        //console.log('fntA.gameOn:' + fntA.gameOn +'fntA.shakerecord:' + fntA.shakerecord +'fntA.gameFinish:' + fntA.gameFinish );

        // if(fntA.gameOn && fntA.shakerecord === 1 && !fntA.gameFinish){

        //   //console.log('call 1 countdown');
        //   countdownNewTime(6);
        // }
        shakeEventDidOccur();
        if(fntA.shakeEng<3 && fntA.moveA <1){
          fntA.moveA = 2;
        }
        if(fntA.shakeEng<30){
          fntA.shakeEng = fntA.shakeEng + 6 ;
        }

        break;
    }
  });
}//climer game

//main run
function fntRun(){
  fntA.requestId = 0;
  fntA.startime = 0;
  fntA.image0 = new Image();  
  fntA.path0 = new Image();  
  fntA.imageMini = new Image();
  fntA.w = 320;  
  fntA.h = 491; 
  var ctx0,ctx1;  
  var y0,y1,y2,y3,y4,y5;  
  //fntA.gameLevel = 1;
  fntA.allmoveA = 0;
  fntA.allmoveB = 0;
  fntA.alltimes = 0;
  fntA.mapitem = 40;

  $('.iframbox iframe').remove();

  funMapload();
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
    if(num == 9 || num == 8){
      showSubMask('gamemask','howplay');
      $('.gamemask .countdown').html('');
    }
    if(num == 6 || num == 7 || num == 5 ){
      showSubMask('gamemask','connection');
    }
    if(num == 4 || num == 3 || num == 2 ){
      showSubMask('gamemask','countdown');
      $('.gamemask .countdown').html('<span class="'+ (num-1) + '">' + (num-1) + '</span>');
    }
    if(num === 1) {
      showSubMask('gamemask','countdown');
      $('.gamemask .countdown').html('<div class="pao"></div>');
    }
    if(num === 0) {
      if(!fntA.startime){
        showSubMask('gamemask');
        $('.gamemask .countdown').html();
        clearTimeout();
        start();
      }
    }
  }
  function countdownGameTime(secs) {
    //countdown
    secs = Number(secs);
    for (var i = secs; i >= 0; i--) {
      (function(index) {
        setTimeout(function(){
        doUpdateGameTime(index);
      }, (secs - index) * 1000);
    })(i);
    }
  }
  function doUpdateGameTime(num) {
    $('.gametime .countdown').html('<span class="'+ num + '">' + num + '</span>');
    if(num === 0) {
      if(!fntA.gameFinish){
        fntA.gameFinish = true;
      }
    }
  }
  function runInit() {
    ctx0 =  document.getElementById('canvas').getContext('2d');
    fntA.mapArr = new Array();
    fntA.mapPathArr = new Array();
    y0 = 0;
    y1 = -1*fntA.h;
    y2 = -2*fntA.h;
    y3 = 0;
    y4 = -1*fntA.h;
    y5 = -2*fntA.h;
    
    //the hard game level
    var defLevel = fRandomBy(1,100);
    if(defLevel>60){
      fntA.gameLevel = 2;
    }else{
      fntA.gameLevel = 1;
    }
    //the hard game level

      //generat map
      if(fntA.gameLevel != 3){
        for (var i = fntA.mapitem - 1; i >= 0; i--) {
          if (i === 20){
            fntA.mapArr.push(fntA.imgArr[9]);
            fntA.mapPathArr.push(fntA.pathArr[9]);
          }else if (i === 10){
            fntA.mapArr.push(fntA.imgArr[10]);
            fntA.mapPathArr.push(fntA.pathArr[10]);
          }else if (i === 0){
            fntA.mapArr.push(fntA.imgArr[11]);
            fntA.mapPathArr.push(fntA.pathArr[11]);
          }
        }
        //  console.log(fntA.mapArr);
      }
      //set map image
      fntA.image0.src = fntA.mapArr[0];  
      fntA.imageMini.src = fntA.imgArr[12];



    setTimeout(function () {
      ctx0.drawImage(fntA.image0,0,y0,fntA.w,fntA.h);  
      //  console.log('draw default map image');
    }, 40);


  }
  //}
  runInit();
    function start() {
      
      fntA.moveA = 1;
      fntA.moveB = 20;
      fntA.allmoveA = 0;
      fntA.allmoveB = 80;
      fntA.alltimes = 0;
      fntA.alltimesB = 0;
      fntA.shakeEng = 0;
      countdownGameTime(20);

      $('.player').addClass('running');
      //console.log("start");
      // if (window.performance.now) {
      //     startime = window.performance.now();
      // } else {
        fntA.startime = Date.now();
      // }
      fntA.requestId = window.requestAFrame(render);
    }
    function stop() {
      if (fntA.requestId)
        window.cancelAFrame(fntA.requestId); 
      $('.player').removeClass('running'); 
      //clear
      //ctx0.clearRect(0,0,fntA.w,fntA.h);
      //ctx1.clearRect(0,0,fntA.w,fntA.h); 
      ctxMini.clearRect(0,0,fntA.w,fntA.h);     
    }
    function wayRoll(e) {
      if((e+5) > fntA.mapitem ){
        e = (e+5) % fntA.mapitem;
      }
      return e;
    }
    function render(time) {
      //clear
      ctx0.clearRect(0,0,fntA.w,fntA.h);

      //draw now
      var move = Math.floor(fntA.moveA);
      var moveB = Math.floor(fntA.moveB);
      //ctx a
      y0 +=move;  
      y1 +=move;  
      y2 +=move; 
      //console.log("new: y0=" + y0 + ",y1=" + y1 + ",y2=" + y2 + ",move=" + move + ",fntA.moveA=" + fntA.moveA); 
      if(y0>=fntA.h){  
        //y0=move-2*fntA.h;  
        y0 = Math.min(y1,y2) - fntA.h;
        fntA.alltimes++;
        fntA.image0.src = fntA.mapArr[wayRoll((Number(fntA.alltimes)+3))]; 
        fntA.path0.src = fntA.mapPathArr[wayRoll((Number(fntA.alltimes)+3))]; 
        //  console.log("y0 new image:" + fntA.image0.src + "fntA.alltimes:"+fntA.alltimes);
      }  
      //draw now
      ctx0.drawImage(fntA.image0,0,y0,fntA.w,fntA.h);  
      //set requestId
      fntA.requestId = window.requestAFrame(render);
      //set stop process
      if(fntA.shakeEng < 6){
        fntA.moveA = fntA.moveA * 0.977;
        if (fntA.moveA<0.8) {fntA.moveA=0.8};
      }else{
        if (fntA.moveA<20) {fntA.moveA = fntA.moveA * 1.12;}
        if (fntA.moveA>20 && fntA.moveA<50) {fntA.moveA = fntA.moveA * 1.13;}
        if (fntA.moveA>=50) {fntA.moveA = fntA.moveA * 1.14;}
      }
      fntA.moveA = Math.max(0.8, Math.min(12, fntA.moveA));
      //console.log("old: y0=" + y0 + ",y1=" + y1 + ",y2=" + y2 + ",move=" + move + ",fntA.alltimes=" + fntA.alltimes);
      //if(fntA.moveA<=4){
      fntA.allmoveA +=move; 
      fntA.allmoveB +=moveB; 
      fntA.shakeEng = fntA.shakeEng -1;
      if (fntA.shakeEng<1) { fntA.shakeEng = 1};
      if (fntA.allmoveA===fntA.allmoveB){fntA.allmoveA=fntA.allmoveA+1;}
      $(".playerinfoa .playrecord").html(fntA.allmoveA + '米');
      $(".playerinfob .playrecord").html(fntA.allmoveB + '米');
      // console.log('fntA.shakeEng:' + fntA.shakeEng + ',fntA.moveA:' + fntA.moveA + ',fntA.allmoveA:' + fntA.allmoveA + ',fntA.gameLevel:' + fntA.gameLevel);

      //game resort
      if( fntA.gameFinish ){
        //  console.log("stop running at " + time + ", and allmoveA = " + fntA.allmoveA + ",fntA.alltimes= " +fntA.alltimes);
        stop();
        showSubMask('gamemask','loading');
        if(fntA.allmoveA>=fntA.allmoveB){ 
          fntA.gameResult = 'win';
        }else{
          fntA.gameResult = 'lost';
        }
        //id,name,record,result
        postGameRecord(fntA.playerId,fntA.playerName,fntA.allmoveA,fntA.gameResult);
        fntA.gameFinish = true;
      }
      //Game AI
      if(fntA.gameLevel ===1 ){
        if (fntA.allmoveB < 2000) {
          if( (fntA.allmoveA - fntA.allmoveB) >200 ){
            fntA.moveB = fntA.moveB * 1.05;
            fntA.moveB = Math.min( 16, Math.max(12,fntA.moveB));
          }
          if( (fntA.allmoveB - fntA.allmoveA) >100 ){
            fntA.moveB = fntA.moveB * 0.9992;
            fntA.moveB = Math.min( 18, Math.max(5,fntA.moveB));
          }
        }
        
        
      }
      // var tmpPlayerTopa , tmpPlayerTopb;
      // tmpPlayerTopa = 320 - fntA.moveA*8;
      // tmpPlayerTopb = 320 - fntA.moveB*10;
      // $('.playera').css('top',tmpPlayerTopa+'px');
      // $('.playerb').css('top',tmpPlayerTopb+'px');
      //the hard game level
      //mini map


    }
    // handle multiple browsers for requestAnimationFrame()
    //runInit();
    $('.startrun').on('click',function(){
      start();
    });
    $('.stop').on('click',function(){
      stop();
    });
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
    // console.log(combine);
    switch (combine) {
      // when open m.page，call enter event，then show the game
      case fntA.key + "_enter":
        setTimeout(function () {
          if(fntA.allmoveB==0){
            showSubFrame('runbox','rundivbox');
            
            if(!fntA.gameOn){
              
              fntA.gameOn = true;
              countdownNewTime(9);
            }
          }
        }, 500);
        break;
      // shake event
      case fntA.key + "_changebg":
        //console.log('fntA.gameOn:' + fntA.gameOn +'fntA.shakerecord:' + fntA.shakerecord +'fntA.gameFinish:' + fntA.gameFinish );

        // if(fntA.gameOn && fntA.shakerecord === 1 && !fntA.gameFinish){

        //   //console.log('call 1 countdown');
        //   countdownNewTime(6);
        // }
        shakeEventDidOccur();
        if(fntA.shakeEng<3 && fntA.moveA <1){
          fntA.moveA = 2;
        }
        if(fntA.shakeEng<30){
          fntA.shakeEng = fntA.shakeEng + 6 ;
        }

        break;
    }
  });

}
function shakeEventDidOccur() {
  //put your own code here etc.
  fntA.shakerecord = fntA.shakerecord + 1;
}


$(document).ready(function(){
	
	 var pageUrl = 'http://www.quyeba.com/event/explorerchallenge/m.html'; 
 //  var pageUrl = window.location.href;
	// pageUrl=pageUrl.replace(/index.html#\/run/g,"m.html");
 //  pageUrl=pageUrl.replace(/index.html#run/g,"m.html");
 //  pageUrl=pageUrl.replace(/index.html#\/index/g,"m.html");
 //  pageUrl=pageUrl.replace(/index.html#index/g,"m.html");
 //  pageUrl=pageUrl.replace(/index.html#\/reg/g,"m.html");
 //  pageUrl=pageUrl.replace(/index.html#reg/g,"m.html");
 //  pageUrl=pageUrl.replace(/index.html/g,"m.html");
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
  


});


