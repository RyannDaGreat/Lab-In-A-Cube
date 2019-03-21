applyDelta(items,djson_parse(`
scene
	transitions
		charley	charley
			delta
				charley
					transform
						position
							x 0
				charley
					transform
						rotation
							x 45
					material
						mode basic
			time 3
		charley	chungus
			time 3
			delta
				charley	transform
						position
							x 100
							y 200
							z -20000
				charley	transform
						rotation
							x 3534
				charley	transform
						position
							x 500
							y 0
							z -500
		chungus	charley
			time 1
			delta
				charley	transform	position
					x -100
					y -200
					z -1000
				chungus
					transform
						position
							x 0
							y 300
							z 0
						rotation
							x 90
`))

console.log(djson_stringify(items))

items['chungus']=boxItem('chungus')
items['light']=lightItem('light')
items['charley']=boxItem('charley')

requestTween(djson_parse(`
chungus	transform	position
	x 0
	y 0
	z 0
charley	transform	position
	x 0
	y 0
	z 0
chungus	transform	rotation
	x 30
	y 69
	z 100
charley	material
	mode phong
`),0)

requestTween(djson_parse(`
chungus	transform	position
	x 0
	y -500
	z -2000
charley	transform	position
	x 500
	y 0
	z -1000
`),1)

