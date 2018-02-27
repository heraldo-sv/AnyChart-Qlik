define(["./../config"], function(config) {

  var dimensions = {
    uses: "dimensions",
    min: 1,
    max: config.settings.maxDimensions
  };

  var measures = {
    uses: "measures",
    min: 1,
    max: config.settings.maxMeasures
  };

  var sorting = {
    uses: "sorting"
  };

  var chartEditor = {
    type: "items",
    label: "Chart Editor",
    items: {
      chartEditor: {
        ref: "anychart.chartEditor",
        component: "buttongroup",
        type: "string",
        options: [{
          value: "true",
          label: "Run Chart Editor",
          tooltip: "Run Chart Editor to customize chart"
        }],
        defaultValue: "false"
      },
      code: {
        ref: "anychart.code",
        component: "textarea",
        rows: 7,
        maxlength: 4096,
        show: false
      },
      model: {
        ref: "anychart.model",
        component: "textarea",
        rows: 7,
        maxlength: 4096,
        show: false
      },
      field: {
        ref: "anychart.field",
        type: "string",
        show: false
      },
      tokens: {
        ref: "anychart.tokens",
        type: "string",
        defaultValue: "",
        show: false
      }
    }
  };

  var appearance = {
    uses: "settings",
    items: {
      chartEditor: chartEditor
    }
  };

  return {
    type: "items",
    component: "accordion",
    items: {
      dimensions: dimensions,
      measures: measures,
      sorting: sorting,
      appearance: appearance
    }
  };
});
