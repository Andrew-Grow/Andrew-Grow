export class Point {
	constructor(...values) {
		this.values = values
	}

	get x() { return this.values[0] }
	set x(X) { return this.values[0] = X }
	get y() { return this.values[1] }
	set y(Y) { return this.values[1] = Y }

	set(...values) {
		this.values = values
	}

	add(val) {
		let result = typeof val == 'number' ?
			this.values.map((el) => el + val) :
			this.values.map((el, i) => el + val.values[i])
		this.values = result
		return this
	}

	subtract(val) {
		let result = typeof val == 'number' ?
			this.values.map((el) => el - val) :
			this.values.map((el, i) => el - val.values[i])
		this.values = result
		return this
	}

	static getDistance(p1, p2) {
		return Math.hypot(p1.x - p2.x, p1.y - p2.y);
	}

	static subtract(p1, p2) {
		return new Point(...p1.values.map((el, i) => el - p2.values[i]))
	}
}



export class Vector extends Point {
	constructor(...values) {
		super(...values)
	}

	get length() {
		return Math.hypot(...this.values)
	}

	scale(factor) {
		this.values = this.values.map((el) => el * factor)
		return this
	}

	normalize() {
		if (this.length) this.scale(1 / this.length)
		return this
	}

	dotProduct(v) {
		return this.values.reduce((acc, el, i) => acc + el * v.values[i], 0)
	}

	setLength(val) {
		if (this.length) this.scale(val / this.length)
	}

	setDirection(v) {
		v.setLength(this.length)
		this.values = v.values
	}

	reflect(v) {
		//R = I - 2(I*N)N
		if (v.length == 0) return
		const n = v.normalize()
		this.subtract(n.scale(2 * this.dotProduct(n)))
	}

	flip() {
		this.values = this.values.map((el) => el * -1)
	}

	static angle(a, b) {
		return a.dotProduct(b) / (a.length * b.length)
	}
}



class Shape {
	constructor(x = 0, y = 0) {
		this.pos = new Point(x, y)
	}

	setPosition(x, y) {
		this.pos.set(x, y)
	}

	move(x, y) {
		this.pos.add(new Point(x, y))
	}

	get x() { return this.pos.x }
	set x(val) { return this.pos.x = val }
	get y() { return this.pos.y }
	set y(val) { return this.pos.y = val }
}



export class Circle extends Shape {
	constructor(x = 0, y = 0, r = 1) {
		super(x, y)
		this.r = r
	}

	get width() { return this.r * 2 }
	get height() { return this.r * 2 }
	get left() { return this.pos.x - this.r }
	get top() { return this.pos.y - this.r }
	get right() { return this.pos.x + this.r }
	get bottom() { return this.pos.y + this.r }
}



export class Rectangle extends Shape {
	constructor(x = 0, y = 0, w = 1, h = 1) {
		super(x, y)
		this.size = new Point(w, h)
	}

	get width() { return this.size.x }
	set width(val) { return this.size.x = val }
	get height() { return this.size.y }
	set height(val) { return this.size.y = val }
	get left() { return this.pos.x }
	get top() { return this.pos.y }
	get right() { return this.pos.x + this.size.x }
	get bottom() { return this.pos.y + this.size.y }
	get center() { return new Point(this.x + this.width / 2, this.y + this.height / 2) }
}