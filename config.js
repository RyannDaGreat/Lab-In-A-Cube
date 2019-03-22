const config=djson.parse(`


history
	stack
		(deltas for the whole UI including the editor)

state
	stack
		initial

geometries
	ninja https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/obj/ninja/ninjaHead_Low.obj
	dog ./dog.obj

items
	light lightItem
	chungus boxItem
	charley boxItem

deltas	initial
	chungus	transform	position
		x 0
		y -500
		z -2000
	charley	transform	position
		x 500
		y 0
		z -1000
	charley	transform	rotation
		x 40
		y 39
		z 80
	charley	material
		mode phong
	charley	geometry box2

deltas	initial	scene	transitions
	drag	charley	charley
		delta griddify
		time 3
	drag	charley	chungus
		delta chingle_chan
		time 3
	drag	chungus	charley
		delta glimmery
		time 1


deltas	griddify
	charley
		transform
			position	x 0
			rotation	x 45
		material
			mode basic

deltas	glimmery
	charley	transform	position
		x -100
		y -200
		z -1000
	chungus	transform	position
		x 0
		y 300
		z 0
	chungus	transform	rotation
		x 90

deltas	chingle_chan
	charley	transform	position
		x 100
		y 200
		z -20000
	charley	transform	rotation
		x 3534
	charley	transform	position
		x 500
		y 0
		z -500
`)



console.log(djson.stringify(items))

for(const [geometryName,geometryURL] of Object.entries(config.geometries))
	load_geometry(geometryName,geometryURL)//Load all the geometries

for(const [itemName,itemType] of Object.entries(config.items))
	items[itemName]=modules[itemType](itemName)//Load all the items

requestTween(config.deltas.initial,0)

