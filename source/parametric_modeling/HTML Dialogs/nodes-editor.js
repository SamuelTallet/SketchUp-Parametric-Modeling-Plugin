/**
 * Parametric Modeling (PMG) extension for SketchUp.
 *
 * @copyright © 2021 Samuel Tallet
 *
 * @licence GNU General Public License 3.0
 */

// Translates.
t = string => {

    if ( PMGNodesEditorTranslation.hasOwnProperty(string) ) {
        return PMGNodesEditorTranslation[string]
    } else {
        return string
    }

}

PMG = {}

PMG.NodesEditor = {}

PMG.NodesEditor.initializeSockets = () => {

    PMG.NodesEditor.sockets = {

        number: new Rete.Socket(t('Number')),
        groups: new Rete.Socket(t('Groups')),
        point: new Rete.Socket(t('Point')),
        vector: new Rete.Socket(t('Vector'))

    }

}

PMG.NodesEditor.initializeSockets()

PMG.Utils = {}

PMG.Utils.cloneObject = object => {
    return JSON.parse(JSON.stringify(object))
}

PMG.Utils.isValidNumber = number => {

    if ( typeof number === 'number' ) {
        return true
    }

    if ( typeof number === 'string' && /^-?(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(number) ) {
        return true
    }

    return false

}

PMG.NodesEditor.initializeControls = () => {

    PMG.NodesEditor.controls = {}

    PMG.NodesEditor.controls['number'] = {

        props: ['emitter', 'ikey', 'getData', 'putData', 'placeholder', 'readonly'],

        template: '<input type="number" :placeholder="placeholder" :title="placeholder" :readonly="readonly" :value="value" @input="change($event)" @pointerdown.stop="" @pointermove.stop="" />',
        
        data() {

            return {
                value: ''
            }

        },

        methods: {

            change(event) {

                if ( PMG.Utils.isValidNumber(event.target.value) ) {

                    this.value = parseFloat(event.target.value)

                    this.update()

                }

            },

            update() {

                this.putData(this.ikey, this.value)

                this.emitter.trigger('process')

            }

        },

        mounted() {

            if ( PMG.Utils.isValidNumber(this.getData(this.ikey)) ) {
                this.value = this.getData(this.ikey)
            }

        }
        
    }

    PMG.NodesEditor.controls['text'] = {

        props: ['emitter', 'ikey', 'getData', 'putData', 'placeholder', 'readonly'],

        template: '<input type="text" :placeholder="placeholder" :readonly="readonly" :value="value" @input="change($event)" @pointerdown.stop="" @pointermove.stop="" />',
        
        data() {

            return {
                value: ''
            }

        },

        methods: {

            change(event) {

                this.value = event.target.value

                this.update()

            },

            update() {

                this.putData(this.ikey, this.value)
                
                this.emitter.trigger('process')

            }

        },

        mounted() {
            this.value = this.getData(this.ikey)
        }
        
    }

    PMG.NodesEditor.controls['checkbox'] = {

        props: ['emitter', 'ikey', 'getData', 'putData', 'label'],

        template:
        `<div class="checkbox-control">
            <input type="checkbox" @change="change($event)" :checked="checked" />
            {{ label }}
        </div>`,

        data() {

            return {
                checked: this.getData(this.ikey),
                label: this.label
            }
            
        },

        methods: {

            change(event) {

                this.checked = event.target.checked

                this.update()

            },

            update() {

                this.putData(this.ikey, this.checked)
                
                this.emitter.trigger('process')

            }

        },

        mounted() {
            this.checked = this.getData(this.ikey)
        }
        
    }

    PMG.NodesEditor.controls['material'] = {

        props: ['emitter', 'ikey', 'getData', 'putData'],

        template:
        `<select @change="change($event)">
            <option value="">${t('Material...')}</option>
            <option v-for="material in materials" v-bind:value="material.name" v-bind:selected="material.selected">
                {{ material.display_name }}
            </option>
        </select>`,

        data() {

            var nodeSelectedMaterial = this.getData(this.ikey)
            var nodeSelectableMaterials = PMG.Utils.cloneObject(SketchUpMaterials)

            nodeSelectableMaterials.forEach(nodeSelectableMaterial => {

                if ( nodeSelectableMaterial.name == nodeSelectedMaterial ) {
                    nodeSelectableMaterial.selected = 'selected'
                } else {
                    nodeSelectableMaterial.selected = ''
                }

            })

            return {
                materials: nodeSelectableMaterials
            }
            
        },

        methods: {

            change(event) {

                this.value = event.target.value

                this.update()

            },

            update() {

                this.putData(this.ikey, this.value)
                
                this.emitter.trigger('process')

            }

        },

        mounted() {
            this.value = this.getData(this.ikey)
        }
        
    }

    PMG.NodesEditor.controls['layer'] = {

        props: ['emitter', 'ikey', 'getData', 'putData'],

        template:
        `<select @change="change($event)">
            <option value="">${t('Tag/Layer...')}</option>
            <option v-for="layer in layers" v-bind:value="layer.name" v-bind:selected="layer.selected">
                {{ layer.display_name }}
            </option>
        </select>`,

        data() {

            var nodeSelectedLayer = this.getData(this.ikey)
            var nodeSelectableLayers = PMG.Utils.cloneObject(SketchUpLayers)

            nodeSelectableLayers.forEach(nodeSelectableLayer => {

                if ( nodeSelectableLayer.name == nodeSelectedLayer ) {
                    nodeSelectableLayer.selected = 'selected'
                } else {
                    nodeSelectableLayer.selected = ''
                }

            })

            return {
                layers: nodeSelectableLayers
            }
            
        },

        methods: {

            change(event) {

                this.value = event.target.value

                this.update()

            },

            update() {

                this.putData(this.ikey, this.value)
                
                this.emitter.trigger('process')

            }

        },

        mounted() {
            this.value = this.getData(this.ikey)
        }
        
    }

}

PMG.NodesEditor.initializeControls()

class NumberReteControl extends Rete.Control {

    constructor(emitter, ikey, placeholder, readonly) {

        super(ikey)
        this.component = PMG.NodesEditor.controls.number
        this.props = { emitter, ikey, placeholder, readonly }

    }
  
    setValue(value) {
        this.vueContext.value = value
    }

}

class TextReteControl extends Rete.Control {

    constructor(emitter, ikey, placeholder, readonly) {

        super(ikey)
        this.component = PMG.NodesEditor.controls.text
        this.props = { emitter, ikey, placeholder, readonly }

    }
  
    setValue(value) {
        this.vueContext.value = value
    }

}

class CheckBoxReteControl extends Rete.Control {

    constructor(emitter, ikey, label) {

        super(ikey)
        this.component = PMG.NodesEditor.controls.checkbox
        this.props = { emitter, ikey, label }

    }
  
    setValue(checked) {
        this.vueContext.checked = checked
    }

}

class MaterialReteControl extends Rete.Control {

    constructor(emitter, key, _readonly) {

        super(key)
        this.component = PMG.NodesEditor.controls.material
        this.props = { emitter, ikey: key }

    }
  
    setValue(value) {
        this.vueContext.value = value
    }

}

class LayerReteControl extends Rete.Control {

    constructor(emitter, key, _readonly) {

        super(key)
        this.component = PMG.NodesEditor.controls.layer
        this.props = { emitter, ikey: key }

    }
  
    setValue(value) {
        this.vueContext.value = value
    }

}

class DrawBoxReteComponent extends Rete.Component {

    constructor() {
        super('Draw box')
    }

    builder(node) {

        var width = new Rete.Input('width', t('Width'), PMG.NodesEditor.sockets.number)
        width.addControl(new NumberReteControl(this.editor, 'width', t('Width')))

        var depth = new Rete.Input('depth', t('Depth'), PMG.NodesEditor.sockets.number)
        depth.addControl(new NumberReteControl(this.editor, 'depth', t('Depth')))

        var height = new Rete.Input('height', t('Height'), PMG.NodesEditor.sockets.number)
        height.addControl(new NumberReteControl(this.editor, 'height', t('Height')))

        var group = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(width)
            .addInput(depth)
            .addInput(height)
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

class DrawPrismReteComponent extends Rete.Component {

    constructor() {
        super('Draw prism')
    }

    builder(node) {

        var radius = new Rete.Input('radius', t('Radius'), PMG.NodesEditor.sockets.number)
        radius.addControl(new NumberReteControl(this.editor, 'radius', t('Radius')))

        var height = new Rete.Input('height', t('Height'), PMG.NodesEditor.sockets.number)
        height.addControl(new NumberReteControl(this.editor, 'height', t('Height')))
        
        var sides = new Rete.Input('sides', t('Sides'), PMG.NodesEditor.sockets.number)
        sides.addControl(new NumberReteControl(this.editor, 'sides', t('Sides')))

        var group = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(radius)
            .addInput(height)
            .addInput(sides)
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

class DrawCylinderReteComponent extends Rete.Component {

    constructor() {
        super('Draw cylinder')
    }

    builder(node) {

        var radius = new Rete.Input('radius', t('Radius'), PMG.NodesEditor.sockets.number)
        radius.addControl(new NumberReteControl(this.editor, 'radius', t('Radius')))

        var height = new Rete.Input('height', t('Height'), PMG.NodesEditor.sockets.number)
        height.addControl(new NumberReteControl(this.editor, 'height', t('Height')))

        var segments = new Rete.Input('segments', t('Segments'), PMG.NodesEditor.sockets.number)
        segments.addControl(new NumberReteControl(this.editor, 'segments', t('Segments')))

        var group = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(radius)
            .addInput(height)
            .addInput(segments)
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

class DrawTubeReteComponent extends Rete.Component {

    constructor() {
        super('Draw tube')
    }

    builder(node) {

        var radius = new Rete.Input('radius', t('Radius'), PMG.NodesEditor.sockets.number)
        radius.addControl(new NumberReteControl(this.editor, 'radius', t('Radius')))

        var thickness = new Rete.Input('thickness', t('Thickness'), PMG.NodesEditor.sockets.number)
        thickness.addControl(new NumberReteControl(this.editor, 'thickness', t('Thickness')))

        var height = new Rete.Input('height', t('Height'), PMG.NodesEditor.sockets.number)
        height.addControl(new NumberReteControl(this.editor, 'height', t('Height')))

        var segments = new Rete.Input('segments', t('Segments'), PMG.NodesEditor.sockets.number)
        segments.addControl(new NumberReteControl(this.editor, 'segments', t('Segments')))

        var group = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(radius)
            .addInput(thickness)
            .addInput(height)
            .addInput(segments)
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

class DrawPyramidReteComponent extends Rete.Component {

    constructor() {
        super('Draw pyramid')
    }

    builder(node) {

        var radius = new Rete.Input('radius', t('Radius'), PMG.NodesEditor.sockets.number)
        radius.addControl(new NumberReteControl(this.editor, 'radius', t('Radius')))

        var height = new Rete.Input('height', t('Height'), PMG.NodesEditor.sockets.number)
        height.addControl(new NumberReteControl(this.editor, 'height', t('Height')))

        var sides = new Rete.Input('sides', t('Sides'), PMG.NodesEditor.sockets.number)
        sides.addControl(new NumberReteControl(this.editor, 'sides', t('Sides')))

        var group = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(radius)
            .addInput(height)
            .addInput(sides)
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

class DrawConeReteComponent extends Rete.Component {

    constructor() {
        super('Draw cone')
    }

    builder(node) {

        var radius = new Rete.Input('radius', t('Radius'), PMG.NodesEditor.sockets.number)
        radius.addControl(new NumberReteControl(this.editor, 'radius', t('Radius')))

        var height = new Rete.Input('height', t('Height'), PMG.NodesEditor.sockets.number)
        height.addControl(new NumberReteControl(this.editor, 'height', t('Height')))

        var segments = new Rete.Input('segments', t('Segments'), PMG.NodesEditor.sockets.number)
        segments.addControl(new NumberReteControl(this.editor, 'segments', t('Segments')))

        var group = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(radius)
            .addInput(height)
            .addInput(segments)
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

class DrawSphereReteComponent extends Rete.Component {

    constructor() {
        super('Draw sphere')
    }

    builder(node) {

        var radius = new Rete.Input('radius', t('Radius'), PMG.NodesEditor.sockets.number)
        radius.addControl(new NumberReteControl(this.editor, 'radius', t('Radius')))

        var segments = new Rete.Input('segments', t('Segments'), PMG.NodesEditor.sockets.number)
        segments.addControl(new NumberReteControl(this.editor, 'segments', t('Segments')))

        var group = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(radius)
            .addInput(segments)
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

class DrawShapeReteComponent extends Rete.Component {

    constructor() {
        super('Draw shape')
    }

    builder(node) {

        var group = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

class NumberReteComponent extends Rete.Component {

    constructor() {
        super('Number')
    }

    builder(node) {

        var number = new Rete.Output('number', t('Number'), PMG.NodesEditor.sockets.number)

        return node
            .addControl(new TextReteControl(this.editor, 'label', t('Label')))
            .addControl(new NumberReteControl(this.editor, 'number'))
            .addOutput(number)

    }

    worker(node, _inputs, outputs) {
        outputs['number'] = PMG.Utils.isValidNumber(node.data.number) ? node.data.number : 0
    }

}

class AddReteComponent extends Rete.Component {

    constructor() {
        super('Add')
    }

    builder(node) {

        var inputNumber1 = new Rete.Input('number1', t('Number'), PMG.NodesEditor.sockets.number)
        inputNumber1.addControl(new NumberReteControl(this.editor, 'number1'))

        var inputNumber2 = new Rete.Input('number2', t('Number'), PMG.NodesEditor.sockets.number)
        inputNumber2.addControl(new NumberReteControl(this.editor, 'number2'))

        var outputNumber = new Rete.Output('number', t('Number'), PMG.NodesEditor.sockets.number)

        return node
            .addInput(inputNumber1)
            .addInput(inputNumber2)
            .addControl(new NumberReteControl(this.editor, 'preview', '', true))
            .addOutput(outputNumber)

    }

    worker(node, inputs, outputs) {

        var number1 = inputs['number1'].length ? inputs['number1'][0] : node.data.number1
        var number2 = inputs['number2'].length ? inputs['number2'][0] : node.data.number2

        if ( PMG.Utils.isValidNumber(number1) ) {
            number1 = parseFloat(number1)
        } else {
            number1 = 0
        }

        if ( PMG.Utils.isValidNumber(number2) ) {
            number2 = parseFloat(number2)
        } else {
            number2 = 0
        }
        
        var sum = number1 + number2
        sum = Math.round((sum + Number.EPSILON) * 1000000) / 1000000
        
        this.editor.nodes.find(n => n.id == node.id).controls.get('preview').setValue(sum)
        outputs['number'] = sum

    }

}

class SubtractReteComponent extends Rete.Component {

    constructor() {
        super('Subtract')
    }

    builder(node) {

        var inputNumber1 = new Rete.Input('number1', t('Number'), PMG.NodesEditor.sockets.number)
        inputNumber1.addControl(new NumberReteControl(this.editor, 'number1'))

        var inputNumber2 = new Rete.Input('number2', t('Number'), PMG.NodesEditor.sockets.number)
        inputNumber2.addControl(new NumberReteControl(this.editor, 'number2'))

        var outputNumber = new Rete.Output('number', t('Number'), PMG.NodesEditor.sockets.number)

        return node
            .addInput(inputNumber1)
            .addInput(inputNumber2)
            .addControl(new NumberReteControl(this.editor, 'preview', '', true))
            .addOutput(outputNumber)

    }

    worker(node, inputs, outputs) {

        var number1 = inputs['number1'].length ? inputs['number1'][0] : node.data.number1
        var number2 = inputs['number2'].length ? inputs['number2'][0] : node.data.number2

        if ( PMG.Utils.isValidNumber(number1) ) {
            number1 = parseFloat(number1)
        } else {
            number1 = 0
        }

        if ( PMG.Utils.isValidNumber(number2) ) {
            number2 = parseFloat(number2)
        } else {
            number2 = 0
        }
        
        var diff = number1 - number2
        diff = Math.round((diff + Number.EPSILON) * 1000000) / 1000000
        
        this.editor.nodes.find(n => n.id == node.id).controls.get('preview').setValue(diff)
        outputs['number'] = diff

    }

}

class MultiplyReteComponent extends Rete.Component {

    constructor() {
        super('Multiply')
    }

    builder(node) {

        var inputNumber1 = new Rete.Input('number1', t('Number'), PMG.NodesEditor.sockets.number)
        inputNumber1.addControl(new NumberReteControl(this.editor, 'number1'))

        var inputNumber2 = new Rete.Input('number2', t('Number'), PMG.NodesEditor.sockets.number)
        inputNumber2.addControl(new NumberReteControl(this.editor, 'number2'))

        var outputNumber = new Rete.Output('number', t('Number'), PMG.NodesEditor.sockets.number)

        return node
            .addInput(inputNumber1)
            .addInput(inputNumber2)
            .addControl(new NumberReteControl(this.editor, 'preview', '', true))
            .addOutput(outputNumber)

    }

    worker(node, inputs, outputs) {

        var number1 = inputs['number1'].length ? inputs['number1'][0] : node.data.number1
        var number2 = inputs['number2'].length ? inputs['number2'][0] : node.data.number2

        if ( PMG.Utils.isValidNumber(number1) ) {
            number1 = parseFloat(number1)
        } else {
            number1 = 0
        }

        if ( PMG.Utils.isValidNumber(number2) ) {
            number2 = parseFloat(number2)
        } else {
            number2 = 0
        }
        
        var product = number1 * number2
        
        this.editor.nodes.find(n => n.id == node.id).controls.get('preview').setValue(product)
        outputs['number'] = product

    }

}

class DivideReteComponent extends Rete.Component {

    constructor() {
        super('Divide')
    }

    builder(node) {

        var dividend = new Rete.Input('dividend', t('Dividend'), PMG.NodesEditor.sockets.number)
        dividend.addControl(new NumberReteControl(this.editor, 'dividend', t('Dividend')))

        var divisor = new Rete.Input('divisor', t('Divisor'), PMG.NodesEditor.sockets.number)
        divisor.addControl(new NumberReteControl(this.editor, 'divisor', t('Divisor')))

        var quotient = new Rete.Output('quotient', t('Quotient'), PMG.NodesEditor.sockets.number)
        var remainder = new Rete.Output('remainder', t('Remainder'), PMG.NodesEditor.sockets.number)

        return node
            .addInput(dividend)
            .addInput(divisor)
            .addControl(new NumberReteControl(this.editor, 'preview', '', true))
            .addOutput(quotient)
            .addOutput(remainder)

    }

    worker(node, inputs, outputs) {

        var dividend = inputs['dividend'].length ? inputs['dividend'][0] : node.data.dividend
        var divisor = inputs['divisor'].length ? inputs['divisor'][0] : node.data.divisor

        if ( PMG.Utils.isValidNumber(dividend) ) {
            dividend = parseFloat(dividend)
        } else {
            dividend = 0
        }

        if ( PMG.Utils.isValidNumber(divisor) ) {
            divisor = parseFloat(divisor)
        } else {
            divisor = 1
        }

        var quotient = dividend / divisor
        var remainder = dividend % divisor
        
        this.editor.nodes.find(n => n.id == node.id).controls.get('preview').setValue(quotient)
        outputs['quotient'] = quotient
        outputs['remainder'] = remainder

    }

}

PMG.Utils.degrees2radians = angle => {
    return angle * ( Math.PI / 180 )
}

class CalculateReteComponent extends Rete.Component {

    constructor() {
        super('Calculate')
    }

    builder(node) {

        var inputA = new Rete.Input('a', t('Variable A'), PMG.NodesEditor.sockets.number)
        inputA.addControl(new NumberReteControl(this.editor, 'a', t('Variable A')))

        var inputB = new Rete.Input('b', t('Variable B'), PMG.NodesEditor.sockets.number)
        inputB.addControl(new NumberReteControl(this.editor, 'b', t('Variable B')))

        var inputC = new Rete.Input('c', t('Variable C'), PMG.NodesEditor.sockets.number)
        inputC.addControl(new NumberReteControl(this.editor, 'c', t('Variable C')))

        var inputD = new Rete.Input('d', t('Variable D'), PMG.NodesEditor.sockets.number)
        inputD.addControl(new NumberReteControl(this.editor, 'd', t('Variable D')))

        var inputE = new Rete.Input('e', t('Variable E'), PMG.NodesEditor.sockets.number)
        inputE.addControl(new NumberReteControl(this.editor, 'e', t('Variable E')))
        
        var inputF = new Rete.Input('f', t('Variable F'), PMG.NodesEditor.sockets.number)
        inputF.addControl(new NumberReteControl(this.editor, 'f', t('Variable F')))

        var inputG = new Rete.Input('g', t('Variable G'), PMG.NodesEditor.sockets.number)
        inputG.addControl(new NumberReteControl(this.editor, 'g', t('Variable G')))

        var inputH = new Rete.Input('h', t('Variable H'), PMG.NodesEditor.sockets.number)
        inputH.addControl(new NumberReteControl(this.editor, 'h', t('Variable H')))

        var inputI = new Rete.Input('i', t('Variable I'), PMG.NodesEditor.sockets.number)
        inputI.addControl(new NumberReteControl(this.editor, 'i', t('Variable I')))

        var inputJ = new Rete.Input('j', t('Variable J'), PMG.NodesEditor.sockets.number)
        inputJ.addControl(new NumberReteControl(this.editor, 'j', t('Variable J')))

        var inputK = new Rete.Input('k', t('Variable K'), PMG.NodesEditor.sockets.number)
        inputK.addControl(new NumberReteControl(this.editor, 'k', t('Variable K')))

        var inputL = new Rete.Input('l', t('Variable L'), PMG.NodesEditor.sockets.number)
        inputL.addControl(new NumberReteControl(this.editor, 'l', t('Variable L')))

        var outputNumber = new Rete.Output('number', t('Number'), PMG.NodesEditor.sockets.number)

        return node
            .addControl(new TextReteControl(this.editor, 'formula', t('Formula example:') + ' round(a) * b'))
            .addInput(inputA)
            .addInput(inputB)
            .addInput(inputC)
            .addInput(inputD)
            .addInput(inputE)
            .addInput(inputF)
            .addInput(inputG)
            .addInput(inputH)
            .addInput(inputI)
            .addInput(inputJ)
            .addInput(inputK)
            .addInput(inputL)
            .addOutput(outputNumber)

    }

    worker(node, inputs, outputs) {

        if ( node.data.formula === undefined ) {

            outputs['number'] = 0
            return
            
        }

        var a = inputs['a'].length ? inputs['a'][0] : node.data.a
        var b = inputs['b'].length ? inputs['b'][0] : node.data.b
        var c = inputs['c'].length ? inputs['c'][0] : node.data.c
        var d = inputs['d'].length ? inputs['d'][0] : node.data.d
        var e = inputs['e'].length ? inputs['e'][0] : node.data.e
        var f = inputs['f'].length ? inputs['f'][0] : node.data.f
        var g = inputs['g'].length ? inputs['g'][0] : node.data.g
        var h = inputs['h'].length ? inputs['h'][0] : node.data.h
        var i = inputs['i'].length ? inputs['i'][0] : node.data.i
        var j = inputs['j'].length ? inputs['j'][0] : node.data.j
        var k = inputs['k'].length ? inputs['k'][0] : node.data.k
        var l = inputs['l'].length ? inputs['l'][0] : node.data.l
        var pi = Math.PI

        a = PMG.Utils.isValidNumber(a) ? a : 0
        b = PMG.Utils.isValidNumber(b) ? b : 0
        c = PMG.Utils.isValidNumber(c) ? c : 0
        d = PMG.Utils.isValidNumber(d) ? d : 0
        e = PMG.Utils.isValidNumber(e) ? e : 0
        f = PMG.Utils.isValidNumber(f) ? f : 0
        g = PMG.Utils.isValidNumber(g) ? g : 0
        h = PMG.Utils.isValidNumber(h) ? h : 0
        i = PMG.Utils.isValidNumber(i) ? i : 0
        j = PMG.Utils.isValidNumber(j) ? j : 0
        k = PMG.Utils.isValidNumber(k) ? k : 0
        l = PMG.Utils.isValidNumber(l) ? l : 0

        var fixed_formula = node.data.formula
            .replace(/min/g, 'Math.min')
            .replace(/max/g, 'Math.max')
            .replace(/round/g, 'Math.round')
            .replace(/ceil/g, 'Math.ceil')
            .replace(/floor/g, 'Math.floor')
            .replace(/deg/g, 'PMG.Utils.degrees2radians')
            .replace(/asinh/g, 'Math.asinh')
            .replace(/asin/g, 'Math.asin')
            .replace(/sin/g, 'Math.sin')
            .replace(/acosh/g, 'Math.acosh')
            .replace(/acos/g, 'Math.acos')
            .replace(/cos/g, 'Math.cos')
            .replace(/atanh/g, 'Math.atanh')
            .replace(/atan/g, 'Math.atan')
            .replace(/tan/g, 'Math.tan')
            .replace(/exp/g, 'Math.exp')
            .replace(/log2/g, 'Math.log2')
            .replace(/log10/g, 'Math.log10')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/cbrt/g, 'Math.cbrt')

        outputs['number'] = eval(fixed_formula)

    }

}

class PointReteComponent extends Rete.Component {

    constructor() {
        super('Point')
    }

    builder(node) {

        var inputPointX = new Rete.Input('x', 'X', PMG.NodesEditor.sockets.number)
        inputPointX.addControl(new NumberReteControl(this.editor, 'x', 'X'))

        var inputPointY = new Rete.Input('y', 'Y', PMG.NodesEditor.sockets.number)
        inputPointY.addControl(new NumberReteControl(this.editor, 'y', 'Y'))

        var inputPointZ = new Rete.Input('z', 'Z', PMG.NodesEditor.sockets.number)
        inputPointZ.addControl(new NumberReteControl(this.editor, 'z', 'Z'))

        var outputPoint = new Rete.Output('point', t('Point'), PMG.NodesEditor.sockets.point)

        return node
            .addInput(inputPointX)
            .addInput(inputPointY)
            .addInput(inputPointZ)
            .addOutput(outputPoint)

    }

    worker(node, _inputs, outputs) {

        var x = PMG.Utils.isValidNumber(node.data.x) ? node.data.x : 0
        var y = PMG.Utils.isValidNumber(node.data.y) ? node.data.y : 0
        var z = PMG.Utils.isValidNumber(node.data.z) ? node.data.z : 0

        outputs['point'] = { x, y, z }

    }
}

class VectorReteComponent extends Rete.Component {

    constructor() {
        super('Vector')
    }

    builder(node) {

        var inputVectorX = new Rete.Input('x', 'X', PMG.NodesEditor.sockets.number)
        inputVectorX.addControl(new NumberReteControl(this.editor, 'x', 'X'))

        var inputVectorY = new Rete.Input('y', 'Y', PMG.NodesEditor.sockets.number)
        inputVectorY.addControl(new NumberReteControl(this.editor, 'y', 'Y'))

        var inputVectorZ = new Rete.Input('z', 'Z', PMG.NodesEditor.sockets.number)
        inputVectorZ.addControl(new NumberReteControl(this.editor, 'z', 'Z'))

        var outputVector = new Rete.Output('vector', t('Vector'), PMG.NodesEditor.sockets.vector)

        return node
            .addInput(inputVectorX)
            .addInput(inputVectorY)
            .addInput(inputVectorZ)
            .addOutput(outputVector)

    }

    worker(node, _inputs, outputs) {

        var x = PMG.Utils.isValidNumber(node.data.x) ? node.data.x : 0
        var y = PMG.Utils.isValidNumber(node.data.y) ? node.data.y : 0
        var z = PMG.Utils.isValidNumber(node.data.z) ? node.data.z : 0

        outputs['vector'] = { x, y, z }

    }
}

class IntersectSolidsReteComponent extends Rete.Component {

    constructor() {
        super('Intersect solids')
    }

    builder(node) {

        var inputGroups1 = new Rete.Input('groups1', t('Group'), PMG.NodesEditor.sockets.groups)
        var inputGroups2 = new Rete.Input('groups2', t('Group'), PMG.NodesEditor.sockets.groups)

        var outputGroups = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups1)
            .addInput(inputGroups2)
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

class UniteSolidsReteComponent extends Rete.Component {

    constructor() {
        super('Unite solids')
    }

    builder(node) {

        var inputGroups1 = new Rete.Input('groups1', t('Group'), PMG.NodesEditor.sockets.groups)
        var inputGroups2 = new Rete.Input('groups2', t('Group'), PMG.NodesEditor.sockets.groups)

        var outputGroups = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups1)
            .addInput(inputGroups2)
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

class SubtractSolidsReteComponent extends Rete.Component {

    constructor() {
        super('Subtract solids')
    }

    builder(node) {

        var inputGroups1 = new Rete.Input('groups1', t('Group'), PMG.NodesEditor.sockets.groups)
        var inputGroups2 = new Rete.Input('groups2', t('Group'), PMG.NodesEditor.sockets.groups)

        var outputGroups = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups1)
            .addInput(inputGroups2)
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

class PushPullReteComponent extends Rete.Component {

    constructor() {
        super('Push/Pull')
    }

    builder(node) {

        var inputGroups = new Rete.Input('groups', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputDistance = new Rete.Input('distance', t('Distance'), PMG.NodesEditor.sockets.number)
        inputDistance.addControl(new NumberReteControl(this.editor, 'distance', t('Distance')))
        var inputDirection = new Rete.Input('direction', t('Direction'), PMG.NodesEditor.sockets.vector)

        var outputGroups = new Rete.Output('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addInput(inputDistance)
            .addControl(new CheckBoxReteControl(this.editor, 'increment_distance', t('Increment distance')))
            .addInput(inputDirection)
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

class MoveReteComponent extends Rete.Component {

    constructor() {
        super('Move')
    }

    builder(node) {

        var inputGroups = new Rete.Input('groups', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputPoint = new Rete.Input('point', t('Position'), PMG.NodesEditor.sockets.point)

        var outputGroups = new Rete.Output('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addInput(inputPoint)
            .addControl(new CheckBoxReteControl(this.editor, 'point_is_absolute', t('Position is absolute')))
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

class RotateReteComponent extends Rete.Component {

    constructor() {
        super('Rotate')
    }

    builder(node) {

        var inputGroups = new Rete.Input('groups', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputCenter = new Rete.Input('center', t('Center'), PMG.NodesEditor.sockets.point)
        var inputAxis = new Rete.Input('axis', t('Axis'), PMG.NodesEditor.sockets.vector)
        var inputAngle = new Rete.Input('angle', t('Angle'), PMG.NodesEditor.sockets.number)
        inputAngle.addControl(new NumberReteControl(this.editor, 'angle', t('Angle')))

        var outputGroups = new Rete.Output('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addInput(inputCenter)
            .addInput(inputAxis)
            .addInput(inputAngle)
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

class ScaleReteComponent extends Rete.Component {

    constructor() {
        super('Scale')
    }

    builder(node) {

        var inputGroups = new Rete.Input('groups', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputPoint = new Rete.Input('point', t('Point'), PMG.NodesEditor.sockets.point)
        var inputXFactor = new Rete.Input('x_factor', t('X factor'), PMG.NodesEditor.sockets.number)
        inputXFactor.addControl(new NumberReteControl(this.editor, 'x_factor', t('X factor')))
        var inputYFactor = new Rete.Input('y_factor', 'Y factor', PMG.NodesEditor.sockets.number)
        inputYFactor.addControl(new NumberReteControl(this.editor, 'y_factor', t('Y factor')))
        var inputZFactor = new Rete.Input('z_factor', 'Z factor', PMG.NodesEditor.sockets.number)
        inputZFactor.addControl(new NumberReteControl(this.editor, 'z_factor', t('Z factor')))

        var outputGroups = new Rete.Output('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addInput(inputPoint)
            .addInput(inputXFactor)
            .addInput(inputYFactor)
            .addInput(inputZFactor)
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

class PaintReteComponent extends Rete.Component {

    constructor() {
        super('Paint')
    }

    builder(node) {

        var inputGroups = new Rete.Input('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        var outputGroups = new Rete.Output('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

class TagReteComponent extends Rete.Component {

    constructor() {
        super('Tag')
    }

    builder(node) {

        var inputGroups = new Rete.Input('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        var outputGroups = new Rete.Output('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

class EraseReteComponent extends Rete.Component {

    constructor() {
        super('Erase')
    }

    builder(node) {

        var groups = new Rete.Input('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(groups)

    }

    worker(_node, _inputs, _outputs) {
    }

}

class CopyReteComponent extends Rete.Component {

    constructor() {
        super('Copy')
    }

    builder(node) {

        var inputGroups = new Rete.Input('groups', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputCopies = new Rete.Input('copies', t('Copies'), PMG.NodesEditor.sockets.number)
        inputCopies.addControl(new NumberReteControl(this.editor, 'copies', t('Copies')))

        var outputCopiedGroups = new Rete.Output('groups', t('Copied groups'), PMG.NodesEditor.sockets.groups)
        var outputOriginalGroups = new Rete.Output('original_groups', t('Original groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addInput(inputCopies)
            .addControl(new CheckBoxReteControl(this.editor, 'output_original', t('Put originals with copies')))
            .addOutput(outputCopiedGroups)
            .addOutput(outputOriginalGroups)

    }

    worker(_node, _inputs, outputs) {

        outputs['groups'] = []
        outputs['original_groups'] = []

    }

}

class ConcatenateReteComponent extends Rete.Component {

    constructor() {
        super('Concatenate')
    }

    builder(node) {

        var inputGroups1 = new Rete.Input('groups1', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups2 = new Rete.Input('groups2', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups3 = new Rete.Input('groups3', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups4 = new Rete.Input('groups4', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups5 = new Rete.Input('groups5', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups6 = new Rete.Input('groups6', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups7 = new Rete.Input('groups7', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups8 = new Rete.Input('groups8', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups9 = new Rete.Input('groups9', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups10 = new Rete.Input('groups10', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups11 = new Rete.Input('groups11', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups12 = new Rete.Input('groups12', t('Groups'), PMG.NodesEditor.sockets.groups)

        var outputGroups = new Rete.Output('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups1)
            .addInput(inputGroups2)
            .addInput(inputGroups3)
            .addInput(inputGroups4)
            .addInput(inputGroups5)
            .addInput(inputGroups6)
            .addInput(inputGroups7)
            .addInput(inputGroups8)
            .addInput(inputGroups9)
            .addInput(inputGroups10)
            .addInput(inputGroups11)
            .addInput(inputGroups12)
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

class SelectReteComponent extends Rete.Component {

    constructor() {
        super('Select')
    }

    builder(node) {

        var inputGroups = new Rete.Input('groups', t('Groups'), PMG.NodesEditor.sockets.groups)

        var inputA = new Rete.Input('a', t('Variable A'), PMG.NodesEditor.sockets.number)
        inputA.addControl(new NumberReteControl(this.editor, 'a', t('Variable A')))

        var inputB = new Rete.Input('b', t('Variable B'), PMG.NodesEditor.sockets.number)
        inputB.addControl(new NumberReteControl(this.editor, 'b', t('Variable B')))

        var inputC = new Rete.Input('c', t('Variable C'), PMG.NodesEditor.sockets.number)
        inputC.addControl(new NumberReteControl(this.editor, 'c', t('Variable C')))

        var inputD = new Rete.Input('d', t('Variable D'), PMG.NodesEditor.sockets.number)
        inputD.addControl(new NumberReteControl(this.editor, 'd', t('Variable D')))

        var inputE = new Rete.Input('e', t('Variable E'), PMG.NodesEditor.sockets.number)
        inputE.addControl(new NumberReteControl(this.editor, 'e', t('Variable E')))
        
        var inputF = new Rete.Input('f', t('Variable F'), PMG.NodesEditor.sockets.number)
        inputF.addControl(new NumberReteControl(this.editor, 'f', t('Variable F')))

        var inputG = new Rete.Input('g', t('Variable G'), PMG.NodesEditor.sockets.number)
        inputG.addControl(new NumberReteControl(this.editor, 'g', t('Variable G')))

        var inputH = new Rete.Input('h', t('Variable H'), PMG.NodesEditor.sockets.number)
        inputH.addControl(new NumberReteControl(this.editor, 'h', t('Variable H')))

        var inputI = new Rete.Input('i', t('Variable I'), PMG.NodesEditor.sockets.number)
        inputI.addControl(new NumberReteControl(this.editor, 'i', t('Variable I')))

        var inputJ = new Rete.Input('j', t('Variable J'), PMG.NodesEditor.sockets.number)
        inputJ.addControl(new NumberReteControl(this.editor, 'j', t('Variable J')))

        var inputK = new Rete.Input('k', t('Variable K'), PMG.NodesEditor.sockets.number)
        inputK.addControl(new NumberReteControl(this.editor, 'k', t('Variable K')))

        var inputL = new Rete.Input('l', t('Variable L'), PMG.NodesEditor.sockets.number)
        inputL.addControl(new NumberReteControl(this.editor, 'l', t('Variable L')))

        var outputGroups = new Rete.Output('groups', t('Matching groups'), PMG.NodesEditor.sockets.groups)
        
        var outputNotGroups = new Rete.Output('not_groups', t('Not matching groups'), PMG.NodesEditor.sockets.groups)

        return node
            .addControl(new TextReteControl(this.editor, 'query', t('Query example:') + ' odd'))
            .addInput(inputGroups)
            .addInput(inputA)
            .addInput(inputB)
            .addInput(inputC)
            .addInput(inputD)
            .addInput(inputE)
            .addInput(inputF)
            .addInput(inputG)
            .addInput(inputH)
            .addInput(inputI)
            .addInput(inputJ)
            .addInput(inputK)
            .addInput(inputL)
            .addOutput(outputGroups)
            .addOutput(outputNotGroups)

    }

    worker(_node, _inputs, outputs) {

        outputs['groups'] = []
        outputs['not_groups'] = []

    }

}

class MakeGroupReteComponent extends Rete.Component {

    constructor() {
        super('Make group')
    }

    builder(node) {

        var inputGroups1 = new Rete.Input('groups1', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups2 = new Rete.Input('groups2', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups3 = new Rete.Input('groups3', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups4 = new Rete.Input('groups4', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups5 = new Rete.Input('groups5', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups6 = new Rete.Input('groups6', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups7 = new Rete.Input('groups7', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups8 = new Rete.Input('groups8', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups9 = new Rete.Input('groups9', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups10 = new Rete.Input('groups10', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups11 = new Rete.Input('groups11', t('Groups'), PMG.NodesEditor.sockets.groups)
        var inputGroups12 = new Rete.Input('groups12', t('Groups'), PMG.NodesEditor.sockets.groups)

        var outputGroup = new Rete.Output('groups', t('Group'), PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups1)
            .addInput(inputGroups2)
            .addInput(inputGroups3)
            .addInput(inputGroups4)
            .addInput(inputGroups5)
            .addInput(inputGroups6)
            .addInput(inputGroups7)
            .addInput(inputGroups8)
            .addInput(inputGroups9)
            .addInput(inputGroups10)
            .addInput(inputGroups11)
            .addInput(inputGroups12)
            .addControl(new TextReteControl(this.editor, 'name', t('Name')))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(outputGroup)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = []
    }

}

PMG.codeName = 'ParametricModeling'

PMG.NodesEditor.initializeEditor = () => {

    PMG.NodesEditor.editor = new Rete.NodeEditor(
        PMG.codeName + '@' + PMGNodesEditorSchemaVersion,
        document.querySelector('#pmg-nodes-editor')
    )

    PMG.NodesEditor.editor.use(VueRenderPlugin.default)
    PMG.NodesEditor.editor.use(ConnectionPlugin.default)
    PMG.NodesEditor.editor.use(MinimapPlugin.default)

}

PMG.NodesEditor.initializeEngine = () => {

    PMG.NodesEditor.engine = new Rete.Engine(
        PMG.codeName + '@' + PMGNodesEditorSchemaVersion
    )

}

PMG.NodesEditor.initializeComponents = () => {

    PMG.NodesEditor.components = {

        "Draw box": new DrawBoxReteComponent(),
        "Draw prism": new DrawPrismReteComponent(),
        "Draw cylinder": new DrawCylinderReteComponent(),
        "Draw tube": new DrawTubeReteComponent(),
        "Draw pyramid": new DrawPyramidReteComponent(),
        "Draw cone": new DrawConeReteComponent(),
        "Draw sphere": new DrawSphereReteComponent(),
        "Draw shape": new DrawShapeReteComponent(),
        "Number": new NumberReteComponent(),
        "Add": new AddReteComponent(),
        "Subtract": new SubtractReteComponent(),
        "Multiply": new MultiplyReteComponent(),
        "Divide": new DivideReteComponent(),
        "Calculate": new CalculateReteComponent(),
        "Point": new PointReteComponent(),
        "Vector": new VectorReteComponent(),
        "Intersect solids": new IntersectSolidsReteComponent(),
        "Unite solids": new UniteSolidsReteComponent(),
        "Subtract solids": new SubtractSolidsReteComponent(),
        "Push/Pull": new PushPullReteComponent(),
        "Move": new MoveReteComponent(),
        "Rotate": new RotateReteComponent(),
        "Scale": new ScaleReteComponent(),
        "Paint": new PaintReteComponent(),
        "Tag": new TagReteComponent(),
        "Erase": new EraseReteComponent(),
        "Copy": new CopyReteComponent(),
        "Concatenate": new ConcatenateReteComponent(),
        "Select": new SelectReteComponent(),
        "Make group": new MakeGroupReteComponent()

    }

}

PMG.NodesEditor.registerComponents = () => {

    for (var nodeName in PMG.NodesEditor.components) {

        var component = PMG.NodesEditor.components[nodeName]

        PMG.NodesEditor.editor.register(component)
        PMG.NodesEditor.engine.register(component)

    }

}

PMG.NodesEditor.loadToolbarIcons = () => {
    
    document.querySelectorAll('.toolbar .node-icon').forEach(toolbarNodeIcon => {

        toolbarNodeIcon.src = PMGNodesEditorIcons['nodes'][toolbarNodeIcon.dataset.nodeName]['path']
        toolbarNodeIcon.title = t(toolbarNodeIcon.dataset.nodeName)

    })

    var toolbarHelpIcon = document.querySelector('.toolbar .help-icon')

    toolbarHelpIcon.src = PMGNodesEditorIcons['help']['path']
    toolbarHelpIcon.title = PMGNodesEditorIcons['help']['title']

    if ( SketchUpVersion < 21 ) {
        new Drooltip({
            element: '.toolbar .node-icon, .toolbar .help-icon',
            position: 'bottom',
            background: '#fff',
            color: '#000',
            animation: 'fade'
        })
    }

}

PMG.NodesEditor.schemaIsExportable = false

PMG.NodesEditor.exportModelSchema = redraw => {

    if ( PMG.NodesEditor.schemaIsExportable ) {
        sketchup.exportModelSchema(JSON.stringify(PMG.NodesEditor.editor.toJSON()), redraw)
    }

}

PMG.NodesEditor.addNode = (nodeName, nodeData) => {

    var component = PMG.NodesEditor.components[nodeName]
    var mouse = PMG.NodesEditor.editor.view.area.mouse

    component.createNode(nodeData).then(node => {

        node.position = [mouse.x, mouse.y]
        PMG.NodesEditor.editor.addNode(node)

        PMG.NodesEditor.nodeBeingAdded = node
        
    })

}

PMG.NodesEditor.resizeEditorView = () => {
    document.querySelector('#pmg-nodes-editor').style.height = window.innerHeight + 'px'
}

PMG.NodesEditor.addEventListeners = () => {

    PMG.NodesEditor.editor.on('process nodecreated noderemoved connectioncreated connectionremoved', () => {
        
        PMG.NodesEditor.engine.abort().then(() => {
            PMG.NodesEditor.engine.process(PMG.NodesEditor.editor.toJSON())
        })
        
    })

    PMG.NodesEditor.editor.on('nodecreated noderemoved connectioncreated connectionremoved', () => {
        PMG.NodesEditor.exportModelSchema(true)
    })

    PMG.NodesEditor.editor.on('nodedragged', () => {
        PMG.NodesEditor.exportModelSchema(false)
    })

    PMG.NodesEditor.editor.on('nodecreated', node => {

        var nodeElement = node.vueContext.$el

        nodeElement.setAttribute('data-node-id', node.id)

        new ContextMenu('.node[data-node-id="' + node.id + '"] *', [
            {
                name: t('Remove this node'),
                fn: () => { PMG.NodesEditor.editor.removeNode(node) }
            }
        ])

        if ( SketchUpVersion < 21 ) {
            new Drooltip({
                element: '.node[data-node-id="' + node.id + '"] .socket',
                position: 'bottom',
                background: '#fff',
                color: '#000',
                animation: 'fade'
            })
        }

        nodeElement.querySelectorAll('input[type="number"]').forEach(nodeNumberInputElement => {

            nodeNumberInputElement.addEventListener('input', _event => {
                PMG.NodesEditor.exportModelSchema(true)
            })

        })

        nodeElement.querySelectorAll('input[type="text"]').forEach(nodeTextInputElement => {

            nodeTextInputElement.addEventListener('input', _event => {
                PMG.NodesEditor.exportModelSchema(true)
            })

        })

        nodeElement.querySelectorAll('input[type="checkbox"]').forEach(nodeCheckBoxInputElement => {

            nodeCheckBoxInputElement.addEventListener('change', _event => {
                PMG.NodesEditor.exportModelSchema(true)
            })

        })

        nodeElement.querySelectorAll('select').forEach(nodeSelectElement => {

            nodeSelectElement.addEventListener('change', _event => {
                PMG.NodesEditor.exportModelSchema(true)
            })

        })

        var nodeTitleElement = nodeElement.querySelector('.title')

        nodeTitleElement.innerHTML = t(node.name)

        var nodeTitleGradient = 'linear-gradient(0deg,hsla(0,0%,100%,.05) 0,hsla(0,0%,100%,.05)' +
            ' 40%,hsla(0,0%,100%,.19)),radial-gradient(70% 40px at center,' +
            PMGNodesEditorIcons['nodes'][node.name]['color'] + ' 0,rgba(0,0,0,0) 60%)'

        nodeTitleElement.style.backgroundImage = nodeTitleGradient

        var nodeTitleIconElement = document.createElement('img')

        nodeTitleIconElement.src = PMGNodesEditorIcons['nodes'][node.name]['path']
        nodeTitleIconElement.className = 'icon'
        nodeTitleElement.appendChild(nodeTitleIconElement)

    })

    PMG.NodesEditor.editor.on('zoom', ({ source }) => {
        return source !== 'dblclick'
    })

    PMG.NodesEditor.editor.on('mousemove', () => {

        if ( PMG.NodesEditor.nodeBeingAdded === undefined ) {
            return
        }

        var mouse = PMG.NodesEditor.editor.view.area.mouse

        PMG.NodesEditor.editor.view.nodes
            .get(PMG.NodesEditor.nodeBeingAdded)
            .translate(mouse.x, mouse.y)

    })

    window.addEventListener('click', event => {

        if ( event.target.classList.contains('node-icon') ) {
            return
        }

        PMG.NodesEditor.nodeBeingAdded = undefined

        if ( event.target.classList.contains('main-path') ) {
            
            document.querySelectorAll('.main-path.selected').forEach(connectionPath => {
                connectionPath.classList.remove('selected')
            })

            event.target.classList.add('selected')

        }

    })

    document.querySelectorAll('.toolbar .node-icon').forEach(toolbarNodeIcon => {

        toolbarNodeIcon.addEventListener('click', event => {
            PMG.NodesEditor.addNode(event.currentTarget.dataset.nodeName, {})
        })

    })

    document.querySelector('.toolbar .help-icon').addEventListener('click', _event => {
        sketchup.accessOnlineHelp()
    })

    window.addEventListener('resize', _event => {
        PMG.NodesEditor.resizeEditorView()
    })

}

PMG.NodesEditor.importModelSchema = () => {

    PMG.NodesEditor.engine.abort().then(() => {

        PMG.NodesEditor.editor.fromJSON(PMGNodesEditorSchema).then(() => {

            PMG.NodesEditor.engine.process(PMG.NodesEditor.editor.toJSON()).then(() => {
                PMG.NodesEditor.schemaIsExportable = true
            })

        })
        
    })

}

PMG.NodesEditor.showOrHideMinimap = () => {

    document.querySelector('.minimap').classList.toggle('displayed')

    // XXX This hack forces minimap display.
    PMG.NodesEditor.editor.trigger('zoomed')

}

PMG.NodesEditor.setGlobalContextMenu = () => {

    var contextMenuOptions = [
        {
            name: t('Import schema from a file'),
            fn: () => { sketchup.importSchemaFromFile() }
        },
        {
            name: t('Export schema to a file'),
            fn: () => { sketchup.exportSchemaToFile() }
        },
        {
            name: t('Freeze parametric entities'),
            fn: () => { sketchup.freezeParametricEntities() }
        },
        {
            name: t('Show or hide minimap'),
            fn: () => { PMG.NodesEditor.showOrHideMinimap() }
        },
        {
            name: t('Remove all nodes'),
            fn: () => { PMG.NodesEditor.editor.clear() }
        }
    ]

    new ContextMenu('#pmg-nodes-editor', contextMenuOptions)

}

PMG.NodesEditor.tagNodesAsValid = () => {

    document.querySelectorAll('.node').forEach(nodeElement => {
        nodeElement.classList.remove('invalid')
    })

}

PMG.NodesEditor.tagNodeAsInvalid = nodeId => {

    var nodeElement = document.querySelector('.node[data-node-id="' + nodeId + '"]')
    nodeElement.classList.add('invalid')

}

document.addEventListener('DOMContentLoaded', _event => {

    PMG.NodesEditor.initializeEditor()
    PMG.NodesEditor.initializeEngine()
    PMG.NodesEditor.initializeComponents()
    PMG.NodesEditor.registerComponents()
    PMG.NodesEditor.loadToolbarIcons()
    PMG.NodesEditor.addEventListeners()
    PMG.NodesEditor.importModelSchema()
    PMG.NodesEditor.setGlobalContextMenu()
    PMG.NodesEditor.resizeEditorView()

})
