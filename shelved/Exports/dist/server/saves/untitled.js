async function saveConfigToServer()
{
	console.assert(arguments.length===0,'Wrong number of arguments')
	const toSave=getConfigStringFromLocalStorage()
	//Returns a URL used to get back to the saved file
	const savedUrl=await doFetch('',toSave)
	if(typeof savedURL==='number')//Probably returned 404
	{
		alert('Save FAILED! Error status: '+savedURL)
	}
	else
	{
		alert('Save SUCCEEDED!\nBelow is the link:\n'+savedURL)
	}
}
async function loadConfigFromServer(savedUrl)
{
	console.assert(arguments.length===1,'Wrong number of arguments')
	const savedConfig=await doFetch(savedURL)
	if(typeof savedURL==='number')//Probably returned 404
	{
		alert('Load FAILED! Error status: '+savedURL)
	}
	else
	{
		alert('Load SUCCEEDED!\nBelow is the link:\n'+savedURL+'\n\nPlease refresh this page to see the changes')
	}

}