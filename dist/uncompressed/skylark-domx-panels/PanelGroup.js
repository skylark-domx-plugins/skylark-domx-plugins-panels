 define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-velm",
  "skylark-domx-plugins",
  "./panels",
  "./HeaderPanel"
],function(langx,$,elmx,plugins,panels,HeaderPanel){

  var PanelGroup = plugins.Plugin.inherit({
    klassName : "PanelGroup",

    pluginName : "domx.panels.panelGroup",

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
        var panel = new PanelGroup.Panel(panelEl,{
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

  PanelGroup.Panel = HeaderPanel.inherit({
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

  plugins.register(PanelGroup);

  return panels.PanelGroup = PanelGroup;
});
