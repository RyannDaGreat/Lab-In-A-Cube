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
import Select from 'react-select'

function Multiplexer({schema})
{
	const [selectedOption, setSelectedOption]=useState(null)
	if(!schema)
		return <div></div>
	const options                            =Object.keys(schema).map(key=>({value: key, label: key}))

	return <div>
		<Select value={{label: selectedOption}}
				onChange={x=>setSelectedOption(x.value)}
				options={options}
		/>
		<Schema schema={schema[selectedOption]}/>
	</div>
}

function StringInput({schema})
{
	return <div>{schema}</div>
}

function isLeaf(schema)
{
	if(typeof schema!=='object')
		return 'type'
	for(const [index,value] of Object.entries(schema))
	{
		if(typeof value==='string')
		{
			console.assert('type' in schema)
			return true
		}
	}
	return false
}

function addItemDialogs()
{
	function itemDialog()
	{
		const value=prompt("Enter the new item name:")
		if(!value)
			return alert('Canceled adding item')
		else if(value in window.config.items)
		{
			alert('Sorry, that names already taken! Try another one...')
			return itemDialog()
		}
		return value
	}
	function typeDialog()
	{
		const value=prompt("Enter the new item type! Please choose from: "+Object.keys(window.getItemSchemas()))
		if(!value)
			return alert('Canceled adding item')
		else if(!(value in (window.getItemSchemas())))
		{
			alert('Sorry, thats not a module type! Please choose from: '+Object.keys((window.getItemSchemas())))
			return typeDialog()
		}
		return value
	}
	const name=itemDialog()
	if(!name)
		return
	const type=typeDialog()
	if(!type)
		return
	alert("Success! Added item. Please refresh the page to see changes.")
		window.addLinesToConfigString('items	'+name+' '+type)
}

function addDeltaDialog()
{
	function deltaDialog()
	{
		const value=prompt("Enter the new delta name:")
		if(!value)
			return alert('Canceled adding delta')
		else if(value in window.config.deltas)
		{
			alert('Sorry, that names already taken! Try another one...')
			return deltaDialog()
		}
		return value
	}
	const d=deltaDialog()
	if(!d)return
	alert("Success! Added delta. Please refresh the page to see changes.")
	window.addLinesToConfigString('deltas	'+d)
}

function Schema({schema})
{
	if(!schema)
		return <div></div>
	if(isLeaf(schema))
	{
		return <LeafModifier schema={schema}/>
	}
	else
	{
		return <Multiplexer schema={schema}/>
	}
}

function LeafModifier({schema})
{
	let onClick=function()
	{
		const value=prompt("Enter the new value:")
		if(value==null)
			return//Canceled
		else
		{
			schema.set(value)
		}
	}
	return <Button
			variant="contained" onClick={onClick}
			size="small"
				   >{'State: '+schema.state+'\tConfig: '+schema.config/*schema.path+''*/}</Button>
}

let oldStuff=undefined
setInterval(window.tryRefreshInstance,100)
function tryRefreshInstance()
{
	if(window.refreshInstance)
		window.refreshInstance()
}
window.refreshInstance=undefined
function GetSimpleGui()
{
	const labels               =[]
	let [instance, setInstance]=useState({})
	window.refreshInstance=()=>setInstance(window.getGuiArchitectureInstance())
	timerEvents[0]             =()=>
	{
		let stuff=window.gameWindow.getGuiArchitectureInstance.apply(window.gameWindow, [window.gameWindow.config])
		if(stuff!==oldStuff)
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
					window.gameWindow.setConfigDjsonInLocalStorage(configString)
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

window.gameWindow=undefined//Will be set to the 'window' element of the 'game.html' iframe
const timerEvents=[()=>{}]//Calls each one of these on a timer
function doTimerEvents()
{
	if(window.gameWindow!==undefined)//We're not ready yet: the game iframe has to finish loading first
	{
		console.log("HO")
		window.gameWindow.editorMode=true
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
		window.gameWindow=x.contentWindow
	}

	let gameStyle={width: '100%', height: '100%', border: '0'}
	// noinspection HtmlUnknownTarget
	return <div style={{display: 'flex', flexDirection: 'horizontal', width: '25%', height: '100%'}}>
		<div style={{border: 10, backgroundColor: 'rgba(255,255,255,.1)', flexGrow: 4, display: 'flex', flexDirection: 'column', overflowY: 'scroll', pointerEvents: 'auto'}}>
			<h1 style={{color: 'white'}}>Config</h1>
			<Button style={{pointerEvents: 'auto'}} onClick={window.undoEditorChange}variant="contained" size="small" color="primary"> Undo </Button>
			{/*<Button variant="contained" size="small" color="primary"> Redo </Button>*/}
			<Button variant="contained" size="small" color="primary" onClick={addItemDialogs}> Add Item </Button>
			<Button variant="contained" size="small" color="primary" onClick={addDeltaDialog}> Add Delta </Button>
			<Schema schema={window.getDeltasGuiSchema()}></Schema>
			<GetSimpleGui/>
		</div>
	</div>
}
document.addEventListener("DOMContentLoaded", function(event)
{
	ReactDOM.render(<App/>, document.getElementById('root'))
	// Your code to run since DOM is loaded and ready
})
