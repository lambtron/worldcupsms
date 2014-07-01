'use strict';

worldcup.controller('mainController',
  ['$scope', '$http',
	function ($scope, $http)
{
	// Initialize.
	$scope.number = '';

	// Get the number.
	$http.get('/number')
	.success(function (data) {
		$scope.number = beautifyTelNum(data.number);
	})
	.error(function (data) {
		console.log('Error:');
		console.log(data);
	});

	function beautifyTelNum (num) {
		// num is '+12409887758'
		// remove the first two characters
		// put '(' first
		// put ') ' after
		// put '-' after
		var arr = num.split('');
		arr.splice(0, 2);	// remove '+1'
		arr.unshift('(');
		arr.splice(4, 0, ') ');
		arr.splice(8, 0, '-');
		return arr.join('');
	}
}]);