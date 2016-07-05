var app = angular.module("Colonnade", ['ngRoute', 'ngCookies'])
var API_URL = './api';

var email_regex = /^[a-z0-9._%+-]+@(?:[a-z0-9-]+\.)+[a-z]{2,4}$/;
var password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
var username_regex = /^[a-zA-Z0-9]{2,12}$/;
var name_regex = /^.{3,}$/;

app
.config(function ($routeProvider, $locationProvider, $httpProvider){
	$httpProvider.useApplyAsync(true);
	$routeProvider
	.when('/',{
		templateUrl:'public/template/main.html',
		controller:'mainCtrl'})
	.when('/dashboard/',{
		templateUrl:'public/template/dashboard.html',
		controller:'dashboardCtrl'})
	.when('/login/',{
		templateUrl:'public/template/login.html',
		controller:'loginCtrl'})
	.otherwise({
		templateUrl:'public/template/404.html',
		controller:'404Ctrl'});
})
.controller("GlobCtrl", function($scope, $rootScope, $http){

})
.controller("mainCtrl", function($scope, $rootScope, $http){

})
.controller("dashboardCtrl", function($scope, $rootScope, $http){

})
.controller("loginCtrl", function($scope, $rootScope, $location, login, register){
	$scope.login = function() {
		login($scope.loginInfo.email, $scope.loginInfo.password, function(data){
			if(data.error == 0){
				$location.url("/dashboard/");
				$scope.loginErrMsg = "";
			}else{
				$scope.loginErrMsg = data.message;
			}
		});
	};
	$scope.register = function() {
		var ri = $scope.registerInfo;
		var invalid = {}
		if(ri){
			invalid.email = !Boolean(ri.email ? ri.email.match(email_regex) : false);
			invalid.username = !Boolean(ri.username ? ri.username.match(username_regex) : false);
			invalid.name = !Boolean(ri.name ? ri.name.match(name_regex) : false);
			invalid.password = !Boolean(ri.password ? ri.password.match(password_regex) : false);
		}else{
			invalid.email = invalid.username = invalid.name = invalid.password = true;
		}

		if (!invalid.email && !invalid.username && !invalid.name && !invalid.password) {
			register(
				ri.email,
				ri.username,
				ri.name,
				ri.password,
				function(data){
					if(data.error == 0){
						$scope.registerInfo.email = "";
						$scope.registerInfo.username = "";
						$scope.registerInfo.name = "";
						$scope.registerInfo.password = "";
						$scope.regSucc = true;
						$scope.regErrMsg = "";
					}else{
						$scope.regErrMsg = data.message;
					}
				}
			);
		}
		$scope.regInvalid = invalid;
	};
})
.controller("404Ctrl", function($scope, $rootScope, $http){

})
.factory('login', function($http){
	return function(email, password, callback){
		$http.post(API_URL + '/user/login', {
			email: email,
			password: password
		}, {
			withCredentials: true,
		}).then(function successCallback(response) {
			callback(response.data);
		}, function errorCallback(response) {
			console.log("error");
			callback(response.data);
		});
	}
})
.factory('register', function($http){
	return function(email, username, name, password, callback){
		$http.post(API_URL + '/user/register', {
			email: email,
			password: password,
			name: name,
			username: username
		}, {
			withCredentials: true,
		}).then(function successCallback(response) {
			callback(response.data);
		}, function errorCallback(response) {
			console.log("error");
			callback(response.data);
		});
	}
});

$('#menu-button').click(function() {
	$('.ui.sidebar').sidebar('toggle');
});

$('.side-menu-button').click(function() {
	$('.ui.sidebar').sidebar('toggle');
});
