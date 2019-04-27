function unique(array,fromRight=false)
{
	if(fromRight)
		array=[...array].reverse()
	const seen = {}
	const out  = array.filter(item=>seen.hasOwnProperty(item) ? false : (seen[item] = true))
	if(fromRight)
		out.reverse()
	return out
}




function uniqueFromRight(array)
{
	//Example: uniqueFromRight([1,2,1,3,3,2,1,2,3,1])
	//Output:  [2, 3, 1]
	const seen={}
	const out=[]
	let i=0
	for(const element of array)
	{
		if(element in seen)
			delete out[seen[element]]
		out.push(element)
		seen[element]=i++
	}
	return out.filter(Boolean)
}