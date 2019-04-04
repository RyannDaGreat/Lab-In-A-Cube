const attributes=proxies.argumentCountChecker({
	position(threeObject)
	{
		return{
			get x(){return threeObject.position.x},
			get y(){return threeObject.position.y},
			get z(){return threeObject.position.z},
			set x(value){threeObject.position.x=value},
			set y(value){threeObject.position.y=value},
			set z(value){threeObject.position.z=value},
		}
	},
	rotation(threeObject)
	{
		return{
			get x(){return threeObject.rotation.x/Math.PI*180},
			get y(){return threeObject.rotation.y/Math.PI*180},
			get z(){return threeObject.rotation.z/Math.PI*180},
			set x(value){threeObject.rotation.x=value*Math.PI/180},
			set y(value){threeObject.rotation.y=value*Math.PI/180},
			set z(value){threeObject.rotation.z=value*Math.PI/180},
		}
	},
	scale(threeObject)
	{
		const scale={
			overall:1,
			x:1,y:1,z:1,
		}
		return{
			get x(){return scale.x},
			get y(){return scale.y},
			get z(){return scale.z},
			set x(value){scale.x=value;threeObject.scale.x=scale.x*scale.overall},
			set y(value){scale.y=value;threeObject.scale.y=scale.y*scale.overall},
			set z(value){scale.z=value;threeObject.scale.z=scale.z*scale.overall},
			set overall(value)
			{
				scale.overall=value
				threeObject.scale.x=scale.x*scale.overall
				threeObject.scale.y=scale.y*scale.overall
				threeObject.scale.z=scale.z*scale.overall
			},
			get overall(){return scale.overall},
		}
	},
	transform(threeObject)
	{
		const position=attributes.position(threeObject)
		const rotation=attributes.rotation(threeObject)
		const scale   =attributes.scale   (threeObject)
		return{
			get position(){return position},
			get rotation(){return rotation},
			get scale(){return scale},
		}
	},
	rgb(color)
	{
		return{
			get r(){return color.r},
			get g(){return color.g},
			get b(){return color.b},
			set r(value){color.r=value},
			set g(value){color.g=value},
			set b(value){color.b=value},
		}
	},
})