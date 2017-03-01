define([], function() {
  'use strict';

  return {
    numberFormatting: {
      show: false
    },
    seriesStandard: {
      type: "items",
      label: "Series settings",
      items: {
        seriesType: {
          type: "string",
          component: "dropdown",
          label: "Type",
          ref: "qDef.series.seriesTypeCALL",
          defaultValue: null,
          options: function(l, g) {
            return getSeriesTypeOptions(g.layout.opt.chartType);
          },
          show: function(l, g) {
            return getChartTypePreset(g.layout.opt.chartType)['isSeriesBased'];
          }
        },
        seriesMarkers: {
          type: "boolean",
          label: "Markers",
          ref: "qDef.series.markersCALL",
          defaultValue: false,
          show: function(l, g) {
            return getChartTypePreset(g.layout.opt.chartType)['isSeriesBased'];
          }
        },
        seriesLabels: {
          ref: "qDef.vary.series.labelsCALL",
          type: "boolean",
          label: "Show labels",
          defaultValue: false,
          show: function(l, g) {
            return getChartTypePreset(g.layout.opt.chartType)['isSeriesBased'];
          }
        },
        chartLabels: {
          ref: "qDef.vary.chart.labelsCALL",
          type: "boolean",
          label: "Show labels",
          defaultValue: true,
          show: function(l, g) {
            return !getChartTypePreset(g.layout.opt.chartType)['isSeriesBased'];
          }
        },
        labelsFormatter: {
          ref: "qDef.vary.both.labelsCALL_textFormatterCALL",
          type: "string",
          label: "Labels formatter",
          defaultValue: "{%Value}{decimalsCount:2}",
          //defaultValue: "{%PercentValue}{decimalsCount:1,zeroFillDecimals:true}%", // for pie
          show: function(l, g) {
            var seriesBased = getChartTypePreset(g.layout.opt.chartType)['isSeriesBased'];
            return (!seriesBased && l.qDef.vary.chart && l.qDef.vary.chart.labelsCALL) ||
                (seriesBased && l.qDef.vary.series && l.qDef.vary.series.labelsCALL);
          }
        }
      }
    }
  };
});
