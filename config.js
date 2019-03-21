const parsed=djson_parse(`

state
	stack
		initial

deltas	initial
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

deltas	initial	scene	transitions
	drag	charley	charley
		delta griddify
		time 3
	drag	charley	chungus
		delta chingle_chan
		time 3
	drag	chungus	charley
		delta glimmery
		time 1

deltas	griddify
	charley
		transform
			position	x 0
			rotation	x 45
		material
			mode basic

deltas	glimmery
	charley	transform	position
		x -100
		y -200
		z -1000
	chungus	transform	position
		x 0
		y 300
		z 0
	chungus	transform	rotation
		x 90

deltas	chingle_chan
	charley	transform	position
		x 100
		y 200
		z -20000
	charley	transform	rotation
		x 3534
	charley	transform	position
		x 500
		y 0
		z -500
`)


// applyDelta(items,parsed.deltas.initial)

console.log(djson_stringify(items))

items['chungus']=boxItem('chungus')
items['light']=lightItem('light')
items['charley']=boxItem('charley')

requestTween(parsed.deltas.initial,0)

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

