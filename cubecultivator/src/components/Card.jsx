
import React from 'react';

const Card = ({active, index, onClick, selected, addToCube, removeFromList, Cards}) => {
	return (
	  <div onClick={onClick} id={index} className={active ? "card active" : "card"}>
		<img src={Cards[index].image_uris.en} alt={Cards[index].name}/>
		<div className={active ? "menu active" : "menu"}>
		  {!selected.includes(index) && <button onClick={addToCube}>Add to Cube</button>}
		  {selected.includes(index) && <button onClick={() => removeFromList(index)}>Remove from Cube</button>}
		</div>
	  </div>
	);
};

export default Card;
