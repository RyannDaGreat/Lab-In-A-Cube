const proxies={
	filterEnumerables(object,filter)
	{
		//There will either be less or equal number of enumerables on the result
		console.assert(Object.getPrototypeOf(object)===Object.prototype)
		const handler={
			ownKeys(target)
			{
				return Object.keys(target).filter(filter)
			}
		}
		return new Proxy(object,handler)
	},
	whitelistEnumerables(object,...whitelist)
	{
		const set=new Set(whitelist)
		return filterEnumerables(object,Set.prototype.has.bind(set))
	},
	typeAdder(object,f=(key,value)=>value)
	{
		console.assert(Object.getPrototypeOf(object)===Object.prototype)
		const handler={
			set(target,key,value)
			{
				target[key]=f(key,value)
			}
		}
		return new Proxy(object,handler)
	},
}