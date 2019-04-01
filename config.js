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
	height 50
	mode sublime
	numbers
	type state 
textures
	dog ./Assets/dog.jpg
	weird ./Assets/weird.jpg
	blank ./Assets/blank.png
sounds
	woof ./Assets/Sounds/Woof.mp3
	nyan ./Assets/Sounds/Nyan.mp3
	sadness ./Assets/Sounds/Sadviolin.mp3
geometries
	dog ./Assets/dog.obj
	flask ./Assets/flask.obj
items
	light1 lightItem	light2 lightItem	light3 lightItem	light4 lightItem
	light5 lightItem	light6 lightItem	light7 lightItem	light8 lightItem
	dog boxItem
	box boxItem
	camx boxItem
	camy boxItem
	camz boxItem
	flask boxItem
	skybox boxItem

deltas	redCubeText
	overlay	text Red Cube

deltas	redBackground
	scene	background	color	r 1	g 0	b 0
	inherit autonull
	//sound woof

deltas	greenBackground
	scene	background	color	r 0	g .31	b 0
	overlay	text Green Cube
	scene	transitions	auto null
	//sound woof

deltas	blueBackground
	overlay	size 30
	scene	background	color	r 0	g 0	b 0.31
	//sound woof
	scene	transitions	auto null
	overlay	text "Blue\n\nCube\nYou\nknow,\ndoggos\nLOVE\nblue\nthings!\n\\n\\n\\n"	 <--- YEAH that's right, we can even use newlines! (this is a comment)
	camx	transform	position	x 0
	scene	transitions	drag	dog	dog	time 1	delta blueDoggo-0

deltas
	blueDoggo-0
		dog	transform	rotation	x -90
		sound woof
		overlay	text "THE DOGE THANKS YOU FOR YOUR SERVICE!\n(Click the doggy!)"	size 40
		scene	transitions	auto	time 3	delta blueDoggo-1
	blueDoggo-1
		dog	transform	position	x 0	y -500
		dog	transform	scale	overall 20
		overlay	size 0.1
		camera	transform	position	y 300	z 800	x 0
		camera	transform	rotation	x -30
		camera	fov 30
		scene	transitions
			enter	dog	delta clickDoggoText	time 0
			drag	dog	dog	delta mainInitialCamera
			auto null
		sound sadness
			
	clickDoggoText
		overlay	text (that's right...just DO IT!!)	size 20
		scene	transitions	auto null
		scene	transitions	enter	dog null
	

deltas	blackBackground
	scene	background	color	r 3	g 0	b 0
	camx	transform	position	x 0
	//scene	transitions	auto null
	//sound woof

deltas
	zoomOutAnimation-0
		sound nyan
		scene	transitions	auto	delta zoomOutAnimation-1	time 5
		overlay	text Zooming out to show you that...this is literally a lab in a giant cube!
		camera	transform
			rotation	x 90
			position	x 0	z 0	y -1000
	zoomOutAnimation-1
		scene	transitions	auto	delta zoomOutAnimation-2	time 9
		camera	transform
			position	y -13000
			rotation	x 90	z 30	y 15
		flask	transform	scale	overall 10000
		flask	transform
			rotation	x -98	y -147	z 333
		skybox	material	mode basic	modes	basic	opacity .6	color	r 1	g 0	b .5
		flask	material	mode standard	modes	standard	wireframe true	color	r 5	g 5	b 0
	zoomOutAnimation-2	inherit zoomOutAnimation-0
		scene	transitions	auto	delta zoomOutAnimation-3	time 5
		camera	fov 100	transform	rotation	z -30	y -5
		flask	transform
			scale	overall 40000
			rotation	x 25	y 98	z -159
		sound null
		skybox	material	mode basic	modes	basic	opacity 1	color	r .5	g 1	b 0
		flask	material	mode standard	modes	standard	wireframe true	color	r 0	g 1	b 10
	zoomOutAnimation-3	inherit autonull initialCamera initial	scene	transitions	auto	time 1


deltas	initial
	skybox	transform	scale	overall 200
	skybox	material	mode basic	modes	basic
		color	r 1	g 1	b 1
		transparent true
		opacity .2
	inherit initialCamera main autonull
	flask	transform	scale	overall 140
	flask	transform
		position	y -230	z 0	x 0
		rotation	x 45	y 30	z 20
	flask	material	mode standard	modes	standard	wireframe true	color	r 10	g 1	b 1
	flask	geometry flask
	box	texture blank	material	mode standard	modes	standard	color	r 1	g 1	b 1
	dog	texture dog		material	mode standard	modes	standard	color	r 1	g 1	b 1
	scene	transitions	auto null	delta initial	time .5
	scene	transitions	drag	flask	flask	delta zoomOutAnimation-0	time 4
	
deltas	initialCamera
	camera	transform
			position	x 0	y 0	z 1000
			rotation	x 0	y 0	z 0
	camera	fov 75
	scene	transitions	auto null

deltas	resetcamboxes
	camx	transform	scale	overall 0.1
	camy	transform	scale	overall 0.1
	camz	transform	scale	overall 0.1

deltas	autonull	scene	transitions	auto null

deltas	greenText	overlay	text I don't like green cubes and ham

deltas	initial	scene	transitions	enter	box	delta boxText	time 0
deltas	boxText	overlay	text This boring white box resets the scene when you click it (except for camera position)	size 20

deltas	main
	inherit blackBackground resetcamboxes greenText autonull
	overlay	text Welcome to Lab In a Cube!
	overlay	size 40
	
	scene	transitions	smooth 1
	
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
	scene	ambience	intensity 0.8	color	r 1	g 1	b 1
	scene	transitions	auto null
	
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
		transform	position	y 500	z  0	x  0
	scene	transitions	drag	camy	camy	time 1	delta camy
	scene	transitions	enter	camy	time 0	delta greenBackground
	scene	transitions	leave	camy	time 0	delta greenBackground
	
	
	// Camera Z box
	camz
		material	mode standard	modes	standard	color	r 0	g 0	b 1
		transform	position	y 400	z -100	x -100
	scene	transitions	drag	camz	camz	time 1	delta camz
	scene	transitions	enter	camz	time 0	delta blueBackground
	scene	transitions	leave	camz	time 0	delta blueBackground
	
	// Transitions
	scene	transitions
		drag	dog	dog	time 1	delta pour_0
		drag	box	box	time 1	delta mainInitialCamera
	scene	background	color	r 0	g 0	b 0

deltas	mainInitialCamera	inherit initial main initialCamera autonull

deltas	camx
	inherit redBackground
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
	scene	transitions	smooth 0	auto	delta pour_1	time 1
	overlay	text OH MY GOD!	size 20
deltas	pour_1
	dog	transform	position	x 500
	dog	transform	rotation	x 180
	scene	transitions	auto	delta pour_2
	overlay	text YOU'VE BOOPED THE DOGGO!!	size 40
deltas	pour_2
	dog	transform	rotation	z 180
	scene	transitions	auto	delta pour_3
	overlay	text WOOF!!	size 40
deltas	pour_3
	sound woof
	// Wait a few seconds
	dog	transform	scale	y 50
	scene	transitions	auto	delta pour_4
	box
		material	mode basic
		transform	scale	x 10
	box	transform	rotation	x 360
	overlay	text WOOF!!	size 300
deltas	pour_4
	dog	transform	rotation	z 0	x 360
	dog	transform	scale	y 10
	box
		material	mode standard
		transform	scale	x 1
	scene	transitions	auto	delta pour_5
	overlay	text WOOF!!	size .1
deltas	pour_5
	dog	transform	position	x -500
	box	texture weird	material	modes	standard	color	r 0	g 1	b 0
	scene	transitions	smooth 1	auto	delta main
	overlay	text 
	`




let previousLoadedConfigString
function loadConfigFromLocalStorage()
{
	if(previousLoadedConfigString===undefined || localStorage.getItem('configChanged')==='true')
	{
		localStorage.setItem('configChanged','false')//This is to lighten the 9ms burden of refreshing this every .1 seconds when using the editor
	}
	else
	{
		return
	}
	if(!tween.time && !autoIsPending())
	{
		let storedItem=localStorage.getItem('config')
		if(!storedItem)
		{
			console.warn("Failed to load 'config' from localStorage")
			localStorage.setItem('config',defaultConfig)//Write new config file if none currently exists...
			storedItem=defaultConfig
		}
		const newConfig=djson.parse(storedItem)
		if(previousLoadedConfigString!=storedItem && !deltas.contains(config,newConfig))
		{
			playSound('./Assets/Sounds/Woof.mp3')
			deltas.pour(config,newConfig)
			refreshStateFromConfig()
		}
		previousLoadedConfigString=storedItem
	}
	requestRender()//Aand the game begins...
}

function saveStateToLocalStorage()
{
	localStorage.setItem('state',djson.stringify(tween.delta))
}

const config={
	get state()
	{
		return getStateDeltaStack().join(' ')
	},
	set state(string)
	{
		stateDeltaStack
	}
}
loadConfigFromLocalStorage()
console.log(JSON.stringify(config))
if(weAreInAnIframe())
{
	setInterval(loadConfigFromLocalStorage, 100)
	setInterval(saveStateToLocalStorage, 100)
}


if(config.geometries)
	for(const [geometryName,geometryURL] of Object.entries(config.geometries))
		load_geometry(geometryName,geometryURL)//Load all the geometries

if(config.textures)
	for(const [Name,URL] of Object.entries(config.textures))
		load_texture(Name,URL)//Load all the textures

if(config.items)
	for(const [itemName,itemType] of Object.entries(config.items))
		if(itemName in modules)
			console.error('ERROR: Cannot add item with name '+repr(itemName)+' because that allready exists. No duplicates are allowed.')//This is a very important check to make sure that they don't get rid of things like 'scene' etc
		else
			items[itemName]=modules[itemType](itemName)//Load all the items

if(config.sounds)
	for(const [soundName,soundURL] of Object.entries(config.sounds))
		sounds[soundName]=new Audio(soundURL)//Load all the sounds

requestTweenByID('initial')