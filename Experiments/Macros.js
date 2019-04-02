function containsMacro(object,key)
{
	console.warn('This function is UNTESTED! Beware!')
	//WARANING: UNUSED AND UNTESTED! I'M ONLY KEEPING THIS HERE IN-CASE I MIGHT NEED IT LATER,
	//as it would be a waste to just throw out this code. But before you use it, make sure it works!
	console.assert(arguments.length===2,'Wrong number of arguments')
	if(is_object(object))
	{
		if(key in object)
		{
			return true
		}
		else
		{
			for(value of object)
			{
				if(containsMacro(value,key))
				{
					return true
				}
			}
			return false
		}
	}
	else if(isString(object))
	{
		return object.split('~').includes(key)
	}
	else
	{
		console.error('This function should be called on pure-djson output (AKA all-strings)')
		return false
	}
}

function appliedMacros(object,macros,allMacros)
{
	console.assert(arguments.length===3,'Wrong number of arguments')
	assert.isPureObject(macros)
	assert.isPureObject(allMacros)
	let out={}
	if(is_object(object))
	{
		for(let [key,value] of Object.entries(object))
		{
			key  =appliedMacros(key,macros,allMacros)
			value=appliedMacros(value,macros,allMacros)
			console.log(key,value)
			if(typeof value==='string')
			{
				if(purgeable(value,macros,allMacros))
				{
					continue
				}
			}
			if(purgeable(key,macros,allMacros))
			{
				continue
			}
			out[key]=value
		}
		return out
	}
	else if(typeof object==='string')
	{
		return object.split('~').map(x=>x in macros&&(!is_object(macros[x]))?macros[x]:x).join('')
	}
	else
	{
		console.error('This function should be called on pure-djson output (AKA all-strings)')
		return object
	}
}


function purgeable(string,macros,allMacros)
{
	console.assert(arguments.length===2,'Wrong number of arguments')
	assert.isString(string)
	assert.isPureObject(allMacros)
	for(const chunk of string.split('~'))
	{
		if(!chunk in macros && chunk in allMacros)
		{
			return true
		}
	}
	return false
}

function purgedUnexpandedMacros(object,macros,allMacros)
{
	console.assert(arguments.length===2,'Wrong number of arguments')
	if(!is_object(object))
	{
		return object
	}
	assert.isPureObject(allMacros)
	//Delete all sections which have leftover macros in them
	let out={}
	for(let [key,value] of Object.entries(object))
	{
		if(purgeable(key,macros,allMacros))
		{
			continue
		}
		else if(typeof value==='string')
		{
			if(purgeable(value,macros,allMacros))
			{
				continue
			}
			else
			{
				out[key]=value
			}
		}
		else
		{
			// assert.isPureObject(value)
			out[key]=purgedUnexpandedMacros(value,allMacros)
		}
	}
	return out
}

function composedMacros(object,...macros)
{
	console.assert(arguments.length===2,'Wrong number of arguments')
	let out={}
	for(macros of macrosets)
	{
		pour(out,appliedMacros(object,macrso))
	}
	out=purgedUnexpandedMacros(...macros keys merge)
	return 
}