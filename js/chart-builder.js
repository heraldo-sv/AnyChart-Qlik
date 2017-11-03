define(["./../credits", "./../js/data-adapter"],
    function(credits, dataAdapter) {
      return function() {

        var _static = {
          /**
           * 'chartId' : {'chart': Object, 'selected': integer[]}
           */
        };
        

        this.buildChart = function(view, layout) {
          var code = layout.anychart.code;
          if (!code) return null;

          var self = this;
          var chartId = layout.qInfo.qId;
          var chart;

          if (!_static[chartId]) _static[chartId] = {chart: null};

          _static[chartId]['selected'] = [];

          if (_static[chartId]['chart'] && typeof _static[chartId]['chart']['dispose'] == 'function') {
            anychart['utils']['hideTooltips']();
            _static[chartId]['chart'].dispose();
          }

          // Building chart from chart editor's builded code
          var codeSplit = code.split('var rawData=[/*Add your data here*/];'); // todo: do better
          if (codeSplit.length == 2) {

            // Chart creation code
            var code1 = '(function(){' + codeSplit[0] + 'return chart;})();';

            // Data apply and chart settings code
            var code2 = '(function(){ return function(chart, rawData){' + codeSplit[1] + '}})();';

            // Create chart instance
            chart = _static[chartId]['chart'] = eval(code1);

            if (!chart) return null;

            // Apply global settings
            chart['contextMenu'](false);

            if (credits.licenseKey && typeof credits.licenseKey === 'string') {
              anychart['licenseKey'](credits.licenseKey);

              var chartCredits = chart['credits']();
              if (typeof credits.enabled === 'boolean')
                chartCredits['enabled'](credits.enabled);

              if (typeof credits.text === 'string')
                chartCredits['text'](credits.text);

              if (typeof credits.url === 'string')
                chartCredits['url'](credits.url);

              if (typeof credits.logoSrc === 'string')
                chartCredits['logoSrc'](credits.logoSrc);
            }

            // Apply editor's settings
            var code2func = eval(code2);

            var preparedData = dataAdapter.prepareData(view, layout);
            code2func.apply(null, [chart, preparedData.data]);

          } else
            return null;

          // Qlik style interactivity initialization
          chart['interactivity']()['selectionMode']('none');

          _static[chartId]['pointClicked'] = false;
          chart['listen']("mouseDown", function() {
            if (!_static[chartId]['pointClicked']) {
              chart['dispatchEvent']("pointMouseDown");
            }
            _static[chartId]['pointClicked'] = false;
          });

          chart['listen']("pointMouseDown", function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            if (evt.pointIndex != undefined) {
              _static[chartId]['pointClicked'] = true;

              if (layout.anychart.field) {
                for (var i = 0; i < preparedData.dimensions.length; i++) {
                  if (preparedData.dimensions[i]['id'] == layout.anychart.field) {
                    var qElemNumber = preparedData.dimensions[i]['indexes'][evt.pointIndex];
                    if (typeof qElemNumber == 'number') {
                        view.selectValues(i, [qElemNumber], true);
                    }
                    break;
                  }
                }
              }

              var index = _static[chartId]['selected'].indexOf(evt.pointIndex);
              if (index == -1) {
                _static[chartId]['selected'].push(evt.pointIndex);
              } else {
                _static[chartId]['selected'].splice(index, 1);
              }
            }

            self.updateChartSelections(chartId);
          });

          view.clearSelectedValues = function() {
            _static[chartId]['selected'] = [];
            self.updateChartSelections(chartId);
          };

          // debug
          //window['chart'] = chart;

          return chart;
        };

        this.updateChartSelections = function(chartId) {
          var chart = _static[chartId]['chart'];
          var selected = _static[chartId]['selected'];

          if (typeof chart['getSeriesCount'] == 'function') {
            for (var s = 0; s < chart['getSeriesCount'](); s++) {
              chart['getSeriesAt'](s)['select'](selected);
            }

          } else if (typeof chart['select'] == 'function') {
            chart['select'](selected);

          } else {
            var chartType = chart['getType']();
            switch (chartType) {
              case 'pie':
                chart['explodeSlices'](false);
                for (var i = 0; i < selected.length; i++) {
                  chart['explodeSlice'](selected[i]);
                }
                break;
              case 'stock':
                // do nothing - stock chart has no interactivity for now
                break;
              default:
                // console.log("Unprocessed chart type " + chartType + " in updateChartSelections()");
                break;
            }
          }
        };
      };
    });