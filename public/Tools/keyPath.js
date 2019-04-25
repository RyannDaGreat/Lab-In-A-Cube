const keyPath=proxies.argumentCountChecker({
	//
	exists(object,path)
	{
		assert.rightArgumentLength(arguments)
		assert.isPureArray(path)
		return Boolean(keyPath.valid(object,path)&&(keyPath.get(object,path)!=null))//Note: x!=null implies x!==undefined&&x!==null
	},
	valid(object,path)
	{
		//Returns true, even if the end result is null or undefined. Returns false if accessing would give an error.
		assert.rightArgumentLength(arguments)
		assert.isPureArray(path)
		if(object===undefined||object===null)return false//Not iterable, will cause errors if we continue
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
		assert.isPureArray(path)
		console.assert(path!=null&&Object.getPrototypeOf(path)===Array.prototype)
		console.assert(keyPath.valid(object,path),'getKeyFromPath error: path '+JSON.stringify(path)+' does not exist in object '+JSON.stringify(object))
		for(const key of path)
			object=object[key]
		return object
	},
	getAndSquelch(object,path)
	{
		//Returns undefined where keyPath.get would throw an error
		//Essentially, 'squelching' any 'cannot access key of undefined' errors etc
		if(keyPath.valid(object,path))
		{
			return keyPath.get(object,path)
		}
		else
		{
			return undefined
		}
	},
	pave(object,path)
	{
		assert.rightArgumentLength(arguments)
		assert.isPureArray(path)
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
		assert.isPureArray(path)
		console.assert(path!=null&&Object.getPrototypeOf(path)===Array.prototype)
		console.assert(keyPath.valid(object,path))
		path=[...path]
		path_end=path.pop()
		for(const key of path)
			object=object[key]
		object[path_end]=value
	},
	getAllPaths(objectTree)
	{
		const out=[]
		function helper(root,path=[])
		{
			if(is_object(root))
			{
				for(const [index,value] of Object.entries(root))
				{
					helper(value,path.concat(index))
				}
			}
			else
			{
				out.push(path.concat(root))
			}
		}
		helper(objectTree)
		return out
	},
})