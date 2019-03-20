const gloves={
	transmitter:function(objects,path=[])
	{
		assert.isPureArray(objects)
		assert.isPureArray(objects)
		assert.rightArgumentLength(arguments)
		const handler={
			get(target,key)
			{
				return arguments.callee(target,[...path,key])
			},
			set(target,key,value)
			{
				for(object in objects)
				{
					try
					{
						keyPath.pave(object,path)
						keyPath.set(object,[...path,key],value)
					}
					catch
					{
						console.warn("transmitter failed to set path "+path+" to value "+value)
					}
				}
			}
		}
	},
}


function is_object(x)
{
	assert.rightArgumentLength(arguments)
	return Boolean(x&&Object.getPrototypeOf(x)===Object.prototype)
}

function sortKeys(object)
{
	//Recursively reorder the keys alphabetically
	//Intended for use on json-like objects
	//Originally written to normalize djson files' object representations
	//EXAMPLE: sortKeys({3:0,2:0,1:0}) ==== {1:0,2:0,3:0}   (order isn't supposed to matter, but it seems that it IS generally preserved)
	assert.rightArgumentLength(arguments)
	if(is_object(object))
	{
		const keys=Object.keys(object)
		keys.sort()
		for(const key of keys)
		{
			const value=object[key]
			delete object[key]
			object[key]=value//Place key on the bottom
			sortKeys(object[key])
		}
	}
}

var keyPath={
	exists(object,path)
	{
		assert.rightArgumentLength(arguments)
		return Boolean(keyPath.valid(object,path)&&(keyPath.get(object,path)!=null))//Note: x!=null implies x!==undefined&&x!==null
	},
	valid(object,path)
	{
		//Returns true, even if the end result is null or undefined. Returns false if accessing would give an error.
		assert.rightArgumentLength(arguments)
		for(const key of path)
		{
			if(object===null||object===undefined)
				return false
			object=object[key]
		}
		return true
	},
	get(object,path)
	{
		//Specify path as a list of keys
		//Example: getPath({a:{b:{c:0}}},['a','b','c'])===0
		assert.rightArgumentLength(arguments)
		console.assert(path!=null&&Object.getPrototypeOf(path)===Array.prototype)
		console.assert(keyPath.valid(object,path),'getKeyFromPath error: path '+JSON.stringify(path)+' does not exist in object '+JSON.stringify(object))
		for(const key of path)
			object=object[key]
		return object
	},
	pave(object,path)
	{
		assert.rightArgumentLength(arguments)
		//NOTE: NOT PURE! Mutates object!
		for(const key of path)
		{
			const value=object[key]
			object=keyPath.exists(value,key)?value:{[key]:{}}
		}
		return object
	},
	set(object,path,value)
	{
		//NOTE: NOT PURE! Mutates object!
		//Specify path as a list of keys: see getPath's description for explanation
		assert.rightArgumentLength(arguments)
		console.assert(path!=null&&Object.getPrototypeOf(path)===Array.prototype)
		console.assert(keyPath.exists(path))
		for(const key of path)
		{
			if(!(key in path))
				console.warn('getPath: key '+JSON.stringify(key)+' is a dead-end, and will return undefined!')
			object=object[key]
		}
		return object
	},
}