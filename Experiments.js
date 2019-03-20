const gloves={
	transmitter:function(objects,path=[])
	{
		assert.
		const handler={
			get(target,key)
			{
				return arguments.callee()
			},
		}
	},
}


function is_object(x)
{
	return Boolean(x&&Object.getPrototypeOf(x)===Object.prototype)
}

function sortKeys(object)
{
	//Recursively reorder the keys alphabetically
	//Intended for use on json-like objects
	//Originally written to normalize djson files' object representations
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
		return Boolean(keyPath.valid(object,path)&&(keyPath.get(object,path)!=null))//Note: x!=null implies x!==undefined&&x!==null
	},
	valid(object,path)
	{
		//Returns true, even if the end result is null or undefined. Returns false if accessing would give an error.
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
		console.assert(path!=null&&Object.getPrototypeOf(path)===Array.prototype)
		console.assert(keyPath.valid(object,path),'getKeyFromPath error: path '+JSON.stringify(path)+' does not exist in object '+JSON.stringify(object))
		for(const key of path)
			object=object[key]
		return object
	},
	pave(objectpath)
	{
		//NOTE: NOT PURE! Mutates object!
		for(const key of path)
		{
			const value=object[key]
			object=keyPath.exists(value,key)?value:{[key]:{}}
		}
		return object
	},
	set(object,value,path)
	{
		//NOTE: NOT PURE! Mutates object!
		//Specify path as a list of keys: see getPath's description for explanation
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