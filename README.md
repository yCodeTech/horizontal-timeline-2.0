# Horizontal Timeline 2.0
#### by [yCodeTech](https://github.com/yCodeTech)
#### Twitter [@yCodeTech](https://twitter.com/yCodeTech)
#### Current Version: 2.0.5.1
#### Quick Links: <a href="#setup">Setup</a> | <a href="#options">Options</a> | <a href="#known-issues">Known Issues</a> | <a href="#known-issues-that-wont-be-fixed">Known Issues That Won't Be Fixed</a> | <a href="#deprecated">Deprecated</a>

Horizontal Timeline 2.0, is a fully customisable jQuery adaptation of a JavaScript plugin originally created by [CodyHouse](http://codyhouse.co/gem/horizontal-timeline/), to create a dynamic timeline on the horizontal axis.

Version 2.0 adds functionality that has been previously requested for the original version, and more:
   - Transformed into a jQuery plugin, with support for multiple timeline instances utilising ID's.
   - Uniform event date intervals replaces the scattered distanced style, with an option for a minimal first date interval.
   - Renamed prev/next buttons to scroll-left/scroll-right to reflect their functionality, added the real prev/next buttons to change the event content, added an option to disable the buttons altogether, and implemented new inactive button states.
   - Setup is now easier with minimal HTML, that allows the timeline to be created dynamically according to the total amount of event content, which has a natural support for ordering and reversing.
   - Event dates can now be displayed in various types: dateTime, date, time, dayMonth, monthYear, year, with completely customisable display text, and a new option for advanced reversing of the order and selection of the events.
   - Added new autoplay feature with a progress bar, pause/play buttons, adjustable speed and on-hover pause functionality.
   - Added new go-to timeline link with customisable scroll functionality.
   - Added support for mouse-wheel scrolling, touch and swipe for touch devices, and keyboard arrow keys, with the option to disable the loading of the required plugin files.
   - Added new `refresh`, `destroy`, `addEvent`, `removeEvent`, and `goTo` methods with new attachable namespaced `eventAdded`, `eventRemoved`, `eventChanged`, `goToTimeline` DOM Events.
   - Added new options to change the button icons and to disable the use of the Font Awesome icon library.
   - **Deprecated** the use of multiple data attributes, _data-date_ and _data-custom-display_, in favour of the all new combined singular data attribute, _data-horizontal-timeline_, that utilises an object to house all previously-used data.
   - Added new animation options to customise the event content animation.

For full documentation please check out the [Horizontal Timeline 2.0 website](http://horizontal-timeline.ycodetech.co.uk/)

Visit the [Changelog](https://github.com/yCodeTech/horizontal-timeline-2.0/blob/master/changelog.md) for details of fixes, changes, additions and removals.

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
         <li class="selected" data-horizontal-timeline='{"date": "16/01/2014", "customDisplay": "Custom Text"}'>
            // Event description here
         </li>
         <li data-horizontal-timeline='{"date": "23/05/2015"}'>
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
   dateOrder: "normal", // normal, reverse

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
});
```

[Check out the docs](http://horizontal-timeline.ycodetech.co.uk/).

## Known Issues

- Autoplay can't be set on multiple timelines, meaning the maximum per page is 1.
- Timeline incorrectly gets and sets the wrong width after creating the HTML. Only happens on load for the first time or hard-reload, with refresh of the timeline or soft-reload seems to rectify the problem. Seems to be related to the navigation buttons not having a width for a few seconds after timeline creation.

  A hotfix that was first introduced in v2.0.5-alpha.2 solved the issue with a 300ms `setTimeout` delay in the init function. However, this consequently created errors if a method runs directly after the initialisation code. A workaround was introduced in v2.0.5.1 as the `initialised` DOM event, which would be fired after the delay. If a method needs to be ran directly after the initialisation, use it inside the attachable event. See the [CodePen](https://codepen.io/ycodetech/pen/WNvadbQ). (Not sure how to fix properly.)

These issues are hopefully going to be fixed in the future. If you want to help me out and fix any of these issues yourself, please do so and make a pull request for me to review and merge it with the plugin. All help will be appreciated.

## Known Issues that won't be fixed.

- The event content animation can become stuck between classes and glitch out. Can not fix as it relies on the `animationend` event, which doesn't always get fired, presumably the cause of the issue.

- IE11 and Safari 5.1.7 for Windows 10 both have issues with the timeline, and encounters errors. Will not fix due to the browsers being severely outdated and their dev console errors are lacking descriptions to even attempt to find the cause of the errors.

## Deprecated
As of _v2.0.5-alpha.3_ ...
- `data-date`
- `data-custom-display`

(In favour of the combined singular data attribute: `data-horizontal-timeline` with key:value pairs.)

As of _v2.0.5.1_ ...
- `desktopDateIntervals`
- `tabletDateIntervals`
- `mobileDateIntervals`
- `minimalFirstDateInterval`
- `iconBaseClass`
- `scrollLeft_iconClass`
- `scrollRight_iconClass`
- `prev_iconClass`
- `next_iconClass`
- `pause_iconClass`
- `play_iconClass`
- `animation_baseClass`
- `enter_animationClass` object
- `exit_animationClass` object

(In favour of object options and a combined nested object for the `animationClass`.)
