define(["./../js/data-adapter"],
    function(dataAdapter) {
      return function() {

        var editor = null;
        var complete = false;

        this.openEditor = function(view, layout) {
          if (!editor) {
            editor = anychart['ui']['editor']();
            editor['steps']()['prepareData'](false);
            editor['renderAsDialog']();
            editor['steps']()['visualAppearance']()['contextMenu'](false);
            complete = false;

            var data = dataAdapter.prepareData(view, layout);
            var model = layout.anychart.model;

            editor.data({data: data, setId: "qlikData"});
            editor.deserializeModel(model);
            editor.visible(true);

            editor.listenOnce('complete', function(evt) {
              complete = true;
              var code = editor.getChartAsJsCode({
                'minify': true,
                'addData': false,
                'addGeoData': false,
                'wrapper': '',
                'container': ''
              });
              closeEditor(view, code);
            });

            editor.listenOnce('close', function() {
              if (!complete)
                closeEditor(view, null);
            });
          }
        };

        var closeEditor = function(view, code) {
          if (editor) {
            var model = editor.serializeModel();
            editor.visible(false);
            editor.removeAllListeners();
            editor.dispose();
            editor = null;

            view.backendApi.getProperties().then(function(reply) {
              reply.anychart.chartEditor = "false";
              if (code) {
                reply.anychart.code = code;
                reply.anychart.model = model;
              }
              view.backendApi.setProperties(reply);
            });
          }
        };
      };
    });