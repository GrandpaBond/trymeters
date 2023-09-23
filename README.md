```package
morse=github:grandpabond/pxt-meter
```
#meter - Adding values to your project!

Many microbit projects are about taking measurements. The datalogger extension lets you make a historical record 
of your measurements, but your project can be brought to life by adding a real-time visual indicator.

The extension provides a selection of different visual indicators to let you monitor a changing value.

# Showing numbers with the digital meter #meter-digital
```sig
meter.digital()
```
The default ``||meter:meter||`` display is a meter showing a direct 2-digit readout of a value, 
which should lie in the range [0...99]. For many purposes 2 digits provide adequate accuracy, 
and the digital display is especially useful in representing percentages.

### ~reminder
NOTE:  Since each digit must be represented in only 10 pixels, they are inevitably somewhat stylized,  
and take a bit of practice to read accurately, especially zeroes and eights!
### ~

# Displaying a new value #meter-show
```sig
meter.show(value,  ms)
```
The function ``||meter:show()||`` adjusts the meter to show a new reading.

  ``||meter:value||``- is the new value to be indicated.

  ``||meter:ms||`` - is optionally used to control the speed of an animated adjustment to the new value. 
  It shows intermediate values leading to the new ``||meter:value||`` after ms millisecs. 
  (This background animation only occurs if ``||meter:ms||`` exceeds 50ms).

## Range-checks
Any attempt to show a value that lies outside the [``||meter:start||``...``||meter:limit||``] range will be constrained 
to the nearest bound, but will flash to indicate the out-of-range error.

# Choosing an analogue meter #meter-use
```sig
meter.use(style, start, limit)
```
Often the exact numeric value is less important than providing a rapid visual indication of a measurement.
The function ``||meter:use()||`` selects one of a number of possible analoge visual indicators

``||meter:style||`` - chooses the indicator type (see below)

``||meter:start||`` - is the value that maps to the bottom reading

``||meter:limit||`` - is the value that maps to the top reading

### ~reminder
The operating range for analogue displays is completely flexible: it is quite permissible for ``||meter:start||`` 
to exceed ``||meter:limit||``, or for either (or both) to be negative. They need not be whole numbers either: 
fractional values are quite OK.
### ~



## Styles:
``||meter:BAR||``:
This meter style is similar to the built-in bar-graph function, filling up each row in turn from the bottom, 
with 1, 3, or 5 centred pixels, giving a total of 15 distinct displays.

``||meter:DIAL||``
This meter style shows a short 3-pixel pointer rotating from the 12 o'clock position through 24 different angles.
  
``||meter:NEEDLE||``:
This meter style swings a needle centred on the top left corner from horizontal clockwise to vertical in 17 steps.

``||meter:TIDAL||``:
This meter style fills the display progressively from the bottom left to the top right in 25 steps.

``||meter:BLOB||``:
This meter style is a simple centred disc that grows from a single pixel to fill the screen in 7 steps. 

``||meter:SPIRAL||``:
This meter style is similar to the BLOB but winds round clockwise in a spiral to fill the screen in 25 steps.

# Resetting the meter #meter-reset
```sig
meter.reset()
```
This function clears any out-of-range flashing and resets the meter.

# Choosing a digital meter #meter-wait
```sig
meter.wait()
```
This function suspends your code until any background animated adjustment has reached the new value.
(Returns immediately if there is no animation going on.)

# Interrupting an animated adjustment #meter-stop
```sig
meter.stop()
```
This function stops any background animated adjustment immediately, wherever it has got to. 
(So it may not yet have reached the new value.)





> Open this page at [https://grandpabond.github.io/trymeter/](https://grandpabond.github.io/trymeter/)

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/grandpabond/trymeter** and import

## Edit this project

To edit this repository in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/grandpabond/trymeter** and click import

#### Metadata (used for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
