/*
jquery.timezonewidget.js - LGPL license
https://github.com/peterjtracey/timezoneWidget
*/
(function ($) {

$.fn.timezoneWidget = function (options) {
    var opts = $.extend( {}, $.fn.timezoneWidget.defaults, options );

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
			tzObj.selectedTimezone = $("#" + opts.tzField).val();
			tzObj.selectedRegion = $("#" + opts.regionField).val();
			if ($("#" + opts.regionField).length &&
				tzObj.selectedRegion.length > 0) {
				tzObj.selectedRegion = parseInt(tzObj.selectedRegion);
			} else {
				if (opts.guessUserTimezone) {
					var userTime = new Date();
					var offset = userTime + "";
					offset = offset.split(/GMT/);
					if (offset.length > 0) {
						offset = offset[1].split(" ");
						offset = offset[0];
						if (offset.length == 5) {
							offset = "UTC" + offset.substring(0, 3) + 
								":" + offset.substring(3, 6);
						}
						if (offset.length == 9) {
							var found = false;
							for (var i=0; i<opts.tz.length && !found; i++) {
									for (var j=0; j<opts.tz[i].timezones.length && !found; j++) {
										for (var k=0; k<opts.tz[i].timezones[j].labels.length && !found; k++) {							
											if (opts.tz[i].timezones[j].offsetLabel.indexOf(offset) != -1) {
												tzObj.selectedRegion = opts.tz[i].id;
												tzObj.selectedTimezone = opts.tz[i].timezones[j].labels[k];
												found = true;
											}
										}
									}
								}
							}
						} else {
							if (opts.defaultRegion) {
								tzObj.selectedRegion = opts.defaultRegion;
							}
						}
				} else {
					if (opts.defaultRegion) {
						tzObj.selectedRegion = opts.defaultRegion;
					}
				}
			}

			tzObj.regSelect = $("<select/>").attr('size', opts.tz.length).addClass('tz_region_select');

			for (var i=0; i<opts.tz.length; i++) {
				tzObj.regSelect.append($("<option/>").val(opts.tz[i].id).text(opts.tz[i].label));
			}			

			tzObj.elem.append(tzObj.regSelect);
			tzObj.elem.append($("<div/>").addClass("tz_timezone_container"));

			tzObj.regSelect.change(function () {
				tzObj.selectedRegion = $(this).val();

				tzObj.elem.find(".tz_timezone_container").html("");
				tzObj.tzSelect = $("<select data-placeholder='Select a timezone...'/>").append("<option value=''/>").addClass('tz_timezone_select');

				for (var i=0; i<opts.tz.length; i++) {
					if (opts.tz[i].id == parseInt($(this).val())) {
						for (var j=0; j<opts.tz[i].timezones.length; j++) {
							for (var k=0; k<opts.tz[i].timezones[j].labels.length; k++) {
								tzObj.tzSelect.append(
									$("<option/>").val(
										opts.tz[i].timezones[j].labels[k]
									).text(
										opts.tz[i].timezones[j].offsetLabel + " " + 
										opts.tz[i].timezones[j].labels[k].split('/')[1].replace(/_/g, " ")
									)
								);
							}
						}
					}					
				}

				if (tzObj.selectedTimezone.length > 0) {
					tzObj.tzSelect.val(tzObj.selectedTimezone);		
				}

				tzObj.elem.find(".tz_timezone_container").html(tzObj.tzSelect);
				tzObj.elem.find(".tz_timezone_select").chosen();

				tzObj.elem.find(".tz_timezone_select").change(function () {
					tzObj.selectedTimezone = $(this).val();
					$("#" + opts.tzField).val(tzObj.selectedTimezone);
					$("#" + opts.regionField).val(tzObj.selectedRegion);
				});
			});

			if (tzObj.selectedRegion > 0) {
				tzObj.regSelect.val(tzObj.selectedRegion);
				tzObj.regSelect.change();

				tzObj.regSelect.hover(function () {
					tzObj.userClickedRegion = true;
				})

				tzObj.regSelect.focus(function () {
					console.log(tzObj.userClickedRegion);
					if (!tzObj.userClickedRegion) {
						tzObj.elem.find(".tz_timezone_select+div").trigger('mousedown');
						tzObj.userClickedRegion = false;
					}						
				});
			}
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
    onRegionSelect : function() {},
    onTimezoneSelect : function() {}
};

})(jQuery);