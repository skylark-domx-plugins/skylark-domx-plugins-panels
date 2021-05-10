define([
  "skylark-langx/langx",
  "skylark-domx-browser",
  "skylark-domx-eventer",
  "skylark-domx-noder",
  "skylark-domx-geom",
  "skylark-domx-query",
  "skylark-domx-plugins-base",
  "./panels",
],function(langx,browser,eventer,noder,geom,$,plugins,panels){

  var Panel = plugins.Plugin.inherit({
    klassName : "Panel",

    pluginName : "domx.panels.panel",

    options : {
      resizable : {
          minWidth: 320,
          minHeight: 320,
          border : {
              classes :  {
                  all : "resizable-handle",
                  top : "resizable-handle-n",
                  left: "resizable-handle-w",
                  right: "resizable-handle-e",
                  bottom: "resizable-handle-s", 
                  topLeft : "resizable-handle-nw", 
                  topRight : "resizable-handle-ne",
                  bottomLeft : "resizable-handle-sw",             
                  bottomRight : "resizable-handle-se"     
              }
          }
      }
    },

    _construct : function(elm,options) {
      this.overrided(elm,options);
      this._velm = this.elmx();

      if (this.options.resizable) {

          this._resizable = new Resizable(elm,{
              handle : {
                  border : {
                      directions : {
                          top: true, //n
                          left: true, //w
                          right: true, //e
                          bottom: true, //s
                          topLeft : true, // nw
                          topRight : true, // ne
                          bottomLeft : true, // sw
                          bottomRight : true // se                         
                      },
                      classes : {
                          all : this.options.resizable.border.classes.all,
                          top : this.options.resizable.border.classes.top,
                          left: this.options.resizable.border.classes.left,
                          right: this.options.resizable.border.classes.right,
                          bottom: this.options.resizable.border.classes.bottom, 
                          topLeft : this.options.resizable.border.classes.topLeft, 
                          topRight : this.options.resizable.border.classes.topRight,
                          bottomLeft : this.options.resizable.border.classes.bottomLeft,             
                          bottomRight : this.options.resizable.border.classes.bottomRight                        
                      }                        
                  }
              },
              constraints : {
                  minWidth : this.options.resizable.minWidth,
                  minHeight : this.options.resizable.minHeight
              },
              started : function(){
                  this.isResizing = true;
              },
              moving : function(e) {
                  /*
                  const imageWidth = $(image).width();
                  const imageHeight = $(image).height();
                  const stageWidth = $(stage).width();
                  const stageHeight = $(stage).height();
                  const left = (stageWidth - imageWidth) /2;
                  const top = (stageHeight- imageHeight) /2;
                  $(image).css({
                      left,
                      top
                  });
                  */
              },
              stopped :function () {
                  this.isResizing = false;
              }
          });

      }
    },


  });

  plugins.register(Panel);

  return Panel;

});