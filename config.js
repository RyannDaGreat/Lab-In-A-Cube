function load_config(url)
{
	getRequest(url,response=>
		{
			console.log(response)
			deltas.apply(config,djson.parse(response))
		})
}

// load_config('demo.djson')

let defaultConfig=`

preview
	height 90
	mode sublime
	numbers
	type djson
textures
	dog ./Assets/dog.jpg
	weird ./Assets/weird.jpg
	blank ./Assets/blank.png
sounds
	bark ./Assets/Sounds/bark.mp3
geometries
	dog ./Assets/dog.obj
items
	light1 lightItem	light2 lightItem	light3 lightItem	light4 lightItem
	light5 lightItem	light6 lightItem	light7 lightItem	light8 lightItem
	dog boxItem
	box boxItem
	camx boxItem
	camy boxItem
	camz boxItem

deltas	initial
	scene	transitions	auto	time 0	delta main
	box	texture blank	material	mode standard	modes	standard	color	r 1	g 1	b 1
	dog	texture dog		material	mode standard	modes	standard	color	r 1	g 1	b 1
	camera
		transform
			position	x 0	y 0	z 1000
			rotation	x 0	y 0	z 0
		camera	fov 100
	camx	transform	scale	overall 0.1
	camy	transform	scale	overall 0.1
	camz	transform	scale	overall 0.1

deltas	main
	// All lights
	light1	intensity 0.1	transform	position	x -10000	y -10000	z -10000
	light2	intensity 0.1	transform	position	x -10000	y -10000	z  10000
	light3	intensity 0.1	transform	position	x -10000	y  10000	z -10000
	light4	intensity 0.1	transform	position	x -10000	y  10000	z  10000
	light5	intensity 0.1	transform	position	x  10000	y -10000	z -10000
	light6	intensity 0.1	transform	position	x  10000	y -10000	z  10000
	light7	intensity 0.1	transform	position	x  10000	y  10000	z -10000
	light8	intensity 0.1	transform	position	x  10000	y  10000	z  10000
	
	// Scenery
	scene	background	color	r 0.2	g 0.2	b 0.2
	scene	ambience	intensity 0.8	color	r 1	g 1	b 1
	
	// Camera Transform
	
	// Initialize Items
	box	texture blank	material	mode standard	modes	standard	color	r 1	g 1	b 1
	dog
		texture dog	geometry dog
		transform
			position	x -500	y  0	z  0
			rotation	x  0	y  0	z  0
			scale		x  1	y  1	z  1	overall 10
	box	transform
			position	x 500	y  0	z  0
			rotation	x  0	y  0	z  0
			scale		x  1	y  1	z  1	overall .3
	
	// Camera X
	camx
		material	mode standard	modes	standard	color	r 1	g 0	b 0
		transform	position	y 600	z 100	x 100
	scene	transitions	drag	camx	camx	time 1	delta camx
	
	// Camera Y
	camy
		material	mode standard	modes	standard	color	r 0	g 1	b 0
		transform	position	y 500	z 0	x 0
	scene	transitions	drag	camy	camy	time 1	delta camy
	
	// Camera Z
	camz
		material	mode standard	modes	standard	color	r 0	g 0	b 1
		transform	position	y 400	z -100	x -100
	scene	transitions	drag	camz	camz	time 1	delta camz
	
	// Transitions
	scene	transitions
		drag	dog	dog	time 1	delta pour_0
		drag	box	box	time 1	delta main
		//auto	delta main	time 1
		auto null

deltas	camx
	camera	transform
		position	x 1000	y    0	z    0
		rotation	x    0	y   90	z    0
	camx	transform	scale	overall 0.15
	camy	transform	scale	overall 0.1
	camz	transform	scale	overall 0.1
deltas	camy
	camera	transform
		position	x    0	y 1000	z    0
		rotation	x   -90	y    0	z    0
	camx	transform	scale	overall 0.1
	camy	transform	scale	overall 0.15
	camz	transform	scale	overall 0.1
deltas	camz
	camera	transform
		position	x    0	y    0	z 1000
		rotation	x    0	y    0	z    0
	camx	transform	scale	overall 0.1
	camy	transform	scale	overall 0.1
	camz	transform	scale	overall 0.15


deltas	pour_0
	dog	transform	position	y 200
	scene	transitions	auto	delta pour_1	time 1
deltas	pour_1
	dog	transform	position	x 500
	dog	transform	rotation	x 180
	scene	transitions	auto	delta pour_2
deltas	pour_2
	dog	transform	rotation	z 180
	scene	transitions	auto	delta pour_3
deltas	pour_3
	sound Assets/Sounds/Woof.mp3
	// Wait a few seconds
	dog	transform	scale	y 50
	scene	transitions	auto	delta pour_4
	box
		material	mode basic
		transform	scale	x 10
	box	transform	rotation	x 360
deltas	pour_4
	dog	transform	rotation	z 0	x 360
	dog	transform	scale	y 10
	box
		material	mode standard
		transform	scale	x 1
	scene	transitions	auto	delta pour_5
deltas	pour_5
	dog	transform	position	x -500
	box	texture weird	material	modes	standard	color	r 0	g 1	b 0
	scene	transitions	auto	delta main






	`

function loadConfigFromLocalStorage()
{
	let storedItem=localStorage.getItem('config')
	if(!storedItem)
	{
		console.warn("Failed to load 'config' from localstorage")
		localStorage.setItem('config',defaultConfig)//Write new config file if none currently exists...
		storedItem=defaultConfig
	}
	config=djson.parse(storedItem)
}
let config
loadConfigFromLocalStorage()
console.log(JSON.stringify(config))
setInterval(loadConfigFromLocalStorage, 100)


for(const [geometryName,geometryURL] of Object.entries(config.geometries))
	load_geometry(geometryName,geometryURL)//Load all the geometries

for(const [Name,URL] of Object.entries(config.textures))
	load_texture(Name,URL)//Load all the textures

for(const [itemName,itemType] of Object.entries(config.items))
	items[itemName]=modules[itemType](itemName)//Load all the items

for(const [soundName,soundURL] of Object.entries(config.sounds))
	sounds[soundName]=new Audio(soundURL)//Load all the sounds

// requestTween(config.deltas.initial,0)
requestTween(getDeltaByID('initial'))