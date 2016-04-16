//Bridge API connect service
app.service('bridgeConnect', function($http){
  var self = this;
  self.authUsername = null;
  self.getAuthUser = function(ip, username){
    return $http({
      url: 'http://'+ip+'/api',
      method: 'post',
      data: {devicetype: "my_hue_app#iphone "+username}
    });
  };
  self.updateBackendSession = function(){
    // TODO   updates the bridge Authenticated User for the logged in user.
    //TODO build a backend for this in mongoDB.
  };
});

//lights API service
app.service('lightsService', function($log, bridgeConnect, $http){
  var self = this;
  self.ip = '192.168.1.137';
  self.getLights = function(){
    return $http({
      url: 'http://'+self.ip+'/api/'+'CJBjaqUW3YeFuvC1RBnsHKkBV-5oZHB0qvIsQc6y/lights',
      method: 'get'
    });
  };
  self.toggleLight = function(currentLight, onOff){

    $log.info(currentLight);
    return $http({
      url:  'http://'+self.ip+'/api/'+'CJBjaqUW3YeFuvC1RBnsHKkBV-5oZHB0qvIsQc6y/lights/'+currentLight+'/state',
      method: 'put',
      data: {"on": onOff}
    });
  };

  self.getGroup = function(){
    var newGroup = {
      lights: ['1', '2']
    };

    return $http({
      url:  'http://'+self.ip+'/api/'+'CJBjaqUW3YeFuvC1RBnsHKkBV-5oZHB0qvIsQc6y/groups/0',
      method: 'get',
    });
  };
  self.toggleAll = function(onOff){
    return $http({
      url:  'http://'+self.ip+'/api/'+'CJBjaqUW3YeFuvC1RBnsHKkBV-5oZHB0qvIsQc6y/groups/0/action',
      method: 'put',
      data: {on: onOff}
    });
  };
});