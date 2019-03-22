const config=djson.parse(`
preview	json true	numbers false

textures
	dog ./Assets/dog.jpg
geometries
	ninja https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/obj/ninja/ninjaHead_Low.obj
	dog ./Assets/dog.obj
items
	light lightItem
	chungus boxItem
	charley boxItem
deltas	initial
	chungus	transform	position	x -1000	y    0	z -2000
	chungus	texture dog
	chungus	geometry dog
	chungus	transform	scale	overall 20
	charley	transform	position	x 1000	y    0	z -2000
	charley	transform	rotation	x  40	y   39	z  -2000
	charley	material	mode phong
	charley	geometry box2
	scene	transitions
		drag	charley	charley	time 3	delta griddify
		drag	charley	chungus	time 3	delta chingle_chan
		drag	chungus	charley	time 1	delta glimmery
		drag	chungus	chungus	time 2	delta spinback
deltas	griddify
	charley	transform	position	x 0
	charley	transform	rotation	x 45
	charley	material	mode basic
deltas	glimmery
	charley	transform	position	x -100	y -200	z -1000
	chungus	transform	position	x    0	y  300	z  -2000
	chungus	transform	rotation	x   90
deltas	chingle_chan
	charley	transform	position	x  100	y 200	z -20000
	charley	transform	rotation	x 3534
	charley	transform	position	x  500	y   0	z   -500
deltas	spinback
	chungus	transform	rotation	x 39	y 100	z 399
`)

for(const [geometryName,geometryURL] of Object.entries(config.geometries))
	load_geometry(geometryName,geometryURL)//Load all the geometries

for(const [Name,URL] of Object.entries(config.textures))
	load_texture(Name,URL)

for(const [itemName,itemType] of Object.entries(config.items))
	items[itemName]=modules[itemType](itemName)//Load all the items

requestTween(config.deltas.initial,0)

