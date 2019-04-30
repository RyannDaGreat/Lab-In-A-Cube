
function extractReplacers(replacements)
{
	//Returns a list of string-to-replacement-dicts
	const static={}
	const dynamic={}
	for(const [key,value]in Object.entries(replacements))
	{
		if(is_object(value))
		{
			for(const [i,e] in Object.entries(value))
			{
				if(defined(dynamic[i])
				{
					assert.isPureList(dynamic[i])
					dynamic[i].push()
				}
				else
				{
					dynamic[i]=
				}
			}
		}
		else
		{
			assert.isString(value)
			static[key]=value
		}
	}
}









function transposed(object)
{
	const out={}
	for(const [key1,value1] of Object.entries(object))
		for(const [key2,value2] of Object.entries(value1))
			if(out[key2]!==undefined)
				out[key2][key1]=value2
			else
				out[key2]={[key1]:value2}
	return out
}










	@with
		box_		0 box0		1 box1		2 box2		3 box3		4 box4		5 box5
		box_up		0 box0up	1 box1up	2 box2up	3 box3up	4 box4up	5 box5up
		box_down	0 box0down	1 box1down	2 box2down	3 box3down	4 box4down	5 box5down
		pos_x		0    0000	1    1000	2    2000	3    3000	4    4000	5    5000