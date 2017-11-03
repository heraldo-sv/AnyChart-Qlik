define([
      "jquery",
      "./js/properties",

      "js/qlik",
      "./js/chart-builder",
      "./js/chart-editor",
      "./lib/proj4",

      "./lib/themes-combined",
      "./lib/anychart-bundle.min",

      "css!./lib/anychart-ui.min.css",
      "css!./lib/fonts.css",
      "css!./style.css"
    ],
    function($, pDef, qlik, chartBuilder, chartEditor, proj4) {
      'use strict';

      window['proj4'] = proj4;

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
              var str = '<div class="intro-wrapper"><div class="intro">' +
                  '<h1>Thank you for using AnyChart Qlik Sense Extension!</h1>' +
                  'Now you can start configuring your chart.<br><br>' +
                  'To run Chart Editor, please click on "Run Chart Editor" button in the Appearance Tab:' +
                  '<div class="screenshot screenshot-1"></div><br>' +
                  'Also you can use multiple measures and dimensions. Please use "Dimensions", "Measures" and "Sorting" tabs to setup your data:' +
                  '<div class="screenshot screenshot-2"></div></div></div>';

              $element.html(str);
            }

            return qlik.Promise.resolve();
          }
        }
      };
    });

