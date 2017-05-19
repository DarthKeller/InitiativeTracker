var cipsApp = angular.module('cipsApp', [
    'ui.bootstrap',
    'ngGrid',
    'ngResource'
]).run(function ($templateCache) {
    
    //$templateCache.put("cellTemplate.html",
    //    "<div class=\"ngCellText\" ng-class=\"col.colIndex()\" title=\"{{COL_FIELD CUSTOM_FILTERS}}\"><span ng-cell-text>{{COL_FIELD CUSTOM_FILTERS}}</span></div>"
    //);

    //$templateCache.put('ui-grid/uiGridCell',
    //    "<div class=\"ui-grid-cell-contents\" title=\"{{COL_FIELD CUSTOM_FILTERS}}\">{{COL_FIELD CUSTOM_FILTERS}}</div>"
    //);
});