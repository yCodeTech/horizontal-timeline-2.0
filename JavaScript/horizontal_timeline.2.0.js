/* -------------------------------- 

Horizontal Timeline 2.0
    by Studocwho

Docs at http://horizontal-timeline.ycodetech.co.uk

-------------------------------- */


(function($) {
	$.fn.timeline = function(options) {
		var settings = $.extend({
			desktopDateIntervals: 200,   //************\\
			tabletDateIntervals: 150,   // Minimum: 120 \\
			mobileDateIntervals: 120,  //****************\\
			minimalFirstDateInterval: true,
			
			dateDisplay: "dateTime", // dateTime, date, time, dayMonth, monthYear, year
			
			autoplay: false,
			autoplaySpeed: 8000, // ms ... e.g. 1000 ms = 1 sec
			autoplayPause_onHover: false, 
			
			useScrollWheel: false,
			useTouchSwipe: true,
			useKeyboardKeys: false
		}, options);

		// Cache some variables to use later.
			// Get the id selector.
		var $selector = '#' + this.attr('id'),
			// Select the element with the id selector and store it as a variable to be used later.
			timeline = $($selector),
			// Find the event-content li.
			eventsContentLi = timeline.find('li');
		
		// Check to see if event-content li exist. If so, initialise the plugin.
		if(eventsContentLi.length > 0) initTimeline(timeline);
		// If not then display some html saying so.
		else timeline.css('opacity', 1).html('<h3>There are no events at this point in time.<br><br>Please add some content.</h3>');
		// Initiate the timeline
		function initTimeline(timeline) {
			// Add the required font awesome css file to document head.
			// https://fontawesome.com/v4.7.0/
			// Required for the button icons.
			
				// Cache a variable for the url on CDN
			var url = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css";
			
			// Function to load the file
			// (name of the plugin, url, type)	
			addFile('Font-Awesome', url, 'css');
				
			// Cache variables 
			var timelineComponents = {},
				// Dynamically creates the timeline according to how many events there are.			
				$timelineWrapper = '<div class="timeline"></div>',
				$timelineEventsWrapper = '<div class="events-wrapper"><div class="events"><span class="filling-line" aria-hidden="true"></span></div></div>',
				
				// All buttons uses Font Awesome for the icons
				// Icons require Font Awesome CSS
				// This CSS file has been added to the document if not already present.
				
				// Left Nav
				$leftNav = '<div class="cd-timeline-navigation" id="leftNav"></div>',
				$prevButton = '<a href="" class="fa fa-3x fa-arrow-circle-left prev inactive"></a>',
				$scrollLeftButton = '<a href="" class="fa fa-3x fa-chevron-circle-left scroll-left inactive"></a>',
				
				// Right Nav
				$rightNav = '<div class="cd-timeline-navigation" id="rightNav"></div>',
				$nextButton = '<a href="" class="fa fa-3x fa-arrow-circle-right next"></a>',
				$scrollRightButton = '<a href="" class="fa fa-3x fa-chevron-circle-right scroll-right"></a>',
				
				// Pause/Play Nav
				$pausePlayWrapper = '<div class="cd-timeline-navigation" id="pausePlay"></div>',
				$pauseButton = '<a href="" class="fa fa-3x fa-pause-circle pause"></a>',
				$playButton = '<a href="" class="fa fa-3x fa-play-circle play"></a>';

			//** Create the timeline HTML **//
			timeline.prepend($timelineWrapper)
				.find('.timeline').append($timelineEventsWrapper).append($leftNav).append($rightNav)
				.find('#leftNav').append($prevButton).append($scrollLeftButton).end()
				.find("#rightNav").append($nextButton).append($scrollRightButton);
			// Autoplay buttons	
			// If autoplay is true, create the pause button
 			if (settings.autoplay == true)	
				timeline.find('.timeline').append($pausePlayWrapper).find('#pausePlay').append($pauseButton);

			//** Create the HTML for the event date display **//

			/* dateTime = the date and time */
			if(settings.dateDisplay == "dateTime") {
				timeline.children('.events-content').find('li').each(function() {
					eventDateDisplay($(this), "dateTime");
				});
			}
			/* date = the date only */
			else if (settings.dateDisplay == "date") {
				timeline.children('.events-content').find('li').each(function() {	
					eventDateDisplay($(this), "date");
				});
			}
			/* time = the time only */
			else if (settings.dateDisplay == "time") {
				timeline.children('.events-content').find('li').each(function() {	
					eventDateDisplay($(this), "time");
				});
			}
			/* dayMonth = the day and monthName only */
			else if (settings.dateDisplay == "dayMonth") {
				timeline.children('.events-content').find('li').each(function() {
					eventDateDisplay($(this), "dayMonth");
				});
			}
			/* monthYear = the monthName and year only */
			else if (settings.dateDisplay == "monthYear") {
				timeline.children('.events-content').find('li').each(function() {
					eventDateDisplay($(this), "monthYear");
				});		
			}			
			/* year = the year only */
			else if (settings.dateDisplay == "year") {
				timeline.children('.events-content').find('li').each(function() {
					eventDateDisplay($(this), "year");
				});
			}	
			/* Function to create the event date display */
			function eventDateDisplay(element, display) {
					// Get date from data-date attribute
				var	dataDate = element.data('date');
					// Check if element data-date format is DD/MM/YYYYTHH:MM by checking for 'T'
					isDateTime = element.is('[data-date*="T"]'),
					// Check if element data-date format is HH:MM by checking for ':' but doesn't have 'T'
					isTime = element.not('[data-date*="T"]').is('[data-date*=":"]'),
					// Display type checks
					dateTimeDisplay = display == "dateTime",
					dateDisplay = display == "date",
					timeDisplay = display == "time",
					dayMonthDisplay = display == "dayMonth",
					monthYearDisplay = display == "monthYear",
					yearDisplay = display == "year",
					// Find .events for the date display
					$eventDateDisplay = timeline.find('.events'),
					// Create an array of the months, with the index 0 = null, 
					// so that we can get the month by its corresponding index number.
					months = [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
					monthName = months,
					dateLink = '<a href="" data-date="'+ dataDate +'">';
						
					// Function to add the number suffix st, nd, rd, th (eg: 1st, 2nd, 3rd, 4th)
					function numSuffix(num) {
						if (num > 3 && num < 21) return 'th'; 
						switch (num % 10) {
							case 1:  return "st";
							case 2:  return "nd";
							case 3:  return "rd";
							default: return "th";
						}
					}
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
						if(dateTimeDisplay) $eventDateDisplay.append(dateLink + date +'<br>'+ time +'</a>');
						
						else if(dateDisplay) $eventDateDisplay.append(dateLink + date +'</a>');
						
						else if(timeDisplay) $eventDateDisplay.append(dateLink + time +'</a>');
							
						else if(dayMonthDisplay) $eventDateDisplay.append(dateLink + dayPart + numSuffix(dayPart) + '<br>' + monthName[monthPart]+'</a>');
						
						else if(monthYearDisplay) $eventDateDisplay.append(dateLink + monthName[monthPart] + '<br>' + yearPart +'</a>');
						
						else if(yearDisplay) $eventDateDisplay.append(dateLink + yearPart +'</a>');
					}
					// Time format (HH:MM)
					else if (isTime) {
						var time = dataDate;
						/* Add the event date displays according to the display types */
						if(dateTimeDisplay || timeDisplay) $eventDateDisplay.append(dateLink + time +'</a>');	
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
						if(dateTimeDisplay || dateDisplay) $eventDateDisplay.append(dateLink + date +'</a>');
						
						if(dayMonthDisplay) $eventDateDisplay.append(dateLink + dayPart + numSuffix(dayPart) + '<br>' + monthName[monthPart]+'</a>');
								
						if(monthYearDisplay) $eventDateDisplay.append(dateLink + monthName[monthPart] + '<br>' + yearPart +'</a>');
						
						if(yearDisplay) $eventDateDisplay.append(dateLink + yearPart +'</a>');
					}				
			} // End eventDateDisplay() function		
							
			// Cache timeline components 
			timelineComponents['timelineWrapper'] = timeline.find('.events-wrapper');
			timelineComponents['eventsWrapper'] = timelineComponents['timelineWrapper'].children('.events');
			timelineComponents['fillingLine'] = timelineComponents['eventsWrapper'].children('.filling-line');
			timelineComponents['timelineEvents'] = timelineComponents['eventsWrapper'].find('a');
			timelineComponents['timelineNavigation'] = timeline.find('.cd-timeline-navigation');
			timelineComponents['eventsContent'] = timeline.children('.events-content');
			timelineComponents['eventsContentLi'] = timelineComponents['eventsContent'].find('li');
			
			//** Adding IDs and Classes **//
				
			// Adds id to the first li of the event-content list.
			timelineComponents['eventsContentLi'].first().attr('id', 'first');
			// Adds id to the last li of the event-content list.
			timelineComponents['eventsContentLi'].last().attr('id', 'last');	
			// Adds class to the first timeline event date.
			timelineComponents['timelineEvents'].first().addClass("first");
			timelineComponents['timelineEvents'].last().addClass("last");
			
			//** Select the correct event **//
			
			// If any events-content has .selected class...
			if (timelineComponents['eventsContentLi'].hasClass('selected')) {
					// Set variable of the selected events-content
				var	$this = timelineComponents['eventsContent'].find('li.selected'),
					// Get date from data-date attribute
					date = $this.data('date'),
					// Find the event date matching the data-date
					selectedDate = timelineComponents['eventsWrapper'].find('a[data-date="'+date+'"]');
					
				// Add .selected class to the matched element
				selectedDate.addClass('selected');
				// Update all previous dates for styling.
				updateOlderEvents(selectedDate);
			}
			// If no class found at all...
			else {
				// Add .selected class to the first events-content
				timelineComponents['eventsContent'].find('li#first').addClass('selected');
				// Add .selected class to the first event date
				timelineComponents['eventsWrapper'].find('a.first').addClass('selected');
			}
			
			// Assign a left postion to the single events along the timeline
			setDatePosition(timelineComponents);
			// Assign a width to the timeline
			var timelineTotalWidth = setTimelineWidth(timelineComponents);
			// The timeline has been initialised - show it
			timeline.addClass('loaded');
			
			// On window resize, change the timeline accordingly.
			$(window).resize(function(e) {
				setDateIntervals();	
				setDatePosition(timelineComponents);
				timelineTotalWidth = setTimelineWidth(timelineComponents);	
			});
			
			//** Navigation button function **//
			
			// Stop click events on the .inactive buttons
				timelineComponents['timelineNavigation'].on('click', '.inactive', function(event){
					event.stopImmediatePropagation();
					return(false);
				});
			
			// Button on click...
			timelineComponents['timelineNavigation'].on('click', 'a', function(event){
				event.preventDefault();
				// If next button clicked, shows next content
				if($(this).is('.next')) showNewContent(timelineComponents, timelineTotalWidth, 'next');
				// If prev button clicked shows prev content
				if($(this).is('.prev')) showNewContent(timelineComponents, timelineTotalWidth, 'prev');
				// If scroll-right button clicked, scrolls timeline right
				if($(this).is('.scroll-right')) updateSlide(timelineComponents, timelineTotalWidth, 'right');
				// If scroll-left button clicked, scrolls timeline left
				if($(this).is('.scroll-left')) updateSlide(timelineComponents, timelineTotalWidth, 'left');
			});
			
			//** Event date function **//	
					
			// Detect click on a single event date = show new event content
			timelineComponents['eventsWrapper'].on('click', 'a', function(event){
				var $this = $(this);
				event.preventDefault();
				// Remove selected class from all dates.
				timelineComponents['timelineEvents'].removeClass('selected');
				// Add class to the event date clicked.
				$this.addClass('selected');
				// Update all other previous event dates for styling
				updateOlderEvents($this);
				// Update the timeline filling line.
				updateFilling($this, timelineComponents['fillingLine'], timelineTotalWidth);
				// Change the event content to match the selected event.
				updateVisibleContent($this, timelineComponents['eventsContent']);
				// Translate (scroll) the timeline left or right according to the position of the targeted event date
				updateTimelinePosition($this, timelineComponents);
			});		
			
			//** Autoplay **//
			
			if (settings.autoplay == true){	
					// Set isPaused to false, so we start the autoplay loop on load
				var	isPaused = false,
					// Define an empty variable
					current, 
					// Get the total number of events to check against
					eventsLength = timelineComponents['timelineEvents'].length;
				
				setInterval(function(){
					// If isPaused = false, start the autoplay cycle, otherwise pause the cycle.
					if(!isPaused) {
						// Recalculate the index of the current event, each time.
						// This is to make sure that if the user navigates to another event while playing or paused,
						// the current index will always reflect the current event,
						// otherwise autoplay may get out of sync.
						current = timelineComponents['eventsWrapper'].find('.selected').index();
						// If the current index is equal to the total number of events 
						if(current == eventsLength) {
							// Go back to the start of the cycle. 
							showNewContent(timelineComponents, timelineTotalWidth, 'start');
							// Recalculate the current index to make sure it's reset back to 1 (the start).
							current = timelineComponents['eventsWrapper'].find('.selected').index();	
						}
						else {
							// Go to next event content.
							showNewContent(timelineComponents, timelineTotalWidth, 'next');
						}
						// Add 1 to the current index
						current ++;
					}
				}, settings.autoplaySpeed); // Speed
				
				// NOTE: if autoplay cycle is paused, clicking any timeline button 
				// will not reset the autoplay cycle to play.
				
				// On click of pause button
				timelineComponents['timelineNavigation'].on('click','.pause', function(e) {
					e.preventDefault();
					// Set isPaused to true to pause the cycle.
					isPaused = true;
					// Change the html of the button to a play button
					// Add class to parent to check against it later to stop on hover from reactivating the play cycle.
					timeline.find('#pausePlay').html($playButton).addClass('clicked');	
					console.log('Autoplay is paused.');					
				});
				// On click of play button
				timelineComponents['timelineNavigation'].on('click','.play', function(e) {
					e.preventDefault();
					// Set isPaused to false to play the cycle.
					isPaused = false;
					// Change html of the button back to a pause button
					timeline.find('#pausePlay').html($pauseButton).removeClass('clicked');
					console.log('Autoplay is playing.');
				});
				// Hover
				if (settings.autoplayPause_onHover == true) {
					
					var $pausePlay = $('#pausePlay', $selector);
					
					// Only execute hover code if device is desktop
					if (checkMQ() == 'desktop' ) {
						timelineComponents['eventsContentLi'].hover(
							function() {
								// If button parent doesn't have class .clicked continue the function
									// This is to make sure that if the pause button was clicked,
									// that we don't reactivate the play cycle on hover.
								if(!$pausePlay.hasClass('clicked')) {
									// Hover in
	
									// Set isPaused to true to pause the cycle.
									isPaused = true;
									// Change the html of the button to a play button
									$pausePlay.html($playButton);	
									console.log('Autoplay is paused.');
								}
							}, // End hover in
							function() {
								if(!$pausePlay.hasClass('clicked')) {
									// Hover out
									
									// Set isPaused to false to play the cycle.
									isPaused = false;
									// Change html of the button back to a pause button
									$pausePlay.html($pauseButton);	
									console.log('Autoplay is playing.');
								}
							} // End hover out
						); // End hover function
					} // End checkMQ is desktop
				} // End autoplayPause_onHover settings
			} // End Autoplay settings
			
			
			//** Go-to timeline link function **//
			
			// Linking to a specific date of a timeline
			
			// Set the go-to selector in a variable
			var goToTimelineLink = $('.goto-horizontal-timeline');
			
			// If go-to selector exists... 
			if(goToTimelineLink.length > 0) { 
				// On click
				goToTimelineLink.click(function(event) {
					// Prevent default click
					event.preventDefault();
						// Set an empty object
					var timelineComponents = {},
						// Reference the button 
						$this = $(this),
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
						var gotoself = '#' + $this.parents('.cd-horizontal-timeline').attr('id');
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
					// Find the .cd-timeline-navigation from the href selector
					timelineComponents['timelineNavigation'] = $target.find('.cd-timeline-navigation');
					// Find the .events-content from the href selector
					timelineComponents['eventsContent'] = $target.children('.events-content');
					// Find the events content li
					timelineComponents['eventsContentLi'] = timelineComponents['eventsContent'].find('li');
							
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
					if(targetSelf) goToTimeline();
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
							function() {
								// Once scrolling/animating the document is complete, update the target timeline.
								goToTimeline();
							}
						); // End .animate function
					}
					// Function to translate the timeline to the specific date.
					function goToTimeline() {
						// Check if the targeted event hasn't already been selected, if not continue the code.						
						if (!selectedDate.hasClass('selected')) {
							// Remove all selected classes from dates
							prevDates.removeClass('selected');
							// Add a selected class to the date we are targeting
							selectedDate.addClass('selected');
							// Update other dates as an older event for styling
							updateOlderEvents(selectedDate);
							// Update the filling line upto the selected date
							updateFilling(selectedDate, timelineComponents['fillingLine'], timelineTotalWidth);
							// Update the visible content of the selected event
							updateVisibleContent(selectedDate, timelineComponents['eventsContent']);
						}
						// Translate (scroll) the timeline left or right according to the position of the targeted event date
						updateTimelinePosition(selectedDate, timelineComponents);
					} // End goToTimeline() translate function
				}); // End .click function						
			} // End goToTimelineLink
			
			//** Mouse wheel function **//
			// Requires the jQuery plugin mouse wheel: https://github.com/jquery/jquery-mousewheel
			// Mouse wheel support for "scrolling" the events content.
			if(settings.useScrollWheel == true) {
					// The URL to the plugin on CDN
				var url = "https://cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js";
				
				// Function to load the Mousewheel plugin (name of the plugin, url, type, callback)
				addFile('mousewheel', url, 'js', function() {
					// Wait 300ms whilst the Mousewheel script loads
					window.setTimeout(function(){
						// On mousewheel of .events-content, show next/prev event content
						timelineComponents['eventsContent'].on('mousewheel', function(e){
								// Scroll Up = show previous content
								if (e.deltaY > 0) showNewContent(timelineComponents, timelineTotalWidth, 'prev');
								// Scroll Down = show next content
								else showNewContent(timelineComponents, timelineTotalWidth, 'next');
								// Prevent the normal document scroll
								e.preventDefault();
						});	// End .on function
					}, 300); // End setTimeout function
				}); // End addFile function
			} // End scrollWheel setting
			
			//** TouchSwipe function **//
			// Requires the jQuery plugin TouchSwipe: http://labs.rampinteractive.co.uk/touchSwipe/demos/index.html
			// TouchSwipe has more events/options than jQuery Mobile
			if(settings.useTouchSwipe == true){		
					// The URL to the plugin on CDN				
				var url = "https://cdnjs.cloudflare.com/ajax/libs/jquery.touchswipe/1.6.18/jquery.touchSwipe.min.js";
					
				// Function to load the TouchSwipe plugin (name of the plugin, url, type, callback)
				addFile('TouchSwipe', url, 'js', function() {
					// Wait 300ms whilst the TouchSwipe script loads
					window.setTimeout(function(){
						// On swipe of .events-content, show next/prev event content
						timelineComponents['eventsContent'].swipe({	
						
							// Swipe right to go left (previous)
							swipeRight:function(event, direction, distance, duration, fingerCount) {
								// Show previous content on swipeRight
								showNewContent(timelineComponents, timelineTotalWidth, 'prev');	
							}, 
							// Swipe left to go right (next)
							swipeLeft:function(event, direction, distance, duration, fingerCount) {	
								// Show next content on swipeLeft
								showNewContent(timelineComponents, timelineTotalWidth, 'next');								
							},
							// Swipe distance... 0 = any distance in px
							threshold:75,
						}); // End TouchSwipe Event
						
						/* Swipe function for the timeline wrapper*/
						// So that we can scroll the timeline with a swipe.
						
						timelineComponents['timelineWrapper'].swipe({
							// Swipe right to scroll the timeline left
							swipeRight:function(event, direction, distance, duration, fingerCount) {
									// Get the current translate value
								var translateValue = getTranslateValue(timelineComponents['eventsWrapper']),
									// Get the width of the timeline wrapper.
									wrapperWidth = Number(timelineComponents['timelineWrapper'].width());
									
								// Translate the timeline to the left (also know as scroll left)
								// according to the amount of distance swiped.
							   	translateTimeline(timelineComponents, distance + translateValue, wrapperWidth - timelineTotalWidth);
							}, 
							// Swipe left to scroll the timeline right
							swipeLeft:function(event, direction, distance, duration, fingerCount) {	
									// Get the current translate value
								var translateValue = getTranslateValue(timelineComponents['eventsWrapper']),
									// Get the width of the timeline wrapper.
									wrapperWidth = Number(timelineComponents['timelineWrapper'].width());
									
								// Translate the timeline to the right (also know as scroll right)
								// according to the amount of distance swiped.
							   	translateTimeline(timelineComponents, -distance + translateValue, wrapperWidth - timelineTotalWidth);
							},
							// Swipe distance... 0 = any distance in px
							threshold:30,  
							}
						); // End TouchSwipe Event
					}, 500); // End setTimeout function
				}); // End addFile function
				
				// Add a touch-enabled class to the necessary elements.
				timelineComponents['timelineWrapper'].addClass('touch-enabled')
					.parent().siblings('.events-content').addClass('touch-enabled');
			} // End useTouchSwipe settings

			// Keyboard navigation
			if(settings.useKeyboardKeys == true) {
				// On keyup
				$(document).keyup(function(event){
					// If Left arrow (keyCode 37) AND the timeline is in the viewport, show prev content
					if(event.which=='37' && elementInViewport(timeline.get(0)))
						showNewContent(timelineComponents, timelineTotalWidth, 'prev');
					// If Right arrow (keyCode 39) AND the timeline is in the viewport, show next content
					else if(event.which=='39' && elementInViewport(timeline.get(0)))
						showNewContent(timelineComponents, timelineTotalWidth, 'next');
				});
			}
			console.log($selector,'initialised');
		} // End initTimeline function
		function updateSlide(timelineComponents, timelineTotalWidth, string) {
			// Retrieve translateX value of timelineComponents['eventsWrapper']
			var translateValue = getTranslateValue(timelineComponents['eventsWrapper']),
				wrapperWidth = Number(timelineComponents['timelineWrapper'].width());
			// Translate the timeline to the left/right (also know as scroll left/scroll right)
			if (string == 'right') translateTimeline(timelineComponents, translateValue - wrapperWidth, wrapperWidth - timelineTotalWidth);
			else translateTimeline(timelineComponents, translateValue + wrapperWidth);	
		}
		function showNewContent(timelineComponents, timelineTotalWidth, string) {
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
				
				updateFilling(newEvent, timelineComponents['fillingLine'], timelineTotalWidth);
				updateVisibleContent(newEvent, timelineComponents['eventsContent']);
				newEvent.addClass('selected');
				selectedDate.removeClass('selected');
				updateOlderEvents(newEvent);			
				updateTimelinePosition(newEvent, timelineComponents);
			}
		}
		function updateTimelinePosition(event, timelineComponents) {
				// Get the css left value of the targeted event date
			var eventLeft = Number(event.css('left').replace('px', '')),
				// Get the width value of the .events-wrapper
				timelineWidth = timelineComponents['timelineWrapper'].width(),
				// Get the width value of the events (previously set)
				timelineTotalWidth = timelineComponents['eventsWrapper'].width();
			translateTimeline(timelineComponents, - eventLeft + timelineWidth/2, timelineWidth - timelineTotalWidth); 
		}
		function translateTimeline(timelineComponents, value, totalTranslateValue) {
			// Only negative translate value
			var value = (value > 0) ? 0 : value; 
			// Do not translate more than timeline width
			value = (!(typeof totalTranslateValue === 'undefined') &&  value < totalTranslateValue ) ? totalTranslateValue : value;
			setTransformValue(timelineComponents['eventsWrapper'], 'translateX', value+'px');

			// Disable the buttons if necessary
			buttonDisable(timelineComponents, value, totalTranslateValue);	
		}
		function updateFilling(selectedEvent, filling, totalTranslateValue) {
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
			setTransformValue(filling, 'scaleX', scaleValue);
		}
		// Fixed intervals between dates specified in the options.
		function setDatePosition(timelineComponents) {
			var	distnew = 0,
				distprev = 0,
				startingNum = 0;
			
			setDateIntervals();
				
			if (settings.minimalFirstDateInterval == true || checkMQ() == 'tinyMobile' || checkMQ() == 'mobile') {
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
		function setTimelineWidth(timelineComponents) {
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
			updateFilling(timelineComponents['eventsWrapper'].find('a.selected'), timelineComponents['fillingLine'], totalWidth);
			updateTimelinePosition(timelineComponents['eventsWrapper'].find('a.selected'), timelineComponents);
		
			return totalWidth;
		}
		function updateVisibleContent(event, eventsContent) {
			var eventDate = event.data('date'),
				visibleContent = eventsContent.find('.selected'),
				selectedContent = eventsContent.find('[data-date="'+ eventDate +'"]'),
				selectedContentHeight = selectedContent.height();
	
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
						  .one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
								visibleContent.removeClass('leave-right leave-left');
								selectedContent.removeClass('enter-left enter-right');
						  }).removeClass('selected');
			/*eventsContent.css('height', selectedContentHeight+'px');*/
		}
		function updateOlderEvents(event) {
			event.prevAll('a').addClass('older-event').end().nextAll('a').removeClass('older-event');
			if (event.is('.selected')) event.removeClass('older-event');
		}
		function getTranslateValue(timeline) {
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
		function setTransformValue(element, property, value) {
			element.css({
				"-webkit-transform": property + "("+value+")",
				"-moz-transform": property + "("+value+")",
				"-ms-transform": property + "("+value+")",
				"-o-transform": property + "("+value+")",
				"transform": property + "("+value+")"
			});
		}
		/*
			How to tell if a DOM element is visible in the current viewport?
			http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
		*/
		function elementInViewport(el) {
			var top = el.offsetTop;
			var left = el.offsetLeft;
			var width = el.offsetWidth;
			var height = el.offsetHeight;
	
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
		function setDateIntervals() {		
			// If mobile is detected, set dateIntervals to mobile
			if (checkMQ() == 'tinyMobile' || checkMQ() == 'mobile') dateIntervals = settings.mobileDateIntervals;
			// If tablet is detected, set dateIntervals to tablet
			else if (checkMQ() == 'smallTablet' || checkMQ() == 'tablet') dateIntervals = settings.tabletDateIntervals;
			// If not, set to desktop intevals
			else if (checkMQ() == 'desktop') dateIntervals = settings.desktopDateIntervals;
			// Set a minimum value for the intervals.
			var minimumInterval = 120;
			// If dateIntervals options are set to below the minimum value, then change it.
			if (dateIntervals < minimumInterval) dateIntervals = minimumInterval;
		}
		function checkMQ() {
			// Check for mobile, table or desktop device
			return window.getComputedStyle(document.querySelector($selector), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
		}
		// Function to add or remove disabled class to next button depending on whether the last item is selected or not	
		function buttonDisable(timelineComponents, translateValue , totalTranslateValue){
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
			
			// If first event is selected, then disable the prev button
			if(firstEvent.is('.selected')) prevButton.addClass('inactive');
			// If not, then enable the prev button
			else prevButton.removeClass('inactive');

			// If last event is selected, then diable the next button
			if(lastEvent.is('.selected')) nextButton.addClass('inactive');
			// If not, then enable the next button
			else nextButton.removeClass('inactive');	

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
		} // End buttonDisable() function
		
		
		// Function to add required js and css files dynamically
		// (name of the plugin, CDN URL of the plugin, file type JS or CSS, callback function)				 
		function addFile(name, url, type, callback) {
				// Set loadedFile variable as body data of the loadedfile array, to check against later
			var loadedFile = $('body').data("loadedFile"),
				// Declare an empty variable
				fileExists,
				// Variables for script and style
				js = type == 'js',
				css = type == 'css',
				// Make the name lowercase
				lowerCaseName = name.toLowerCase();	
				
			// If js, check if the lowercase form of the name is in a src attribute in a <script> tag
			if(js) fileExists = $('script').is('[src*="'+ lowerCaseName +'"]');
			// Else if css, check if the lowercase form of the name is in a href attribute in a <link> tag
			else if (css) fileExists = $('link').is('[href*="'+ lowerCaseName +'"]');
			
			// If loadedFile is undefined/not set, create a new array for the loaded files.
			if (loadedFile == undefined) loadedFile = new Array();

			// If loadedFile array doesn't include the url AND
			// the file doesn't exist in the document...
			if (!loadedFile.includes(url) && !fileExists) {
				// File isn't loaded yet...				
				// If adding js...
				if(js) {
					console.log(name + ' plugin isn\'t loaded.', $selector);	
					// Load the plugin dynamically via Ajax.
					$.getScript(url)
						.done(function(script, textStatus) {
							// Then execute it via the callback option
							callback();
						})
						.fail(function(jqxhr, settings, exception) {
							console.error("Failed to get " + url + "\n" + jqxhr + "\n" + settings + "\n" + exception);
						}); // End $.getScript function
					console.log(name + ' was loaded dynamically.', $selector);	
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
			else if (fileExists == true && !loadedFile.includes(url)) {
				// The file is already loaded in the document via a <script> tag...
				if(js) {
					console.log(name+' has already been loaded by a <script> tag in the document, no need to load it again. Timeline instance:', $selector);
					// Execute the plugin via the callback option.
					callback();
				}
				// Push/add the url to the loadedFile array to check against.
				loadedFile.push(url);
			}
			// Else the plugin has already been loaded...
			else {
				if(js) {
					console.log(name+' has already been loaded, no need to load it again. Timeline instance:', $selector);
					// Execute the plugin via the callback option.
					callback();
				}
			}
			
			if(js) {
				console.log(name+" executed on timeline instance: ", $selector);
			}
			// Save the loadedFile array as data to the body to be able to reload it next time it's accessed.
			$('body').data("loadedFile", loadedFile);
		} // End addFile function
	}; // End Timeline
}(jQuery)); //End jQuery
