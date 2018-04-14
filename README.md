# timezoneWidget
This is a jQuery plugin with corresponding server code (currently PHP only) which draws a timezone selection widget. The javascript code is around 100 lines, the server class in PHP is around 150 including generating the JSON timezone data, validating submitted timezones, and a helper to get a region for a timezone name (from the DateTimeZone PHP class). 

It depends on the [Chosen](https://harvesthq.github.io/chosen/ "Chosen jQuery autocomplete plugin") jQuery plugin to make selecting the right timezone very easy.

It is designed to be very simple and intuitive, an emphasis has been made to make it especially useful to users in the United States. However, it is very easy to find any timezone in the world.

In lieu of a demo a screenshot is included in the root of the repository.

## H2 Usage

Include the JavaScript, CSS, Chosen plugin on a page (plugin must come after jQuery). The data structure can be seen in the PHP file, if not using PHP an equivilant data structure must be generated. Internationalization can be added since the labels of the select all come from the JSON data. The PHP class's timezoneValues() method can be passed to the built-in json_encode function or otherwise converted into JSON, and then set as the timezoneData option passed to the plugin.

There are a few ways to get the timezone values back. The easiest is to have two hidden fields, for region (currently the PHP DateTimeZone region constants) and timezone name (also the literal PHP values for timezones). Values for the id attributes of these fields can be set via the regionField and tzField options respectively. These fields will be populated when a user selects a region or timezone.

Alternatively, instead of passing these options (they have sensible defaults), there are two callback methods that can be set as options: 

1. onRegionSelect (passes the region as argument)
2. onTimezoneSelect (passes the timezone name as first argument, region as second so that this is the only callback that has to be handled)

The plugin is tab friendly so that when a user tabs to the field it focuses the US timezones (this may be made optional in the future, or a region to focus by default).