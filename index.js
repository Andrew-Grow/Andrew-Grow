import Game from './script/game/Game.js'
import { getMap, getSampleMap } from './script/utils/map.js'

const cfg = fetch('./config.json')
	.then((response) => response.json())

const save = fetch('./maps/skull.bbmap')
	.then((response) => response.text())

Promise.all([cfg, save])
	.then(([cfg, save]) => {
		const game = new Game(cfg, getMap(save))
		game.start()
	})