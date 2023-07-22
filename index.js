import Game from './script/game/Game.js'
import { getSampleMap } from './script/utils/map.js'

const cfg = fetch('./config.json')
	.then((response) => response.json())

const map = fetch('./maps/skull.json')
	.then((response) => response.json())

Promise.all([cfg, map])
	.then(([cfg, map]) => {
		const game = new Game(cfg, map)
		game.start()
	})