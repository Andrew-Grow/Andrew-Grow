const keymap = {
	'keya': 'left',
	'keyd': 'right',
	'arrowleft': 'left',
	'arrowright': 'right',
	'space': 'action',
}

export default class Player {
	constructor() {
		this.pressedKeys = {}
		this.touches = {}

		document.addEventListener('keydown', (e) => {
			this.pressedKeys[e.code.toLowerCase()] = true
		})
		document.addEventListener('keyup', (e) => {
			delete this.pressedKeys[e.code.toLowerCase()]
		})
		document.addEventListener('touchstart', (e) => {
			this.touches = e.targetTouches
		})
		document.addEventListener('touchend', (e) => {
			this.touches = e.targetTouches
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

		for (let key in this.touches) {
			if (this.touches[key].clientX < window.innerWidth / 3) input.left = true
			else if (this.touches[key].clientX > window.innerWidth / 3 * 2) input.right = true
			else if (this.touches[key].clientX) input.action = true
		}

		return input
	}
}