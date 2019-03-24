function load_config(url)
{
	getRequest(url,response=>
		{
			console.log(response)
			deltas.apply(config,djson.parse(response))
		})
}

// load_config('demo.djson')


const config=djson.parse(`








preview	json falsek	numbers falses
textures
	dog ./Assets/dog.jpg
	weird ./Assets/weird.jpg
	blank ./Assets/blank.png
geometries
	dog ./Assets/dog.obj
items
	light1 lightItem	light2 lightItem	light3 lightItem	light4 lightItem
	light5 lightItem	light6 lightItem	light7 lightItem	light8 lightItem
	dog boxItem
	box boxItem
deltas	initial
	light1	intensity 0.1	transform	position	x -10000	y -10000	z -10000
	light2	intensity 0.1	transform	position	x -10000	y -10000	z  10000
	light3	intensity 0.1	transform	position	x -10000	y  10000	z -10000
	light4	intensity 0.1	transform	position	x -10000	y  10000	z  10000
	light5	intensity 0.1	transform	position	x  10000	y -10000	z -10000
	light6	intensity 0.1	transform	position	x  10000	y -10000	z  10000
	light7	intensity 0.1	transform	position	x  10000	y  10000	z -10000
	light8	intensity 0.1	transform	position	x  10000	y  10000	z  10000
	box	texture blank	material	mode standard	modes	standard	color	r 1	g 1	b 1
	dog
		texture dog	geometry dog
		transform
			position	x -500	y  0	z -500
			rotation	x  0	y  0	z  0
			scale		x  1	y  1	z  1	overall 10
	box	transform
			position	x 500	y  0	z -500
			rotation	x  0	y  0	z  0
			scale		x  1	y  1	z  1	overall .3
	scene	transitions
		drag	dog	dog	time 1	delta pour_0
		auto null
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
	scene	transitions	auto	delta initial



















	`)

for(const [geometryName,geometryURL] of Object.entries(config.geometries))
	load_geometry(geometryName,geometryURL)//Load all the geometries

for(const [Name,URL] of Object.entries(config.textures))
	load_texture(Name,URL)//Load all the textures

for(const [itemName,itemType] of Object.entries(config.items))
	items[itemName]=modules[itemType](itemName)//Load all the items

requestTween(config.deltas.initial,0)