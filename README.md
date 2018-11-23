# timezoneWidget
This is a jQuery plugin which draws a timezone selection widget. The plugin has an option (guessUserTimezone, default false) to automatically guess a user's timezone. Dates displayed on the page can be automatically adjusted according to the selection. 

A server class in PHP includes a method generating the JSON timezone data, validating submitted timezones, and a helper to get a region for a timezone name (from the DateTimeZone PHP class). 

Contributions for JSON data generation in other languages are welcome.

It depends on the [Chosen](https://harvesthq.github.io/chosen/ "Chosen jQuery autocomplete plugin") jQuery plugin to make selecting the right timezone very easy.

It is designed to be very simple and intuitive, an emphasis has been made to make it especially useful to users in the United States. However, it is very easy to find any timezone in the world. 

A demo (working sample) page is included as [demo-widget.html](https://peterjtracey.github.io/timezoneWidget/demo-widget.html "Minimal Demo of JQuery Timezone Widget")
and is the best way to go about implementing in a site or application.

A picture is worth a thousand words (or clicks of the demo link). 

![Screenshot](https://github.com/peterjtracey/timezoneWidget/blob/master/timezonewidgetscreenshot.png?raw=true "Screenshot")

## New in Version 2.0

Now has a true "widget" mode where a dropdown with the current time and auto-selected current timezone are displayed. When selected the widget appears allowing quick switching of timezones should the automatic selection or loaded value not be accurate.

Beyond that, integration has been started with moment-timezone.js - so that any dates displayed on the page can be adjusted according to the user's selected timezone. This comes from a suggestion by [github user nathanv](https://github.com/nathanv).

To go along with widget mode, there is an expirimental new feature - by
setting the option: 
```
			translateClass: 'tzw-translate',
```
when elements having that class are encountered, the pair of "data" values seen here can be used to automatically adjust the date display: 
```
  <span class="tzw-translate" data-tzwdate="2018-01-01T01:11:00" data-tzwformat="h:mmA">1/18/2018 11:00am</td>
```
An empty tzwdate value will adjust the current browser's time to the selected timezone. Not all that useful. The real value is when server-stored dates are output, by simply adding these two attributes all of those dates can be transformed to a user's local time on the client, "automagically" - on the fly!

To elimate the need for server-side storing of timezone values, storeCookie and loadCookie options are available, where the value a user selected will be persisted.

## Usage

Include the JavaScript, CSS, and the [Chosen](https://harvesthq.github.io/chosen/ "Chosen jQuery autocomplete plugin") plugin on a page (plugin must come after jQuery). The data structure can be seen in the [PHP file](https://github.com/peterjtracey/timezoneWidget/blob/master/server/php/TimezoneWidget.php). If not using PHP, an equivilant data structure must be generated. 

Internationalization can be added since the labels of the selects all come from the JSON data. The option langSelectTZ allows customizing the only language item built into the control. The PHP class's timezoneValues() method can be passed to the built-in json_encode function or otherwise converted into JSON, and then set as the timezoneData option passed to the plugin (see timezonedata.php for example).

There are a few ways to get the timezone values back. The easiest is to have two hidden fields, for region (currently the PHP DateTimeZone region constants) and timezone name (also the literal PHP values for timezones). Values for the id attributes of these fields can be set via the regionField and tzField options respectively. These fields will be populated when a user selects a region or timezone.

Alternatively, instead of passing these options (they have sensible defaults), there are two callback methods that can be set as options: 

1. onRegionSelect 
	- region as argument)
2. onTimezoneSelect
	- Timezone name as first argument
	- Region as second (this way it is the only callback that has to be handled)
	- "Auto" - true if an auto-guessed selection

A defaultRegion option can be passed to automatically select a region in case autoselect is disabled or doesn't find a timezone.

Values can be persisted in cookies, but for most applications with login functionality you should be saving the value into a user profile.

Once you have stored the selected timezone value, you can look at the [Users.php](https://github.com/peterjtracey/timezoneWidget/blob/master/server/php/Users.php) class to get an idea of how to easily convert dates to the user's local time. This PHP example, as opposed to the more generic timezone utility class, uses Laravel's Eloquent database model class. Anyone is welcome to contribute examples for other languages and ORM libraries.

## Example Code

### Minimal HTML

Note: use of bootstrap is actually optional

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>jQuery timzoneWidget Plugin Demo</title>

  <!-- Bootstrap 3.3.7 -->
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

	<!-- Optional theme -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

	<link rel="stylesheet" href="jquery.timezonewidget.css">

  <!-- Chosen -->
  <link rel="stylesheet" href="chosen/chosen.css">

</head>
<body>
	<h1>JQuery timezoneWidget Plugin Minimal Demo</h1>
	<hr/>
	<input type="hidden" name="user_timezone_region" id="user_timezone_region"/>
  <input type="hidden" name="user_timezone" id="user_timezone"/>
	<div class="container">
		<div class="hidden-sm col-md-2"></div>
		<div class="form-group col-sm-12 col-md-8">
			<label for="user_timezone">Timezone:</label>
	    <br/><br/>
			<!-- this holds the timezone widget -->
	    <div id="user_edit_timezone"></div>
		</div>
		<div class="hidden-sm col-md-2"></div>
	</div>
</body>

<!-- jQuery 3.1.1 -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

<!-- chosen -->
<script src="chosen/chosen.jquery.min.js" type="text/javascript"></script>

<script src="jquery.timezonewidget.min.js"></script>

</html>
```


### Minimal JavaScript

<strong>Using Events (most powerful)</strong>
```javascript
// timezonedata.php is included in the PHP sample code
// it is recommended to host it on your own server, as this
// url may become inactive
$.get('https://www.unlocktc.com/timezoneWidget/server/php/timezonedata.php', function (tzData) { 
	$("#user_edit_timezone").timezoneWidget({
		data: tzData,
		onRegionSelect: function (region) {
			console.log("onRegionSelect");
			console.log("REGION: " + region);
		},
		onTimezoneSelect: function (region, timezone) {
			console.log("onTimezoneSelect");
			console.log("REGION: " + region);
			console.log("TIMEZONE: " + timezone);
		},
		guessUserTimezone: true // default is false
	});
});
```

<strong>Populate Hidden Fields (easiest)</strong>
```javascript
$.get('https://www.unlocktc.com/timezoneWidget/server/php/timezonedata.php', function (tzData) { 
	$("#user_edit_timezone").timezoneWidget({
		data: tzData,
		regionField: 'user_timezone_region',
		tzField: 'user_timezone',
		guessUserTimezone: true // default is false
	});
});
```