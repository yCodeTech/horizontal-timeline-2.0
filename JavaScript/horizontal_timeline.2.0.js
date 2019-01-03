jQuery(document).ready(function($){
	var timelines = $('.cd-horizontal-timeline'),
		dotIntevals = 200,
		fullDate = true,
		onlyYear = false,
		onlyMonth = false,
		autoplay = false,
		autoplaySpeed = 8000; // ms

	(timelines.length > 0) && initTimeline(timelines);

	function initTimeline(timelines) {
		timelines.each(function(){
			var timeline = $(this),
				timelineComponents = {};
				
			//** Added by Studocwho **//
			
			// Dynamically creates the timeline according to how many events there are.
			
			var $wrapper = '<div class="timeline"/>',
				$events = '<div class="events-wrapper"><div class="events"><ol id="dotCaptions"></ol><span class="filling-line" aria-hidden="true"></span></div></div>',
				
				// Both Navs uses Font Awesome for the icons http://fontawesome.io
				// Icons require Font Awesome CSS:
				// https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css
				// You can change the nav icons if you don't want to use this
				
				// Timeline Nav
				$navWrapper = '<ul class="cd-timeline-navigation" id="timelineNav"/>',
				$leftArrow = '<li><a href="" class="prev inactive fa fa-arrow-left"></a></li>',
				$rightArrow = '<li><a href="" class="next fa fa-arrow-right"></a></li>',
				
				// Timeline Scroll
				$scrollNav = '<ul class="cd-timeline-navigation" id="timelineScroll"/>',
				$scrollLeftArrow = '<li><a href="" class="fa fa-chevron-left scroll-left inactive"></a></li>',
				$scrollRightArrow = '<li><a href="" class="fa fa-chevron-right scroll-right"></a></li>',
				
				pausePlayWrapper = '<div class="cd-timeline-navigation" id="pausePlay"/>',
				pauseButton = '<a href="" class="fa fa-pause pause"></a>',
				playButton = '<a href="" class="fa fa-play play"></a>';

			// Create the timeline HTML
			timelines.prepend($wrapper);
			$(".timeline").html($events);
			$(".timeline").append($navWrapper).append($scrollNav);
			$("#timelineNav").append($leftArrow).append($rightArrow);
			$("#timelineScroll").append($scrollLeftArrow).append($scrollRightArrow);
			
			// Function to get all data attributes from the events markup, hold in a variable and write html for  
			// each event and print the corresponding variable into each.
			if(fullDate == true && onlyYear == false && onlyMonth == false) {
				$('.events-content li').map(function() {
					var date = $(this).data('date');
					$('.timeline ol').append('<li><a href="" data-date="'+date+'">'+date+'</a></li>');
				});
			}
			else if (onlyYear == true && fullDate == false && onlyMonth == false) {
				$('.events-content li').map(function() {
					var date = $(this).data('date');
					var year = $(this).data('year');
					$('.timeline ol').append('<li><a href="" data-date="'+date+'">'+year+'</a></li>');
				});
			}
			else if (onlyMonth == true && fullDate == false && onlyYear == false) {
				$('.events-content li').map(function() {
					var date = $(this).data('date');
					var month = $(this).data('month');
					$('.timeline ol').append('<li><a href="" data-date="'+date+'">'+month+'</a></li>');
				});
			}
			
			// Autoplay function
			if (autoplay == true){
				// Add the pause button
				$('.timeline').append(pausePlayWrapper);
				$('#pausePlay').append(pauseButton);
				
				// Set variables to use later
				var	isPaused = false,
					current = 0,
					currentevent = $('.events a');
					
				setInterval(function(){
					// If isPaused = false, start the autoplay cycle, otherwise pause the cycle.
					if(!isPaused) {
						// Count each cycle
						current ++;
						// Trigger a click on the next button to go through each event.
						$('.next').trigger('click');
						
						// If the current count is equal to the number of events 
						if(current == currentevent.length) {
							// Trigger click on the first event to go back to the start of the cycle. 
							$('.events a:first').trigger('click');
							// Slide the timeline to the start so we can see each event on the timeline each cycle.
							updateSlide(timelineComponents, timelineTotWidth, 'start');
							// Set the current count back to 0 to start again.
							current = 0;	
						}
					}
				}, autoplaySpeed); // Speed
				
				// On click of pause button
				$(document).on('click','.pause', function(e) {
					e.preventDefault();
					// Set isPaused to true to pause the cycle.
					isPaused = true;
					// Change the html of the button to a play button
					$('#pausePlay').html(playButton);	
					console.log('paused');					
				});
				// On click of play button
				$(document).on('click','.play', function(e) {
					e.preventDefault();
					// Set isPaused to false to play the cycle.
					isPaused = false;
					// Change html of the button back to a pause button
					$('#pausePlay').html(pauseButton);	
					console.log('play');
				});
				
				// NOTE: if autoplay cycle is paused, clicking any timeline button will not reset the autoplay cycle to play.
			}

			$('.events li:first-child a').addClass('selected');
			
		//** End Studocwho contribution **//
				
			//cache timeline components 
			timelineComponents['timelineWrapper'] = timeline.find('.events-wrapper');
			timelineComponents['eventsWrapper'] = timelineComponents['timelineWrapper'].children('.events');
			timelineComponents['fillingLine'] = timelineComponents['eventsWrapper'].children('.filling-line');
			timelineComponents['timelineEvents'] = timelineComponents['eventsWrapper'].find('a');
			timelineComponents['timelineDates'] = parseDate(timelineComponents['timelineEvents']);
			timelineComponents['eventsMinLapse'] = minLapse(timelineComponents['timelineDates']);
			timelineComponents['timelineNavigation'] = timeline.find('.cd-timeline-navigation');
			timelineComponents['eventsContent'] = timeline.children('.events-content');
			

			//assign a left postion to the single events along the timeline
			setDatePosition(timelineComponents);
			//assign a width to the timeline
			var timelineTotWidth = setTimelineWidth(timelineComponents);
			//the timeline has been initialize - show it
			timeline.addClass('loaded');
			
			
			
			//** Added by Studocwho **//
			
			// Adds id to the first li of the event-content list.
			$('.events-content li:first-child').attr('id', 'first');
			// Adds id to the last li of the event-content list.
			$('.events-content li:last').attr('id', 'last');
			
			//** End Studocwho Contribution **//
			
			
			//detect click on the next arrow
			timelineComponents['timelineNavigation'].on('click', '.next', function(event){
				event.preventDefault();
				
				//** Added by Studocwho **//
				
				// Shows next content on click of arrow.
				showNewContent(timelineComponents, timelineTotWidth, 'next');
				 
				//** End Studocwho Contribution **//
			});
			//detect click on the prev arrow
			timelineComponents['timelineNavigation'].on('click', '.prev', function(event){
				event.preventDefault();
				
				//** Added by Studocwho **//
				
				// Shows prev content on click of arrow.
				showNewContent(timelineComponents, timelineTotWidth, 'prev');
				
				//** End Studocwho Contribution **//
			});
			
			
			//** Added by Studocwho **//			
			
			// On click scroll timeline left
			$('#timelineScroll .scroll-left').click(function(e) {
				updateSlide(timelineComponents, timelineTotWidth, 'prev');
				e.preventDefault();
			});
			// On click scroll timeline right
			$('#timelineScroll .scroll-right').click(function(e) {
				updateSlide(timelineComponents, timelineTotWidth, 'next');
				e.preventDefault();
			});
			
			//** End Studocwho Contribution **//
			
			
			//detect click on the a single event - show new event content
			timelineComponents['eventsWrapper'].on('click', 'a', function(event){
				event.preventDefault();
				timelineComponents['timelineEvents'].removeClass('selected');
				$(this).addClass('selected');
				updateOlderEvents($(this));
				updateFilling($(this), timelineComponents['fillingLine'], timelineTotWidth);
				updateVisibleContent($(this), timelineComponents['eventsContent']);
				buttonDisable();
			});
			
			//** Added by Studocwho **//
			
			// Requires the jQuery plugin TouchSwipe: http://labs.rampinteractive.co.uk/touchSwipe/demos/index.html
			// On swipe, show next/prev event content
			// TouchSwipe has more events/options than jquery mobile
			timelineComponents['eventsContent'].swipe({
				
				swipeRight:function(event, direction, distance, duration, fingerCount) {
					var mq = checkMQ();
					( mq == 'mobile' ) && showNewContent(timelineComponents, timelineTotWidth, 'prev');
					buttonDisable();
				},        
			
				swipeLeft:function(event, direction, distance, duration, fingerCount) {
					var mq = checkMQ();
					( mq == 'mobile' ) && showNewContent(timelineComponents, timelineTotWidth, 'next');	
					buttonDisable();	
				},
					//Default is 75px, set to 0 for demo so any distance triggers swipe
					threshold:0,
			});
			
			//** End Studocwho Contribution **//

			// Requires jquery mobile touch plugin
			// On swipe, show next/prev event content
			timelineComponents['eventsContent'].on('swipeleft', function(){
				var mq = checkMQ();
				( mq == 'mobile' ) && showNewContent(timelineComponents, timelineTotWidth, 'next');
				buttonDisable();
			});
			timelineComponents['eventsContent'].on('swiperight', function(){
				var mq = checkMQ();
				( mq == 'mobile' ) && showNewContent(timelineComponents, timelineTotWidth, 'prev');
				buttonDisable();
			});

			// Keyboard navigation
			$(document).keyup(function(event){
				if(event.which=='37' && elementInViewport(timeline.get(0)) ) {
					// Left arrow
					showNewContent(timelineComponents, timelineTotWidth, 'prev');
					buttonDisable();
				} else if( event.which=='39' && elementInViewport(timeline.get(0))) {
					// Right arrow
					showNewContent(timelineComponents, timelineTotWidth, 'next');
					buttonDisable();
				}
			});
			
			
			//on click of buttons call disable function	
			timelineComponents['timelineNavigation'].on('click', 'a', function(event){
				event.preventDefault();
				buttonDisable();
			});
			
		});
	}

	function updateSlide(timelineComponents, timelineTotWidth, string) {
		//retrieve translateX value of timelineComponents['eventsWrapper']
		var translateValue = getTranslateValue(timelineComponents['eventsWrapper']),
			wrapperWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', ''));
		//translate the timeline to the left('next')/right('prev') 
		(string == 'next') 
			? translateTimeline(timelineComponents, translateValue - wrapperWidth, wrapperWidth - timelineTotWidth)
			: translateTimeline(timelineComponents, translateValue + wrapperWidth);
			
		//** Added by Studocwho **//
		
		// Allows the timeline scroll back to the start of the timeline - used by Autoplay.
		if (string == 'start') {
			translateTimeline(timelineComponents, wrapperWidth);
		}
		
		//** End Studocwho Contribution **//
	}

	function showNewContent(timelineComponents, timelineTotWidth, string) {
		//go from one event to the next/previous one
		var visibleContent =  timelineComponents['eventsContent'].find('.selected'),
			newContent = ( string == 'next' ) ? visibleContent.next() : visibleContent.prev();

		if ( newContent.length > 0 ) { //if there's a next/prev event - show it
			var selectedDate = timelineComponents['eventsWrapper'].find('.selected'),
				newEvent = ( string == 'next' ) ? selectedDate.parent('li').next('li').children('a') : selectedDate.parent('li').prev('li').children('a');
			
			updateFilling(newEvent, timelineComponents['fillingLine'], timelineTotWidth);
			updateVisibleContent(newEvent, timelineComponents['eventsContent']);
			newEvent.addClass('selected');
			selectedDate.removeClass('selected');
			updateOlderEvents(newEvent);
			updateTimelinePosition(string, newEvent, timelineComponents);
		}
	}

	function updateTimelinePosition(string, event, timelineComponents) {
		//translate timeline to the left/right according to the position of the selected event
		var eventStyle = window.getComputedStyle(event.get(0), null),
			eventLeft = Number(eventStyle.getPropertyValue("left").replace('px', '')),
			timelineWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', '')),
			timelineTotWidth = Number(timelineComponents['eventsWrapper'].css('width').replace('px', ''));
		var timelineTranslate = getTranslateValue(timelineComponents['eventsWrapper']);

        if( (string == 'next' && eventLeft > timelineWidth - timelineTranslate) || (string == 'prev' && eventLeft < - timelineTranslate) ) {
        	translateTimeline(timelineComponents, - eventLeft + timelineWidth/2, timelineWidth - timelineTotWidth);
        }
	}
	
	function translateTimeline(timelineComponents, value, totWidth) {
		var eventsWrapper = timelineComponents['eventsWrapper'].get(0);
		value = (value > 0) ? 0 : value; //only negative translate value
		value = ( !(typeof totWidth === 'undefined') &&  value < totWidth ) ? totWidth : value; //do not translate more than timeline width
		setTransformValue(eventsWrapper, 'translateX', value+'px');
		//update navigation arrows visibility
		(value == 0 ) ? timelineComponents['timelineNavigation'].find('.scroll-left').addClass('inactive') : timelineComponents['timelineNavigation'].find('.scroll-left').removeClass('inactive');
		
		(value == totWidth ) ? timelineComponents['timelineNavigation'].find('.scroll-right').addClass('inactive') : timelineComponents['timelineNavigation'].find('.scroll-right').removeClass('inactive');		
	}

	function updateFilling(selectedEvent, filling, totWidth) {
		//change .filling-line length according to the selected event
		var eventStyle = window.getComputedStyle(selectedEvent.get(0), null),
			eventLeft = eventStyle.getPropertyValue("left"),
			eventWidth = eventStyle.getPropertyValue("width");
		eventLeft = Number(eventLeft.replace('px', '')) + Number(eventWidth.replace('px', ''))/2;
		var scaleValue = eventLeft/totWidth;
		setTransformValue(filling.get(0), 'scaleX', scaleValue);
	}

	//** Added by Studocwho **//
	
	// Fixed intervals between dates (e.g. 100px) specified in the dotInteval variable.
	function setDatePosition(timelineComponents, min) {
		var distance = 0,
			distanceNorm = 0,
 			distnew = 0,
 			distprev = 0;
					
		for (i = 0; i < timelineComponents['timelineDates'].length; i++) {
				distance = Math.abs(daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][i]));
				distanceNorm = Math.round(distance / timelineComponents['eventsMinLapse']) + 2;
				distnew = distprev + dotIntevals;
				timelineComponents['timelineEvents'].eq(i).css('left', distnew + 'px');
				distprev = distnew; 
		}
	}

	function setTimelineWidth(timelineComponents, width) {
		var timeSpan = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][timelineComponents['timelineDates'].length-1]),
			timeSpanNorm = timeSpan/timelineComponents['eventsMinLapse'],
			timeSpanNorm = Math.round(timeSpanNorm) + 4,
			
			totalWidth = (timelineComponents['timelineDates'].length * dotIntevals) + dotIntevals;
		timelineComponents['eventsWrapper'].css('width', totalWidth+'px');
		updateFilling(timelineComponents['eventsWrapper'].find('a.selected'), timelineComponents['fillingLine'], totalWidth);
		updateTimelinePosition('next', timelineComponents['eventsWrapper'].find('a.selected'), timelineComponents);
	
		return totalWidth;
	}
	
	//** End Studocwho Contribution **//

	function updateVisibleContent(event, eventsContent) {
		var eventDate = event.data('date'),
			visibleContent = eventsContent.find('.selected'),
			selectedContent = eventsContent.find('[data-date="'+ eventDate +'"]'),
			selectedContentHeight = selectedContent.height();

		if (selectedContent.index() > visibleContent.index()) {
			var classEntering = 'selected enter-right',
				classLeaving = 'leave-left';
		} else {
			var classEntering = 'selected enter-left',
				classLeaving = 'leave-right';
		}
		
		//** Added by Studocwho **//
		
		// Gets value of existing hardcoded class (eg. jumbotron)
		var val = selectedContent.prop("class");
		
		//** End Studocwho Contribution **//
		
		
		//adds existing class value to the funtion, so we don't lose classes and styling.
		selectedContent.attr('class', val + ' ' + classEntering);
		visibleContent.attr('class', val + ' ' + classLeaving)
					  .one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
							visibleContent.removeClass('leave-right leave-left');
							selectedContent.removeClass('enter-left enter-right');
					  });
		/*eventsContent.css('height', selectedContentHeight+'px');*/
	}

	function updateOlderEvents(event) {
		event.parent('li').prevAll('li').children('a').addClass('older-event').end().end().nextAll('li').children('a').removeClass('older-event');
	}

	function getTranslateValue(timeline) {
		var timelineStyle = window.getComputedStyle(timeline.get(0), null),
			timelineTranslate = timelineStyle.getPropertyValue("-webkit-transform") ||
         		timelineStyle.getPropertyValue("-moz-transform") ||
         		timelineStyle.getPropertyValue("-ms-transform") ||
         		timelineStyle.getPropertyValue("-o-transform") ||
         		timelineStyle.getPropertyValue("transform");

        if( timelineTranslate.indexOf('(') >=0 ) {
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
		element.style["-webkit-transform"] = property+"("+value+")";
		element.style["-moz-transform"] = property+"("+value+")";
		element.style["-ms-transform"] = property+"("+value+")";
		element.style["-o-transform"] = property+"("+value+")";
		element.style["transform"] = property+"("+value+")";
	}

	//based on http://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
	function parseDate(events) {
		var dateArrays = [];
		events.each(function(){
			var singleDate = $(this),
				dateComp = singleDate.data('date').split('T');
			if( dateComp.length > 1 ) { //both DD/MM/YEAR and time are provided
				var dayComp = dateComp[0].split('/'),
					timeComp = dateComp[1].split(':');
			} else if( dateComp[0].indexOf(':') >=0 ) { //only time is provide
				var dayComp = ["2000", "0", "0"],
					timeComp = dateComp[0].split(':');
			} else { //only DD/MM/YEAR
				var dayComp = dateComp[0].split('/'),
					timeComp = ["0", "0"];
			}
			var	newDate = new Date(dayComp[2], dayComp[1]-1, dayComp[0], timeComp[0], timeComp[1]);
			dateArrays.push(newDate);
		});
	    return dateArrays;
	}

	function daydiff(first, second) {
	    return Math.round((second-first));
	}

	function minLapse(dates) {
		//determine the minimum distance among events
		var dateDistances = [];
		for (i = 1; i < dates.length; i++) { 
		    var distance = daydiff(dates[i-1], dates[i]);
		    dateDistances.push(distance);
		}
		return Math.min.apply(null, dateDistances);
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

	function checkMQ() {
		//check if mobile or desktop device
		return window.getComputedStyle(document.querySelector('.cd-horizontal-timeline'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
	}
	
	//** Added by Studocwho **//
	
	//function to add or remove disabled class to next button depending on whether the last item is selected or not	
	function buttonDisable(){
		var nextButton = $('.cd-timeline-navigation .next'),
			prevButton = $('.cd-timeline-navigation .prev'),
			leftButton = $('.cd-timeline-navigation .scroll-left'),
			rightButton = $('.cd-timeline-navigation .scroll-right');
		
		window.setTimeout(function(){
			//first - disable prev
			if($("#first").is('.selected')) {
				prevButton.addClass('inactive');
			}
			else {
				prevButton.removeClass('inactive');
			}
			//last - disable next
			if($("#last").is('.selected')) {
				nextButton.addClass('inactive');
			}
			else {
				nextButton.removeClass('inactive');	
			}
		},100);
	}
	
	
	
	//** End Studocwho Contribution **//
	
});
