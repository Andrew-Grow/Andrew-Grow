const keymap = {
	'a': 'left',
	'd': 'right',
	'arrowleft': 'left',
	'arrowright': 'right',
	'ф': 'left',
	'в': 'right',
}

export default class Player {
	constructor() {
		this.pressedKeys = {}
		this.touches = {}

		document.addEventListener('keydown', (e) => {
			this.pressedKeys[e.key.toLowerCase()] = true
		})

		document.addEventListener('keyup', (e) => {
			delete this.pressedKeys[e.key.toLowerCase()]
		})

		document.addEventListener('touchstart', (e) => {
			this.touches = e.targetTouches
		})

		document.addEventListener('touchend', (e) => {
			this.touches = e.targetTouches
		})
	}

	get moving() {
		const input = {
			left: false,
			right: false
		}

		for (let key in this.pressedKeys) {
			if (keymap[key]) input[keymap[key]] = true
		}

		for (let key in this.touches) {
			if (this.touches[key].clientX < window.innerWidth / 2) input.left = true
			else if (this.touches[key].clientX > window.innerWidth / 2) input.right = true
		}

		if (input.left == input.right) return 0
		else if (input.left) return -1
		else return 1
	}
}