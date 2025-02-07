import React from 'react'
import { useContext } from 'react'
import { CartContext } from '../context/CartContext'


const Item = ({name , price}) => {
    const cartState = useContext(CartContext)
  return (
    <div className='item-card'>
      <h4>{name}</h4>
      <p>Price : ${price} </p>
      <button onClick={()=>{cartState.setCartItem((prevItem)=>{[{...prevItem} ,{name:name , price:price} ]})}}>Add to cart</button>
    </div>
  )
}

export default Item
