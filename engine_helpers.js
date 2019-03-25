//This is where I'll dump helper functions that I still need but don't want to see while working on the engine
function getArrayOfDeltaIDsFromString(deltaIdsSeparatedBySpaces)
{
	console.assert(arguments.length==1,'Wrong number of arguments.')
	assert.isPrototypeOf(deltaIdsSeparatedBySpaces,String)
	console.assert(!deltaIdsSeparatedBySpaces.includes('\t'),'deltaRawCompositionFromIdsString error: Dont feed tabs into deltaRawCompositionFromIdsString! Your string: '+repr(deltaIdsSeparatedBySpaces))
	console.assert(!deltaIdsSeparatedBySpaces.includes('\n'),'deltaRawCompositionFromIdsString error: Dont feed more than one line into deltaRawCompositionFromIdsString! Your string: '+repr(deltaIdsSeparatedBySpaces))
	//
	const deltaIds=deltaIdsSeparatedBySpaces.trim().split(/\ +/)//We split by spaces, because there is a rule that no deltaID can contain spaces (because no djson keys can contain whitespace). We forget the 'edge case' where we have a deltaID that is an empty string, because that's not allowed either (which is why we use .trim() and split by any number of spaces at a time, AKA /\ +/ instead of just /\ /)
	assert.isPureArray(deltaIds)
	return deltaIds
}

function deltaRawCompositionFromIdsString(deltaIdsSeparatedBySpaces)
{
	console.assert(arguments.length==1,'Wrong number of arguments.')
	//Takes a space-separated string of deltaID's and returns the composition of all of those deltas as a delta object
	const deltaIds=getArrayOfDeltaIDsFromString(deltaIdsSeparatedBySpaces)
	assert.isPureArray(deltaIds)
	const out={}
	for(const deltaID of deltaIds)
	{
		console.assert(deltaID in config.deltas,'deltaRawCompositionFromIdsString error: '+repr(deltaID)+' is not a real delta!\ndeltaIdsSeparatedBySpaces = '+repr(deltaIdsSeparatedBySpaces))
		deltas.pour(out,getRawDeltaFromConfigByID(deltaID))
	}
	return out
}

function print_current_state()
{
	console.assert(arguments.length===0,'Wrong number of arguments.')
	console.log(djson.stringify(tween.delta))
}


function deltaExistsInConfig(deltaID)
{
	console.assert(arguments.length==1,'Wrong number of arguments.')
	return deltaID in config.deltas
}

function getRawDeltaFromConfigByID(deltaID)
{
	//Simply read a delta from the config and return a copy (in-case we mutate it later). This intermediate function exists to help throw useful errors.
	//This function should be cached...but right now I'm not caching it because the config might be reloaded dynamically, and I don't want to add hooks to that method to clear this cache.
	console.assert(arguments.length==1,'Wrong number of arguments.')
	assert.isPureObject(config.deltas)//config.deltas must exist
	if(deltaExistsInConfig(deltaID))
	{
		console.assert(typeof config.deltas[deltaID] === 'object','getDeltaByID error: '+'typeof config.deltas['+deltaID+'] === '+typeof config.deltas[deltaID]+'\n(All entries in config.deltas should be objects! Not numbers, not strings, etc. Check the djson and make sure no spaces are attached to delta '+deltaID)
		return (config.deltas[deltaID])//The copy might or might not be nessecary, but it's safer in case we mutate it later. This function isn't meant for setting these parameters. That should only be done with applyDelta or loading the config file.
	}
	else
	{
		console.error('getDeltaByID error: deltaID='+repr(deltaID)+' is not the name of a delta!\nMore Info: Object.keys(config.deltas).join(\' \')) = '+repr(Object.keys(config.deltas).join(' '))+'\nThe show MUST go on, so this function will just return an empty delta (aka {})...please fix this! (Probably with a change to the config)')
		return {}
	}
}


function getDeltaInheritanceChainString(rootDeltaID)
{
	//Returns a space-separated string
	//This function has been tested (not for edge cases yet though) seems to work perfectly (got it on the first try) 
	//TODO: This function is needed to handle circular delta inheritance. 
	//This function should DEFINITELY be cached...but right now it's NOT. In fact, even the result of this chain should be cached...getDeltaByID should be cached. But that's premature optimization for now...

	const deltaContainedInState_Cache={}//NOT SURE WHAT TO DO WITH THIS YET BUT I HAVE TO GO TO CLASS...WE WANT RECURSIVE CONDITIONS....
	console.assert(arguments.length==1,'Wrong number of arguments.')
	const out=[]
	function helper(deltaID)
	{
		if(out.includes(deltaID))
			return//No duplicates!
		if(deltaExistsInConfig(deltaID))
		{
			out.unshift(deltaID)//Put it at the beginning; which is the place of least-priority
			const delta=getRawDeltaFromConfigByID(deltaID)
			if(delta.inherit!=undefined)
			{
				console.assert(typeof delta.inherit==='string','getDeltaInheritanceChainString helper error: '+repr(deltaID)+' inheritance cannot be of type object, it must be a space-separated string of deltaIDs')
				for(inheritedDeltaID of getArrayOfDeltaIDsFromString(delta.inherit).reverse())
					helper(inheritedDeltaID)
			}
		}
		else
			console.error('getDeltaInheritanceChainString error: '+repr(deltaID)+' is not a valid delta, skipping it...')
	}
	helper(rootDeltaID)
	return out.join(' ')
}