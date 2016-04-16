app.controller('bridgeController', function($scope, $http, $log, bridgeConnect, $interval, $location){

  $scope.ip = '192.168.1.137';
  $scope.username = null;
  $scope.apiMessage = null;
  $scope.getAuthUser = function(username){

    //TODO get rid of need for entering ip manually, search with cordova

    if(username != null){
     $log.info('true');

      bridgeConnect.getAuthUser($scope.ip, $scope.username).then(function(response){
        //out of the gate if it's already pressed, do this
        if(response.data[0].success){
          bridgeConnect.authUsername = response.data[0].success.username;
          bridgeConnect.username = $scope.username;
          $scope.apiMessage = 'link button pressed thank you!';
          $location.path('/lights');
        }

        else{  //if user not null, but response is link isn't pressed.. interval until it's pressed..
          // maybe cut this off after a certain ammount of time?
          $scope.apiMessage = response.data[0].error.description;

          var stop = $interval(function() {
            $log.info('hello');
            bridgeConnect.getAuthUser($scope.ip, $scope.username).then(function(response){

              if(response.data[0].success){
                bridgeConnect.authUsername = response.data[0].success.username;
                bridgeConnect.username = $scope.username;
                $log.info(response.data[0].success);


                $scope.apiMessage = 'link button pressed thank you!';
                $interval.cancel(stop);
                $location.path('/lights');
              }

            });
          }, 1000);
        }
      });

    }else{
      $log.info('false');
      $log.info($scope.username);

      $scope.usernameMessage = 'please enter a username';
    }

  }
});

app.controller('lightsController', function($scope, $log, bridgeConnect, lightsService, $http){

  $scope.username = 'david';
  $scope.lights = null;
  //authTest Username ='CJBjaqUW3YeFuvC1RBnsHKkBV-5oZHB0qvIsQc6y';
  $scope.authUsername = bridgeConnect.authUsername;
  $scope.showLights = function(){
    lightsService.getLights().then(function(response){
      $scope.lights = response.data;
    });
  };
  $scope.showLights();
  $scope.toggle = function(currentLight){

    var onOff = $scope.lights[currentLight].state.on ? false : true;

    lightsService.toggleLight(currentLight, onOff).then(function(response){
      if(response.data[0].success){
        $scope.lights[currentLight].state.on = onOff;
      }
    });
  };
  $scope.toggleAll = function(){
    lightsService.getGroup().then(function(response){
      $log.info(response);
      var onOff = response.data.action.on ? false : true;
      lightsService.toggleAll(onOff).then(function(response){
        $log.info(response);
      });

    });
  };


  $scope.getRGB = function(){
    // red
    var red = angular.element('.ui-colorpicker-rgb-r');
    var rtarget = red[0].querySelector('.ui-colorpicker-number');
    //green
    var green = angular.element('.ui-colorpicker-rgb-g');
    var gtarget = green[0].querySelector('.ui-colorpicker-number');
    //blue
    var blue = angular.element('.ui-colorpicker-rgb-b');
    var btarget = blue[0].querySelector('.ui-colorpicker-number');


    var r = angular.element(rtarget).val();
    var g = angular.element(gtarget).val();
    var b = angular.element(btarget).val();

    r = (r / 255).toFixed(2) ;        //R from 0 to 255
    g = (g / 255).toFixed(2) ;        //G from 0 to 255
    b =  (b / 255).toFixed(2) ;

    r = parseFloat(r);
    g = parseFloat(g);
    b = parseFloat(b);

    if (r > 0.04045){
      r = Math.pow((r + 0.055) / (1.055), 2.4);
    }
    else{
      r = r / 12.92;
    }
    if (g > 0.04045){
      g = Math.pow((g + 0.055) / (1.055), 2.4);
    }
    else{
      g = g / 12.92;
    }
    if (b > 0.04045){
      b = Math.pow((b + 0.055) / (1.055), 2.4);
    }
    else{
      b = b / 12.92;
    }
    // RGB to XYZ [M] for Wide RGB D65, http://www.developers.meethue.com/documentation/color-conversions-rgb-xy
    var X = r * 0.664511 + g * 0.154324 + b * 0.162028;
    var Y = r * 0.283881 + g * 0.668433 + b * 0.047685;
    var Z = r * 0.000088 + g * 0.072310 + b * 0.986039;
    // But we don't want Capital X,Y,Z you want lowercase [x,y] (called the color point) as per:
    if ((X + Y + Z) === 0){
      var xyObject = {x: 0, y: 0};
    }
    var xyObject = {x: X / (X + Y + Z), y: Y / (X + Y + Z)};

    var param = [xyObject.x, xyObject.y];
    $log.info(param);
    $http({
      url:  'http://'+'192.168.1.137'+'/api/'+'CJBjaqUW3YeFuvC1RBnsHKkBV-5oZHB0qvIsQc6y/groups/0/action',
      method: 'put',
      data: {xy: param}
    }).then(function(response){
      $log.info(response);
    });


  }
});