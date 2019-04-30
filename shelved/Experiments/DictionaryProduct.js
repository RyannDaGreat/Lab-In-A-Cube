function dictProduct(dicts)
{
	//Takes a set of (dicts of variable length) and returns a set of (dicts of uniform length)
	//Equivalent to returning every permutation of delta-concatenations of these dicts (which has >n! complexity)
	//(Result will be that every dict has same length)
	//EXAMPLE:
	//	(Product of three dicts where keys are indices)
	//	dictProduct([{0:1,1:1,2:1,3:1},{1:2,2:2},{0:3,2:3,3:3}])
	//
	//	1	1	1	1
	//	?	2	2	?
	//	3	?	3	3
	//
	//		  |
	//		  V
	//
	//	1	1	1	1
	//	1	2	2	1
	//	3	2	2	3
	//	1	2	2	3
	//	3	2	2	1
	//	3	3	1	3
	//	3	3	2	3
	//
	//	BECAUSE
	//
	//	1	1	1	1
	//	1,3	2	2	1,3
	//	3	1,2	3	3
	//
	//	Then take all possibilities
	//
	//This function is part of the secret sauce behind djson's macros
	//
	const dump=invertedDictDump(dicts)//For every possible key, returns a set of all possible values
	const out=new Set
	for(const dict of dicts)
	{
		const pouringProductKeys=[]
		for(const key in dump)
		{
			console.log("KEY CHECK ",key,dict,key in dict)

			if(!(key in dict))
			{
				console.log("PUSHED KEY ",key,dict)
				pouringProductKeys.push(key)
			}
		}
		console.log(dict,pouringProductKeys,dump)
		if(!pouringProductKeys.length)
		{
			if(Object.keys(dump).length!==Object.keys(dict).length)
				alert("WTF")
			out.add(dict)
		}
		else
			for(const pouringProduct of cartesianProduct(pouringProductKeys.map(key=>dump[key])))
			{
				console.log(pouringProduct)
				out.add({...dict, ...pouringProduct})
			}
	}
	return out
}
function uniqueFromRight(array)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	//Example: uniqueFromRight([1,2,1,3,3,2,1,2,3,1])
	//Output:  [2, 3, 1]
	seen=new Set
	out=[]
	for(element of [...array].reverse())
		if(!seen.has(element))
		{
			seen.add(element)
			out.unshift(element)
		}
	return out
}

function invertedDictDump(dicts)//REALLY need a better name...idk what to call it yet lol
{
	//Takes a set of dicts, returns a dict of sets
	//invertedDictDump([{a:1,b:2},{a:0,c:4}])  --->  {a:[0,1],b:[2],c:[4]}
	const out={}
	for(const dict of dicts)
	{
		for(const [key,value] of Object.entries(dict))
		{
			if(!(key in out))
			{
				out[key]=[]
			}
			out[key].push(value)
		}
	}
	for(key in out)
	{
		out[key]=uniqueFromRight(out[key])
	}
	return out
}



function cartesianProduct(dictOfSets)
{
	//cartesianProduct({a:[1,2],b:[3,4]})  --->  [{a:1,b:3},{a:1,b:4},{a:2,b:3},{a:2,b:4}]
	//(Took code from https://stackoverflow.com/questions/18957972/cartesian-product-of-objects-in-javascript)
	const copy=function(obj)
	{
		var res={}
		for(var p in obj) res[p]=obj[p]
		return res
	}
	const cartesianProductHelper=function(input, current)
	{
		if(!input || !input.length)
			return []
		var head  =input[0]
		var tail  =input.slice(1)
		var output=[]

		for(var key in head)
		{
			for(var i=0; i<head[key].length; i++)
			{
				var newCurrent =copy(current)
				newCurrent[key]=head[key][i]
				if(tail.length)
				{
					var productOfTail=cartesianProductHelper(tail, newCurrent)
					output=output.concat(productOfTail)
				}
				else output.push(newCurrent)
			}
		}
		return output
	}
	const out=[]
	console.warn(dictOfSets)
	for(const [key,value] of Object.entries(dictOfSets))
	{
		out.push({[key]:value})
	}
	return cartesianProductHelper(out)
	// var input = [
	// 	{ 'colour' : ['red', 'green'] },
	// 	{ 'material' : ['cotton', 'wool', 'silk'] },
	// 	{ 'shape' : ['round', 'square', 'rectangle'] }
	// ];
	// console.log(cartesianProduct(input));
}