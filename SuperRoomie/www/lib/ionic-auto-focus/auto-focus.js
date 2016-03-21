angular.module('focusMe', [])
.directive('focusMe', function () {
  return {
    link: function (scope, element, attrs) {
      var focus = function () {
		  console.log("focussing"+element[0]);
        element[0].focus();
		element[0].select();
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.show().then(function(){
            cordova.plugins.Keyboard.disableScroll(true);
        }); //open keyboard manually
        }
      };
      scope.$on('popupLoaded', function () {
        console.log('View is loaded.');
        focus();
      });
    }
  };
})