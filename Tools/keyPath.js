const keyPath={
	//
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
		//NOTE: NOT PURE! Mutates object! Returns nothing.
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