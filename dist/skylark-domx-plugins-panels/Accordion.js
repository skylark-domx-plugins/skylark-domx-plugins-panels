/**
 * skylark-domx-plugins-panels - The skylark panel plugins library for dom api extension
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-domx-plugins-panels/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-query","skylark-domx-velm","skylark-domx-plugins-base","./panels","./Panel"],function(n,e,o,i,t,l){var s=i.Plugin.inherit({klassName:"Accordion",pluginName:"domx.panels.accordion",options:{panel:{selector:"> .panel",template:null}},_construct:function(n,e){this.overrided(n,e),this._velm=this.elmx();var o=[];this._velm.$(this.options.panel.selector).forEach(n=>{var e=new s.Panel(n,{group:this});o.push(e)}),this._panels=o},panels:{get:function(){}},addPanel:function(){},remove:function(){},expand:function(){},expandAll:function(){},collapse:function(){},collapseAll:function(){}});return s.Panel=l.inherit({klassName:"AccordionPanel",expand:function(){this.options.group.active&&this.options.group.active.collapse(),this.overrided(),this.options.group.active=this},collapse:function(){this.overrided(),this.options.group.active=null},toggle:function(){this.overrided()},remove:function(){this.overrided()}}),i.register(s),t.Accordion=s});
//# sourceMappingURL=sourcemaps/Accordion.js.map
