const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75,10,1,999999)
camera.fov=75
camera.position.z = 1000

//This is yucky. I shouldn't have to pass the name through a parameter...but I can't think of a cleaner way yet. Same problem as any item in an object tree knowing its path.
// deltas={}

const items={
	// scene:
	// {
	// 	set background(value)
	// 	{
	// 		scene.background=cubeMaps[value]||null
	// 	}
	// }
}

function load_geometry(name,url)
{
	var object
	function loadModel()
	{
		try
		{
			geometries[name]=object.children[0].geometry
		}
		catch
		{
			console.error("load_geometry error: failed to load "+JSON.stringify(url))
		}
	}
	function callback( obj )
	{
		object = obj//Maybe eliminate maybe not....I think loadingmanager might come in handy....when we want to load all the textures etc
	}
	var loader = new THREE.OBJLoader(new THREE.LoadingManager(loadModel)).load(url, callback, ()=>{}, ()=>{})
}

function load_texture(name,url)
{
	var texture = new THREE.TextureLoader().load(url );
	textures[name]=texture
}

function load_cube_map(name,url_prefix,px,nx,py,ny,pz,nz)
{
	cubeMaps[name] = new THREE.CubeTextureLoader()
		.setPath( url_prefix )
		.load( [
			px,
			nx,
			py,
			ny,
			pz,
			nz
		] );
}

const textures={default:null}

const cubeMaps={default:null}

const geometries={
	box:  new THREE.BoxGeometry(700, 700, 700, 10, 10, 10),
	box2: new THREE.BoxGeometry(300, 300, 300, 10, 10, 10),
}

const attributes={
	position(threeObject)
	{
		return{
			get x(){return threeObject.position.x},
			get y(){return threeObject.position.y},
			get z(){return threeObject.position.z},
			set x(value){threeObject.position.x=value},
			set y(value){threeObject.position.y=value},
			set z(value){threeObject.position.z=value},
		}
	},
	rotation(threeObject)
	{
		return{
			get x(){return threeObject.rotation.x/Math.PI*180},
			get y(){return threeObject.rotation.y/Math.PI*180},
			get z(){return threeObject.rotation.z/Math.PI*180},
			set x(value){threeObject.rotation.x=value*Math.PI/180},
			set y(value){threeObject.rotation.y=value*Math.PI/180},
			set z(value){threeObject.rotation.z=value*Math.PI/180},
		}
	},
	scale(threeObject)
	{
		const scale={
			overall:1,
			x:1,y:1,z:1,
		}
		return{
			get x(){return scale.x},
			get y(){return scale.y},
			get z(){return scale.z},
			set x(value){scale.x=value;threeObject.scale.x=scale.x*scale.overall},
			set y(value){scale.y=value;threeObject.scale.y=scale.y*scale.overall},
			set z(value){scale.z=value;threeObject.scale.z=scale.z*scale.overall},
			set overall(value)
			{
				scale.overall=value
				threeObject.scale.x=scale.x*scale.overall
				threeObject.scale.y=scale.y*scale.overall
				threeObject.scale.z=scale.z*scale.overall
			},
			get overall(){return scale.overall},
		}
	},
	transform(threeObject)
	{
		return{
			position:attributes.position(threeObject),
			rotation:attributes.rotation(threeObject),
			scale:attributes.scale(threeObject),
		}
	}
}

const modules={
	boxItem(ID)
	{
		const materials ={
			basic:new THREE.MeshBasicMaterial({color: 0xfffff, wireframe: true }),//color.r/g/b, wireframe, 
			phong:new THREE.MeshPhongMaterial(),//color.r/g/b
			standard:new THREE.MeshStandardMaterial(),
		} 
		let geometry='box'
		let material='standard'
		let texture='default'
		let mesh=new THREE.Mesh(geometries[geometry], materials[material])
		scene.add(mesh)
		const item= {
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
					console.error('ERROR setting geometry: '+JSON.stringify(value)+' is not in geometries')
			}
		}
		mesh.userData.item=item//This is to let click events access this item's ID, which have to originate in the threeObject
		return item
	},
	lightItem(ID)
	{
		const light = new THREE.PointLight(0xffffff,1,100)
		light.position.set( 50, 50, 50 )
		scene.add(light)
		const item= {
			ID:ID,
			threeObject:light,
			position:attributes.position(light),
			get intensity(){return light.intensity;},
			set intensity(value){light.intensity=value},
		}
		light.userData.item=item
		return item
	},
}

const raycaster = new THREE.Raycaster();
function getClickedItem(event)//Give it a mouse event
{
	//Return clicked item, else return undefined
	const mouse = new THREE.Vector2()
	mouse.x =  (event.clientX/window.innerWidth )*2-1
	mouse.y = -(event.clientY/window.innerHeight)*2+1
	raycaster.setFromCamera(mouse, camera)
	const intersects = raycaster.intersectObjects(scene.children, true)
	if(intersects.length > 0)
	{
		const threeObject=intersects[0].object
		const item = threeObject.userData.item
		console.assert(item!==undefined)
		return item
	}
}

let mousedownItem
function mousedown(event)
{
	mousedownItem=getClickedItem(event)
}
renderer.domElement.addEventListener("mousedown", mousedown, true)

function mouseup(event)
{
	const mouseupItem=getClickedItem(event)
	if(mouseupItem && mousedownItem)
		triggerDragTransition(mousedownItem,mouseupItem)
	mousedownItem=undefined
}
renderer.domElement.addEventListener("mouseup", mouseup, true);

function triggerDragTransition(mousedownItem,mouseupItem)
{
	try
	{
		const transition = items.scene.transitions.drag[mousedownItem.ID][mouseupItem.ID]
		requestTween(config.deltas[transition.delta],transition.time )
		console.log("triggerDragTransition: "+mousedownItem.ID+" TO "+mouseupItem.ID)
	}
	catch(KeyError)
	{
		console.error("triggerDragTransition error: No transition from "+mousedownItem.ID+" TO "+mouseupItem.ID+" exists")
	}
}

const tween={
	_initialDelta:{},//The initial _initialDelta of the _targetDelta
	_targetDelta:{},
	_deadline:0,//The gtoc() in which we'll have finished our tween
	_length:0,
	get _alpha()
	{
		const length = tween._length
		if(length === 0) return 1//We don't want division-by-zero errors when _length is 0
			const time = tween._remainingTime
		return 1 - (time / length)
	},
	get _remainingTime()
	{
		//Remaining _remainintTime
		return Math.max(0, tween._deadline - gtoc())
	},
	set time(time)
	{
		//Set countdown for tween._remainintTime
		tween._length=time
		tween._deadline=gtoc()+time
	},
	get delta()
	{
		return blendedDeltas(tween._initialDelta,tween._targetDelta,tween._alpha)
	},
	set delta(delta)
	{
		// pourDelta(tween._initialDelta,delta)
		tween._initialDelta=blendedDeltas(blendedDeltas(tween._initialDelta,tween._targetDelta,1),delta,0)
		tween._targetDelta=delta
		tween.delta//BEcause its a bit glitchy....idk why. This fixes it.
		tween.delta
		tween.delta
	},
}

function print_current_state()
{
	console.log(djson.stringify(tween.delta))
}

function requestTween(delta,time=0)
{
	tween.time=time
	tween.delta=delta
}

function render()
{
	applyDelta(items,tween.delta)
	requestAnimationFrame(render)
	camera.updateProjectionMatrix()//Lets you update camera FOV and aspect ratio
	camera.aspect=window.innerWidth/window.innerHeight
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.render(scene, camera)
	// controls.update()
}
render()

