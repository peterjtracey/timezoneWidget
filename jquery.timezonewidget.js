/*
jquery.timezonewidget.js - 2.1 - 11/29/2018
LGPL license
https://github.com/peterjtracey/timezoneWidget
*/
(function ($) {

$.fn.timezoneWidget = function (options) {
  var opts = $.extend( {}, 
  	$.fn.timezoneWidget.defaults, 
  	options );

  if (typeof opts.data == "string") {
  	opts.data = JSON.parse(opts.data);
  }

  opts.tz = opts.data;

 	var tzObj = {
		elem: null,
		tz: [],
		timers: [],
		regions: [],
		timezones: [],
		regSelect: null,
		tzSelect: null,
		selectedRegion: -1,
		selectedTimezone: '',
		lastSelectedTimezone: '',
		userSelectedTimezone: true,
		translateElem: function (trans) {
			var date = trans.data("tzwdate");
			opts.debug(date);
			if (date && date.length > 0) {
				date = moment(date + "-00:00");
			} else {
				date = moment(new Date());
			}
			opts.debug(date);
			var format = trans.data("tzwformat");
			trans.text(
				moment.tz(
					date, 
					tzObj.selectedTimezone
					).format(
					format
					)
				);
			var track = trans.data('tzwtrack');
			if (track &&
				  parseInt(track) > 0) {
				var alreadyTracked = trans.data('tzwtracked');
				if (!alreadyTracked) { 
					var trackElem = trans;
					var startVal = track;
					track = parseInt(track);
					trans.data('tzwtracked', 1);
					// so that times update when 
					// os clock changes
					var tmpTimer = window.setTimeout(function () {
						tzObj.timers[tzObj.timers.length] = 
							tzObj.translateElem(trans);
							window.setInterval(function () {
								console.log("TRACK");
								tzObj.translateElem(trans);
								startVal += track;
							},
								track * 1000);
					}, (60 - (new Date()).getSeconds()) * 1000);
				}
			}
		},
		stopTrack: function () {
			$.each(this.timers, function (i, timer) {
				window.clearInterval(timer);
			});
		},
		translateTimes: function () {
			$("." + opts.translateClass).each(function () {
				var trans = $(this);
				tzObj.translateElem(trans);
			});
		},
		init: function () {
			var cookie = false;
			if (opts.loadCookie) {
				var cookie = Cookies.getJSON(opts.cookieName);
				opts.debug("COOKIE");
				opts.debug(cookie);
			}
			// cookie trumps everything
			// UNLESS it came from guessing
			// the users timezone
			if (cookie && cookie.auto == 0) { 
				tzObj.selectedTimezone = cookie.tz;
				tzObj.selectedRegion = cookie.region;
			} else {
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
									if (found) {
										tzObj.userSelectedTimezone = false;
										return false;
									}
								});
							} else {
								if (opts.defaultRegion) {
									tzObj.selectedRegion = opts.defaultRegion;
								}
							}
						}
					} else {
	  				// should load autoguessed cookie here?
						if (opts.defaultRegion) {
							tzObj.selectedRegion = opts.defaultRegion;
						}
					}
				}
			}
			if (opts.toggleElem) {
				var shown = false;
				$(opts.toggleElem).click(function () {
					if (shown) {
						shown = false;
					} else {
						opts.debug("SHOWING");
						// not sure if all this is somewhat
						// a bug where chosen isn't happy
						// initializing if not shown
						if (tzObj.selectedRegion > 0) {
						opts.debug("SHOWINGselectedRegion");
							tzObj.regSelect.val(tzObj.selectedRegion);
							tzObj.regSelect.trigger('change');
							tzObj.elem.find("div.chosen-container-single").css("width", "100%");
						}
						shown = true;
					}
				});
			}
		},
		tzSelected: function () {
			if (opts.toggleElem) {
				$(opts.toggleElem).find(".tzw-text").text(
						tzObj.tzSelect.find("option:selected").text().replace(/UTC([\+\-])0/, "$1")
						);
			}
			if (opts.translateClass) {
				tzObj.translateTimes();
			}
			if (opts.storeCookie) {
				var cookieObj = {
					'region': tzObj.selectedRegion,
					'tz': tzObj.selectedTimezone,
					'auto': !tzObj.userSelectedTimezone
				};
				Cookies.set(
					opts.cookieName, 
					cookieObj
						);
			}
		},
		draw: function () {
			tzObj.elem.append($("<form/>"));
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

			tzObj.elem.find('form').append(tzObj.regSelect);
			tzObj.elem.find('form').append($("<div/>").addClass("tz_timezone_container"));

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
					console.log("change111");
					if (tzObj.lastSelectedTimezone == $(this).val()) {
						return;
					}
					tzObj.lastSelectedTimezone = tzObj.selectedTimezone = $(this).val();
					$("#" + opts.tzField).val(tzObj.selectedTimezone);
					$("#" + opts.regionField).val(tzObj.selectedRegion);
					tzObj.tzSelected();
					opts.onTimezoneSelect(
						tzObj.selectedRegion, 
						tzObj.selectedTimezone,
						!tzObj.userSelectedTimezone
						);
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
			opts.debug("REGION????" + tzObj.selectedRegion);
			if (tzObj.selectedRegion > 0) {
				tzObj.regSelect.val(tzObj.selectedRegion);
				tzObj.regSelect.trigger('change');
			}
			tzObj.tzSelect.trigger('change');
		},
		findOffset: function (region, offset) {
			opts.debug("FIND OFFSET");
			var found = false;
			$.each(region.timezones, function (key, itTimezone) {
				$.each(itTimezone.labels, function (key, itLabel) {
					if (itTimezone.offsetLabel.indexOf(offset) != -1) {
						tzObj.selectedRegion = region.id;
						tzObj.selectedTimezone = itLabel;
						opts.debug("GUESSED TIMEZONE");
						found = true;
						return false; // break each
					}
				});
				if (found) return false; // break each
			});
			return found;
		},
		getZones: function (callback) {
			$.each(opts.tz, function (key, itRegion) {
				if (itRegion.id == tzObj.selectedRegion) {
					$.each(itRegion.timezones, function (key, itTimezone) {
						$.each(itTimezone.labels, function (key, itLabel) {
							callback(itLabel, itTimezone.offsetLabel);
							return false;
						});
					});
					return false; // not found but region is unique so exit
				}
			});
		}
	} 

	tzObj.elem = this;

	this.addClass('tzwidget');

	tzObj.init();

	opts.onInit(tzObj);

	tzObj.draw();
	
	
	return this;
};

$.fn.timezoneWidget.defaults = {
	// load from server or
	// included js file
	data: null,
	// text field ID attributes
	//  to load values
	//  from and save values to  
	regionField: 'tz_region',
	tzField: 'timezone',
	// special region for US,
	// or set to desired default
	defaultRegion: 1024,
	// auto-select user timezone based
	// on local machine time
	guessUserTimezone: false,
	// passes api-ish object
  onInit : $.noop,
	// passes region
  onRegionSelect : $.noop,
  // passes region, timezone, and
  // whether auto-selected
  onTimezoneSelect : $.noop,
  // placeholder for right-side select
  langSelectTZ : "Select a timezone...",
  // display as widget, dropdown ID to
  // pop-over selection UI
	toggleElem: null,
	// see docs...
	translateClass: null,
	// persist selected value in browser
	cookieName: 'jqtzw-selectedtimezone',
	storeCookie: false,
	loadCookie: false,
	// set to console.log passed value
	// for useful info for modifications 
	debug: $.noop
	/*function (val) {
		console.log(val);
	}*/
};

})(jQuery);