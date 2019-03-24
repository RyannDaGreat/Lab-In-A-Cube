const deltas={//Idk if it's safe to call this deltas...
	copied(d)
	{
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
		//Apply _targetDelta 'd' to object 'o' and make d the receipt.
		//Mutates both o and d and returns nothing.
		console.assert(Object.getPrototypeOf(d)===Object.prototype)//All deltas are object trees
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
				else if(Object.getPrototypeOf(val) === Object.prototype)
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
	blended(x,y,alpha,threshold=0)
	{
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
	soak(o,d)
	{
		//This just mutates 'd', in the same way a normal deltas.apply would.
		//Returns nothing, just like deltas.apply.
		//In other words, the only difference between deltas.soak and deltas.apply is that deltas.soak doesn't mutate 'o'.
		deltas.apply(o,d,(o,d)=>[o,o])
	},
	pourDelta(o,d)
	{
		//Opposite of deltas.soak
		//This just mutates 'o', in the same way a normal deltas.apply would.
		//Returns nothing, just like deltas.apply.
		//In other words, the only difference between pourDelta and deltas.apply is that pourDelta doesn't mutate 'd'.
		deltas.apply(o,d,(o,d)=>[d,d])
	}
}