define([
      "jquery",
      "./js/properties",

      "js/qlik",
      "./js/chart-builder",
      "./js/chart-editor",

      "./lib/anychart-bundle.min",
      "./lib/proj4",
      "css!./lib/anychart-ui.min.css",
      "css!./lib/fonts.css"
    ],
    function($, pDef, qlik, chartBuilder, chartEditor) {
      'use strict';

      var builder = new chartBuilder();
      var editor = new chartEditor();

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

          if (layout.anychart.chartEditor == "true" && this.options.interactionState == 2) {
            editor.openEditor(this, layout);

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

