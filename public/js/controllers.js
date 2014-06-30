'use strict';

worldcup.controller('mainController',
  ['$scope', '$http',
	function ($scope, $http)
{
	// Initialize.
	var number = $scope.number = '';

	// Get the number.
	$http.get('/number')
	.success(function (data) {
		number = data.number;
	})
	.error(function (data) {
		console.log('Error.');
		console.log(data);
	});
}]);