# Horizontal Timeline 2.0
#### by Studocwho

A new adapted version of the Horizontal Timeline originally created by [CodyHouse](http://codyhouse.co/gem/horizontal-timeline/); now revamped as a jQuery plugin!

Version 2.0 adds functionality that has been previously requested for the original version, and more:
   - Transformed into a jQuery plugin, with support for multiple timeline instances utilising ID's.
   - Uniform event date intervals replaces the scattered style.
   - Added new minimal first date interval.
   - Renamed prev/next buttons to scroll-left/scroll-right to reflect their functionality.
   - Added new prev/next buttons to change the event content.
   - Added new inactive button states.
   - Minimal HTML setup, meaning the plugin creates the timeline dynamically according to the total amount of event content.
   - Event dates can now be displayed in various ways: dateTime, date, time, dayMonth, monthYear, year.
   - Added new autoplay feature with pause/play buttons and adjustable speed.
   - Added on hover pause/play functionality for autoplay.
   - Added new go-to timeline link with customisable scroll functionality. 
   - Added mouse-wheel support for scrolling the event content.
   - Added TouchSwipe functionality for touch devices.

For full documentation please check out the [Horizontal Timeline 2.0 website](http://horizontal-timeline.ycodetech.co.uk/)

### Setup

```html
<head>
// Add horizontal_timeline.2.0.css 
<link rel="stylesheet" type="text/css" href="CSS/horizontal_timeline.2.0.css">
// Add jQuery 
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
// Add horizontal_timeline.2.0.js
<script src="JavaScript/horizontal_timeline.2.0.js"></script>
</head>

```
Unlike the original, 2.0 dynamically creates the timeline according to the amount of event content there is. Making it even simplier to setup! All you need to do is create the event content…

``` html
<div class="cd-horizontal-timeline" id="example">
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
$('#example').timeline();
</script>
```

#### Options

```javascript
/* The Defaults */

$('#example').timeline({
   desktopDateIntervals: 200,
   tabletDateIntervals: 150,
   mobileDateIntervals: 120,
   minimalFirstDateInterval: true,

   dateDisplay: "dateTime",

   autoplay: false,
   autoplaySpeed: 8000,
   autoplayPause_onHover: false, 

   useScrollWheel: false,
   useTouchSwipe: true,
   useKeyboardKeys: false
});
```
