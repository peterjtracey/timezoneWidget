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
		// defaults
		TZ_REGION_DEFAULT: 1024,

		draw: function () {
			tzObj.selectedTimezone = $("#" + opts.tzField).val();
			tzObj.selectedRegion = $("#" + opts.regionField).val();

			if (tzObj.selectedRegion.length > 0) {
				tzObj.selectedRegion = parseInt(tzObj.selectedRegion);
			} else {
				tzObj.selectedRegion = tzObj.TZ_REGION_DEFAULT;
			}

			tzObj.regSelect = $("<select/>").attr('size', opts.tz.length).addClass('tz_region_select');

			for (var i=0; i<opts.tz.length; i++) {
				tzObj.regSelect.append($("<option/>").val(opts.tz[i].id).text(opts.tz[i].label));
			}			

			tzObj.elem.append(tzObj.regSelect);
			tzObj.elem.append($("<div/>").addClass("tz_timezone_container"));

			tzObj.regSelect.change(function () {
				tzObj.selectedRegion = $(this).val();

				optz.onRegionSelect(tzObj.selectedRegion);

				tzObj.elem.find(".tz_timezone_container").html("");
				tzObj.tzSelect = $("<select data-placeholder='Select a timezone...'/>").append("<option value=''/>").addClass('tz_timezone_select');

				for (var i=0; i<opts.tz.length; i++) {
					if (opts.tz[i].id == parseInt($(this).val())) {
						for (var j=0; j<opts.tz[i].timezones.length; j++) {
							//console.log(opts.tz[i].timezones[j]);
							for (var k=0; k<opts.tz[i].timezones[j].labels.length; k++) {
								tzObj.tzSelect.append($("<option/>").val(opts.tz[i].timezones[j].labels[k]).text(opts.tz[i].timezones[j].offsetLabel + " " + opts.tz[i].timezones[j].labels[k].split('/')[1].replace(/_/g, " ")));
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

					optz.onRegionSelect(tzObj.selectedTimezone, 
						tzObj.selectedRegion);
				});
			});

			if (tzObj.selectedRegion > 0) {
				tzObj.regSelect.val(tzObj.selectedRegion);
				tzObj.regSelect.change();

				tzObj.regSelect.focus(function () {
					tzObj.elem.find(".tz_timezone_select+div").trigger('mousedown');				
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
    onRegionSelect : function() {},
    onTimezoneSelect : function() {}
};

})(jQuery);