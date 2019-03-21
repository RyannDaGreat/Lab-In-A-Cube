function copiedDelta(d)
{
	//Copies an object tree
	if(!d||Object.getPrototypeOf(d)!==Object.prototype)
		return d
	const out={}
	for(const [key,val] of Object.entries(d))
		out[key]=copiedDelta(val)
	return out
}

function applyDelta(o,d,f=(o,d)=>[d,o])
{
	//Apply _targetDelta 'd' to object 'o' and make d the receipt.
	//Mutates both o and d and returns nothing.
	console.assert(Object.getPrototypeOf(d)===Object.prototype)//All deltas are object trees
	if(o===undefined)
		return
	for(const [key,val] of Object.entries(d))
	{
		if(key in o)
		{
			if(val === undefined)
			{
				d[key]=o[key]//For our receipt...
				delete o[key]
			}
			else if(Object.getPrototypeOf(val) === Object.prototype)
			{
				applyDelta(o[key],val,f)
			}
			else
			{
				[o[key],d[key]] = f(o[key],val)//Added this function to enable things like blending etc
			}
		}
		else if(val!==undefined)
		{
			o[key] = val
			d[key] = undefined
		}
	}
}


function blendedDeltas(x,y,alpha)
{
	//Pure function: no mutations
	//EXAMPLE:
	// let a={a:0,b:{c:1,d:2},W:false}
	// let b={a:1,b:{c:2,d:3},W:true}
	// blendedDeltas(a,b,.2) ===== {a:0.2,b:{c:1.2000000000000002,d:2.2},W:true}
	x=copiedDelta(x)
	function blended(o,d)
	{
		if(Object.getPrototypeOf(o)===Number.prototype&&
			Object.getPrototypeOf(d)===Number.prototype  )
			return [blend(o,d,alpha),d]
		return [d,d]
	}
	applyDelta(x,y,blended)
	return x
}

function soakDelta(o,d)
{
	//This just mutates 'd', in the same way a normal applyDelta would.
	//Returns nothing, just like applyDelta.
	//In other words, the only difference between soakDelta and applyDelta is that soakDelta doesn't mutate 'o'.
	applyDelta(o,d,(o,d)=>[o,o])
}
function pourDelta(o,d)
{
	//Opposite of soakDelta
	//This just mutates 'o', in the same way a normal applyDelta would.
	//Returns nothing, just like applyDelta.
	//In other words, the only difference between pourDelta and applyDelta is that pourDelta doesn't mutate 'd'.
	applyDelta(o,d,(o,d)=>[d,d])
}
