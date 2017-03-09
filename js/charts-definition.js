var chartTypes = {
  "LINE_CHART": 1,
  "AREA_CHART": 2,
  "COLUMN_CHART": 3,
  "BAR_CHART": 4,
  "SCATTER_CHART": 5,
  "PIE_CHART": 6
};

var chartSubtypes = {
  // Line chart
  "LINE_CHART": 1,
  "SPLINE_CHART": 2,
  "STEP_LINE_CHART": 3,

  // Area chart
  "AREA_CHART": 4,
  "SPLINE_AREA_CHART": 5,
  "STEP_LINE_AREA_CHART": 6,
  "STACKED_AREA_CHART": 7,
  "STACKED_SPLINE_AREA_CHART": 8,
  "STACKED_STEP_LINE_AREA_CHART": 9,
  "PERCENT_STACKED_AREA_CHART": 10,
  "PERCENT_STACKED_SPLINE_AREA_CHART": 11,
  "PERCENT_STACKED_STEP_LINE_AREA_CHART": 12,
  // "3D_AREA_CHART": 13,
  // "STACKED_3D_AREA_CHART": 14,
  // "PERCENT_STACKED_3D_AREA_CHART": 15,

  // Column chart
  "COLUMN_CHART": 16,
  "STACKED_COLUMN_CHART": 17,
  "PERCENT_STACKED_COLUMN_CHART": 18,
  // "3D_COLUMN_CHART": 19,
  // "STACKED_3D_COLUMN_CHART": 20,
  // "PERCENT_STACKED_3D_COLUMN_CHART": 21,

  // Bar chart
  "BAR_CHART": 22,
  "STACKED_BAR_CHART": 23,
  "PERCENT_STACKED_BAR_CHART": 24,
  // "3D_BAR_CHART": 25,
  // "STACKED_3D_BAR_CHART": 26,
  // "PERCENT_STACKED_3D_BAR_CHART": 27,

  // Scatter chart
  "MARKER_SCATTER_CHART": 28,
  // "BUBBLE_SCATTER_CHART": 29,
  "LINE_SCATTER_CHART": 30,

  // Pie/Donut chart
  "PIE_CHART": 31,
  // "DONUT_CHART": 32,
  // "3D_PIE_CHART": 33,
  // "3D_DONUT_CHART": 34
};

var chartPresets = [
  {
    label: "Line Charts",
    value: chartTypes.LINE_CHART,
    ctor: "line",
    isSeriesBased: true,
    isVertical: false,
    defaultSubtype: chartSubtypes.LINE_CHART,
    subtypes: [
      {value: chartSubtypes.LINE_CHART, label: "Line Chart", seriesType: "line"},
      {value: chartSubtypes.SPLINE_CHART, label: "Spline Chart", seriesType: "spline"},
      {value: chartSubtypes.STEP_LINE_CHART, label: "Step-line Chart", seriesType: "stepLine"}
    ],

    min_dims: 1,
    measures: 1
  },
  {
    label: "Area Charts",
    value: chartTypes.AREA_CHART,
    ctor: "area",
    isSeriesBased: true,
    isVertical: false,
    defaultSubtype: chartSubtypes.AREA_CHART,
    subtypes: [
      {
        value: chartSubtypes.AREA_CHART, label: "Area Chart",
        seriesType: "area", settings: {"yScale().stackMode()": false}
      },
      {
        value: chartSubtypes.SPLINE_AREA_CHART, label: "Spline Area Chart",
        seriesType: "splineArea", settings: {"yScale().stackMode()": false}
      },
      {
        value: chartSubtypes.STEP_LINE_AREA_CHART, label: "Step-line Area Chart",
        seriesType: "stepArea", settings: {"yScale().stackMode()": false}
      },
      {
        value: chartSubtypes.STACKED_AREA_CHART, label: "Stacked Area Chart",
        seriesType: "area", settings: {"yScale().stackMode()": "value"}
      },
      {
        value: chartSubtypes.STACKED_SPLINE_AREA_CHART, label: "Stacked Spline Area Chart",
        seriesType: "splineArea", settings: {"yScale().stackMode()": "value"}
      },
      {
        value: chartSubtypes.STACKED_STEP_LINE_AREA_CHART, label: "Stacked Step-line Area Chart",
        seriesType: "stepArea", settings: {"yScale().stackMode()": "value"}
      },
      {
        value: chartSubtypes.PERCENT_STACKED_AREA_CHART, label: "Percent Stacked Area Chart",
        seriesType: "area", settings: {"yScale().stackMode()": "percent"}
      },
      {
        value: chartSubtypes.PERCENT_STACKED_SPLINE_AREA_CHART, label: "Percent Stacked Spline Area Chart",
        seriesType: "splineArea", settings: {"yScale().stackMode()": "percent"}
      },
      {
        value: chartSubtypes.PERCENT_STACKED_STEP_LINE_AREA_CHART, label: "Percent Stacked Step-line Area Chart",
        seriesType: "stepArea", settings: {"yScale().stackMode()": "percent"}
      }/*,
      {
        value: chartSubtypes["3D_AREA_CHART"], label: "3D Area Chart",
        ctor: "area3d", seriesType: "area", settings: {"yScale().stackMode()": false}
      },
      {
        value: chartSubtypes.STACKED_3D_AREA_CHART, label: "Stacked 3D Area Chart",
        ctor: "area3d", seriesType: "area", settings: {"yScale().stackMode()": "value"}
      },
      {
        value: chartSubtypes.PERCENT_STACKED_3D_AREA_CHART, label: "Percent Stacked 3D Area Chart",
        ctor: "area3d", seriesType: "area", settings: {"yScale().stackMode()": "percent"}
      }*/
    ],

    min_dims: 1,
    measures: 1
  },
  {
    label: "Column Charts",
    value: chartTypes.COLUMN_CHART,
    ctor: "column",
    isSeriesBased: true,
    isVertical: false,
    defaultSubtype: chartSubtypes.COLUMN_CHART,
    subtypes: [
      {
        value: chartSubtypes.COLUMN_CHART, label: "Column Chart",
        seriesType: "column", settings: {"yScale().stackMode()": false}
      },
      {
        value: chartSubtypes.STACKED_COLUMN_CHART, label: "Stacked Column Chart",
        seriesType: "column", settings: {"yScale().stackMode()": "value"}
      },
      {
        value: chartSubtypes.PERCENT_STACKED_COLUMN_CHART, label: "Percent Stacked Column Chart",
        seriesType: "column", settings: {"yScale().stackMode()": "percent"}
      }/*,
      {
        value: chartSubtypes["3D_COLUMN_CHART"], label: "3D Column Chart",
        ctor: "column3d", seriesType: "column", settings: {"yScale().stackMode()": false}
      },
      {
        value: chartSubtypes.STACKED_3D_COLUMN_CHART, label: "Stacked 3D Column Chart",
        ctor: "column3d", seriesType: "column", settings: {"yScale().stackMode()": "value"}
      },
      {
        value: chartSubtypes.PERCENT_STACKED_3D_COLUMN_CHART, label: "Percent Stacked 3D Column Chart",
        ctor: "column3d", seriesType: "column", settings: {"yScale().stackMode()": "percent"}
      }*/
    ],

    min_dims: 1,
    measures: 1
  },
  {
    label: "Bar Charts",
    value: chartTypes.BAR_CHART,
    ctor: "bar",
    isSeriesBased: true,
    isVertical: true,
    defaultSubtype: chartSubtypes.BAR_CHART,
    subtypes: [
      {
        value: chartSubtypes.BAR_CHART, label: "Bar Chart",
        seriesType: "bar", settings: {"yScale().stackMode()": false}
      },
      {
        value: chartSubtypes.STACKED_BAR_CHART, label: "Stacked Bar Chart",
        seriesType: "bar", settings: {"yScale().stackMode()": "value"}
      },
      {
        value: chartSubtypes.PERCENT_STACKED_BAR_CHART, label: "Percent Stacked Bar Chart",
        seriesType: "bar", settings: {"yScale().stackMode()": "percent"}
      }/*,
      // 3D
      {
        value: chartSubtypes["3D_BAR_CHART"], label: "3D Bar Chart",
        ctor: "bar3d", seriesType: "bar", settings: {"yScale().stackMode()": false}
      },
      {
        value: chartSubtypes.STACKED_3D_BAR_CHART, label: "Stacked 3D Bar Chart",
        ctor: "bar3d", seriesType: "bar", settings: {"yScale().stackMode()": "value"}
      },
      {
        value: chartSubtypes.PERCENT_STACKED_3D_BAR_CHART, label: "Percent Stacked 3D Bar Chart",
        ctor: "bar3d", seriesType: "bar", settings: {"yScale().stackMode()": "percent"}
      }*/
    ],

    min_dims: 1,
    measures: 1
  },
  {
    label: "Scatter Charts",
    value: chartTypes.SCATTER_CHART,
    ctor: "scatter",
    isSeriesBased: true,
    isVertical: false,
    defaultSubtype: chartSubtypes.MARKER_SCATTER_CHART,
    subtypes: [
      {value: chartSubtypes.MARKER_SCATTER_CHART, label: "Marker Chart", seriesType: "marker"},
      //{value: chartSubtypes.BUBBLE_SCATTER_CHART, label: "Bubble Chart", seriesType: "bubble"},
      {value: chartSubtypes.LINE_SCATTER_CHART, label: "Line Chart", seriesType: "line"}
    ],

    min_dims: 1,
    measures: 1
  },
  {
    label: "Pie/Donut Charts",
    value: chartTypes.PIE_CHART,
    ctor: "pie",
    isSeriesBased: false,
    defaultSubtype: chartSubtypes.PIE_CHART,
    subtypes: [
      {value: chartSubtypes.PIE_CHART, label: "Pie Chart"/*, settings: {"innerRadius()": false}*/},
      //{value: chartSubtypes.DONUT_CHART, label: "Donut Chart", settings: {"innerRadius()": "50%"}}
      /*,
      {value: chartSubtypes["3D_PIE_CHART"], label: "3D Pie Chart", ctor: "pie3d", settings: {"innerRadius()": false}},
      {
        value: chartSubtypes["3D_DONUT_CHART"],
        label: "3D Donut Chart",
        ctor: "pie3d",
        settings: {"innerRadius()": "50%"}
      }*/
    ],

    min_dims: 1,
    measures: 1,
    max_measures: 1
  }
];

var currentChartType = null;
var currentChartTypePreset = null;
var currentChartSubtype = null;
var currentChartSubtypePreset = null;
var getChartTypePreset = function(typeId) {
  if (!currentChartTypePreset || currentChartType != typeId) {
    currentChartTypePreset = chartPresets.filter(function(d) {
      return d.value === typeId;
    })[0];
    currentChartType = typeId;
    currentChartSubtype = null;
    currentChartSubtypePreset = null;
  }
  return currentChartTypePreset;
};

var getSubtypePreset = function(typePreset, subtypeId) {
  if (!currentChartSubtypePreset || currentChartSubtype != subtypeId) {
    currentChartSubtypePreset = typePreset["subtypes"].filter(function(d) {
      return d.value == subtypeId
    })[0];
    currentChartSubtype = subtypeId;
  }
  return currentChartSubtypePreset;
};

var getSeriesTypeOptions = function(chartTypeId) {
  var options = [];

  switch (chartTypeId) {
    case chartTypes.LINE_CHART:
    case chartTypes.AREA_CHART:
    case chartTypes.COLUMN_CHART:
    case chartTypes.BAR_CHART:
      options = [
        {
          value: null,
          label: "-- default --"
        },
        {
          value: "line",
          label: "Line"
        }, {
          value: "spline",
          label: "Spline"
        }, {
          value: "stepLine",
          label: "Step-line"
        }, {
          value: "jumpline",
          label: "Jump-line"
        }, {
          value: "area",
          label: "Area"
        }, {
          value: "splineArea",
          label: "Spline area"
        }, {
          value: "stepArea",
          label: "Step-area"
        }, {
          value: "column",
          label: "Column"
        }, {
          value: "bar",
          label: "Bar"
        }, {
          value: "marker",
          label: "Marker"
        }, {
          value: "stick",
          label: "Stick"
        }
      ];
      break;
    case chartTypes.SCATTER_CHART:
      options = [
        {
          value: null,
          label: "-- default --"
        },
        {
          value: "marker",
          label: "Marker"
        },/* {
          value: "bubble",
          label: "Bubble"
        },*/
        {
          value: "line",
          label: "Line"
        }
      ];
      break;
    default:
      break;
  }

  return options;
};