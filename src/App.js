import React from 'react'
import logo from './logo.svg'
import './App.css'

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

function App()
{
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo"/>
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
		</div>
	)
}

export default App
