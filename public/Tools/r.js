e//All generalizable functions that don't really fit anywhere else, but that I'd like to reuse for other projects in the future...
function weAreInAnIframe()
{
	console.assert(arguments.length===0,'Wrong number of arguments.')
	 return window.location !== window.parent.location
}
function playSound(url)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	new Audio(url).play()
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
function getRequest(url,callback=console.log)
{
	console.assert(arguments.length===2,'Wrong number of arguments.')
	// Example usage: getRequest(url,response=>{console.log(response)})
	var Http = new XMLHttpRequest()
	Http.open("GET", url)
	Http.send()
	Http.onreadystatechange=()=>
	{
		console.assert(Http.status===200,"r.js getRequest error: code "+Http.status+" (should be 200) on url "+repr(url))
		callback(Http.responseText)
	}
}
function print(x)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	console.log(x)//What can I say? I really miss python...console.log is ugly.
}
function repr(x)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	return JSON.stringify(x)
}
function sortKeys(object)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
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
function bad_sleep(seconds)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	//Burn CPU for seconds
	const e=new Date().getTime()+(seconds*1000)
	while(new Date().getTime() <= e);
}
function random_chance(probability)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	return Math.random()<probability
}
function all_chars_are_unique(string)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	return string.length===number_of_unique_chars(string)
}
function number_of_unique_chars(string)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	return new Set(string.split('')).size
}
function random_integer(max)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	return Math.floor(Math.random()*(max+1))
}
function random_index(list)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	return random_integer(list.length-1)
}
function random_element(list)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	return list[random_index(list)]
}
function charInString(char,string)
{
	console.assert(arguments.length===2,'Wrong number of arguments.')
	set=new Set()
	for(const char of string)
		set.push(char)
	return set.has(char)
}
function currentFunctionName() 
{
	//Returns the name of the function that calls this
	try
	{
		throw new Error()
	}
	catch(e)
	{
		try
		{
			return e.stack.split('at ')[3].split(' ')[0]
		}
		catch(e)
		{
			return ''
		}
	}
}
function removeDuplicateCharacters(string)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	//Examples:
	//	'larry' --> 'lary'
	//  'abcda' --> 'abcd'
	//  'babcc' --> 'bac'
	return [...new Set(string)].join('')//Relies on the order of 'set' (the way chrome's v8 engine does things)
}
function removeNonAlphabeticCharacters(string)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	return string.replace(/[^a-zA-Z]/g, "")
}
function withoutKey(object,key)
{
	console.assert(arguments.length===2,'Wrong number of arguments.')
	out={...object}
	delete out[key]
	return out
}
function split_on_first_space(string)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	return string.split(/ (.*)/,2)
}
function remove_empty_lines(string)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	return split_lines(string).filter(x=>x.trim()).join('\n')
}
function nested_path(path,value)
{
	console.assert(arguments.length===2,'Wrong number of arguments.')
	//EXAMPLE: nested_path([4,3,2,1],0) ==== {4:{3:{2:{1:0}}}}
	//EXAMPLE: nested_path([],)
	console.assert(path&&Object.getPrototypeOf(path)===Array.prototype,'Path must be a list of keys')
	let out=value
	for(key of [...path].reverse())
		out={[key]:out}
	return out
}
function multiply_string(string,number)
{
	console.assert(arguments.length===2,'Wrong number of arguments.')
	//Like python ("abc"*3=="abcabcabc")
	let out=''
	while(number--)
		out+=string
	return out
}
function is_defined(x)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	return x!==undefined
}
function is_prototype_of(x,type)
{
	//This is like type-checking with 'typeof', or 'instanceof', except that this way of checking is much more precise.
	console.assert(arguments.length===2,'Wrong number of arguments.')
	assert.defined(type)
	return Boolean(x&&Object.getPrototypeOf(x)===type.prototype)
}
function is_object(x)
{
	//Returns true IFF x is a pure object, meaning it could have been created with an object literal (no funky prototype chains)
	//For example, is_object(any delta) is always true (because all deltas should be able to exist from object literals)
	console.assert(arguments.length===1,'Wrong number of arguments.')
	return is_prototype_of(x,Object)
}
function is_function(x)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	return is_prototype_of(x,Function)
}
function is_array(x)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	return is_prototype_of(x,Array)
}
function is_string(x)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	return is_prototype_of(x,String)
}
function is_number(x)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	return is_prototype_of(x,Number)
}
function are_objects(...variables)
{
	for(const variable of variables)
		if(!is_object(variable))
			return false
	return true
}
function numbered_lines_string(string,numberToPrefix=i=>i+'\t')
{
	console.assert(arguments.length>=1,'Wrong number of arguments.')
	//This function is meant for printing out code, with line-numbers on the far left.
	//EXAMPLE:
	//	CODE:
	//		console.log(numbered_lines_string('line one\nline two\nline three'))
	//	OUTPUT:
	//		1	line one
	//		2	line two
	//		3	line three
	//Note: This function follows the typical text-editor convention that line-numbers start at 1, not 0
	//	(Think of it this way, when's the last time you ever saw a syntax error at line 0? Never...)
	console.assert(typeof string==='string')
	return Object.entries(string.split('\n')).map((([i,e])=>numberToPrefix(Number(i)+1)+e)).join('\n')
}
function singleton(get)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	//Makes a singleton out of a simple ()=>value getter function
	let singleton
	return function()
	{
		if(singleton===undefined)
			singleton=get()
		return singleton
	}
}
function get_indent_level(line,key={'\t':4})
{
	console.assert(arguments.length>=1,'Wrong number of arguments.')
	assert.isString(line)
	//Another possible key: {'\t':4,' ':1} (converts 1 tab = 4 spaces)
	let out=0
	for(const char of line)
		if(char in key)
			out+=key[char]
		else
			break
	return out
}
function clamp(x,a,b)
{
	console.assert(arguments.length===3,'Wrong number of arguments.')
	//Clamp x between a and b (doesn't matter if a>b or b<a)
	if(x<Math.min(a,b))
		return Math.min(a,b)
	if(x>Math.max(a,b))
		return Math.max(a,b)
	return x
}
function smoothAlpha(x)
{
	//For smooth blending (as opposed to linear, jerky animations)
	console.assert(arguments.length===1,'Wrong number of arguments.')
	return (3*x-x*x*x)/2//https://www.desmos.com/calculator/pfaw67cutk
}
function blend(x,y,alpha,clamped=false)
{
	console.assert(arguments.length>=3,'Wrong number of arguments.')
	//If clamp is turned on, then we restrict alpha to reasonable values (between 0 and 1 inclusively)
	if(clamped)
		alpha=clamp(alpha,0,1)
	return (1-alpha)*x+alpha*y
}
function gtoc()
{
	//Return _remainintTime in seconds since 1970
	console.assert(arguments.length===0,'Wrong number of arguments.')
	return new Date().getTime()/1000
}
function stringIsNumerical(string)
{
	console.assert(arguments.length===1,'Wrong number of arguments.')
	console.assert(typeof string==='string')
	//EXAMPLES:
	//	stringIsNumerical('')   false
	//	stringIsNumerical(' ')   false
	//	stringIsNumerical('Infinity')   false
	//	stringIsNumerical('NaN')   false
	//	stringIsNumerical('0')   true
	//	stringIsNumerical(' . 2   ')   false
	//	stringIsNumerical(' . 2   ')   false
	//	stringIsNumerical(' +.2   ')   true
	//	stringIsNumerical(' -.2   ')   true
	//	stringIsNumerical('+-.2   ')   false
	//	stringIsNumerical('123   ')   true
	//	stringIsNumerical('1.23   ')   true
	//	stringIsNumerical('1.2.3   ')   false
	if(!string.trim())return false//Number('')===Number(' ')===0
	const number=Number(string)
	return JSON.parse(JSON.stringify(number))===number
}
function parsedSimpleMathFromString(string)
{
	//Supports ONLY +,-,* and NOT parenthesis etc
	//Can parse strings like '23 +3 - 234'
	//Returns a number or returns undefined upon error
	console.assert(arguments.length===1,'Wrong number of arguments.')
	console.assert(typeof string==='string')
	//EXAMPLES:
	//	parsedSimpleMathFromString('  0-01*88') === -88
	//	parsedSimpleMathFromString('  0-01')    === -1
	//	parsedSimpleMathFromString('  0+0')     === 0
	//	parsedSimpleMathFromString(' ')     === undefined
	//	parsedSimpleMathFromString(' 0')     === 0
	//	parsedSimpleMathFromString(' 0.')     === 0
	//	parsedSimpleMathFromString(' .2')     === 0.2
	//	parsedSimpleMathFromString(' .2-.1')     === 0.1
	let sum=0
	if(string.trim()[0]==='-')//Handle the edge case where the expression begins with a '-' sign
		string='0'+string
	string=string.replace(/\-/,'+-1*')//Replace all subtraction/negation signs with multiplication by -1
	for(const chunk of string.split('+'))
	{
		let product=1
		for(let factor of chunk.split('*'))
		{
			if(!stringIsNumerical(factor))
			{
				return undefined
			}
			else
			{
				product*=Number(factor)
			}
		}
		sum+=product
	}
	if(!stringIsNumerical(''+sum))//If we have 'NaN' or 'Infinity' etc, don't return a number.
		return undefined
	return sum
}
function closestPowerOfTwo(n)
{
	//Round neither up nor down, but instead gets the closest
	//From: https://bocoup.com/blog/find-the-closest-power-of-2-with-javascript
	return Math.pow( 2, Math.round( Math.log( n ) / Math.log( 2 ) ) ); 
}
function equalsShallow(a,b)
{
	//By default, this is a SHALLOW equality check
	//(This avoids possible infinite loops) (it is possible, with memoization, to create a deep equality checker that can handle such infinite loops. I'll make that another day.)
	if(a===b||!a||!b||typeof a!=='object'||typeof b!=='object')return a===b
	for(const [i,e] of Object.entries(a))if(e!==b[i])   return false
	for(const [i,e] of Object.entries(b))if(e!==a[i])   return false
	return true
}
function containsValueShallow(o,x,equal=equalsShallow)
{
	for(const value of o)
		if(equalsShallow(x,value))
			return true
	return false
}
function dictProduct(dicts)
{
	console.log("DCIIC",dicts)
	console.log("DCIIC",{...dicts})
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
	//	3	1	3	3
	//	3	2	3	3
	//	3	2	2	3
	//
	//This function is part of the secret sauce behind djson's macros
	//
	//To calculate this I use a depth-first search with memoization. The equality functions are bad because I dont want to make hashing algorithms for dicts in JS.
	const seen=[]
	function isSeen(dict)
	{
		if(!containsValueShallow(seen,dict))
		{
			seen.push(dict)
			return false
		}
		return true
	}
	function helper(dict)
	{
		if(isSeen(dict))
		{
			return
		}
		for(const key in dicts)
		{
			helper({...dict,...dicts[key]})
		}
	}
	helper({})
	let maxLength=0
	for(const dict of seen)
	{
		const length=Object.keys(dict).length
		if(length>maxLength)
		{
			maxLength=length
		}
	}
	const out=[]
	for(const dict of seen)
	{
		if(Object.keys(dict).length===maxLength)
		{
			out.push(dict)
		}
	}
	return out
}