define([
      "jquery",
      "./js/properties",
      "js/qlik",
      "./lib/anychart-bundle.min",
      "./js/chart-builder",
      "css!./lib/anychart-ui.min.css"
    ],
    function($, pDef, qlik, bundle, chartBuilder) {
      'use strict';

      var builder = new chartBuilder();
      var editor = null;
      var complete = false;

      var openEditor = function(backendApi) {
        if (!editor) {
          editor = anychart.ui.editor();
          editor.steps().prepareData(false);
          editor.renderAsDialog();
          complete = false;

          var data = [];
          backendApi.eachDataRow(function(rownum, row) {
            var processedRow = [];
            for (var i = 0; i < row.length; i++) {
              var num1 = Number(row[i]['qNum']);
              var num2 = Number(row[i]['qText']);
              var date = new Date(row[i]['qText']);
              var time = date.getTime();
              if (num1 && isNaN(num2) && time)
                num1 = time;
              var value = num1 || (!isNaN(num2) ? num2 : row[i]['qText']);
              processedRow.push(value);
            }
            data.push(processedRow);
          });

          // console.log(data[0]);

          editor.data(data);
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
            closeEditor(backendApi, code);
          });

          editor.listenOnce('close', function() {
            if (!complete)
              closeEditor(backendApi, null);
          });
        }
      };

      var closeEditor = function(backendApi, code) {
        if (editor) {
          editor.visible(false);
          editor.removeAllListeners();
          editor.dispose();
          editor = null;

          backendApi.getProperties().then(function(reply) {
            reply.anychart.chartEditor = "false";
            if (code) {
              reply.anychart.code = code;
            }
            backendApi.setProperties(reply);
          });
        }
      };

      return {
        initialProperties: {
          version: 1.0,
          qHyperCubeDef: {
            qDimensions: [],
            qMeasures: [],
            qInitialDataFetch: [{
              qWidth: 7,
              qHeight: 1250
            }]
          },
          selectionMode: "CONFIRM"
        },

        //property panel
        definition: pDef,

        support: {
          snapshot: true,
          export: true
        },

        paint: function($element, layout) {
          $element.html('');

          // var dimCount = layout.qHyperCube.qDimensionInfo.length;
          // var measureCount = layout.qHyperCube.qMeasureInfo.length;
          // console.log(layout.qHyperCube);

          if (layout.anychart.chartEditor == "true" && this.options.interactionState == 2) {
            openEditor(this.backendApi);

          } else {
            var chart = builder.buildChart(this, layout);

            if (chart) {
              var containerId = "container_" + layout.qInfo.qId;
              $element.append(
                  $('<div/>')
                      .attr({"id": containerId, "class": "chart-container"})
                      .css({"width": "100%", "height": "100%"}));

              chart['container'](containerId);
              chart['draw']();
            } else {
              var str = 'ANYCHART<br>' +
                  'Please configure chart using Chart Editor!';

              $element.html(str);
            }

            return qlik.Promise.resolve();
          }
        }
      };
    });

