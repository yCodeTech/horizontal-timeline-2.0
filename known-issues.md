# Known Issues

- Autoplay can't be set on multiple timelines, meaning the maximum per page is 1.

- Timeline incorrectly gets and sets the wrong width after creating the HTML. Only happens on load for the first time or hard-reload, with refresh of the timeline or soft-reload seems to rectify the problem. Seems to be related to the navigation buttons not having a width for a few seconds after timeline creation.

  A hotfix that was first introduced in v2.0.5-alpha.2 solved the issue with a 300ms setTimeout delay in the init function. However, this consequently created errors if a method runs directly after the initialisation code. 
  
  **A workaround was introduced in v2.0.5.1 as the initialised DOM event, which would be fired after the delay. If a method needs to be ran directly after the initialisation, use it inside the attachable event.**

These issues are hopefully going to be fixed in the future. If you want to help me out and fix any of these issues yourself, please do so and make a pull request for me to review and merge it with the plugin. All help will be appreciated.
