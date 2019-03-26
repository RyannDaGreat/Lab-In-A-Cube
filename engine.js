const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.getElementById('renderer').appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background=new THREE.Color(.1,.1,.1)

const ambientLight=new THREE.AmbientLight( 0x404040 )
scene.add(ambientLight)

const camera = new THREE.PerspectiveCamera(75,10,1,999999)
camera.fov=75
// camera.position.z = 0

//This is yucky. I shouldn't have to pass the name through a parameter...but I can't think of a cleaner way yet. Same problem as any item in an object tree knowing its path.
// deltas={}

engineModules={
	//These modules cannot be instantiated from a djson file. There's only one of each of them. But we're using funcitons to keep some variables private.
}

const overlay=document.getElementById('overlay')

const items={
	//Reserved item names:
	get sound(){},
	get inherit(){},
	get condition(){},
	overlay:
	{
		get element()
		{
			return overlay
		},
		get text()
		{
			return overlay.innerText
		},
		set text(value)
		{
			overlay.innerText=value
		},
		set size(value)
		{
			//Set size in pixels
			assert.isNumber(value)
			console.assert(value>0,'Font sizes must be greater than 0pt')
			overlay.style['fontSize']=value+'px'
		},
	},
	camera:
	{
		transform:attributes.transform(camera),
		get fov(){return camera.fov},
		set fov(value){camera.fov=value},
	},
	scene:
	{
		transitions:
		{
			smooth:1,
		},
		get scene(){return scene},
		background:
		{
			color:attributes.rgb(scene.background),
		},
		ambience:
		{
			color:attributes.rgb(ambientLight.color),
			get intensity(){return ambientLight.intensity},
			set intensity(value){ambientLight.intensity=value},
		},
	},
}

const textures={default:null}

const cubeMaps={default:null}

const geometries={
	box:  new THREE.BoxGeometry(700, 700, 700, 10, 10, 10),
}

const sounds={}

let mouse_x,mouse_y,mouse_in_renderer=false//THese are updated periodically.
function updateMousePosition(event)
{
	mouse_in_renderer=true
	mouse_x =  (event.clientX/window.innerWidth )*2-1
	mouse_y = -(event.clientY/window.innerHeight)*2+1
}
function getItemUnderCursor()//Give it a mouse event
{
	console.assert(arguments.length===0,'Wrong number of arguments.')
	if(!mouse_in_renderer)
		return undefined
	assert.rightArgumentLength(arguments)
	const raycaster = new THREE.Raycaster();
	//Return clicked item, else return undefined
	const mouse = new THREE.Vector2()
	mouse.x=mouse_x
	mouse.y=mouse_y
	raycaster.setFromCamera(mouse, camera)
	const intersects = raycaster.intersectObjects(scene.children, true)
	if(intersects.length > 0)
	{
		const threeObject=intersects[0].object
		const item = threeObject.userData.item
		console.assert(item!==undefined)
		return item
	}
	return
	return 'scene'//If we're not mousing over an object, we're definately mousing over the scene
}

let mousedownItem
function mousedown(event)
{
	updateMousePosition(event)
	mousedownItem=getItemUnderCursor()
}

function mouseup(event)
{
	updateMousePosition(event)
	const mouseupItem=getItemUnderCursor()
	if(mouseupItem && mousedownItem)
		triggerDragTransition(mousedownItem,mouseupItem)
	mousedownItem=undefined
}
renderer.domElement.addEventListener("mousedown", mousedown, true)
renderer.domElement.addEventListener("mouseup", mouseup, true)
renderer.domElement.addEventListener("mouseout",   function(){mouse_in_renderer=false}, true)
renderer.domElement.addEventListener("mouseleave", function(){mouse_in_renderer=false}, true)
renderer.domElement.addEventListener("mousemove", updateMousePosition, true)


function triggerEnterTransition(enterItemID)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	if(enterItemID===undefined)
		return
	//A transition triggered by mousing over something
	let cursor=items.scene.transitions.enter
	if(cursor && enterItemID in cursor)
	{
		const transition = items.scene.transitions.enter[enterItemID]
		// requestTweenByID(transition.delta,transition.time)//Force the entry transition
		requestTween(getDeltaByID(transition.delta),transition.time,true)
		console.log("triggerEnterTransition: "+enterItemID)
	}
	else
	{
		console.error("triggerEnterTransition error: No transition from "+enterItemID+" exists")
	}
}

function triggerLeaveTransition(leaveItemID)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	if(leaveItemID===undefined)
		return
	//A transition triggered by mousing over something
	let cursor=items.scene.transitions.leave
	if(cursor && leaveItemID in cursor)
	{
		const transition = items.scene.transitions.leave[leaveItemID]
		requestTween(getDeltaByID(transition.delta),transition.time,true)
		// requestTweenByID(transition.delta,transition.time)
		console.log("triggerLeaveTransition: "+leaveItemID)
	}
	else
	{
		console.error("triggerLeaveTransition error: No transition from "+leaveItemID+" exists")
	}
}


function triggerDragTransition(mousedownItem,mouseupItem)
{
	console.assert(arguments.length===2,'Wrong number of arguments.')
	let cursor=items.scene.transitions.drag
	if(mousedownItem.ID in cursor && mouseupItem.ID in cursor[mousedownItem.ID])
	{
		const transition = items.scene.transitions.drag[mousedownItem.ID][mouseupItem.ID]
		// requestTween(getDeltaByID(transition.delta),transition.time )
		requestTweenByID(transition.delta,transition.time)
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
		let alpha=tween._alpha
		alpha=blend(alpha,smoothAlpha(alpha),items.scene.transitions.smooth)
		return deltas.blended(tween._initialDelta,tween._targetDelta,alpha)
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

	const currentState=tween.delta
	return deltas.contains(currentState,getDeltaByID(deltaID,deltaContainedInState_Cache))
	console.assert(arguments.length==2,'Wrong number of arguments.')
	assert.isPureObject(deltaContainedInState_Cache)
	assert.isString(deltaID)
	console.assert(deltaExistsInConfig(deltaID),'deltaContainedInState error: deltaID = '+repr(deltaID)+' is not in config')
	if(deltaID in deltaContainedInState_Cache)//This NEEDS to exist in order for this function to avoid circular loops
		return deltaContainedInState_Cache[deltaID]
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
	// delete out.inherit//We don't want this variable hanging around when we compare the deltas to the state
	// delete out.sound//We don't want this variable hanging around when we compare the deltas to the state
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

function requestTweenByID(deltaID,time=0,force=false)
{
	console.assert(arguments.length>=1,'Wrong number of arguments.')
	if(!deltaContainedInState(deltaID,{}))
	{
		console.log('requestTweenByID: deltaID = '+repr(deltaID)+' and time = '+repr(time))
		requestTween(getDeltaByID(deltaID),time,force)
	}
	else
	{
		console.log('requestTweenByID: Skipping tween '+repr(deltaID)+' because it would have no effect (the gamestate contains it allready)')
	}
}

function requestTween(delta,time=0,force=false,isAuto=false)
{
	//if force is true, it will override the transition blocker
	//Tweens will be denied if we are in the middle of a transition
	console.assert(arguments.length>=1,'Wrong number of arguments.')
	if(tween.time&&!force){console.log("Blocked Transition (another transition is still tweening)");return}//Don't allow more than one tween at a time
	if(!isAuto&&autoIsPending())
		return//Don't let the user screw up the game
	if(delta.sound && typeof delta.sound==='string')
	{
		new Audio(config.sounds[delta.sound]).play()
	}
	tween.time=time
	tween.delta=delta
}

const blocked_deltas=new Set


let itemIDUnderCursor//Can be undefined if there is no item under the cursor
function updateItemIDUnderCursor()
{
	if(!tween.time)
	{
		//We shouldn't be processing this data while we're tweening
		const currentItemUnderCursor=getItemUnderCursor()
		console.assert(currentItemUnderCursor===undefined || 'ID' in currentItemUnderCursor,'Whoops, some internal error here if youre reading this...ID should ALWAYS be a parameter of every item beacuse thats how it knows what it is. (How it knows which key in "items" to find itself)')
		const currentItemIDUnderCursor=currentItemUnderCursor&&currentItemUnderCursor.ID//If the item is undefined, make the ID undefined. Else, set it to the item's ID.
		console.assert(currentItemIDUnderCursor===undefined || typeof currentItemIDUnderCursor ==='string','Oops...if youre reading this you need to figure out why ID; (a RESERVED parameter) was allowed to be turned into a non-string')
		if(itemIDUnderCursor!==currentItemIDUnderCursor)
		{
			console.log('Item ID under cursor changed from '+itemIDUnderCursor+' to '+currentItemIDUnderCursor)
			triggerLeaveTransition(itemIDUnderCursor)
			triggerEnterTransition(currentItemIDUnderCursor)
		}
		itemIDUnderCursor=currentItemIDUnderCursor
	}
}

function autoIsPending(currentState=tween.delta)
{
	if(!tween.time)
	{
		if(keyPath.exists(currentState,'scene transitions auto'.split(' ')))//auto doesn't always exist (set it to null to delete it)
		{
			let auto=currentState.scene.transitions.auto//DONT USE items.scene.transitions.auto (this is updated every frame and overwritten; null can't delete this auto so you shouldn't use it. It causes lags and delays when you try to make it work with if/else statements etc)
			const autodeltaid=auto.delta
			const autodelta=getDeltaByID(auto.delta)//config.deltas[auto.delta]
			if(!deltaContainedInState(auto.delta,{}))
			{
				return true
			}
		}
	}
	return false
}

function render()
{
	const currentState=tween.delta
	deltas.pour(items,currentState)
	if(autoIsPending(currentState))
	{
		let auto=currentState.scene.transitions.auto//DONT USE items.scene.transitions.auto (this is updated every frame and overwritten; null can't delete this auto so you shouldn't use it. It causes lags and delays when you try to make it work with if/else statements etc)
		const autodeltaid=auto.delta
		const autodelta=getDeltaByID(auto.delta)//config.deltas[auto.delta]
		console.log('Requesting auto-tween: auto.delta = '+repr(autodeltaid)+' and auto.time = '+repr(auto.time))
		requestTween(autodelta,auto.time,true,true)
	}
	else
	{
		updateItemIDUnderCursor()
	}
	camera.updateProjectionMatrix()//Lets you update camera FOV and aspect ratio
	camera.aspect=window.innerWidth/window.innerHeight
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.render(scene, camera)
	requestAnimationFrame(render)
}

// function render()
// {
// 	updateItemIDUnderCursor()
// 	const currentState=tween.delta
// 	deltas.pour(items,currentState)
// 	requestAnimationFrame(render)
// 	if(!tween.time)
// 	{
// 		if(keyPath.exists(currentState,'scene transitions auto'.split(' ')))//auto doesn't always exist (set it to null to delete it)
// 		{
// 			let auto=currentState.scene.transitions.auto//DONT USE items.scene.transitions.auto (this is updated every frame and overwritten; null can't delete this auto so you shouldn't use it. It causes lags and delays when you try to make it work with if/else statements etc)
// 			const autodeltaid=auto.delta
// 			const autodelta=getDeltaByID(auto.delta)//config.deltas[auto.delta]
// 			if(!deltaContainedInState(auto.delta,{}))
// 			{
// 				console.log('Requesting auto-tween: auto.delta = '+repr(autodeltaid)+' and auto.time = '+repr(auto.time))
// 				requestTween(autodelta,auto.time,true)
// 			}
// 		}
// 	}
// 	camera.updateProjectionMatrix()//Lets you update camera FOV and aspect ratio
// 	camera.aspect=window.innerWidth/window.innerHeight
// 	renderer.setSize(window.innerWidth, window.innerHeight)
// 	renderer.render(scene, camera)
// }
// render()
render()
