import React from 'react'
import logo from './logo.svg'
import './App.css'
import Split from 'react-split'

import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import Fab from '@material-ui/core/Fab'
import IconButton from '@material-ui/core/IconButton'
import NavigationIcon from '@material-ui/icons/Navigation'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'

function getKeys(moduleTypeName)
{
	// assert.isString(moduleTypeName)

}

function generate(config)
{
	// assert.isPureObject(config)
	const items =config.items
	const deltas=config.deltas
	// assert.isPureObject(items)
	// assert.isPureObject(deltas)
	for(const deltaId of deltas)
	{
		// assert.isString(deltaId)
		for(const [name, type] of Object.entries(items))
		{
			// assert.isString(name)
			// assert.isString(type)
			const paths=window.modules[type]().gui

		}
	}
}

function Leaf({})
{

}

function GetSimpleGui()
{
	// try{
	const instance=window.getGuiArchitectureInstance()
	const labels  =[]
	for(const i of instance)
	{
		labels.push(<Button variant="contained" onClick={
			function()
			{
				const value=prompt("Enter the new value for "+(i.path.join(' '))+' at delta '+(i.delta)+'\n\nCurrent Value: '+i.con)
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
							size="small" color="primary">{'deltas '+i.delta+' '+i.path.join(' ')}</Button>)
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
			{/*<header className="App-header">*/}
			{/*<img src={logo} className="App-logo" alt="logo"/>*/}
			{/*<p>*/}
			{/*Edit <code>src/App.js</code> and save to reload.*/}
			{/*</p>*/}
			{/*<a*/}
			{/*className="App-link"*/}
			{/*href="https://reactjs.org"*/}
			{/*target="_blank"*/}
			{/*rel="noopener noreferrer"*/}
			{/*>*/}
			{/*Learn React*/}
			{/*</a>*/}
			{/*</header>*/}
			<h1 style={{color: 'white'}}>Config</h1>
			<Button variant="contained" size="small" color="primary"> Undo </Button>
			<Button variant="contained" size="small" color="primary"> Redo </Button>
			<Button variant="contained" size="small" color="primary"> Add Item </Button>
			<Button variant="contained" size="small" color="primary"> Add Delta </Button>
			<GetSimpleGui/>
		</div>
	</Split>
}

export default App
