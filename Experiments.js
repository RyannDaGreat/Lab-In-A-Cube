const gloves={
	broadcaster:function(objects,path=[])
	{
		//Will broadcast any deltas to all objects in objects.
		//	Objects can be an array, or it could be a normal object
		//	where the object's values are the things we wish to
		//	broadcast to. 
		//Note that this means you can subscribe/unsubscribe new
		//	objects to this broadcaster, 
		//Also note that this communication is one-way. You can
		//	never get the leaf values of any object in objects
		//	via this glove; you can only set them
		//EXAMPLE:
		//	A={};B={};C=gloves.broadcaster([A,B]);C.a.b.c=5;console.log(A.a.b.c,B.a.b.c)
		assert.rightArgumentLength(arguments)
		const handler={
			get(_,key)
			{
				return gloves.broadcaster(objects,[...path,key])
			},
			set(_,key,value)
			{
				for(object of objects)
				{
					keyPath.pave(object,path)//Ensure a path exists for us to write to...
					keyPath.set(object,[...path,key],value)//...then write to it 
					//(WARNING: this might burst into flames if there's some Object.freeze
					//	shenanagins going on in any of the objects etc)
				}
			}
		}
		return new Proxy(Object.create(null),handler)
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

const keyPath={
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
			object=object[key]=keyPath.exists(value,[key])?value:{}
		}
	},
	set(object,path,value)
	{
		//NOTE: NOT PURE! Mutates object!
		//Specify path as a list of keys: see getPath's description for explanation
		assert.rightArgumentLength(arguments)
		console.assert(path!=null&&Object.getPrototypeOf(path)===Array.prototype)
		console.assert(keyPath.valid(object,path))
		path=[...path]
		path_end=path.pop()
		for(const key of path)
			object=object[key]
		object[path_end]=value
	},
}