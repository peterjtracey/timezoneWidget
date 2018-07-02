/*
jquery.timezonewidget.js - LGPL license
https://github.com/peterjtracey/timezoneWidget
*/
(function ($) {

$.fn.timezoneWidget = function (options) {
  var opts = $.extend( {}, $.fn.timezoneWidget.defaults, options );

  if (typeof opts.data == "string") {
  	opts.data = JSON.parse(opts.data);
  }

  opts.tz = opts.data;

 	var tzObj = {
		elem: null,
		tz: [],
		regions: [],
		timezones: [],
		regSelect: null,
		tzSelect: null,
		selectedRegion: -1,
		selectedTimezone: '',
		userClickedRegion: false,
		draw: function () {
			if ($("#" + opts.tzField).length > 0) {
				tzObj.selectedTimezone = $("#" + opts.tzField).val();
				tzObj.selectedRegion = $("#" + opts.regionField).val();
			}
			if ($("#" + opts.regionField).length &&
				tzObj.selectedRegion.length > 0) {
				tzObj.selectedRegion = parseInt(tzObj.selectedRegion);
			} else {
				if (opts.guessUserTimezone) {
					var userTime = new Date();
					var offset = userTime + "";
					offset = offset.split(/GMT/);
					if (offset.length > 0) {
						offset = offset[1].split(/ /);
						offset = offset[0];
						if (offset.length == 5) {
							offset = "UTC" + offset.substring(0, 3) + 
								":" + offset.substring(3, 6);
						}
						if (offset.length == 9) {
							var found = false;
							$.each(opts.tz, function (key, itRegion) {
								var found = tzObj.findOffset(itRegion, offset);
								if (found) return false;
							});
						} else {
							if (opts.defaultRegion) {
								tzObj.selectedRegion = opts.defaultRegion;
							}
						}
					}
				} else {
					if (opts.defaultRegion) {
						tzObj.selectedRegion = opts.defaultRegion;
					}
				}
			}

			tzObj.regSelect = $("<select/>").attr(
				'size', 
				opts.tz.length
				).addClass('tz_region_select');

			$.each(opts.tz, function (key, region) {
				tzObj.regSelect.append(
					$("<option/>").val(
						region.id
						).text(region.label));
			});

			tzObj.elem.append(tzObj.regSelect);
			tzObj.elem.append($("<div/>").addClass("tz_timezone_container"));

			tzObj.regSelect.change(function () {
				tzObj.selectedRegion = parseInt($(this).val());

				tzObj.elem.find(".tz_timezone_container").html("");
				tzObj.tzSelect = $(
						"<select data-placeholder='" +
						opts.langSelectTZ + "'/>"
					).append(
						"<option value=''/>"
						).addClass(
						'tz_timezone_select'
						);

				tzObj.getZones(function (label, offsetLabel) {
						var parts = label.split(/\//);
						tzObj.tzSelect.append(
							$("<option/>").val(
								label
							).text(
								offsetLabel + " " + 
								parts[1].replace(/_/g, " ") +
								((parts.length > 2) ? "/" + parts[2] : "")
							)
						);
				});

				if (tzObj.selectedTimezone.length > 0) {
					tzObj.tzSelect.val(tzObj.selectedTimezone);
				}

				tzObj.elem.find(".tz_timezone_container").html(tzObj.tzSelect);
				tzObj.elem.find(".tz_timezone_select").chosen();

				tzObj.elem.find(".tz_timezone_select").change(function () {
					tzObj.selectedTimezone = $(this).val();
					$("#" + opts.tzField).val(tzObj.selectedTimezone);
					$("#" + opts.regionField).val(tzObj.selectedRegion);
					opts.onTimezoneSelect(tzObj.selectedRegion, tzObj.selectedTimezone);
				});

				if (tzObj.selectedTimezone.length > 0) {
					if (tzObj.tzSelect.val() != null) {
						tzObj.tzSelect.trigger('change');
					} else {
						opts.onRegionSelect(tzObj.selectedRegion);
					}
				} else {
					opts.onRegionSelect(tzObj.selectedRegion);
				}
			});

			if (tzObj.selectedRegion > 0) {
				tzObj.regSelect.val(tzObj.selectedRegion);
				tzObj.regSelect.change();

				tzObj.regSelect.hover(function () {
					tzObj.userClickedRegion = true;
				})

				tzObj.regSelect.focus(function () {
					if (!tzObj.userClickedRegion) {
						tzObj.elem.find(".tz_timezone_select+div").trigger('mousedown');
						tzObj.userClickedRegion = false;
					}						
				});
			}
		},
		findOffset: function (region, offset) {
			var found = false;
			$.each(region.timezones, function (key, itTimezone) {
				$.each(itTimezone.labels, function (key, itLabel) {
					if (itTimezone.offsetLabel.indexOf(offset) != -1) {
						tzObj.selectedRegion = region.id;
						tzObj.selectedTimezone = itLabel;
						found = true;
						return false;
					}
				});
			});
			return found;
		},
		getZones: function (callback) {
			$.each(opts.tz, function (key, itRegion) {
				if (itRegion.id == tzObj.selectedRegion) {
					$.each(itRegion.timezones, function (key, itTimezone) {
						$.each(itTimezone.labels, function (key, itLabel) {
							callback(itLabel, itTimezone.offsetLabel);
						});
					});
					return false;
				}
			});
		}
	} 

	tzObj.elem = this;

	this.addClass('tzwidget');

	tzObj.draw();

	return this;
};

$.fn.timezoneWidget.defaults = {
	regionField: 'tz_region',
	tzField: 'timezone',
	data: null,
	defaultRegion: 1024,
	guessUserTimezone: false,
  onRegionSelect : $.noop(),
  onTimezoneSelect : $.noop(),
  langSelectTZ : "Select a timezone..."
};

})(jQuery);