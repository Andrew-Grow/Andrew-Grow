const keymap = {
	'a': 'left',
	'd': 'right',
	'arrowleft': 'left',
	'arrowright': 'right',
	'ф': 'left',
	'в': 'right',
}

const pressedKeys = {}

export default class Player {
	constructor() {
		document.addEventListener('keydown', (e) => {
			pressedKeys[e.key.toLowerCase()] = true
		})

		document.addEventListener('keyup', (e) => {
			delete pressedKeys[e.key.toLowerCase()]
		})
	}

	get moving() {
		const input = {
			left: false,
			right: false
		}

		for (let key in pressedKeys) {
			if (keymap[key]) input[keymap[key]] = true
		}

		if (input.left == input.right) return 0
		else if (input.left) return -1
		else return 1
	}
}