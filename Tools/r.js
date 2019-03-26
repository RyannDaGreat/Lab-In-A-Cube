//All generalizable functions that don't really fit anywhere else, but that I'd like to reuse for other projects in the future...
function weAreInAnIframe()
{
	 return window.location !== window.parent.location 
}
function getRequest(url,callback=console.log)
{
	var Http = new XMLHttpRequest()
	Http.open("GET", url)
	Http.send()
	Http.onreadystatechange=(e)=>
	{
		console.assert(Http.status===200,"r.js getRequest error: code "+Http.status+" (should be 200) on url "+repr(url))
		callback(Http.responseText)
	}
}
function print(x)
{
	console.log(x)//What can I say? I really miss python...console.log is ugly.
}
function repr(x)
{
	return JSON.stringify(x)
}
function sortKeys(object)
{
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
function is_object(x)
{
	assert.rightArgumentLength(arguments)
	return Boolean(x&&Object.getPrototypeOf(x)===Object.prototype)
}
function are_objects(...variables)
{
	for(const variable of variables)
		if(!is_object(variable))
			return false
	return true
}
function bad_sleep(seconds)
{
	//Burn CPU for seconds
	const e=new Date().getTime()+(seconds*1000)
	while (new Date().getTime() <= e);
}
function random_chance(probability)
{
	return Math.random()<probability
}
function all_chars_are_unique(string)
{
	return string.length==number_of_unique_chars(string)
}
function number_of_unique_chars(string)
{
	return new Set(string.split('')).size
}
function random_integer(max)
{
	return Math.floor(Math.random()*(max+1))
}
function random_index(list)
{
	return random_integer(list.length-1)
}
function random_element(list)
{
	return list[random_index(list)]
}
function charInString(char,string)
{
	set=new Set()
	for(const char of string)
		set.push(char)
	return set.has(char)
}
function currentFunctionName() 
{
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
	//Examples:
	//	'larry' --> 'lary'
	//  'abcda' --> 'abcd'
	//  'babcc' --> 'bac'
	return [...new Set(string)].join('')
}
function removeNonAlphabeticCharacters(string)
{
	return string.replace(/[^a-zA-Z]/g, "")
}
function withoutKey(object,key)
{
	out={...object}
	delete out[key]
	return out
}
function split_on_first_space(string)
{
	return string.split(/ (.*)/,2)
}
function remove_empty_lines(string)
{
	return split_lines(string).filter(x=>x.trim()).join('\n')
}
function nested_path(path,value)
{
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
	let out=''
	while(number--)
		out+=string
	return out
}
function is_defined(x)
{
	return x!==undefined
}
function is_object(x)
{
	return Boolean(x&&Object.getPrototypeOf(x)===Object.prototype)
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
	//Clamp x between a and b (doesn't matter if a>b or b<a)
	if(x<Math.min(a,b))
		return Math.min(a,b)
	if(x>Math.max(a,b))
		return Math.max(a,b)
	return x
}
function smoothAlpha(x)
{
	return (3*x-x*x*x)/2//https://www.desmos.com/calculator/pfaw67cutk
}
function blend(x,y,alpha,clamped=false)
{
	//If clamp is turned on, then we restrict alpha to reasonable values (between 0 and 1 inclusively)
	if(clamped)
		alpha=clamp(alpha,0,1)
	return (1-alpha)*x+alpha*y
}
function gtoc()
{
	//Return _remainintTime in seconds since 1970
	return new Date().getTime()/1000
}