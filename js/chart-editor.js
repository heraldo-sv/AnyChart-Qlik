define(['./../config', './../js/data-adapter'],
    function(config, dataAdapter) {
      return function() {

        var editor = null;
        var complete = false;
        var tokens;

        this.openEditor = function(view, layout, options) {
          if (!editor) {
            editor = anychart['ui']['editor']();
            editor['steps']()['prepareData'](false);
            editor['renderAsDialog']();
            editor['steps']()['visualAppearance']()['contextMenu'](false);
            complete = false;

            var res = dataAdapter.prepareData(view, layout, options);
            editor['data']({'setId': 'qlikData', 'data': res.data, 'fieldNames': res.fieldNames});
            tokens = res.tokens;

            var defaults = [{'key': [['chart'], ['settings'], 'contextMenu().enabled()'], 'value': false}];
            if (config.credits.licenseKey && typeof config.credits.licenseKey === 'string') {
              defaults.push({'key': [['anychart'], 'licenseKey()'], 'value': String(config.credits.licenseKey)});

              if (typeof config.credits.enabled === 'boolean')
                defaults.push({'key': [['chart'], ['settings'], 'credits().enabled()'], 'value': config.credits.enabled});

              if (typeof config.credits.text === 'string')
                defaults.push({'key': [['chart'], ['settings'], 'credits().text()'], 'value': config.credits.text});

              if (typeof config.credits.url === 'string')
                defaults.push({'key': [['chart'], ['settings'], 'credits().url()'], 'value': config.credits.url});

              if (typeof config.credits.logoSrc === 'string')
                defaults.push({'key': [['chart'], ['settings'], 'credits().logoSrc()'], 'value': config.credits.logoSrc});
            }

            // defaults.push({'key': [['chart'], ['settings'], 'xAxis().labels().position()'], 'value': 'normal'});

            editor['setDefaults'](defaults);
            editor['deserializeModel'](layout.anychart.model);
            editor['visible'](true);

            editor.listenOnce('complete', function() {
              complete = true;

              var code = editor['getChartAsJsCode']({
                'minify': true,
                'addData': false,
                'wrapper': '',
                'container': ''
              });

              closeEditor(view, code);
            });

            editor.listen('close', function(evt) {
              if (!complete && evt.target === editor)
                closeEditor(view, null);
            });
          }
        };

        var closeEditor = function(view, code) {
          if (editor) {
            var serializedModel = editor['serializeModel']();
            var field = editor['getModel']()['getValue']([['dataSettings'], 'field']);

            editor['visible'](false);
            editor['removeAllListeners']();
            editor['dispose']();
            editor = null;

            view.backendApi.getProperties().then(function(reply) {
              reply.anychart.chartEditor = 'false';
              if (code) {
                reply.anychart.code = code;
                reply.anychart.model = serializedModel;
                reply.anychart.field = field;
                reply.anychart.tokens = JSON.stringify(tokens);
              }
              view.backendApi.setProperties(reply);
            });
          }
        };
      };
    });