define([
  "skylark-langx/langx",
  "skylark-domx-browser",
  "skylark-domx-eventer",
  "skylark-domx-noder",
  "skylark-domx-geom",
  "skylark-domx-query",
  "skylark-domx-plugins",
  "skylark-domx-toggles/Collapsable",
  "./panels",
],function(langx,browser,eventer,noder,geom,$,plugins,Collapsable,panels){

  var Panel = plugins.Plugin.inherit({
    klassName : "Panel",

    pluginName : "domx.pandels.panel",

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
      this.$body.plugin(Collapsable.prototype.pluginName).show();
      this._expanded = true;
      this.emit("expanded");
    },

    collapse : function() {
      // collapse this panel
      this.emit("collapsing");
      this.$body.plugin(Collapsable.prototype.pluginName).hide();
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