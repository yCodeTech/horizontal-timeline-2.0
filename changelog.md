# Changelog

All notable changes to this project will be documented in this file.

- ## 2.0.5 [[v2.0.5]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.5) - Coming Soon
     ### Added
     - 3 new attachable namespaced DOM events: `eventAdded`, `eventRemoved`, `eventChanged` (the latter requested via email and an issue).
     - A new `goTo` public method, using the pre-exisiting go-to link functions.
     - A new attachable namespaced DOM event `goToTimeline` to the goTo method (fires before it goes to timeline/date).
     - A fail safe into the goTo method so that we can not go to a non-existant event.
     
     ### Changed
     - Go-to link functions to use the new `goTo` public method
     - The way the `goTo` method handles the optional smooth scroll settings using an object to set the defaults as the function arguments.
     In line with this, the method call in the go-to-timeline link function has been updated.
     
     ### Fixed
     - A bug with the go-to-timeline link function where it would fire on all plugin instances. Fixed by adding a `stopImmediatePropagation()` to the function to concentrate only on the one instance.
     - Several typos in the comments.
     
     ### Removed
     - Some unnecessary code in the go-to-timeline link function.

- ## 2.0.5 Prerelease 3.1 [[v2.0.5-alpha.3.1]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.5-alpha.3.1) and 3.1.1 [[v2.0.5-alpha.3.1.1]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.5-alpha.3.1.1) - 05/12/2019
     ### Fixed
     - A major bug with the methods that stopped them from working. The previous code cleanup left a bug in the form of an unrecognised variable, in a function call in the `refresh`, `addEvent` and `removeEvent` methods.
     - A bug when the `refresh` method calls the `addIdsAndClasses` function, it doesn't know which instance to get the elements from, therefore the function doesn't do anything.

- ## 2.0.5 Prerelease 3 [[v2.0.5-alpha.3]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.5-alpha.3) - 05/12/2019
     ### Added
     - A combined singular data attribute, `data-horizontal-timeline`, that houses the previously-used `data-date` and `data-custom-display`.
     - `animation_baseClass`, `enter_animationClass` and `exit_animationClass` options to customise the event content animations.
     - A CSS rule for the default animation speed.
     
     ### Changed
     - A lot of the data attribute code to implement the combined single attribute.
     - The console logs in the `addFile` function to group the logs and reduce the clutter.
     - Renamed the default CSS animation exiting class from the prefix `leave-` to `exit-`
     - Autoplay will now stop playing if not in the viewport.
     - When autoplay is in the paused state and the content changes, upon playing again, the progress bar will reset to the start.
     - Various CSS.
     
     ### Fixed
     - A bug in Safari made by a typo in a attribute contains selector.
     - A bug in Safari that couldn't recognise a check for undefined.
     - A bug for the Go-To Timeline Link relating to an error in jQuery about an unrecognised expression in a selector - a lonely '#' (`$('#')`).
     - A bug with the go-to-timeline link, where it wouldn't get the correct timeline instance for the target timeline, thereby using the last timeline's settings, which could be bad news for multiple timelines.

     ### Deprecated 
     - The use of multiple data attributes, `data-date` and `data-custom-display`.

- ## 2.0.5 Prerelease 2 [[v2.0.5-alpha.2]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.5-alpha.2) - 27/09/2019
     ### Added
     - A proper `getMonthName` function to make it easier to the event creation.
     - Some CSS to style the text as the default in the event content.
     - `dateOrder` option to reverse the order of the date display.
     
     ### Changed
     - Renamed `buttonDisable` to `buttonStates` to reflect the docs naming. 
     - Some CSS rules that affected the scrollbars.
     
     ### Fixed
     - The `useFontAwesomeIcons` option where it wouldn't do anything due to missing code.
     - A bug that inconsistently and inaccurately calculates the width of the timeline on init, so the scrolling of the timeline was off slightly. (This was due to the function being called slightly before all elements had to chance to be created). Fixed with a 300s delay.
     - A bug that when the buttons are disiabled, the timeline appears to not to have a width and disappeared.
     - A persistant bug that shows the horizontal (x) scrollbar when translating the event content, added a line in the CSS.
     - A bug that broke multiple timelines by using the nav buttons that stored the wrong timeline instance when TouchSwipe was used.

     ### Removed
     - Removed some unnecessary commented out code in the `Refresh` method.
     
- ## 2.0.5 Prerelease 1 [[v2.0.5-alpha.1]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.5-alpha.1) - 24/07/2019
    ### Added
    - `useNavBtns` and `useScrollBtns` boolean options to disable the navigation buttons (as requested via email).
    - A new data attribute, `data-custom-display`, to customise the date display with non-date text (as requested via email).

    ### Changed
    - Alot of the CSS to use the Flexbox layout.

    ### Fixed
    - A bug where if the date was split into two lines, half of the top was cut off by the parent bounding box, the height was changed accordingly.

- ## [[v2.0.4.1]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.4.1) - 06/06/2019
    ### Fixed
    - A bug for the `addFile` callback where it would fire way too early meaning that the plugins wouldn't work.


- ## [[v2.0.4]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.4) - 06/06/2019
    ### Added
    - `addRequiredFile` option to disable the loading of the required plugin files.
    - `iconBaseClass`, `scrollLeft_iconClass`, `scrollRight_iconClass`, `prev_iconClass`, `next_iconClass`, `pause_iconClass` and `play_iconClass` options, to be able to change the icons of the buttons via classes.
    - `useFontAwesomeIcons` option to disable the use of Font Awesome for the icons.

    ### Changed
    - How the `addFile` function checks for existing files in the document. 

    ### Fixed
    - Typos.
    - An issue with the `addFile` function callback, where if there wasn't a callback defined for a CSS file, it would send out an error.
    - A bug with fixed positioned and flexbox enabled elements where they were changing positions when the events content translated.

- ## [[v2.0.3]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.3) - 12/04/2019
    ### Fixed
    - Browser inconsistencies due to the lack of support for various functions in the `addFile` function.

- ## [[v2.0.2]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.2) - 05/03/2019
    ### Fixed
    - Bugs that were caused by typos.

- ## [[v2.0.1]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.1) - 07/02/2019
    ### Fixed
    - A case-sensitive problem for checking existing required js/css in the `addFile` function.

- ## Initial Release [[v2.0]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0) - 01/02/2019
    ### Added
    - Support for multiple timeline instances as a jQuery plugin.
    - `minimalFirstDateInterval` boolean option to set a minimal interval for the first date.
    - A new pair of navigation buttons: the real prev/next.
    - Inactive button states.
    - Minimal HTML setup, meaning the plugin creates the timeline dynamically according to the total amount of event content.
    - `dateDisplay` option with 6 new ways to display the event dates: `dateTime`, `date`, `time`, `dayMonth`, `monthYear`, `year`.
    - `autoplay`, `autoplaySpeed` options to enable the new autoplay feature with a progress bar, pause/play buttons and adjustable speed.
    - `autoplayPause_onHover` boolean option to enable the on-hover pause/play functionality for autoplay.
    - Go-to timeline link with customisable scroll functionality.
    - `useScrollWheel` boolean option to enable Mouse-wheel support for scrolling the event content.
    - `useTouchSwipe` boolean option to enable TouchSwipe functionality for touch devices.
    - `useKeyboardKeys` boolean option to enable Keyboard arrow key support. 
    - `refresh`, `destroy`, `addEvent`, `removeEvent` public methods.

    ### Changed
    - The event date display intervals to be regular and uniform repacing the scattered, distanced style.
    - The prev/next button names to scroll-left/scroll-right to reflect their functionality.
