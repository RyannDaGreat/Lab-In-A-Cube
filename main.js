
var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

var scene = new THREE.Scene()

var camera = new THREE.PerspectiveCamera(75,10,1,999999)
camera.fov=75
camera.position.z = 1000

//This is yucky. I shouldn't have to pass the name through a parameter...but I can't think of a cleaner way yet. Same problem as any item in an object tree knowing its path.
// deltas={}

const items={}

function load_geometry(name,url)
{
	var object
	function loadModel()
	{
		console.log(object)
		geometries[name]=object.children[0].geometry
	}
	function callback( obj )
	{
		object = obj//Maybe eliminate maybe not....I think loadingmanager might come in handy....when we want to load all the textures etc
	}
	var loader = new THREE.OBJLoader(new THREE.LoadingManager(loadModel)).load(url, callback, ()=>{}, ()=>{})
}

const geometries={
	box: new THREE.BoxGeometry(700, 700, 700, 10, 10, 10),
	box2: new THREE.BoxGeometry(300, 300, 300, 10, 10, 10),
}

load_geometry('ninja','https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/obj/ninja/ninjaHead_Low.obj')
load_geometry('dog','./dog.obj')

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
		let mesh=new THREE.Mesh(geometries[geometry], materials[material])
		scene.add(mesh)
		let scale={
			overall:1,
			x:1,y:1,z:1,
		}
		const item= {
			get ID(){return ID},
			get transform(){return{
				get position(){return{
					get x(){return mesh.position.x},
					get y(){return mesh.position.y},
					get z(){return mesh.position.z},
					set x(value){mesh.position.x=value},
					set y(value){mesh.position.y=value},
					set z(value){mesh.position.z=value},
				}},
				get rotation(){return{
					//Should be able to have deg and rad inputs unless this is raw
					get x(){return mesh.rotation.x/Math.PI*180},
					get y(){return mesh.rotation.y/Math.PI*180},
					get z(){return mesh.rotation.z/Math.PI*180},
					set x(value){mesh.rotation.x=value*Math.PI/180},
					set y(value){mesh.rotation.y=value*Math.PI/180},
					set z(value){mesh.rotation.z=value*Math.PI/180},
				}},
				get scale(){return{
					get x(){return scale.x},
					get y(){return scale.y},
					get z(){return scale.z},
					set x(value){scale.x=value;mesh.scale.x=scale.x*scale.overall},
					set y(value){scale.y=value;mesh.scale.y=scale.y*scale.overall},
					set z(value){scale.z=value;mesh.scale.z=scale.z*scale.overall},
					set overall(value)
					{
						scale.overall=value
						mesh.scale.x=scale.x*scale.overall
						mesh.scale.y=scale.y*scale.overall
						mesh.scale.z=scale.z*scale.overall
					},
					get overall(){return overall_scale},
				}},
			}},
			get material(){return{
				get mode(){return material},
				set mode(mode){material=mode;mesh.material=materials[mode]},
			}},
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
			get x(){return light.position.x;},
			get y(){return light.position.y;},
			get z(){return light.position.z;},
			set x(value){light.position.x=value},
			set y(value){light.position.y=value},
			set z(value){light.position.z=value},
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

var mousedownItem
function mousedown(event)
{
	mousedownItem=getClickedItem(event)
}
renderer.domElement.addEventListener("mousedown", mousedown, true)

function mouseup(event)
{
	const mouseupItem=getClickedItem(event)
	if(mouseupItem && mousedownItem)
		triggerTransition(mousedownItem,mouseupItem)
	mousedownItem=undefined
}
renderer.domElement.addEventListener("mouseup", mouseup, true);

function triggerTransition(mousedownItem,mouseupItem)
{
	console.log("TRIGGER: "+mousedownItem.ID+" TO "+mouseupItem.ID)
	const transition = items.scene.transitions[mousedownItem.ID][mouseupItem.ID]
	// applyDelta(items, deltas[transition.deltaID], )
	requestTween(transition.delta,transition.time)
}

function gtoc()
{
	//Return _remainintTime in seconds since 1970
	return new Date().getTime()/1000
}

var tween={
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

function requestTween(delta,time=0)
{
	tween.time=time
	tween.delta=delta
}


function blend(x,y,alpha)
{
	return (1-alpha)*x+alpha*y
}
function blendedDeltas(x,y,alpha)
{
	//Pure function: no mutations
	//EXAMPLE:
	// let a={a:0,b:{c:1,d:2},W:false}
	// let b={a:1,b:{c:2,d:3},W:true}
	// blendedDeltas(a,b,.2) ===== {a:0.2,b:{c:1.2000000000000002,d:2.2},W:true}
	x=copiedDelta(x)
	function blended(o,d)
	{
		if(Object.getPrototypeOf(o)===Number.prototype&&
			Object.getPrototypeOf(d)===Number.prototype  )
			return [blend(o,d,alpha),d]
		return [d,d]
	}
	applyDelta(x,y,blended)
	return x
}

function soakDelta(o,d)
{
	//This just mutates 'd', in the same way a normal applyDelta would.
	//Returns nothing, just like applyDelta.
	//In other words, the only difference between soakDelta and applyDelta is that soakDelta doesn't mutate 'o'.
	applyDelta(o,d,(o,d)=>[o,o])
}
function pourDelta(o,d)
{
	//Opposite of soakDelta
	//This just mutates 'o', in the same way a normal applyDelta would.
	//Returns nothing, just like applyDelta.
	//In other words, the only difference between pourDelta and applyDelta is that pourDelta doesn't mutate 'd'.
	applyDelta(o,d,(o,d)=>[d,d])
}

function render()
{
	applyDelta(items,tween.delta)
	requestAnimationFrame(render)
	camera.updateProjectionMatrix()//Lets you update camera FOV and aspect ratio
	camera.aspect=window.innerWidth/window.innerHeight
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.render(scene, camera)
}
render()

function copiedDelta(d)
{
	//Copies an object tree
	if(!d||Object.getPrototypeOf(d)!==Object.prototype)
		return d
	const out={}
	for(const [key,val] of Object.entries(d))
		out[key]=copiedDelta(val)
	return out
}

function applyDelta(o,d,f=(o,d)=>[d,o])
{
	//Apply _targetDelta 'd' to object 'o' and make d the receipt.
	//Mutates both o and d and returns nothing.
	console.assert(Object.getPrototypeOf(d)===Object.prototype)//All deltas are object trees
	if(o===undefined)
		return
	for(const [key,val] of Object.entries(d))
	{
		if(key in o)
		{
			if(val === undefined)
			{
				d[key]=o[key]//For our receipt...
				delete o[key]
			}
			else if(Object.getPrototypeOf(val) === Object.prototype)
			{
				applyDelta(o[key],val,f)
			}
			else
			{
				[o[key],d[key]] = f(o[key],val)//Added this function to enable things like blending etc
			}
		}
		else if(val!==undefined)
		{
			o[key] = val
			d[key] = undefined
		}
	}
}

