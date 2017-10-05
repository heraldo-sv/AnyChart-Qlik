[<img src="https://cdn.anychart.com/images/logo-transparent-segoe.png?2" width="234px" alt="AnyChart - Robust JavaScript/HTML5 Chart library for any project">](https://www.anychart.com)

# AnyChart Extension for Qlik Sense

AnyChart JavaScript Visualization Library [extension](https://help.qlik.com/en-US/sense-developer/3.2/Subsystems/Extensions/Content/custom-objects.htm) for [Qlik Sense](http://www.qlik.com/us/products/qlik-sense).

[AnyChart](https://www.anychart.com/) is a flexible JavaScript (HTML5) based solution that allows developers to embed interactive and great looking charts and dashboards into any web, standalone or mobile project. AnyChart products include massive out-of-the-box capabilities, combined with the flexibility and the simplicity.

Qlik Sense is a self-service data visualization and discovery application designed for all business users whether, individuals, groups, or organizations. With Qlik Sense you can analyze data and make data discoveries on your own. You can share knowledge and analyze data in groups and across organizations. Qlik Sense lets you ask and answer your own questions and follow your own paths to insight, as well as enabling you and your colleagues to reach decisions collaboratively.

## Download and install

Download [AnyChart Qlick Sense Extension](https://github.com/AnyChart/AnyChart-Qlik/archive/master.zip).

### Installing Extension into Qlik Sense Desktop

Locate .zip file with extension and unzip it. Open the unzipped folder to find another folder inside. Copy that folder and navigate to *documents/qlik/sense/extensions* and paste the folder there.

### Installing Extension into Qlik Sense Server

Go to your QMC and, in the navigation menu on the left, under “Manage Resources”, click “Extensions”.

Then, in the action bar at the bottom of the screen, click “Import”

Click “Choose File” in the popup and navigate to the folder that was downloaded, select it, then click “Import”.

## Chart types

AnyChart extension provides many chart types with a set of subtypes for each type.

### Line chart

![AnyChart-Qlik extension line chart](/img/t_line.jpg?raw=true)

### Area chart

![AnyChart-Qlik extension area chart](/img/t_area.jpg?raw=true)

### Column chart

![AnyChart-Qlik extension column chart](/img/t_column.jpg?raw=true)

### Bar chart

![AnyChart-Qlik extension bar chart](/img/t_bar.jpg?raw=true)

### Scatter chart

![AnyChart-Qlik extension scatter chart](/img/t_scatter.jpg?raw=true)

### Pie/Donut chart

![AnyChart-Qlik extension pie/donut chart](/img/t_pie.jpg?raw=true)

## Series settings

All chart types except Pie can have more than one series. The number of series depends on the number of measures.

One measure corresponds to one series. The order of series is the same order measures have. To reorder series just reorder measures.

Each series can be configured individually. You can set series name, markers and labels display and labels text format.

![AnyChart-Qlik extension line chart](/img/panel_01.jpg?raw=true)

Read more about [AnyChart Text Formatters](https://docs.anychart.com/latest/Common_Settings/Text_Formatters).

For every series you can choose series type different than chart's default series type.

![AnyChart-Qlik extension mixed series types](/img/_mixed.jpg?raw=true)

## Other settings

### Palette

You can change the color scheme of a chart by using Palette dropdown.

![AnyChart-Qlik extension palette setting](/img/_paletts.jpg?raw=true)

### Legend

AnyChart extension allows to configure the legend: enable/disable, set layout, position, align, and title.

![AnyChart-Qlik extension legend settings](/img/_legend.jpg?raw=true)

### Axes

AnyChart Extension allows to configure axes: orientation, titles and labels and so on.

![AnyChart-Qlik extension axes settings](/img/panel_02.jpg?raw=true)

## Contacts

* Web: [www.anychart.com](https://www.anychart.com)
* Email: [contact@anychart.com](mailto:contact@anychart.com)
* Twitter: [anychart](https://twitter.com/anychart)
* Facebook: [AnyCharts](https://www.facebook.com/AnyCharts)
* LinkedIn: [anychart](https://www.linkedin.com/company/anychart)

## Links

* [AnyChart Website](https://www.anychart.com)
* [Download AnyChart](https://www.anychart.com/download/)
* [AnyChart Licensing](https://www.anychart.com/buy/)
* [AnyChart Support](https://www.anychart.com/support/)
* [Report Issues](https://github.com/AnyChart/AnyChart-Qlik/issues)
* [AnyChart Playground](https://playground.anychart.com)
* [AnyChart Documentation](https://docs.anychart.com)
* [AnyChart API Reference](https://api.anychart.com)
* [AnyChart Sample Solutions](https://www.anychart.com/solutions/)
* [AnyChart Integrations](https://www.anychart.com/integrations/)

## License
AnyChart Qlik plugin sample includes two parts:
- code of the plugin sample that allows to use Javascript library (in this case, AnyChart) with Qlik platform. You can use, edit, modify it, use it with other Javascript libraries without any restrictions. It is released under [Apache 2.0 License](https://github.com/AnyChart/AnyChart-Qlik/blob/master/LICENSE).
- AnyChart JavaScript library. It is released under Commercial license. You can test this plugin with the trial version of AnyChart. Our trial version is not limited by time and doesn't contain any feature limitations. Check details [here](https://www.anychart.com/buy/)

If you have any questions regarding licensing - please contact us. <sales@anychart.com>
[![Analytics](https://ga-beacon.appspot.com/UA-228820-4/Plugins/Qlik?pixel&useReferer)](https://github.com/igrigorik/ga-beacon)

