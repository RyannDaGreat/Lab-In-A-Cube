function load_config(url)
{
	getRequest(url,response=>
		{
			console.log(response)
			deltas.apply(config,djson.parse(response))
		})
}

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
	simpleBeakerFluid ./Assets/Models/SimpleBeaker/Fluid.obj
	simpleBeakerBeaker ./Assets/Models/SimpleBeaker/Beaker.obj
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
	overlay	text "Blue\n\nCube\nYou\nknow,\ndoggos\nLOVE\nblue\nthings!\n\n\n\n"	 <--- YEAH that's right, we can even use newlines! (this is a comment)
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
	skybox	transform	scale	overall 200*700
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
	camx	transform	scale	overall 0.1*700
	camy	transform	scale	overall 0.1*700
	camz	transform	scale	overall 0.1*700

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
			scale		x  1	y  1	z  1	overall .3*700
	
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
	scene	transitions	enter	camz			time 0	delta blueBackground
	scene	transitions	leave	camz			time 0	delta blueBackground
	
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
	camx	transform	scale	overall 0.15*700
	camy	transform	scale	overall 0.1*700
	camz	transform	scale	overall 0.1*700
deltas	camy
	camera	transform
		position	x    0	y 1000	z    0
		rotation	x   -90	y    0	z    0
	camx	transform	scale	overall 0.1*700
	camy	transform	scale	overall 0.15*700
	camz	transform	scale	overall 0.1*700
deltas	camz
	camera	transform
		position	x    0	y    0	z 1000
		rotation	x    0	y    0	z    0
	camx	transform	scale	overall 0.1*700
	camy	transform	scale	overall 0.1*700
	camz	transform	scale	overall 0.15*700

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

function getConfigStringFromLocalStorage()
{
	if(window.setConfigDjsonInLocalStorage_canWait_pending)
		return virtualConfigDjsonString
	virtualConfigDjsonString=localStorage.getItem('config')
	return virtualConfigDjsonString
}

let virtualConfigDjsonString=''
getConfigStringFromLocalStorage()
window.setConfigDjsonInLocalStorage_canWait_pending=false
function setConfigDjsonInLocalStorage(djsonString,kwargs={})
{
	const {setChanged=true,canWait=false,canWaitTime=1000,refresh=true}=kwargs
	virtualConfigDjsonString=djsonString
	if(!canWait)
	{
		assert.isString(djsonString)
		localStorage.setItem('config',djsonString)
		if(setChanged)
			localStorage.setItem('configChanged','true')
		if(refresh)
			refreshConfigFromLocalStorage()
	}
	else
	{
		if(!window.setConfigDjsonInLocalStorage_canWait_pending)
		{
			window.setConfigDjsonInLocalStorage_canWait_pending=true//Since localStorage.setItem is synchronous, its slow when we type characters out fast and it saves every change.
			setTimeout(function()
			{
				window.setConfigDjsonInLocalStorage_canWait_pending=false
				setConfigDjsonInLocalStorage(virtualConfigDjsonString,{...kwargs,canWait:false})
			},canWaitTime)
		}
	}
}
window.setConfigDjsonInLocalStorage=setConfigDjsonInLocalStorage


let previousLoadedConfigString
function refreshConfigFromLocalStorage()
{
	if(config.deltas===undefined)config.deltas={}
	if(config.items ===undefined)config.items ={}
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
		let storedItem=getConfigStringFromLocalStorage()
		if(!storedItem)
		{
			console.warn("Failed to load 'config' from localStorage")
			localStorage.setItem('config',defaultConfig)//Write new config file if none currently exists...
			storedItem=defaultConfig
		}
		const newConfig=djson.parse(storedItem)
		if(previousLoadedConfigString!==storedItem && !deltas.contains(config, newConfig))
		{
			playSound('./Assets/Sounds/ShortBells/E.mp3')//This got annoying, but it was here to
			// window.refreshGuiSchema()
			deltas.pour(config,newConfig)
			deltas.pour(config,deltas.poured({deltas:{initial:deltas.poured(getDefaultInitialDelta(),getDeltaByIDWithInheritance('initial'))}},newConfig))
			// deltas.pour(config,{deltas:{initial:getDefaultInitialDelta()}})
			refreshStateFromConfig()
			window.refreshGuiSchema()//Upon heari ng the bell, we try to refresh the gui schema in case anything changed
			console.log(tween.delta)
			// tween.time=1
		}
		previousLoadedConfigString=storedItem
		localStorage.setItem('readOnlyConfig',JSON.stringify(config))//Hack because this is an iframe. Sadness. Needs to communicate to the gui. JSONs are faster to read and write than djson, so this is why it's read-only.
	}
	config.deltas.none={}//This is a valid delta, and it does absolutely nothing. THis is here to prevent errors such as 'none is not a valid delta' from cluttering the console
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
		assert.isString(string)
		stateDeltaStack=string.split(' ')
	}
	//...more items will be added...
}
window.config=config
refreshConfigFromLocalStorage()

if(weAreInAnIframe()||window.editorMode)
{
	setInterval(refreshConfigFromLocalStorage, 100)
	setInterval(saveStateToLocalStorage, 100)
}


const machineWrittenDjsonTag=' (Machine Written Transaction Tag)'//This is used to understand which lines are written by machines and which lines are written by humans. When using 'undo', we'll delete all lines form the bottom of the djson up until the point where we reach this line. This tag lets us both: 1. Not delete any hand-written code via the undo function and 2. Lets us
function addLinesToConfigString(lines,{reloadWholeDjson=true}={})
{
	// reloadWholeDjson=true is safe, but slower than when reloadWholeDjson=false
	// When reloadWholeDjson is true, we re-parse the whole djson (which might have macros, which might be slow).
	// But if we say reloadWholeDjson is false, the intent is that we're not adding a line that references (or is referenced by) any macros.
	// That gives us a performance boost
	assert.isString(lines)
	assert.isString(machineWrittenDjsonTag)
	//THIS MESSY CHUNK OF POORLY NAMED VARIABLES SERVES A PURPOSE
	// (though I was in a rush while coding it.)
	// Basically, this section is responsibly for not just adding a line to the end of a config string,
	// but also if the same part of the config is being edited twice (I.E. perhaps we're typing out some text for 
	// overlay	text and because it saves on every keystroke we get a big amount of transactions. We don't want them all piling up in the djson file,
	// so this just overwrites the last thing written.)

	const parsedLines=djson.parse(lines)
	const oldlines=getConfigStringFromLocalStorage()
	const tag='\n'+machineWrittenDjsonTag+'\n'
	const oldlineslist=oldlines.split(tag)
	const lastoldline=oldlineslist[oldlineslist.length-1]
	const parsedlastoldline=djson.parse(lastoldline)
	if(oldlineslist.length>1 && sameObjectTreeStructure(parsedlastoldline,parsedLines))
		oldlineslist.pop()
	oldlineslist.push(lines)
	setConfigDjsonInLocalStorage(oldlineslist.join(tag),{setChanged:reloadWholeDjson,canWait:false,refresh:false})
	// setConfigDjsonInLocalStorage(getConfigStringFromLocalStorage()+'\n'+machineWrittenDjsonTag+"\n"+lines,{setChanged:reloadWholeDjson,canWait:false,refresh:false})
	if(0&&reloadWholeDjson)
	{
		refreshConfigFromLocalStorage()
	}
	else
	{
		deltas.apply(config,parsedLines)
		refreshStateFromConfig()
		requestRender()
	}
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
			console.error('ERROR: Cannot add item with name '+repr(itemName)+' because that already exists. No duplicates are allowed.')//This is a very important check to make sure that they don't get rid of things like 'scene' etc
		else
		{
			items[itemName]=modules[itemType](itemName)//Load all the items
			console.assert(is_object(items[itemName]),'A mistake was made in the code for the module '+repr(itemType)+
				', detected while creting item '+repr(itemName)+
				'. All items are supposed to be pure objects, because thats the way deltas apply changes (to pure object trees).'+
				'Please note that this is NOT a config error, this is a javascript error: blame the programmer of the '+repr(itemType)+' module.'+
				'\nFor debugging purposes, heres a the object returned by the module: items['+repr(itemName)+']===',items[itemName])
		}

if(config.sounds)
	for(const [soundName,soundURL] of Object.entries(config.sounds))
		sounds[soundName]=new Audio(soundURL)//Load all the sounds

requestTween({
				 overlay:
				 {
					 text: ''
				 }
			 })
requestTweenByID('initial')