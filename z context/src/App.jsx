import { useContext } from 'react'
import Item from './components/Item'
import Cart from './components/Cart'
import './App.css'

function App() {

  return (
    <>
    <h1>This is demo react app</h1>
    <div className="items">
    <Item name={"macbook pro"} price={2000}/>
    <Item name={"iphone 17 "} price={2200}/>
    <Item name={"Pen drive"} price={20}/>
    <Item name={"msi gaming laptop"} price={4400}/>
    </div>
    <Cart/>

    </>
  )
}

export default App
