import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import Fab from '@material-ui/core/Fab'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import NavigationIcon from '@material-ui/icons/Navigation'
import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import Select from 'react-select'
import Split from 'react-split'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import {useState} from 'react'
import {withStyles} from '@material-ui/core/styles'


function Multiplexer({schema})
{
	const [selectedOption, setSelectedOption]=useState(null)
	if(!schema)
		return <div></div>
	const options                            =Object.keys(schema).map(key=>({value: key, label: key}))
	return <div>
		<Select style={{width:'100%'}} value={{label: selectedOption}}
				onChange={x=>setSelectedOption(x.value)}
				options={options}
		/>
		<div style={{width:'100%'}}>
		<table style={{width:'100%'}}>
		<tr style={{width:'100%'}}>
		<td style={{width:'10px'}}>
		{}
		</td>
		<td style={{width:'100%'}}>
			<Schema schema={schema[selectedOption]}/>
			</td>
			</tr>
			</table>
		</div>
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
	window.refreshPage()
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
	alert("Success! Added delta. You will now see it in the top dropdown menu.")
	window.addLinesToConfigString('deltas	'+d)
	window.refreshGuiSchema()
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

function TextInput({value,setValue})
{
	return <Input
        value={value}
        onChange={event=>{setValue(event.target.value)}}
        // className={classes.input}
        inputProps={{
          'aria-label': 'Description',
        }}/>
}
function NumberInput({value,setValue,step=.1})
{
	return <TextField
	type="number"
        value={value}

     inputProps={{ /*min: "0", max: "10",*/ step: step }}
        onChange={event=>{setValue(event.target.value)}}
        // className={classes.input}
        />
}

function SelectInput({value,setValue,values=[]})
{
	return <Select value={{label: value}}
				   onChange={x=>setValue(x.value)}
				   options={values.map(key=>({value: key, label: key}))}
	/>
}

function BooleanInput({value,setValue})
{
	return <Switch
		checked={Boolean(value)}
		onChange={event=>setValue(event.target.checked)}
		color="primary"
		/>
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

	const checked=schema.config!==undefined
	// alert("ASOIJD")
	let input=<TextInput value={schema.config} setValue={schema.set}/>
	if(schema.type==='string')
	{
		input=input//Default: text input
	}
	else if(schema.type==='boolean')
	{
		input=<BooleanInput value={schema.config} setValue={schema.set}/>
	}
	else if(schema.type==='number')
	{
		input=<NumberInput value={schema.config} setValue={schema.set}/>
	}
	else if(schema.type==='select')
	{
		input=<SelectInput value={schema.config} values={schema.values} setValue={schema.set}/>
	}
	console.assert(input!==undefined)
	return <div style={{padding:20,paddingTop:10,backgroundColor:'rgba(255,255,255,.5)',borderRadius:30,alignContent: 'center'}}>
	<Switch
		checked={checked}
		disabled={schema.path[0]==='initial'}
		onChange={event=>{const checked=event.target.checked;if(checked)/*alert(schema.state+'  '+schema.config)*/;schema.set(checked?schema.state:null)}}//if(!checked){schema.set(undefined)}else{console.assert(checked);setUsed(checked)}}}
		color="primary"
		/>{checked?"(In delta)":"(Not in delta)"}<br/>
	{checked?input : <div></div>}
	
				   </div>

		//		   <Button
		//	variant="contained" onClick={onClick}
		//	size="small"
		//		   >{'State: '+schema.state+'\tConfig: '+schema.config/*schema.path+''*/}</Button>
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

function handleNewLab()
{
	if(window.confirm('Are you sure you want to create a new lab (all progress will be lost)?'))
	{
		window.setConfigDjsonInLocalStorage('')
		window.refreshPage()
	}

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

function handleLoadConfig(kwargs={})
{
	const {concat=false}=kwargs
	const code=prompt('Please enter the 4 character code (case-sensitive) that you received when pressing "Save Config"')
	if(typeof code==='string' && code.length===4)
	{
		window.loadConfigFromServer(code,{concat})
	}
	else if(!code)
	{
		alert('Loading config from server cancelled.')
	}
	else
	{
		alert('Please enter a four character code (you entered '+JSON.stringify(code)+', which has '+code.length+' characters)')
		handleLoadConfig()
	}
}

function viewMySaves()
{
	const saves=window.getMySaves()
	if(!saves.length)
		window.alert('You currently have no saved labs.')
	else
		window.alert("All of your saved file codes (bottom is most recent):"+'\n'+saves.join('\n'))
}


function handleEditCode()
{
	if(!__weAreInAnIframe__)//We are in an iframe
	{
		if(window.confirm('Are you sure you want to go to the code editor? (This option exists for mainly devs, such as Ryan Jenny and Rong)'))
		{
			window.goToUrl('../Editor/index.html')
		}
	}
	else
	{
		alert('You\'re already in the code editor.')
	}
}

function handleHideEditorGui()
{
	if(window.confirm('Are you sure you want to hide to the editor gui? (This will bring you to game.html)'))
	{
		window.goToUrl('../game.html')
	}
}

//PART OF TODO TO MAKE LABS LOADABLE VIA URL
// if(window.location.pathname.length=5)//In other words, if we have some 5 letter code

const __weAreInAnIframe__=window.location !== window.parent.location
let editCodeButton=<Button style={{margin:1,fontWeight: 'bold'}} variant="contained" size="small" onClick={handleEditCode}> Edit Djson Code </Button>



let hideEditorGui=<Button style={{margin:1,fontWeight: 'bold'}} variant="contained" size="small"  onClick={handleHideEditorGui}> Hide Editor Gui </Button>

function App()
{
	function setGameWindow(x)
	{
		window.gameWindow=x.contentWindow
	}
	//Lab
	const [schema,setSchema]=useState(window.getDeltasGuiSchema())
	window.refreshGuiSchema=()=>setSchema(window.getDeltasGuiSchema())
	let gameStyle={width: '100%', height: '100%', border: '0'}
	// noinspection HtmlUnknownTarget
	return <div style={{display: 'flex', flexDirection: 'horizontal', width: '25%', height: '100%'}}>
		<div style={{padding:10,border: 10, backgroundColor: 'rgba(255,255,255,.3)', flexGrow: 4, display: 'flex', flexDirection: 'column', overflowY: 'scroll', pointerEvents: 'auto'}}>
			<h1 style={{color: 'white',textAlign:'center'}}>Lab<sup>3</sup></h1>
			<br/>
			 {editCodeButton}
			 {hideEditorGui}
			<Button style={{margin:1,fontWeight: 'bold'}} variant="contained" size="small" color="secondary" onClick={handleNewLab}> New Lab </Button>
			<Button style={{margin:1,fontWeight: 'bold'}} variant="contained" size="small" color="secondary" onClick={()=>window.saveConfigToServer()}> Save Lab </Button>
			<Button style={{margin:1,fontWeight: 'bold'}} variant="contained" size="small" color="secondary" onClick={viewMySaves}> View Saved Labs </Button>
			<Button style={{margin:1,fontWeight: 'bold'}} variant="contained" size="small" color="secondary" onClick={handleLoadConfig}> Load Lab </Button>
			<Button style={{margin:1,fontWeight: 'bold'}} variant="contained" size="small" color="secondary" onClick={()=>handleLoadConfig({concat:true})}> Combine Labs </Button>
			<Button style={{margin:1,fontWeight: 'bold'}}	variant="contained" size="small" color="primary"	  onClick={window.undoEditorChange}variant="contained" size="small" color="primary"> Undo  </Button>
			<Button style={{margin:1,fontWeight: 'bold'}} variant="contained" size="small" color="primary" onClick={addItemDialogs}> Add Item </Button>
			<Button style={{margin:1,fontWeight: 'bold'}} variant="contained" size="small" color="primary" onClick={addDeltaDialog}> Add Delta </Button>
			<br/>
			<div style={{width:'100%'}}><Schema schema={schema}></Schema></div>
		</div>
	</div>
}
document.addEventListener("DOMContentLoaded", function(event)
{
	ReactDOM.render(<App/>, document.getElementById('root'))
	// Your code to run since DOM is loaded and ready
})
