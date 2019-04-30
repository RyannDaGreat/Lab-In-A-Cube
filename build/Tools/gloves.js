const gloves=proxies.argumentCountChecker({
	//Gloves are recursive proxies; basically proxies that are meant to work even with an 'deltas.apply' method call
	broadcaster(objects)
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
		console.assert(arguments.length===1,'Wrong number of arguments')
		assert.isPureArray(objects)
		function helper(objects,path=[])//This helper function exists to let us exclude the path parameter from gloves.broadcaster (making how to use it more clear)
		{
			const handler={
				get(_,key)
				{
					return helper(objects,[...path,key])
				},
				set(_,key,value)
				{
					for(object of objects)
					{
						keyPath.pave(object,path)//Ensure a path exists for us to write to...
						keyPath.set(object,[...path,key],value)//...then write to it
						//(WARNING: this might burst into flames if there's some Object.freeze
						//	shenanigans going on in any of the objects etc)
					}
				}
			}
			return new Proxy(Object.create(null),handler)
		}
		return helper(objects)
	},
	binder(object,thisArg)
	{
		//WARNING: I DONT KNOW IF THIS WORKS PROPERLY I HAVEN'T TESTED IT VERY MUCH
		//PLEASE TEST THIS FUNCTION BEFORE USING IT IN OTHER CODE
		//Will bind any functions found in any level of the object to the target when called through the binder
		//For example, binder(object,target).something.somethingElse.f() is the same as object.something.somethingElse.f.bind(target)()
		//Originally used to prevent errors when accessing functions through an iframe, which would see the wrong
		//	reference to 'window' because 'window' was implicitly referenced from 'this' which was implicit
		//I'm not really sure why these broke yet tbh...but this function should hopefully fix those errors.
		console.assert(arguments.length===2,'Wrong number of arguments')
		const handler={
			get(target,key)
			{
				return gloves.binder(target[key],thisArg)
			},
			apply:function(target,_,argumentsList)
			{
				return target.apply(thisArg,thisArg,argumentsList)
			}
		}
		try
		{
			return new Proxy(object,handler)
		}
		catch
		{
			//THIS SECTION IS INCOMPLETE BECACUSE RIGHT NOW ITS GOOD ENOUGH FOR MY CURRENT PURPOSES
			//But when calling function.length, for example, we'd like to be able to get a proxy that bind things too...
			//(right now it doesnt do that)
			return object//Can't make proxies from 1,2,3 etc
		}
	},
})