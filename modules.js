let modules={
	get boxItem(){return modules.mesh},//This is legacy from a few tests we did when I first put the engine together. If you don't need it you can delete it in the future.
	mesh(ID)
	{
		const materials ={
			basic:new THREE.MeshBasicMaterial({color: 0xfffff, wireframe: true }),//color.r/g/b, wireframe,
			phong:new THREE.MeshPhongMaterial(),//color.r/g/b
			standard:new THREE.MeshStandardMaterial(),
		}
		let geometry='box'
		let material='basic'
		let texture='default'
		let parent='scene'
		let mesh=new THREE.Mesh(geometries[geometry], materials[material])
		scene.add(mesh)
		const item= {
			//NEW STYLE: Should only be able to get directories; not values. It's Unidirectional now. 
			//Convention: The name of the function is the name of the threeObject, which is always put in item (for some hackability-->faster dev time but more messy)
			get ID(){return ID},
			transform:attributes.transform(mesh),
			get material(){return{
				get mode(){return material},
				set mode(mode){material=mode;mesh.material=materials[mode]},
				modes:materials,
			}},
			get texture(){return texture},
			set texture(value){texture=value;mesh.material.map=textures[texture]||textures.default},
			get geometry(){return geometry},
			set geometry(value)
			{
				if(value in geometries)
					mesh.geometry=geometries[geometry=value]
				else
					console.error('ERROR setting geometry: '+JSON.stringify(value)+' is not in geometries. ')
			},
			get threeObject()
			{
				return mesh
			},
			set parent(itemID)
			{
				mesh.parent=items[itemID].threeObject//MAKE SOME ASSERTIONS HERE
				parent=itemID
			},
			get parent()
			{
				return parent
			}
		}
		mesh.userData.item=item//This is to let click events access this item's ID, which have to originate in the threeObject
		return item
	},
	get lightItem(){return modules.light},//This is legacy from a few tests we did when I first put the engine together. If you don't need it you can delete it in the future.
	light(ID)
	{
		const light = new THREE.PointLight(0xffffff,1,100)
		scene.add(light)
		const item= {
			ID:ID,
			threeObject:light,
			position:attributes.position(light),
			get intensity(){return light.intensity;},
			set intensity(value){light.intensity=value},
		}
		light.userData.item=item
		return item
	},
	simpleBeaker(ID)
	{
		// return modules.mesh(ID)
		const simpleBeaker=modules.mesh(ID)
		const fluidItem =modules.mesh('Anonymous')//This item won't show up in the items list, and should have an anonymous ID (null)
		if(!geometries.simpleBeakerBeaker)
			// load_geometry('simpleBeakerBeaker','./Assets/Models/SimpleBeaker/Beaker.obj')
		// if(!geometries.simpleBeakerFluid)
			// load_geometry('simpleBeakerFluid','./Assets/Models/SimpleBeaker/Beaker.obj')
		// geometries.simpleBeakerBeaker='./Assets/Models/SimpleBeaker/Beaker.obj'
		// geometries.simpleBeakerFluid ='./Assets/Models/SimpleBeaker/Fluid.obj'
		simpleBeaker.fluid=fluidItem
		simpleBeaker.geometry='simpleBeakerBeaker'
		fluidItem .geometry='simpleBeakerFluid'
		fluidItem .threeObject.parent=simpleBeaker.threeObject
		// simpleBeaker.materials.basic.color.r=1
		return simpleBeaker
	},
	sprite(ID)
	{
		// function for drawing rounded rectangles
		function roundRect(context, x, y, w, h, r) 
		{
			context.beginPath();
			context.moveTo(x+r, y);
			context.lineTo(x+w-r, y);
			context.quadraticCurveTo(x+w, y, x+w, y+r);
			context.lineTo(x+w, y+h-r);
			context.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
			context.lineTo(x+r, y+h);
			context.quadraticCurveTo(x, y+h, x, y+h-r);
			context.lineTo(x, y+r);
			context.quadraticCurveTo(x, y, x+r, y);
			context.closePath();
			context.fill();
			context.stroke();   
		}
		var spriteMaterial
		var texture
		function makeTextSprite( message, parameters )
		{
			//From https://stackoverflow.com/questions/23514274/three-js-2d-text-sprite-labels
			if ( parameters === undefined ) parameters = {}
			var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial"
			var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 40 
			var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4
			var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 }
			var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 }
			var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 }

			var canvas = document.createElement('canvas')
			// canvas.height=1000
			// canvas.width=1000
			var context = canvas.getContext('2d')
			context.font = "Bold " + fontsize + "px " + fontface
			var metrics = context.measureText( message )
			var textWidth = metrics.width
			context.fillStyle = "red";
			context.fill();
			context.rect(-2220, -2220, 11150, 11100);

			// context.translate(250,50);
			context.scale(3,1);
			// mirrorImage(context)

			context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")"
			context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")"

			context.lineWidth = borderThickness
			roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8)

			context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)"
			context.fillText( message, borderThickness, fontsize + borderThickness)

			texture = new THREE.Texture(canvas) 
			texture.needsUpdate = true

			spriteMaterial = new THREE.SpriteMaterial( {
				depthTest:false,//X RAY: set to false to go through objects
				 map: texture, useScreenCoordinates: false  } )
			var sprite = new THREE.Sprite( spriteMaterial )
			sprite.scale.set(0.5/10 * fontsize, -0.25/10 * fontsize, -0.75/10 * fontsize)
			return sprite
		}
		let sprite=makeTextSprite('HEllo')
		scene.add(sprite)
		const item={
			ID:ID,
			threeObject:sprite,
			transform:attributes.transform(sprite),
			get xray()
			{
				return !spriteMaterial.depthTest
			},
			set xray(x)
			{
				spriteMaterial.depthTest=!x
			},
			get text()
			{

			}

		}
		sprite.userData.item=item
		return item
	},
}
modules=proxies.argumentCountChecker(modules)
modules=proxies.tryGetter(modules,()=>modules.mesh)