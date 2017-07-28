itApp.controller("PlayerController", function PlayerController($scope, $http) {
	$scope.players = [];
	$scope.player = {};
	$scope.stealthRoll=0;
	$scope.perceptionRoll = 0;
	$scope.investigateRoll = 0;

	
	$http.get('Data/players.json').success(function(response){
		$scope.players = response;
	});
	
	var rollTemplate = '<i class="fa fa-cog fa-spin" data-ng-click="Roll(row.entity)"></i>';
	
	$scope.PlayersGrid = {
		data: 'players',
		columnDefs: [
			{field: 'name', displayName: 'Name'},
			{field: 'ac', displayName: 'AC'},
			{field: 'passivePerception', displayName: 'P Perception', cellClass: 'Grid-Cell-Center'},
			{field: 'passiveStealth', displayName: 'P Stealth', cellClass: 'Grid-Cell-Center'},
			{field: 'passiveInvestigation', displayName: 'P Investigation', cellClass: 'Grid-Cell-Center'},
			{field: 'perceptionBonus', displayName: 'Perception', cellClass: 'Grid-Cell-Center'},
			{field: 'perceptionRoll', displayName: 'Perception Roll', cellClass: 'Grid-Cell-Center-Bold'},
			{field: 'stealthBonus', displayName: 'Stealth', cellClass: 'Grid-Cell-Center'},
			{field: 'stealthRoll', displayName: 'Stealth Roll', cellClass: 'Grid-Cell-Center-Bold'},
			{field: 'investigateBonus', displayName: 'Investigate', cellClass: 'Grid-Cell-Center'},
			{field: 'investigateRoll', displayName: 'Investigate Roll', cellClass: 'Grid-Cell-Center-Bold'}
		]
	};
	

	
	$scope.RollAll= function(){
		$scope.players.forEach(function(player){
			$scope.Roll(player);
		});
		
		
	};
	
	$scope.Roll=function(player){
			$scope.player = player;

			var stealthRandom = Math.random();
			var stealthMulti = stealthRandom * 21;
			var stealthResult = Math.floor(stealthMulti);
			
			var perceptionRandom = Math.random();
			var perceptionMulti = perceptionRandom * 21;
			var perceptionResult = Math.floor(perceptionMulti);
			
			var investigateRandom = Math.random();
			var investigateMulti = investigateRandom * 21;
			var investigateResult = Math.floor(investigateMulti);
			
			$scope.player.stealthRoll = stealthResult + Number(player.stealthBonus);
			$scope.player.perceptionRoll = perceptionResult + Number(player.perceptionBonus);
			$scope.player.investigateRoll = investigateResult + Number(player.investigateBonus);	
	};
});