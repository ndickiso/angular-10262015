(function(angular) {


	angular.module("MyApp.Constants", []);
	angular.module("MyApp.Controllers", ["MyApp.Constants"]);
	angular.module("MyApp", ["MyApp.Controllers"]);

})(angular);
