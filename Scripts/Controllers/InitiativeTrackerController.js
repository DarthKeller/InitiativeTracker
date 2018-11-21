//Initiative

itApp.controller("InitiativeController", function InitiativeController($scope, $http, $sanitize) {
	// Variables
	$scope.monsterData = [];
	$scope.xpData = [];
	$scope.players = [];

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
	$scope.EncounterXP = 0;
	$scope.XPPerPlayer = 0;

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

	var faCellTemplate = '<input handle-Enter type="text" ng-input="COL_FIELD" ng-model="COL_FIELD"  data-ng-blur="Damage(row.entity)" style="width: 100px;" />';
	var turnTemplate = '<i class="fa fa-arrow-right" data-ng-show="COL_FIELD==true"></i>';
	var removeTemplate = '<i class="fa fa-trash" data-ng-show="COL_FIELD!=true" style="cursor:pointer;" data-ng-click="RemoveInitiative(row.entity)"></i>';

	$scope.InitiativeGrid = {
		data : 'initiative',
		enableCellEditOnFocus : true,
		multiSelect : false,
		enableRowSelection : true,
		enableSorting : false,
		rowHeight : 23,
		showFooter: false,		
		columnDefs : [
		{
			field : 'IsTurn',
			displayName : '',
			cellClass : 'gridCellNoBackground',
			cellTemplate : turnTemplate,
			width : '20px',
			enableCellEdit : false
		}, 
		{
			field : 'Name',
			enableCellEdit : false,
			width : '***'
		}, {
			field : 'Initiative',
			enableCellEdit : false,
			width : '**'
		}, {
			field : 'armor_class',
			displayName : 'AC',
			enableCellEdit : true,
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
			cellClass: 'Grid-Cell-Center',
			width : '50px'
		}],
		afterSelectionChange: function(row){
			if($scope.ActiveMonster != row.entity){
				if(row.entity.size){
					$scope.ActiveMonster = row.entity;
				}						
			}			
		}
	};

	$scope.InitiativeGrid.rowTemplate = '<div style="height: 100%; " ng-class="{Dead: row.getProperty(\'CurrentHP\')<=\'0\', Full: row.getProperty(\'CurrentHP\') == row.getProperty(\'hit_points\'), Bloody: row.getProperty(\'CurrentHP\') <= row.getProperty(\'BloodyValue\'),  Hurt: row.getProperty(\'CurrentHP\')<row.getProperty(\'hit_points\') && row.getProperty(\'CurrentHP\') > row.getProperty(\'BloodyValue\'), Player:  !row.getProperty(\'hit_points\'), IsTurn: row.getProperty(\'IsTurn\')}">' + '<div ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' + '<div ng-cell></div>' + '</div>' + '</div>';

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

		while(nextActive.CurrentHP <=0){
			nextIndex++;
			nextActive = $scope.initiative[nextIndex];

			if(!nextActive.CurrentHP){
				break;
			}
		}

		active.IsTurn = false;
		nextActive.IsTurn = true;

		if(nextActive.size){
			$scope.ActiveMonster = nextActive;	
		}
		
	};

	$scope.Damage = function(monster) {
		if (!monster.Damage) {
			return;
		}
		
		var newCurrentHP = Number(monster.CurrentHP) - Number(monster.Damage);
		
		if(newCurrentHP < 0){
			newCurrentHP = 0;
		}

		monster.CurrentHP = newCurrentHP;
		monster.Damage = '';
	};

	$scope.AddMonsters = function() {
		if (!$scope.MonsterCount)
			$scope.MonsterCount = 1;

		for (var i = 1; i <= $scope.MonsterCount; i++) {
			if ($scope.selectedMonster.name != "Select") {
				var monster = angular.copy($scope.selectedMonster);
				monster.Name = $scope.MonsterName + ' ' + i;
				monster.Bonus = $scope.MonsterBonus;
				monster.CurrentHP = $scope.MonsterMaxHP;
				monster.Saves = "";
				monster.Skills = "";
				monster.StrengthBonus = $scope.CalculateBonus(monster.strength);
				monster.DexterityBonus = $scope.CalculateBonus(monster.dexterity);
				monster.ConstitutionBonus = $scope.CalculateBonus(monster.constitution);
				monster.IntelligenceBonus = $scope.CalculateBonus(monster.intelligence);
				monster.WisdomBonus = $scope.CalculateBonus(monster.wisdom);
				monster.CharismaBonus = $scope.CalculateBonus(monster.charisma);
				monster.XP = $scope.CalculateXP(monster.challenge_rating);
				monster.BloodyValue = Math.floor(Number(monster.hit_points) / 2);

				$scope.BuildSkills(monster);

				$scope.Monsters.push(monster);
			} else {
				var monster = {};
				monster.Name = $scope.MonsterName + ' ' + i;
				monster.name = $scope.MonsterName;
				monster.Bonus = $scope.MonsterBonus;
				monster.hit_points = $scope.MonsterMaxHP;
				monster.CurrentHP = $scope.MonsterMaxHP;
				monster.armor_class = $scope.MonsterAC;
								$scope.Monsters.push(monster);

			}

		}

		$scope.MonsterName = '';
		$scope.MonsterBonus = '';
		$scope.MonsterCount = '';
		$scope.MonsterAC = '';
		$scope.MonsterMaxHP = '';
		$scope.selectedMonster = $scope.monsterData[0];
	};

	$scope.AddAndRollMonsters = function(){
		alert('hello');
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

	$scope.CalculateXP = function(challenge) {
		$scope.xpData.forEach(function(item) {
			var x = 1;
		});

		var x = Enumerable.From($scope.xpData).First(function(x) {
			return x.challenge == challenge;
		});

		return x.xp;
	};

	$scope.CalculateBonus = function(stat) {
		var bonus = Math.floor(((stat - 10) / 2));

		if (bonus <= 0) {
			return bonus;
		} else if (bonus > 0) {
			return "+" + bonus;
		} else {
			return "-" + bonus;
		}
	};

	$scope.ClearMonsters = function() {
		$scope.Monsters = [];
	};

	$scope.ClearInitiative = function() {
		
		if(!confirm("Do you really want to clear the initiative order and all monsters?")){
			return;
		}
		
		$scope.Monsters = [];
		$scope.initiative = [];
		$scope.roundCount = 0;
		
		$scope.players.forEach(function(player){
			player.initiative = '';
		});

/*
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
*/
	};

	function RollDice(entity){
			var final = 0;
			//var monster = $scope.Monsters[i];
			var random = Math.random();
			var multi = random * 21;
			var result = Math.floor(multi);

			if(result == 0)
			{
				result = 1;
			}

			final = Number(result) + Number(entity.Bonus);
			
			return final;
	}

	$scope.Roll = function() {
		var activePlayers = 0;
		$scope.initiative = [];
		$scope.EncounterXP = 0;
		$scope.XPPerPlayer = 0;
		var count = $scope.Monsters.length;
		for (var i = 0; i < count; i++) {
			//var final = 0;
			var monster = $scope.Monsters[i];
			//var random = Math.random();
			//var multi = random * 21;
			//var result = Math.floor(multi);

			//if(result == 0)
			//{
				//result = 1;
			//}

			//final = Number(result) + Number(monster.Bonus);	

			var x = angular.copy(monster);
			x.Initiative = RollDice(monster);
			//x.CurrentHP = monster.CurrentHP;
			x.IsTurn = false;
			
			if(x.XP){
				$scope.EncounterXP += Number(x.XP);	
			}
			else{
				$scope.EncounterXP = "Custom";
			}
			

			$scope.initiative.push(x);
		}

		$scope.players.forEach(function(player){
			var obj = {};
			obj.Name=player.name;
			obj.Initiative = Number(player.initiative);
			obj.IsTurn = false;
			obj.armor_class = player.ac;
			$scope.initiative.push(obj);
		});


		if($scope.EncounterXP != "Custom"){
			$scope.XPPerPlayer = Number($scope.EncounterXP) / Number($scope.players.length);
		}
		else{
			$scope.XPPerPlayer = "Custom";
		}
		
		SortInitiative();

	};

	function SortInitiative(){
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
	}

	$scope.RemovePlayer=function(player){
	var index = $scope.players.indexOf(player);
	$scope.players.splice(index, 1);
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

	$http.get('Data/xp.json').success(function(response) {
		$scope.xpData = response;
	});

	$http.get('Data/players.json').success(function(response) {
		$scope.players = response;

		for (var i = 1; i <= $scope.players.length; i++) {
			var index = i - 1;
			var player = $scope.players[index];

			var variableName = "Player" + i;
			$scope[variableName] = player.name;

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

