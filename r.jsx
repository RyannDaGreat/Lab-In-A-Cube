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
	rightArgumentLength(arguments,expectedNumberOfArguments=undefined)
	{
		if(expectedNumberOfArguments===undefined)
			expectedNumberOfArguments=arguments.callee.length
		const actualNumberOfArguments=arguments.length
		console.assert(actualNumberOfArguments===expectedNumberOfArguments,'Wrong number of arguments in function '+JSON.stringify(arguments.callee.name)+' (got '+actualNumberOfArguments+' but was expecting '+expectedNumberOfArguments+')')
	},
	isPrototypeOf(variable,type)
	{
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
