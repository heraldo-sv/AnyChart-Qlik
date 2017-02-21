define([], function() {
  'use strict';

  var seriesType = {
    type: "string",
    component: "dropdown",
    label: "Type",
    ref: "qDef.series.seriesTypeCALL",
    //defaultValue: "default",
    options: function(l, g){
      return getSeriesTypeOptions(g.layout.opt.chartType);
    },
    show: function(l, g) {
      return getChartTypePreset(g.layout.opt.chartType)['isSeriesBased'];
    }
  };

  var seriesMarkers = {
    type: "boolean",
    label: "Markers",
    ref: "qDef.series.markersCALL",
    defaultValue: false,
    show: function(l, g) {
      return getChartTypePreset(g.layout.opt.chartType)['isSeriesBased'];
    }
  };

  var valueAxis = {
    type: "string",
    component: "dropdown",
    label: "Axis",
    ref: "qDef.series.valueAxis",
    options: [{
      value: "v1",
      label: "left"
    }, {
      value: "v2",
      label: "right"
    }],
    deaultValue: "v1"
  };

  var fillColors = {
    type: "string",
    label: "Fill Color",
    ref: "qAttributeExpressions.0.qExpression",
    expression: "never",
    defaultValue: "",
    change: function(data) {
      data.qDef.series.fillColors = data.qDef.series.fillColors || {};
      data.qDef.series.fillColors.qStringExpression = data.qAttributeExpressions[0].qExpression;
      if (data.qAttributeExpressions[0].qExpression === "") {
        data.qDef.series.lineColor = "";
      }
    }
  };
  var fillAlphas = {
    type: "number",
    component: "slider",
    label: "Area fill Opacity",
    ref: "qDef.series.fillAlphas",
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: 1
  };
  var fontSize = {
    type: "number",
    label: "Font size",
    ref: "qDef.series.fontSize",
    defaultValue: 10
  };
  var columnWidth = {
    type: "number",
    component: "slider",
    label: "Bar Width",
    ref: "qDef.series.columnWidth",
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: 0.8
  };
  var clustered = {
    type: "boolean",
    component: "switch",
    label: "Columns Clustered",
    ref: "qDef.series.clustered",
    options: [{
      value: true,
      label: "On"
    }, {
      value: false,
      label: "Off"
    }],
    defaultValue: true
  };

  var groupColumn = {
    type: "items",
    items: {
      columnWidth: columnWidth,
      columnClustered: clustered
    },
    show: function(m) {
      if (m.qDef.series.type == "column") {
        return true;
      } else {
        return false;
      }
    }
  };

  // *****************************************************************************
  // Standard Settings > Line/Border settings
  // *****************************************************************************
  var lineColor = {
    type: "string",
    label: "line Color",
    ref: "qAttributeExpressions.1.qExpression",
    expression: "never",
    defaultValue: "",
    change: function(data) {
      data.qDef.series.lineColor = data.qDef.series.lineColor || {};
      data.qDef.series.lineColor.qStringExpression = data.qAttributeExpressions[1].qExpression;
      if (data.qAttributeExpressions[1].qExpression === "") {
        data.qDef.series.lineColor = "";
      }
    }
  };
  var lineThickness = {
    type: "number",
    component: "slider",
    label: "Line Thickness",
    ref: "qDef.series.lineThickness",
    min: 0,
    max: 10,
    step: 0.5,
    defaultValue: 1
  };
  var dashLength = {
    type: "number",
    component: "slider",
    label: "Dash Length",
    ref: "qDef.series.dashLength",
    min: 0,
    max: 20,
    step: 1,
    defaultValue: 0
  };
  var groupLine = {
    type: "items",
    items: {
      lineColor: lineColor,
      lineThickness: lineThickness,
      dashLength: dashLength
    }
  };
  // *****************************************************************************
  // Standard Series Settings
  // *****************************************************************************
  var seriesStandard = {
    type: "items",
    label: "Series settings",
    items: {
      seriesType: seriesType,
      seriesMarkers: seriesMarkers
      /*,
       fillColors: fillColors,
       fillAlphas: fillAlphas,

       valueAxis: valueAxis,
       fontSize: fontSize,
       groupColumn: groupColumn,
       groupLine: groupLine*/
    }
  };

  // *****************************************************************************
  // Advanced Settings > Bullets
  // *****************************************************************************
  var bullet = {
    type: "string",
    component: "dropdown",
    label: "Bullet Icon",
    ref: "qDef.series.bullet",
    options: [{
      value: "none",
      label: "None"
    }, {
      value: "round",
      label: "Round"
    }, {
      value: "square",
      label: "Square"
    }, {
      value: "triangleUp",
      label: "Triangle Up"
    }, {
      value: "triangleDown",
      label: "Triangle Down"
    }, {
      value: "bubble",
      label: "Bubble"
    }],
    defaultValue: "none"
  };
  var bulletAlpha = {
    type: "number",
    component: "slider",
    label: "Bullet Alpha",
    ref: "qDef.series.bulletAlpha",
    min: 0,
    max: 1,
    step: 0.1,
    defaultValue: 1
  };
  var bulletColor = {
    type: "string",
    label: "Bullet Color",
    ref: "qDef.series.bulletColor",
    defaultValue: "#FFFFFF"
  };
  var bulletSize = {
    type: "number",
    component: "slider",
    label: "Bullet Size",
    ref: "qDef.series.bulletSize",
    min: 0,
    max: 20,
    step: 1,
    defaultValue: 5
  };
  var groupBullet = {
    type: "items",
    items: {
      bullet: bullet,
      bulletAlpha: bulletAlpha,
      bulletColor: bulletColor,
      bulletSize: bulletSize
    }
  };
  // *****************************************************************************
  // Advanced Settings > Value Labels
  // *****************************************************************************
  var labelOffset = {
    ref: "qDef.series.labelOffset",
    label: "Label Offset",
    component: "slider",
    type: "number",
    min: 0,
    max: 10,
    step: 0.1,
    defaultValue: 0
  };
  var labelPosition = {
    ref: "qDef.series.labelPosition",
    label: "Label Position",
    component: "dropdown",
    type: "string",
    options: [{
      value: "top",
      label: "Top"
    }, {
      value: "bottom",
      label: "Bottom"
    }, {
      value: "right",
      label: "Right"
    }, {
      value: "left",
      label: "Left"
    }, {
      value: "inside",
      label: "Inside"
    }, {
      value: "middle",
      label: "Middle"
    }],
    defaultValue: "top"
  };
  var labelRotation = {
    type: "number",
    component: "slider",
    label: "Rotate Value Labels",
    ref: "qDef.series.labelRotation",
    min: 0,
    max: 360,
    step: 1,
    defaultValue: 0
  };
  var showLabel = {
    ref: "qDef.series.showLabel",
    type: "boolean",
    label: "Show Labels",
    component: "switch",
    options: [{
      value: true,
      label: "On"
    }, {
      value: false,
      label: "off"
    }],
    defaultValue: false
  };
  var groupLabel = {
    type: "items",
    items: {
      showLabel: showLabel,
      labelOffset: labelOffset,
      labelPosition: labelPosition,
      labelRotation: labelRotation
    }
  };
  // *****************************************************************************
  // Advanced Settings > Various
  // *****************************************************************************
  var behindColumns = {
    type: "boolean",
    component: "dropdown",
    label: "line graphs behind columns",
    ref: "qDef.series.behindColumns",
    options: [{
      value: true,
      label: "On"
    }, {
      value: false,
      label: "Off"
    }],
    defaultValue: false
  };
  var groupVarious = {
    type: "items",
    items: {
      behindColumns: behindColumns
    }
  };
  // *****************************************************************************
  // RETURN OBJECT
  // *****************************************************************************
  return {
    seriesStandard: seriesStandard/*,
     groupBullet: groupBullet,
     groupLabel: groupLabel,
     groupVarious: groupVarious*/
  };
});
