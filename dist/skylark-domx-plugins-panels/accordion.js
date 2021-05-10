/**
 * skylark-domx-plugins-panels - The skylark panel plugins library for dom api extension
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-domx-plugins-panels/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-query","skylark-domx-velm","skylark-domx-plugins-base","./panels","./panel","./collapsible"],function(n,o,e,i,t,l,s){var a=l.inherit({klassName:"Accordion",pluginName:"domx.panels.accordion",options:{panel:{selector:"> .panel",template:null}},_construct:function(n,o){l.prototype._construct.call(this,n,o);var e=[];this._velm.$(this.options.panel.selector).forEach(n=>{var o=new a.Pane(n,{group:this});e.push(o)}),this._panels=e},panels:{get:function(){}},addPanel:function(){},remove:function(){},expand:function(){},expandAll:function(){},collapse:function(){},collapseAll:function(){}});return a.Pane=s.inherit({klassName:"AccordionPane",expand:function(){this.options.group.active&&this.options.group.active.collapse(),this.overrided(),this.options.group.active=this},collapse:function(){this.overrided(),this.options.group.active=null},toggle:function(){this.overrided()},remove:function(){this.overrided()}}),i.register(a),t.Accordion=a});
//# sourceMappingURL=sourcemaps/accordion.js.map
