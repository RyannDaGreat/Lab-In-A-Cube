function get_indent_level(line,key={' ':1,'\t':4})
{
	let out=0
	for(const char of line)
		if(char in key)
			out+=key[char]
		else
			break
	return out
}
function split_on_first_space(string)
{
	return string.split(/ (.*)/,2)
}
function parse_djson(lines,level=-1)
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
		const [key,value]=split_on_first_space(trimmed)//Sometimes value will be undefined
		out[key]=value===undefined?parse_djson(lines,line_level):value
	}
	return out
}