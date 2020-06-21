 define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-velm",
  "skylark-domx-plugins",
  "./panels",
  "./Panel"
],function(langx,$,elmx,plugins,panels,Panel){

  var Accordion = plugins.Plugin.inherit({
    klassName : "Accordion",

    pluginName : "domx.panels.accordion",

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
          group : this
        });
        panels.push(panel);
      });
      this._panels = panels;
    },

    panels : {
      get : function() {

      }
    },


    addPanel : function() {

    },

    /**
     * Removes a group pane.
     *
     * @method remove
     * @return {Accordion} The current widget.
     */
    remove : function() {

    },

    /**
     * Expands a group pane.
     *
     * @method remove
     * @return {Accordion} The current widget.
     */
    expand : function() {
      // expand a panel

    },

    /**
     * Expands all group panes.
     *
     * @method expandAll
     * @return {Accordion} The current widget.
     */
    expandAll : function() {
      // expand a panel

    },

    /**
     * Collapse a group pane.
     *
     * @method collapse
     * @return {Accordion} The current widget.
     */
    collapse : function() {

    },

    /**
     * Collapses all group pane.
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
      if (this.options.group.active) {
        this.options.group.active.collapse();
      }
      this.overrided();
      this.options.group.active = this;
    },

    collapse : function() {
      this.overrided();
      this.options.group.active = null;
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
