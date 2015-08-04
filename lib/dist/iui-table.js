angular.module('iui.table', ['iuiTableTemplates','iuiTable']);
angular.module('startFrom', [])
.filter('startFrom', function() {
  'use strict';
  return function(input, start) {
    if (input) {
      start = +start; //parse to int
      return input.slice(start);
    }
  };
});

/**
 * @author michael.ash
 * Creates a pager for items in a data table.  Uses the startOffset and limitTo filters.
 * Define the collection in the parent scope as an empty arry
 * Watch the collection in the parent scope
 * Initialize  the page property in the parent scope to 1
 * Set the pageSize property in the parent scope.
 */
angular.module('iui.pager', [])
.directive('iuiPager', function () {
  'use strict';
  return {
    restrict : 'E',
    replace : true,
    scope : {
      page :  '=',
      pageSize : '=',
      totalRecords : '='
    },
    templateUrl : '/$iui-table/templates/iui-pager.html',
    link : function(scope, element, attrs){
      scope.componentId = attrs.id;
      scope.$watch('totalRecords', function(){
        if (scope.page > scope.pageCount()) {
          scope.getFirstPage();
        }
      });
      scope.total = function(){
        var result = -1,
          count = parseInt(scope.totalRecords,10);
        if (!isNaN(count)){
          result = count;
        }
      };
      scope.currentPage = function () {

        var result = 1,
          page = scope.page;
        if (!isNaN(page)){
          result = page;
        }
        return result;
      };
      scope.page = scope.pageNum = scope.currentPage();

      scope.getFirstPage = function(){
        scope.page = scope.pageNum = 1;
      };
      scope.getPreviousPage = function(){
        scope.page = scope.pageNum = scope.page - 1;
      };
      scope.getNextPage = function(){
        scope.page = scope.pageNum = scope.page + 1;
      };
      scope.getLastPage = function(){
        scope.page = scope.pageNum = scope.pageCount();
      };
      scope.hasNoMore = function (){
        return (scope.page >= scope.pageCount());
      };
      scope.hasNoPrevious = function (){
        return (scope.page <= 1);
      };
      scope.hasNoPages = function (){
        return (scope.pageCount() < 2);
      };
      scope.jumpToPage = function (pageNum) {
        if (!isNaN(pageNum) && pageNum > 0 && pageNum % 1 === 0 && pageNum <= scope.pageCount()){
          scope.page = pageNum;
        } else {
          return;
        }
      };
      scope.goToPage = function (){
        var pageNumber = element.find('input[type=number]'),
            num = parseInt(pageNumber.val(),10);
        scope.page = num;
      };
      scope.pageCount = function() {
        return Math.ceil(scope.totalRecords / scope.pageSize);
      };
    }
  };
});
angular.module('iui.sortHeading', [])
.directive('iuiSortHeading', [function () {
  'use strict';
  return {
    restrict: 'E',
    transclude: true,
    scope :{
      iuiSortKey: '@',
      iuiSortBy: '=',
      iuiReverse: '='
    },
    templateUrl: app.root + '$iui-table/templates/iui-sort-heading.html'
  };
}]);
angular.module('iuiTable', ['iui.pager', 'iui.sortHeading', 'startFrom'])
.directive('iuiTable', [function () {
  'use strict';
  return {
    restrict: 'E',
    templateUrl: app.root + '$iui-table/templates/iui-table.html',
    scope: true,
    link: function(scope, element, attrs) {
      scope.iuiTable = {};
      scope.iuiTable.settings = {};

      scope.iuiTable.settings.defaultRowTemplate = app.root + '$iui-table/templates/iui-table-default-row.html';
      scope.iuiTable.settings.defaultHeaderCellTemplate = app.root + '$iui-table/templates/iui-table-header-cell.html';

      scope.iuiTable.pagingOption = {
        currentPage: 1,
        pageSize: 10
      };
      scope.iuiTable.pagingOption.currentPage = 1;

      scope.$watch(attrs.displayColumns, function(newVal) {
        scope.iuiTable.displayColumns = newVal;
      });
      scope.$watch(attrs.rowData, function(newVal) {
        scope.iuiTable.rowData = newVal;
      });
      scope.$watch(attrs.tableCaption, function(newVal) {
        scope.iuiTable.tableCaption = newVal;
      });
      scope.$watch(attrs.hideTableCaption, function(newVal) {
        scope.iuiTable.hideTableCaption = newVal;
      });
      scope.$watch(attrs.hideTablePager, function(newVal) {
        scope.iuiTable.hideTablePager = newVal;
      });
      scope.$watch(attrs.rowTemplate, function(newVal) {
        scope.iuiTable.rowTemplate = newVal;
      });
      scope.$watch(attrs.tableClass, function(newVal) {
        scope.iuiTable.tableClass = newVal;
      });

      scope.$watch(attrs.pageSize, function(newVal) {
        scope.iuiTable.pagingOption.pageSize = newVal || scope.iuiTable.pagingOption.pageSize;
      });

      scope.iuiTable.sortingOptions = scope.$parent.$eval(attrs.sortingOptions);

      scope.$watch(attrs.serverSideSorting, function(newVal) {
        scope.iuiTable.serverSideSorting = newVal;
      });

      scope.iuiTable.selectedItems = scope.$parent.$eval(attrs.selectedItems);
      // Selected items array builder
      scope.determineSelectedItems = function() {
        scope.iuiTable.selectedItems = [];
        _.each(scope.iuiTable.rowData, function(column) {
          if (column.selected === true) {
            scope.iuiTable.selectedItems.push(column);
          }
        });
      };

      // Add checkbox functionality. This function iterates through the
      // gridColumn data and finds the ng-model of column.selected and
      // assigns truth to the selectedAll object.
      scope.checkAll = function() {
        scope.selectedAll = !scope.selectedAll;
        _.filter(scope.iuiTable.rowData, function(column) {
          column.selected = scope.selectedAll;
        });
        scope.determineSelectedItems();
      };
      //  If all checkboxes are selected, then check the table header checkbox
      scope.isAllSelected = function() {
        scope.selectedAll = _.every(scope.iuiTable.rowData, function(column) {
          return column.selected;
        });
        scope.determineSelectedItems();
      };
    }
  };
}]);

(function(module) {
try {
  module = angular.module('iuiTableTemplates');
} catch (e) {
  module = angular.module('iuiTableTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/$iui-table/templates/iui-pager.html',
    '<div class="table-pager iui-pager custom-pagination" ng-show="pageCount()">\n' +
    '	<div class="table-pager-info"><span>Total Items: {{totalRecords}}</span></div>\n' +
    '	<div class="iui-pager-controls table-pager-buttons" ng-if="pageCount() > 1">\n' +
    '		<button type="button" class="btn btn-default iui-pager-button table-pager-first" data-ng-click="getFirstPage()"  data-ng-disabled="hasNoPrevious()">\n' +
    '			<div class="pager-first-triangle"><div class="pager-first-bar"></div></div>\n' +
    '			<span class="first-text sr-only">First</span>\n' +
    '		</button>\n' +
    '		<button type="button" class="btn btn-default iui-pager-button table-pager-prev"  data-ng-click="getPreviousPage()" data-ng-disabled="hasNoPrevious()">\n' +
    '			<div class="pager-first-triangle"></div>\n' +
    '			<span class="previous-text sr-only">Previous</span>\n' +
    '		</button>\n' +
    '		<span class="description"></span>\n' +
    '		<span class="page">\n' +
    '			<label for="tblpager_page_{{componentId}}" class="sr-only">Page</label>\n' +
    '		        <input type="number" id="tblpager_page_{{componentId}}" min="1" max="{{pageCount()}}" ng-model="page" ng-change="jumpToPage(page)" data-ng-disabled="hasNoPages()">\n' +
    '			<span class="pages" id="tblpage_ofPages_{{componentId}}"> / {{pageCount()}}</span>\n' +
    '		</span>\n' +
    '		<button type="button" class="btn btn-default iui-pager-button table-pager-next" data-ng-click="getNextPage()" data-ng-disabled="hasNoMore()">\n' +
    '			<div class="pager-last-triangle"></div>\n' +
    '			<span class="next-text sr-only">Next</span>\n' +
    '		</button>\n' +
    '		<button type="button" class="btn btn-default iui-pager-button table-pager-last" data-ng-click="getLastPage()" data-ng-disabled = "hasNoMore()">\n' +
    '			<div class="pager-last-triangle"><div class="pager-last-bar"></div></div>\n' +
    '			<span class="last-text sr-only">Last</span>\n' +
    '		</button>\n' +
    '	</div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('iuiTableTemplates');
} catch (e) {
  module = angular.module('iuiTableTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/$iui-table/templates/iui-sort-heading.html',
    '<a href="" class="iui-sort-heading" role="button" ng-click="iuiSortBy = iuiSortKey; iuiReverse=!iuiReverse" ng-class="{\'sorted\':iuiSortBy === iuiSortKey, \'reversed\':iuiSortBy === iuiSortKey && iuiReverse===false}">\n' +
    '  <span class="sr-only">Sort by</span>\n' +
    '  <span ng-transclude></span>\n' +
    '</a>');
}]);
})();

(function(module) {
try {
  module = angular.module('iuiTableTemplates');
} catch (e) {
  module = angular.module('iuiTableTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/$iui-table/templates/iui-table-default-row.html',
    '<td  \n' +
    '	ng-repeat="column in iuiTable.displayColumns" \n' +
    '	data-header="{{column.displayName}}" \n' +
    '	class="iui-table-{{column.field | lowercase}} {{column.columnClass}}" \n' +
    '	ng-switch="column.field">\n' +
    '  <span ng-switch-when="date">\n' +
    '    <time datetime="{{row[column.field] | date:\'yyyy-mm-dd\'}}">{{row[column.field] | date:\'mm/dd/yyyy\'}}</time>\n' +
    '  </span>\n' +
    '  <span ng-switch-default>\n' +
    '    {{row[column.field]}}\n' +
    '  </span>\n' +
    '</td>');
}]);
})();

(function(module) {
try {
  module = angular.module('iuiTableTemplates');
} catch (e) {
  module = angular.module('iuiTableTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/$iui-table/templates/iui-table-header-cell.html',
    '<iui-sort-heading\n' +
    '	ng-if="!(columnHeader.sortable === false)"\n' +
    '	iui-sort-key="{{columnHeader.field}}"\n' +
    '	iui-sort-by="iuiTable.sortingOptions.field"\n' +
    '	iui-reverse="iuiTable.sortingOptions.reverse">\n' +
    '	{{columnHeader.displayName}}\n' +
    '</iui-sort-heading>\n' +
    '<span ng-if="columnHeader.sortable === false">\n' +
    '	{{columnHeader.displayName}}\n' +
    '</span>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('iuiTableTemplates');
} catch (e) {
  module = angular.module('iuiTableTemplates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/$iui-table/templates/iui-table.html',
    '<div class="iui-table">\n' +
    '  <table class="table responsive {{iuiTable.tableClass}}">\n' +
    '    <caption ng-if="iuiTable.tableCaption">\n' +
    '      <span\n' +
    '        ng-bind="iuiTable.tableCaption"\n' +
    '        ng-class="{\'sr-only\':iuiTable.hideTableCaption}">\n' +
    '      </span>\n' +
    '    </caption>\n' +
    '    <thead>\n' +
    '      <tr>\n' +
    '        <th scope="col" ng-repeat="columnHeader in iuiTable.displayColumns | filter:{field:\'checkbox\'}" class="iui-table-header-{{columnHeader.field | lowercase}} {{columnHeader.columnClass}}">\n' +
    '          <input type="checkbox" class="custom-checkbox in-table-header" ng-model="selectedAll" id="item-selected-{{iuiTable.tableClass}}" ng-click="checkAll()">\n' +
    '          <label for="item-selected-{{iuiTable.tableClass}}"><span class="sr-only">Select All</span></label>\n' +
    '          <span class="sr-only">Selected</span>\n' +
    '        </th>\n' +
    '        <th scope="col" ng-repeat="columnHeader in iuiTable.displayColumns | filter:{field:\'unread\'}" class="iui-table-header-{{columnHeader.field | lowercase}} {{columnHeader.columnClass}}">\n' +
    '          <iui-sort-heading\n' +
    '            iui-sort-key="{{columnHeader.field}}"\n' +
    '            iui-sort-by="iuiTable.sortingOptions.field"\n' +
    '            iui-reverse="iuiTable.sortingOptions.reverse">\n' +
    '            <span class="unread-dot-indicator"></span>\n' +
    '            <span class="sr-only">Unread</span>\n' +
    '          </iui-sort-heading>\n' +
    '        </th>\n' +
    '        <th\n' +
    '          scope="col"\n' +
    '          ng-repeat="columnHeader in iuiTable.displayColumns | filter:{field:\'!checkbox\'} | filter:{field:\'!Button\'} | filter:{field:\'!unread\'}"\n' +
    '          class="iui-table-header-{{columnHeader.field | lowercase}} {{columnHeader.columnClass}}" \n' +
    '          ng-include="(columnHeader.headerCellTemplate)? columnHeader.headerCellTemplate : iuiTable.settings.defaultHeaderCellTemplate">\n' +
    '        </th>\n' +
    '        <th scope="col" ng-repeat="columnHeader in iuiTable.displayColumns | filter:{field:\'Button\'}" class="iui-table-header-{{columnHeader.field | lowercase}} {{columnHeader.columnClass}}">\n' +
    '          <span class="sr-only">Actions</span>\n' +
    '        </th>\n' +
    '      </tr>\n' +
    '    </thead>\n' +
    '    <tbody ng-if="!iuiTable.serverSideSorting">\n' +
    '      <tr\n' +
    '        ng-repeat="row in iuiTable.rowData | orderBy:iuiTable.sortingOptions.field:iuiTable.sortingOptions.reverse | startFrom:(iuiTable.pagingOption.currentPage-1)*iuiTable.pagingOption.pageSize | limitTo:iuiTable.pagingOption.pageSize"\n' +
    '        ng-include="(iuiTable.rowTemplate)?iuiTable.rowTemplate:iuiTable.settings.defaultRowTemplate">\n' +
    '      </tr>\n' +
    '    </tbody>\n' +
    '    <tbody ng-if="iuiTable.serverSideSorting">\n' +
    '      <tr\n' +
    '        ng-repeat="row in iuiTable.rowData | startFrom:(iuiTable.pagingOption.currentPage-1)*iuiTable.pagingOption.pageSize | limitTo:iuiTable.pagingOption.pageSize"\n' +
    '        ng-include="(iuiTable.rowTemplate)?iuiTable.rowTemplate:iuiTable.settings.defaultRowTemplate">\n' +
    '      </tr>\n' +
    '    </tbody>\n' +
    '  </table>\n' +
    '  <iui-pager \n' +
    '    ng-if="iuiTable.rowData.length > 0 && !iuiTable.hideTablePager"\n' +
    '    page="iuiTable.pagingOption.currentPage"\n' +
    '    page-size="iuiTable.pagingOption.pageSize"\n' +
    '    total-records="iuiTable.rowData.length">\n' +
    '  </iui-pager>\n' +
    '</div>\n' +
    '');
}]);
})();