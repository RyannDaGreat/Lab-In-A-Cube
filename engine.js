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
	//Reserved item names:
	get sound(){},
	get inherit(){},
	get condition(){},
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
	assert.rightArgumentLength(arguments)
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
	console.assert(arguments.length===2,'Wrong number of arguments.')
	let cursor=items.scene.transitions.drag
	if(mousedownItem.ID in cursor && mouseupItem.ID in cursor[mousedownItem.ID])
	{
		const transition = items.scene.transitions.drag[mousedownItem.ID][mouseupItem.ID]
		requestTween(getDeltaByID(transition.delta),transition.time )
		console.log("triggerDragTransition: "+mousedownItem.ID+" TO "+mouseupItem.ID)
	}
	else
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


function getDeltaInheritanceChainString(rootDeltaID)
{
	//Returns a space-separated string
	//This function has been tested (not for edge cases yet though) seems to work perfectly (got it on the first try) 
	//TODO: This function is needed to handle circular delta inheritance. 
	//This function should DEFINITELY be cached...but right now it's NOT. In fact, even the result of this chain should be cached...getDeltaByID should be cached. But that's premature optimization for now...

	const deltaContainedInState_Cache={}//NOT SURE WHAT TO DO WITH THIS YET BUT I HAVE TO GO TO CLASS...WE WANT RECURSIVE CONDITIONS....
	console.assert(arguments.length==1,'Wrong number of arguments.')
	const out=[]
	function helper(deltaID)
	{
		if(out.includes(deltaID))
			return//No duplicates!
		if(deltaExistsInConfig(deltaID))
		{
			out.unshift(deltaID)//Put it at the beginning; which is the place of least-priority
			const delta=getRawDeltaFromConfigByID(deltaID)
			if(delta.inherit!=undefined)
			{
				console.assert(typeof delta.inherit==='string','getDeltaInheritanceChainString helper error: '+repr(deltaID)+' inheritance cannot be of type object, it must be a space-separated string of deltaIDs')
				for(inheritedDeltaID of getArrayOfDeltaIDsFromString(delta.inherit).reverse())
					helper(inheritedDeltaID)
			}
		}
		else
			console.error('getDeltaInheritanceChainString error: '+repr(deltaID)+' is not a valid delta, skipping it...')
	}
	helper(rootDeltaID)
	return out.join(' ')
}

function deltaContainedInState(deltaID,deltaContainedInState_Cache)
{
	console.assert(arguments.length==2,'Wrong number of arguments.')
	assert.isPureObject(deltaContainedInState_Cache)
	assert.isString(deltaID)
	console.assert(deltaExistsInConfig(deltaID),'deltaContainedInState error: deltaID = '+repr(deltaID)+' is not in config')
	if(deltaID in deltaContainedInState_Cache)//This NEEDS to exist in order for this function to avoid circular loops
		return deltaContainedInState_Cache[deltaID]
	const currentState=tween.delta
	return deltaContainedInState_Cache[deltaID]=deltas.contains(currentState,getDeltaByID(deltaID,deltaContainedInState_Cache))

	//This is the foundation of all conditions. The question: Is this delta contained in the current state?
	//This function can be cached with respect to the simplified state-stack of deltas
}

function deltaExistsInConfig(deltaID)
{
	console.assert(arguments.length==1,'Wrong number of arguments.')
	return deltaID in config.deltas
}

function getRawDeltaFromConfigByID(deltaID)
{
	//Simply read a delta from the config and return a copy (in-case we mutate it later). This intermediate function exists to help throw useful errors.
	//This function should be cached...but right now I'm not caching it because the config might be reloaded dynamically, and I don't want to add hooks to that method to clear this cache.
	console.assert(arguments.length==1,'Wrong number of arguments.')
	assert.isPureObject(config.deltas)//config.deltas must exist
	if(deltaExistsInConfig(deltaID))
	{
		console.assert(typeof config.deltas[deltaID] === 'object','getDeltaByID error: '+'typeof config.deltas['+deltaID+'] === '+typeof config.deltas[deltaID]+'\n(All entries in config.deltas should be objects! Not numbers, not strings, etc. Check the djson and make sure no spaces are attached to delta '+deltaID)
		return (config.deltas[deltaID])//The copy might or might not be nessecary, but it's safer in case we mutate it later. This function isn't meant for setting these parameters. That should only be done with applyDelta or loading the config file.
	}
	else
	{
		console.error('getDeltaByID error: deltaID='+repr(deltaID)+' is not the name of a delta!\nMore Info: Object.keys(config.deltas).join(\' \')) = '+repr(Object.keys(config.deltas).join(' '))+'\nThe show MUST go on, so this function will just return an empty delta (aka {})...please fix this! (Probably with a change to the config)')
		return {}
	}
}

function getDeltaByID(deltaID)
{
	//Unlike getRawDeltaFromConfigByID, this function takes into account deltas' inheritance chains, and any other preprocessing that may have to be done (if I add more things in the future)
	//THIS FUNCTION SHOULD BE CACHED (a task for another day if its too slow).
	//	But right now it isn't, because in the Editor, we can change the config without reloading the whole page...and that would mean I would have to hook config's changes into clearing the cache.
	console.assert(arguments.length>=1,'Wrong number of arguments.')
	let out=deltaRawCompositionFromIdsString(getDeltaInheritanceChainString(deltaID))
	return out
}

function getArrayOfDeltaIDsFromString(deltaIdsSeparatedBySpaces)
{
	console.assert(arguments.length==1,'Wrong number of arguments.')
	assert.isPrototypeOf(deltaIdsSeparatedBySpaces,String)
	console.assert(!deltaIdsSeparatedBySpaces.includes('\t'),'deltaRawCompositionFromIdsString error: Dont feed tabs into deltaRawCompositionFromIdsString! Your string: '+repr(deltaIdsSeparatedBySpaces))
	console.assert(!deltaIdsSeparatedBySpaces.includes('\n'),'deltaRawCompositionFromIdsString error: Dont feed more than one line into deltaRawCompositionFromIdsString! Your string: '+repr(deltaIdsSeparatedBySpaces))
	//
	const deltaIds=deltaIdsSeparatedBySpaces.trim().split(/\ +/)//We split by spaces, because there is a rule that no deltaID can contain spaces (because no djson keys can contain whitespace). We forget the 'edge case' where we have a deltaID that is an empty string, because that's not allowed either (which is why we use .trim() and split by any number of spaces at a time, AKA /\ +/ instead of just /\ /)
	assert.isPureArray(deltaIds)
	return deltaIds
}

function deltaRawCompositionFromIdsString(deltaIdsSeparatedBySpaces)
{
	console.assert(arguments.length==1,'Wrong number of arguments.')
	//Takes a space-separated string of deltaID's and returns the composition of all of those deltas as a delta object
	const deltaIds=getArrayOfDeltaIDsFromString(deltaIdsSeparatedBySpaces)
	assert.isPureArray(deltaIds)
	const out={}
	for(const deltaID of deltaIds)
	{
		console.assert(deltaID in config.deltas,'deltaRawCompositionFromIdsString error: '+repr(deltaID)+' is not a real delta!\ndeltaIdsSeparatedBySpaces = '+repr(deltaIdsSeparatedBySpaces))
		deltas.pour(out,getRawDeltaFromConfigByID(deltaID))
	}
	return out
}

function print_current_state()
{
	console.assert(arguments.length===0,'Wrong number of arguments.')
	console.log(djson.stringify(tween.delta))
}

function requestTween(delta,time=0)
{
	//Tweens will be denied if we are in the middle of a transition
	console.assert(arguments.length>=1,'Wrong number of arguments.')
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
			requestTween(getDeltaByID(auto.delta),auto.time)
	}
	camera.updateProjectionMatrix()//Lets you update camera FOV and aspect ratio
	camera.aspect=window.innerWidth/window.innerHeight
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.render(scene, camera)
}
render()

