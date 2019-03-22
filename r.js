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
const assert={
	rightArgumentLength(arguments)
	{
		try
		{
			const actualNumberOfArguments=arguments.length
			const minimumNumberOfArguments=arguments.callee.length
			console.assert(actualNumberOfArguments>=minimumNumberOfArguments,'Wrong number of arguments in function '+JSON.stringify(arguments.callee.name)+' (got '+actualNumberOfArguments+' but was expecting at least '+minimumNumberOfArguments+' arguments)')
		}
		catch
		{
			console.warn("Failed to use rightArgumentLength. Probably because chrome is being a beastly piece of garbage and turning on strict mode without my consent afaik.")
		}
	},
	isPrototypeOf(variable,type)
	{
		//This function REALLY NEEDS to be renamed...
		assert.rightArgumentLength(arguments)
		console.assert(variable!==undefined,'assertDefinedType: variable is undefined, and therefore does not have a prototype')
		console.assert(variable!==null     ,'assertDefinedType: variable is null, and therefore does not have a prototype'     )
		if(type!=undefined)
			console.assert(Object.getPrototypeOf(variable)==type.prototype,'assertDefinedType: variable has wrong prototype')
	},
	defined(variable)
	{
		assert.rightArgumentLength(arguments)
		console.assert(variable!==undefined,'Caught undefined variable!')
	},

	isPureObject(variable)
	{
		assert.rightArgumentLength(arguments)
		assert.isPrototypeOf(variable,Object)
	},
	arePureObjects(...variables)
	{
		assert.rightArgumentLength(arguments)
		assert.isPrototypeOf(variable,Object)
		for(variable of variables)
			assert.isPureObject(variable)
	},
	isPureArray(variable)
	{
		assert.rightArgumentLength(arguments)
	},
	arePureArrays(...variables)
	{
		assert.rightArgumentLength(arguments)
		for(variable of variables)
			assert.isPureArray(variable)
	},
}

const proxies={
	filterEnumerables(object,filter)
	{
		//There will either be less or equal number of enumerables on the result
		console.assert(Object.getPrototypeOf(object)===Object.prototype)
		const handler={
			ownKeys(target)
			{
				return Object.keys(target).filter(filter)
			}
		}
		return new Proxy(object,handler)
	},
	whitelistEnumerables(object,...whitelist)
	{
		const set=new Set(whitelist)
		return filterEnumerables(object,Set.prototype.has.bind(set))
	},
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
function blend(x,y,alpha)
{
	return (1-alpha)*x+alpha*y
}
function gtoc()
{
	//Return _remainintTime in seconds since 1970
	return new Date().getTime()/1000
}
