const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.getElementById('renderer').appendChild(renderer.domElement)
window.onresize=requestRender//Re-render when we resize the window

const scene = new THREE.Scene()
scene.background=new THREE.Color(.1,.1,.1)

const ambientLight=new THREE.AmbientLight( 0x404040 )
scene.add(ambientLight)

const camera = new THREE.PerspectiveCamera(75,10,1,999999)
camera.fov=75
// camera.position.z = 0

engineModules={
	//These modules cannot be instantiated from a djson file. There's only one of each of them. But we're using funcitons to keep some variables private.
}

const overlay=document.getElementById('overlay')

let textures={default:null}
// textures=proxies.tryGetter(textures,()=>textures.default)

//CURSOR STYLES
function setCursor(style)
{
	renderer.domElement.style.cursor= style
}
function setWaitingCursor()
{
	setCursor('progress')
	// setCursor('wait')
	// setCursor('none')
}
function setClickableCursor()
{
	setCursor('pointer')
}
function setNormalCursor()
{
	setCursor('default')
}
function setDraggableCursor()
{
	setCursor('grab')
}

const geometries={
	box:  new THREE.BoxGeometry(1, 1, 1, 10, 10, 10),
	cube:  new THREE.BoxGeometry(700, 700, 700, 1, 1, 1),
	sphere: new THREE.IcosahedronGeometry(1, 3),
}

const sounds={}

const items={
	//Reserved item names:
	get sound(){},
	get inherit(){},
	get condition(){},
	overlay:
	{
		// NO threeObject, this is a DOM element
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
		threeObject:camera,
		transform:attributes.transform(camera),
		get fov(){return camera.fov},
		set fov(value){camera.fov=value},
	},
	scene:
	{
		threeObject:scene,
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

let mouse_x,mouse_y,mouse_in_renderer=false//THese are updated periodically.
function updateMousePosition(event)
{
	mouse_in_renderer=true
	mouse_x =  (event.clientX/window.innerWidth )*2-1
	mouse_y = -(event.clientY/window.innerHeight)*2+1
	updateItemIDUnderCursor()
	if(itemByIDIsClickable(itemIDUnderCursor))
	{
		setClickableCursor()
	}
	else if(itemByIDIsDraggable(itemIDUnderCursor))
	{
		setDraggableCursor()
	}
	else
	{
		setNormalCursor()
	}
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
function itemByIDIsClickable(itemID)
{
	console.assert(arguments.length===1,'Wrong number of arguments')
	console.assert(!itemID || itemID in items,'Not a real itemID! ItemID: ',itemID)
	if(!itemID)
	{
		return false
	}
	//Returns true IFF we can drag this item to iteself
	const scene=tween.delta.scene
	return keyPath.exists(scene,['transitions','drag',itemID,itemID])
}
function itemByIDIsDraggable(itemID)
{

	console.assert(arguments.length===1,'Wrong number of arguments')
	console.assert(!itemID || itemID in items,'Not a real itemID! ItemID: ',itemID)
	if(!itemID)
	{
		return false
	}
	//Returns true IFF we can drag this item to iteself
	const scene=tween.delta.scene
	return keyPath.exists(scene,['transitions','drag',itemID])
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

function requestTransition(transition,ignoreBlocking=false,isAuto=false)
{
	requestRender()
	//Handle conditions
	console.assert(arguments.length>=1,'Wrong number of arguments.')
	function t(id)//t is for Tween
	{
		requestTweenByID(id,transition.time,ignoreBlocking,isAuto)
	}
	function c(id)//c is for Condition
	{
		return deltaIDContainedInState(id)
	}
	let d=transition.delta
	assert.isString(d)
	d=d.trim().split(/ +/)
	assert.isPureArray(d)
	if(d.length===0)
	{
		console.error('You must specify a delta (deltaIDs cannot contain spaces nor be empty strings)')
	}
	else if(d.length===1)
	{
		t(d[0])
	}
	else if(d.length===2)
	{
		console.error('Invalid number of arguments at the moment',transition.delta)
	}
	else if(d.length===3)
	{
		console.assert(d[1]==='if')
		if(c(d[2]))
			t(d[0])
	}
	else if(d.length===4)
	{
		console.error('Invalid number of arguments at the moment',transition.delta)
	}
	else if(d.length===5)
	{
		console.assert(d[1]==='if')
		console.assert(d[3]==='else')
		if(c(d[2]))
		{
			t(d[0])
		}
		else
		{
			t(d[4])
		}
	}
	else
	{
		console.error('Invalid number of arguments at the moment',transition.delta)
	}
}

function triggerEnterTransition(enterItemID)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	if(enterItemID===undefined)
		return
	//A transition triggered by mousing over something
	let cursor=tween.delta.scene.transitions.enter
	if(cursor && enterItemID in cursor)
	{
		const transition = tween.delta.scene.transitions.enter[enterItemID]
		requestTransition(transition,true)
		console.log("triggerEnterTransition: "+enterItemID)
	}
	else if(debugMouseHovers)
	{
		console.error("triggerEnterTransition error: No transition from "+enterItemID+" exists")
	}
}

const debugMouseHovers=false

function triggerLeaveTransition(leaveItemID)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	if(leaveItemID===undefined)
		return
	//A transition triggered by mousing over something
	let cursor=tween.delta.scene.transitions.leave
	if(cursor && leaveItemID in cursor)
	{
		const transition = tween.delta.scene.transitions.leave[leaveItemID]
		requestTransition(transition,true)
		console.log("triggerLeaveTransition: "+leaveItemID)
	}
	else if(debugMouseHovers)
	{
		console.error("triggerLeaveTransition error: No transition from "+leaveItemID+" exists")
	}
}


function triggerDragTransition(mousedownItem,mouseupItem)
{
	console.assert(arguments.length===2,'Wrong number of arguments.')
	let cursor=tween.delta.scene.transitions.drag
	if(mousedownItem.ID in cursor && mouseupItem.ID in cursor[mousedownItem.ID])
	{
		const transition = tween.delta.scene.transitions.drag[mousedownItem.ID][mouseupItem.ID]
		requestTransition(transition,false)
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
		// deltas.pour(tween._initialDelta,delta)
		tween._initialDelta=deltas.blended(deltas.blended(tween._initialDelta,tween._targetDelta,1),delta,0)
		// tween._initialDelta=deltas.poured(deltas._targetDelta,deltas._initialDelta)
		tween._targetDelta=delta
		tween.delta//BEcause its a bit glitchy....idk why. This fixes it.
		tween.delta
		tween.delta
		requestRender()
	},
}


function getDeltaInheritanceChainString(rootDeltaID)
{
	//Returns a space-separated string
	//This function has been tested (not for edge cases yet though) seems to work perfectly (got it on the first try) 
	//TODO: This function is needed to handle circular delta inheritance. 
	//This function should DEFINITELY be cached...but right now it's NOT. In fact, even the result of this chain should be cached...getDeltaByID should be cached. But that's premature optimization for now...
	//NOT SURE WHAT TO DO WITH THIS YET BUT I HAVE TO GO TO CLASS...WE WANT RECURSIVE CONDITIONS....
	console.assert(arguments.length===1, 'Wrong number of arguments.')
	const out=[]
	function helper(deltaID)
	{
		if(out.includes(deltaID))
			return//No duplicates!
		if(deltaExistsInConfig(deltaID))
		{
			out.unshift(deltaID)//Put it at the beginning; which is the place of least-priority
			const delta=getRawDeltaFromConfigByID(deltaID)
			if(delta.inherit!==undefined)
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

function deltaIDContainedInState(deltaID)
{

	console.assert(arguments.length===1,'Wrong number of arguments.')
	const currentState=tween.delta
	if(currentState.sound!==undefined)
		delete currentState.sound
	return deltas.contains(currentState,getDeltaByID(deltaID))
	// assert.isPureObject(deltaContainedInState_Cache)
	// assert.isString(deltaID)
	// console.assert(deltaExistsInConfig(deltaID),'deltaIDContainedInState error: deltaID = '+repr(deltaID)+' is not in config')
	// if(deltaID in deltaContainedInState_Cache)//This NEEDS to exist in order for this function to avoid circular loops
	// 	return deltaContainedInState_Cache[deltaID]
	// return deltaContainedInState_Cache[deltaID]=deltas.contains(currentState,getDeltaByID(deltaID,deltaContainedInState_Cache))

	//This is the foundation of all conditions. The question: Is this delta contained in the current state?
	//This function can be cached with respect to the simplified state-stack of deltas
}

function deltaExistsInConfig(deltaID)
{
	console.assert(arguments.length===1, 'Wrong number of arguments.')
	if(!is_defined(config.deltas))
	{
		console.warn("deltaExistsInConfig: There is no 'deltas' entry in the config, therefore",repr(deltaID),"cannot exist in the config")
		return false
	}
	else
	{
		return deltaID in config.deltas
	}
}

function getRawDeltaFromConfigByID(deltaID)
{
	//Simply read a delta from the config and return a copy (in-case we mutate it later). This intermediate function exists to help throw useful errors.
	//This function should be cached...but right now I'm not caching it because the config might be reloaded dynamically, and I don't want to add hooks to that method to clear this cache.
	console.assert(arguments.length>=1,'Wrong number of arguments.')//>=1 instead of ===1 because of deltaRawCompositionFromIdArray using the Array.prototype.map function (which passes multiple arguments, only the first of which is important)
	if(deltaExistsInConfig(deltaID))
	{
		console.assert(typeof config.deltas[deltaID] === 'object','getDeltaByID error: '+'typeof config.deltas['+deltaID+'] === '+typeof config.deltas[deltaID]+'\n(All entries in config.deltas should be objects! Not numbers, not strings, etc. Check the djson and make sure no spaces are attached to delta '+deltaID)
		return (config.deltas[deltaID])//The copy might or might not be nessecary, but it's safer in case we mutate it later. This function isn't meant for setting these parameters. That should only be done with applyDelta or loading the config file.
	}
	else
	{
		assertValidDeltaId(deltaID)
		return {}
	}
}

function getDeltaByIDWithInheritance(deltaID)
{
	console.assert(arguments.length>=1,'Wrong number of arguments.')
	let out=deltaRawCompositionFromIdsString(getDeltaInheritanceChainString(deltaID))
	delete out.inherit//We don't want this variable hanging around when we compare the deltas to the state
	return out
}

function getDeltaByID(deltaID)
{
	//I KNOW THIS FUNCTION LOOKS LIKE A DUMMY BUT PLEASE DONT DELETE IT FOR FUTURE EXPANSION PURPOSES
	//This function is allowed to have schenenangins
	//Unlike getRawDeltaFromConfigByID, this function takes into account deltas' inheritance chains, and any other preprocessing that may have to be done (if I add more things in the future)
	//THIS FUNCTION SHOULD BE CACHED (a task for another day if its too slow).
	//	But right now it isn't, because in the Editor, we can change the config without reloading the whole page...and that would mean I would have to hook config's changes into clearing the cache.
	const out=getDeltaByIDWithInheritance(deltaID)
	// delete out.sound//We don't want this variable hanging around when we compare the deltas to the state
	return out
}


function getArrayOfDeltaIDsFromString(deltaIdsSeparatedBySpaces)
{
	console.assert(arguments.length===1, 'Wrong number of arguments.')
	assert.isPrototypeOf(deltaIdsSeparatedBySpaces,String)
	console.assert(!deltaIdsSeparatedBySpaces.includes('\t'),'deltaRawCompositionFromIdsString error: Dont feed tabs into deltaRawCompositionFromIdsString! Your string: '+repr(deltaIdsSeparatedBySpaces))
	console.assert(!deltaIdsSeparatedBySpaces.includes('\n'),'deltaRawCompositionFromIdsString error: Dont feed more than one line into deltaRawCompositionFromIdsString! Your string: '+repr(deltaIdsSeparatedBySpaces))
	//
	const deltaIds=deltaIdsSeparatedBySpaces.trim().split(/ +/)//We split by spaces, because there is a rule that no deltaID can contain spaces (because no djson keys can contain whitespace). We forget the 'edge case' where we have a deltaID that is an empty string, because that's not allowed either (which is why we use .trim() and split by any number of spaces at a time, AKA /\ +/ instead of just /\ /)
	assert.isPureArray(deltaIds)
	return deltaIds
}

function deltaRawCompositionFromIdsString(deltaIdsSeparatedBySpaces)
{
	console.assert(arguments.length===1, 'Wrong number of arguments.')
	//Takes a space-separated string of deltaID's and returns the composition of all of those deltas as a delta object
	const deltaIds=getArrayOfDeltaIDsFromString(deltaIdsSeparatedBySpaces)
	assert.isPureArray(deltaIds)
	return deltaRawCompositionFromIdArray(deltaIds)
}

function assertValidDeltaId(deltaID)
{
	assert.isString(deltaID)
	console.assert(deltaExistsInConfig(deltaID),'deltaRawCompositionFromIdsString error: '+repr(deltaID)+' is not a real delta!\ndeltaIdsSeparatedBySpaces = '+repr(Object.keys(config.deltas).join(' ')))
}
function assertAllValidDeltaIds(deltaIdsAsArray)
{
	assert.isPureArray(deltaIdsAsArray)
	for(const deltaID of deltaIdsAsArray)
		if(deltaID!=='')//I dont know what's feeding this function empty deltaIds, but its spamming the console with errors...I dont think its a big problem though. I'm going to squelch that error with this line.
			assertValidDeltaId(deltaID)
}

function deltaRawCompositionFromIdArray(deltaIdsAsArray)
{
	console.assert(arguments.length===1, 'Wrong number of arguments.')
	assert.isPureArray(deltaIdsAsArray)
	assertAllValidDeltaIds(deltaIdsAsArray)
	return deltaCompositionFromArray(deltaIdsAsArray.map(getRawDeltaFromConfigByID))
}
function deltaCompositionFromIdArray(deltaIdsAsArray)
{
	console.assert(arguments.length===1, 'Wrong number of arguments.')
	assert.isPureArray(deltaIdsAsArray)
	assertAllValidDeltaIds(deltaIdsAsArray)
	return deltaCompositionFromArray(deltaIdsAsArray.map(getDeltaByID))
}
function deltaCompositionFromArray(deltaArray)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	assert.isPureArray(deltaArray)
	const out={}
	for(const delta of deltaArray)
	{
		assert.isPureObject(delta)
		deltas.pour(out,delta)
	}
	return out
}

function print_current_state()
{
	console.assert(arguments.length===0,'Wrong number of arguments.')
	console.log(djson.stringify(tween.delta))
}

function requestTweenByID(deltaID,time=0,ignoreBlocking=false,isAuto=false)
{
	if(deltaID==='none')
	{
		console.log('requestTweenByID("none") skips a transition. This is an alternative for setting this transition to null.')
		return
	}
	console.assert(arguments.length>=1,'Wrong number of arguments.')
	if(!deltaIDContainedInState(deltaID))
	{
		pushDeltaIDToStateStack(deltaID)
		console.log('requestTweenByID: deltaID = '+repr(deltaID)+' and time = '+repr(time))
		requestTween(getDeltaByID(deltaID),time,ignoreBlocking,isAuto)
	}
	else
	{
		tween.delta={scene:{transitions:{auto:null}}}//This saves us from having to rewrite 'scene	transitions	auto	null' all over the place (otherwise, if we enter some delta with auto, by default (if that delta doesnt set scene	transitions	auto	null), we'll be stuck there forever.)
		console.log('requestTweenByID: Skipping tween '+repr(deltaID)+' because it would have no effect (the gamestate contains it allready)')
	}
}

function requestTween(delta,time=0,ignoreBlocking=false,isAuto=false)
{
	//if ignoreBlocking is true, it will override the transition blocker
	//Tweens will be denied if we are in the middle of a transition
	console.assert(arguments.length>=1,'Wrong number of arguments.')
	if(tween.time&&!ignoreBlocking){console.log("Blocked Transition (another transition is still tweening)");return}//Don't allow more than one tween at a time
	if(!isAuto&&autoIsPending())
		return//Don't let the user screw up the game
	if(delta.sound && typeof delta.sound==='string')
		playSound(config.sounds[delta.sound])
	deltas.pour(tween._initialDelta,{scene:{transitions:{auto:null}}})//This saves us from having to rewrite 'scene	transitions	auto	null' all over the place (otherwise, if we enter some delta with auto, by default (if that delta doesnt set scene	transitions	auto	null), we'll be stuck there forever.)
	deltas.pour(tween._targetDelta,{scene:{transitions:{auto:null}}})
	tween.time=time
	tween.delta=delta
}

let itemIDUnderCursor//Can be undefined if there is no item under the cursor
function updateItemIDUnderCursor()//Can be cached with respect to state and cursor position. 
{
	if(autoIsPending())
		return
	if(!tween.time)
	{
		//We shouldn't be processing this data while we're tweening
		const currentItemUnderCursor=getItemUnderCursor()
		console.assert(currentItemUnderCursor===undefined || 'ID' in currentItemUnderCursor,'Whoops, some internal error here if youre reading this...ID should ALWAYS be a parameter of every item beacuse thats how it knows what it is. (How it knows which key in "items" to find itself)')
		const currentItemIDUnderCursor=currentItemUnderCursor&&currentItemUnderCursor.ID//If the item is undefined, make the ID undefined. Else, set it to the item's ID.
		console.assert(currentItemIDUnderCursor===undefined || typeof currentItemIDUnderCursor ==='string','Oops...if youre reading this you need to figure out why ID; (a RESERVED parameter) was allowed to be turned into a non-string')
		if(itemIDUnderCursor!==currentItemIDUnderCursor)
		{
			if(debugMouseHovers)
				console.log('Item ID under cursor changed from '+itemIDUnderCursor+' to '+currentItemIDUnderCursor)
			triggerLeaveTransition(itemIDUnderCursor)
			triggerEnterTransition(currentItemIDUnderCursor)
		}
		itemIDUnderCursor=currentItemIDUnderCursor
	}
}
function updateCursorStyle()
{
	//This function doesnt exist yet. once/if i refactor this code, this will be the function you call to update the cursor style.
}
function autoIsPending(currentState=tween.delta)
{
	if(!tween.time)
	{
		if(keyPath.exists(currentState,'scene transitions auto'.split(' ')))//auto doesn't always exist (set it to null to delete it)
		{
			let auto=currentState.scene.transitions.auto//DONT USE items.scene.transitions.auto (this is updated every frame and overwritten; null can't delete this auto so you shouldn't use it. It causes lags and delays when you try to make it work with if/else statements etc)
			const autodeltaid=auto.delta
			if(!deltaIDContainedInState(autodeltaid))
			{
				return true
			}
		}
	}
	return false
}

const stateDeltaStack=[]//This is referenced by getters/setters in config
function pushDeltaIDToStateStack(deltaID)
{
	stateDeltaStack.push(deltaID)
}
function getStateDeltaStack()
{
	return stateDeltaStack
}
function getSimplifiedStateDeltaStack()
{
	return uniqueFromRight(stateDeltaStack)
}
function setStateFromDeltaIDArray(deltaIdsAsArray)
{
	tween._initialDelta=tween.delta
	tween._targetDelta=deltaCompositionFromIdArray(deltaIdsAsArray)

	// requestTween(deltaCompositionFromIdArray(deltaIdsAsArray),time,true,true)
}
function setStateFromDeltaIDSpaceSplitString(deltaIdsSeparatedBySpaces)
{
	setStateFromDeltaIDArray(getArrayOfDeltaIDsFromString(deltaIdsSeparatedBySpaces),time)
}
function refreshStateFromConfig()
{
	// reloadAssetsFromConfig()
	setStateFromDeltaIDArray(getSimplifiedStateDeltaStack())
	// printDeltaStack()
}
function printDeltaStack()
{
	console.log(stateDeltaStack.join('\n'))
}

//Settings
//THIS BREAKS THE SAD VIOLIN DOG. I DONT KNOW WHY. WHEN I USE IT IT FREEZES. THIS ENGINE HAS TO BE REWRITTEN CLEANLY. If we should automatically set auto to 'null' after finishing an auto-sequence

//This section is to save battery life (my laptop's battery is terrible, so I'm optimizing this site for energy consumption as well) (only render when the items' state changes)
let prevState =undefined//For further efficiency; we don't need to comparre strings every frame
let prevWidth =undefined//When undefined will force to render even if batterysavingmode is true
let prevHeight=undefined
let batterySavingMode=true//Only render frames when tween.delta changes. (Fire/stuff wont work if this is turned on but that's OK because i think not-having my laptop die is more important)
let renderRequested  =false//NOT a config item
function requestRender()
{
	if(!renderRequested)
		requestAnimationFrame(render)
	renderRequested=true//This funciton exists so we don't call requestAnimationFrame(render) needlessly many times
}

function render()
{
	renderRequested=false//REset this so requestRender() can be called again
	const currentState=tween.delta
	if(!batterySavingMode||currentState!==prevState||window.innerHeight!==prevHeight||window.innerWidth!==prevWidth)//To save battery life, only animate the frames when we have some change in the deltas.
	{
		deltas.pour(items,currentState)
		if(autoIsPending(currentState))
		{
			let auto=currentState.scene.transitions.auto//DONT USE items.scene.transitions.auto (this is updated every frame and overwritten; null can't delete this auto so you shouldn't use it. It causes lags and delays when you try to make it work with if/else statements etc)
			const autodeltaid=auto.delta
			console.log('Requesting auto-tween: auto.delta = '+repr(autodeltaid)+' and auto.time = '+repr(auto.time))
			requestTransition(auto,true,true)
		}
		prevHeight=window.innerHeight
		prevWidth =window.innerWidth
		// 
		camera.aspect=prevWidth/prevHeight
		camera.updateProjectionMatrix()//Lets you update camera FOV and aspect ratio
		renderer.setSize(prevWidth,prevHeight)
		renderer.render(scene, camera)
		if(JSON.stringify(currentState)!==JSON.stringify(prevState)||tween.time)//If tween recycled a state (and didn't bother calculating a new one), it means
			//The ||tween.time is because we need to be able to wait-out timed deltas even if they don't change anything (as it might turn out; for ex emptying an empty flask)  (its purpose is very subtle, but very real; please dont remove it)
		{
			requestRender()//IF STATE HASNT CHANED; SOmebody must call render() again in order to make the program continue to render things. THis is because requestAnimationFrame(render) is skipped (because we're returning NOW)
			setWaitingCursor()
		}
		else
		{
			setNormalCursor()
		}
	}
	prevState=currentState
	updateItemIDUnderCursor()//Becuase when battery saving is on, and we just finish playing an animation, it won't update till we move our mouse
}
