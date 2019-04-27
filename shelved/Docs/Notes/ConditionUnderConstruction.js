// function condition(deltaID,suppose=new Set)
// {
// 	// getDeltaByID has a parameter called suppose, where if a deltaID is in it, it's fed back to condition
// 	// in getDeltaByID(deltaID) add a check that says if condition(deltaID) is false, then return {}
// 	let totalDelta={}//It should be an invariant that this is always contained by state
// 	if suppose.has(deltaID) return true
// 	for(inheritedDeltaID of inheritanceChain(deltaID).reversed())
// 	{
// 		const inheritedDelta=getRawDeltaByID(inheritedDeltaID,new Set(suppose).add(inheritedDeltaID))
// 		deltas.pour(inheritedDelta,totalDelta)
// 		if(stateContains(inheritedDelta))
// 		{
// 			totalDelta = inheritedDelta
// 		}
// 		else
// 		{
// 			return false
// 		}
// 	}
// 	assert stateContains(totalDelta)
// 	return true
// }
//
//
