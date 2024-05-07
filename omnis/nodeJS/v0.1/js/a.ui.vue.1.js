/** provide variables and function for the ui and vue controller
 *  @author sebastien.mamy@gmail.com
 *  @since 11/07/2019
 */
/*jslint node: true */

'use strict';



/** accessor */
var AVue = {window: null, instance: null};


/** redirects to the specific url
 *  @param {string} url full url to redirect to
 */
AVue.Redirect = function (url) {
    AVue.window.location.href = url;
};


/** initialize the Vue controller with title and menu entry array
 *  @param {window} win the DOM window
 *  @param {string} title title of the page
 *  @param {array} menu array of menu items: {label: string, icon: string,click: function}
 *  @param {object} data files to be added to the Vue data
 *  @param {object} methods functions to be added to the Vue methods
 *  @return {Vue} the Vue controller of the page
 */
AVue.Init = function (win, title, menu, data, methods, init) {
    var menu = Helper.Init(menu, null);
    AVue.window = win;
    var data = Helper.Extends(data, {
        menu : {
                toggle : function (force) {
                    if(force !== undefined) this.show = force
                    else this.show = !this.show; },
                show: false,
                title : 'menu',
                entries : menu
            },
            title: title   
    });
    var methods = Helper.Extends(methods, {
        Redirect: AVue.Redirect,
        ClickMenu: function (entry) {
            if (entry.url !== undefined) { AVue.Redirect(entry.url); } else { entry.click(); }
        }
    });
    if(init !== undefined) init(data, methods)
    var app = new Vue({
        el: '#app',
        data: data,
        methods : methods /*{
            Redirect: AVue.Redirect,
            ClickMenu: function (entry) {
                if (entry.url !== undefined) { AVue.Redirect(entry.url); } else { entry.click(); }
            }
        }*/
    });
    AVue.instance = app;
    return app;
};
 

