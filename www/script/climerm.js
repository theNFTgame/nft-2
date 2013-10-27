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
        $('.playerinfoa .playername').html(fntA.playerName);
        $('.playerinfoa img').attr('src',fntA.playerAvatar);

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
















