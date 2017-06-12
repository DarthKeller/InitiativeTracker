angular.module('itApp')
.directive('handleEnter', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {

				$(element).on('keyup', function(e){
					var x = 1;
                var code = e.keyCode || e.which;
                if (code == 13) { // ENTER pressed
                    e.preventDefault();
                    document.activeElement.blur();
                }					
				});
				
				
				
              $(element).on('keypress', function (e) {

                var code = e.keyCode || e.which;
                if (code == 13) { // ENTER pressed
                    e.preventDefault();
                    document.activeElement.blur();
                }
                else {
                    //any custom code. I am using regex to avoid alphabets
                    if (String.fromCharCode(e.keyCode).match(/[^0-9\.]-/g)) return false;
                }
            });
        }
    };
});