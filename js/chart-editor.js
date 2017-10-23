define(["./../credits", "./../js/data-adapter"],
    function(credits, dataAdapter) {
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

            editor['data']({data: data, setId: "qlikData"});

            var defaults = [{'key': [['chart'], ['settings'], 'contextMenu().enabled()'], 'value': false}];
            if (credits.licenseKey && typeof credits.licenseKey === 'string') {
              defaults.push({'key': [['anychart'], 'licenseKey()'], 'value': String(credits.licenseKey)});

              if (typeof credits.enabled === 'boolean')
                defaults.push({'key': [['chart'], ['settings'], 'credits().enabled()'], 'value': credits.enabled});

              if (typeof credits.text === 'string')
                defaults.push({'key': [['chart'], ['settings'], 'credits().text()'], 'value': credits.text});

              if (typeof credits.url === 'string')
                defaults.push({'key': [['chart'], ['settings'], 'credits().url()'], 'value': credits.url});

              if (typeof credits.logoSrc === 'string')
                defaults.push({'key': [['chart'], ['settings'], 'credits().logoSrc()'], 'value': credits.logoSrc});
            }
            editor['setDefaults'](defaults);

            editor['deserializeModel'](model);
            editor['visible'](true);

            editor.listenOnce('complete', function(evt) {
              complete = true;

              var code = editor['getChartAsJsCode']({
                'minify': true,
                'addData': false,
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
            var model = editor['serializeModel']();
            editor['visible'](false);
            editor['removeAllListeners']();
            editor['dispose']();
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