//DJSON Warnings:
//	Don't use blank lines! It can be dangerous. If you use a COMPLETELY blank line (no whitespace), it will erase the rest of the current scope until the next unindented entry (this is because a blank line can be interpereted as a key called "". So, if you use another blank line later on, it will erase the previous value, and it will look as though values have been deleted.) They can be fine when written by a machine, but they're dangerous to try writing by hand (watch out for duplicate value warnings! Those are why thigns get overwritten)
//	We can make warnings about duplicate values
const djson={
	parse_leaf(leaf)
	{
		//This function is meant to be plugged into djson.parse's leaf_parser parameter as the default
		//Summary: try converting the leaf into a JSON-style value, and if we can't, just leave it as a string.
		console.assert(leaf!=null&&Object.getPrototypeOf(leaf)===String.prototype,'Leaf must be a string')
		try
		{
			return JSON.parse(leaf)
		}
		catch
		{ 
			return leaf
		}
	},
	parse_handwritten(lines)
	{
		//Removes trailing whitespace and empty lines (that just have whitespace) It's really just to help when we're actually writing them
		console.assert(arguments.length==1,'djson.parse_handwritten takes exactly one argument')
		if(typeof lines==='string')
			lines=lines.split('\n')
		assert.isPureArray(lines)
		const out=[]
		for(let line of lines)
		{
			assert.isPrototypeOf(line,String)
			line=line.trimRight()
			if(line)
				out.push(line)
		}
		return djson.parse(out)
	},
	parse(lines,level=-1,leaf_parser=djson.parse_leaf)
	{
		if(typeof lines==='string')
			lines=lines.split('\n')
		const out={}
		while(lines.length)
		{
			const line=lines.shift()
			const line_level=get_indent_level(line)
			if(line_level<=level)
			{
				lines.unshift(line)//Put it back again
				break
			}
			const trimmed=line.trimLeft()
			let [key,value]=split_on_first_space(trimmed)//Sometimes value will be undefined

			const isLeaf=Boolean(value!==undefined)

			if(false && key==='')                       console.warn('djson warning: key==="", which means you have a blank line somewherere')
			if(false && key in out)                     console.warn('djson warning: key is not unique! key==='+JSON.stringify(key))
			if(value&&value!==value.trimLeft())console.warn('djson warning: value starts with whitespace, which means you might have tried using spaces as indents: value==='+JSON.stringify(value))
			if(isLeaf&&!value)                 console.warn('djson warning: value is empty! You must have had some line ending with key followed by a single space before the end of the line')
			console.assert(is_object(out))

			function applyDjsonDelta(o,d)//A simpler variant of applyDelta that lets you rewrite deltas, making djson potentially very readable if written by hand
			{
				for(const key in d)
					if(are_objects(o,d[key]) && key in o)
						arguments.callee(o[key],d[key])
					else
						o[key] = d[key]
			}

			applyDjsonDelta(out,nested_path(key.trim().split(/\t+/),isLeaf?leaf_parser(value):djson.parse(lines,line_level)))
		}
		return out
	},
	stringify(object,level=0,out=[])
	{
		console.assert(is_object(object),'you can only djson-stringify objects, but argument "object" was of type '+typeof object)
		for(let [key,value] of Object.entries(object))
		{
			if(is_object(value))
			{
				out.push(multiply_string('\t',level)+key)
				djson.stringify(value,level+1,out)
			}
			else
			{
				console.assert(!key.includes(' '),'djson keys cannot contain spaces')
				console.assert(!key.includes('\t'),'djson keys cannot contain tabs')
				console.assert(!key.includes('\n'),'djson keys cannot contain newlines')
				if(typeof value!=='string')
				{
					//I disabled this warning becaue it's a fairly normal thing to happen and it got spammy: console.warn('Coersion warning: all djson values are strings, and typeof value==='+typeof value+' and String(value)==='+String(value)+' and key==='+key)
					value=String(value)
				}
				console.assert(!value.includes('\n'),'no djson values may contain more than one line')
				// console.assert(!value.trim(),'djson values cannot be empty strings (for readability\'s sake')
				// console.assert(!value.trim(),'djson keys cannot be empty strings (for readability\'s sake')
				out.push(multiply_string('\t',level)+key+' '+value)
			}
		}
		return out.join('\n')
	},
	test(_djson)
	{
		_djson=_djson||`test
1 
	2
	3
1
	4
	5
A
	B
	C
	a 
		b
	c
	d 
	e f 
	g 0
	g 1
	h 0
	i 0
		j
		k 3
	l
		m
		n 0
	*
		!
		? -
transform
	Pos
		X 3
		Y 2
		Z 0
	rot
		x 3
		y 2
		z 6
fluid
	level
		percent 5
	color
		r 4
		g 7
		b 1
	name elbow
people
	anh
		gender
			female
		last

	A 0
	B 1
	C 2
	D 3
	E 4
deltaTest
	Blah 4
	Blarh 5
deltaTest
	Blah 5
	Blem 9
	`
		console.log("ORIGINAL:\n"+_djson)
		const object=djson.parse(_djson)
		console.log("DJSON PARSED:\n"+JSON.stringify(object))

		const stringified=djson.stringify(object)
		console.assert(typeof stringified === 'string')
		console.log("DJSON STRINGIFIED:\n"+stringified)
		const object2=djson.parse(stringified)
		console.log("DJSON RE-PARSED:\n"+JSON.stringify(object2,null,4))
		const stringified2=djson.stringify(object2)
		console.log("DJSON RE-STRINGIFIED:\n"+stringified2)
		console.assert(stringified===stringified2)
	},
}
// djson.test()