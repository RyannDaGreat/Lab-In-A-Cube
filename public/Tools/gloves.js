const gloves=proxies.argumentCountChecker({
	//Gloves are recursive proxies; basically proxies that are meant to work even with an 'deltas.apply' method call
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
		//This function was originally created to be used with deltas.apply, but can be generalized (which is why it's just a generic glove)
		assert.rightArgumentLength(arguments)
		assert.isPureArray(objects)
		assert.isPureArray(path)
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
})