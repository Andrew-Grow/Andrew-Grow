// Element
export function createElement({ tagName, children, ...props }) {
	let newElement = document.createElement(tagName)

	for (let prop in props) {
		newElement[prop] = props[prop]
	}

	if (children) {
		for (let child in children) {
			newElement[child] = createElement(children[child])
		}
	}

	return newElement
}

// Display HP
export function displayHP(element, hp) {
	hp >= 0 ? element.textContent = '❤️'.repeat(hp) : element.textContent = ''
}

//Display Time
export function displayTime(element, ms) {
	const m = Math.floor(Math.abs(ms / 60000))
	const s = Math.floor(Math.abs((ms % 60000) / 1000))
	element.textContent
		= (ms < 0 ? '−' : '')
		+ (m < 10 ? '0' : '')
		+ m
		+ ':'
		+ (s < 10 ? '0' : '')
		+ s
}

export function displayCompleteness(element, completeness) {
	element.textContent = Math.round(completeness * 100) + '%'
}