//Initiative

itApp.controller("InitiativeController", function InitiativeController($scope, $http) {
	// Variables
	$scope.monsterData = [];
	$scope.selectedMonster = {};
	$scope.roundCount = 0;
	$scope.ActiveMonster = {};
	$scope.BuildDefault = false;

	$scope.Monsters = [];
	$scope.initiative = [];
	$scope.MonsterName = '';
	$scope.MonsterBonus = '';
	$scope.MonsterCount = '';
	$scope.MonsterAC = '';
	$scope.MonsterMaxHP = '';
	$scope.SelectedItem = {};

	$scope.Player1 = '';
	$scope.Player1Initiative = '';

	$scope.Player2 = '';
	$scope.Player2Initiative = '';

	$scope.Player3 = '';
	$scope.Player3Initiative = '';

	$scope.Player4 = '';
	$scope.Player4Initiative = '';

	$scope.Player5 = '';
	$scope.Player5Initiative = '';

	$scope.Player6 = '';
	$scope.Player6Initiative = '';

	$scope.Player7 = '';
	$scope.Player7Initiative = '';

	$scope.Player8 = '';
	$scope.Player8Initiative = '';

	$scope.Player9 = '';
	$scope.Player9Initiative = '';

	$scope.Player10 = '';
	$scope.Player10Initiative = '';

	//Grids
	$scope.MonstersGrid = {
		data : 'Monsters',
		columnDefs : [{
			field : 'name'
		}, {
			field : 'Bonus'
		}, {
			field : 'armor_class',
			displayName : 'AC'
		}, {
			field : 'hit_points',
			displayName : 'Max HP'
		}]
	};

	var faCellTemplate = '<input  type="text" ng-input="COL_FIELD" ng-model="COL_FIELD"  data-ng-blur="Damage(row.entity)" style="width: 100px;" />';
	var turnTemplate = '<i class="fa fa-arrow-right" data-ng-show="COL_FIELD==true"></i>';
	var removeTemplate = '<i class="fa fa-trash" data-ng-show="COL_FIELD!=true" style="cursor:pointer;" data-ng-click="RemoveInitiative(row.entity)"></i>';

	$scope.InitiativeGrid = {
		data : 'initiative',
		enableCellEditOnFocus : true,
		multiSelect : false,
		enableRowSelection : true,
		enableSorting : false,
		rowHeight : 23,
		columnDefs : [{
			field : 'IsTurn',
			displayName : '',
			cellClass : 'gridCellNoBackground',
			cellTemplate : turnTemplate,
			width : '20px',
			enableCellEdit : false
		}, {
			field : 'name',
			enableCellEdit : false,
			width : '***'
		}, {
			field : 'Initiative',
			enableCellEdit : false,
			width : '**'
		}, {
			field : 'armor_class',
			displayName : 'AC',
			enableCellEdit : false,
			width : '*'
		}, {
			field : 'hit_points',
			displayName : 'Max HP',
			enableCellEdit : false,
			width : '*'
		}, {
			field : 'CurrentHP',
			displayName : 'Current HP',
			enableCellEdit : false,
			width : '*'
		}, {
			field : 'Damage',
			enableCellEdit : true,
			editableCellTemplate : faCellTemplate,
			width : '*'
		}, {
			field : 'IsTurn',
			displayName : '',
			cellTemplate : removeTemplate,
			enableCellEdit : false,
			width : '*'
		}]
	};

	$scope.InitiativeGrid.rowTemplate = '<div style="height: 100%; " ng-class="{Dead: row.getProperty(\'CurrentHP\')<=\'0\', Full: row.getProperty(\'CurrentHP\') == row.getProperty(\'hit_points\'), Hurt: row.getProperty(\'CurrentHP\')<row.getProperty(\'hit_points\'), Player:  !row.getProperty(\'CurrentHP\')}">' + '<div ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' + '<div ng-cell></div>' + '</div>' + '</div>';

	$scope.ProgressInitiative = function() {
		var active = Enumerable.From($scope.initiative).Where(function(item) {
			return item.IsTurn;
		}).First(function(x) {
			return x;
		});
		var index = $scope.initiative.indexOf(active);
		var nextIndex = index + 1;

		if (nextIndex > $scope.initiative.length - 1) {
			nextIndex = 0;
			$scope.roundCount++;
		}

		var nextActive = $scope.initiative[nextIndex];

		active.IsTurn = false;
		nextActive.IsTurn = true;

		$scope.ActiveMonster = nextActive;
	};

	$scope.Damage = function(monster) {
		if (!monster.Damage) {
			return;
		}

		monster.CurrentHP = Number(monster.CurrentHP) - Number(monster.Damage);
		monster.Damage = '';
	};

	$scope.AddMonsters = function() {
		if (!$scope.MonsterCount)
			$scope.MonsterCount = 1;

		for (var i = 1; i <= $scope.MonsterCount; i++) {

			var monster = angular.copy($scope.selectedMonster);
			monster.name = $scope.MonsterName + ' ' + i;
			monster.Bonus = $scope.MonsterBonus;
			monster.CurrentHP = $scope.MonsterMaxHP;
			monster.Saves = "";
			monster.Skills = "";

			$scope.BuildSkills(monster);

			$scope.Monsters.push(monster);

		}

		$scope.MonsterName = '';
		$scope.MonsterBonus = '';
		$scope.MonsterCount = '';
		$scope.MonsterAC = '';
		$scope.MonsterMaxHP = '';
		$scope.selectedMonster = $scope.monsterData[0];
	};

	$scope.BuildSkills = function(monster) {
		for (var property in monster) {
			if (monster.hasOwnProperty(property)) {
				if (property.indexOf("save") > 0) {
					if (monster.Saves != "") {
						monster.Saves = monster.Saves + ", ";
					}

					switch(property) {
					case "strength_save":
						monster.Saves = monster.Saves + "Str " + "+" + monster[property];
						break;
					case "dexterity_save":
						monster.Saves = monster.Saves + "Dex " + "+" + monster[property];
						break;
					case "constitution_save":
						monster.Saves = monster.Saves + "Con " + "+" + monster[property];
						break;
					case "intelligence_save":
						monster.Saves = monster.Saves + "Int " + "+" + monster[property];
						break;
					case "wisdom_save":
						monster.Saves = monster.Saves + "Wis " + "+" + monster[property];
						break;
					case "charisma_save":
						monster.Saves = monster.Saves + "Cha " + "+" + monster[property];
						break;
					}
				}

				// go through skills here
				if (property == "acrobatics") {
					if (monster.Skills != "") {
						monster.Skills = monster.Skills + ", ";
					}

					monster.Skills = monster.Skills + "Acrobatics " + "+" + monster[property];
				}
				
				if (property == "arcana") {
					if (monster.Skills != "") {
						monster.Skills = monster.Skills + ", ";
					}

					monster.Skills = monster.Skills + "Arcana " + "+" + monster[property];
				}
				
				if (property == "athletics") {
					if (monster.Skills != "") {
						monster.Skills = monster.Skills + ", ";
					}

					monster.Skills = monster.Skills + "Athletics " + "+" + monster[property];
				}				
				
				if (property == "deception") {
					if (monster.Skills != "") {
						monster.Skills = monster.Skills + ", ";
					}

					monster.Skills = monster.Skills + "Deception " + "+" + monster[property];
				}
				
				if (property == "history") {
					if (monster.Skills != "") {
						monster.Skills = monster.Skills + ", ";
					}

					monster.Skills = monster.Skills + "History " + "+" + monster[property];
				}				

				if (property == "insight") {
					if (monster.Skills != "") {
						monster.Skills = monster.Skills + ", ";
					}

					monster.Skills = monster.Skills + "Insight " + "+" + monster[property];
				}

				if (property == "intimidation") {
					if (monster.Skills != "") {
						monster.Skills = monster.Skills + ", ";
					}

					monster.Skills = monster.Skills + "Intimidation " + "+" + monster[property];
				}

				if (property == "investigation") {
					if (monster.Skills != "") {
						monster.Skills = monster.Skills + ", ";
					}

					monster.Skills = monster.Skills + "Investigation " + "+" + monster[property];
				}

				if (property == "medicine") {
					if (monster.Skills != "") {
						monster.Skills = monster.Skills + ", ";
					}

					monster.Skills = monster.Skills + "Medicine " + "+" + monster[property];
				}

				if (property == "nature") {
					if (monster.Skills != "") {
						monster.Skills = monster.Skills + ", ";
					}

					monster.Skills = monster.Skills + "Nature " + "+" + monster[property];
				}

				if (property == "perception") {
					if (monster.Skills != "") {
						monster.Skills = monster.Skills + ", ";
					}

					monster.Skills = monster.Skills + "Perception " + "+" + monster[property];
				}

				if (property == "performance") {
					if (monster.Skills != "") {
						monster.Skills = monster.Skills + ", ";
					}

					monster.Skills = monster.Skills + "Performance " + "+" + monster[property];
				}

				if (property == "persuasion") {
					if (monster.Skills != "") {
						monster.Skills = monster.Skills + ", ";
					}

					monster.Skills = monster.Skills + "Persuasion " + "+" + monster[property];
				}

				if (property == "religion") {
					if (monster.Skills != "") {
						monster.Skills = monster.Skills + ", ";
					}

					monster.Skills = monster.Skills + "Religion " + "+" + monster[property];
				}

				if (property == "stealth") {
					if (monster.Skills != "") {
						monster.Skills = monster.Skills + ", ";
					}

					monster.Skills = monster.Skills + "Stealth " + "+" + monster[property];
				}

				if (property == "survival") {
					if (monster.Skills != "") {
						monster.Skills = monster.Skills + ", ";
					}

					monster.Skills = monster.Skills + "Survival " + "+" + monster[property];
				}
			}
		}
	};

	$scope.ClearMonsters = function() {
		$scope.Monsters = [];
	};

	$scope.ClearInitiative = function() {
		$scope.Monsters = [];
		$scope.initiative = [];
		$scope.roundCount = 0;

		$scope.Player1Initiative = '';

		$scope.Player2Initiative = '';

		$scope.Player3Initiative = '';

		$scope.Player4Initiative = '';

		$scope.Player5Initiative = '';
		$scope.Player6Initiative = '';
		$scope.Player7Initiative = '';
		$scope.Player8Initiative = '';
		$scope.Player9Initiative = '';
		$scope.Player10Initiative = '';
	};

	$scope.Roll = function() {
		$scope.initiative = [];
		var count = $scope.Monsters.length;
		for (var i = 0; i < count; i++) {
			var monster = $scope.Monsters[i];

			var random = Math.random();
			var multi = random * 21;
			var result = Math.floor(multi);

			var final = Number(result) + Number(monster.Bonus);

			var x = angular.copy(monster);
			x.Initiative = final;
			//x.CurrentHP = monster.CurrentHP;
			x.IsTurn = false;

			$scope.initiative.push(x);
		}

		if ($scope.Player1) {
			var player1 = {};
			player1.name = $scope.Player1;
			player1.Initiative = Number($scope.Player1Initiative);
			player1.IsTurn = false;
			$scope.initiative.push(player1);
		}

		if ($scope.Player2) {
			var player2 = {};
			player2.name = $scope.Player2;
			player2.Initiative = Number($scope.Player2Initiative);
			player2.IsTurn = false;
			$scope.initiative.push(player2);
		}

		if ($scope.Player3) {
			var player3 = {};
			player3.name = $scope.Player3;
			player3.Initiative = Number($scope.Player3Initiative);
			player3.IsTurn = false;
			$scope.initiative.push(player3);
		}

		if ($scope.Player4) {
			var player4 = {};
			player4.name = $scope.Player4;
			player4.Initiative = Number($scope.Player4Initiative);
			player4.IsTurn = false;
			$scope.initiative.push(player4);
		}

		if ($scope.Player5) {
			var player5 = {};
			player5.name = $scope.Player5;
			player5.Initiative = Number($scope.Player5Initiative);
			player5.IsTurn = false;
			$scope.initiative.push(player5);
		}

		if ($scope.Player6) {
			var player6 = {};
			player6.name = $scope.Player6;
			player6.Initiative = Number($scope.Player6Initiative);
			player6.IsTurn = false;
			$scope.initiative.push(player6);
		}

		if ($scope.Player7) {
			var player7 = {};
			player7.name = $scope.Player7;
			player7.Initiative = Number($scope.Player7Initiative);
			player7.IsTurn = false;
			$scope.initiative.push(player7);
		}

		if ($scope.Player8) {
			var player8 = {};
			player8.name = $scope.Player8;
			player8.Initiative = Number($scope.Player8Initiative);
			player8.IsTurn = false;
			$scope.initiative.push(player8);
		}

		if ($scope.Player9) {
			var player9 = {};
			player9.name = $scope.Player9;
			player9.Initiative = Number($scope.Player9Initiative);
			player9.IsTurn = false;
			$scope.initiative.push(player9);
		}

		if ($scope.Player10) {
			var player10 = {};
			player10.name = $scope.Player10;
			player10.Initiative = Number($scope.Player10Initiative);
			player10.IsTurn = false;
			$scope.initiative.push(player10);
		}

		var sortedInitiative = Enumerable.From($scope.initiative).OrderByDescending(function(i) {
			return i.Initiative;
		}).Select(function(s) {
			return s;
		}).ToArray();

		var first = Enumerable.From($scope.initiative).OrderByDescending(function(i) {
			return i.Initiative;
		}).First(function(x) {
			return x;
		});
		first.IsTurn = true;
		$scope.ActiveMonster = first;

		$scope.initiative = sortedInitiative;
	};

	$scope.RemoveInitiative = function(entity) {
		var index = $scope.initiative.indexOf(entity);

		if (index > -1) {
			$scope.initiative.splice(index, 1);
		}
	};

	$http.get('Data/monsters.json').success(function(response) {
		$scope.monsterData = response;
		$scope.monsterData.unshift({
			name : 'Select'
		});
		$scope.selectedMonster = $scope.monsterData[0];

		if ($scope.BuildDefault == true) {
			$scope.ActiveMonster = $scope.monsterData[1];
		}
	});

	$scope.SelectMonster = function() {
		//alert($scope.selectedMonster.name);
		var dexterity = Number($scope.selectedMonster.dexterity);
		var dexBonus = Math.floor((dexterity - 10) / 2);
		$scope.MonsterName = $scope.selectedMonster.name;
		$scope.MonsterBonus = dexBonus;
		$scope.MonsterMaxHP = $scope.selectedMonster.hit_points;
		$scope.MonsterAC = $scope.selectedMonster.armor_class;
	};

});

