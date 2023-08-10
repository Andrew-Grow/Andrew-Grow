const keymap = {
	'keya': 'left',
	'keyd': 'right',
	'arrowleft': 'left',
	'arrowright': 'right',
	'space': 'action',
}

export default class Player {
	constructor(canvas) {
		this.pressedKeys = {}
		this.touches = {}
		this.mouse = {}

		// keyboard
		document.addEventListener('keydown', (e) => {
			this.pressedKeys[e.code.toLowerCase()] = true
		})
		document.addEventListener('keyup', (e) => {
			delete this.pressedKeys[e.code.toLowerCase()]
		})

		// touchscreen
		canvas.addEventListener('touchstart', (e) => {
			this.mouse.lb = true
			this.handleTouchEvent(e)
		})
		canvas.addEventListener('touchend', () => {
			this.mouse.lb = false
		})
		canvas.addEventListener('touchmove', this.handleTouchEvent.bind(this))

		// mouse
		canvas.addEventListener('mousedown', (e) => {
			this.mouse.lb = true
		})
		canvas.addEventListener('mouseup', (e) => {
			this.mouse.lb = false
		})
		canvas.addEventListener('mousemove', (e) => {
			this.mouse.x = e.offsetX
			this.mouse.y = e.offsetY
			// hide cursor
			// document.documentElement.style.cursor = 'none'
		})
		canvas.addEventListener('mouseleave', (e) => {
			this.mouse.x = false
			this.mouse.y = false
			// show cursor
			// document.documentElement.style.cursor = 'auto'
		})
	}

	get input() {
		const input = {
			left: false,
			right: false,
			action: false
		}

		for (let key in this.pressedKeys) {
			if (keymap[key]) input[keymap[key]] = true
		}

		if (this.mouse.lb) input.action = true

		return input
	}

	handleTouchEvent(e) {
		e.preventDefault()
		const touch = e.touches[0];
		const rect = touch.target.getBoundingClientRect();
		this.mouse.x = touch.clientX - rect.left;
		this.mouse.y = touch.clientY - rect.top;
	}
}
