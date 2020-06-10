/**
 * skylark-domx-panels - The skylark panel plugins library for dom api extension
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-domx-panels/
 * @license MIT
 */
!function(t,e){var s=e.define,require=e.require,i="function"==typeof s&&s.amd,a=!i&&"undefined"!=typeof exports;if(!i&&!s){var n={};s=e.define=function(t,e,s){"function"==typeof s?(n[t]={factory:s,deps:e.map(function(e){return function(t,e){if("."!==t[0])return t;var s=e.split("/"),i=t.split("/");s.pop();for(var a=0;a<i.length;a++)"."!=i[a]&&(".."==i[a]?s.pop():s.push(i[a]));return s.join("/")}(e,t)}),resolved:!1,exports:null},require(t)):n[t]={factory:null,resolved:!0,exports:s}},require=e.require=function(t){if(!n.hasOwnProperty(t))throw new Error("Module "+t+" has not been defined");var module=n[t];if(!module.resolved){var s=[];module.deps.forEach(function(t){s.push(require(t))}),module.exports=module.factory.apply(e,s)||null,module.resolved=!0}return module.exports}}if(!s)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");if(function(t,require){t("skylark-domx-panels/panels",["skylark-langx/skylark","skylark-langx/langx","skylark-domx-browser","skylark-domx-eventer","skylark-domx-noder","skylark-domx-geom","skylark-domx-query"],function(t,e,s,i,a,n,r){var o={},l={BACKSPACE_KEYCODE:8,COMMA_KEYCODE:188,DELETE_KEYCODE:46,DOWN_ARROW_KEYCODE:40,ENTER_KEYCODE:13,TAB_KEYCODE:9,UP_ARROW_KEYCODE:38},d=function(t){return function(e){return e.keyCode===t}},p=d(l.BACKSPACE_KEYCODE),c=d(l.DELETE_KEYCODE),h=d(l.TAB_KEYCODE),u=d(l.UP_ARROW_KEYCODE),g=d(l.DOWN_ARROW_KEYCODE),m=/&[^\s]*;/;return e.mixin(o,{CONST:l,cleanInput:function(t){for(;m.test(t);)t=r("<i>").html(t).text();return r("<i>").text(t).html()},isBackspaceKey:p,isDeleteKey:c,isShiftHeld:function(t){return!0===t.shiftKey},isTabKey:h,isUpArrow:u,isDownArrow:g}),t.attach("domx.panels",o)}),t("skylark-domx-panels/Collapse",["skylark-langx/langx","skylark-domx-browser","skylark-domx-eventer","skylark-domx-query","skylark-domx-plugins","./panels"],function(t,e,s,i,a,n){"use strict";var r=a.Plugin.inherit({klassName:"Collapse",pluginName:"domx.collapse",options:{toggle:!0},_construct:function(t,e){this.overrided(t,e),this.$element=this.$(),this.$trigger=i('[data-toggle="collapse"][href="#'+t.id+'"],[data-toggle="collapse"][data-target="#'+t.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()},dimension:function(){var t=this.$element.hasClass("width");return t?"width":"height"},show:function(){if(!this.transitioning&&!this.$element.hasClass("in")){var i,a=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(a&&a.length&&(i=a.data("collapse"))&&i.transitioning)){var n=s.create("show.collapse");if(this.$element.trigger(n),!n.isDefaultPrevented()){a&&a.length&&(a.plugin("domx.collapse").hide(),i||a.data("collapse",null));var o=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[o](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var l=function(){this.$element.removeClass("collapsing").addClass("collapse in")[o](""),this.transitioning=0,this.$element.trigger("shown.collapse")};if(!e.support.transition)return l.call(this);var d=t.camelCase(["scroll",o].join("-"));this.$element.one("transitionEnd",t.proxy(l,this)).emulateTransitionEnd(r.TRANSITION_DURATION)[o](this.$element[0][d])}}}},hide:function(){if(!this.transitioning&&this.$element.hasClass("in")){var i=s.create("hide.collapse");if(this.$element.trigger(i),!i.isDefaultPrevented()){var a=this.dimension();this.$element[a](this.$element[a]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var n=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.collapse")};if(!e.support.transition)return n.call(this);this.$element[a](0).one("transitionEnd",t.proxy(n,this)).emulateTransitionEnd(r.TRANSITION_DURATION)}}},toggle:function(){this[this.$element.hasClass("in")?"hide":"show"]()},getParent:function(){return i(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(t.proxy(function(t,e){var s,a,n,r=i(e);this.addAriaAndCollapsedClass((n=(s=r).attr("data-target")||(a=s.attr("href"))&&a.replace(/.*(?=#[^\s]+$)/,""),i(n)),r)},this)).end()},addAriaAndCollapsedClass:function(t,e){var s=t.hasClass("in");t.attr("aria-expanded",s),e.toggleClass("collapsed",!s).attr("aria-expanded",s)}});return r.TRANSITION_DURATION=350,a.register(r),r}),t("skylark-domx-panels/Panel",["skylark-langx/langx","skylark-domx-browser","skylark-domx-eventer","skylark-domx-noder","skylark-domx-geom","skylark-domx-query","skylark-domx-plugins","./panels","./Collapse"],function(t,e,s,i,a,n,r,o,l){var d=r.Plugin.inherit({klassName:"Panel",pluginName:"domx.panel",options:{toggler:{selector:'.panel-heading [data-toggle="collapse"]'},body:{selector:".panel-collapse"}},_construct:function(t,e){this.overrided(t,e),this._velm=this.elmx(),this._expanded=!1,this.$toggle=this._velm.find(this.options.toggler.selector),this.$body=this._velm.find(this.options.body.selector),this.$toggle.on("click.panel",t=>{this.toggle()})},expand:function(){this.emit("expanding"),this.$body.plugin("domx.collapse").show(),this._expanded=!0,this.emit("expanded")},collapse:function(){this.emit("collapsing"),this.$body.plugin("domx.collapse").hide(),this._expanded=!1,this.emit("collapsed")},toggle:function(){this._expanded?this.collapse():this.expand()},full:function(){},unfull:function(){},toogleFull:function(){},close:function(){}});return r.register(d),d}),t("skylark-domx-panels/Accordion",["skylark-langx/langx","skylark-domx-browser","skylark-domx-eventer","skylark-domx-noder","skylark-domx-geom","skylark-domx-query","skylark-domx-plugins","./panels","./Collapse","./Panel"],function(t,e,s,i,a,n,r,o,l,d){var p=r.Plugin.inherit({klassName:"Accordion",pluginName:"domx.accordion",options:{panel:{selector:"> .panel",template:null}},_construct:function(t,e){this.overrided(t,e),this._velm=this.elmx();var s=[];this._velm.$(this.options.panel.selector).forEach(t=>{var e=new p.Panel(t,{accordion:this});s.push(e)}),this._panels=s},_post:function(){},_refresh:function(t){},panels:{get:function(){}},addPanel:function(){},remove:function(){},expand:function(){},expandAll:function(){},collapse:function(){},collapseAll:function(){}});return p.Panel=d.inherit({klassName:"AccordionPanel",expand:function(){this.options.accordion.active&&this.options.accordion.active.collapse(),this.overrided(),this.options.accordion.active=this},collapse:function(){this.overrided(),this.options.accordion.active=null},toggle:function(){this.overrided()},remove:function(){this.overrided()}}),r.register(p),o.Accordion=p}),t("skylark-domx-panels/Pagination",["skylark-langx/langx","skylark-domx-browser","skylark-domx-eventer","skylark-domx-noder","skylark-domx-geom","skylark-domx-query","skylark-domx-plugins","./panels"],function(t,e,s,i,a,n,r,o){"use strict";var l=r.Plugin.inherit({klassName:"Pagination",pluginName:"domx.pagination",options:{tagName:"ul",css:"",selectors:{firstNavi:"li[aria-label='first']",prevNavi:"li[aria-label='prev']",nextNavi:"li[aria-label='next']",lastNavi:"li[aria-label='last']",numericNavi:"li:not([aria-label])",numericTxt:"a"},totalPages:7,maxButtonsVisible:5,currentPage:1},state:{totalPages:Number,currentPage:Number},_construct:function(t,e){this.overrided(t,e),this._velm=this.elmx(),this.$first=this._velm.$(this.options.selectors.firstNavi),this.$prev=this._velm.$(this.options.selectors.prevNavi),this.$last=this._velm.$(this.options.selectors.lastNavi),this.$next=this._velm.$(this.options.selectors.nextNavi),this.$numeric=this._velm.$(this.options.selectors.numericNavi);var s=this;function i(t){var e=n(t);return!e.is(".disabled,.active")&&e}this.$first.click(function(){i(this)&&s.currentPage(1)}),this.$prev.click(function(){i(this)&&s.currentPage(s.currentPage()-1)}),this.$last.click(function(){i(this)&&s.currentPage(s.totalPages())}),this.$next.click(function(){i(this)&&s.currentPage(s.currentPage()+1)}),this.$numeric.click(function(){var t=i(this);if(t){var e=t.find(s.options.selectors.numericTxt).text(),a=parseInt(e);s.currentPage(a)}}),this._currentPage=this.options.currentPage,this._totalPages=this.options.totalPages,this._refresh({currentPage:!0,totalPages:!0})},_refresh:function(t){var e=this;if(t.currentPage||t.totalPages){var s=e.currentPage(),i=e.totalPages();!function(t,s){var i=Math.min(s,e.options.maxButtonsVisible),a=1,n=a+i-1;for(;t<a||t>n;)t>n?(a+=i,(n+=i)>s&&(a-=n-s,n=s)):(n-=i,(a-=i)<0&&(n+=a+i,a=1));t===n&&1!=s&&(n=(a=t-1)+i-1)>=s&&(a-=n-s,n=s);a===t&&1!=s&&1!=t&&(a=(n=t+1)-(i-1));var r=e.$numeric.size(),o=n-a+1,l=0;e.$numeric.filter(".active").removeClass("active");for(;l<o;){var d=l+a,p=e.$numeric.eq(l);p.find(e.options.selectors.numericTxt).text(l+a).show(),d==t&&p.addClass("active"),l++}for(;l<r;)e.$numeric.eq(l).find(e.options.selectors.numericTxt).text(l+a).hide(),l++}(s,i),function(t,s){if(t<1)throw"Page can't be less than 1";if(t>s)throw"Page is bigger than total pages";if(s<1)throw"Total Pages can't be less than 1";1==t?(e.$first.addClass("disabled"),e.$prev.addClass("disabled")):(e.$first.removeClass("disabled"),e.$prev.removeClass("disabled"));t==s?(e.$last.addClass("disabled"),e.$next.addClass("disabled")):(e.$last.removeClass("disabled"),e.$next.removeClass("disabled"))}(s,i)}},currentPage:function(t){return void 0!==t?(this._currentPage=t,this._refresh({currentPage:!0}),this):this._currentPage},totalPages:function(t){return void 0!==t?(this._totalPages=t,this._refresh({totalPages:!0}),this):this._totalPages}});return r.register(l),o.Pagination=l}),t("skylark-domx-panels/Tab",["skylark-langx/langx","skylark-domx-browser","skylark-domx-eventer","skylark-domx-noder","skylark-domx-geom","skylark-domx-query","skylark-domx-plugins","./panels"],function(t,e,s,i,a,n,r,o){"use strict";var l=r.Plugin.inherit({klassName:"Tab",pluginName:"domx.tab",_construct:function(e,s){this.element=n(e),this.target=s&&s.target,this.element.on("click.bs.tab.data-api",t.proxy(function(t){t.preventDefault(),this.show()},this))},show:function(){var t=this.element,e=t.closest("ul:not(.dropdown-menu)"),i=this.target||t.data("target");if(i||(i=(i=t.attr("href"))&&i.replace(/.*(?=#[^\s]*$)/,"")),!t.parent("li").hasClass("active")){var a=e.find(".active:last a"),r=s.create("hide.bs.tab",{relatedTarget:t[0]}),o=s.create("show.bs.tab",{relatedTarget:a[0]});if(a.trigger(r),t.trigger(o),!o.isDefaultPrevented()&&!r.isDefaultPrevented()){var l=n(i);this.activate(t.closest("li"),e),this.activate(l,l.parent(),function(){a.trigger({type:"hidden.bs.tab",relatedTarget:t[0]}),t.trigger({type:"shown.bs.tab",relatedTarget:a[0]})})}}},activate:function(t,s,i){var a=s.find("> .active"),n=i&&e.support.transition&&(a.length&&a.hasClass("fade")||!!s.find("> .fade").length);function r(){a.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),t.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),n?(t[0].offsetWidth,t.addClass("in")):t.removeClass("fade"),t.parent(".dropdown-menu").length&&t.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),i&&i()}a.length&&n?a.one("transitionEnd",r).emulateTransitionEnd(l.TRANSITION_DURATION):r(),a.removeClass("in")}});return l.TRANSITION_DURATION=150,r.register(l),o.Tab=l}),t("skylark-domx-panels/TabStrip",["skylark-langx/langx","skylark-domx-browser","skylark-domx-eventer","skylark-domx-noder","skylark-domx-geom","skylark-domx-query","skylark-domx-plugins","skylark-domx-popups/Dropdown","./panels","./Tab"],function(t,e,s,i,a,n,r,o,l,d){var p=r.Plugin.inherit({klassName:"TabStrip",pluginName:"domx.tabstrip",options:{selectors:{header:".nav-tabs",tab:'[data-toggle="tab"]',content:".tab-content",tabpane:".tab-pane"},droptabs:{selectors:{dropdown:"li.droptabs",dropdownMenu:"ul.dropdown-menu",dropdownTabs:"li",dropdownCaret:"b.caret",visibleTabs:">li:not(.dropdown)"},auto:!0,pullDropdownRight:!0}},_construct:function(t,e){this.overrided(t,e),this._velm=this.elmx(),this.$header=this._velm.$(this.options.selectors.header),this.$tabs=this.$header.find(this.options.selectors.tab),this.$content=this._velm.$(this.options.selectors.content),this.$tabpanes=this.$content.find(this.options.selectors.tabpane),this.$header.find('[data-toggle="dropdown"]').plugin(o.prototype.pluginName);var s=this;this.$tabs.each(function(t,e){n(e).plugin(d.prototype.pluginName,{target:s.$tabpanes[t]})})},arrange:function(){var t=this.options.droptabs.selectors.dropdownTabs,e=this.options.droptabs.selectors.visibleTabs;$container=this.$header;var s=$container.find(this.options.droptabs.selectors.dropdown),i=s.find(this.options.droptabs.selectors.dropdownMenu),a=n(">a",s).clone();n(this.options.droptabs.selectors.dropdownCaret,s);n(this.options.droptabs.selectors.dropdownCaret,a).remove(),this.options.droptabs.pullDropdownRight&&n(s).addClass("pull-right");var r=function(){return n(t,i)},o=function(){return n(e,$container)};var l,d,p=function(){return $container.outerWidth()-function(){var t=0;return n(o()).each(function(e){t+=parseInt(n(this).outerWidth(),10)}),t+=parseInt(n(s).outerWidth(),10)}()};if(p()<0){var c=p();n(o().get().reverse()).each(function(t){if(n(this).hasClass("always-visible")||(n(this).prependTo(i),c+=n(this).outerWidth()),c>=0)return!1})}if(p()>(l=r().first().clone().appendTo($container).css("position","fixed"),d=n(l).outerWidth(),n(l).remove(),d)){var c=p();n(r()).each(function(t){if(e=n(this).clone().appendTo($container).css("position","fixed"),s=n(e).outerWidth(),n(e).remove(),!(s<c)||n(this).hasClass("always-dropdown"))return!1;var e,s;n(this).appendTo($container),c-=n(this).outerWidth()}),this.options.droptabs.pullDropdownRight||n(s).is(":last-child")||n(s).detach().insertAfter($container.find("li:last-child"))}r().length<=0?s.hide():s.show()},add:function(){},remove:function(){}});return r.register(p),l.TabStrip=p}),t("skylark-domx-panels/Toolbar",["skylark-langx/langx","skylark-domx-query","skylark-domx-plugins","./panels"],function(t,e,s,i){var a=s.Plugin.inherit({klassName:"Toolbar",pluginName:"domx.toolbar",options:{toolbarFloat:!0,toolbarHidden:!1,toolbarFloatOffset:0,template:'<div class="domx-toolbar"><ul></ul></div>',separator:{template:'<li><span class="separator"></span></li>'}},_construct:function(t,s){var i,a;this.overrided(t,s),this._velm=this.elmx(),this.opts=this.options,this.wrapper=e(this._elm),this.list=this.wrapper.find("ul"),this.list.on("click",function(t){return!1}),this.wrapper.on("mousedown",(a=this,function(t){return a.list.find(".menu-on").removeClass(".menu-on")})),e(document).on("mousedown.toolbar",function(t){return function(e){return t.list.find(".menu-on").removeClass("menu-on")}}(this)),!this.opts.toolbarHidden&&this.opts.toolbarFloat&&(this.wrapper.css("top",this.opts.toolbarFloatOffset),i=0,function(t){return function(){return t.wrapper.css("position","static"),t.wrapper.width("auto"),t.editor.editable.util.reflow(t.wrapper),t.wrapper.width(t.wrapper.outerWidth()),t.wrapper.css("left",t.editor.editable.util.os.mobile?t.wrapper.position().left:t.wrapper.offset().left),t.wrapper.css("position",""),i=t.wrapper.outerHeight(),t.editor.placeholderEl.css("top",i),!0}}(this))},addToolItem:function(t){return e(t._elm).appendTo(this.list),this},addSeparator:function(){return e(this.options.separator.template).appendTo(this.list),this}});return s.register(a),i.Toolbar=a}),t("skylark-domx-panels/main",["./panels","./Accordion","./Pagination","./TabStrip","./Toolbar"],function(t){return t}),t("skylark-domx-panels",["skylark-domx-panels/main"],function(t){return t})}(s),!i){var r=require("skylark-langx-ns");a?module.exports=r:e.skylarkjs=r}}(0,this);
//# sourceMappingURL=sourcemaps/skylark-domx-panels.js.map
