**METERS  :  adding values to your project!

This is an extension providing a selection of different visual indicators to let you monitor a changing value.

Meters.use(style, start, limit)
  -- style -  chooses the indicator type (see below)
  -- start - is the value that maps to the bottom reading
  -- limit - is the value that maps to the top reading

NOTE: It is quite permissible for start to exceed limit, or for either (or both) to be negative. 

Meters.show(value, animate, ms)
  -- value - is the new value to be indicated 
  -- animate (optional) if true, shows intermediate values leading to the new value after ms millisecs. 
  This background animation only occurs if ms exceeds 50ms.

Range-checks
An attempt to show a value that is outside the [start...limit] range will be constrained to the nearest bound but will flash to indicate out-of-range.

Styles:
BAR:
This meter style is similar to the built-in bar-graph function, filling up each row in turn from the bottom, with 1, 3, or 5 centred pixels, giving a total of 15 distinct displays.

DIAL:
This meter style shows a short 3-pixel pointer rotating from the 12 o'clock position through 24 different angles.
  
NEEDLE:
This meter style swings a needle centred on the top left corner from horizontal clockwise to vertical in 17 steps.

TIDE:
This meter style fills the display progressively from the bottom left to the top right in 25 steps.

BLOB:
This meter style is a simple centred disc that grows from a single pixel to fill the screen in 7 steps. 

SPIRAL:
This meter style is similar to the BLOB but winds round clockwise in a spiral to fill the screen in 25 steps.


DIGITAL:
Unlike the other analog displays, this meter style gives a direct 2-digit readout of the value, which should lie in the range  [0...99]
(When selected, using Meter.use(), the start and limit values are ignored.) 

NOTE:  Since each digit must be represented in only 10 pixels, they are somewhat stylized, and take a bit of practice to read accurately!





> Open this page at [https://grandpabond.github.io/trymeters/](https://grandpabond.github.io/trymeters/)

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/grandpabond/trymeters** and import

## Edit this project

To edit this repository in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/grandpabond/trymeters** and click import

#### Metadata (used for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
