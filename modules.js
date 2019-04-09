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
			get threeObject() {return mesh },
			set parent(itemID)
			{
				mesh.parent=items[itemID].threeObject//MAKE SOME ASSERTIONS HERE
				parent=itemID
			},
			get parent() {return parent },
			set visible(x){mesh.visible=x},
			get visible(){return mesh.visible},
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
			set visible(x){light.visible=x},
			get visible( ){return light.visible},
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
		//Currently, sprites only show text. This can change later, but for now let's KISS. 
		//NOTE: ctx stands for 'canvas.context'
		// function for drawing rounded rectangles
		const canvas   = document.createElement('canvas')
		const ctx  = canvas.getContext('2d')
		const texture=new THREE.Texture(canvas,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined) 
		const spriteMaterial=new THREE.SpriteMaterial({map:texture, useScreenCoordinates: false ,depthTest:false})
		const sprite = new THREE.Sprite( spriteMaterial )
		function updateSpriteText()
		{
			let message=text
			//From https://stackoverflow.com/questions/23514274/three-js-2d-text-sprite-labels
			var fontface       = 'Quicksand'
			var fontsize       = size
			var borderThickness= 4

			let dpi=200//Higher --> better resolution
			let aspect=10//Bigger = skinnier image --> more text can fit
			let smallness=30//OPPOSITE OF Phyical sprite size
			canvas.width=aspect*dpi
			canvas.height=dpi
			var middleX= canvas.width/2
			var middleY=canvas.height/2
			// canvas.style.height=1000+'px'

			ctx.font = 'Bold ' + fontsize + 'px ' + fontface

			ctx.shadowBlur = 40;
			ctx.shadowColor = 'black';

			// ctx.fillStyle = 'white';
			// ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.translate(0,100);
			ctx.textAlign='center'
			ctx.lineWidth = borderThickness

			let scale=dpi/100
			ctx.translate(middleX,-middleY/scale);
			ctx.scale(scale,scale*-1)//Mirror it about the y-axis
			ctx.strokeStyle = 'rgba(000,000,000,1)'
			ctx.strokeText(message, 0, 0 );
			ctx.strokeText(message, 0, 0 );//Second stroke to emphasize shadow
    		ctx.fillStyle = 'white';
			ctx.fillText( message, 0, 0)
 
			texture.needsUpdate = true

			sprite.scale.set(aspect/2/1/smallness * fontsize, -1/2/smallness* fontsize, -0.75/smallness * fontsize)
		}
		let text='Example'
		let size=40
		updateSpriteText()
		scene.add(sprite)
		let parent
		const item={
			ID:ID,
			threeObject:sprite,
			transform:attributes.transform(sprite),
			get xray() { return !spriteMaterial.depthTest },
			set xray(x) { spriteMaterial.depthTest=!x },
			set visible(x){sprite.visible=x},
			get visible(){return sprite.visible},
			set text(x){if(x!==text)text=x;updateSpriteText()},
			set size(x){if(x!==size)size=x;updateSpriteText()},
			set parent(itemID)
			{
				sprite.parent=items[itemID].threeObject//MAKE SOME ASSERTIONS HERE
				parent=itemID
			},
			get parent() {return parent },
		}
		sprite.userData.item=item
		return item
	},
}
modules=proxies.argumentCountChecker(modules)
modules=proxies.tryGetter(modules,()=>modules.mesh)