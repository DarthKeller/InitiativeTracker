//Initiative

cipsApp.controller("InitiativeController",
    function InitiativeController($scope) {

        // Variables
        $scope.Monsters = [];
        $scope.initiative = [];
        $scope.MonsterName = '';
        $scope.MonsterBonus = '';
        $scope.MonsterCount = '';
        $scope.MonsterAC = '';
        $scope.MonsterMaxHP = '';

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


        //Grids
        $scope.MonstersGrid = {
            data: 'Monsters',
            columnDefs: [
                { field: 'Name' },
                { field: 'Bonus' },
                { field: 'AC' },
                { field: 'MaxHP', displayName: 'Max HP' }
            ]
        };

        var faCellTemplate = '<input  type="text" ng-input="COL_FIELD" ng-model="COL_FIELD"  data-ng-blur="Damage(row.entity)" style="width: 100px;" />';
		var turnTemplate = '<i class="fa fa-arrow-right gridCellNoBackground" data-ng-show="COL_FIELD==true"></i>';

        $scope.InitiativeGrid = {
            data: 'initiative',
            enableCellEditOnFocus: true,
            multiSelect: false,
            enableRowSelection: false,

            columnDefs: [
            	{field: 'IsTurn', displayName: '', cellClass: 'gridCellNoBackground', cellTemplate: turnTemplate, width: '50px'},
                { field: 'Name' },
                { field: 'Initiative' },
                { field: 'AC' },
                { field: 'MaxHP', displayName: 'Max HP' },
                { field: 'CurrentHP', displayName: 'Current HP' },
                { field: 'Damage', enableCellEdit: true, editableCellTemplate: faCellTemplate},
                //{ field: 'Damage', displayName: ''}
            ]
        };

        $scope.InitiativeGrid.rowTemplate =
            '<div style="height: 100%" ng-class="{Dead: row.getProperty(\'CurrentHP\')<=\'0\', Full: row.getProperty(\'CurrentHP\') == row.getProperty(\'MaxHP\'), Hurt: row.getProperty(\'CurrentHP\')<row.getProperty(\'MaxHP\'), Player:  !row.getProperty(\'CurrentHP\')}">' +
            '<div ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
            '<div ng-cell></div>' +
            '</div>' +
            '</div>';

		$scope.ProgressInitiative = function(){
			var active = Enumerable.From($scope.initiative).Where(function(item){return item.IsTurn;}).First(function(x){return x;});
			var index = $scope.initiative.indexOf(active);
			var nextIndex = index+1;
			
			if(nextIndex > $scope.initiative.length -1){
				nextIndex = 0;
			}
			
			var nextActive = $scope.initiative[nextIndex];
			
			active.IsTurn = false;
			nextActive.IsTurn = true;
		};

        $scope.Damage = function(monster) {
            monster.CurrentHP = Number(monster.CurrentHP) - Number(monster.Damage);
            monster.Damage = '';
        };

        $scope.AddMonsters = function() {
            if (!$scope.MonsterCount)
                $scope.MonsterCount = 1;

            for (var i = 1; i <= $scope.MonsterCount; i++) {
                var monster = {};
                monster.Name = $scope.MonsterName + ' ' + i;
                monster.Bonus = $scope.MonsterBonus;
                monster.AC = $scope.MonsterAC;
                monster.MaxHP = $scope.MonsterMaxHP;
                monster.CurrentHP = $scope.MonsterMaxHP;

                $scope.Monsters.push(monster);

            }

            $scope.MonsterName = '';
            $scope.MonsterBonus = '';
            $scope.MonsterCount = '';
            $scope.MonsterAC = '';
            $scope.MonsterMaxHP = '';
        };

        $scope.ClearMonsters = function() {
            $scope.Monsters = [];
            $scope.initiative = [];

            $scope.Player1Initiative = '';

            $scope.Player2Initiative = '';

            $scope.Player3Initiative = '';

            $scope.Player4Initiative = '';

            $scope.Player5Initiative = '';
        };

        $scope.ClearInitiative = function() {
            $scope.initiative = [];
        };

        $scope.Roll = function () {
            $scope.initiative = [];
            var count = $scope.Monsters.length;
            for (var i = 0; i < count; i++) {
                var monster = $scope.Monsters[i];

                var random = Math.random();
                var multi = random * 21;
                var result = Math.floor(multi);

                var final = Number(result) + Number(monster.Bonus);

                var x = {};
                x.Name = monster.Name;
                x.Initiative = final;
                x.AC = monster.AC;
                x.MaxHP = monster.MaxHP;
                x.CurrentHP = monster.CurrentHP;
				x.IsTurn = false;

                $scope.initiative.push(x);
            }

            if ($scope.Player1) {
                var player1 = {};
                player1.Name = $scope.Player1;
                player1.Initiative = Number($scope.Player1Initiative);
                player1.IsTurn = false;
                $scope.initiative.push(player1);
            }

            if ($scope.Player2) {
                var player2 = {};
                player2.Name = $scope.Player2;
                player2.Initiative = Number($scope.Player2Initiative);
                player2.IsTurn = false;
                $scope.initiative.push(player2);
            }

            if ($scope.Player3) {
                var player3 = {};
                player3.Name = $scope.Player3;
                player3.Initiative = Number($scope.Player3Initiative);
                player3.IsTurn = false;
                $scope.initiative.push(player3);
            }

            if ($scope.Player4) {
                var player4 = {};
                player4.Name = $scope.Player4;
                player4.Initiative = Number($scope.Player4Initiative);
                player4.IsTurn = false;
                $scope.initiative.push(player4);
            }

            if ($scope.Player5) {
                var player5 = {};
                player5.Name = $scope.Player5;
                player5.Initiative = Number($scope.Player5Initiative);
                player5.IsTurn = false;
                $scope.initiative.push(player5);
            }


            var sortedInitiative = Enumerable.From($scope.initiative).OrderByDescending(function (i) { return i.Initiative; })
                .Select(function (s) { return s; }).ToArray();

			var first = Enumerable.From($scope.initiative).OrderByDescending(function(i){return i.Initiative;}).First(function(x){return x;});
			first.IsTurn = true;

            $scope.initiative = sortedInitiative;
        };
    });

