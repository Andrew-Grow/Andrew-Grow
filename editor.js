import Editor from './script/editor/Editor.js'

fetch('./config.json')
	.then((response) => response.json(response))
	.then((json) => initEditor(json))

function initEditor(cfg) {
	const editor = new Editor(cfg)
}