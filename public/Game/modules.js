let modules={
	get boxItem(){return modules.mesh},//This is legacy from a few tests we did when I first put the engine together. If you don't need it you can delete it in the future.
	mesh(ID)
	{
		//We don't require ID as an argument, because this method might be called simply to get its structure
		const materials ={
			basic:new THREE.MeshBasicMaterial({color: 0xfffff, wireframe: true }),//color.r/g/b, wireframe,
			phong:new THREE.MeshPhongMaterial(),//color.r/g/b
			standard:new THREE.MeshStandardMaterial(),
		}
		let geometry='box'
		let material='basic'
		let texture='default'
		let parent='scene'
		let mesh=new THREE.Mesh(geometries[geometry], materials[material])
		scene.add(mesh)
		const item= {
			//NEW STYLE: Should only be able to get directories; not values. It's Unidirectional now.
			//Convention: The name of the function is the name of the threeObject, which is always put in item (for some hackability-->faster dev time but more messy)
			get ID(){return ID},
			transform:attributes.transform(mesh),
			get material(){return{
				get mode(){return material},
				set mode(mode){material=mode;mesh.material=materials[mode]},
				modes:materials,
			}},
			get texture(){return texture},
			set texture(value){texture=value;mesh.material.map=textures[texture]||textures.default},
			get geometry(){return geometry},
			set geometry(value)
			{
				if(value in geometries)
					mesh.geometry=geometries[geometry=value]
				else
					console.error('ERROR setting geometry: '+JSON.stringify(value)+' is not in geometries. ')
			},
			get threeObject() {return mesh },
			set parent(itemID)
			{
				if(parent===itemID)return
				const item=items[itemID]
				if(item===undefined)
					console.error(repr(itemID),'is not a valid parent! (Failed to set parent of '+repr(ID)+')')
				else
					mesh.parent=item.threeObject//MAKE SOME ASSERTIONS HERE
				parent=itemID//Even if we did error, we're going to pretend we succedded to we don't spam the console (it would try setting that parent again and agian every frame otherwise)
			},
			get parent() {return parent },
			set visible(x){mesh.visible=x},
			get visible(){return mesh.visible},
		}
		mesh.userData.item=item//This is to let click events access this item's ID, which have to originate in the threeObject
		return item
	},
	get lightItem(){return modules.light},//This is legacy from a few tests we did when I first put the engine together. If you don't need it you can delete it in the future.
	light(ID)
	{
		const light = new THREE.PointLight(0xffffff,1,100)
		scene.add(light)
		const item= {
			ID:ID,
			threeObject:light,
			position:attributes.position(light),
			get intensity(){return light.intensity;},
			set intensity(value){light.intensity=value},
			set visible(x){light.visible=x},
			get visible( ){return light.visible},
		}
		light.userData.item=item
		return item
	},
	simpleBeaker(ID)
	{
		// return modules.mesh(ID)
		const simpleBeaker=modules.mesh(ID)
		const fluidItem =modules.mesh('Anonymous')//This item won't show up in the items list, and should have an anonymous ID (null)
		if(!geometries.simpleBeakerBeaker)
			// load_geometry('simpleBeakerBeaker','./Assets/Models/SimpleBeaker/Beaker.obj')
		// if(!geometries.simpleBeakerFluid)
			// load_geometry('simpleBeakerFluid','./Assets/Models/SimpleBeaker/Beaker.obj')
		// geometries.simpleBeakerBeaker='./Assets/Models/SimpleBeaker/Beaker.obj'
		// geometries.simpleBeakerFluid ='./Assets/Models/SimpleBeaker/Fluid.obj'
		simpleBeaker.fluid=fluidItem
		simpleBeaker.geometry='simpleBeakerBeaker'
		fluidItem.geometry='simpleBeakerFluid'
		fluidItem.threeObject.parent=simpleBeaker.threeObject
		// simpleBeaker.materials.basic.color.r=1
		return simpleBeaker
	},
	sprite(ID)
	{
		//Currently, sprites only show text. This can change later, but for now let's KISS.
		//NOTE: ctx stands for 'canvas.context'
		// function for drawing rounded rectangles
		const canvas   = document.createElement('canvas')
		const ctx  = canvas.getContext('2d')
		const texture=new THREE.Texture(canvas,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined)
		const spriteMaterial=new THREE.SpriteMaterial({map:texture, useScreenCoordinates: false ,depthTest:false})
		const sprite = new THREE.Sprite( spriteMaterial )
		//From https://stackoverflow.com/questions/23514274/three-js-2d-text-sprite-labels
		var fontface       = 'Quicksand'
		// var fontsize       = size
		var fontsize=80
		var borderThickness= 1

		//If our image doesnt' have dimensions that are powers of two, THREE.js will resize the image to match those dimensions (and you'll see a warning in the console.)
		//However, when it does this, for some reason this seems to flip it upside-down. I have no idea why. Changing dpi to 256 and aspect to 8 appears to have fixed this problem for now.
		let dpi=128//Higher --> better resolution
		let aspect=8//Bigger = skinnier image --> more text can fit
		let smallness=30//OPPOSITE OF Phyical sprite size
		function updateSpriteSize()
		{
			sprite.scale.set(size*aspect/2/1/smallness * fontsize, size*-1/2/smallness* fontsize, size*-0.75/smallness * fontsize)
		}
		function updateSpriteText()
		{
			let message=text
			canvas.width=aspect*dpi
			canvas.height=dpi
			var middleX=canvas.width/2
			var middleY=canvas.height/2

			ctx.font =
			//'Bold ' +
			 fontsize + 'px ' + fontface

			ctx.shadowBlur = 30;
			ctx.shadowColor = 'black';

			// ctx.fillStyle = 'white';
			// ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.translate(0,100);
			ctx.textAlign='center'
			ctx.lineWidth = borderThickness

			let scale=dpi/128
			ctx.translate(middleX,-middleY*.15);
			// ctx.scale(scale,scale*-1)//Mirror it about the y-axis (Used to be needed when I got power-of-two-image-dimension warnings from THREE.js)
			ctx.scale(scale,scale)//Mirror it about the y-axis
			ctx.strokeStyle = 'rgba(000,000,000,1)'
			ctx.strokeText(message, 0, 0 );
			ctx.strokeText(message, 0, 0 );//Second stroke to emphasize shadow
    		ctx.fillStyle = 'white';
			ctx.fillText( message, 0, 0)

			texture.needsUpdate = true
		}
		let text='Example'
		let size=1
		updateSpriteText()
		updateSpriteSize()
		scene.add(sprite)
		let parent
		const item={
			ID:ID,
			threeObject:sprite,
			transform:attributes.transform(sprite),
			get xray() { return !spriteMaterial.depthTest },
			set xray(x) { spriteMaterial.depthTest=!x },
			set visible(x){sprite.visible=x},
			get visible(){return sprite.visible},
			set text(x){if(x!==text){text=x;updateSpriteText()}},
			set size(x){if(x!==size){size=x;updateSpriteSize()}},
			get size(){return size},
			get text(){return text},
			set parent(itemID)
			{
				if(parent===itemID)return
				const item=items[itemID]
				if(item===undefined)
					console.error(repr(itemID),'is not a valid parent! (Failed to set parent of '+repr(ID)+')')
				else
					sprite.parent=item.threeObject//MAKE SOME ASSERTIONS HERE
				parent=itemID//Even if we did error, we're going to pretend we succedded to we don't spam the console (it would try setting that parent again and agian every frame otherwise)
			},
			get parent() {return parent },
		}
		sprite.userData.item=item
		return item
	},
}
modules=proxies.argumentCountChecker(modules)
modules=proxies.tryGetter(modules,()=>modules.mesh)

function setParent(threeObject,itemID)
{
	const newParent=keyPath.getAndSquelch(items,[itemID,'threeObject'])
	if(newParent===undefined)
	{
		console.error('Cannot set parent to',itemID,' from threeObject',threeObject,'! Aborting...')
		return
	}
	mesh.parent=newParent
	parent=itemID
}

function getItemSchemas(config)
{
	//This wasn't the original way I had planned to write the gui, but this was is just waaaayyy too pretty for me not to (I love it too much to get rid of it)
	//Specifies all default values
	// assert.isPureObject(config.items     )
	// assert.isPureObject(config.geometries)
	// assert.isPureObject(config.textures  )
	var out=`

mesh,boxItem
	texture default:TEXTURES
	geometry box:GEOMETRIES
	parent scene:ITEMS
	visible true
	material
		mode  basic:basic,standard,phong
		modes		basic,standard,phong
			color	r,g,b 1:0,1
			opacity       1:0,1
			transparent false
			depthWrite  true
			wireframe   false
	transform
		position,rotation	x,y,z 0
		scale				x,y,z,overall 1

overlay
	size 30:0,
	text Overlay

light,lightItem
	intensity 1
	visible true
	position	x,y,z 0

scene
	background	r,g,b .5:0,1
	transitions
		drag	ITEMS	ITEMS	delta none:none,DELTAS	time 0:0,
		enter,leave		ITEMS	delta none:none,DELTAS	time 0:0,
		auto					delta none:none,DELTAS	time 0:0,

camera
	transform	position,rotation	x,y,z 0
	fov 40

label
	transform
		position	x,y,z 0
		scale		x,y,z,overall 1
	visible true
	xray    true
	parent scene:ITEMS
	text Label
	size 1
`
	out=out.replace(/ITEMS/g     ,Object.keys(config.items     ||{}).join(','))
	out=out.replace(/DELTAS/g    ,Object.keys(config.deltas    ||{}).join(','))
 	out=out.replace(/GEOMETRIES/g,Object.keys(config.geometries||{}).join(','))
 	out=out.replace(/TEXTURES/g  ,Object.keys(config.textures  ||{}).join(','))
	return djson.parse(out,{leaf_parser:x=>x.trim()})
}

function parseItemLeafSchema(leaf)
{
	//EXAMPLES:
	//	parseItemLeafSchema("0")           --->   {type:'number',default:0             }
	//	parseItemLeafSchema(".5:0,1")      --->   {type:'number',default:.5,min:0,max:1}
	//	parseItemLeafSchema(".5:,1")       --->   {type:'number',default:.5,      max:1}
	//	parseItemLeafSchema(".5:0,")       --->   {type:'number',default:.5,min:0      }
	//
	//	parseItemLeafSchema("\"Hello\"")   --->   {type:'string' ,default:"Hello"      }
	//	parseItemLeafSchema("Hello")       --->   {type:'string' ,default:"Hello"      }
	//	parseItemLeafSchema("false")       --->   {type:'boolean',default: false       }
	//	parseItemLeafSchema("falsey")      --->   {type:'string' ,default:"falsey"     }
	//	parseItemLeafSchema(" false ")     --->   {type:'boolean',default: false       }
	//
	//	parseItemLeafSchema("A:A,B,C,D,E") --->   {type:'select' ,default:'A',values:['A','B','C','D','E']}
	assert.isString(leaf)
	const colonSplit=leaf.split(':')
	console.assert(colonSplit.length>0,'Common sense when splitting a string...this should be impossible to fail.')
	let out=undefined
	if(colonSplit.length===1)
	{
		const [value]=colonSplit
		const parsed=djson.parse_leaf(value)
		if(typeof parsed==='number')
		{
			out=({type:'number'})
		}
		else if(typeof parsed==='boolean')
		{
			out=({type:'boolean'})
		}
		else if(typeof parsed==='string')
		{
			out=({type:'string'})
		}
		else
		{
			console.error('There is no syntax defined for this leaf:',leaf,'at path:',path)
			out=undefined
		}
		out.default=parsed
	}
	else if(colonSplit.length===2)
	{
		const [beforeColon,afterColon]=leaf.split(':')
		const parsedBeforeColon=djson.parse_leaf(beforeColon)
		if(typeof parsedBeforeColon==='number')
		{
			console.assert(afterColon.includes(','))
			const commaSplit=afterColon.split(',')
			console.assert(commaSplit.length===2)
			let [min,max]=commaSplit
			min=min.trim()
			max=max.trim()
			out={type:'number',...(min?{min:Number(min)}:{}),
								...(max?{max:Number(max)}:{})}
		}
		else if(typeof parsedBeforeColon==='string')
		{
			out={type:'select',values:afterColon.split(',')}
		}
		else
		{
			console.error('There is no syntax defined for this leaf:',leaf,'at path:',path)
			return
		}
		out.default=parsedBeforeColon
	}
	else
	{
		console.error('There is no syntax defined for this leaf:',leaf,'at path:',path)
		return
	}
	console.assert(out!==undefined,'If this assertion fails then this function was written improperly (this is an internal assertion)')
	return out
}


function getInterfacesGuiArchitecture(config)
{
	const interfaces=getItemSchemas(config)
	const paths=keyPath.getAllPaths(interfaces)
	function processPaths(paths)
	{
		//Mutates input and returns nothing
		//EXAMPLE:
		//processPaths([[1,2,3],[4,5,6],[7,8,9]])  --->  [[[1,2],[3]],[[4,5],[6]],[[7,8],[9]]]
			// console.log(paths)
		for(const [index,path] of Object.entries(paths))
		{
			// console.log(index,path)
			paths[index]=[path,path.pop()]
		}
	}
	processPaths(paths)
	// function
	const out=[]
	for(const [path,leaf] of paths)
	{
		assert.isString(leaf)

		let leafArchitecture=parseItemLeafSchema(leaf)
		if(leafArchitecture===undefined)
			console.error('There is no syntax defined for this leaf:',leaf,'at path:',path)
		else
			out.push({path,...leafArchitecture})
	}
	return out
	//TYPES: select,number,boolean,string
	//EXAMPLE OUTPUT:
	//	[{"path":["mesh","texture"],"type":"select","values":[""]},
	//	 {"path":["mesh","geometry"],"type":"select","values":[""]},
	//	 {"path":["mesh","parent"],"type":"select","values":[""]},
	//	 {"path":["mesh","visible"],"type":"boolean"},
	//	 {"path":["mesh","material","mode"],"type":"select","values":["basic","standard","phong"]},
	//	 {"path":["mesh","material","modes","basic","color","r"],"type":"number","min":0,"max":1},
	//	 {"path":["mesh","material","modes","basic","color","g"],"type":"number","min":0,"max":1},
	//	 {"path":["mesh","material","modes","basic","color","b"],"type":"number","min":0,"max":1},
	//	 {"path":["mesh","material","modes","basic","opacity"],"type":"number","min":0,"max":1},
	//	 ...(etc)...]
}


function getDeltasGuiSchema(window=window/*This needs a reference to a window, because this code is being accessed through an iframe and that breaks stuff for some reason*/)
{
	//Needs to provide path information WITHOUT lagging...
	//Returns some object like
	//deltas
	//	initial
	//		item1
	// 			transform	position
	//				x
	//					type number
	//			texture
	//				type select
	const config=window.config
	const state =window.tween.delta
	const deltaIds=Object.keys(config.deltas)
	const itemSchemas=getItemSchemas(config)
	for(const itemSchema of itemSchemas)
		Object.setPrototypeOf(itemSchema,null)//This is how we can infer that we're looking at a leaf: it's prototype is NOT object, but is instead null
	const items={...config.items}
	const itemsSchema={}
	const deltasSchema={}
	for(const [itemId,itemType] of Object.entries(items)) itemsSchema[ itemId]=itemSchemas[type]
	for(const deltaId           of deltaIds             )deltasSchema[deltaId]=itemsSchema
	function glove(path=[])
	{
		const handler={
			get(target,key)
			{
				return glove(target[key],[...path,key])
			},
			set(target,key,value)
			{
				addLinesToConfigString(path.join('\t')+'\t'+value,false)
			}
		}
		return new Proxy(Object.create(null),handler)
	}
}


function getGuiItemsArchitectureInstance(config=djson.parse(localStorage.getItem('config')))
{
	//Filled out item type names with item names
	//Crummy complexity in this function but whatever who cares with my kind of time limits
	const architecture=getInterfacesGuiArchitecture(config)
	const out=[]
	const items=config.items
	for(const [name,type] of Object.entries(items))
	{
		// console.log('AOISHDIOASD',name,type)
		for(const thing of architecture)
		{
			if(type===thing.path[0])
			{
				out.push({...thing,path:[name,...thing.path.slice(1)]})
			}
		}
	}
	return out
}

let __oldStringifiedConfig=""
let __oldGetGuiArchitectureResult=undefined
function getGuiArchitectureInstance(config=JSON.parse(localStorage.getItem('readOnlyConfig'))||{})
{
	let stringifiedConfig=JSON.stringify(config)
	if(stringifiedConfig===__oldStringifiedConfig)
		return __oldGetGuiArchitectureResult
	__oldStringifiedConfig=stringifiedConfig//To prevent lag, only update when the config changes...
	//
	// const config=djson.parse(localStorage.getItem('config'))
	// const config=window.config
	// alert(JSON.stringify(Object.keys(config.deltas)))
	if(!('deltas' in config))config.deltas={}//Avoid errors when trying to access things in config.deltas
	if(!('items'  in config))config.items ={}//Avoid errors when trying to access things in config.items
	const itemsArchitecture=getGuiItemsArchitectureInstance(config)
	const out=[]
	for(const deltaId in config.deltas)
	{
		for(const item of itemsArchitecture)
		{
			const thing={delta:deltaId,...item}
			const path=item.path
			const delta=config.deltas[deltaId]
			assert.isPureArray(path)
			if(keyPath.exists(delta,path))
			{
				thing.valueInConfig=keyPath.get(delta,path)
			}
			out.push(thing)
		}
	}
	return __oldGetGuiArchitectureResult=out
}

function getDefaultInitialDelta()
{
	const interfaces=getItemSchemas(config)
	function leafTransform(leaf)
	{
		if(is_string(leaf))
			leaf=leaf.split(':')[0].trim()
		return djson.parse_leaf(leaf)
	}
	transformObjectTreeLeaves(interfaces,leafTransform)
	assert.isPureObject(config.items)
	out={}
	for(const index of 'camera scene overlay'.split(' '))
	{
		out[index]=interfaces[index]
	}
	for(const [index,value] of Object.entries(config.items))
		out[index]=interfaces[value]||{}
	return out
}