/** provide variables and function for the ui and angularjs controller
 *  @author sebastien.mamy@gmail.com
 *  @since 11/07/2019
 */


/** accessor
  */
UI = {}




/** creates the html code for the header
 *  @param {object} params parameters of the header
 *  @return html code of the header
 */
UI.RenderHeader = function(params) {
    return `<table class="head">
                <tbody>
                    <tr>
                        <td class='left'>{{title}}</td>
                        <td class='right'>                        
                            <button ng-if="!Helper.IsEmpty(menus)" ng-click="DisplayMenuBar()" class="md-raised head"><md-icon ng_bind="'menu'" class="head"></md-icon></button>
                            <md-sidenav class="md-sidenav-right wipo" md-component-id="nav-bar" md-disable-backdrop="" md-whiteframe="4">
                                <md-toolbar class="menu">{{menuTitle}}</md-toolbar>
                                <md-content>
                                    <md-button ng-repeat='entry in menus' ng-click='navigate(entry.key)' class='nav-bar-item'>
                                        <span class="glyphicon glyphicon-home nav-bar-icon"></span>{{entry.label}}
                                    </md-button>
                                    <hr class='nav'/>
                                </md-content>
                            </md-sidenav>                          
                        </td>
                    </tr>
                </tbody>
            </table>
            <message layout-align="center center" class="error" ng-show="error !== null">{{error}}</message>
            <message layout-align="center center" class="progress" ng-show="info !== null">{{info}}</message >
            <message layout-align="center center" class="success" ng-show="success !== null">{{success}}</message >`;
}




UI.ToggleMenu = function() {
	const drawerEl = document.querySelector('.mdc-drawer');
	const drawer = new mdc.drawer.MDCDrawer.attachTo(drawerEl);
	
	// Instantiate MDC Top App Bar (required)
	const topAppBarEl = document.querySelector('.mdc-top-app-bar');
	const topAppBar = new mdc.topAppBar.MDCTopAppBar.attachTo(topAppBarEl);

	topAppBar.setScrollTarget(document.querySelector('.main-content'));
	topAppBar.listen('MDCTopAppBar:nav', () => {
	  drawer.open = !drawer.open;
	});
}




/** create a drop zone with the name and the function to be run on complete 
 * @param {string} name id of the dom element to use as a drop zone
 * @param {function} onaddedfile function to be called when a file is added
 */
UI.RenderDropZone = function(name, onaddedfile) {$A(name).addClass('a-dropzone');$('#' + name).append("<form action='#' id='dz" + name + "' class='dropzone dz-clickable'><div class='dz-message' data-dz-message id='mmes-" + name + "'></div></form>");Dropzone.options["dz" + name] = {autoProcessQueue: false,thumbnailWidth: 10,thumbnailHeight: 10,init: function() {this.on("addedfile", function(file) {onaddedfile(file, name);this.removeAllFiles();this.removeEventListeners();});}};}



/** update the dropzone with the specific color and messages 
 * @param {string} name id of the dom element containing the drop zone
 * @param {string} color css color #rrggbb to use as the background of the dropzone
 * @param {string} msg1 title of the drop zone
 * @param {string} msg2 sub-title of the drop zone
 */
UI.UpdateDropZone = function(name, color, msg1, msg2 = null){if (color !== null) {$('#dz' + name).css('border-color', color);	$('#dz' + name).css('background', color);}$('#mmes-' + name).html('<span class="dnd">' + msg1 + '</span>' + (msg2 !== null ? '<br/><span class="dnd2">' + msg2 + '</span>' : ''));}



/** initialize the client with translation filter
 *  @param {Object} app application to initialize
 */ 
UI.InitApp = function(app) {app.filter('t', function(){return function(input) {return Translation.translate(input);}});}

/** initializes the controller with default side navigation
 *  @param {Object} $scope scope of the angular controller
 *  @param {Object} $sce sce of the angular controller
 *  @param {Object} $mdSidenav manager for the side navigation
 */
UI.InitScope = function($scope,$sce,$mdSidenav) {
    
    $scope.error = null;
    $scope.info = null;
    $scope.success = null;   
    
    
    /** process the http.get errors
     *  @param {Object} data error information 
     */
    $scope.processError = function(data) {
        $scope.error = data.status === -1 ? 'service unavailable' : data.statusText!== null && data.statusText !== undefined && data.statusText.length > 0 ? data.statusText : 'service call error ' + data.status;
    }
    
    
    $scope.languages = Translation.languages;

    $scope.page = null;

    $scope.navbar = false;

    $scope.langbar = false;

    $scope.DisplayMenuBar = function(show) {if(show === undefined||($scope.navbar && !show)||(!$scope.navbar && show)) {$scope.DisplayTranslateBar(false);$mdSidenav('nav-bar').toggle();$scope.navbar = !$scope.navbar;}};

    $scope.DisplayTranslateBar = function(show) {if(show === undefined||($scope.langbar && !show)||(!$scope.langbar && show)) {$scope.DisplayMenuBar(false);$mdSidenav('lang-bar').toggle();$scope.langbar = !$scope.langbar; }};

    $scope.SetLanguage = function(language) {
        window.localStorage['language']=language;
        window.location.href="index.html";
    }

    return $scope;
}




UI.DownloadString = function(text, fileType, fileName) {
  var blob = new Blob([text], { type: fileType });
  var a = document.createElement('a');
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
}



