# iui-table
Angular dynamic table directive

[iui-table Examples](http://Symphony-corp.github.io/iui-table/style-guide/ "iui-table Examples")


## Setup

Add to package.json:
```javascript
"dependencies": {
    ...
    "iui-table": "git+ssh://git@github.com:Symphony-corp/iui-table.git"
}
```


## Installation (with Influence Health ui-core)

Use in app.js:
```javascript
ui.use(require('iui.table'));
```


## Installation (without ui-core / typical)

Everything you need is already minified
node_modules/iui-table/dist/iui-table.min.js

As soon as you've got the file included in your page you just need to declare a dependency on the iui.table module:
angular.module('myModule', ['iui.table']);

## Build
When Making changes, follow these steps

1. Run `gulp` to rebuild the combined files in the 'dist' directory. 

2. Update the version number at the top of the 'package.json' file.

3. Update the 'README' file in the Changelog with the change that was made and the new version that was created.

4. Create a Pull Request and assign it a repo owner.

5. After it's merged, run `npm publish` to create a new release in npm.

6. In the product you want to see the change, in the product's 'package.json' file, update iui-table's version number to the newly created version and run `npm install`.

## Changelog

### 1.0.17
- Fixed Pagination box spacing issue for IE11.

### 1.0.16
- Performance improvements for apps using `conf.client.head.addlPathedScripts`

### 1.0.15
- Fixed issue when searching/filtering results on a different table page would not display any results.

### 1.0.14
- Fixed issues where number in pagination field was not updating when custom page number entered
- Add .form-control class to number input to show validation state

### 1.0.13

- Fixed issue where tbody would not show if rowData is greater than 1. Changed display logic to check iuiTable.rowData.length instead of iuiTable.rowData

### 1.0.12
- Added a default message when the table is empty.
- Created a variable to override the default empty table message.

### 1.0.11
- Fixed bug where current page wouldn't reset when going to a new page.

### 1.0.10
- Adding ability to customize the labels (like .sr-only text)

### 1.0.9

-  Add ability to toggle between visible columns
- Add an angular filter that displays any columns where .visible is not
false. Adding visible: false to the columnDef will hide that column
initially. Use the ng-model of a checkbox to toggle the visible columns

### 1.0.8

-  Update var name to correct spelling

### 1.0.7

- moving src files to src folder
- including responsive table classes
- implementing hologram
- moving documentation to style guide
- moving .jshint config to source from iui-general

### 1.0.6

making changes to templates

### 1.0.0

Created iui-table repo
