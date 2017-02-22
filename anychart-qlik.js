define([
      "jquery",
      "./js/properties",
      "js/qlik",
      "./lib/anychart-bundle.min",
      "./js/chart-builder"
    ],
    function($, pDef, qlik) {
      'use strict';

      var chart = undefined;

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

        snapshot: {
          canTakeSnapshot: true
        },

        paint: function($element, layout) {
          //console.log("any paint");
          var view = this;
          //var scope = angular.element($element).scope();
          var containerId = "container_" + layout.qInfo.qId;

          if (!$element.find(".chart-container").length) {
            $element.append(
                $('<div/>')
                    .attr({"id": containerId, "class": "chart-container"})
                    .css({"width": "100%", "height": "100%"}));

            $element.append(
                $('<div/>')
                    .attr({"class": "incomplete"}).css({"width": "100%", "height": "100%"}));
          }

          var dimCount = layout.qHyperCube.qDimensionInfo.length;
          var measureCount = layout.qHyperCube.qMeasureInfo.length;

          if (dimCount > 0 && measureCount > 0)
            chart = ACBuilder.buildChart(view, layout);

          if (chart) {
            $element.find(".incomplete").hide();
            $element.find(".chart-container").show();

            if (!chart.container()) {
              chart.container(containerId);
            }
            chart.draw();

          } else if(dimCount == 0 && measureCount == 0) {
            // Incomplete visualization
            var extOrigin = document.location.origin + '/extensions/anychart-qlik';
            var typePreset = getChartTypePreset(layout.opt.chartType);
            var subtypePreset = getSubtypePreset(typePreset, layout.opt.chartSubtype);

            $element.find(".incomplete").show();
            $element.find(".chart-container").hide();

            // Not set required dimensions or measures or subtype
            var html = '<div><img src=' + extOrigin + '/img/add_items.png><h1>Incomplete Visualization</h1>';
            html += '<p>Chart type selected: <b>' + typePreset.label + '</b></p>';

            if (subtypePreset) {
              html += '<p>Chart subtype: <b>' + typePreset.label + '</b></p>';
            }

            html += '<p><h2>Data required:</h2><table style="width: 300px;">';

            if (!subtypePreset) {
              html += '<tr><td>Chart subtype:</td><td><b>Required</b></td></tr>';
            }
            if (!dimCount) {
              html += '<tr><td>Dimensions:</td><td><b>1 required</b></td></tr>';
            }
            if (!measureCount) {
              html += '<tr><td>Measures:</td><td><b>1 or more required</b></td></tr>';
            }
            html += '</table><br>Complete data and options selection to finalize visualization.</p></div>';

            $element.find(".incomplete").html(html);
          }

          return qlik.Promise.resolve();
        }
      };
    });


