define([
      "jquery",
      "./js/properties",
      "js/qlik",
      "./lib/anychart-bundle.min",
      "./js/chart-builder"
    ],
    function($, pDef, qlik) {
      'use strict';

      var builder = new ACBuilder();

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
          selectionMode : "CONFIRM"
        },

        //property panel
        definition: pDef,

        support : {
          snapshot: true,
          export: true
        },

        paint: function($element, layout) {
          //var scope = angular.element($element).scope();
          var containerId = "container_" + layout.qInfo.qId;

          if (!$element.find(".chart-container").length) {
            $element.append(
                $('<div/>')
                    .attr({"id": containerId, "class": "chart-container"})
                    .css({"width": "100%", "height": "100%"}));
          }

          var dimCount = layout.qHyperCube.qDimensionInfo.length;
          var measureCount = layout.qHyperCube.qMeasureInfo.length;
          var chart;

          if (dimCount > 0 && measureCount > 0) {
            chart = builder.buildChart(this, layout);
          }

          if (chart) {
            chart.container(containerId);
            chart.draw();
          }

          return qlik.Promise.resolve();
        }
      };
    });


