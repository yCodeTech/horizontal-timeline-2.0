/* --------------------------------

Horizontal Timeline 2.0
by Studocwho @ yCodeTech

Version: 2.0.5.2

Original Horizontal Timeline by CodyHouse

Licensed under the MIT license

Docs at http://horizontal-timeline.ycodetech.co.uk

-------------------------------- */


// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ( $, window, document, undefined ) {

	// undefined is used here as the undefined global
	// variable in ECMAScript 3 and is mutable (i.e. it can
	// be changed by someone else). undefined isn't really
	// being passed in so we can ensure that its value is
	// truly undefined. In ES5, undefined can no longer be
	// modified.

	// window and document are passed through as local
	// variables rather than as globals, because this (slightly)
	// quickens the resolution process and can be more
	// efficiently minified (especially when both are
	// regularly referenced in your plugin).

	// Create the defaults once
	var pluginName = 'horizontalTimeline',
		defaults = {
			// ! Deprecate these individual options in favour of the object options. //

			desktopDateIntervals: 200,   //************\\
			tabletDateIntervals: 150,   // Minimum: 120 \\
			mobileDateIntervals: 120,  //****************\\
			minimalFirstDateInterval: true,

			// ! End Deprecated options //

			/* New object options... */
			// If the deprecated single options exist in the user options, then use them,
			// otherwise default to the new object options.

			// Can not use in conjunction with the single options...
			// If both single and object options are set in the options, the object will take precedence.

			dateIntervals: {
				"desktop": 200,   //************\\
				"tablet": 150,   // Minimum: 120 \\
				"mobile": 120,  //****************\\
				"minimal": true
			},

			/* End new object options */

			dateDisplay: "dateTime", // dateTime, date, time, dayMonth, monthYear, year
			dateOrder: "normal", // normal, reverse

			autoplay: false,
			autoplaySpeed: 8, // Sec
			autoplayPause_onHover: false,

			useScrollWheel: false,
			useTouchSwipe: true,
			useKeyboardKeys: false,
			addRequiredFile: true,
			useFontAwesomeIcons: true,
			useNavBtns: true,
			useScrollBtns: true,

			// ! Deprecate these individual options in favour of the object options. //

			iconBaseClass: "fas fa-3x", // Space separated class names
			scrollLeft_iconClass: "fa-chevron-circle-left",
			scrollRight_iconClass: "fa-chevron-circle-right",
			prev_iconClass: "fa-arrow-circle-left",
			next_iconClass: "fa-arrow-circle-right",
			pause_iconClass: "fa-pause-circle",
			play_iconClass: "fa-play-circle",

			animation_baseClass: "animationSpeed", // Space separated class names
			enter_animationClass: {
				"left": "enter-left",
				"right": "enter-right"
			},
			exit_animationClass: {
				"left": "exit-left",
				"right": "exit-right"
			},

			// ! End Deprecated options //

			/* New object options... */
			// If the deprecated single options exist in the user options, then use them,
			// otherwise default to the new object options.

			// Can not use in conjunction with the single options...
			// If both single and object options are set in the options, the object will take precedence.

			iconClass: {
				"base": "fas fa-3x", // Space separated class names
				"scrollLeft": "fa-chevron-circle-left",
				"scrollRight": "fa-chevron-circle-right",
				"prev": "fa-arrow-circle-left",
				"next": "fa-arrow-circle-right",
				"pause": "fa-pause-circle",
				"play": "fa-play-circle"
			},
			animationClass: {
				"base": "animationSpeed", // Space separated class names,
				"enter": {
					"left": "enter-left",
					"right": "enter-right"
				},
				"exit": {
					"left": "exit-left",
					"right": "exit-right"
				}
			}
			/* End new object options */
		};

	// The actual plugin constructor
	function Timeline( element, options ) {
		this.element = element;

		// jQuery has an extend method that merges the
		// contents of two or more objects, storing the
		// result in the first object. The first object
		// is generally empty because we don't want to alter
		// the default options for future instances of the plugin
		// (deep recursive copy for nested objects, empty object, the defaults object, the options object)
		this.settings = $.extend(true, {}, defaults, options);

		this._defaults = defaults;
		this._options = (options != undefined)? options : "Nothing overridden";
		this._name = pluginName;
		this.$element = $(element);

		this.init();
	}
	Timeline.prototype = {
		init: function () {
			// You already have access to the DOM element and
			// the options via the instance, e.g. this.element
			// and this.settings
			var dataAttribute = this._eventContentListData(),
			    contentList = this.$element.find('li['+ dataAttribute +']');
			if(contentList.length == 0) {
				var text = "There are no events at this point in time. Please add some content.";

				this.$element.css('opacity', 1).append('<h3>'+ text +'</h3>');
				throw new Error(text);
			}
			
			if (this.settings.useFontAwesomeIcons == true) {
				var url = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.min.css";

				// Function to load the file
				// (url, type)
				this._addFile(url, 'css');
			}
			this._create();

			// Wait about 300s to make sure the all elements are created properly.
			// Otherwise the width of the timeline would report as bigger than it actually is.
			window.setTimeout($.proxy(function(){
				var timelineTotalWidth,
					timelineComponents = {};

				this._addIdsAndClasses(timelineComponents);

				this._timelineComponents(timelineComponents);

				//** Select the correct event **//

				// If any events-content has .selected class...
				if (timelineComponents['eventsContentList'].hasClass('selected')) {
						// Get date from data-attribute
						var date = this._timelineData(timelineComponents['eventsContentSelected'], "date"),
							// Find the event date matching the date
							selectedDate = timelineComponents['eventsWrapper'].find("a").filter($.proxy(function(index, element) {
								var data = this._timelineData($(element), "date");
								if (data == date) return $(element);
							}, this));

					// Add .selected class to the matched element
					selectedDate.addClass('selected');
					// Update all previous dates for styling.
					this._updateOlderEvents(selectedDate);
				}
				// If no class found at all...
				else {
					// If dateOrder is normal (Ascending)... start from the left.
					if (this.settings.dateOrder == "normal") {
						// Add .selected class to the first event.
						timelineComponents['eventsWrapper'].find('a.first').addClass('selected');

							// Find the selected event
						var selectedEvent = timelineComponents['eventsWrapper'].find('a.selected'),
							// Get the selected event's date.
							selectedDate = this._timelineData(selectedEvent, "date");

						// Find the selected event's content using the date and add selected class to the content.
						timelineComponents['eventsContentList'].filter($.proxy(function(index, element) {
							var data = this._timelineData($(element), "date");
							if (data == selectedDate) $(element).addClass('selected');
						}, this));
					}
					// Else dateOrder is reverse (Descending)... start from the right.
					else if (this.settings.dateOrder == "reverse") {
						// Add .selected class to the last event.
						timelineComponents['eventsWrapper'].find('a.last').addClass('selected');

							// Find the selected event
						var selectedEvent = timelineComponents['eventsWrapper'].find('a.selected'),
							// Get the selected event's date.
							selectedDate = this._timelineData(selectedEvent, "date");

						// Find the selected event's content using the date and add selected class to the content.
						timelineComponents['eventsContentList'].filter($.proxy(function(index, element) {
							var data = this._timelineData($(element), "date");
							if (data == selectedDate) $(element).addClass('selected');
						}, this));


						this._updateOlderEvents(selectedEvent);
					}
				}

				// Assign a left postion to the single events along the timeline
				this._setDatePosition(timelineComponents);
				// Assign a width to the timeline
				timelineTotalWidth = this._setTimelineWidth(timelineComponents);
				// Set the filling line to the selected event
				this._updateFilling(timelineComponents['eventsWrapper']
					.find('a.selected'), timelineComponents['fillingLine'], timelineTotalWidth);
				// The timeline has been initialised - show it
				this.$element.addClass('loaded');
				
				/* Custom namespaced event: initialised with the data passed to the event as the instance and timelineSelector (jQuery object). */
				this.$element.trigger({
					type: "initialised."+this._name,
					instance: this,
					timelineSelector: this.$element
				});

				this._setup(this, timelineComponents, timelineTotalWidth);
			}, this), 300);

		}, // End init function

		_addIdsAndClasses: function (timelineComponents) {
			//** Adding IDs and Classes **//
			this._timelineComponents(timelineComponents);

			if (timelineComponents['eventsContentList'].length == 1) {
				timelineComponents['eventsContentList'].first().attr('id', 'first');
				timelineComponents['timelineEvents'].first().addClass("first");
			}
			else {
				// Check if the deprecated single options are defined in the user options, if they are use them,
				// otherwise use the new object options.

				// A variable to include in an if statement that queries if the single option is defined 
				// AND the object option is also defined.
				var bothDefined = (this._options.animation_baseClass != undefined && this._options.animationClass != undefined),

					// If single option are undefined OR both single and object options are defined
					// then default to the object options, otherwise use the deprecated single option.
					animationObj = (this._options.animation_baseClass == undefined || bothDefined) ? this.settings.animationClass : this.settings,

					// If animationObj equals the object options...
					animationBase = (animationObj == this.settings.animationClass) ? animationObj.base : animationObj.animation_baseClass;

				// Adds id to the first and last li of the event-content list respectively.
				timelineComponents['eventsContentList'].addClass(animationBase)
					.first().attr('id', 'first').end()
					.last().attr('id', 'last');

				// Adds class to the first and last timeline event dates respectively.
				timelineComponents['timelineEvents']
					.first().addClass("first").end()
					.last().addClass("last");
			}
		}, // End _addIdsAndClasses

		/* Dynamically creates the timeline according to the amount of events. */
		_create: function () {
			var timelineHTML = "",

				// All buttons uses Font Awesome for the icons
				// Icons require Font Awesome CSS
				// The CSS file has been added to the document if not already present.

				// Check if the deprecated single options are defined in the user options, if they are use them,
				// otherwise use the new object options.

				// Set the single options into an array to check against.
				optionArray = [this._options.iconBaseClass, 
					this._options.scrollLeft_iconClass, 
					this._options.scrollRight_iconClass, 
					this._options.prev_iconClass, 
					this._options.next_iconClass, 
					this._options.pause_iconClass],

				// A variable to include in an if statement that queries if the single options are undefined.
				singleUndefined = (optionArray[0] == undefined 
					&& optionArray[1] == undefined 
					&& optionArray[2] == undefined 
					&& optionArray[3] == undefined 
					&& optionArray[4] == undefined 
					&& optionArray[5] == undefined),

				// A variable to include in an if statement that queries if the single option is defined 
				// AND the object option is also defined.
				bothDefined = (optionArray[0] != undefined && this._options.iconClass != undefined)
					|| (optionArray[1] != undefined && this._options.iconClass != undefined) 
					|| (optionArray[2] != undefined && this._options.iconClass != undefined)
					|| (optionArray[3] != undefined && this._options.iconClass != undefined)
					|| (optionArray[4] != undefined && this._options.iconClass != undefined)
					|| (optionArray[5] != undefined && this._options.iconClass != undefined),

				// If single option are undefined OR both single and object options are defined
				// then default to the object options, otherwise use the deprecated single option.
				iconClass = (singleUndefined || bothDefined) ? this.settings.iconClass : this.settings,

				// If iconClass equals the object options...
				
				iconBase = (iconClass == this.settings.iconClass) ? iconClass.base : iconClass.iconBaseClass,

				iconScrollLeft = (iconClass == this.settings.iconClass) ? iconClass.scrollLeft : iconClass.scrollLeft_iconClass,
				
				iconScrollRight = (iconClass == this.settings.iconClass) ? iconClass.scrollRight : iconClass.scrollRight_iconClass,
				
				iconPrev = (iconClass == this.settings.iconClass) ? iconClass.prev : iconClass.prev_iconClass,
				
				iconNext = (iconClass == this.settings.iconClass) ? iconClass.next : iconClass.next_iconClass,
				
				iconPause = (iconClass == this.settings.iconClass) ? iconClass.pause : iconClass.pause_iconClass,

				// Left Nav
				$scrollLeftButton = '<a href="" class="'+ iconBase +' '+ iconScrollLeft +' scroll-left inactive"></a>',
				$prevButton = '<a href="" class="'+ iconBase +' '+ iconPrev +' prev inactive"></a>',

				// Right Nav
				$nextButton = '<a href="" class="'+ iconBase +' '+ iconNext +' next"></a>',
				$scrollRightButton = '<a href="" class="'+ iconBase +' '+ iconScrollRight +' scroll-right"></a>',

				// Pause button
				$pauseButton = '<a href="" class="'+ iconBase +' '+ iconPause +' pause"></a>';

			//** Create the timeline HTML **//

			timelineHTML += '<div class="timeline">';

			if (this.settings.useNavBtns == true || this.settings.useScrollBtns == true) {
				// Add the left nav.
				timelineHTML += '<div class="timeline-navigation" id="leftNav">'

				if (this.settings.useNavBtns == false && this.settings.useScrollBtns == true)
					// Add the scroll left button.
					timelineHTML += $scrollLeftButton;

				else if (this.settings.useNavBtns == true && this.settings.useScrollBtns == false)
					// Add the prev button.
					timelineHTML += $prevButton;

				else if (this.settings.useNavBtns == true && this.settings.useScrollBtns == true)
					// Add the scroll left button and the prev button.
					timelineHTML += $scrollLeftButton + $prevButton;

				timelineHTML += '</div>'

					+'<div class="events-wrapper"><div class="events"><span class="filling-line" aria-hidden="true"></span></div></div>'
					
					// Add the right nav.
					+'<div class="timeline-navigation" id="rightNav">';

				if (this.settings.useNavBtns == false && this.settings.useScrollBtns == true)
					// Add the scroll right button.
					timelineHTML += $scrollRightButton;

				else if (this.settings.useNavBtns == true && this.settings.useScrollBtns == false)
					// Add the next button.
					timelineHTML += $nextButton;

				else if (this.settings.useNavBtns == true && this.settings.useScrollBtns == true)
					// Add the next button and the scroll right button.
					timelineHTML += $nextButton + $scrollRightButton;

				timelineHTML += '</div>';
			}
			else {
				timelineHTML += '<div class="events-wrapper" style="min-width: 100%"><div class="events"><span class="filling-line" aria-hidden="true"></span></div></div>';
			}
			if (this.settings.autoplay == true)
				timelineHTML += '<div class="timeline-navigation" id="pausePlay">'
					+ $pauseButton
					+'</div>';

			timelineHTML +='</div>';

			// Prepend the timeline HTML to the element (before the event content).
			this.$element.prepend(timelineHTML);

			//** Create the HTML for the event date display **//
			this._createDate(this, 'append');

		}, // End create() function

		// (instance, insertMethod (append, before, after [last 2 for addEvent method]), date to insert before/after [from addEvent method])
		_createDate: function (self, insertMethod, arrangementDate) {
			var dataAttribute = this._eventContentListData();

			// If dateOrder is normal (starting from the left).
			if (self.settings.dateOrder == "normal") {
				// Find the event content.
				var $element = self.$element.children('.events-content').find('li['+ dataAttribute +']');
			}
			// Else if dateOrder is reverse (starting from the right).
			else if (self.settings.dateOrder == "reverse") {
				var $element = $(self.$element.children('.events-content').find('li['+ dataAttribute +']').get().reverse());
			}

			/* dateTime = the date and time */
			if(self.settings.dateDisplay == "dateTime") {
				$element.each(function() {
					self._eventDateDisplay(self, $(this), "dateTime", insertMethod, arrangementDate);
				});
			}
			/* date = the date only */
			else if (self.settings.dateDisplay == "date") {
				$element.each(function() {
					self._eventDateDisplay(self, $(this), "date", insertMethod, arrangementDate);
				});
			}
			/* time = the time only */
			else if (self.settings.dateDisplay == "time") {
				$element.each(function() {
					self._eventDateDisplay(self, $(this), "time", insertMethod, arrangementDate);
				});
			}
			/* dayMonth = the day and monthName only */
			else if (self.settings.dateDisplay == "dayMonth") {
				$element.each(function() {
					self._eventDateDisplay(self, $(this), "dayMonth", insertMethod, arrangementDate);
				});
			}
			/* monthYear = the monthName and year only */
			else if (self.settings.dateDisplay == "monthYear") {
				$element.each(function() {
					self._eventDateDisplay(self, $(this), "monthYear", insertMethod, arrangementDate);
				});
			}
			/* year = the year only */
			else if (self.settings.dateDisplay == "year") {
				$element.each(function() {
					self._eventDateDisplay(self, $(this), "year", insertMethod, arrangementDate);
				});
			}
		},// End _createDate

		/* Function to create the event date display
		(instance, element, displayType, insertMethod (append, before, after [last 2 for addEvent method]), date to insert before/after [from addEvent method])*/
		_eventDateDisplay: function (self, eventElement, display, insertMethod, arrangementDate) {
				// Get date from data-attribute
			var dataDate = self._timelineData(eventElement, "date"),
				// Check if element data-date format is DD/MM/YYYYTHH:MM by checking for 'T'
				isDateTime = dataDate.includes("T"),
				// Check if element data-date format is HH:MM by checking for ':' but doesn't have 'T'
				isTime = !isDateTime && dataDate.includes(":"),
				// Display type checks
				dateTimeDisplay = display == "dateTime",
				dateDisplay = display == "date",
				timeDisplay = display == "time",
				dayMonthDisplay = display == "dayMonth",
				monthYearDisplay = display == "monthYear",
				yearDisplay = display == "year",
				// Find .events for the date display
				$eventDateDisplay = self.$element.find('.events'),
				dateLink = '<a href="" data-horizontal-timeline=\'{"date": "'+ dataDate +'"}\'>';

				// For use with the addEvent public method.
				// If arrangementDate isn't undefined or null...
				if(typeof arrangementDate != 'undefined' || arrangementDate != null) {
					// Finds the event with the specific date.
					var $arrangementEvent = $eventDateDisplay.find("a").filter(function() {
						var data = self._timelineData($(this), "date");
						if (data == arrangementDate) return $(this);
					});
				}

			// Function to add the number suffix st, nd, rd, th (eg: 1st, 2nd, 3rd, 4th)
			// Part of answer on StackOverflow: https://stackoverflow.com/a/15397495/2358222
			function numSuffix(num) {
				if (num > 3 && num < 21) return 'th';
				switch (num % 10) {
					case 1:  return "st";
					case 2:  return "nd";
					case 3:  return "rd";
					default: return "th";
				}
			}
			// Function to get the month name according to a number supplied.
			// Answer on StackOverflow: https://stackoverflow.com/a/10996297/2358222
			function getMonthName(num) {
				// Create an array of the months, with the index 0 = null,
				// so that we can get the month by its corresponding index number.
				var monthNames = [null, "January", "February", "March", "April", "May", "June",
								"July", "August", "September", "October", "November", "December" ];
				return monthNames[num];
			}

			var dateExists = $eventDateDisplay.children('a').map(function() {
					if ($(this).data('horizontal-timeline')) {
						var data = $(this).data('horizontal-timeline');

						return data.date;
					}
					// data-date deprecated as of v2.0.5.alpha.3
					// and will be removed in a later major version.
					else {
						var dataDate = $(this).data('date');

						return dataDate;
					}
				}).get();

			if(jQuery.inArray(dataDate, dateExists) == -1) {
				// Date and Time format (DD/MM/YYYYTHH:MM)
				if (isDateTime){
						// Separate the date at point of T, to get individually date and time
					var dateSplit = dataDate.split('T'),
						// Date
						date = dateSplit[0],
						// Time
						time = dateSplit[1],
						// Separate the date at point of /, to get individual date parts
						dateParts = date.split('/'),
						// Remove the leading 0 (zero) from the day
						dayPart = dateParts[0].replace(/^0+/, ''),
						// Remove the leading 0 (zero) from the month
						monthPart = dateParts[1].replace(/^0+/, ''),
						yearPart = dateParts[2];

					/* Add the event date displays according to the display types */

					// Custom Date Display

					// Get the custom text from the data-attribute object.
					var customDisplay = self._timelineData(eventElement, "customDisplay");

					// If customDisplay is defined in the data-attribute object...
					if(typeof customDisplay !== 'undefined') {


						// Add in the custom Text depending on which insertMethod used.
						if (insertMethod == 'append') $eventDateDisplay.append(dateLink + customDisplay +'</a>');
						// For use with the addEvent method... creates new timeline events and places them where specified.
						else if (insertMethod == 'after') $arrangementEvent.after(dateLink + customDisplay +'</a>');
						else $arrangementEvent.before(dateLink + customDisplay +'</a>');
					}

					else if(dateTimeDisplay) {
						if (insertMethod == 'append') $eventDateDisplay.append(dateLink + date +'<br>'+ time +'</a>');
						// For use with the addEvent method... creates new timeline events and places them where specified.
						else if (insertMethod == 'after') $arrangementEvent.after(dateLink + date +'<br>'+ time +'</a>');
						else $arrangementEvent.before(dateLink + date +'<br>'+ time +'</a>');
					}
					else if(dateDisplay) {
						if (insertMethod == 'append') $eventDateDisplay.append(dateLink + date +'</a>');
						// For use with the addEvent method... creates new timeline events and places them where specified.
						else if (insertMethod == 'after') $arrangementEvent.after(dateLink + date +'</a>');
						else $arrangementEvent.before(dateLink + date +'</a>');
					}
					else if(timeDisplay) {
						if (insertMethod == 'append') $eventDateDisplay.append(dateLink + time +'</a>');
						// For use with the addEvent method... creates new timeline events and places them where specified.
						else if (insertMethod == 'after') $arrangementEvent.after(dateLink + time +'</a>');
						else $arrangementEvent.before(dateLink + time +'</a>');
					}
					else if(dayMonthDisplay) {
						if (insertMethod == 'append') $eventDateDisplay.append(dateLink + dayPart + numSuffix(dayPart) + '<br>' + getMonthName(monthPart) +'</a>');
						// For use with the addEvent method... creates new timeline events and places them where specified.
						else if (insertMethod == 'after') $arrangementEvent.after(dateLink + dayPart + numSuffix(dayPart) + '<br>' + getMonthName(monthPart) +'</a>');
						else $arrangementEvent.before(dateLink + dayPart + numSuffix(dayPart) + '<br>' + getMonthName(monthPart) +'</a>');
					}
					else if(monthYearDisplay) {
						if (insertMethod == 'append') $eventDateDisplay.append(dateLink + getMonthName(monthPart) + '<br>' + yearPart +'</a>');
						// For use with the addEvent method... creates new timeline events and places them where specified.
						else if (insertMethod == 'after') $arrangementEvent.after(dateLink + getMonthName(monthPart) + '<br>' + yearPart +'</a>');
						else $arrangementEvent.before(dateLink + getMonthName(monthPart) + '<br>' + yearPart +'</a>');
					}
					else if(yearDisplay) {
						if (insertMethod == 'append') $eventDateDisplay.append(dateLink + yearPart +'</a>');
						// For use with the addEvent method... creates new timeline events and places them where specified.
						else if (insertMethod == 'after') $arrangementEvent.after(dateLink + yearPart +'</a>');
						else $arrangementEvent.before(dateLink + yearPart +'</a>');
					}
				}
				// Time format (HH:MM)
				else if (isTime) {
					var time = dataDate;
					/* Add the event date displays according to the display types */

					// Custom Date Display

					// Get the custom text from the data-attribute object.
					var customDisplay = self._timelineData(eventElement, "customDisplay");

					// If customDisplay is defined in the data-attribute object...
					if(typeof customDisplay !== 'undefined') {

						// Add in the custom Text depending on which insertMethod used.
						if (insertMethod == 'append') $eventDateDisplay.append(dateLink + customDisplay +'</a>');
						// For use with the addEvent method... creates new timeline events and places them where specified.
						else if (insertMethod == 'after') $arrangementEvent.after(dateLink + customDisplay +'</a>');
						else $arrangementEvent.before(dateLink + customDisplay +'</a>');
					}

					else if(dateTimeDisplay || timeDisplay) {
						if (insertMethod == 'append') $eventDateDisplay.append(dateLink + time +'</a>');
						// For use with the addEvent method... creates new timeline events and places them where specified.
						else if (insertMethod == 'after') $arrangementEvent.after(dateLink + time +'</a>');
						else $arrangementEvent.before(dateLink + time +'</a>');
					}
				}
				// Date format (DD/MM/YYYY)
				else {
					var date = dataDate,
						// Separate the date at point of /, to get individual date parts
						dateParts = date.split('/'),
						// Remove the leading 0 (zero) from the day
						dayPart = dateParts[0].replace(/^0+/, ''),
						// Remove the leading 0 (zero) from the month
						monthPart = dateParts[1].replace(/^0+/, ''),
						yearPart = dateParts[2];

					/* Add the event date displays according to the display types */

					// Custom Date Display

					// Get the custom text from the data-attribute object.
					var customDisplay = self._timelineData(eventElement, "customDisplay");

					// If customDisplay is defined in the data-attribute object...
					if(typeof customDisplay !== 'undefined') {

						// Add in the custom Text depending on which insertMethod used.
						if (insertMethod == 'append') $eventDateDisplay.append(dateLink + customDisplay +'</a>');
						// For use with the addEvent method... creates new timeline events and places them where specified.
						else if (insertMethod == 'after') $arrangementEvent.after(dateLink + customDisplay +'</a>');
						else $arrangementEvent.before(dateLink + customDisplay +'</a>');
					}

					else if(dateTimeDisplay || dateDisplay) {
						if (insertMethod == 'append') $eventDateDisplay.append(dateLink + date +'</a>');
						// For use with the addEvent method... creates new timeline events and places them where specified.
						else if (insertMethod == 'after') $arrangementEvent.after(dateLink + date +'</a>');
						else $arrangementEvent.before(dateLink + date +'</a>');
					}
					else if(dayMonthDisplay) {
						if (insertMethod == 'append') $eventDateDisplay.append(dateLink + dayPart + numSuffix(dayPart) + '<br>' + getMonthName(monthPart) +'</a>');
						// For use with the addEvent method... creates new timeline events and places them where specified.
						else if (insertMethod == 'after') $arrangementEvent.after(dateLink + dayPart + numSuffix(dayPart) + '<br>' + getMonthName(monthPart) +'</a>');
						else $arrangementEvent.before(dateLink + dayPart + numSuffix(dayPart) + '<br>' + getMonthName(monthPart) +'</a>');
					}
					else if(monthYearDisplay) {
						if (insertMethod == 'append') $eventDateDisplay.append(dateLink + getMonthName(monthPart) + '<br>' + yearPart +'</a>');
						// For use with the addEvent method... creates new timeline events and places them where specified.
						else if (insertMethod == 'after') $arrangementEvent.after(dateLink + getMonthName(monthPart) + '<br>' + yearPart +'</a>');
						else $arrangementEvent.before(dateLink + getMonthName(monthPart) + '<br>' + yearPart +'</a>');
					}
					else if(yearDisplay) {
						if (insertMethod == 'append') $eventDateDisplay.append(dateLink + yearPart +'</a>');
						// For use with the addEvent method... creates new timeline events and places them where specified.
						else if (insertMethod == 'after') $arrangementEvent.after(dateLink + yearPart +'</a>');
						else $arrangementEvent.before(dateLink + yearPart +'</a>');
					}
				} // End else
			} // End inArray
		}, // End eventDateDisplay() function

		_timelineComponents: function (timelineComponents) {
			var dataAttribute = this._eventContentListData();
			// Cache timeline components
			timelineComponents['eventsContent'] = this.$element.children('.events-content');
			timelineComponents['eventsContentList'] = timelineComponents['eventsContent'].find('li['+ dataAttribute +']');
			timelineComponents['eventsContentSelected'] = timelineComponents['eventsContent'].find('li['+ dataAttribute +'].selected');

			timelineComponents['timelineWrapper'] = timelineComponents['eventsContent'].parent().find('.events-wrapper');
			timelineComponents['eventsWrapper'] = timelineComponents['timelineWrapper'].children('.events');
			timelineComponents['fillingLine'] = timelineComponents['eventsWrapper'].children('.filling-line');
			timelineComponents['timelineEvents'] = timelineComponents['eventsWrapper'].find('a');

			timelineComponents['timelineNavigation'] = timelineComponents['timelineWrapper'].siblings('.timeline-navigation');
		},

		_setup: function (self, timelineComponents, timelineTotalWidth) {
			/* Debounce function for resize events */

			// Returns a function, that, as long as it continues to be invoked, will not
			// be triggered. The function will be called after it stops being called for
			// N milliseconds. If `immediate` is passed, trigger the function on the
			// leading edge, instead of the trailing.
			function debounce(func, wait, immediate) {
				var timeout;
				return function() {
					var context = this, args = arguments;
					var later = function() {
						timeout = null;
						if (!immediate) func.apply(context, args);
					};
					var callNow = immediate && !timeout;
					clearTimeout(timeout);
					timeout = setTimeout(later, wait);
					if (callNow) func.apply(context, args);
				};
			};

			var id = this.$element.attr('id');

			function _mobileResizeFix(event) {
				var windowWidth = this.$element.data('plugin_'+ this._name)['windowWidth'],
					newWidth = $(window).width();

				if(newWidth !== windowWidth){
					this.refresh();
				}
				this.$element.data('plugin_'+ this._name)['windowWidth'] = newWidth;
			}
			this._setup.mobileResizeFix = _mobileResizeFix;
			// On window resize, change the timeline accordingly.
			$(window).on('resize.'+this._name+'_'+id, debounce($.proxy(this._setup.mobileResizeFix, this), 250));



			//** Navigation button function **//

			// Stop click events on the .inactive buttons
			this.$element
				.on('click.'+this._name, '.timeline-navigation .inactive', function(event){
					event.stopImmediatePropagation();
					return(false);
				})
				// Button on click...
				.on('click.'+this._name, '.timeline-navigation:not(#pausePlay) a', $.proxy(function(event) {
					event.preventDefault();
					var $this = $(event.target);

					this._timelineComponents(timelineComponents);

					timelineTotalWidth = this._setTimelineWidth(timelineComponents);
					// If next button clicked, shows next content
					if($this.is('.next')) this._showNewContent(timelineComponents, timelineTotalWidth, 'next');
					// If prev button clicked shows prev content
					if($this.is('.prev')) this._showNewContent(timelineComponents, timelineTotalWidth, 'prev');
					// If scroll-right button clicked, scrolls timeline right
					if($this.is('.scroll-right')) this._updateSlide(timelineComponents, timelineTotalWidth, 'right');
					// If scroll-left button clicked, scrolls timeline left
					if($this.is('.scroll-left')) this._updateSlide(timelineComponents, timelineTotalWidth, 'left');
				}, this))
				//** Event date function **//
				// Detect click on a single event date = show new event content
				.on('click.'+this._name, '.events a', $.proxy(function(event) {
					event.preventDefault();
					var $this = $(event.target);

					this._timelineComponents(timelineComponents);
					// Remove selected class from all dates.
					this.$element.find('.events').find('a').removeClass('selected');
					// Add class to the event date clicked.
					$this.addClass('selected');
					// Update all other previous event dates for styling
					this._updateOlderEvents($this);
					// Set the timeline width.
					timelineTotalWidth = this._setTimelineWidth(timelineComponents);
					// Update the timeline width and filling line.
					this._updateFilling($this, timelineComponents['fillingLine'], timelineTotalWidth);
					// Change the event content to match the selected event.
					this._updateVisibleContent($this, timelineComponents['eventsContent']);
					// Translate (scroll) the timeline left or right according to the position of the targeted event date
					this._updateTimelinePosition($this, timelineComponents, timelineTotalWidth);
				}, this));

			//** Autoplay **//

			if (this.settings.autoplay == true){
				// Define the progress bar html
				var	$progressBar = '<div class="progressBarWrapper"><div class="progressBar"></div></div>',
					// Find and get the pause button html.
					$pauseButton = timelineComponents['timelineNavigation'].find('.pause')[0];
				// Create the progress bar.
				timelineComponents['eventsContent'].prepend($progressBar);

				// Call the autoplay function.
				this._autoplay(timelineComponents);

				// On click
				this.$element
					// On click of the element pause button, pass data to the event [pausebtnClicked, pausebtnHtml, state] and call the changeButtons function.
					.on('click.'+this._name, '.timeline-navigation .pause', [true, $pauseButton, 'paused'], $.proxy(this._autoplay.changeButtons, this))
					// On click of the element play button, pass data to the event [pausebtnClicked, pausebtnHtml, state] and call the changeButtons function.
					.on('click.'+this._name, '.timeline-navigation .play', [false, $pauseButton, 'playing'], $.proxy(this._autoplay.changeButtons, this));

				// Hover
				if (this.settings.autoplayPause_onHover == true) {
					var checkMQ = this._checkMQ();

					// Only execute hover code if device is tablet or desktop.
					if (checkMQ == 'tablet' || checkMQ == 'desktop') {
						// On hover
						this.$element
							// On mouseenter of the element events-content, pass data to the event [pausebtnClicked, pausebtnHtml, state] and call the changeButtons function.
							.on('mouseenter.'+this._name, '.events-content', [false, $pauseButton, 'paused'], $.proxy(this._autoplay.changeButtons, this))
							// On mouseleave of the element events-content, pass data to the event [pausebtnClicked, pausebtnHtml, state] and call the changeButtons function.
							.on('mouseleave.'+this._name, '.events-content', [false, $pauseButton, 'playing'], $.proxy(this._autoplay.changeButtons, this));
					} // End checkMQ is desktop
				} // End autoplayPause_onHover this.settings



			} // End Autoplay this.settings

			//** Go-to timeline link function **//

			// Linking to a specific date of a timeline

			// Set the go-to selector in a variable
			var goToTimelineLink = $('.goto-horizontal-timeline');

			// If go-to selector exists...
			if(goToTimelineLink.length > 0) {
				// On click
				goToTimelineLink.on('click.'+this._name, gotoTimeline);

				function gotoTimeline(event) {
					// Prevent default click
					event.preventDefault();
					// Prevent every instance of the plugin from firing the function, and concentrate on just the one.
					event.stopImmediatePropagation();
						// Reference the button
					var	$this = $(event.target),
						// Get the go-to href value of the button as the selector
						href = $this.attr('href'),
						// A check to see if href only contains a # (by itself)...
						targetSelf = href == "#";

					// We are using a lonely # to determine if a link is targetting the timeline it sits in (itself)
					if(targetSelf) {
						// We are targeting the timeline the link is in.
							// Get the ID of the outer wrapper of the timeline, from which the link sits in
						var gotoself = '#' + $this.parents('.horizontal-timeline').attr('id');
							// Set the target variable as this timeline.
							$target = $(gotoself);
					}
					// Otherwise we're targetting another timeline.
					else var $target = $(href); // Reference the jQuery object selector only once

					// Get the correct plugin instance from the target data.
					var instanceRef = $target.data('plugin_horizontalTimeline').Timeline;

						// Get the data-gototimeline options object
					var datagoto = $this.data('gototimeline'),
						// Set empty variables
						date,
						scrollSpeed,
						scrollOffset,
						scrollEasing,

						// Get the keys from the data object
						dataDate = datagoto.date,
						dataScrollSpeed = datagoto.scrollspeed,
						dataScrollOffset = datagoto.scrolloffset,
						dataScrollEasing = datagoto.scrolleasing;

					// If the data-gototimeline attribute exists...
					if (typeof datagoto !== 'undefined') {
						// Set the date from the data object
						date = dataDate;

						// The speed, offset, and easing data options are optional,
						// so we need to check for their existence

						// If speed option exists, set the speed from the data object
						if (typeof dataScrollSpeed !== 'undefined') scrollSpeed = dataScrollSpeed;

						// If offset option exists set offset from the data object
						if (typeof dataScrollOffset !== 'undefined') scrollOffset = dataScrollOffset;

						// If easing option exists set easing from the data object
						if (typeof dataScrollEasing !== 'undefined') scrollEasing = dataScrollEasing;
					}

					// If a link is targetting the timeline it sits in (itself), then execute the public method interally to goTo the date.
					if(targetSelf) instanceRef.goTo(date, instanceRef);
					// If not, then use a smooth scroll and then execute the public method interally afterwards.
					else instanceRef.goTo(date, {smoothScroll: true, speed: scrollSpeed, offset: scrollOffset, easing: scrollEasing}, instanceRef);

				} // End gotoTimeline function
			} // End if goToTimelineLink exists

			//** Mouse wheel function **//
			// Requires the jQuery plugin mouse wheel: https://github.com/jquery/jquery-mousewheel
			// Mouse wheel support for "scrolling" the events content.
			if(this.settings.useScrollWheel == true) {
					// The URL to the plugin on CDN
				var url = "https://cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js";

				// Set a global variable to equal the function.
				this._setup.mousewheel = mousewheel;

				// Function to load the Mousewheel plugin (url, type, callback)
				this._addFile(url, 'js', $.proxy(function() {
					// Wait 300ms whilst the Mousewheel script loads
					window.setTimeout($.proxy(function() {
						this.$element.on('mousewheel.'+this._name, '.events-content', $.proxy(this._setup.mousewheel, this));
					}, this), 300); // End setTimeout function
				}, this)); // End addFile function

				/* Mousewheel function */
				function mousewheel(e, delta) {
					this._timelineComponents(timelineComponents);
					timelineTotalWidth = this._setTimelineWidth(timelineComponents);

					// Scroll Up = show previous content
					if (e.deltaY > 0) this._showNewContent(timelineComponents, timelineTotalWidth, 'prev');
					// Scroll Down = show next content
					else this._showNewContent(timelineComponents, timelineTotalWidth, 'next');
					// Prevent the normal document scroll
					e.preventDefault();
				}
			} // End scrollWheel setting


			//** TouchSwipe function **//
			// Requires the jQuery plugin TouchSwipe: http://labs.rampinteractive.co.uk/touchSwipe/demos/index.html
			// TouchSwipe has more events/options than jQuery Mobile
			if(this.settings.useTouchSwipe == true){
					// The URL to the plugin on CDN
				var url = "https://cdnjs.cloudflare.com/ajax/libs/jquery.touchswipe/1.6.18/jquery.touchSwipe.min.js";

				// Set a global variable to equal the function.
				this._setup.swipe = swipe;

				// Function to load the TouchSwipe plugin (url, type, callback)
				this._addFile(url, 'js', $.proxy(function() {
					// Wait 300ms whilst the TouchSwipe script loads
					window.setTimeout($.proxy(function() {

						// On swipe of .events-content, show next/prev event content
						timelineComponents['eventsContent'].swipe({
							// Swipe right to go left (previous)
							swipeRight:$.proxy(function(event, direction, distance, duration, fingerCount) {
								// Show previous content on swipeRight
								this._setup.swipe(this, 'prev');
							}, this),
							// Swipe left to go right (next)
							swipeLeft:$.proxy(function(event, direction, distance, duration, fingerCount) {
								// Show next content on swipeLeft
								this._setup.swipe(this, 'next');
							}, this),
							// Swipe distance... 0 = any distance in px
							threshold:75,
							preventDefaultEvents: false
						}); // End TouchSwipe Event

						/* Swipe function for the timeline wrapper*/
						// So that we can scroll the timeline with a swipe.

						timelineComponents['timelineWrapper'].swipe({
							// Swipe right to scroll the timeline left
							swipeRight:$.proxy(function(event, direction, distance, duration, fingerCount) {
									// Get the current translate value
								var translateValue = this._getTranslateValue(timelineComponents['eventsWrapper']),
									// Get the width of the timeline wrapper.
									wrapperWidth = Number(timelineComponents['timelineWrapper'].width());

								// Translate the timeline to the left (also know as scroll left)
								// according to the amount of distance swiped.
								this._translateTimeline(timelineComponents, distance + translateValue, wrapperWidth - timelineTotalWidth);
							}, this),
							// Swipe left to scroll the timeline right
							swipeLeft:$.proxy(function(event, direction, distance, duration, fingerCount) {
									// Get the current translate value
								var translateValue = this._getTranslateValue(timelineComponents['eventsWrapper']),
									// Get the width of the timeline wrapper.
									wrapperWidth = Number(timelineComponents['timelineWrapper'].width());

								// Translate the timeline to the right (also know as scroll right)
								// according to the amount of distance swiped.
								this._translateTimeline(timelineComponents, -distance + translateValue, wrapperWidth - timelineTotalWidth);
							}, this),
							// Swipe distance... 0 = any distance in px
							threshold:30,
							preventDefaultEvents: false
							}
						); // End TouchSwipe Event
					}, this), 1000); // End setTimeout function
				}, this)); // End addFile function

				// Add a touch-enabled class to the necessary elements.
				timelineComponents['timelineWrapper'].addClass('touch-enabled')
					.parent().siblings('.events-content').addClass('touch-enabled');

				/* Swipe function */
				function swipe(self, direction) {
					self._timelineComponents(timelineComponents);
					timelineTotalWidth = self._setTimelineWidth(timelineComponents);
					self._showNewContent(timelineComponents, timelineTotalWidth, direction);
				}

			} // End useTouchSwipe this.settings

			// Keyboard navigation
			if(this.settings.useKeyboardKeys == true) {

				// Set a global variable to equal the function.
				this._setup.keyboardKeys = keyboardKeys;

				var id = this.$element.attr('id');
				// On keyup
				$(document).on('keyup.'+this._name+'_'+id, $.proxy(this._setup.keyboardKeys, this));

				/* Keyboardkeys function */
				function keyboardKeys(event) {
					this._timelineComponents(timelineComponents);
					timelineTotalWidth = this._setTimelineWidth(timelineComponents);

					// If Left arrow (keyCode 37) AND the timeline is in the viewport, show prev content
					if(event.which=='37' && this._elementInViewport(this.element))
						this._showNewContent(timelineComponents, timelineTotalWidth, 'prev');
					// If Right arrow (keyCode 39) AND the timeline is in the viewport, show next content
					else if(event.which=='39' && this._elementInViewport(this.element))
						this._showNewContent(timelineComponents, timelineTotalWidth, 'next');
				}
			} // End useKeyboardKeys this.settings
		}, // End _setup() function.

		/* Autoplay function */
		_autoplay: function (timelineComponents) {
			// NOTE: if autoplay cycle is paused, clicking any timeline button
			// will not reset the autoplay cycle to play.

			var isPaused,
				tick,
				percentTime,
				current,
				autoplayTimelineTotalWidth,
				// Get the speed from the settings.
				speed = Number(this.settings.autoplaySpeed),
				// Get the button wrapper.
				$pausePlay = this.$element.find('#pausePlay');

			this._timelineComponents(timelineComponents);

			// Set a global variable to equal the function.
			this._autoplay.countEvents = countEvents;
			this._autoplay.start = start;
			this._autoplay.pause = pause;
			this._autoplay.resume = resume;
			this._autoplay.moved = moved;
			this._autoplay.changeButtons = changeButtons;
			this._autoplay.refresh = refresh;
			this._autoplay.destroy = destroy;

			// Call the start function
			this._autoplay.start(this, timelineComponents);

			// Count events function
			function countEvents() {
				// Get the total number of events to check against
				return timelineComponents['timelineEvents'].length;
			}

			// Start function
			function start(self, timelineComponents) {
				// Reset timer
				percentTime = 0;

				self._timelineComponents(timelineComponents);
				// Get the timeline width
				autoplayTimelineTotalWidth = self._setTimelineWidth(timelineComponents);
				// Run interval every 0.01 second
				tick = setInterval($.proxy(interval, self), 10);
			};
			// Interval function.
			function interval() {
				isPaused = this.$element.data('plugin_'+ this._name)['autoplay']['isPaused'];
				this._timelineComponents(timelineComponents);

				// If isPaused = false AND is in the viewport, start the autoplay cycle, otherwise pause the cycle.
				if(isPaused === false && this._elementInViewport(this.element)){
					// Set percentTime using the speed from the settings.
					// Check media queries...
					var checkMQ = this._checkMQ();
					// We need to adjust the calculations for percentTime because how slow it seems to be on mobile.
					// If mobile, set the correct speed
					if(checkMQ == 'mobile') percentTime += 3 / speed;
					// Everything else set the correct speed.
					else percentTime += 1 / speed;
					// Set the progress bar width
					this.$element.find('.progressBar').css({
						width: percentTime+"%"
					});
					// Recalculate the index of the current event, each time.
					// This is to make sure that if the user navigates to another event while playing or paused,
					// the current index will always reflect the current event,
					// otherwise autoplay may get out of sync.
					current = timelineComponents['eventsWrapper'].find('.selected').index();

					//if percentTime is equal or greater than 100
					if(percentTime >= 100){
						// If dateOrder is normal AND the current index is equal to the total number of events
						// OR dateOrder is reverse AND current index is equal to 1 ...
						if((this.settings.dateOrder == "normal" && current == this._autoplay.countEvents()) || (this.settings.dateOrder == "reverse" && current == 1)) {
							// Go back to the start of the cycle.
							this._showNewContent(timelineComponents, autoplayTimelineTotalWidth, 'start');
							// Recalculate the current index to make sure it's reset back to 1 (the start).
							current = timelineComponents['eventsWrapper'].find('.selected').index();
						}
						else {
							// If dateOrder is normal.
							if (this.settings.dateOrder == "normal") {
								// Go to next event content.
								this._showNewContent(timelineComponents, autoplayTimelineTotalWidth, 'next');
							}
							// Else if dateOrder is reverse.
							else if (this.settings.dateOrder == "reverse") {
								// Go to next event content.
								this._showNewContent(timelineComponents, autoplayTimelineTotalWidth, 'prev');
							}
						}
					}
				} // End isPaused if statement
			} // End Interval function

			// Pause function
			function pause(self) {
				self.$element.data('plugin_'+ self._name)['autoplay']['isPaused'] = true;
			}
			// Resume function
			function resume(self) {
				self.$element.data('plugin_'+ self._name)['autoplay']['isPaused'] = false;
			}
			// Moved function, when an event content has changed via autoplay or by manual navigation.
			function moved(self) {
					// Clear interval
					self._autoplay.destroy();
					// Restart the cycle.
					self._autoplay.start(self, timelineComponents);
			}
			// Change Buttons function
			function changeButtons(event) {
				event.preventDefault();
				// Get the event data
				var data = event.data,
					// Set variables using the corresponding data array selectors.
					pausebtnClicked = data[0],
					$pauseButton = data[1],
					state = data[2],
					// Find the pause play button wrapper.
					$pausePlay = this.$element.find('#pausePlay'),

					// Check if the new object options are defined in the user options, if they are use them,
					// otherwise use the deprecated single options.
					iconClass = (this._options.iconClass != undefined) ? this.settings.iconClass : this.settings,
					iconBase = (this._options.iconClass != undefined) ? iconClass.base : iconClass.iconBaseClass,
					iconPlay = (this._options.iconClass != undefined) ? iconClass.play : iconClass.play_iconClass,

					// Define the play button html
					$playButton = '<a href="" class="'+ iconBase +' '+ iconPlay +' play"></a>';

				// If the event type is click and pausebtnClicked is true (so the pause button was clicked)...
				if (event.type == "click" && pausebtnClicked == true) {
					// Add class to parent to check against it later to stop on hover from reactivating the play cycle.
					$pausePlay.addClass('clicked');
					// Set a mouseEvent data to click on the element to check against later.
					this.$element.data('plugin_'+ this._name)['autoplay']['mouseEvent'] = 'click';
					// Change the button to the play button.
					$pausePlay.html($playButton);
					// Call the pause function to pause autoplay
					this._autoplay.pause(this);
					console.log('Autoplay is '+state+'.');
				}
				// Else if the event type is click and pausebtnClicked is false (so the play button was clicked)...
				else if (event.type == "click" && !pausebtnClicked) {
					// Remove class from the parent
					$pausePlay.removeClass('clicked');
					// Set the mouseEvent data to false on the element.
					this.$element.data('plugin_'+ this._name)['autoplay']['mouseEvent'] = false;
					// Change the button to the pause button.
					$pausePlay.html($pauseButton);
					// Call the resume function to resume the autoplay cycle.
					this._autoplay.resume(this);
					console.log('Autoplay is '+state+'.');
				}
				// If the event type is mouseenter (so it's paused) and the pause play button wrapper doesn't have the clicked class (paused via the pause button)...
				if(event.type == "mouseenter" && !$pausePlay.hasClass('clicked')) {
					// Set a mouseEvent data to hover on the element to check against later.
					this.$element.data('plugin_'+ this._name)['autoplay']['mouseEvent'] = 'hover';
					// Change the button to the play button.
					$pausePlay.html($playButton);
					// Call the pause function to pause autoplay
					this._autoplay.pause(this);
					console.log('Autoplay is '+state+'.');
				}
				// Else if the event type is mouseleave (so it's playing) and the pause play button wrapper doesn't have the clicked class (paused via the pause button)...
				// To stop autoplay resuming the cycle on mouseleave if it's already paused via the pause button.
				else if(event.type == "mouseleave" && !$pausePlay.hasClass('clicked')) {
					// Set the mouseEvent data to false on the element.
					this.$element.data('plugin_'+ this._name)['autoplay']['mouseEvent'] = false;
					// Change the button to the pause button.
					$pausePlay.html($pauseButton);
					// Call the resume function to resume the autoplay cycle.
					this._autoplay.resume(this);
					console.log('Autoplay is '+state+'.');
				}
			} // End changeButtons function
			// Refresh function
			function refresh(self) {
				self._timelineComponents(timelineComponents);
				autoplayTimelineTotalWidth = self._setTimelineWidth(timelineComponents);
			}
			// Destroy function, to destroy the autoplay interval.
			function destroy() {
				clearInterval(tick);
			}
		}, // End autoplay function

		/* Get data from the data-attribute object */
		_timelineData: function (element, type) {
			if (element.data('horizontal-timeline')) {
				var data = element.data('horizontal-timeline');

				if(type == "date") return data.date;
				else if(type == "customDisplay") return data.customDisplay;
			}
			// data-date and data-custom-display deprecated as of v2.0.5.alpha.3
			// and will be removed in a later major version.
			else {
				var dataDate = element.data('date'),
					dataCustomDisplay = element.data('custom-display');

				if(type == "date") return dataDate;
				else if(type == "customDisplay") return dataCustomDisplay;
			}
		},
		_eventContentListData: function () {
			// Check if the data-horizontal-timeline attribute exists on the events-content li,
			// If not then return the deprecated data-date.
			if (this.$element.find('li').data('horizontal-timeline')) {
				return "data-horizontal-timeline";
			}
			// data-date deprecated as of v2.0.5.alpha.3
			// and will be removed in a later major version.
			else {
				return "data-date";
			}
		},

		/* Refresh public method
		*  - refreshes the timeline externally after initialisation.
		*  Use it like: $('#example').horizontalTimeline('refresh');
		*/
		refresh: function () {
			var timelineComponents = {};

			this._timelineComponents(timelineComponents);

			// Removes first and last id attributes of the event-content list.
			timelineComponents['eventsContent']
				.find('#first').removeAttr('id').end()
				.find('#last').removeAttr('id').end();

			// Removes first and last classes from the timeline event date
			timelineComponents['eventsWrapper']
				.find('.first').removeClass('first').end()
				.find('.last').removeClass('last').end();

			// Adds classes and IDs.
			this._addIdsAndClasses(timelineComponents);	 // changed

			this._setDatePosition(timelineComponents);
			timelineTotalWidth = this._setTimelineWidth(timelineComponents);
			this._updateFilling(timelineComponents['eventsWrapper']
				.find('a.selected'), timelineComponents['fillingLine'], timelineTotalWidth);

			if(this.settings.autoplay == true) this._autoplay.refresh(this);
			console.log('refreshed #'+this.element.id);
		},

		/* Destroy public method
		*  - destroys the timeline externally after initialisation.
		* Removes all timeline created html and event handlers and resets the elements to the original state.
		*  Use it like: $('#example').horizontalTimeline('destroy');
		*/
		destroy: function () {
			var $this = this.$element,
				id = $this.attr('id'),
				originalEventsContent = $this.data('plugin_'+ this._name)['originalEventsContent'];

			if($('.horizontal-timeline .timeline').length == 1) {
				$('.goto-horizontal-timeline').off('.'+this._name);
				$('body').removeData('plugin_'+ this._name +'_loadedFile');
			}
			$this.removeClass('loaded')
				.off('.'+this._name, '**')
				.find('.timeline').remove().end()
				.find('.events-content').replaceWith(originalEventsContent).swipe("destroy");

			$this.find('.events-wrapper').removeClass('touch-enabled').swipe("destroy");
			$(document).off('.'+this._name+'_'+id);
			$(window).off('.'+this._name+'_'+id);

			if(this.settings.autoplay == true) {
				this._autoplay.destroy();
			}

			$this.removeData('plugin_' + pluginName);

			console.log('destroyed #'+this.element.id);
		},

		/* AddEvent public method
		* - adds a new event to the timeline externally after initialisation.
		* Adds a new event content to the timeline at a specified location.
		* Use it like: $('#example').horizontalTimeline('addEvent', [event content html], 'after', '01/01/2001');
		* (new event content html, insertion method (before or after), an existing unique date to position the new content around.)
		*/
		addEvent: function (html, insertMethod, arrangementDate) {
			var timelineComponents = {};

			this._timelineComponents(timelineComponents);

				// Get the new date from the HTML.
			var	newDate = html.split("date")[1].split('"')[2],
				// Select the specified event content
				$eventContent = timelineComponents['eventsContentList'].filter($.proxy(function(index, element) {
					var data = this._timelineData($(element), "date");
					if (data == arrangementDate) return $(element);
				}, this)),
				// Find the selected event.
				$selectedEvent = timelineComponents['eventsWrapper'].find('a.selected'),
				// Get the existing dates array.
				existingDates = this.$element.data('plugin_'+ this._name)['existingDates'];

			if(jQuery.inArray(newDate, existingDates) == -1) {
				existingDates.push(newDate);
				// If the insertMethod = before, then insert the new content before the specified date.
				if (insertMethod == 'before') $eventContent.before(html);
				// Else the insertMethod = after, insert the new content after the specified date.
				else if (insertMethod == 'after') $eventContent.after(html);

				// Call the create.date function passing the insertMethod and arrangementDate arguments.
				// This creates the new timeline events before or after [insertMethod] specified date [arrangementDate].
				this._createDate(this, insertMethod, arrangementDate);
				// Update the olderEvents.
				this._updateOlderEvents($selectedEvent);
				// Call the refresh function to fresh the timeline accordingly.
				this.refresh();

				/* Custom namespaced event: eventAdded with the data passed to the event as the newEventDate and newEventContent. */
				this.$element.trigger({
					type: "eventAdded."+this._name,
					newEventDate: newDate,
					newEventContent: html
				});
			}
			else return console.warn('The date '+ newDate +' is already in Timeline.');
		},

		/* RemoveEvent public method
		* - removes the specified event from the timeline externally after initialisation.
		* Removes the event and the event content from the timeline using the unique date used in data-date.
		* Use it like: $('#example').horizontalTimeline('removeEvent', '01/01/2001');
		*/
		removeEvent: function (date) {
			var timelineComponents = {};

			this._timelineComponents(timelineComponents);

				// Select the specified timeline event
			var $event = timelineComponents['eventsWrapper'].find("a").filter($.proxy(function(index, element) {
					var data = this._timelineData($(element), "date");
					if (data == date) return $(element);
				}, this)),
				// Select the specified event content
				$eventContent = timelineComponents['eventsContentList'].filter($.proxy(function(index, element) {
					var data = this._timelineData($(element), "date");
					if (data == date) return $(element);
				}, this)),
				$newEvent,
				// Get the existing dates array.
				existingDates = this.$element.data('plugin_'+ this._name)['existingDates'],
				// Find the index of the date in the array.
				index = existingDates.indexOf(date);

			// If there's more than 1 timeline events (We can't remove the very last event)...
			if (timelineComponents['timelineEvents'].length > 1) {
				// If the specified event is selected...
				if($event.is('.selected')) {
					// Remove the selected class from the specified event content
					$eventContent.removeClass('.selected');
					// If a next event exists, select it...
					if ($event.next().length) {
						// Add a selected class to the next timeline event and reference it.
						$newEvent = $event.next().addClass('selected');
						// Add a selected class to the next event content
						$eventContent.next().addClass('selected');
					}
					// If not, then select the previous event...
					else {
						// Add a selected class to the previous timeline event and reference it.
						$newEvent = $event.prev().addClass('selected');
						// Add a selected class to the previous event content.
						$eventContent.prev().addClass('selected');
					}
				}
				// If the specified event isn't selected, then just reference it to pass it to the functions
				// (we don't need to do anything special since it doesn't concern it).
				else $newEvent = timelineComponents['eventsWrapper'].find('a.selected');
				// Update the olderEvents using the newEvent as reference.
				this._updateOlderEvents($newEvent);
				// Remove the timeline event.
				$event.remove();
				// Remove the event content.
				$eventContent.remove();

				// If the existing date exists...
				if (index > -1) {
					// Remove the existing date from the array.
					existingDates.splice(index, 1);
				}

				// Call the refresh function to fresh the timeline accordingly.
				this.refresh();

				/* Custom namespaced event: eventRemoved with the data passed to the event as the removedDate. */
				this.$element.trigger({
					type: "eventRemoved."+this._name,
					removedDate: date,
					removedContent: $eventContent[0].outerHTML
				});
			}
			// If the specified event is the only event, do nothing, since there should always be at least 1 event.
			else {
				console.warn('Timeline must always have at least 1 event after initialisation, therefore it can\'t be removed. Please use the Destroy method instead.');
			}
		}, // End removeEvent() function

		/* goTo public method
		* - go to an event in the timeline externally after initialisation.
		* Changes and goes to the specified event in the timeline.
		* Use it like: $('#example').horizontalTimeline('goTo', '01/01/2001', {"smoothScroll": true, "speed": 500, "offset": 0, "easing": "linear"});
		* ([an existing unique date to go to], {[enable smoothScroll], [scrollSpeed], [scrollOffset], [scrollEasing]})
		* The go-to-timeline links uses this method.
		*/

		// The object that equals itself as the function arguments, sets the defaults for the smoothScroll function. 0+ options can be overridden.
		goTo: function (date, {smoothScroll = false, speed = 500, offset = 0, easing = "linear"} = {}, instanceRef) {
			var timelineComponents = {};
			this._timelineComponents(timelineComponents);
			// If the variable instanceRef is undefined, set it to this instance.
			// Only used if the public method is used. (the go-to links passes the instanceRef as an argument.)
			if (typeof instanceRef == 'undefined') instanceRef = this;

			// Get the existing dates array.
			var existingDates = this.$element.data('plugin_'+ this._name)['existingDates']
				speed = Number(speed),
				offset = Number(offset);

			// If date exists in the timeline, we can then go to it.
			if(jQuery.inArray(date, existingDates) > -1) {

				/* Custom namespaced event: goToTimeline with the data passed to the event as the goToDate and the timelineSelector (jQuery object).
				* (Has to be triggered on the body because of the go-to-timeline links in the DOM.)
				*/
				$('body').trigger({
					type: "goToTimeline."+this._name,
					goToDate: date,
					timelineSelector: instanceRef.$element
				});

				// Find all event dates.
				var	prevDates = timelineComponents['eventsWrapper'].find('a'),
					// Find the targeted event date using the date
					selectedDate = timelineComponents['eventsWrapper'].find("a").filter($.proxy(function(index, element) {
						var data = this._timelineData($(element), "date");
						if (data == date) return $(element);
					}, this)),
					// Get the width value of the events (previously set)
					timelineTotalWidth = this._setTimelineWidth(timelineComponents);

					//** SmoothScroll functions **//
					if (smoothScroll == true) {
						// Smoothly scroll the document to the target
						$('html, body').stop().animate(
							{
								'scrollTop': instanceRef.$element.offset().top - offset
							},
							speed,
							easing,
							function() {
								// Once scrolling/animating the document is complete, update the target timeline.
								goto(instanceRef);
							}
						); // End .animate function
					}
					else goto(instanceRef);
				}
				// The date is not in the timeline, so we can not go to it.
				else return console.warn('The date '+ date +' is not in the Timeline, so we can not go to it.');

				function goto(instanceRef) {
					// Check if the targeted event hasn't already been selected, if not continue the code.
					if (!selectedDate.hasClass('selected')) {
						// Remove all selected classes from dates
						prevDates.removeClass('selected');
						// Add a selected class to the date we are targeting
						selectedDate.addClass('selected');
						// Update other dates as an older event for styling
						instanceRef._updateOlderEvents(selectedDate);
						// Update the filling line up to the selected date
						instanceRef._updateFilling(selectedDate, timelineComponents['fillingLine'], timelineTotalWidth);
						// Update the visible content of the selected event
						instanceRef._updateVisibleContent(selectedDate, timelineComponents['eventsContent']);
					}
					// Translate (scroll) the timeline left or right according to the position of the targeted event date
					instanceRef._updateTimelinePosition(selectedDate, timelineComponents, timelineTotalWidth);
				} // End goto() function
		}, // End goTo() public method function

		_updateSlide: function (timelineComponents, timelineTotalWidth, string) {
			// Retrieve translateX value of timelineComponents['eventsWrapper']
			var translateValue = this._getTranslateValue(timelineComponents['eventsWrapper']),
				wrapperWidth = Number(timelineComponents['timelineWrapper'].width());
			// Translate the timeline to the left/right (also know as scroll left/scroll right)
			if (string == 'right') this._translateTimeline(timelineComponents, translateValue - wrapperWidth, wrapperWidth - timelineTotalWidth);
			else this._translateTimeline(timelineComponents, translateValue + wrapperWidth);
		},

		_showNewContent: function (timelineComponents, timelineTotalWidth, string) {
			// Show prev/next content
				// Find the .selected content
			var visibleContent =  timelineComponents['eventsContent'].find('.selected');

			// If dateOrder is normal...
			if (this.settings.dateOrder == "normal")
				// Find the prev/next content for detection later.
				var newContent = (string == 'next') ?  visibleContent.next() : visibleContent.prev();

			// If dateOrder is reverse
			else if (this.settings.dateOrder == "reverse")
				// Find the prev/next content in reverse fore detection later.
				var newContent = (string == 'next') ?  visibleContent.prev() : visibleContent.next();

			// If a prev/next content exists
			// OR dateOrder is reverse AND string is start (for Autoplay)...
			// This determines whether we can navigate prev or next.
			if (newContent.length > 0 || (this.settings.dateOrder == "reverse" && string == 'start')) {
				// Find the .selected event
				var selectedDate = timelineComponents['eventsWrapper'].find('.selected'),
					newEvent;

				// If start... (For Autoplay), find the first event
				if(string == 'start') {

					// If the dateOrder is normal (starting from the left)...
					if (this.settings.dateOrder == "normal") {
						// Find the first event.
						newEvent = timelineComponents['eventsWrapper'].find('.first');
					}
					// Else if the dateOrder is reverse (starting from the right)...
					else if (this.settings.dateOrder == "reverse") {
						// Find the last event.
						newEvent = timelineComponents['eventsWrapper'].find('.last');
					}
				}
				// If next, find the next event from the current selected event
				else if (string == 'next') newEvent = selectedDate.next('a');

				// If prev, find the prev event from the current selected event
				else if (string == 'prev') newEvent = selectedDate.prev('a');

				this._updateVisibleContent(newEvent, timelineComponents['eventsContent']);

				newEvent.addClass('selected');
				selectedDate.removeClass('selected');

				this._updateFilling(newEvent, timelineComponents['fillingLine'], timelineTotalWidth);
				this._updateOlderEvents(newEvent);
				this._updateTimelinePosition(newEvent, timelineComponents, timelineTotalWidth);
			}
		},

		_updateTimelinePosition: function (event, timelineComponents, timelineTotalWidth) {
				// Get the css left value of the targeted event date
			var eventLeft = Number(event.css('left').replace('px', '')),
				// Get the width value of the .events-wrapper
				timelineWidth = timelineComponents['timelineWrapper'].width();

			this._translateTimeline(timelineComponents, - eventLeft + timelineWidth/2, timelineWidth - timelineTotalWidth);
		},

		_translateTimeline: function (timelineComponents, value, totalTranslateValue) {
			// Only negative translate value
			var value = (value > 0) ? 0 : value;
			// Do not translate more than timeline width
			value = (!(typeof totalTranslateValue === 'undefined') &&  value < totalTranslateValue ) ? totalTranslateValue : value;
			this._setTransformValue(timelineComponents['eventsWrapper'], 'translateX', value+'px');

			// Disable the buttons if necessary
			this._buttonStates(timelineComponents, value, totalTranslateValue);
		},

		_updateFilling: function (selectedEvent, filling, totalTranslateValue) {
			// Change .filling-line length according to the selected event
				// Get the css left value of the selected event and remove the px unit
			var eventLeft = selectedEvent.css('left').replace('px', ''),
				// Get the css width value of the selected event and remove the px unit
				eventWidth = selectedEvent.css('width').replace('px', '');
			// Add the left and width together and divide by 2
			eventLeft = Number(eventLeft) + Number(eventWidth)/2;
			// Divide the eventLeft and the totalTranslateValue to get the filling line value
			var scaleValue = eventLeft/totalTranslateValue;
			// Set the filling line value
			this._setTransformValue(filling, 'scaleX', scaleValue);
		},

		// Fixed intervals between dates specified in the options.
		_setDatePosition: function (timelineComponents) {
			var	distnew = 0,
				distprev = 0,
				startingNum = 0;

			this._setDateIntervals(timelineComponents);

			var checkMQ = this._checkMQ(),
				// Check if the new object options are defined in the user options, if they are use them,
				// otherwise use the deprecated single options.
				minimal = (this._options.dateIntervals != undefined) ? this.settings.dateIntervals.minimal : this.settings.minimalFirstDateInterval;

			if (minimal == true || checkMQ == 'mobile') {
				// Set the 1st date to 0px on the timeline but with a padding left of 10px.
				timelineComponents['timelineEvents'].first().css({'left': '0px','padding-left': '10px'});
				startingNum = 1;
			}
			// When i starts at 1, it means starts at 2nd date.
			for (i = startingNum; i < timelineComponents['timelineEvents'].length; i++) {
				distnew = distprev + dateIntervals;
				timelineComponents['timelineEvents'].eq(i).css('left', distnew + 'px');
				distprev = distnew;
			}

		},

		_setTimelineWidth: function (timelineComponents) {
			var	totalWidth = 0,
				// Get wrapper width
				wrapperWidth = timelineComponents['timelineWrapper'].width(),
				// Get the css left value of the last event date, remove the px unit and add 100 to it.
				lastEventLeft = Number(timelineComponents['timelineEvents'].last().css('left').replace('px', '')) + 100;

			// Set a fail-safe, if lastEventLeft is less than the wrapperWidth then use the wrapperWidth as totalWidth.
			// Stops the timeline width from being too small.
			if (lastEventLeft < wrapperWidth) {
				totalWidth = wrapperWidth;
			}
			else {
				totalWidth = lastEventLeft;
			}
			timelineComponents['eventsWrapper'].css('width', totalWidth+'px');
			this._updateTimelinePosition(timelineComponents['eventsWrapper'].find('a.selected'), timelineComponents, totalWidth);

			return totalWidth;
		},

		_updateVisibleContent: function (event, eventsContent) {
			var eventDate = this._timelineData(event, "date");
				visibleContent = eventsContent.find('.selected'),
				dataAttribute = this._eventContentListData(),
				// Function to find the new content...
				newContent = eventsContent.find('li['+ dataAttribute +']').filter($.proxy(function(index, element) {
					var data = this._timelineData($(element), "date");
					if (data == eventDate) return $(element);
				}, this)),

				newContentHeight = newContent.outerHeight(),

				// Check if the deprecated single options are defined in the user options, if they are use them,
				// otherwise use the new object options.

				// Set the single options into an array to check against.
				optionArray = [this._options.enter_animationClass, this._options.exit_animationClass],

				// A variable to include in an if statement that queries if the single options are undefined.
				singleUndefined = (optionArray[0] == undefined && optionArray[1] == undefined),

				// A variable to include in an if statement that queries if the single option is defined 
				// AND the object option is also defined.
				bothDefined = (optionArray[0] != undefined && this._options.animationClass != undefined)
					|| (optionArray[1] != undefined && this._options.animationClass != undefined),

				// If single option are undefined OR both single and object options are defined
				// then default to the object options, otherwise use the deprecated single option.
				animationObj = (singleUndefined || bothDefined) ? this.settings.animationClass : this.settings,

				// If animationObj equals the object options...

				enterObj = (animationObj == this.settings.animationClass) ? animationObj.enter : animationObj.enter_animationClass,
				exitObj = (animationObj == this.settings.animationClass) ? animationObj.exit : animationObj.exit_animationClass,

				allClasses = exitObj.right + ' ' + exitObj.left + ' ' + enterObj.left + ' ' + enterObj.right;

			// If newContent index is more than the visibleContent index,
			// then we have selected an event to the right.
			if (newContent.index() > visibleContent.index()) {
					// Set the selected and the enter right classes.
				var classEntering = 'selected ' + enterObj.right,
					// Set the exit left class.
					classExiting = exitObj.left;
			}
			// Else, we have selecting an event to the left.
			else {
					// Set the selected and the enter left classes.
				var classEntering = 'selected ' + enterObj.left,
					// Set the exit right class.
					classExiting = exitObj.right;
			}

			/* Add/remove classes to animate them in and out using CSS3. */

			function whichAnimationEvent(){
				var t,
					el = document.createElement("fakeelement"),
					animations = {
						"animation": "animationend",
						"OAnimation": "oAnimationEnd",
						"MozAnimation": "animationend",
						"WebkitAnimation": "webkitAnimationEnd"
					};

				for (t in animations){
					if (el.style[t] !== undefined) return animations[t];
				}
			}

			var animationEvent = whichAnimationEvent(),
			    dataAttribute = this._eventContentListData();

			// Add the enter class to the newContent.
			newContent.addClass(classEntering);
			// Add the exit class to the visibleContent and on animation end...
			visibleContent
				.addClass(classExiting)
				.one(animationEvent, function(e){
					// Remove all enter and exit classes from all the event content.
					eventsContent.find('li['+ dataAttribute +']').removeClass(allClasses);
				})
				// And then remove the selected class.
				.removeClass('selected');

			// Update the height.
			eventsContent.height(newContentHeight+'px');

			// For use with autoplay...
			if (this.settings.autoplay == true) this._autoplay.moved(this);

			/* Custom namespaced event: eventChanged with the data passed to the event as the current selected eventDate. */
			this.$element.trigger({
				type: "eventChanged."+this._name,
				currentEventDate: eventDate
			});

		}, // End _updateVisibleContent function

		_updateOlderEvents: function (event) {
			event.prevAll('a').addClass('older-event').end()
				.nextAll('a').removeClass('older-event');
			if (event.is('.selected')) event.removeClass('older-event');
		},

		_getTranslateValue: function (timeline) {
			var timelineStyle = window.getComputedStyle(timeline.get(0), null),
				timelineTranslate = timelineStyle.getPropertyValue("-webkit-transform") ||
					timelineStyle.getPropertyValue("-moz-transform") ||
					timelineStyle.getPropertyValue("-ms-transform") ||
					timelineStyle.getPropertyValue("-o-transform") ||
					timelineStyle.getPropertyValue("transform");

			if(timelineTranslate.indexOf('(') >=0) {
				var timelineTranslate = timelineTranslate.split('(')[1];
				timelineTranslate = timelineTranslate.split(')')[0];
				timelineTranslate = timelineTranslate.split(',');
				var translateValue = timelineTranslate[4];
			} else {
				var translateValue = 0;
			}
			return Number(translateValue);
		},

		_setTransformValue: function (element, property, value) {
			element.css({
				"-webkit-transform": property + "("+value+")",
				"-moz-transform": property + "("+value+")",
				"-ms-transform": property + "("+value+")",
				"-o-transform": property + "("+value+")",
				"transform": property + "("+value+")"
			});
		},

		/* How to tell if a DOM element is visible in the current viewport?
		http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport */
		_elementInViewport: function (el) {
			var top = el.offsetTop,
				left = el.offsetLeft,
				width = el.offsetWidth,
				height = el.offsetHeight;

			while(el.offsetParent) {
				el = el.offsetParent;
				top += el.offsetTop;
				left += el.offsetLeft;
			}

			return (
				top < (window.pageYOffset + window.innerHeight) &&
				left < (window.pageXOffset + window.innerWidth) &&
				(top + height) > window.pageYOffset &&
				(left + width) > window.pageXOffset
			);
		},

		_setDateIntervals: function (timelineComponents) {
			var checkMQ = this._checkMQ(),
				// Set a minimum value for the intervals.
				minimumInterval = 120,

				// Check if the deprecated single options are defined in the user options, if they are use them,
				// otherwise use the new object options.

				// Set the single options into an array to check against.
				optionArray = [this._options.desktopDateIntervals, this._options.tabletDateIntervals, this._options.mobileDateIntervals],

				// A variable to include in an if statement that queries if the single options are undefined.
				singleUndefined = (optionArray[0] == undefined && optionArray[1] == undefined && optionArray[2] == undefined),

				// A variable to include in an if statement that queries if the single option is defined 
				// AND the object option is also defined.
				bothDefined = (optionArray[0] != undefined && this._options.dateIntervals != undefined) 
					|| (optionArray[1] != undefined && this._options.dateIntervals != undefined) 
					|| (optionArray[2] != undefined && this._options.dateIntervals != undefined),

				// If single options are undefined OR both single and object options are defined
				// then default to the object options, otherwise use the deprecated single options.
				date_intervals = (singleUndefined || bothDefined) ? this.settings.dateIntervals : this.settings,

				// If date_intervals equals the object options...
				desktop = (date_intervals == this.settings.dateIntervals) ? date_intervals.desktop : date_intervals.desktopDateIntervals,

				tablet = (date_intervals == this.settings.dateIntervals) ? date_intervals.tablet : date_intervals.tabletDateIntervals,

				mobile = (date_intervals == this.settings.dateIntervals) ? date_intervals.mobile : date_intervals.mobileDateIntervals;
				
			// If desktop is detected, set dateIntervals to desktop
			if (checkMQ == 'desktop') dateIntervals = desktop;
			// If tablet is detected, set dateIntervals to tablet
			else if (checkMQ == 'tablet') dateIntervals = tablet;
			// If mobile is detected, set dateIntervals to mobile
			else if (checkMQ == 'mobile') dateIntervals = mobile;
			
			// If dateIntervals options are set to below the minimum value, then change it.
			if (dateIntervals < minimumInterval) dateIntervals = minimumInterval;
		},

		_checkMQ: function () {
			// Check for mobile, table or desktop device
			// https://stackoverflow.com/a/14913306/2358222
			return window.getComputedStyle(this.element,':before').content.replace(/'/g, "").replace(/"/g, "");
		},

		//** Button States **//
		_buttonStates: function (timelineComponents, translateValue, totalTranslateValue){
			var nextButton = timelineComponents['timelineNavigation'].find('.next'),
				prevButton = timelineComponents['timelineNavigation'].find('.prev'),

				leftButton = timelineComponents['timelineNavigation'].find('.scroll-left'),
				rightButton = timelineComponents['timelineNavigation'].find('.scroll-right'),

				firstEvent = timelineComponents['timelineWrapper'].find('.first'),
				lastEvent = timelineComponents['timelineWrapper'].find('.last'),
				// Get the wrapper width
				wrapperWidth = timelineComponents['timelineWrapper'].width(),
				// Get the width value of the events (previously set)
				timelineTotalWidth = timelineComponents['eventsWrapper'].width();

			// If wrapper width equals the timeline total width,
			// then disable both scroll left and right buttons
			if(wrapperWidth == timelineTotalWidth){
				leftButton.addClass('inactive');
				rightButton.addClass('inactive');
			}

			/* Prev/Next buttons */
			if (timelineComponents['eventsContentList'].length == 1) {
				prevButton.addClass('inactive');
				nextButton.addClass('inactive');
			}
			else {
				// If first event is selected, then disable the prev button
				if(firstEvent.is('.selected')) prevButton.addClass('inactive');
				// If not, then enable the prev button
				else prevButton.removeClass('inactive');

				// If last event is selected, then disable the next button
				if(lastEvent.is('.selected')) nextButton.addClass('inactive');
				// If not, then enable the next button
				else nextButton.removeClass('inactive');
			}
			/* Scroll left/right buttons */

			// If translate value equals zero, it's the start of the timeline,
			// so disable the scroll left button
			if (translateValue == 0) leftButton.addClass('inactive');
			// If not, then enable the scroll left button
			else leftButton.removeClass('inactive');

			// If translate value equals to the total translate value, it's the end of the timeline,
			// so disable the scroll right button
			if (translateValue == totalTranslateValue) rightButton.addClass('inactive');
			// If not, then enable the scroll right button
			else rightButton.removeClass('inactive');
		}, // End _buttonStates() function

		// Function to add required js and css files dynamically
		// (CDN URL of the plugin, file type JS or CSS, callback function)
		_addFile: function (url, type, callback) {
			// If addRequiredFile is true...
			if (this.settings.addRequiredFile == true) {
					// Set loadedFile variable as body data of the loadedfile array, to check against later
				var loadedFile = $('body').data('plugin_'+ this._name +'_loadedFile'),
					// Declare an empty variable
					fileExists,
					// Variables for script and style
					js = type == 'js',
					css = type == 'css',
					// Get the name from the url
					strip = url.split('libs/'),
					strip = strip[1].split('/'),
					name = strip[0];

				// If js, check if the name is in a src attribute in a <script> tag
				if(js) fileExists = $('script[src*="'+name+'"]');

				// Else if css, check if the name is in a href attribute in a <link> tag
				else if (css) fileExists = $('link[href*="'+name+'"]');

				// If loadedFile is undefined/not set, create a new array for the loaded files.
				if (typeof loadedFile === 'undefined' || loadedFile === null) loadedFile = new Array();

				// If loadedFile array doesn't include the url AND
				// the file doesn't exist in the document...

				// Using !loadedFile.includes(url) would be more ideal,
				// but due to no support in IE11, we can't use it.
				if (loadedFile.indexOf(url) == -1 && !fileExists.length) {

					// File isn't loaded yet...
					// If adding js...
					if(js) {
						console.groupCollapsed(name + ' on ' + this.$element.attr('id') + " timeline");
						console.log('The plugin isn\'t loaded.');

						// Load the plugin dynamically via Ajax.
						$.getScript(url)
							.done(function(script, textStatus) {
								// Then execute it via the callback option
								// Check if callback is a function, if it is then set a variable as the callback to be called.
								if (typeof callback === "function") callback(this);
							})
							.fail(function(jqxhr, settings, exception) {
								console.error("Failed to get " + url + "\n" + jqxhr + "\n" + this.settings + "\n" + exception);
							}); // End $.getScript function

						console.log('It was loaded dynamically.');
					}
					// Else if adding CSS...
					else if (css) {
						console.groupCollapsed(name);
						console.log('The plugin isn\'t loaded.');

						// Add a the CSS file in a new <link> after the last <link> in the head.
						$('<link>').attr({'href':url, 'rel':'stylesheet', 'type':"text/css"}).insertAfter(
							$('head').find('link').last()
						);

						console.log('It was loaded dynamically.');
					}
					// Push/add the url to the loadedFile array to check against.
					loadedFile.push(url);

				}
				// Else if the file exists in the document AND
				// the URL isn't in the loadedFile array...

				// Using !loadedFile.includes(url) would be more ideal,
				// but due to no support in IE11, we can't use it.
				else if (fileExists.length && loadedFile.indexOf(url) == -1) {
					// The file is already loaded in the document via a <script> tag...
					if(js) {
						console.groupCollapsed(name + ' on ' + this.$element.attr('id') + " timeline");
						console.log('The plugin has already been loaded in the document via a <script> tag, no need to load it again.');

						// Execute the plugin via the callback option.
						// Check if callback is a function, if it is then set a variable as the callback to be called.
						if (typeof callback === "function") callback(this);
					}
					// Push/add the url to the loadedFile array to check against.
					loadedFile.push(url);
				}
				// Else the plugin has already been loaded...
				else {
					if(js) {
						console.groupCollapsed(name + ' on ' + this.$element.attr('id') + " timeline");
						console.log('The plugin has already been loaded, no need to load it again.');

						// Execute the plugin via the callback option.
						// Check if callback is a function, if it is then set a variable as the callback to be called.
						if (typeof callback === "function") callback(this);
					}
				}

				if(js) {
					console.log('Executed on:', this.$element);
				}
				console.groupEnd();

				// Save the loadedFile array as data to the body to be able to reload it next time it's accessed.
				$('body').data('plugin_'+ this._name +'_loadedFile', loadedFile);
			} // End if addRequiredFile statement.
			// If addRequiredFile is false we just need to execute the plugin via the callback option.
			else {
				// Check if callback is a function, if it is then set a variable as the callback to be called.
				if (typeof callback === "function") callback(this);
			}
		} // End addFile function
 	}; // End Timeline Prototype

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations and allowing any
	// public function (ie. a function whose name doesn't start
	// with an underscore) to be called via the jQuery plugin,
	// e.g. $(element).defaultPluginName('functionName', arg1, arg2)
	$.fn[pluginName] = function (options) {
		var args = arguments,
			windowWidth = $(window).width(),
		    	// data-date deprecated as of v2.0.5.alpha.3
			// and will be removed in a later major version.
			dataAttribute = ($(this).find('li').data('horizontal-timeline')) ? "data-horizontal-timeline": "data-date",
		    
			dateExists = $(this).find('.events-content').find('li['+ dataAttribute +']').map(function() {
				if ($(this).data('horizontal-timeline')) {
					var data = $(this).data('horizontal-timeline');

					return data.date;
				}
				// data-date deprecated as of v2.0.5.alpha.3
				// and will be removed in a later major version.
				else {
					var dataDate = $(this).data('date');

					return dataDate;
				}
			}).get();

		// Is the first parameter an object (options), or was omitted,
		// instantiate a new instance of the plugin.
		if (options === undefined || typeof options === 'object') {
			return this.each(function () {

				// Only allow the plugin to be instantiated once,
				// so we check that the element has no plugin instantiation yet
				if (!$.data(this, 'plugin_' + pluginName)) {

					// if it has no instance, create a new one,
					// pass options to our plugin constructor,
					// and store the plugin instance
					// in the elements jQuery data object.
					$.data(this, 'plugin_' + pluginName, {
						'originalEventsContent': $(this).find('.events-content').clone()[0],
						'windowWidth': windowWidth,
						'existingDates': dateExists,
						'Timeline': new Timeline(this, options)
					});
					if (options !== undefined && options.autoplay == true) { // changed
						autoplayObj = {
							"isPaused": false,
							"mouseEvent": false
						};

						$(this).data('plugin_'+ pluginName)['autoplay'] = autoplayObj;
					}
				}
			});

		// If the first parameter is a string and it doesn't start
		// with an underscore or "contains" the `init`-function,
		// treat this as a call to a public method.
		} 
		else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
			// Cache the method call
			// to make it possible
			// to return a value
			var returns;

			this.each(function () {
				var instance = $.data(this, 'plugin_' + pluginName)['Timeline'];

				// Tests that there's already a plugin-instance
				// and checks that the requested public method exists
				if (instance instanceof Timeline && typeof instance[options] === 'function') {

					// Call the method of our plugin instance,
					// and pass it the supplied arguments.
					returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ));
				}
			});

			// If the earlier cached method
			// gives a value back return the value,
			// otherwise return this to preserve chainability.
			return returns !== undefined ? returns : this;
		}
	};

})( jQuery, window, document );
