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
import {useState} from 'react'
import {withStyles} from '@material-ui/core/styles'

function LeafModifier({path})
{

}

let oldStuff=undefined
function GetSimpleGui()
{
	const labels               =[]
	let [instance, setInstance]=useState({})
	timerEvents[0]             =()=>
	{
		let stuff=gameWindow.getGuiArchitectureInstance.apply(gameWindow, [gameWindow.config])
		if(stuff!==oldStuff)//This
		{
			setInstance(stuff)
			oldStuff=stuff
		}
	}//This function is inefficient. It must be cleaned up asap. (it lists all possible controls...which is just STUPID (but also very easy to make))

	for(const [index, i] of Object.entries(instance))
	{
		if(i.path.includes('color'))
		{
			let onClick=function()
			{
				const value=prompt("Enter the new value for "+(i.path.join(' '))+
									   '\n\n at delta '+(i.delta)+'\n\nCurrent Value: '+i.valueInConfig)
				if(value==null)
					return//Canceled
				else
				{
					let configString=localStorage.getItem('config')
					configString+='\n'+'deltas	'+i.delta+'	'+i.path.join('	')+' '+value
					gameWindow.setConfigDjsonInLocalStorage(configString)
				}
			}
			let color  =i.valueInConfig===undefined ? "primary" : "secondary"
			labels.push(<Button key={index}
								variant="contained" onClick={onClick}
								size="small"
								color={color}>
				{'deltas '+i.delta+' '+i.path.join(' ')}
			</Button>)
		}
	}
	return <table style={{flexGrow: 4, display: 'flex', flexDirection: 'column'}}>
		{labels}
	</table>
}

var gameWindow   =undefined//Will be set to the 'window' element of the 'game.html' iframe
const timerEvents=[()=>{}]//Calls each one of these on a timer
function doTimerEvents()
{
	if(gameWindow!==undefined)//We're not ready yet: the game iframe has to finish loading first
	{
		console.log("HO")
		gameWindow.editorMode=true
		for(const event of timerEvents)
			event()
	}
}
setInterval(doTimerEvents, 100)

function App()
{
	function setGameWindow(x)
	{
		// let w            =x.contentWindow
		gameWindow=x.contentWindow
	}
	let gameStyle={width: '100%', height: '100%', border: '0'}
	// noinspection HtmlUnknownTarget
	return <Split style={{display: 'flex', flexDirection: 'horizontal', width: '100%', height: '100%'}}>
		<div style={{flexGrow: 4}}>
			<iframe src="game.html" style={gameStyle} ref={setGameWindow}/>
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
document.addEventListener("DOMContentLoaded", function(event)
{
	ReactDOM.render(<App/>, document.getElementById('root'))
	// Your code to run since DOM is loaded and ready
})
