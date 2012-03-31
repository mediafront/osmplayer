# Absolution Theme #

* You are free to redistribute or change the theme.
* You can change the theme, but you should keep the references to contributors!

Copyright 2010, Michael Vanderheeren  
http://www.michaelvanderheeren.be

jQuery UI CSS Framework, Copyright 2010, http://jqueryui.com/about  
Dual licensed under the MIT or GPL Version 2 licenses.  
http://jquery.org/license  
http://docs.jquery.com/UI/Theming/API

## Donate ##

I designed and coded this theme in my spare time, which I now and then like to spend having a drink. Keeping this hosting up also costs money. If you like the Absolution theme then think about contributing to it and maybe provide me with a drink, or an extra month of hosting by giving me a small donation through PayPal. You can also Flattr the theme through the button below.

[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=MichaelVdheeren&url=https://github.com/michaelvanderheeren/Absolution&title=Absolution&language=en_GB&tags=github&category=software)

## Q&A ##

**How do I install the theme?**  
Download the latest version from the gitHub repository and add a text/css type link in the pages where you want to use the theme. You should set the href to the *absolution.blue.css* file! Do not forget the images folder!  
Example: <link type="text/css" href="absolution.blue.css" rel="stylesheet" />  

**But I want a different color!**  
No problem, if it is already generated then just replace the name of the file above. Otherwise, you have to change the color values in the .less files and either recompile the file or include the LESS javascript in the page where you're using the theme.

**What about Wijmo support?**  
There is no need anymore to include the Wijmo css stylesheets as they are the foundation for our Wijmo support. Currently the following widgets are fully supported: Expander, Slider, Accordion, Tree.

**The theme looks ugly!**  
Either you have a different taste or an old browser. This theme uses full CSS3 power in every way possible. Gradients, border-radius and box-shadows are just a simple example. There is no way that I will support legacy browsers. Repeated backgrounds limit the font-size and thus limits freedom for the theme user. This is a user-interface theme, and not a font one. Therefore all unneeded font restricting will be removed over time and replaced with inherits where needed.

**Why did you remove the option to include separate widgets?**  
Sometimes I like to push new technologies. The usage of LESS was a huge improvement for the readability of the code and the ability to change it fast. This came however at the cost of compiling which I do in a minimized single file to make the file smaller. There is however the option to include the necessary LESS files in your page along with the LESS javascript which will process those files.

**Where can I find LESS?**  
You are a no brainer aren't you? http://LMGTFY.com/?q=less

**How can I support the theme development?**  
If you have a Flattr account, then click on the button above.