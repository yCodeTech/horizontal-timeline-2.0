# Changelog

All notable changes to this project will be documented in this file.

- ## 2.0.5.2 [[v2.0.5.2]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.5.2) - 21/04/2020
     ### Fixed
     - A bug that was caused when adding a list into the events content because the plugin was checking for **all** `<li>`s existing in the timeline elements when referencing the `.events-content li` that would extract information from it's data attribute, therefore the plugin wouldn't understand and throw an error when it found a li without a data attribute inside the content, causing timeline to crash and prevent it from displaying. Fixed by adding an attribute selector to check only li's with the data attribute.
     
     ### Added
     - Added a simple function to determine which data attribute to check for, whether it being the `data-horizontal-timeline`, or the deprecated `data-date`, just until the deprecated attribute is removed.
     
     ### Changed
     - The `if` statement when there are no event content, to stop the script from continuing by throwing an error, otherwise it would continue creating the timeline elements without events, which isn't necessary.
     
- ## 2.0.5.1 [[v2.0.5.1]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.5.1) - 09/04/2020
     ### Removed
     - An unnecessary development console log in the goTo method in the minified file (.min.js)
     - The use of `tinyMobile` and `smallTablet` in the CSS media queries.
     - The use of `tinyMobile` and `smallTablet` in the `checkMQ` function and various if statements due to being redundant.
     
     ### Fixed
     - A bug that was caused by a missing `event` parameter in a function declaration when triggering a fake click on the autoplay pause button, it would spit out the error **Cannot read property 'preventDefault' of undefined**.
     - The `.on` function relating to that of the timeline navigation which was inadvertently being run when the pause/play buttons were clicked or triggered - adding a `:not` CSS selector to exclude the buttons.
     - A bug that appeared after the previous bug fixtures above was implemented. The pause/play `.on` function (`changeButtons`) would now refresh the page, so a `event.preventDefault();` was added.
     - An issue with the autoplay pause and play functions, that wouldn't get the instance correctly.
     - A bug where the new autoplay prototype function would throw an error when the autoplay `isPaused` and `mouseEvent` data is being set to the element data object because the data object wasn't created at that point (throwing an `undefined` error). Solved by adding it in the plugin wrapper instead of the internal function.
     - A bug with the goTo timeline links where if any of the data options were omitted from the links, the function didn't utilise the default options. This was caused by inconsistent naming and the name changes that occured wasn't reflected in the variable declarations, thereby throwing an `unrecognised` error.
     - A bug where on first load or hard-reload, the page would have 2 scrollbars due to both the `HTML` and `body` having the `overflow-x: hidden` CSS attribute. Fixed by removing the `HTML` from the CSS rule.
     
     ### Changed
     - The jQuery options `$.extend` to deep nested recursion with the `true` boolean. Enables the possibility of deep nested objects in the options.
     - Added a way to internally access the user options.
     - Various code to check if the new object options is set in the user options, if so use them, otherwise use the deprecated single options. 
     - The `animationClass` options objects and combined them into one nested object.
     - The internal function structure to a prototype object of functions, so it only adds the functions to the prototype once.
     - The anonymous functions of `init.addIdsAndClasses`, `create.date`, `create.eventDateDisplay`, and `autoplay`; and added them to the timeline prototype as separate functions `_addIdsAndClasses`, `_createDate`, `_eventDateDisplay`, `_autoplay`.
     - The `create` function to put together the HTML in a variable before adding to the document, avoiding the obsessive use of the jQuery `.append()`.
     - The name of the event data `element` to `timelineSelector` of the `initialised` DOM event, to make it more obvious what is is - `element` could refer to any part of the timeline, where as `timelineSelector` would be more specific.
     - The `mobile` and `tablet` CSS media queries widths to include the missing widths accordingly.
     - The object options code so if no options are defined or both the single and the object options are defined, then it defaults to the new object options, otherwise use the deprecated single options.
     
     ### Added
     - New object options instead of the single options:
          - `dateIntervals` with keys `desktop`, `mobile`, `tablet` and `minimal`.
          - `iconClass` with keys `base`, `scrollLeft`, `scrollRight`, `prev`, `next`, `pause` and `play`
          - `animationClass` with keys `base`, `enter` and `exit`, the latter two are objects with keys `left` and `right`
     - Added a new DOM event `initialised` to combat the issue of undefined errors when trying to use the any of the public methods straight after the initialisation code. The errors are caused by the hotfix `setTimeout` in the init function to delay the code so it gets the correct width, which in turn makes everything else delayed. The DOM event will be fired after this delay, indicating the plugin has truly completed.
     
     ### Deprecated
     - The single options:
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
     
     (In favour of object options and a combined nested object for the animationClass.)

- ## 2.0.5 [[v2.0.5]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.5) - 25/02/2020
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
     - The goTo method options object quotation to reflect the actual usage without quotes 
     - The goTo method speed and offset options to be real numbers instead of strings.
     
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
     - A bug that inconsistently and inaccurately calculates the width of the timeline on init, so the scrolling of the timeline was off slightly. (This was due to the function being called slightly before all elements had to chance to be created). Fixed with a 300s `setTimeout` delay.
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
