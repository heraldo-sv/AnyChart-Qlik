[<img src="https://cdn.anychart.com/images/logo-transparent-segoe.png?2" width="234px" alt="AnyChart - Robust JavaScript/HTML5 Chart library for any project">](https://anychart.com)

# AnyChart Extension for Qlik Sense

Wrapping in the AnyChart JS viz library as Qlik Sense objects.

## Download and install

You can download extension archive form [here](https://github.com/AnyChart/AnyChart-Qlik/archive/master.zip).

### Installing Extension into Qlik Sense Desktop
Find the .zip file that was downloaded, and unzip it. Open the unzipped folder to find another folder inside.
Copy that folder and navigate to *documents/qlik/sense/extensions* and paste the folder there.

### Installing Extension into Qlik Sense Server
Now that the extension has been downloaded, it needs to be installed into Qlik Sense.
Go to your QMC and, in the navigation menu on the left, under “Manage Resources,” click “Extensions.”
Then, in the action bar at the bottom of the screen, click “Import.” Click “Choose File” in the popup and navigate to the folder that was downloaded in step 1, select it, then click “Import.”

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

Charts of all types (except Pie) can have more than one series. Number of series depends on number of added measures.
One measure corresponds one series. The order of series creation is the same that measures have. So if you want to reorder
your series just reorder measures.

Each series can be configured individually. You can set up series name, markers and labels display and labels text format.

![AnyChart-Qlik extension line chart](/img/panel_01.jpg?raw=true)

More about AnyChart's text formatters you can read [here](http://docs.anychart.com/7.13.0/Common_Settings/Text_Formatters).
Also you can find there the list of available tokens that can be used in text formatters patterns.

Moreover for every series you can choose series type different than chart's default series type. This feature grants AnyChart charts just fantastic flexibility!

![AnyChart-Qlik extension mixed series types](/img/_mixed.jpg?raw=true)

## Other settings

### Palette
You can change color scheme of a chart by using Palette dropdown.

![AnyChart-Qlik extension palette setting](/img/_paletts.jpg?raw=true)

### Legend
AnyChart extension also gives you the ability to manage chart's legend: enable/disable it, set up legend's layout, position, align, set up legend's title.

![AnyChart-Qlik extension legend settings](/img/_legend.jpg?raw=true)

### Axes
Extension also provides you ability to set up axes - it's orientation, titles and labels.

![AnyChart-Qlik extension axes settings](/img/panel_02.jpg?raw=true)

## Contacts

* Web: [www.anychart.com](www.anychart.com)
* Email: [contact@anychart.com](mailto:contact@anychart.com)
* Twitter: [anychart](https://twitter.com/anychart)
* Facebook: [AnyCharts](https://www.facebook.com/AnyCharts)
* LinkedIn: [anychart](https://www.linkedin.com/company/anychart)

## Links

* [AnyChart Website](http://www.anychart.com)
* [Download AnyChart](http://www.anychart.com/download/)
* [AnyChart Licensing](http://www.anychart.com/buy/)
* [AnyChart Support](http://www.anychart.com/support/)
* [Report Issues](https://github.com/AnyChart/AnyChart-Ember/issues)
* [AnyChart Playground](http://playground.anychart.com)
* [AnyChart Documentation](http://docs.anychart.com)
* [AnyChart API Reference](http://api.anychart.com)
* [AnyChart Sample Solutions](http://www.anychart.com/solutions/)
* [AnyChart Integrations](http://www.anychart.com/integrations/)

## License

[© AnyChart.com - JavaScript charts](http://www.anychart.com). All rights reserved.

