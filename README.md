# timezoneWidget
This is a jQuery plugin with corresponding server code (currently PHP only) which draws a timezone selection widget. The plugin has an option (guessUserTimezone, default false) to automatically guess a user's timezone. The server class in PHP includes a method generating the JSON timezone data, validating submitted timezones, and a helper to get a region for a timezone name (from the DateTimeZone PHP class). 

Contributions for JSON data generation in other languages are welcome.

It depends on the [Chosen](https://harvesthq.github.io/chosen/ "Chosen jQuery autocomplete plugin") jQuery plugin to make selecting the right timezone very easy.

It is designed to be very simple and intuitive, an emphasis has been made to make it especially useful to users in the United States. However, it is very easy to find any timezone in the world.

For a quick look at the widget a screenshot is included in the root of the repository. 

![Screenshot](https://github.com/peterjtracey/timezoneWidget/blob/master/timezonewidgetscreenshot.png?raw=true "Screenshot")

A minimal demo (working sample) page is included as demo.html. That page can be viewed [here](https://peterjtracey.github.io/timezoneWidget//demo.html "Demo of JQuery Timezone Widget")

## Usage

Include the JavaScript, CSS, Chosen plugin on a page (plugin must come after jQuery). The data structure can be seen in the PHP file, if not using PHP an equivilant data structure must be generated. Internationalization can be added since the labels of the select all come from the JSON data. The PHP class's timezoneValues() method can be passed to the built-in json_encode function or otherwise converted into JSON, and then set as the timezoneData option passed to the plugin.

There are a few ways to get the timezone values back. The easiest is to have two hidden fields, for region (currently the PHP DateTimeZone region constants) and timezone name (also the literal PHP values for timezones). Values for the id attributes of these fields can be set via the regionField and tzField options respectively. These fields will be populated when a user selects a region or timezone.

Alternatively, instead of passing these options (they have sensible defaults), there are two callback methods that can be set as options: 

1. onRegionSelect (passes the region as argument)
2. onTimezoneSelect (passes the timezone name as first argument, region as second so that this is the only callback that has to be handled)

The plugin is tab friendly so that when a user tabs to the field it focuses the US timezones. Alternatively, the defaultRegion option can be passed to change the default.