//This code is responsible for loading all the assets etc
function load_geometry(name,url)
{
	var object
	function loadModel()
	{
		try
		{
			geometries[name]=object.children[0].geometry
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
	var texture = new THREE.TextureLoader().load(url );
	textures[name]=texture
}


// function load_cube_map(name,url_prefix,px,nx,py,ny,pz,nz)
// {
// 	cubeMaps[name] = new THREE.CubeTextureLoader()
// 		.setPath( url_prefix )
// 		.load( [
// 			px,
// 			nx,
// 			py,
// 			ny,
// 			pz,
// 			nz
// 		] );
// }
