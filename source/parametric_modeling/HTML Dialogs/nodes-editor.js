/**
 * Parametric Modeling (PMG) extension for SketchUp.
 *
 * @copyright © 2021 Samuel Tallet
 *
 * @licence GNU General Public License 3.0
 */

PMG = {}

PMG.NodesEditor = {}

PMG.NodesEditor.initializeSockets = () => {

    PMG.NodesEditor.sockets = {

        number: new Rete.Socket('Number'),
        groups: new Rete.Socket('Group(s)'),
        point: new Rete.Socket('Point'),
        vector: new Rete.Socket('Vector')

    }

}

PMG.NodesEditor.initializeSockets()

PMG.cloneObject = (object) => {
    return JSON.parse(JSON.stringify(object))
}

PMG.NodesEditor.initializeControls = () => {

    PMG.NodesEditor.controls = {}

    PMG.NodesEditor.controls['number'] = {

        props: ['emitter', 'ikey', 'getData', 'putData', 'placeholder', 'readonly'],

        template: '<input type="number" :placeholder="placeholder" :readonly="readonly" :value="value" @input="change($event)" @pointerdown.stop="" @pointermove.stop="" />',
        
        data() {

            return {
                value: 0
            }

        },

        methods: {

            change(event) {

                this.value = + event.target.value
                this.update()

            },

            update() {

                if ( this.ikey )
                    this.putData(this.ikey, this.value)

                this.emitter.trigger('process')

            }

        },

        mounted() {
            this.value = this.getData(this.ikey)
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

                if ( this.ikey )
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

                if ( this.ikey )
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
            <option value="">Material...</option>
            <option v-for="material in materials" v-bind:value="material.name" v-bind:selected="material.selected">
                {{ material.display_name }}
            </option>
        </select>`,

        data() {

            var nodeSelectedMaterial = this.getData(this.ikey)
            var nodeSelectableMaterials = PMG.cloneObject(SketchUpMaterials)

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

                if ( this.ikey )
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
            <option value="">Layer/Tag...</option>
            <option v-for="layer in layers" v-bind:value="layer.name" v-bind:selected="layer.selected">
                {{ layer.display_name }}
            </option>
        </select>`,

        data() {

            var nodeSelectedLayer = this.getData(this.ikey)
            var nodeSelectableLayers = PMG.cloneObject(SketchUpLayers)

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

                if ( this.ikey )
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

    constructor(){
        super('Draw box')
    }

    builder (node) {

        var width = new Rete.Input('width', 'Width', PMG.NodesEditor.sockets.number)
        var depth = new Rete.Input('depth', 'Depth', PMG.NodesEditor.sockets.number)
        var height = new Rete.Input('height', 'Height', PMG.NodesEditor.sockets.number)

        var group = new Rete.Output('groups', 'Group', PMG.NodesEditor.sockets.groups)

        return node
            .addInput(width)
            .addInput(depth)
            .addInput(height)
            .addControl(new TextReteControl(this.editor, 'name', 'Name'))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = ''
    }

}

class DrawPrismReteComponent extends Rete.Component {

    constructor(){
        super('Draw prism')
    }

    builder (node) {

        var radius = new Rete.Input('radius', 'Radius', PMG.NodesEditor.sockets.number)
        var height = new Rete.Input('height', 'Height', PMG.NodesEditor.sockets.number)
        var sides = new Rete.Input('sides', 'Sides', PMG.NodesEditor.sockets.number)

        var group = new Rete.Output('groups', 'Group', PMG.NodesEditor.sockets.groups)

        return node
            .addInput(radius)
            .addInput(height)
            .addInput(sides)
            .addControl(new TextReteControl(this.editor, 'name', 'Name'))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = ''
    }

}

class DrawCylinderReteComponent extends Rete.Component {

    constructor(){
        super('Draw cylinder')
    }

    builder (node) {

        var radius = new Rete.Input('radius', 'Radius', PMG.NodesEditor.sockets.number)
        var height = new Rete.Input('height', 'Height', PMG.NodesEditor.sockets.number)
        var segments = new Rete.Input('segments', 'Segments', PMG.NodesEditor.sockets.number)

        var group = new Rete.Output('groups', 'Group', PMG.NodesEditor.sockets.groups)

        return node
            .addInput(radius)
            .addInput(height)
            .addInput(segments)
            .addControl(new TextReteControl(this.editor, 'name', 'Name'))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = ''
    }

}

class DrawPyramidReteComponent extends Rete.Component {

    constructor(){
        super('Draw pyramid')
    }

    builder (node) {

        var radius = new Rete.Input('radius', 'Radius', PMG.NodesEditor.sockets.number)
        var height = new Rete.Input('height', 'Height', PMG.NodesEditor.sockets.number)
        var sides = new Rete.Input('sides', 'Sides', PMG.NodesEditor.sockets.number)

        var group = new Rete.Output('groups', 'Group', PMG.NodesEditor.sockets.groups)

        return node
            .addInput(radius)
            .addInput(height)
            .addInput(sides)
            .addControl(new TextReteControl(this.editor, 'name', 'Name'))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = ''
    }

}

class DrawConeReteComponent extends Rete.Component {

    constructor(){
        super('Draw cone')
    }

    builder (node) {

        var radius = new Rete.Input('radius', 'Radius', PMG.NodesEditor.sockets.number)
        var height = new Rete.Input('height', 'Height', PMG.NodesEditor.sockets.number)
        var segments = new Rete.Input('segments', 'Segments', PMG.NodesEditor.sockets.number)

        var group = new Rete.Output('groups', 'Group', PMG.NodesEditor.sockets.groups)

        return node
            .addInput(radius)
            .addInput(height)
            .addInput(segments)
            .addControl(new TextReteControl(this.editor, 'name', 'Name'))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = ''
    }

}

class DrawSphereReteComponent extends Rete.Component {

    constructor(){
        super('Draw sphere')
    }

    builder (node) {

        var radius = new Rete.Input('radius', 'Radius', PMG.NodesEditor.sockets.number)

        var group = new Rete.Output('groups', 'Group', PMG.NodesEditor.sockets.groups)

        return node
            .addInput(radius)
            .addControl(new TextReteControl(this.editor, 'name', 'Name'))
            .addControl(new MaterialReteControl(this.editor, 'material'))
            .addControl(new LayerReteControl(this.editor, 'layer'))
            .addOutput(group)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = ''
    }

}

class NumberReteComponent extends Rete.Component {

    constructor() {
        super('Number')
    }

    builder(node) {

        var number = new Rete.Output('number', 'Number', PMG.NodesEditor.sockets.number)
        return node.addControl(new NumberReteControl(this.editor, 'number')).addOutput(number)

    }

    worker(node, _inputs, outputs) {
        outputs['number'] = node.data.number
    }
}

class AddReteComponent extends Rete.Component {

    constructor(){
        super('Add')
    }

    builder (node) {

        var number1 = new Rete.Input('number1', 'Number', PMG.NodesEditor.sockets.number)
        var number2 = new Rete.Input('number2', 'Number', PMG.NodesEditor.sockets.number)

        var number = new Rete.Output('number', 'Number', PMG.NodesEditor.sockets.number)

        number1.addControl(new NumberReteControl(this.editor, 'number1'))
        number2.addControl(new NumberReteControl(this.editor, 'number2'))

        return node
            .addInput(number1)
            .addInput(number2)
            .addControl(new NumberReteControl(this.editor, 'preview', '', true))
            .addOutput(number)

    }

    worker(node, inputs, outputs) {

        var number1 = inputs['number1'].length ? inputs['number1'][0] : node.data.number1
        var number2 = inputs['number2'].length ? inputs['number2'][0] : node.data.number2
        var sum = number1 + number2
        
        this.editor.nodes.find(n => n.id == node.id).controls.get('preview').setValue(sum)
        outputs['number'] = sum

    }

}

class SubtractReteComponent extends Rete.Component {

    constructor(){
        super('Subtract')
    }

    builder (node) {

        var number1 = new Rete.Input('number1', 'Number', PMG.NodesEditor.sockets.number)
        var number2 = new Rete.Input('number2', 'Number', PMG.NodesEditor.sockets.number)

        var number = new Rete.Output('number', 'Number', PMG.NodesEditor.sockets.number)

        number1.addControl(new NumberReteControl(this.editor, 'number1'))
        number2.addControl(new NumberReteControl(this.editor, 'number2'))

        return node
            .addInput(number1)
            .addInput(number2)
            .addControl(new NumberReteControl(this.editor, 'preview', '', true))
            .addOutput(number)

    }

    worker(node, inputs, outputs) {

        var number1 = inputs['number1'].length ? inputs['number1'][0] : node.data.number1
        var number2 = inputs['number2'].length ? inputs['number2'][0] : node.data.number2
        var diff = number1 - number2
        
        this.editor.nodes.find(n => n.id == node.id).controls.get('preview').setValue(diff)
        outputs['number'] = diff

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

        var outputPoint = new Rete.Output('point', 'Point', PMG.NodesEditor.sockets.point)

        return node
            .addInput(inputPointX)
            .addInput(inputPointY)
            .addInput(inputPointZ)
            .addOutput(outputPoint)

    }

    worker(node, _inputs, outputs) {
        outputs['point'] = { x: node.data.x, y: node.data.y, z: node.data.z }
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

        var outputVector = new Rete.Output('vector', 'Vector', PMG.NodesEditor.sockets.vector)

        return node
            .addInput(inputVectorX)
            .addInput(inputVectorY)
            .addInput(inputVectorZ)
            .addOutput(outputVector)

    }

    worker(node, _inputs, outputs) {
        outputs['vector'] = { x: node.data.x, y: node.data.y, z: node.data.z }
    }
}

class PushPullReteComponent extends Rete.Component {

    constructor(){
        super('Push/Pull')
    }

    builder (node) {

        var inputGroups = new Rete.Input('groups', 'Group(s)', PMG.NodesEditor.sockets.groups)
        var inputDistance = new Rete.Input('distance', 'Distance', PMG.NodesEditor.sockets.number)
        inputDistance.addControl(new NumberReteControl(this.editor, 'distance', 'Distance'))
        var inputDirection = new Rete.Input('direction', 'Direction', PMG.NodesEditor.sockets.vector)

        var outputGroups = new Rete.Output('groups', 'Group(s)', PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addInput(inputDistance)
            .addControl(new CheckBoxReteControl(this.editor, 'increment_distance', 'Increment distance'))
            .addInput(inputDirection)
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = ''
    }

}

class MoveReteComponent extends Rete.Component {

    constructor(){
        super('Move')
    }

    builder (node) {

        var inputGroups = new Rete.Input('groups', 'Group(s)', PMG.NodesEditor.sockets.groups)
        var inputPoint = new Rete.Input('point', 'Point', PMG.NodesEditor.sockets.point)

        var outputGroups = new Rete.Output('groups', 'Group(s)', PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addInput(inputPoint)
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = ''
    }

}

class RotateReteComponent extends Rete.Component {

    constructor(){
        super('Rotate')
    }

    builder (node) {

        var inputGroups = new Rete.Input('groups', 'Group(s)', PMG.NodesEditor.sockets.groups)
        var inputCenter = new Rete.Input('center', 'Center', PMG.NodesEditor.sockets.point)
        var inputAxis = new Rete.Input('axis', 'Axis', PMG.NodesEditor.sockets.vector)
        var inputAngle = new Rete.Input('angle', 'Angle', PMG.NodesEditor.sockets.number)
        inputAngle.addControl(new NumberReteControl(this.editor, 'angle', 'Angle'))

        var outputGroups = new Rete.Output('groups', 'Group(s)', PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addInput(inputCenter)
            .addInput(inputAxis)
            .addInput(inputAngle)
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = ''
    }

}

class ScaleReteComponent extends Rete.Component {

    constructor(){
        super('Scale')
    }

    builder (node) {

        var inputGroups = new Rete.Input('groups', 'Group(s)', PMG.NodesEditor.sockets.groups)
        var inputPoint = new Rete.Input('point', 'Point', PMG.NodesEditor.sockets.point)
        var inputXFactor = new Rete.Input('x_factor', 'X factor', PMG.NodesEditor.sockets.number)
        inputXFactor.addControl(new NumberReteControl(this.editor, 'x_factor', 'X factor'))
        var inputYFactor = new Rete.Input('y_factor', 'Y factor', PMG.NodesEditor.sockets.number)
        inputYFactor.addControl(new NumberReteControl(this.editor, 'y_factor', 'Y factor'))
        var inputZFactor = new Rete.Input('z_factor', 'Z factor', PMG.NodesEditor.sockets.number)
        inputZFactor.addControl(new NumberReteControl(this.editor, 'z_factor', 'Z factor'))

        var outputGroups = new Rete.Output('groups', 'Group(s)', PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addInput(inputPoint)
            .addInput(inputXFactor)
            .addInput(inputYFactor)
            .addInput(inputZFactor)
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = ''
    }

}

class CopyReteComponent extends Rete.Component {

    constructor(){
        super('Copy')
    }

    builder (node) {

        var inputGroups = new Rete.Input('groups', 'Group(s)', PMG.NodesEditor.sockets.groups)
        var inputCopies = new Rete.Input('copies', 'Copies', PMG.NodesEditor.sockets.number)
        inputCopies.addControl(new NumberReteControl(this.editor, 'copies', 'Copies'))

        var outputGroups = new Rete.Output('groups', 'Group(s)', PMG.NodesEditor.sockets.groups)

        return node
            .addInput(inputGroups)
            .addInput(inputCopies)
            .addControl(new CheckBoxReteControl(this.editor, 'output_original', 'Output original'))
            .addOutput(outputGroups)

    }

    worker(_node, _inputs, outputs) {
        outputs['groups'] = ''
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
        "Draw cone": new DrawConeReteComponent(),
        "Draw pyramid": new DrawPyramidReteComponent(),
        "Draw sphere": new DrawSphereReteComponent(),
        "Number": new NumberReteComponent(),
        "Add": new AddReteComponent(),
        "Subtract": new SubtractReteComponent(),
        "Point": new PointReteComponent(),
        "Vector": new VectorReteComponent(),
        "Push/Pull": new PushPullReteComponent(),
        "Move": new MoveReteComponent(),
        "Rotate": new RotateReteComponent(),
        "Scale": new ScaleReteComponent(),
        "Copy": new CopyReteComponent()

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
    
    document.querySelectorAll('.toolbar .icon').forEach(toolbarIcon => {

        toolbarIcon.src = PMGNodesEditorIcons['nodes'][toolbarIcon.dataset.nodeName]['path']
        toolbarIcon.title = toolbarIcon.dataset.nodeName

    })

}

PMG.NodesEditor.schemaIsExportable = false

PMG.NodesEditor.exportModelSchema = () => {

    if ( PMG.NodesEditor.schemaIsExportable ) {
        sketchup.redrawParametricEntities(JSON.stringify(PMG.NodesEditor.editor.toJSON()))
    }

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

    PMG.NodesEditor.editor.on('nodecreated noderemoved nodedragged connectioncreated connectionremoved', () => {
        PMG.NodesEditor.exportModelSchema()
    })

    PMG.NodesEditor.editor.on('nodecreated', (node) => {

        var nodeElement = node.vueContext.$el

        nodeElement.setAttribute('data-node-id', node.id)

        nodeElement.querySelectorAll('input[type="number"]').forEach(nodeNumberInputElement => {

            nodeNumberInputElement.addEventListener('input', _event => {
                PMG.NodesEditor.exportModelSchema()
            })

        })

        nodeElement.querySelectorAll('input[type="text"]').forEach(nodeTextInputElement => {

            nodeTextInputElement.addEventListener('input', _event => {
                PMG.NodesEditor.exportModelSchema()
            })

        })

        nodeElement.querySelectorAll('input[type="checkbox"]').forEach(nodeCheckBoxInputElement => {

            nodeCheckBoxInputElement.addEventListener('change', _event => {
                PMG.NodesEditor.exportModelSchema()
            })

        })

        nodeElement.querySelectorAll('select').forEach(nodeSelectElement => {

            nodeSelectElement.addEventListener('change', _event => {
                PMG.NodesEditor.exportModelSchema()
            })

        })

        var nodeTitleElement = nodeElement.querySelector('.title')

        nodeTitleElement.addEventListener('dblclick', _event => {

            if ( window.confirm(`Do you want to remove this "${node.name}" node?`) ) {
                PMG.NodesEditor.editor.removeNode(node)
            }
            
        })

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

    document.querySelectorAll('.toolbar .icon').forEach(toolbarIcon => {

        toolbarIcon.addEventListener('click', event => {

            var component = PMG.NodesEditor.components[event.currentTarget.dataset.nodeName]

            component.createNode().then(node => {
                node.position = [40, 60]
                PMG.NodesEditor.editor.addNode(node)
            })

        })

    })

    window.onresize = PMG.NodesEditor.resizeEditorView

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

PMG.NodesEditor.activateContextMenu = () => {

    var contextMenuOptions = [
        {
            name: 'Import schema from file',
            fn: () => { sketchup.importSchemaFromFile() }
        },
        {
            name: 'Export schema to file',
            fn: () => { sketchup.exportSchemaToFile() }
        },
        {
            name: 'Freeze parametric entities',
            fn: () => { sketchup.freezeParametricEntities() }
        }
    ]

    new ContextMenu('#pmg-nodes-editor', contextMenuOptions)

}

document.addEventListener('DOMContentLoaded', _event => {

    PMG.NodesEditor.initializeEditor()
    PMG.NodesEditor.initializeEngine()
    PMG.NodesEditor.initializeComponents()
    PMG.NodesEditor.registerComponents()
    PMG.NodesEditor.loadToolbarIcons()
    PMG.NodesEditor.addEventListeners()
    PMG.NodesEditor.importModelSchema()
    PMG.NodesEditor.activateContextMenu()
    PMG.NodesEditor.resizeEditorView()

})
