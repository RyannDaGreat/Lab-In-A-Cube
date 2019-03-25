const deltas={//Idk if it's safe to call this deltas...
	copied(d)
	{
		console.assert(arguments.length==1,'deltas.copied error: wrong number of arguments')
		//Copies an object tree
		if(!d||Object.getPrototypeOf(d)!==Object.prototype)
			return d
		const out={}
		for(const [key,val] of Object.entries(d))
			out[key]=deltas.copied(val)
		return out
	},
	apply(o,d,f=(o,d)=>[d,o],none=null)
	{
		console.assert(arguments.length>=2,'deltas.apply error: wrong number of arguments')
		//Apply _targetDelta 'd' to object 'o' and make d the receipt.
		//Mutates both o and d and returns nothing.
		assert.isPureObject(d)//All deltas are object trees
		if(o===none)
			return
		for(const [key,val] of Object.entries(d))
		{
			if(key in o)
			{
				if(val === none)
				{
					d[key]=o[key]//For our receipt...
					delete o[key]
				}
				else if(Object.getPrototypeOf(val) === Object.prototype && typeof o[key]==='object')//Explanation for "typeof o[key]==='object'" : Because if "typeof x==='object'", then "y in x" probably won't throw an error (this handles the case where we replace a primitive with an object)
				{
					deltas.apply(o[key],val,f)
				}
				else
				{
					[o[key],d[key]] = f(o[key],val)//Added this to enable things like blending etc
				}
			}
			else if(val!==none)
			{
				o[key] = val
				d[key] = none
			}
		}
	},
	contains(o,d)
	{
		//Return whether d is in o
		//This is the critical function for conditions
	},
	blended(x,y,alpha,threshold=0)
	{
		console.assert(arguments.length>=3,'deltas.blended error: wrong number of arguments')
		alpha=smoothAlpha(alpha)
		// alpha=smoothAlpha(smoothAlpha(alpha))
		//Pure function: no mutations
		//EXAMPLE:
		//	let a={a:0,b:{c:1,d:2},W:false}
		//	let b={a:1,b:{c:2,d:3},W:true}
		//	deltas.blended(a,b,.2) ===== {a:0.2,b:{c:1.2000000000000002,d:2.2},W:true}
		//Threshold controls when discrete values (such as strings and booleans; basically 
		//	anything that's not a number). When alpha>=threshold, this happens.
		x=deltas.copied(x)
		function blended(o,d)
		{
			if(Object.getPrototypeOf(o)===Number.prototype&&
				Object.getPrototypeOf(d)===Number.prototype  )
				return [blend(o,d,alpha,true),d]
			return [alpha>=1?d:o,d]
		}
		deltas.apply(x,y,blended)
		return x
	},
	composed(deltaArray)
	{
		console.assert(arguments.length==1,'deltas.composed error: wrong number of arguments')
		//Pure function: sums a list of deltas together, essentially creating the equivalent of multiple 
		//If efficiency is an issue, this function might be cached later (somehow we'd have to hash the deltas)
		assert.isPureArray(deltaArray)
		const out={}
		for(const delta of deltaArray)
			deltas.pour(out,delta)
		return out
	},
	soak(o,d)
	{
		console.assert(arguments.length==2,'deltas.soak error: wrong number of arguments')
		//This just mutates 'd', in the same way a normal deltas.apply would.
		//Returns nothing, just like deltas.apply.
		//The visualization is that we 'soak' the delta shape 'd' in the object 'o', to get a delta that would make something more like 'o'
		//when 'd' is applied to it
		//In other words, the only difference between deltas.soak and deltas.apply is that deltas.soak doesn't mutate 'o'.
		deltas.apply(o,d,(o,d)=>[o,o])
	},
	pour(o,d)
	{
		console.assert(arguments.length==2,'deltas.pour error: wrong number of arguments')
		//Opposite of deltas.soak
		//This just mutates 'o', in the same way a normal deltas.apply would.
		//Returns nothing, just like deltas.apply.
		//In other words, the only difference between pour and deltas.apply is that pour doesn't mutate 'd'.
		deltas.apply(o,d,(o,d)=>[d,d])
	}
}