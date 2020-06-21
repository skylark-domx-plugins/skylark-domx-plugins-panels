/**
 * skylark-domx-panels - The skylark panel plugins library for dom api extension
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-domx-panels/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-browser","skylark-domx-eventer","skylark-domx-noder","skylark-domx-geom","skylark-domx-query","skylark-domx-plugins","skylark-domx-toggles/Collapsable","./panels"],function(e,l,t,o,i,n,s,a,d){var p=s.Plugin.inherit({klassName:"Panel",pluginName:"domx.panels.panel",options:{toggler:{selector:'.panel-heading [data-toggle="collapse"]'},body:{selector:".panel-collapse"}},_construct:function(e,l){this.overrided(e,l),this._velm=this.elmx(),this._expanded=!1,this.$toggle=this._velm.find(this.options.toggler.selector),this.$body=this._velm.find(this.options.body.selector),this.$toggle.on("click.panel",e=>{this.toggle()})},expand:function(){this.emit("expanding"),this.$body.plugin(a.prototype.pluginName).show(),this._expanded=!0,this.emit("expanded")},collapse:function(){this.emit("collapsing"),this.$body.plugin(a.prototype.pluginName).hide(),this._expanded=!1,this.emit("collapsed")},toggle:function(){this._expanded?this.collapse():this.expand()},full:function(){},unfull:function(){},toogleFull:function(){},close:function(){}});return s.register(p),p});
//# sourceMappingURL=sourcemaps/Panel.js.map
