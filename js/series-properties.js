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
          ref: "qDef.series.labelsCALL",
          type: "boolean",
          label: "Show labels",
          defaultValue: false,
          show: function(l, g) {
            return getChartTypePreset(g.layout.opt.chartType)['isSeriesBased'];
          }
        },
        seriesLabelsFormatter: {
          ref: "qDef.series.labelsCALL_formatCALL",
          type: "string",
          label: "Labels formatter",
          defaultValue: "{%Value}{decimalsCount:2}",
          //defaultValue: "{%PercentValue}{decimalsCount:1,zeroFillDecimals:true}%", // for pie
          show: function(l, g) {
            return l.qDef.series.labelsCALL && getChartTypePreset(g.layout.opt.chartType)['isSeriesBased'];
          }
        },
        pieLabels: {
          ref: "qDef.opt.pie.labelsCALL",
          type: "boolean",
          label: "Show labels",
          defaultValue: true,
          show: function(l, g) {
            return g.layout.opt.chartType == chartTypes.PIE_CHART;
          }
        },
        pieLabelsFormatter: {
          ref: "qDef.opt.pie.labelsCALL_formatCALL",
          type: "string",
          label: "Labels formatter",
          defaultValue: "{%PercentValue}{decimalsCount:1,zeroFillDecimals:true}%",
          show: function(l, g) {
            return g.layout.opt.chartType == chartTypes.PIE_CHART;
          }
        }
      }
    }
  };
});
