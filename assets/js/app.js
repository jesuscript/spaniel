angular.module("dapp",[
  "ngRoute"
]).config(["$routeProvider",function($routeProvider){
  $routeProvider.when("/", {
    templateUrl: "templates/index.html"
  });
}]);

