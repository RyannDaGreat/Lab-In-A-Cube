import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import Fab from '@material-ui/core/Fab'
import IconButton from '@material-ui/core/IconButton'
import NavigationIcon from '@material-ui/icons/Navigation'
import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import Split from 'react-split'
import { useState } from 'react'
import {withStyles} from '@material-ui/core/styles'

setInterval(window.getGuiArchitectureInstance,.5)

function GetSimpleGui()
{
	// try{
	// const instance=window.getGuiArchitectureInstance()
	const labels  =[]
	let [instance, setInstance] = useState({})
	timerEvents[0]=()=>{setInstance(window.getGuiArchitectureInstance())}

	for(const [index,i] of Object.entries(instance))
	{
		if(i.path.includes('color'))
		labels.push(<Button key={index}variant="contained" onClick={
			function()
			{
				const value=prompt("Enter the new value for "+(i.path.join(' '))+'\n\n at delta '+(i.delta)+'\n\nCurrent Value: '+i.valueInConfig)
				if(value==null)
					return//Canceled
				else
				{
					let configString=localStorage.getItem('config')
					configString+='\n'+'deltas	'+i.delta+'	'+i.path.join('	')+' '+value
					window.setConfigDjsonInLocalStorage(configString)
				}
			}
		}
		size="small" color={i.valueInConfig===undefined?"primary":"secondary"}>{'deltas '+i.delta+' '+i.path.join(' ')}</Button>)
	}
	return <div style={{flexGrow: 4, display: 'flex', flexDirection: 'column'}}>
		{labels}
	</div>
// }
	// catch{}
	return <div></div>
}
window.editorMode=true

function App()
{
	return <Split style={{display: 'flex', flexDirection: 'horizontal', width: '100%', height: '100%'}}>
		<div style={{flexGrow: 4}}>
			<iframe src="scene.html" style={{width: '100%', height: '100%', border: '0'}}></iframe>
		</div>
		<div style={{flexGrow: 4, display: 'flex', flexDirection: 'column', overflowY: 'scroll'}}>
			<h1 style={{color: 'white'}}>Config</h1>
			<Button variant="contained" size="small" color="primary"> Undo </Button>
			<Button variant="contained" size="small" color="primary"> Redo </Button>
			<Button variant="contained" size="small" color="primary"> Add Item </Button>
			<Button variant="contained" size="small" color="primary"> Add Delta </Button>
			<GetSimpleGui/>
		</div>
	</Split>
}

const timerEvents=[()=>{}]//Calls each one of these on a timer
function doTimerEvents()
{
	for(const event of timerEvents)
		event()
}
setInterval(doTimerEvents,1000)




ReactDOM.render(<App />, document.getElementById('root'))

