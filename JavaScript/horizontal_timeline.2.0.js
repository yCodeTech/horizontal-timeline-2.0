/* -------------------------------- 
 
Horizontal Timeline 2.0
    by Studocwho @ yCodeTech
	
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
        	desktopDateIntervals: 200,   //************\\
		tabletDateIntervals: 150,   // Minimum: 120 \\
		mobileDateIntervals: 120,  //****************\\
		minimalFirstDateInterval: true,
			
		dateDisplay: "dateTime", // dateTime, date, time, dayMonth, monthYear, year
			
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
			
		iconBaseClass: "fas fa-3x",	
		scrollLeft_iconClass: "fa-chevron-circle-left",
		scrollRight_iconClass: "fa-chevron-circle-right",	
		prev_iconClass: "fa-arrow-circle-left",
		next_iconClass: "fa-arrow-circle-right",	
		pause_iconClass: "fa-pause-circle",
		play_iconClass: "fa-play-circle"
        };

    // The actual plugin constructor
    function Timeline( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the 
        // contents of two or more objects, storing the 
        // result in the first object. The first object 
        // is generally empty because we don't want to alter 
        // the default options for future instances of the plugin
        this.settings = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;
		
		this.$element = $(element),

        this.init();
    }
    Timeline.prototype.init = function () {
        // You already have access to the DOM element and
        // the options via the instance, e.g. this.element 
        // and this.settings
		var self = this, 
		    contentList = this.$element.find('li');
		if(contentList.length == 0) this.$element.css('opacity', 1).html('<h3>There are no events at this point in time.<br><br>Please add some content.</h3>');
		
		var url = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.min.css";
			
		// Function to load the file
		// (url, type)	
		this._addFile(url, 'css');
		
		this._create();
	    
		// Wait about 300s to make sure the all elements are created properly.
		// Otherwise the width of the timeline would report as bigger than it actually is.
		window.setTimeout($.proxy(function(){
			timelineComponents = {};
			this._timelineComponents(timelineComponents);

			this.init.addIdsAndClasses = addIdsAndClasses;
			this.init.addIdsAndClasses();

			function addIdsAndClasses() {
				//** Adding IDs and Classes **//
				if (timelineComponents['eventsContentList'].length == 1) {
					timelineComponents['eventsContentList'].first().attr('id', 'first');
					timelineComponents['timelineEvents'].first().addClass("first");
				}
				else {
					// Adds id to the first and last li of the event-content list respectively.
					timelineComponents['eventsContentList']
						.first().attr('id', 'first').end()
						.last().attr('id', 'last');

					// Adds class to the first and last timeline event dates respectively.
					timelineComponents['timelineEvents']
						.first().addClass("first").end()
						.last().addClass("last");
				}
			}
			//** Select the correct event **//

			// If any events-content has .selected class...
			if (timelineComponents['eventsContentList'].hasClass('selected')) {
				    // Get date from data-date attribute
				var date = timelineComponents['eventsContentSelected'].data('date'),
				    // Find the event date matching the data-date
				    selectedDate = timelineComponents['eventsWrapper'].find('a[data-date="'+date+'"]');

				// Add .selected class to the matched element
				selectedDate.addClass('selected');
				// Update all previous dates for styling.
				this._updateOlderEvents(selectedDate);
			}
			// If no class found at all...
			else {
				// Add .selected class to the first events-content and first event date respectively.
				timelineComponents['eventsContent']
					.find('li#first').addClass('selected').end()
					.siblings('.timeline').find('.events').find('a.first').addClass('selected');			
			}


			// Assign a left postion to the single events along the timeline
			this._setDatePosition(timelineComponents);
			// Assign a width to the timeline
			var timelineTotalWidth = this._setTimelineWidth(timelineComponents);
			// Set the filling line to the selected event
			this._updateFilling(timelineComponents['eventsWrapper']
				.find('a.selected'), timelineComponents['fillingLine'], timelineTotalWidth);
			// The timeline has been initialised - show it
			this.$element.addClass('loaded');

			this._setup(self, timelineComponents, timelineTotalWidth);
		}, this), 300);	
    };	
	/* Dynamically creates the timeline according to the amount of events. */
	Timeline.prototype._create = function () {		
		var $timelineWrapper = '<div class="timeline"></div>',
		    $timelineEventsWrapper = '<div class="events-wrapper"><div class="events"><span class="filling-line" aria-hidden="true"></span></div></div>',
			
		    // All buttons uses Font Awesome for the icons
		    // Icons require Font Awesome CSS
		    // This CSS file has been added to the document if not already present.
			
		    // Left Nav
		    $leftNav = '<div class="timeline-navigation" id="leftNav"></div>',
		    $scrollLeftButton = '<a href="" class="'+ this.settings.iconBaseClass +' '+ this.settings.scrollLeft_iconClass +' scroll-left inactive"></a>',
		    $prevButton = '<a href="" class="'+ this.settings.iconBaseClass +' '+ this.settings.prev_iconClass +' prev inactive"></a>',
		    
			
		    // Right Nav
		    $rightNav = '<div class="timeline-navigation" id="rightNav"></div>',
		    $nextButton = '<a href="" class="'+ this.settings.iconBaseClass +' '+ this.settings.next_iconClass +' next"></a>',
		    $scrollRightButton = '<a href="" class="'+ this.settings.iconBaseClass +' '+ this.settings.scrollRight_iconClass +' scroll-right"></a>',
			
		    // Pause/Play Nav
		    $pausePlayWrapper = '<div class="timeline-navigation" id="pausePlay"></div>',
		    $pauseButton = '<a href="" class="'+ this.settings.iconBaseClass +' '+ this.settings.pause_iconClass +' pause"></a>';

		//** Create the timeline HTML **//
		
		// Create the timeline element.
		this.$element.prepend($timelineWrapper)
		// Find the timeline element that was just created
		var $timeline = this.$element.find('.timeline');
		
		// Nav buttons/Scroll buttons
		
		// If either of the nav (prev/next) or scroll (left/right) buttons are enabled...
		if (this.settings.useNavBtns == true || this.settings.useScrollBtns == true) {
			// Create the leftNav, then the timelineEventsWrapper, and then the rightNav
			$timeline.append($leftNav).append($timelineEventsWrapper).append($rightNav);
			
			// If only useScrollBtns is true...
			if (this.settings.useNavBtns == false && this.settings.useScrollBtns == true)
				// Find the leftNav and add the scroll left button
				// and then find the rightNav and add the scroll right button.
				$timeline.find('#leftNav').append($scrollLeftButton).end()
						 .find("#rightNav").append($scrollRightButton);
						 
			// If only the useNavBtns is true...	 
			else if (this.settings.useNavBtns == true && this.settings.useScrollBtns == false)
				// Find the leftNav and add the prev button
				// and then find the rightNav and add the next button.
				$timeline.find('#leftNav').append($prevButton).end()
						 .find("#rightNav").append($nextButton);
			
			// If both useNavBtns AND useScrollBtns are true...			 
			else if (this.settings.useNavBtns == true && this.settings.useScrollBtns == true)
				// Find the leftNav and add the scroll left button and the prev button,
				// and then find the rightNav and add the next button and the scroll right button.			
				$timeline.find('#leftNav').append($scrollLeftButton).append($prevButton).end()
						 .find("#rightNav").append($nextButton).append($scrollRightButton);
		}
		// Otherwise, both button sets are disabled and we just need to add the timelineEventsWrapper.
		else $timeline.append($timelineEventsWrapper);
		
		// Autoplay buttons	
		// If autoplay is true, create the pause button
		if (this.settings.autoplay == true)	
			$timeline.append($pausePlayWrapper).find('#pausePlay').append($pauseButton);
			
		//** Create the HTML for the event date display **//
		
		this._create.date = createDate;
		this._create.eventDateDisplay = eventDateDisplay;
		this._create.date(this, 'append');
		// (instance, insertMethod (append, before, after [last 2 for addEvent method]), date to insert before/after [from addEvent method])
		function createDate(self, insertMethod, arrangementDate) {
			/* dateTime = the date and time */
			if(self.settings.dateDisplay == "dateTime") {
				self.$element.children('.events-content').find('li').each(function() {
					self._create.eventDateDisplay(self, $(this), "dateTime", insertMethod, arrangementDate);
				});
			}
			/* date = the date only */
			else if (self.settings.dateDisplay == "date") {
				self.$element.children('.events-content').find('li').each(function() {	
					self._create.eventDateDisplay(self, $(this), "date", insertMethod, arrangementDate);
				});
			}
			/* time = the time only */
			else if (self.settings.dateDisplay == "time") {
				self.$element.children('.events-content').find('li').each(function() {	
					self._create.eventDateDisplay(self, $(this), "time", insertMethod, arrangementDate);
				});
			}
			/* dayMonth = the day and monthName only */
			else if (self.settings.dateDisplay == "dayMonth") {
				self.$element.children('.events-content').find('li').each(function() {
					self._create.eventDateDisplay(self, $(this), "dayMonth", insertMethod, arrangementDate);
				});
			}
			/* monthYear = the monthName and year only */
			else if (self.settings.dateDisplay == "monthYear") {
				self.$element.children('.events-content').find('li').each(function() {
					self._create.eventDateDisplay(self, $(this), "monthYear", insertMethod, arrangementDate);
				});		
			}			
			/* year = the year only */
			else if (self.settings.dateDisplay == "year") {
				self.$element.children('.events-content').find('li').each(function() {
					self._create.eventDateDisplay(self, $(this), "year", insertMethod, arrangementDate);
				});
			}
		}
		/* Function to create the event date display  
		(instance, element, displayType, insertMethod (append, before, after [last 2 for addEvent method]), date to insert before/after [from addEvent method])*/
		function eventDateDisplay(self, eventElement, display, insertMethod, arrangementDate) {
			    // Get date from data-date attribute
			var dataDate = eventElement.data('date'),
			    // Check if element data-date format is DD/MM/YYYYTHH:MM by checking for 'T'
			    isDateTime = eventElement.is('[data-date*="T"]'),
			    // Check if element data-date format is HH:MM by checking for ':' but doesn't have 'T'
			    isTime = eventElement.not('[data-date*="T"]').is('[data-date*=":"]'),
			    // Display type checks
			    dateTimeDisplay = display == "dateTime",
			    dateDisplay = display == "date",
			    timeDisplay = display == "time",
			    dayMonthDisplay = display == "dayMonth",
			    monthYearDisplay = display == "monthYear",
			    yearDisplay = display == "year",
			    // Find .events for the date display
			    $eventDateDisplay = self.$element.find('.events'),
			    dateLink = '<a href="" data-date="'+ dataDate +'">',
			    // For use with the addEvent plublic method
			    // Finds the event with the specific date.
			    $arrangementEvent = $eventDateDisplay.find('a[data-date="'+ arrangementDate +'"]');
					
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
				return $(this).data('date');
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
					// If element has a data-custom-display attribute...
					if(eventElement.data('custom-display')) {
						// Get the custom text from the data-attribute.
						var customData = eventElement.data('customDisplay');

						// Add in the custom Text depending on which insertMethod used.
						if (insertMethod == 'append') $eventDateDisplay.append(dateLink + customData +'</a>');
						// For use with the addEvent method... creates new timeline events and places them where specified.
						else if (insertMethod == 'after') $arrangementEvent.after(dateLink + customData +'</a>');
						else $arrangementEvent.before(dateLink + customData +'</a>');
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
					// If element has a data-custom-display attribute...
					if(eventElement.data('custom-display')) {
						// Get the custom text from the data-attribute.
						var customData = eventElement.data('customDisplay');

						// Add in the custom Text depending on which insertMethod used.
						if (insertMethod == 'append') $eventDateDisplay.append(dateLink + customData +'</a>');
						// For use with the addEvent method... creates new timeline events and places them where specified.
						else if (insertMethod == 'after') $arrangementEvent.after(dateLink + customData +'</a>');
						else $arrangementEvent.before(dateLink + customData +'</a>');
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
					// If element has a data-custom-display attribute...
					if(eventElement.data('custom-display')) {
						// Get the custom text from the data-attribute.
						var customData = eventElement.data('customDisplay');

						// Add in the custom Text depending on which insertMethod used.
						if (insertMethod == 'append') $eventDateDisplay.append(dateLink + customData +'</a>');
						// For use with the addEvent method... creates new timeline events and places them where specified.
						else if (insertMethod == 'after') $arrangementEvent.after(dateLink + customData +'</a>');
						else $arrangementEvent.before(dateLink + customData +'</a>');
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
						if (insertMethod == 'append') $eventDateDisplay.append(dateLink + getMonthName(monthPart)  + '<br>' + yearPart +'</a>');
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
			}
		} // End eventDateDisplay() function
	} // End create() function

	Timeline.prototype._timelineComponents = function (timelineComponents) {
		// Cache timeline components 		
		timelineComponents['eventsContent'] = this.$element.children('.events-content');
		timelineComponents['eventsContentList'] = timelineComponents['eventsContent'].find('li');
		timelineComponents['eventsContentSelected'] = timelineComponents['eventsContent'].find('li.selected');
		
		timelineComponents['timelineWrapper'] = timelineComponents['eventsContent'].parent().find('.events-wrapper');
		timelineComponents['eventsWrapper'] = timelineComponents['timelineWrapper'].children('.events');
		timelineComponents['fillingLine'] = timelineComponents['eventsWrapper'].children('.filling-line');
		timelineComponents['timelineEvents'] = timelineComponents['eventsWrapper'].find('a');
		
		timelineComponents['timelineNavigation'] = timelineComponents['timelineWrapper'].siblings('.timeline-navigation');
	};
	
	Timeline.prototype._setup = function (self, timelineComponents, timelineTotalWidth) {
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
			.on('click.'+this._name, '.timeline-navigation a', $.proxy(function() {
				event.preventDefault();
				var $this = $(event.target);
				
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
			.on('click.'+this._name, '.events a', $.proxy(function() {
				event.preventDefault();
				var $this = $(event.target);
				
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
				this._updateTimelinePosition($this, timelineComponents);
			}, this));
		
		//** Autoplay **//
			
		if (this.settings.autoplay == true){
			// Define the progress bar html	
			var	$progressBar = '<div class="progressBarWrapper"><div class="progressBar"></div></div>',
				// Find and get the pause button html.
				$pauseButton = timelineComponents['timelineNavigation'].find('.pause')[0];
			// Create the progress bar.	
			timelineComponents['eventsContent'].prepend($progressBar);
			
			// Set a global variable to equal the function.	
			this._setup.autoplay = autoplay;	
			
			// Call the autoplay function.
			this._setup.autoplay(this, timelineComponents);
			
			// On click
			this.$element
				// On click of the element pause button, pass data to the event [pausebtnClicked, pausebtnHtml, state] and call the changeButtons function.
				.on('click.'+this._name, '.timeline-navigation .pause', [true, $pauseButton, 'paused'], $.proxy(this._setup.autoplay.changeButtons, this))
				// On click of the element play button, pass data to the event [pausebtnClicked, pausebtnHtml, state] and call the changeButtons function.
				.on('click.'+this._name, '.timeline-navigation .play', [false, $pauseButton, 'playing'], $.proxy(this._setup.autoplay.changeButtons, this));

			// Hover
			if (this.settings.autoplayPause_onHover == true) {
				var checkMQ = this._checkMQ();

				// Only execute hover code if device is not tinyMobile or mobile.
				if (checkMQ == 'smallTablet' || checkMQ == 'tablet' || checkMQ == 'desktop') {
					// On hover
					this.$element
						// On mouseenter of the element events-content, pass data to the event [pausebtnClicked, pausebtnHtml, state] and call the changeButtons function.
						.on('mouseenter.'+this._name, '.events-content', [false, $pauseButton, 'paused'], $.proxy(this._setup.autoplay.changeButtons, this))
						// On mouseleave of the element events-content, pass data to the event [pausebtnClicked, pausebtnHtml, state] and call the changeButtons function.
						.on('mouseleave.'+this._name, '.events-content', [false, $pauseButton, 'playing'], $.proxy(this._setup.autoplay.changeButtons, this));
				} // End checkMQ is desktop
			} // End autoplayPause_onHover this.settings
			
			
			/* Autoplay function */
			function autoplay(self, timelineComponents) {
				// NOTE: if autoplay cycle is paused, clicking any timeline button 
				// will not reset the autoplay cycle to play.
				
				// Set a global variable to equal the function.	
				self._setup.autoplay.countEvents = countEvents;	
				// Count events function	
				function countEvents() {
					// Get the total number of events to check against
					return timelineComponents['timelineEvents'].length;
				}
				var isPaused, 
					tick,
					percentTime,
					// Define an empty variable
					current, 
					// Get the speed from the settings.
					speed = Number(self.settings.autoplaySpeed),
					// Get the button wrapper.
					$pausePlay = self.$element.find('#pausePlay');
					
				// Set a global variable to equal the function.	
				self._setup.autoplay.start = start;		
				// Call the start function
				self._setup.autoplay.start(self);
				// Start function
				function start(self) {
					// Reset timer
					percentTime = 0;
					isPaused = false;
					// Get the timeline width	
					autoplayTimelineTotalWidth = self._setTimelineWidth(timelineComponents);
					// Run interval every 0.01 second
					tick = setInterval($.proxy(interval, self), 10);
				};
				// Interval function.
				function interval() {
					// If isPaused = false, start the autoplay cycle, otherwise pause the cycle.
					if(isPaused === false){
						// Set percentTime using the speed from the settings.
						// Check media queries...
						var checkMQ = this._checkMQ();
						// We need to adjust the calculations for percentTime because how slow it seems to be on mobile.
						// If mobile, set the correct speed
						if(checkMQ == 'tinyMobile' || checkMQ == 'mobile') percentTime += 3 / speed;
						// Everything else set the correct speed.
						else percentTime += 1 / speed;
						// Set the progress bar width 
						$('.progressBar').css({
							width: percentTime+"%"
						});
						// Recalculate the index of the current event, each time.
						// This is to make sure that if the user navigates to another event while playing or paused,
						// the current index will always reflect the current event,
						// otherwise autoplay may get out of sync.
						current = timelineComponents['eventsWrapper'].find('.selected').index();
								
						//if percentTime is equal or greater than 100
						if(percentTime >= 100){
							// If the current index is equal to the total number of events 
							if(current == this._setup.autoplay.countEvents()) {
								// Go back to the start of the cycle. 
								this._showNewContent(timelineComponents, autoplayTimelineTotalWidth, 'start');
								// Recalculate the current index to make sure it's reset back to 1 (the start).
								current = timelineComponents['eventsWrapper'].find('.selected').index();	
							}
							else {
							  // Go to next event content.
							  this._showNewContent(timelineComponents, autoplayTimelineTotalWidth, 'next');
							}
							// Add 1 to the current index
							current++;
						}
					} // End isPaused if statement
				} // End Interval function
				
				// Set a global variable to equal the function.	
				self._setup.autoplay.pause = pause;
				
				// Pause function
				function pause() {
					isPaused = true;
				}
				
				// Set a global variable to equal the function.	
				self._setup.autoplay.resume = resume;
				
				// Resume function
				function resume() {
					isPaused = false;	
				};
				
				// Set a global variable to equal the function.	
				self._setup.autoplay.moved = moved;
				
				// Moved function, when an event content has changed via autoplay or by manual navigation.
				function moved(self) {
					// If the pauseplay button doesn't have a clicked class
					if(!$pausePlay.hasClass('clicked')) {
						// Clear interval
						clearInterval(tick);
						// Restart the cycle.
						start(self);
					}
				}
				
				// Set a global variable to equal the function.		
				self._setup.autoplay.changeButtons = changeButtons;
				 
				// Change Buttons function
				function changeButtons(event) {
					// Get the event data
					var data = event.data,
						// Set variables using the corresponding data array selectors.
						pausebtnClicked = data[0],
						$pauseButton = data[1],
						state = data[2],
						// Find the pause play button wrapper.
						$pausePlay = this.$element.find('#pausePlay'),
						// Define the play button html
						$playButton = '<a href="" class="'+ this.settings.iconBaseClass +' '+ this.settings.play_iconClass +' play"></a>';
						
					// If the event type is click and pausebtnClicked is true (so the pause button was clicked)...
					if (event.type == "click" && pausebtnClicked == true) {
						// Add class to parent to check against it later to stop on hover from reactivating the play cycle.	
						$pausePlay.addClass('clicked');
						// Set a mouseEvent data to click on the element to check against later.
						this.$element.data('plugin_'+ this._name)['mouseEvent'] = 'click';
						// Change the button to the play button.
						$pausePlay.html($playButton);
						// Call the pause function to pause autoplay
						this._setup.autoplay.pause();
						console.log('Autoplay is '+state+'.');
					}
					// Else if the event type is click and pausebtnClicked is false (so the play button was clicked)...
					else if (event.type == "click" && !pausebtnClicked) {
						// Remove class from the parent
						$pausePlay.removeClass('clicked');
						// Set the mouseEvent data to false on the element.
						this.$element.data('plugin_'+ this._name)['mouseEvent'] = false;
						// Change the button to the pause button.
						$pausePlay.html($pauseButton);
						// Call the resume function to resume the autoplay cycle.
						this._setup.autoplay.resume();
						console.log('Autoplay is '+state+'.');
					}
					// If the event type is mouseenter (so it's paused) and the pause play button wrapper doesn't have the clicked class (paused via the pause button)...
					if(event.type == "mouseenter" && !$pausePlay.hasClass('clicked')) {
						// Set a mouseEvent data to hover on the element to check against later.
						this.$element.data('plugin_'+ this._name)['mouseEvent'] = 'hover';
						// Change the button to the play button.
						$pausePlay.html($playButton);
						// Call the pause function to pause autoplay
						this._setup.autoplay.pause();
						console.log('Autoplay is '+state+'.');
					}
					// Else if the event type is mouseleave (so it's playing) and the pause play button wrapper doesn't have the clicked class (paused via the pause button)...
					// To stop autoplay resuming the cycle on mouseleave if it's already paused via the pause button.
					else if(event.type == "mouseleave" && !$pausePlay.hasClass('clicked')) {
						// Set the mouseEvent data to false on the element.
						this.$element.data('plugin_'+ this._name)['mouseEvent'] = false;
						// Change the button to the pause button.
						$pausePlay.html($pauseButton);
						// Call the resume function to resume the autoplay cycle.
						this._setup.autoplay.resume();
						console.log('Autoplay is '+state+'.');
					}
				} // End changeButtons function			
				 
				// Set a global variable to equal the function.	
				self._setup.autoplay.refresh = refresh;
				
				function refresh(self) {
					self._timelineComponents(timelineComponents);
					autoplayTimelineTotalWidth = self._setTimelineWidth(timelineComponents);
				}
				
				// Set a global variable to equal the function.	
				self._setup.autoplay.destroy = destroy;
				
				// Destroy function, to destroy the autoplay interval.
				function destroy() {
					clearInterval(tick);
				}
			} // End autoplay function
		} // End Autoplay this.settings
		
		//** Go-to timeline link function **//
			
		// Linking to a specific date of a timeline
		
		// Set the go-to selector in a variable
		var goToTimelineLink = $('.goto-horizontal-timeline');
		
		// If go-to selector exists... 
		if(goToTimelineLink.length > 0) { 
			// On click
			goToTimelineLink.on('click.'+this._name, $.proxy(gotoTimeline, this));
				
			function gotoTimeline(event) {
				// Prevent default click
				event.preventDefault();
					// Set an empty object
				var timelineComponents = {},
					// Reference the button 
					$this = $(event.target),
					// Get the go-to href value of the button as the selector
					href = $this.attr('href'),
					// Reference the jQuery object selector only once
					$target = $(href),
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
				// Cache timeline components 
				// Find the .events-wrapper from the href selector
				timelineComponents['timelineWrapper'] = $target.find('.events-wrapper');
				// Find the .events
				timelineComponents['eventsWrapper'] = timelineComponents['timelineWrapper'].children('.events');
				// Find the .filling-line
				timelineComponents['fillingLine'] = timelineComponents['eventsWrapper'].children('.filling-line');
				// Find the event dates
				timelineComponents['timelineEvents'] = timelineComponents['eventsWrapper'].find('a');
				// Find the .timeline-navigation from the href selector
				timelineComponents['timelineNavigation'] = $target.find('.timeline-navigation');
				// Find the .events-content from the href selector
				timelineComponents['eventsContent'] = $target.children('.events-content');
				// Find the events content li
				timelineComponents['eventsContentList'] = timelineComponents['eventsContent'].find('li');
						
					// Get the data-gototimeline options object
				var datagoto = $this.data('gototimeline'),
					// Set empty variables
					date,
					speed,
					offset,
					easing,
					
					// Get the keys from the data object
					dataDate = datagoto.date,
					dataScrollSpeed = datagoto.scrollspeed,
					dataScrollOffset = datagoto.scrolloffset,
					dataScrollEasing = datagoto.scrolleasing,
					
					// Set the scroll defaults
					scrollDefaults = {
						"speed": 500, 
						"offset": 0, 
						"easing": "linear"
					};
				
				// If the data-gototimeline attribute exists...
				if (typeof datagoto !== 'undefined') {
					// Set the date from the data object
					date = dataDate;
					
					// The speed, offset, and easing data options are optional, 
					// so we need to check for their existance
					
					// If speed option exists, set the speed from the data object
					if (typeof dataScrollSpeed !== 'undefined') speed = dataScrollSpeed;
					// If not then set the speed to the default
					else speed = scrollDefaults.speed;
					// If offset option exists set offset from the data object
					if (typeof dataScrollOffset !== 'undefined') offset = dataScrollOffset;
					// If not then set the offset to the default
					else offset = scrollDefaults.offset;
					// If easing option exists set easing from the data object
					if (typeof dataScrollEasing !== 'undefined') easing = dataScrollEasing;
					// If not then set the easing to the default
					else easing = scrollDefaults.easing;
				}		

					// Attribute selector to find the event using the date 
				var	eventDate = 'a[data-date="'+ date +'"]',
					// Find all event dates.
					prevDates = timelineComponents['eventsWrapper'].find('a'),
					// Find the targeted event date using the date					
					selectedDate = timelineComponents['eventsWrapper'].find(eventDate),
					// Get the width value of the events (previously set)
					timelineTotalWidth = timelineComponents['eventsWrapper'].width();
				// If a link is targetting the timeline it sits in (itself), then execute the function to translate the timeline	
				if(targetSelf) translate_gotoTimeline(this);
				// If not, then use a smooth scroll and then execute the function afterwards.
				else {
					//** SmoothScroll functions **//
					
					// Smoothly scroll the document to the target
					$('html, body').stop().animate(
						{
							'scrollTop': $target.offset().top - offset
						}, 
						speed, 
						easing, 
						$.proxy(function() {
							// Once scrolling/animating the document is complete, update the target timeline.
							translate_gotoTimeline(this);
						}, this)
					); // End .animate function
				}
				// Function to translate the timeline to the specific date.
				function translate_gotoTimeline(pluginRef) {
					// Check if the targeted event hasn't already been selected, if not continue the code.						
					if (!selectedDate.hasClass('selected')) {
						// Remove all selected classes from dates
						prevDates.removeClass('selected');
						// Add a selected class to the date we are targeting
						selectedDate.addClass('selected');
						// Update other dates as an older event for styling
						pluginRef._updateOlderEvents(selectedDate);
						// Update the filling line upto the selected date
						pluginRef._updateFilling(selectedDate, timelineComponents['fillingLine'], timelineTotalWidth);
						// Update the visible content of the selected event
						pluginRef._updateVisibleContent(selectedDate, timelineComponents['eventsContent']);
					}
					// Translate (scroll) the timeline left or right according to the position of the targeted event date
					pluginRef._updateTimelinePosition(selectedDate, timelineComponents);
				} // End translate_gotoTimeline() translate function
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
							//this._showNewContent(timelineComponents, this._setTimelineWidth(timelineComponents), 'prev');	
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
	} // End _setup() function.
   
	/* Refresh public method 
	 *  - refreshes the timeline externally after initialisation.
	 *  Use it like: $('#example').horizontalTimeline('refresh');
	 */
	 Timeline.prototype.refresh = function () {
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
		this.init.addIdsAndClasses();	
			
		this._setDatePosition(timelineComponents);
		timelineTotalWidth = this._setTimelineWidth(timelineComponents);
		this._updateFilling(timelineComponents['eventsWrapper']
			.find('a.selected'), timelineComponents['fillingLine'], timelineTotalWidth);
			
		if(this.settings.autoplay == true) this._setup.autoplay.refresh(this);	
		console.log('refreshed #'+this.element.id);	
	}
	
	/* Destroy public method 
	 *  - destroys the timeline externally after initialisation.
	 * Removes all timeline created html and event handlers and resets the elements to the original state.
	 *  Use it like: $('#example').horizontalTimeline('destroy');
	 */
	Timeline.prototype.destroy = function () {
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
			this._setup.autoplay.destroy();
		}
		
		$this.removeData('plugin_' + pluginName);
		
		console.log('destroyed #'+this.element.id);
	}
	
	/* AddEvent public method 
	 * - adds a new event to the timeline externally after initialisation.
	 * Adds a new event content to the timeline at a specified location.
	 * Use it like: $('#example').horizontalTimeline('addEvent', [event content html], 'after', '01/01/2001'); 
	 * (new event content html, insertion method (before or after), an existing unique date to position the new content around.)
	 */
	Timeline.prototype.addEvent = function (html, insertMethod, arrangementDate) {
		this._timelineComponents(timelineComponents);
			// Make an data-date attribute selector with the arrangementDate
		var dataDate = '[data-date="'+ arrangementDate +'"]',
			newDate = html.split("data-date")[1].split('"'),
			// Select the specified event content
			$eventContent = timelineComponents['eventsContent'].find('li'+dataDate),
			// Find the selected event. 
			$selectedEvent = timelineComponents['eventsWrapper'].find('a.selected'),
			existingDates = this.$element.data('plugin_'+ this._name)['existingDates'];
			
		if(jQuery.inArray(newDate[1], existingDates) == -1) {	
			existingDates.push(newDate[1]);
			// If the insertMethod = before, then insert the new content before the specified date.	
			if (insertMethod == 'before') $eventContent.before(html);
			// Else the insertMethod = after, insert the new content after the specified date.
			else if (insertMethod == 'after') $eventContent.after(html);
			
			// Call the create.date function passing the insertMethod and arrangementDate arguments.
			// This creates the new timeline events before or after [inserMethod] specified date [arrangementDate].
			this._create.date(this, insertMethod, arrangementDate);
			// Update the olderEvents.
			this._updateOlderEvents($selectedEvent);
			// Call the refresh function to fresh the timeline accordingly.	
			this.refresh();
		}
	}
	
	/* RemoveEvent public method 
	 * - removes the specified event from the timeline externally after initialisation.
	 * Removes the event and the event content from the timeline using the unique date used in data-date.
	 * Use it like: $('#example').horizontalTimeline('removeEvent', '01/01/2001'); 
	 */
	Timeline.prototype.removeEvent = function (date) {
		this._timelineComponents(timelineComponents);
			// Make an data-date attribute selector with the date
		var dataDate = '[data-date="'+ date +'"]',
			// Select the specified timeline event
			$event = timelineComponents['eventsWrapper'].find('a'+dataDate),
			// Select the specified event content
			$eventContent = timelineComponents['eventsContent'].find('li'+dataDate),
			$newEvent;
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
			// Call the refresh function to fresh the timeline accordingly.	
			this.refresh();
		}
		// If the specified event is the only event, do nothing, since there should always be at least 1 event.
		else {
			console.warn('Timeline must always have at least 1 event after initialisation, therefore it can\'t be removed. Please use the Destroy method instead.');
		}
	} // End removeEvent() function
				
	Timeline.prototype._updateSlide = function (timelineComponents, timelineTotalWidth, string) {
		// Retrieve translateX value of timelineComponents['eventsWrapper']
		var translateValue = this._getTranslateValue(timelineComponents['eventsWrapper']),
			wrapperWidth = Number(timelineComponents['timelineWrapper'].width());
		// Translate the timeline to the left/right (also know as scroll left/scroll right)
		if (string == 'right') this._translateTimeline(timelineComponents, translateValue - wrapperWidth, wrapperWidth - timelineTotalWidth);
		else this._translateTimeline(timelineComponents, translateValue + wrapperWidth);	
	}
	
	Timeline.prototype._showNewContent = function (timelineComponents, timelineTotalWidth, string) {
		// Show prev/next content
			// Find the .selected content
		var visibleContent =  timelineComponents['eventsContent'].find('.selected'),
			// Find the prev/next content
			newContent = (string == 'next') ? visibleContent.next() : visibleContent.prev();
		// If a prev/next content exists...
		if (newContent.length > 0) {
			// Find the .selected event
			var selectedDate = timelineComponents['eventsWrapper'].find('.selected'),
				newEvent;
			// If start... (For Autoplay), find the first event	 
			if(string == 'start') newEvent = timelineComponents['eventsWrapper'].find('.first');
			// If next, find the next event from the current selected event
			else if (string == 'next') newEvent = selectedDate.next('a');
			// If prev, find the prev event from the current selected event
			else if (string == 'prev') newEvent = selectedDate.prev('a');
			this._updateVisibleContent(newEvent, timelineComponents['eventsContent']);
			newEvent.addClass('selected');
			selectedDate.removeClass('selected');
			this._updateFilling(newEvent, timelineComponents['fillingLine'], timelineTotalWidth);
			this._updateOlderEvents(newEvent);			
			this._updateTimelinePosition(newEvent, timelineComponents);
		}
	}
	
	Timeline.prototype._updateTimelinePosition = function (event, timelineComponents) {
			// Get the css left value of the targeted event date
		var eventLeft = Number(event.css('left').replace('px', '')),
			// Get the width value of the .events-wrapper
			timelineWidth = timelineComponents['timelineWrapper'].width(),
			// Get the width value of the events (previously set)
			timelineTotalWidth = timelineComponents['eventsWrapper'].width();
		this._translateTimeline(timelineComponents, - eventLeft + timelineWidth/2, timelineWidth - timelineTotalWidth); 
	}
	
	Timeline.prototype._translateTimeline = function (timelineComponents, value, totalTranslateValue) {
		// Only negative translate value
		var value = (value > 0) ? 0 : value; 
		// Do not translate more than timeline width
		value = (!(typeof totalTranslateValue === 'undefined') &&  value < totalTranslateValue ) ? totalTranslateValue : value;
		this._setTransformValue(timelineComponents['eventsWrapper'], 'translateX', value+'px');

		// Disable the buttons if necessary
		this._buttonStates(timelineComponents, value, totalTranslateValue);	
	}
	
	Timeline.prototype._updateFilling = function (selectedEvent, filling, totalTranslateValue) {
		// Change .filling-line length according to the selected event
			// Get the css left value of the selected event and remove the px unit
		var eventLeft = selectedEvent.css('left').replace('px', ''),
			// Get the css width value of the selected event and remove the px unit 
			eventWidth = selectedEvent.css('width').replace('px', '');
		// Add the left and width together and divide by 2
		eventLeft = Number(eventLeft) + Number(eventWidth)/2;
		// Divde the eventLeft and the totalTranslateValue to get the filling line value
		var scaleValue = eventLeft/totalTranslateValue;
		// Set the filling line value
		this._setTransformValue(filling, 'scaleX', scaleValue);
	}
	
	// Fixed intervals between dates specified in the options.
	Timeline.prototype._setDatePosition = function (timelineComponents) {
		var	distnew = 0,
			distprev = 0,
			startingNum = 0;
		
		this._setDateIntervals(timelineComponents);
		var checkMQ = this._checkMQ();
		if (this.settings.minimalFirstDateInterval == true || checkMQ == 'tinyMobile' || checkMQ == 'mobile') {
			// Set the 1st date to 0px on the timeline but with a padding left of 10px.	
			timelineComponents['timelineEvents'].first().css({'left': '0px','padding-left': '10px'});
			startingNum = 1;
		}
		// i start at 1, meaning starts at 2nd date.
		for (i = startingNum; i < timelineComponents['timelineEvents'].length; i++) {
			distnew = distprev + dateIntervals;
			timelineComponents['timelineEvents'].eq(i).css('left', distnew + 'px');
			distprev = distnew; 
		}		
				
	}
	
	Timeline.prototype._setTimelineWidth = function (timelineComponents) {
		var	totalWidth = 0,
			// Get wrapper width
			wrapperWidth = timelineComponents['timelineWrapper'].width(),
			// Get the css left value of the last event date, remove the px unit and add 100 to it.
			lastEventLeft = Number(timelineComponents['timelineEvents'].last().css('left').replace('px', '')) + 100;
		
		// Set the timeline width
		totalWidth = lastEventLeft;
		
		// Set a fail-safe, if totalWidth is less than the wrapperWidth then use the wrapperWidth as width.
		// Stops the timeline width from being too small.
		if (totalWidth < wrapperWidth) totalWidth = wrapperWidth;
	
		timelineComponents['eventsWrapper'].css('width', totalWidth+'px');
		this._updateTimelinePosition(timelineComponents['eventsWrapper'].find('a.selected'), timelineComponents);
	
		return totalWidth;
	}
	
	Timeline.prototype._updateVisibleContent = function (event, eventsContent) {
		var eventDate = event.data('date'),
			visibleContent = eventsContent.find('.selected'),
			selectedContent = eventsContent.find('[data-date="'+ eventDate +'"]'),
			selectedContentHeight = selectedContent.outerHeight();

		if (selectedContent.index() > visibleContent.index()) {
			var classEntering = 'selected enter-right',
				classLeaving = 'leave-left';
		} 
		else {
			var classEntering = 'selected enter-left',
				classLeaving = 'leave-right';
		}	
		
		// Add/remove classes to css animate them in and out.
		selectedContent.addClass(classEntering);
		visibleContent.addClass(classLeaving)
					  .one('webkitAnimationEnd.'+this._name+' oanimationend.'+this._name+' msAnimationEnd.'+this._name+' animationend.'+this._name, function(){
							visibleContent.removeClass('leave-right leave-left');
							selectedContent.removeClass('enter-left enter-right');
					  }).removeClass('selected');
					  
		eventsContent.height(selectedContentHeight+'px');			  
					  
		if (this.settings.autoplay == true && !this.$element.data('plugin_'+ this._name)['mouseEvent']) this._setup.autoplay.moved(this);
	}
	
	Timeline.prototype._updateOlderEvents = function (event) {
		event.prevAll('a').addClass('older-event').end()
			 .nextAll('a').removeClass('older-event');
		if (event.is('.selected')) event.removeClass('older-event');
	}
	
	Timeline.prototype._getTranslateValue = function (timeline) {
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
	}
	
	Timeline.prototype._setTransformValue = function (element, property, value) {
		element.css({
			"-webkit-transform": property + "("+value+")",
			"-moz-transform": property + "("+value+")",
			"-ms-transform": property + "("+value+")",
			"-o-transform": property + "("+value+")",
			"transform": property + "("+value+")"
		});
	}
	
	/* How to tell if a DOM element is visible in the current viewport?
	   http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport */
	Timeline.prototype._elementInViewport = function (el) {
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
	}
	
	Timeline.prototype._setDateIntervals = function (timelineComponents) {
		var checkMQ = this._checkMQ();		
		// If mobile is detected, set dateIntervals to mobile
		if (checkMQ == 'tinyMobile' || checkMQ == 'mobile') dateIntervals = this.settings.mobileDateIntervals;
		// If tablet is detected, set dateIntervals to tablet
		else if (checkMQ == 'smallTablet' || checkMQ == 'tablet') dateIntervals = this.settings.tabletDateIntervals;
		// If not, set to desktop intevals
		else if (checkMQ == 'desktop') dateIntervals = this.settings.desktopDateIntervals;
		// Set a minimum value for the intervals.
		var minimumInterval = 120;
		// If dateIntervals options are set to below the minimum value, then change it.
		if (dateIntervals < minimumInterval) dateIntervals = minimumInterval;
	}
	
	Timeline.prototype._checkMQ = function () {
		// Check for mobile, table or desktop device
		// https://stackoverflow.com/a/14913306/2358222
		return window.getComputedStyle(this.element,':before').content.replace(/'/g, "").replace(/"/g, "");
	}
	
	//** Button States **//
	
	// Function to add or remove inactive class to next button depending on whether the last item is selected or not	
	Timeline.prototype._buttonStates = function (timelineComponents, translateValue, totalTranslateValue){
		var nextButton = timelineComponents['timelineNavigation'].find('.next'),
			prevButton = timelineComponents['timelineNavigation'].find('.prev'),
			
			leftButton = timelineComponents['timelineNavigation'].find('.scroll-left'),
			rightButton = timelineComponents['timelineNavigation'].find('.scroll-right'),
			
			firstEvent = timelineComponents['timelineWrapper'].find('.first'),
			lastEvent = timelineComponents['timelineWrapper'].find('.last'),
			// Get the wrapper width
			wrapperWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', '')),
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
	
			// If last event is selected, then diable the next button
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
	} // End buttonStates() function
	
	// Function to add required js and css files dynamically
	// (CDN URL of the plugin, file type JS or CSS, callback function)				 
	Timeline.prototype._addFile = function (url, type, callback) {		
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
			if(js) fileExists = $('script[src*="'+name+'"');

			// Else if css, check if the name is in a href attribute in a <link> tag
			else if (css) fileExists = $('link[href*="'+name+'"');

			// If loadedFile is undefined/not set, create a new array for the loaded files.
			if (loadedFile == undefined) loadedFile = new Array();

			// If loadedFile array doesn't include the url AND
			// the file doesn't exist in the document...

			// Using !loadedFile.includes(url) would be more ideal,
			// but due to no support in IE11, we can't use it.
			if (loadedFile.indexOf(url) == -1 && !fileExists.length) {
				// File isn't loaded yet...				
				// If adding js...
				if(js) {
					console.log(name + ' plugin isn\'t loaded.', this.$element);	
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
					console.log(name + ' was loaded dynamically.', this.$element);	
				}
				// Else if adding CSS...
				else if (css) {
					console.log(name + ' isn\'t loaded.');
					// Add a the CSS file in a new <link> after the last <link> in the head.
					$('<link>').attr({'href':url, 'rel':'stylesheet', 'type':"text/css"}).insertAfter(
						$('head').find('link').last()
					);
					console.log(name + ' was loaded dynamically.');
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
					console.log(name+' has already been loaded by a <script> tag in the document, no need to load it again. Timeline instance:', this.$element);
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
					console.log(name+' has already been loaded, no need to load it again. Timeline instance:', this.$element);
					// Execute the plugin via the callback option.
					// Check if callback is a function, if it is then set a variable as the callback to be called.
					if (typeof callback === "function") callback(this);
				}
			}

			if(js) {
				console.log(name+" executed on timeline instance: ", this.$element);
			}
			// Save the loadedFile array as data to the body to be able to reload it next time it's accessed.
			$('body').data('plugin_'+ this._name +'_loadedFile', loadedFile);
		} // End if addRequiredFile statement.
		// If addRequiredFile is false we just need to execute the plugin via the callback option.
		else {
			// Check if callback is a function, if it is then set a variable as the callback to be called.
			if (typeof callback === "function") callback(this);
		}
	} // End addFile function

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations and allowing any
    // public function (ie. a function whose name doesn't start
    // with an underscore) to be called via the jQuery plugin,
    // e.g. $(element).defaultPluginName('functionName', arg1, arg2)
    $.fn[pluginName] = function ( options ) {
        var args = arguments,
	    windowWidth = $(window).width(),
	    dateExists = $(this).find('.events-content').find('li').map(function() {
		return $(this).data('date');
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
                    $.data(this, 'plugin_' + pluginName, 
			   {'originalEventsContent': $(this).find('.events-content').clone()[0], 
			    'windowWidth': windowWidth, 
			    'existingDates': dateExists, 
			    'Timeline': new Timeline(this, options)
		    	   }
		    );
                }
            });

        // If the first parameter is a string and it doesn't start
        // with an underscore or "contains" the `init`-function,
        // treat this as a call to a public method.
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

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
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }
            });

            // If the earlier cached method
            // gives a value back return the value,
            // otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
    };

})( jQuery, window, document );
