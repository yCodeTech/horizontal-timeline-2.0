# Changelog

All notable changes to this project will be documented in this file.

- ## 2.0.5 Prerelease 2 [[v2.0.5-alpha.2]]() - Upcoming
     ### Added
     - A proper getMonthName function to make it easier to the event creation.
     - Some CSS to style the text as the default in the event content.
     - dateOrder option to reverse the order of the date display.
     
     ### Changed
     - Renamed buttonDisable to buttonStates to reflect the docs naming. 
     - Some CSS rules that affected the scrollbars.
     
     ### Fixed
     - The useFontAwesomeIcons option where it wouldn't do anything due to missing code.
     - A bug that inconsistently and inaccurately calculates the width of the timeline on init, so the scrolling of the timeline was off slightly. (This was due to the function being called slightly before all elements had to chance to be created). Fixed with a 300s delay.
     - A bug that when the buttons are disiabled, the timeline appears to not to have a width and disappeared.
     - A persistant bug that shows the horizontal (x) scrollbar when translating the event content, added a line in the CSS.
     - A bug that broke multiple timelines by using the nav buttons that stored the wrong timeline instance when TouchSwipe was used.

     ### Removed
     - Removed some unnecessary commented out code in the Refresh method.
     
- ## 2.0.5 Prerelease 1 [[v2.0.5-alpha.1]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.5-alpha.1) - 24/07/2019
    ### Added
    - 2 new boolean options to disable the navigation buttons (as requested via email): useNavBtns and useScrollBtns.
    - An option to customise the date display (as requested via email) using a data-attribute.

    ### Changed
    - Alot of the CSS to use the Flexbox layout.

    ### Fixed
    - A bug where if the date was split into two lines, half of the top was cut off by the parent bounding box, the height was changed accordingly.

- ## [[v2.0.4.1]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.4.1) - 06/06/2019
    ### Fixed
    - A bug for the _addFile callback where it would fire way too early meaning that the plugins wouldn't work.


- ## [[v2.0.4]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.4) - 06/06/2019
    ### Added
    - An option to disable the loading of the required plugin files.
    - Several new button icon options, making it possible to change the icons of the buttons via classes.
    - An option to disable the use of Font Awesome for the icons.

    ### Changed
    - How the _addFile function checks for existing files in the document. 

    ### Fixed
    - Typos.
    - An issue with the _addFile function callback, where if there wasn't a callback defined for a CSS file, it would send out an error.
    - A bug with fixed positioned and flexbox enabled elements where they were changing positions when the events content translated.

- ## [[v2.0.3]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.3) - 12/04/2019
    ### Fixed
    - Browser inconsistencies due to the lack of support for various functions in the _addFile function.

- ## [[v2.0.2]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.2) - 05/03/2019
    ### Fixed
    - Bugs that were caused by typos.

- ## [[v2.0.1]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0.1) - 07/02/2019
    ### Fixed
    - A case-sensitive problem for checking existing required js/css in the _addFile function.

- ## Initial Release [[v2.0]](https://github.com/yCodeTech/horizontal-timeline-2.0/tree/v2.0) - 01/02/2019
    ### Added
    - Support for multiple timeline instances as a jQuery plugin.
    - Minimal first date interval.
    - A new pair of navigation buttons: the real prev/next.
    - Inactive button states.
    - Minimal HTML setup, meaning the plugin creates the timeline dynamically according to the total amount of event content.
    - 6 new ways to display the event dates: dateTime, date, time, dayMonth, monthYear, year.
    - Autoplay feature with a progress bar, pause/play buttons and adjustable speed.
    - On hover pause/play functionality for autoplay.
    - Go-to timeline link with customisable scroll functionality.
    - Mouse-wheel support for scrolling the event content.
    - TouchSwipe functionality for touch devices.
    - Keyboard arrow key support. 
    - 4 methods: refresh, destroy, addEvent, removeEvent.

    ### Changed
    - The event date display intervals to be regular and uniform repacing the scattered, distanced style.
    - The prev/next button names to scroll-left/scroll-right to reflect their functionality.
