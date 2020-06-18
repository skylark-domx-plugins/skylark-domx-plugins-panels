/**
 * skylark-domx-panels - The skylark panel plugins library for dom api extension
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-domx-panels/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-browser","skylark-domx-eventer","skylark-domx-noder","skylark-domx-geom","skylark-domx-query","skylark-domx-plugins","./panels","./Collapse","./Panel"],function(n,o,e,i,t,l,s,a,r,c){var d=s.Plugin.inherit({klassName:"Accordion",pluginName:"domx.accordion",options:{panel:{selector:"> .panel",template:null}},_construct:function(n,o){this.overrided(n,o),this._velm=this.elmx();var e=[];this._velm.$(this.options.panel.selector).forEach(n=>{var o=new d.Panel(n,{accordion:this});e.push(o)}),this._panels=e},_post:function(){},_refresh:function(n){},panels:{get:function(){}},addPanel:function(){},remove:function(){},expand:function(){},expandAll:function(){},collapse:function(){},collapseAll:function(){}});return d.Panel=c.inherit({klassName:"AccordionPanel",expand:function(){this.options.accordion.active&&this.options.accordion.active.collapse(),this.overrided(),this.options.accordion.active=this},collapse:function(){this.overrided(),this.options.accordion.active=null},toggle:function(){this.overrided()},remove:function(){this.overrided()}}),s.register(d),a.Accordion=d});
//# sourceMappingURL=sourcemaps/Accordion.js.map
