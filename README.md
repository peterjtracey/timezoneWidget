# timezoneWidget
This is a jQuery plugin with corresponding server code (currently PHP only) which draws a timezone selection widget. The javascript code is around 100 lines, the server class in PHP is around 150 including generating the JSON timezone data, validating submitted timezones, and a helper to get a region for a timezone name (from the DateTimeZone PHP class). 

It depends on the [Chosen](https://harvesthq.github.io/chosen/ "Chosen jQuery autocomplete plugin") jQuery plugin to make selecting the right timezone very easy.

It is designed to be very simple and intuitive, an emphasis has been made to make it especially useful to users in the United States. However, it is very easy to find any timezone in the world.