/**
 * skylark-domx-panels - The skylark panel plugins library for dom api extension
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-domx-panels/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-query","skylark-domx-velm","skylark-domx-plugins","./panels","./HeaderPanel"],function(e,n,o,i,t,l){var a=i.Plugin.inherit({klassName:"PanelGroup",pluginName:"domx.panels.panelGroup",options:{panel:{selector:"> .panel",template:null}},_construct:function(e,n){this.overrided(e,n),this._velm=this.elmx();var o=[];this._velm.$(this.options.panel.selector).forEach(e=>{var n=new a.Panel(e,{group:this});o.push(n)}),this._panels=o},panels:{get:function(){}},addPanel:function(){},remove:function(){},expand:function(){},expandAll:function(){},collapse:function(){},collapseAll:function(){}});return a.Panel=l.inherit({klassName:"AccordionPanel",expand:function(){this.options.group.active&&this.options.group.active.collapse(),this.overrided(),this.options.group.active=this},collapse:function(){this.overrided(),this.options.group.active=null},toggle:function(){this.overrided()},remove:function(){this.overrided()}}),i.register(a),t.PanelGroup=a});
//# sourceMappingURL=sourcemaps/PanelGroup.js.map
