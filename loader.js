//This code is responsible for loading all the assets etc
function load_geometry(name,url)
{
	var object
	function loadModel()
	{
		try
		{
			geometries[name]=object.children[0].geometry
			requestRender()
		}
		catch
		{
			console.error("load_geometry error: failed to load "+JSON.stringify(url))
		}
	}
	function callback( obj )
	{
		object = obj//Maybe eliminate maybe not....I think loadingmanager might come in handy....when we want to load all the textures etc
	}
	var loader = new THREE.OBJLoader(new THREE.LoadingManager(loadModel)).load(url, callback, ()=>{}, ()=>{})
}

function load_texture(name,url)
{
	var texture = new THREE.TextureLoader().load(url,requestRender);//This callback calls requestRender so that we can see the newly loaded texture when it loads
	textures[name]=texture
}