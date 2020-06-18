/**
 * skylark-domx-panels - The skylark panel plugins library for dom api extension
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-domx-panels/
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx/langx","skylark-domx-browser","skylark-domx-eventer","skylark-domx-noder","skylark-domx-geom","skylark-domx-query"],function(E,e,r,n,t,s,O){var a={},o={BACKSPACE_KEYCODE:8,COMMA_KEYCODE:188,DELETE_KEYCODE:46,DOWN_ARROW_KEYCODE:40,ENTER_KEYCODE:13,TAB_KEYCODE:9,UP_ARROW_KEYCODE:38},C=function(E){return function(e){return e.keyCode===E}},i=C(o.BACKSPACE_KEYCODE),k=C(o.DELETE_KEYCODE),D=C(o.TAB_KEYCODE),K=C(o.UP_ARROW_KEYCODE),l=C(o.DOWN_ARROW_KEYCODE),_=/&[^\s]*;/;return e.mixin(a,{CONST:o,cleanInput:function(E){for(;_.test(E);)E=O("<i>").html(E).text();return O("<i>").text(E).html()},isBackspaceKey:i,isDeleteKey:k,isShiftHeld:function(E){return!0===E.shiftKey},isTabKey:D,isUpArrow:K,isDownArrow:l}),E.attach("domx.panels",a)});
//# sourceMappingURL=sourcemaps/panels.js.map
