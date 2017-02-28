define(['./series-properties', './chart-properties'
], function(seriesProperties, chartProperties) {

  var dimensions = {
    uses: "dimensions",
    min: 1,
    max: 1
  };

  var measures = {
    uses: "measures",
    min: 1,
    max: 6,
    items: seriesProperties
  };

  var settings = {
    uses : "settings"
  };

  var sorting = {
    uses: "sorting"
  };

  return {
    type: "items",
    component: "accordion",
    items: {
      dimensions: dimensions,
      measures: measures,
      sorting: sorting,
      chart: chartProperties,
      settings: settings
    }
  };
});
