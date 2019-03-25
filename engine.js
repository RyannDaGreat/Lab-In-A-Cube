const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background=new THREE.Color(.1,.1,.1)

const ambientLight=new THREE.AmbientLight( 0x404040 )
scene.add(ambientLight)

const camera = new THREE.PerspectiveCamera(75,10,1,999999)
camera.fov=75
// camera.position.z = 0

//This is yucky. I shouldn't have to pass the name through a parameter...but I can't think of a cleaner way yet. Same problem as any item in an object tree knowing its path.
// deltas={}

const items={
	camera:
	{
		transform:attributes.transform(camera),
		get fov()
		{
			return camera.fov
		},
		set fov(value)
		{
			camera.fov=value
		}
	},
	scene:
	{
		get scene(){return scene},
		background:
		{
			color:attributes.rgb(scene.background),
		},
		ambience:
		{
			color:attributes.rgb(ambientLight.color),
			get intensity()
			{
				return ambientLight.intensity
			},
			set intensity(value)
			{
				ambientLight.intensity=value
			},
		},
	},
}

const textures={default:null}

const cubeMaps={default:null}

const geometries={
	box:  new THREE.BoxGeometry(700, 700, 700, 10, 10, 10),
}

const sounds={}

function getClickedItem(event)//Give it a mouse event
{
	const raycaster = new THREE.Raycaster();
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
			const time = tween.time
		return 1 - (time / length)
	},
	get time()
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
		return deltas.blended(tween._initialDelta,tween._targetDelta,tween._alpha)
	},
	set delta(delta)
	{
		// pourDelta(tween._initialDelta,delta)
		tween._initialDelta=deltas.blended(deltas.blended(tween._initialDelta,tween._targetDelta,1),delta,0)
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
	//Tweens will be denied if we are in the middle of a transition
	if(delta.sound && typeof delta.sound==='string')
	{
		new Audio(delta.sound).play()
	}
	if(tween.time){console.log("Blocked Transition");return}//Don't allow more than one tween at a time
	tween.time=time
	tween.delta=delta
}

const blocked_deltas=new Set

function render()
{
	deltas.apply(items,tween.delta)
	requestAnimationFrame(render)
	if(!tween.time)
	{
		let auto=tween.delta.scene.transitions.auto//DONT USE items.scene.transitions.auto (this is updated every frame and overwritten; null can't delete this auto so you shouldn't use it. It causes lags and delays when you try to make it work with if/else statements etc)
		if(auto)//auto doesn't always exist (set it to null to delete it)
			requestTween(config.deltas[auto.delta],auto.time)
	}
	camera.updateProjectionMatrix()//Lets you update camera FOV and aspect ratio
	camera.aspect=window.innerWidth/window.innerHeight
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.render(scene, camera)
}
render()





