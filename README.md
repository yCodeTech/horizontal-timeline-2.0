# Horizontal Timeline 2.0

Created by CodyHouse.

Adapted by Studocwho.

This version:
   - Fixed event dot intervals.
   - Prev/Next buttons are now the prev/next event.
   - New scroll left/right buttons allow scrolling the timeline (like the prev/next buttons did).
   - New inactive states of buttons.
   - Dynamically creating the event dots according to the total of events there are, setting information found from the event-content data attributes.
   - month only, year only or full date event dot captions.
   - New Autoplay feature with pause/play buttons.

[Original Article on CodyHouse](http://codyhouse.co/gem/horizontal-timeline/)
 
[Terms](http://codyhouse.co/terms/)


### Dot intervals
Default of dot intervals is **200px**. To change this, you will need to change the **dotIntevals** variable at the top of the .js file.

### Full Date Captions
To use the full date captions set in the **data-date**, the **fullDate** variable at the top of the .js file will need to be set to **true** (default) with **onlyYear** and **onlyMonth** variables both set to **false**.

### Year Only Captions
To use year only captions, you must specify the year in a **data-year** attribute on your **events-content** items. Also the variable **onlyYear** must be set to **true** with **fullDate** and **onlyMonth** variables set to **false** at the top of the .js file. 

```html
<div class="events-content">
   <ol>
      <li class="selected" data-date="16/01/2014" data-year="2014">
         <!-- event description here -->
      </li>
      ...
   </ol>
</div>   

```

### Month Only Captions
To use month only captions, you must specify the month in a **data-month** attribute on your **events-content** items. Also the variable **onlyMonth** must be set to **true** with **fullDate** and **onlyYear** variables set to **false** at the top of the .js file. 

```html
<div class="events-content">
   <ol>
      <li class="selected" data-date="16/01/2014" data-month="January">
         <!-- event description here -->
      </li>
      ...
   </ol>
</div>   
