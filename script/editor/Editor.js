import Brick from "../game/Brick.js"
import Drawer from "../game/Drawer.js"
import Field from "../game/Field.js"
import { mapToBricks, getBlankMap, bricksToSave, saveToBricks, saveToMap, getCompressedSave, getMegaCompressedSave } from "../utils/map.js"



export default class Editor {
	constructor(cfg) {
		this.cfg = cfg

		// init map
		const autosave = localStorage.getItem('editorAutoSave')
		this.bricks = autosave ?
			saveToBricks(autosave, cfg.brick.size) :
			mapToBricks(getBlankMap(), cfg.brick.size)

		this.field = new Field(this.bricks.length, cfg.brick.size)

		// init inputs
		this.newMapButton = document.querySelector('#new')
		this.sizeInput = document.querySelector('#size')
		this.hexInput = document.querySelector('#hex')
		this.colorInput = document.querySelector('#color')
		this.hpInput = document.querySelector('#hp')
		this.saveButton = document.querySelector('#save')
		this.loadInput = document.querySelector('#load')

		// set inputs starting values
		this.sizeInput.value = this.bricks.length
		this.colorInput.value = cfg.editor.defaultColor
		this.hpInput.value = cfg.editor.defaultHP

		// size input
		this.sizeInput.addEventListener('change', this.changeSize.bind(this))

		// color input
		this.colorInput.addEventListener('input', () => {
			this.hexInput.value = this.colorInput.value
			console.log(e)
		})

		this.hexInput.addEventListener('input', () => {
			if (this.hexInput.value.match(/^#[0-9A-F]{6}$/i)) this.colorInput.value = this.hexInput.value
		})

		// map inputs
		this.newMapButton.addEventListener('click', this.newMap.bind(this))
		this.saveButton.addEventListener('click', this.save.bind(this))
		this.loadInput.addEventListener('change', this.load.bind(this))

		// init mouse input
		this.mouseLB = false
		this.mouseRB = false
		this.canvas = document.querySelector('#canvas')
		this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this))
		this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this))
		this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this))
		this.canvas.addEventListener('contextmenu', (e) => {
			e.preventDefault()
		})

		this.drawer = new Drawer(cfg.drawer, { ...this, grid: true })
		this.drawer.draw()
	}



	// Editor Actions

	addBrick(x, y) {
		if (!this.bricks[x]) this.bricks[x] = []
		this.bricks[x][y] = new Brick({
			x: x * this.cfg.brick.size,
			y: y * this.cfg.brick.size,
			size: this.cfg.brick.size,
			hp: this.hpInput.value,
			color: this.colorInput.value
		}
		)
		this.drawer.draw()
		this.autosave()
	}

	removeBrick(x, y) {
		if (this.bricks[x] && this.bricks[x][y]) {
			this.bricks[x][y] = false
			this.drawer.draw()
			this.autosave()
		}
	}

	pickColor(x, y) {
		if (this.bricks[x][y]) {
			this.colorInput.value = this.bricks[x][y].color
			this.hexInput.value = this.colorInput.value
		}
	}

	changeSize(e) {
		this.field.setSize(e.target.value)
		this.drawer.draw()
		this.autosave()
	}



	// Mouse Input

	handleMouseDown(e) {
		const [x, y] = this.getMousePos(e)
		if (e.button == 0) {
			this.mouseLB = true
			this.addBrick(x, y)
		}
		else if (e.button == 2) {
			this.mouseRB = true
			this.removeBrick(x, y)
		}
		else if (e.button == 1) this.pickColor(x, y)
	}

	handleMouseUp(e) {
		if (e.button == 0) this.mouseLB = false
		else if (e.button == 2) this.mouseRB = false
	}

	handleMouseMove(e) {
		const [x, y] = this.getMousePos(e)
		if (this.mouseLB) this.addBrick(x, y)
		else if (this.mouseRB) this.removeBrick(x, y)
	}

	getMousePos(e) {
		const canvasRect = this.canvas.getBoundingClientRect()
		const x = Math.floor(e.offsetX / (canvasRect.width / this.field.mapSize))
		const y = Math.floor(e.offsetY / (canvasRect.width / this.field.mapSize))
		return [x, y]
	}



	// Map

	autosave() {
		localStorage.setItem('editorAutoSave', bricksToSave(this.bricks, this.field.mapSize))
	}

	save() {
		const saveData = getMegaCompressedSave(this.bricks, this.field.mapSize);
		const filename = 'map.json';
		const file = new Blob([saveData], { type: 'application/json' });

		const a = document.createElement('a');
		a.href = URL.createObjectURL(file);
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	load(e) {
		// get file from input
		const file = e.target.files[0] ? e.target.files[0] : false

		// size validation
		if (file?.size > this.cfg.editor.maxSaveSize) {
			alert('File size exceeds the maximum allowed size of 1MB');
			return;
		}

		// extension validation
		const fileNameParts = file.name.split('.');
		const fileExtension = `.${fileNameParts[fileNameParts.length - 1]}`;
		if (!this.cfg.editor.allowedSaveExtensions.includes(fileExtension)) {
			alert(`Invalid file type. Allowed file types are: ${this.cfg.editor.allowedSaveExtensions.join(', ')}`);
			return;
		}

		// read file
		const reader = new FileReader();

		reader.onload = () => {
			const contents = reader.result
			// do the thing
			if (contents) {
				this.initMap(saveToMap(contents))
			}
			//reset file input
			e.target.value = ''
		};

		reader.readAsText(file);
	}

	newMap() {
		this.initMap(getBlankMap())
	}

	initMap(map) {
		this.bricks = mapToBricks(map, this.field.brickSize)

		this.field.setSize(this.bricks.length)
		this.sizeInput.value = this.field.mapSize

		this.drawer = new Drawer(this.cfg.drawer, { ...this, grid: true })
		this.drawer.draw()
		this.autosave()
	}
}