/**
 * skylark-domx-plugins-panels - The skylark panel plugins library for dom api extension
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-domx-plugins-panels/
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx/langx","skylark-domx-browser","skylark-domx-eventer","skylark-domx-noder","skylark-domx-geom","skylark-domx-query"],function(E,e,r,n,t,s,O){var a={},i={BACKSPACE_KEYCODE:8,COMMA_KEYCODE:188,DELETE_KEYCODE:46,DOWN_ARROW_KEYCODE:40,ENTER_KEYCODE:13,TAB_KEYCODE:9,UP_ARROW_KEYCODE:38},o=function(E){return function(e){return e.keyCode===E}},C=o(i.BACKSPACE_KEYCODE),k=o(i.DELETE_KEYCODE),l=o(i.TAB_KEYCODE),D=o(i.UP_ARROW_KEYCODE),K=o(i.DOWN_ARROW_KEYCODE),_=/&[^\s]*;/;return e.mixin(a,{CONST:i,cleanInput:function(E){for(;_.test(E);)E=O("<i>").html(E).text();return O("<i>").text(E).html()},isBackspaceKey:C,isDeleteKey:k,isShiftHeld:function(E){return!0===E.shiftKey},isTabKey:l,isUpArrow:D,isDownArrow:K}),E.attach("domx.plugins.panels",a)});
//# sourceMappingURL=sourcemaps/panels.js.map
