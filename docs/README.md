# Parametric modeling free plugin for SketchUp

Do parametric modeling in SketchUp thanks to a Nodes Editor similar to Unreal Engine's Blueprints. Modify entities parameters at any time and see result instantly. Import schema from file. Export schema to file.

Demos
-----

![Parametric Modeling SketchUp Plugin Staircase Demo](https://github.com/SamuelTS/SketchUp-Parametric-Modeling-Plugin/raw/main/docs/parametric-modeling-sketchup-plugin-staircase-demo.gif)

![Parametric Modeling SketchUp Plugin Shelf Demo](https://github.com/SamuelTS/SketchUp-Parametric-Modeling-Plugin/raw/main/docs/parametric-modeling-sketchup-plugin-shelf-demo.gif)

Documentation
-------------

### Installation

1. Be sure to have SketchUp 2017 or newer.
2. Download latest Parametric Modeling plugin from the [SketchUcation PluginStore](https://sketchucation.com/plugin/2387-parametric_modeling).
3. Install plugin following this [guide](https://www.youtube.com/watch?v=tyM5f81eRno).

Now, you should have in SketchUp a "Parametric Modeling" menu in "Extensions" menu and a "Parametric Modeling" toolbar.

### Nodes Editor

#### Basics

Nodes Editor is the place where you can design a parametric schema. A parametric schema is made of nodes and connections between nodes. A node is made of input sockets, fields and output sockets.

To add a node: click on an icon in toolbar inside Nodes Editor window.

To move a node: drag and drop node at desired position.

To connect two nodes: click on an output socket of first node then click on an input socket of second node. Only sockets of same type are connectable. Hint: hover a socket if you are not sure about its type.

If you enter a wrong data in a node field: node border becomes red.

To remove a node: right click on node then click on "Remove this node".

Right click in void to discover yourself other possible actions such as "Import schema from file", "Freeze parametric entities", "Export schema to file", etc.

#### Nodes

##### Calculate

This node type allows you to evaluate a math formula. Following elements are accepted in a math formula.

Constants: pi<br>
Variables: a, b, c, d, e, f, g, h, i, j, k, l<br>
Operators: +, -, \*, /, %<br>
Functions: min, max, round, ceil, floor, asinh, asin, sin, acosh, cos, atanh, atan, tan, exp, log2, log10, sqrt, cbrt

Here are some correct math formulas:

`floor(a)`<br>
`a * max(b, c)`<br>
`(a + b) / round(c)`

##### Select

This node type is used to select parametric entities matching a query. You can write a select query with following elements.

Numeric variables: a, b, c, d, e, f, g, h, i, j, k, l, nth, width, height, depth<br>
Numeric operators: <, <=, =, !=, >=, ><br>
Boolean variables: first, even, odd, last, solid<br>
Boolean operators: and, or<br>
Boolean functions: not

Here are some valid select queries:

`not(first)`<br>
`width > a`<br>
`first or nth = 4 or last`

Credits
-------

Parametric Modeling plugin is powered by [Rete.js](https://github.com/retejs/rete) framework. Shapes module of this plugin is based on [SketchUp Shapes plugin code](https://github.com/SketchUp/sketchup-shapes). Toolbar icons of this plugin were made by [Freepik](https://www.freepik.com) and [Pixel perfect](https://www.flaticon.com/authors/pixel-perfect) from [Flaticon](https://www.flaticon.com/).

Copyright
---------

© 2021 Samuel Tallet
