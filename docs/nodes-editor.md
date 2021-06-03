# Nodes Editor - Parametric Modeling

## Basics

Nodes Editor is the place where you can design a parametric schema. A parametric schema is made of nodes and connections between nodes. A node is made of input sockets, input fields and output sockets.

To add a node: click on an icon in toolbar inside Nodes Editor window. Node is stuck to mouse. Move mouse at desired position for node. Click again to unstick node from mouse.

To connect two nodes: click on an output socket of first node then click on an input socket of second node. Only sockets of same type are connectable. Hint: hover a socket if you are not sure about its type.

To move a node: drag and drop node at desired position.

To move several nodes at once: hold <kbd>CTRL</kbd> key then click on each node. Nodes are selected. Hold again <kbd>CTRL</kbd> key then drag and drop nodes at desired position.

If you input a wrong data in a node field: node border becomes red.

To remove a node: right click on node then click on "Remove this node".

Right click in void to discover yourself other possible actions such as "Import schema from a file", "Freeze parametric entities", "Export schema to a file", etc.

## Nodes

### Number

In a node of this type and many others, a numeric input field can contain an integer or a decimal number. Decimal separator is the dot.

To increment or decrement a number: hold keyboard <kbd>Up</kbd> or <kbd>Down</kbd> arrows. Increment and decrement steps automatically adapt to scale of number. Examples:

- If you input `1.25` next increment will be `1.26`.
- If you input `1.264` next decrement will be `1.263`.

To reset increment and decrement steps: empty the numeric field.

When number defines a dimension, measure unit of active model is used. 

### Calculate

This node type allows you to evaluate a math formula. Following elements are accepted in a math formula.

Constants: `pi`<br>
Variables: `a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`, `i`, `j`, `k`, `l`<br>
Operators: `+`, `-`, `*`, `/`, `%`, `<`, `<=`, `=`, `!=`, `>=`, `>`<br>
Functions: `min`, `max`, `round`, `ceil`, `floor`, `deg`, `asinh`, `asin`, `sin`, `acosh`, `cos`, `atanh`, `atan`, `tan`, `exp`, `log2`, `log10`, `sqrt`, `cbrt`, `rand`, `if`, `case`

Here are some correct math formulas:

`floor(a)`<br>
`(a + b) / rand(c, d)`<br>
`if(a > b, c, d)`<br>
`a * max(b, c, d, e)`<br>
`case a when (b) then c when (d) then e else f end`

Functions expecting an angle, such as `sin` or `cos`, work with radians. If you want to work with degrees instead, you can use `deg` function 
to convert beforehand the degrees to radians. Following math formula will give you the cosinus of an angle of 36 degrees:
 `cos(deg(36)) `

### Select

This node type is used to select parametric entities matching (or not) a query. You can write a select query with following elements.

Numeric variables: `a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`, `i`, `j`, `k`, `l`, `nth`, `width`, `height`, `depth`<br>
Numeric operators: `+`, `-`, `*`, `/`, `%`, `<`, `<=`, `=`, `!=`, `>=`, `>`<br>
Numeric functions: `min`, `max`, `round`, `ceil`, `floor`, `deg`, `asinh`, `asin`, `sin`, `acosh`, `cos`, `atanh`, `atan`, `tan`, `exp`, `log2`, `log10`, `sqrt`, `cbrt`, `rand`, `if`, `case`<br>
Boolean variables: `first`, `even`, `odd`, `last`, `solid`, `random`<br>
Boolean operators: `and`, `or`<br>
Boolean functions: `not`<br>
Alphanumeric variables: `name`, `material`, `tag`, `layer`<br>
Alphanumeric operators: `=`, `!=`<br>
Alphanumeric functions: `concat`

Here are some valid select queries:

`random`<br>
`not(first)`<br>
`width > a`<br>
`first or last`<br>
`nth = if(a = b, c, d)`<br>
`name = concat('Box ', a)`
