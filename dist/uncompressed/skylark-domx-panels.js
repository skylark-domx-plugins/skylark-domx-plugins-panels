/**
 * skylark-domx-panels - The skylark panel plugins library for dom api extension
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-domx-panels/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-domx-panels/panels',[
  "skylark-langx/skylark",
  "skylark-langx/langx",
  "skylark-domx-browser",
  "skylark-domx-eventer",
  "skylark-domx-noder",
  "skylark-domx-geom",
  "skylark-domx-query"
],function(skylark,langx,browser,eventer,noder,geom,$){
	var panels = {};

	var CONST = {
		BACKSPACE_KEYCODE: 8,
		COMMA_KEYCODE: 188, // `,` & `<`
		DELETE_KEYCODE: 46,
		DOWN_ARROW_KEYCODE: 40,
		ENTER_KEYCODE: 13,
		TAB_KEYCODE: 9,
		UP_ARROW_KEYCODE: 38
	};

	var isShiftHeld = function isShiftHeld (e) { return e.shiftKey === true; };

	var isKey = function isKey (keyCode) {
		return function compareKeycodes (e) {
			return e.keyCode === keyCode;
		};
	};

	var isBackspaceKey = isKey(CONST.BACKSPACE_KEYCODE);
	var isDeleteKey = isKey(CONST.DELETE_KEYCODE);
	var isTabKey = isKey(CONST.TAB_KEYCODE);
	var isUpArrow = isKey(CONST.UP_ARROW_KEYCODE);
	var isDownArrow = isKey(CONST.DOWN_ARROW_KEYCODE);

	var ENCODED_REGEX = /&[^\s]*;/;
	/*
	 * to prevent double encoding decodes content in loop until content is encoding free
	 */
	var cleanInput = function cleanInput (questionableMarkup) {
		// check for encoding and decode
		while (ENCODED_REGEX.test(questionableMarkup)) {
			questionableMarkup = $('<i>').html(questionableMarkup).text();
		}

		// string completely decoded now encode it
		return $('<i>').text(questionableMarkup).html();
	};

	langx.mixin(panels, {
		CONST: CONST,
		cleanInput: cleanInput,
		isBackspaceKey: isBackspaceKey,
		isDeleteKey: isDeleteKey,
		isShiftHeld: isShiftHeld,
		isTabKey: isTabKey,
		isUpArrow: isUpArrow,
		isDownArrow: isDownArrow
	});

	return skylark.attach("domx.panels",panels);

});

define('skylark-domx-panels/Collapse',[
    "skylark-langx/langx",
    "skylark-domx-browser",
    "skylark-domx-eventer",
    "skylark-domx-query",
    "skylark-domx-plugins",
    "./panels"
], function(langx, browser, eventer,  $, plugins, panels) {


  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse =  plugins.Plugin.inherit({
    klassName: "Collapse",

    pluginName : "domx.collapse",

    options : {
      toggle: true
    },

    _construct : function(elm,options) {
      ////options = langx.mixin({}, Collapse.DEFAULTS, $(element).data(), options)
      this.overrided(elm,options);
      this.$element      = this.$();
      //this.$trigger      = $('[data-toggle="collapse"][href="#' + elm.id + '"],' +
      //                     '[data-toggle="collapse"][data-target="#' + elm.id + '"]')
      this.transitioning = null

      //if (this.options.parent) {
      //  this.$parent = this.getParent()
      //} else {
      //  this.addAriaAndCollapsedClass(this.$element, this.$trigger)
      //}

      if (this.options.toggle) {
        this.toggle();
      }
    },

    dimension : function () {
      var hasWidth = this.$element.hasClass('width');
      return hasWidth ? 'width' : 'height';
    },

    show : function () {
      if (this.transitioning || this.$element.hasClass('in')) {
        return;
      }

      //var activesData;
      //var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

      //if (actives && actives.length) {
      //  activesData = actives.data('collapse')
      //  if (activesData && activesData.transitioning) return
      //}

      var startEvent = eventer.create('show.collapse');
      this.$element.trigger(startEvent)
      if (startEvent.isDefaultPrevented()) return

      //if (actives && actives.length) {
      //  //Plugin.call(actives, 'hide')
      //  actives.plugin("domx.collapse").hide();
      //  activesData || actives.data('collapse', null)
      //}

      var dimension = this.dimension();

      this.$element
        .removeClass('collapse')
        .addClass('collapsing')[dimension](0)
        .attr('aria-expanded', true)

      //this.$trigger
      //  .removeClass('collapsed')
      //  .attr('aria-expanded', true)

      this.transitioning = 1

      var complete = function () {
        this.$element
          .removeClass('collapsing')
          .addClass('collapse in')[dimension]('')
        this.transitioning = 0
        this.$element
          .trigger('shown.collapse')
      }

      if (!browser.support.transition) {
        return complete.call(this);
      }

      var scrollSize = langx.camelCase(['scroll', dimension].join('-'));

      this.$element
        .one('transitionEnd', langx.proxy(complete, this))
        .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize]);
    },

    hide : function () {
      if (this.transitioning || !this.$element.hasClass('in')) {
        return ;
      }

      var startEvent = eventer.create('hide.collapse');
      this.$element.trigger(startEvent);
      if (startEvent.isDefaultPrevented()) {
        return ;
      } 

      var dimension = this.dimension();

      this.$element[dimension](this.$element[dimension]())[0].offsetHeight;

      this.$element
        .addClass('collapsing')
        .removeClass('collapse in')
        .attr('aria-expanded', false);

      //this.$trigger
      //  .addClass('collapsed')
      //  .attr('aria-expanded', false);

      this.transitioning = 1;

      var complete = function () {
        this.transitioning = 0;
        this.$element
          .removeClass('collapsing')
          .addClass('collapse')
          .trigger('hidden.collapse');
      }

      if (!browser.support.transition) {
        return complete.call(this);
      }

      this.$element
        [dimension](0)
        .one('transitionEnd', langx.proxy(complete, this))
        .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
    },

    toggle : function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']();
    }

    /*
    getParent : function () {
      return $(this.options.parent)
        .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
        .each(langx.proxy(function (i, element) {
          var $element = $(element)
          this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
        }, this))
        .end()
    },

    addAriaAndCollapsedClass : function ($element, $trigger) {
      var isOpen = $element.hasClass('in');

      $element.attr('aria-expanded', isOpen);
      $trigger
        .toggleClass('collapsed', !isOpen)
        .attr('aria-expanded', isOpen);
    }
    */
  });

  Collapse.TRANSITION_DURATION = 350;

  /*
  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }
  */

  plugins.register(Collapse);

  return panels.Collapse = Collapse;

});

define('skylark-domx-panels/Panel',[
  "skylark-langx/langx",
  "skylark-domx-browser",
  "skylark-domx-eventer",
  "skylark-domx-noder",
  "skylark-domx-geom",
  "skylark-domx-query",
  "skylark-domx-plugins",
  "./panels",
  "./Collapse"
],function(langx,browser,eventer,noder,geom,$,plugins,panels,Collapse){

  var Panel = plugins.Plugin.inherit({
    klassName : "Panel",

    pluginName : "domx.panel",

    options : {
      toggler : {
        selector : ".panel-heading [data-toggle=\"collapse\"]"
      },

      body : {
        selector : ".panel-collapse"
      }
    },

    _construct : function(elm,options) {
      this.overrided(elm,options);
      this._velm = this.elmx();
      this._expanded = false;
      this.$toggle = this._velm.find(this.options.toggler.selector);
      this.$body = this._velm.find(this.options.body.selector);
      this.$toggle.on('click.panel',(e) => {
        this.toggle();
      });

    },

    expand : function() {
      // expand this panel
      this.emit("expanding");
      this.$body.plugin("domx.collapse").show();
      this._expanded = true;
      this.emit("expanded");
    },

    collapse : function() {
      // collapse this panel
      this.emit("collapsing");
      this.$body.plugin("domx.collapse").hide();
      this._expanded = false;
      this.emit("collapsed");
    },

    toggle : function() {
      // toggle this panel
      if (this._expanded) {
        this.collapse();
      } else {
        this.expand();
      }
    },

    full : function() {

    },

    unfull : function() {

    },

    toogleFull : function() {

    },
    
    close: function () {
    }


  });

  plugins.register(Panel);

  return Panel;

});
define('skylark-domx-panels/Accordion',[
  "skylark-langx/langx",
  "skylark-domx-browser",
  "skylark-domx-eventer",
  "skylark-domx-noder",
  "skylark-domx-geom",
  "skylark-domx-query",
  "skylark-domx-plugins",
  "./panels",
  "./Collapse",
  "./Panel"
],function(langx,browser,eventer,noder,geom,$,plugins,panels,Collapse,Panel){

  var Accordion = plugins.Plugin.inherit({
    klassName : "Accordion",

    pluginName : "domx.accordion",

    options : {
      panel: {
        selector : "> .panel",
        template : null,
      }
    },

     _construct : function(elm,options) {
      this.overrided(elm,options);
      this._velm = this.elmx();
      var panels = [];
      this._velm.$(this.options.panel.selector).forEach((panelEl) => {
        var panel = new Accordion.Panel(panelEl,{
          accordion : this
        });
        panels.push(panel);
      });
      this._panels = panels;
    },

    _post : function() {
      // handle internal events
    },

    _refresh : function(updates) {
    },

    panels : {
      get : function() {

      }
    },


    addPanel : function() {

    },

    /**
     * Removes a accordion pane.
     *
     * @method remove
     * @return {Accordion} The current widget.
     */
    remove : function() {

    },

    /**
     * Expands a accordion pane.
     *
     * @method remove
     * @return {Accordion} The current widget.
     */
    expand : function() {
      // expand a panel

    },

    /**
     * Expands all accordion panes.
     *
     * @method expandAll
     * @return {Accordion} The current widget.
     */
    expandAll : function() {
      // expand a panel

    },

    /**
     * Collapse a accordion pane.
     *
     * @method collapse
     * @return {Accordion} The current widget.
     */
    collapse : function() {

    },

    /**
     * Collapses all accordion pane.
     *
     * @method collapseAll
     * @return {Accordion} The current widget.
     */
    collapseAll : function() {

    }
  });

  Accordion.Panel = Panel.inherit({
    klassName : "AccordionPanel",

    expand : function() {
      if (this.options.accordion.active) {
        this.options.accordion.active.collapse();
      }
      this.overrided();
      this.options.accordion.active = this;
    },

    collapse : function() {
      this.overrided();
      this.options.accordion.active = null;
    },

    toggle : function() {
      this.overrided();
    },

    remove : function() {
      this.overrided();
    }

  });

  plugins.register(Accordion);

  return panels.Accordion = Accordion;
});

define('skylark-domx-panels/Pagination',[
  "skylark-langx/langx",
  "skylark-domx-browser",
  "skylark-domx-eventer",
  "skylark-domx-noder",
  "skylark-domx-geom",
  "skylark-domx-query",
  "skylark-domx-plugins",
  "./panels"
],function(langx,browser,eventer,noder,geom,$,plugins,panels){

  'use strict';

  var Pagination = plugins.Plugin.inherit({
      klassName : "Pagination",

      pluginName : "domx.pagination",

      options : {
          tagName : "ul",
          css : "",
          selectors : {
              firstNavi : "li[aria-label='first']",
              prevNavi : "li[aria-label='prev']",
              nextNavi : "li[aria-label='next']",
              lastNavi : "li[aria-label='last']",
              numericNavi : "li:not([aria-label])",
              numericTxt  : "a"
          },
          totalPages: 7,
          maxButtonsVisible: 5,
          currentPage: 1     
      },

      state : {
          totalPages : Number,
          currentPage : Number
      },

      _construct : function(elm,options) {
        this.overrided(elm,options);
        this._velm = this.elmx();

        this.$first = this._velm.$(this.options.selectors.firstNavi);
        this.$prev = this._velm.$(this.options.selectors.prevNavi);
        this.$last = this._velm.$(this.options.selectors.lastNavi);
        this.$next = this._velm.$(this.options.selectors.nextNavi);
        this.$numeric = this._velm.$(this.options.selectors.numericNavi);

        var self = this;

        function checkCanAction(elm) {
          var $elm = $(elm);
          if ($elm.is(".disabled,.active")) {
            return false;
          } else {
            return $elm;
          }
        }

        this.$first.click(function(){
          if (!checkCanAction(this)) {
            return;
          }
          self.currentPage(1);
        });

        this.$prev.click(function(){
          if (!checkCanAction(this)) {
            return;
          }
          self.currentPage(self.currentPage()-1);
        });

        this.$last.click(function(){
          if (!checkCanAction(this)) {
            return;
          }
          self.currentPage(self.totalPages());
        });

        this.$next.click(function(){
          if (!checkCanAction(this)) {
            return;
          }
          self.currentPage(self.currentPage()+1);
        });

        this.$numeric.click(function(){
          var ret = checkCanAction(this)
          if (!ret) {
            return;
          }
          var numeric = ret.find(self.options.selectors.numericTxt).text(),
              pageNo = parseInt(numeric);
          self.currentPage(pageNo);

        });

        this._currentPage = this.options.currentPage;
        this._totalPages = this.options.totalPages;

        this._refresh({
          currentPage : true,
          totalPages : true
        });
      },

      _refresh: function (updates) {
        var self = this;

        function changePageNoBtns(currentPage,totalPages) {

          // Create the numeric buttons.
          // Variable of number control in the buttons.
          var totalPageNoBtns = Math.min(totalPages, self.options.maxButtonsVisible);
          var begin = 1;
          var end = begin + totalPageNoBtns - 1;

          /*
           * Align the values in the begin and end variables if the user has the
           * possibility that select a page that doens't appear in the paginador.
           * e.g currentPage = 1, and user go to the 20 page.
           */
          while ((currentPage < begin) || (currentPage > end)) {
            if (currentPage > end) {
               begin += totalPageNoBtns;
               end += totalPageNoBtns;

               if (end > totalPages) {
                 begin = begin - (end - totalPages);
                 end = totalPages;
               }
             } else {
               begin -= totalPageNoBtns;
               end -= totalPageNoBtns;

               if (begin < 0) {
                 end = end + (begin + totalPageNoBtns);
                 begin = 1;
               }
             }
          }
         /*
          * Verify if the user clicks in the last page show by paginator.
          * If yes, the paginator advances.
          */
          if ((currentPage === end) && (totalPages != 1)) {
            begin = currentPage - 1;
            end = begin + totalPageNoBtns - 1;

            if (end >= totalPages) {
              begin = begin - (end - (totalPages));
              end = totalPages;
            }
          }

          /*
           * Verify it the user clicks in the first page show by paginator.
           * If yes, the paginator retrogress
           */
           if ((begin === currentPage) && (totalPages != 1)) {
             if (currentPage != 1) {
               end = currentPage + 1;
               begin = end - (totalPageNoBtns - 1);
             }
           }

           var count = self.$numeric.size(),
               visibles = end-begin + 1,
               i = 0;

           self.$numeric.filter(".active").removeClass("active");
           while (i<visibles) {
             var pageNo = i + begin,
                 $btn = self.$numeric.eq(i);
             $btn.find(self.options.selectors.numericTxt).text(i+begin).show();
             if (pageNo == currentPage) {
              $btn.addClass("active");
             }
             i++;
           }
           while (i<count) {
             self.$numeric.eq(i).find(self.options.selectors.numericTxt).text(i+begin).hide();
             i++;
           }


        }

        function changeLabeldBtns(currentPage,totalPages) {
          if (currentPage < 1) {
            throw('Page can\'t be less than 1');
          } else if (currentPage > totalPages) {
            throw('Page is bigger than total pages');
          }

          if (totalPages < 1) {
            throw('Total Pages can\'t be less than 1');
          }

          if (currentPage == 1 ) {
            self.$first.addClass("disabled");
            self.$prev.addClass("disabled");
          } else {
            self.$first.removeClass("disabled");
            self.$prev.removeClass("disabled");
          }

          if (currentPage == totalPages ) {
            self.$last.addClass("disabled");
            self.$next.addClass("disabled");
          } else {
            self.$last.removeClass("disabled");
            self.$next.removeClass("disabled");
          }
        }

        if (updates.currentPage || updates.totalPages) {
          var currentPage = self.currentPage(),
              totalPages = self.totalPages();

          changePageNoBtns(currentPage,totalPages);
          changeLabeldBtns(currentPage,totalPages);
        }

      },

      currentPage : function(v) {
        if (v !== undefined) {
          this._currentPage = v;
          this._refresh({
            currentPage : true
          });            
          return this;
        } else {
          return this._currentPage;
        }
      },

      totalPages : function(v) {
        if (v !== undefined) {
          this._totalPages = v;
          this._refresh({
            totalPages : true
          });
          return this;
        } else {
          return this._totalPages;
        }
      }
  });

  plugins.register(Pagination);


  return panels.Pagination = Pagination;
});
define('skylark-domx-panels/Tab',[
  "skylark-langx/langx",
  "skylark-domx-browser",
  "skylark-domx-eventer",
  "skylark-domx-noder",
  "skylark-domx-geom",
  "skylark-domx-query",
  "skylark-domx-plugins",
  "./panels"
],function(langx,browser,eventer,noder,geom,$,plugins,panels){

  'use strict';

  // TAB CLASS DEFINITION
  // ====================


  var Tab =  plugins.Plugin.inherit({
    klassName: "Tab",

    pluginName : "domx.tab",

    _construct : function(element,options) {
      // jscs:disable requireDollarBeforejQueryAssignment
      this.element = $(element)
      this.target = options && options.target;

      // jscs:enable requireDollarBeforejQueryAssignment
      this.element.on("click.bs.tab.data-api",langx.proxy(function(e){
        e.preventDefault()
        this.show();
      },this));    
    },

    show : function () {
      var $this    = this.element
      var $ul      = $this.closest('ul:not(.dropdown-menu)')
      var selector = this.target || $this.data('target');

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
      }

      if ($this.parent('li').hasClass('active')) return

      var $previous = $ul.find('.active:last a')
      var hideEvent = eventer.create('hide.bs.tab', {
        relatedTarget: $this[0]
      })
      var showEvent = eventer.create('show.bs.tab', {
        relatedTarget: $previous[0]
      })

      $previous.trigger(hideEvent)
      $this.trigger(showEvent)

      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

      var $target = $(selector)

      this.activate($this.closest('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $previous.trigger({
          type: 'hidden.bs.tab',
          relatedTarget: $this[0]
        })
        $this.trigger({
          type: 'shown.bs.tab',
          relatedTarget: $previous[0]
        })
      })
    },

    activate : function (element, container, callback) {
      var $active    = container.find('> .active')
      var transition = callback
        && browser.support.transition
        && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
            .removeClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', false)

        element
          .addClass('active')
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if (element.parent('.dropdown-menu').length) {
          element
            .closest('li.dropdown')
              .addClass('active')
            .end()
            .find('[data-toggle="tab"]')
              .attr('aria-expanded', true)
        }

        callback && callback()
      }

      $active.length && transition ?
        $active
          .one('transitionEnd', next)
          .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
        next()

      $active.removeClass('in')
    }


  });


  Tab.TRANSITION_DURATION = 150


  plugins.register(Tab);

  return panels.Tab = Tab;
});

define('skylark-domx-panels/TabStrip',[
    "skylark-langx/langx",
    "skylark-domx-browser",
    "skylark-domx-eventer",
    "skylark-domx-noder",
    "skylark-domx-geom",
    "skylark-domx-query",
    "skylark-domx-plugins",
    "skylark-domx-popups/Dropdown",
    "./panels",
    "./Tab"
], function(langx, browser, eventer, noder, geom,  $, plugins,Dropdown,panels, Tab) {

    var TabStrip = plugins.Plugin.inherit({
        klassName : "TabStrip",
        pluginName : "domx.tabstrip",

        options : {
          selectors : {
            header : ".nav-tabs",
            tab : "[data-toggle=\"tab\"]",
            content : ".tab-content",
            tabpane : ".tab-pane"
          },

          droptabs : {
            selectors : {
              dropdown : "li.droptabs",
              dropdownMenu    : "ul.dropdown-menu",
              dropdownTabs    : "li",
              dropdownCaret   : "b.caret",
              visibleTabs     : ">li:not(.dropdown)",
            },
            auto              : true,
            pullDropdownRight : true,


          }
        },

     _construct : function(elm,options) {
          this.overrided(elm,options);
          this._velm = this.elmx();
          this.$header = this._velm.$(this.options.selectors.header); 
          this.$tabs = this.$header.find(this.options.selectors.tab);
          this.$content = this._velm.$(this.options.selectors.content);
          this.$tabpanes = this.$content.find(this.options.selectors.tabpane);

          this.$header.find('[data-toggle="dropdown"]').plugin(Dropdown.prototype.pluginName);

          var self = this;
          this.$tabs.each(function(idx,tabEl){
            $(tabEl).plugin(Tab.prototype.pluginName, {
              target : self.$tabpanes[idx]
            });
          });

        },

        arrange : function () {

          var dropdownTabsSelector = this.options.droptabs.selectors.dropdownTabs,
              visibleTabsSelector = this.options.droptabs.selectors.visibleTabs;

              $container = this.$header;
          var dropdown = $container.find(this.options.droptabs.selectors.dropdown);
          var dropdownMenu = dropdown.find(this.options.droptabs.selectors.dropdownMenu);
          var dropdownLabel = $('>a', dropdown).clone();
          var dropdownCaret = $(this.options.droptabs.selectors.dropdownCaret, dropdown);

          // We only want the default label, strip the caret out
          $(this.options.droptabs.selectors.dropdownCaret, dropdownLabel).remove();

          if (this.options.droptabs.pullDropdownRight) {
            $(dropdown).addClass('pull-right');
          }

          var $dropdownTabs = function () {
            return $(dropdownTabsSelector, dropdownMenu);
          }

          var $visibleTabs = function () {
            return $(visibleTabsSelector, $container);
          }

          function getFirstHiddenElementWidth() {
            var tempElem=$dropdownTabs().first().clone().appendTo($container).css("position","fixed");
            var hiddenElementWidth = $(tempElem).outerWidth();
            $(tempElem).remove();
            return hiddenElementWidth;
          }

          function getHiddenElementWidth(elem) {
            var tempElem=$(elem).clone().appendTo($container).css("position","fixed");
            var hiddenElementWidth = $(tempElem).outerWidth();
            $(tempElem).remove();
            return hiddenElementWidth;
          }

          function getDropdownLabel() {
            var labelText = 'Dropdown';
            if ($(dropdown).hasClass('active')) {
              labelText = $('>li.active>a', dropdownMenu).html();
            } else if (dropdownLabel.html().length > 0) {
              labelText = dropdownLabel.html();
            }

            labelText = $.trim(labelText);

            if (labelText.length > 10) {
              labelText = labelText.substring(0, 10) + '...';
            }

            return labelText;
          }

          function renderDropdownLabel() {
            $('>a', dropdown).html(getDropdownLabel() + ' ' + dropdownCaret.prop('outerHTML'));
          }

          function manageActive(elem) {
            //fixes a bug where Bootstrap can't remove the 'active' class on elements after they've been hidden inside the dropdown
            $('a', $(elem)).on('show.bs.tab', function (e) {
              $(e.relatedTarget).parent().removeClass('active');
            })
            $('a', $(elem)).on('shown.bs.tab', function (e) {
              renderDropdownLabel();
            })

          }

          function checkDropdownSelection() {
            if ($($dropdownTabs()).filter('.active').length > 0) {
              $(dropdown).addClass('active');
            } else {
              $(dropdown).removeClass('active');
            }

            renderDropdownLabel();
          }


          var visibleTabsWidth = function () {
            var visibleTabsWidth = 0;
            $($visibleTabs()).each(function( index ) {
              visibleTabsWidth += parseInt($(this).outerWidth(), 10);
            });
            visibleTabsWidth = visibleTabsWidth + parseInt($(dropdown).outerWidth(), 10);
            return visibleTabsWidth;
          }

          var availableSpace = function () {
            return $container.outerWidth()-visibleTabsWidth();
          }

          if (availableSpace()<0) {//we will hide tabs here
            var x = availableSpace();
            $($visibleTabs().get().reverse()).each(function( index ){
              if (!($(this).hasClass('always-visible'))){
                  $(this).prependTo(dropdownMenu);
                  x=x+$(this).outerWidth();
              }
              if (x>=0) {return false;}
            });
          }

          if (availableSpace()>getFirstHiddenElementWidth()) { //and here we bring the tabs out
            var x = availableSpace();
            $($dropdownTabs()).each(function( index ){
              if (getHiddenElementWidth(this) < x && !($(this).hasClass('always-dropdown'))){
                $(this).appendTo($container);
                x = x-$(this).outerWidth();
              } else {return false;}
             });

            if (!this.options.droptabs.pullDropdownRight && !$(dropdown).is(':last-child')) {
              // If not pulling-right, keep the dropdown at the end of the container.
              $(dropdown).detach().insertAfter($container.find('li:last-child'));
            }
          }

          if ($dropdownTabs().length <= 0) {
            dropdown.hide();
          } else {
            dropdown.show();
          }
        },

        add : function() {
          //TODO
        },

        remove : function(){
          //TODO
        }
    });

    plugins.register(TabStrip);


    return panels.TabStrip = TabStrip;

});
define('skylark-domx-panels/Toolbar',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-plugins",
  "./panels"
],function(langx,$,plugins,panels){ 


  var Toolbar = plugins.Plugin.inherit({
    klassName : "Toolbar",

    pluginName : "domx.toolbar",

    options : {
      toolbarFloat: true,
      toolbarHidden: false,
      toolbarFloatOffset: 0,
      template : '<div class="domx-toolbar"><ul></ul></div>',
      separator : {
        template :  '<li><span class="separator"></span></li>'
      }
    },

    _construct : function(elm,options) {
      this.overrided(elm,options);
      this._velm = this.elmx();

      var floatInitialized, initToolbarFloat, toolbarHeight;
      //this.editor = editor;

      //this.opts = langx.extend({}, this.opts, opts);
      this.opts = this.options;


      //if (!langx.isArray(this.opts.toolbar)) {
      //  this.opts.toolbar = ['bold', 'italic', 'underline', 'strikethrough', '|', 'ol', 'ul', 'blockquote', 'code', '|', 'link', 'image', '|', 'indent', 'outdent'];
      //}

      this.wrapper = $(this._elm);
      this.list = this.wrapper.find('ul');
      this.list.on('click', function(e) {
        return false;
      });
      this.wrapper.on('mousedown', (function(_this) {
        return function(e) {
          return _this.list.find('.menu-on').removeClass('.menu-on');
        };
      })(this));
      $(document).on('mousedown.toolbar', (function(_this) {
        return function(e) {
          return _this.list.find('.menu-on').removeClass('menu-on');
        };
      })(this));
      if (!this.opts.toolbarHidden && this.opts.toolbarFloat) {
        this.wrapper.css('top', this.opts.toolbarFloatOffset);
        toolbarHeight = 0;
        initToolbarFloat = (function(_this) {
          return function() {
            _this.wrapper.css('position', 'static');
            _this.wrapper.width('auto');
            _this.editor.editable.util.reflow(_this.wrapper);
            _this.wrapper.width(_this.wrapper.outerWidth());
            _this.wrapper.css('left', _this.editor.editable.util.os.mobile ? _this.wrapper.position().left : _this.wrapper.offset().left);
            _this.wrapper.css('position', '');
            toolbarHeight = _this.wrapper.outerHeight();
            _this.editor.placeholderEl.css('top', toolbarHeight);
            return true;
          };
        })(this);
        floatInitialized = null;

        /*
        $(window).on('resize.richeditor-' + this.editor.id, function(e) {
          return floatInitialized = initToolbarFloat();
        });
        $(window).on('scroll.richeditor-' + this.editor.id, (function(_this) {
          return function(e) {
            var bottomEdge, scrollTop, topEdge;
            if (!_this.wrapper.is(':visible')) {
              return;
            }
            topEdge = _this.editor.wrapper.offset().top;
            bottomEdge = topEdge + _this.editor.wrapper.outerHeight() - 80;
            scrollTop = $(document).scrollTop() + _this.opts.toolbarFloatOffset;
            if (scrollTop <= topEdge || scrollTop >= bottomEdge) {
              _this.editor.wrapper.removeClass('toolbar-floating').css('padding-top', '');
              if (_this.editor.editable.util.os.mobile) {
                return _this.wrapper.css('top', _this.opts.toolbarFloatOffset);
              }
            } else {
              floatInitialized || (floatInitialized = initToolbarFloat());
              _this.editor.wrapper.addClass('toolbar-floating').css('padding-top', toolbarHeight);
              if (_this.editor.editable.util.os.mobile) {
                return _this.wrapper.css('top', scrollTop - topEdge + _this.opts.toolbarFloatOffset);
              }
            }
          };
        })(this));
        */
      }

      /*
      this.editor.on('destroy', (function(_this) {
        return function() {
          return _this.buttons.length = 0;
        };
      })(this));
      */

      
    },

    addToolItem : function(itemWidget) {
      $(itemWidget._elm).appendTo(this.list);
      return this;
    },

    addSeparator : function() {
      $(this.options.separator.template).appendTo(this.list);
      return this;
    }

  });

  plugins.register(Toolbar);

  return panels.Toolbar = Toolbar;

});
define('skylark-domx-panels/Wizard',[
  "skylark-langx/langx",
  "skylark-domx-browser",
  "skylark-domx-eventer",
  "skylark-domx-noder",
  "skylark-domx-geom",
  "skylark-domx-query",
  "skylark-domx-plugins",
  "./panels"
],function(langx,browser,eventer,noder,geom,$,plugins,panels){


	var Wizard = plugins.Plugin.inherit({
		klassName: "Wizard",

	    pluginName : "domx.wizard",

	    options : {
			disablePreviousStep: false,
			selectedItem: {
				step: -1
			}//-1 means it will attempt to look for "active" class in order to set the step
	    },

	    _construct : function(elm,options) {
		    this.overrided(elm,options);

			this.$element = this.$();
			this.options.disablePreviousStep = (this.$element.attr('data-restrict') === 'previous') ? true : this.options.disablePreviousStep;
			this.currentStep = this.options.selectedItem.step;
			this.numSteps = this.$element.find('.steps li').length;
			this.$prevBtn = this.$element.find('button.btn-prev');
			this.$nextBtn = this.$element.find('button.btn-next');

			var kids = this.$nextBtn.children().detach();
			this.nextText = langx.trim(this.$nextBtn.text());
			this.$nextBtn.append(kids);

			var steps = this.$element.children('.steps-container');
			// maintains backwards compatibility with < 3.8, will be removed in the future
			if (steps.length === 0) {
				steps = this.$element;
				this.$element.addClass('no-steps-container');
				if (window && window.console && window.console.warn) {
					window.console.warn('please update your wizard markup to include ".steps-container" as seen in http://getfuelux.com/javascript.html#wizard-usage-markup');
				}
			}
			steps = steps.find('.steps');

			// handle events
			this.$prevBtn.on('click.fu.wizard', langx.proxy(this.previous, this));
			this.$nextBtn.on('click.fu.wizard', langx.proxy(this.next, this));
			steps.on('click.fu.wizard', 'li.complete', langx.proxy(this.stepclicked, this));

			this.selectedItem(this.options.selectedItem);

			if (this.options.disablePreviousStep) {
				this.$prevBtn.attr('disabled', true);
				this.$element.find('.steps').addClass('previous-disabled');
			}
		},

		destroy: function () {
			this.$element.remove();
			// any external bindings [none]
			// empty elements to return to original markup [none]
			// returns string of markup
			return this.$element[0].outerHTML;
		},

		//index is 1 based
		//second parameter can be array of objects [{ ... }, { ... }] or you can pass n additional objects as args
		//object structure is as follows (all params are optional): { badge: '', label: '', pane: '' }
		addSteps: function (index) {
			var items = [].slice.call(arguments).slice(1);
			var $steps = this.$element.find('.steps');
			var $stepContent = this.$element.find('.step-content');
			var i, l, $pane, $startPane, $startStep, $step;

			index = (index === -1 || (index > (this.numSteps + 1))) ? this.numSteps + 1 : index;
			if (items[0] instanceof Array) {
				items = items[0];
			}

			$startStep = $steps.find('li:nth-child(' + index + ')');
			$startPane = $stepContent.find('.step-pane:nth-child(' + index + ')');
			if ($startStep.length < 1) {
				$startStep = null;
			}

			for (i = 0, l = items.length; i < l; i++) {
				$step = $('<li data-step="' + index + '"><span class="badge badge-info"></span></li>');
				$step.append(items[i].label || '').append('<span class="chevron"></span>');
				$step.find('.badge').append(items[i].badge || index);

				$pane = $('<div class="step-pane" data-step="' + index + '"></div>');
				$pane.append(items[i].pane || '');

				if (!$startStep) {
					$steps.append($step);
					$stepContent.append($pane);
				} else {
					$startStep.before($step);
					$startPane.before($pane);
				}

				index++;
			}

			this.syncSteps();
			this.numSteps = $steps.find('li').length;
			this.setState();
		},

		//index is 1 based, howMany is number to remove
		removeSteps: function (index, howMany) {
			var action = 'nextAll';
			var i = 0;
			var $steps = this.$element.find('.steps');
			var $stepContent = this.$element.find('.step-content');
			var $start;

			howMany = (howMany !== undefined) ? howMany : 1;

			if (index > $steps.find('li').length) {
				$start = $steps.find('li:last');
			} else {
				$start = $steps.find('li:nth-child(' + index + ')').prev();
				if ($start.length < 1) {
					action = 'children';
					$start = $steps;
				}

			}

			$start[action]().each(function () {
				var item = $(this);
				var step = item.attr('data-step');
				if (i < howMany) {
					item.remove();
					$stepContent.find('.step-pane[data-step="' + step + '"]:first').remove();
				} else {
					return false;
				}

				i++;
			});

			this.syncSteps();
			this.numSteps = $steps.find('li').length;
			this.setState();
		},

		setState: function () {
			var canMovePrev = (this.currentStep > 1);//remember, steps index is 1 based...
			var isFirstStep = (this.currentStep === 1);
			var isLastStep = (this.currentStep === this.numSteps);

			// disable buttons based on current step
			if (!this.options.disablePreviousStep) {
				this.$prevBtn.attr('disabled', (isFirstStep === true || canMovePrev === false));
			}

			// change button text of last step, if specified
			var last = this.$nextBtn.attr('data-last');
			if (last) {
				this.lastText = last;
				// replace text
				var text = this.nextText;
				if (isLastStep === true) {
					text = this.lastText;
					// add status class to wizard
					this.$element.addClass('complete');
				} else {
					this.$element.removeClass('complete');
				}

				var kids = this.$nextBtn.children().detach();
				this.$nextBtn.text(text).append(kids);
			}

			// reset classes for all steps
			var $steps = this.$element.find('.steps li');
			$steps.removeClass('active').removeClass('complete');
			$steps.find('span.badge').removeClass('badge-info').removeClass('badge-success');

			// set class for all previous steps
			var prevSelector = '.steps li:lt(' + (this.currentStep - 1) + ')';
			var $prevSteps = this.$element.find(prevSelector);
			$prevSteps.addClass('complete');
			$prevSteps.find('span.badge').addClass('badge-success');

			// set class for current step
			var currentSelector = '.steps li:eq(' + (this.currentStep - 1) + ')';
			var $currentStep = this.$element.find(currentSelector);
			$currentStep.addClass('active');
			$currentStep.find('span.badge').addClass('badge-info');

			// set display of target element
			var $stepContent = this.$element.find('.step-content');
			var target = $currentStep.attr('data-step');
			$stepContent.find('.step-pane').removeClass('active');
			$stepContent.find('.step-pane[data-step="' + target + '"]:first').addClass('active');

			// reset the wizard position to the left
			this.$element.find('.steps').first().attr('style', 'margin-left: 0');

			// check if the steps are wider than the container div
			var totalWidth = 0;
			this.$element.find('.steps > li').each(function () {
				totalWidth += $(this).outerWidth();
			});
			var containerWidth = 0;
			if (this.$element.find('.actions').length) {
				containerWidth = this.$element.width() - this.$element.find('.actions').first().outerWidth();
			} else {
				containerWidth = this.$element.width();
			}

			if (totalWidth > containerWidth) {
				// set the position so that the last step is on the right
				var newMargin = totalWidth - containerWidth;
				this.$element.find('.steps').first().attr('style', 'margin-left: -' + newMargin + 'px');

				// set the position so that the active step is in a good
				// position if it has been moved out of view
				if (this.$element.find('li.active').first().position().left < 200) {
					newMargin += this.$element.find('li.active').first().position().left - 200;
					if (newMargin < 1) {
						this.$element.find('.steps').first().attr('style', 'margin-left: 0');
					} else {
						this.$element.find('.steps').first().attr('style', 'margin-left: -' + newMargin + 'px');
					}

				}

			}

			// only fire changed event after initializing
			if (typeof (this.initialized) !== 'undefined') {
				var e = eventer.create('changed.fu.wizard');
				this.$element.trigger(e, {
					step: this.currentStep
				});
			}

			this.initialized = true;
		},

		stepclicked: function (e) {
			var li = $(e.currentTarget);
			var index = this.$element.find('.steps li').index(li);

			if (index < this.currentStep && this.options.disablePreviousStep) {//enforce restrictions
				return;
			} else {
				var evt = eventer.create('stepclicked.fu.wizard');
				this.$element.trigger(evt, {
					step: index + 1
				});
				if (evt.isDefaultPrevented()) {
					return;
				}

				this.currentStep = (index + 1);
				this.setState();
			}
		},

		syncSteps: function () {
			var i = 1;
			var $steps = this.$element.find('.steps');
			var $stepContent = this.$element.find('.step-content');

			$steps.children().each(function () {
				var item = $(this);
				var badge = item.find('.badge');
				var step = item.attr('data-step');

				if (!isNaN(parseInt(badge.html(), 10))) {
					badge.html(i);
				}

				item.attr('data-step', i);
				$stepContent.find('.step-pane[data-step="' + step + '"]:last').attr('data-step', i);
				i++;
			});
		},

		previous: function () {
			if (this.options.disablePreviousStep || this.currentStep === 1) {
				return;
			}

			var e = eventer.create('actionclicked.fu.wizard');
			this.$element.trigger(e, {
				step: this.currentStep,
				direction: 'previous'
			});
			if (e.isDefaultPrevented()) {
				return;
			}// don't increment ...what? Why?

			this.currentStep -= 1;
			this.setState();

			// only set focus if focus is still on the $nextBtn (avoid stomping on a focus set programmatically in actionclicked callback)
			if (this.$prevBtn.is(':focus')) {
				var firstFormField = this.$element.find('.active').find('input, select, textarea')[0];

				if (typeof firstFormField !== 'undefined') {
					// allow user to start typing immediately instead of having to click on the form field.
					$(firstFormField).focus();
				} else if (this.$element.find('.active input:first').length === 0 && this.$prevBtn.is(':disabled')) {
					//only set focus on a button as the last resort if no form fields exist and the just clicked button is now disabled
					this.$nextBtn.focus();
				}

			}
		},

		next: function () {
			var e = eventer.create('actionclicked.fu.wizard');
			this.$element.trigger(e, {
				step: this.currentStep,
				direction: 'next'
			});
			if (e.isDefaultPrevented()) {
				return;
			}// respect preventDefault in case dev has attached validation to step and wants to stop propagation based on it.

			if (this.currentStep < this.numSteps) {
				this.currentStep += 1;
				this.setState();
			} else {//is last step
				this.$element.trigger('finished.fu.wizard');
			}

			// only set focus if focus is still on the $nextBtn (avoid stomping on a focus set programmatically in actionclicked callback)
			if (this.$nextBtn.is(':focus')) {
				var firstFormField = this.$element.find('.active').find('input, select, textarea')[0];

				if (typeof firstFormField !== 'undefined') {
					// allow user to start typing immediately instead of having to click on the form field.
					$(firstFormField).focus();
				} else if (this.$element.find('.active input:first').length === 0 && this.$nextBtn.is(':disabled')) {
					//only set focus on a button as the last resort if no form fields exist and the just clicked button is now disabled
					this.$prevBtn.focus();
				}

			}
		},

		selectedItem: function (selectedItem) {
			var retVal, step;

			if (selectedItem) {
				step = selectedItem.step || -1;
				//allow selection of step by data-name
				step = Number(this.$element.find('.steps li[data-name="' + step + '"]').first().attr('data-step')) || Number(step);

				if (1 <= step && step <= this.numSteps) {
					this.currentStep = step;
					this.setState();
				} else {
					step = this.$element.find('.steps li.active:first').attr('data-step');
					if (!isNaN(step)) {
						this.currentStep = parseInt(step, 10);
						this.setState();
					}

				}

				retVal = this;
			} else {
				retVal = {
					step: this.currentStep
				};
				if (this.$element.find('.steps li.active:first[data-name]').length) {
					retVal.stepname = this.$element.find('.steps li.active:first').attr('data-name');
				}

			}

			return retVal;
		}

	});

   plugins.register(Wizard);

	return panels.Wizard = Wizard;

});

define('skylark-domx-panels/main',[
    "./panels",
    "./Accordion",
    "./Pagination",
    "./TabStrip",
    "./Toolbar",
    "./Wizard"
], function(panels) {
    return panels;
});
define('skylark-domx-panels', ['skylark-domx-panels/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-domx-panels.js.map
