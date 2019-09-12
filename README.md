# Horizontal Timeline 2.0
#### by [yCodeTech](https://github.com/yCodeTech)
#### Twitter [@yCodeTech](https://twitter.com/yCodeTech)

Horizontal Timeline 2.0, is a fully customisable jQuery adaptation of a JavaScript plugin originally created by [CodyHouse](http://codyhouse.co/gem/horizontal-timeline/), to create a dynamic timeline on the horizontal axis.

Version 2.0 adds functionality that has been previously requested for the original version, and more:
   - Transformed into a jQuery plugin, with support for multiple timeline instances utilising ID's.
   - Uniform event date intervals replaces the scattered style.
   - Added new minimal first date interval.
   - Renamed prev/next buttons to scroll-left/scroll-right to reflect their functionality.
   - Added new prev/next buttons to change the event content.
   - Added new inactive button states.
   - Minimal HTML setup, meaning the plugin creates the timeline dynamically according to the total amount of event content.
   - Event dates can now be displayed in various ways: dateTime, date, time, dayMonth, monthYear, year.
   - Added new autoplay feature with a progress bar, pause/play buttons and adjustable speed.
   - Added on hover pause/play functionality for autoplay.
   - Added new go-to timeline link with customisable scroll functionality. 
   - Added mouse-wheel support for scrolling the event content.
   - Added TouchSwipe functionality for touch devices.
   - Added Keyboard arrow key support.
   - Added new refresh, destroy, addEvent, removeEvent methods.
   - Added a new option to disable the loading of the required files.
   - Added new options for the button icons.
   - Added new options to disable the buttons.
   - Added an option for custom date display text.

For full documentation please check out the [Horizontal Timeline 2.0 website](http://horizontal-timeline.ycodetech.co.uk/)

Visit the [Changelog](https://github.com/yCodeTech/horizontal-timeline-2.0/blob/master/changelog.md) for details of fixes, changes and additions.

### Setup

```html
<head>
    // Add horizontal_timeline.2.0.min.css 
    <link rel="stylesheet" type="text/css" href="CSS/horizontal_timeline.2.0.min.css">

    // OR add via jsdilvr CDN via the Github repo
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/ycodetech/horizontal-timeline-2.0@2/css/horizontal_timeline.2.0.min.css">

    // Add jQuery 
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>

    // Add horizontal_timeline.2.0.min.js
    <script src="JavaScript/horizontal_timeline.2.0.min.js"></script>

    // OR add via jsdilvr CDN via the Github repo
    <script src="https://cdn.jsdelivr.net/gh/ycodetech/horizontal-timeline-2.0@2/JavaScript/horizontal_timeline.2.0.min.js"></script>   
</head>

```
The easiest way to link the files in your document is to add them via <a href="https://www.jsdelivr.com/package/gh/ycodetech/horizontal-timeline-2.0" target="new">jsdilvr CDN</a>. Otherwise, you can download them from here on Github.

Unlike the original, 2.0 dynamically creates the timeline according to the amount of event content there is. Making it even simplier to setup! All you need to do is create the event content…

``` html
<div class="horizontal-timeline" id="example">
   <div class="events-content">
      <ol>
         <li class="selected" data-date="16/01/2014">
            // Event description here
         </li>
         <li data-date="23/05/2015">
            // Event description here
         </li>
         …etc.
      </ol>
   </div>
</div>
```
And then initialise the timeline with jQuery using the default options.

```html
<script>
$('#example').horizontalTimeline();
</script>
```

#### Options

```javascript
/* The Defaults */

$('#example').horizontalTimeline({
   desktopDateIntervals: 200,   //************\\
   tabletDateIntervals: 150,   // Minimum: 120 \\
   mobileDateIntervals: 120,  //****************\\
   minimalFirstDateInterval: true,

   dateDisplay: "dateTime",  // dateTime, date, time, dayMonth, monthYear, year

   autoplay: false,
   autoplaySpeed: 8,  // Sec
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
});
```

[Check out the docs](http://horizontal-timeline.ycodetech.co.uk/).
