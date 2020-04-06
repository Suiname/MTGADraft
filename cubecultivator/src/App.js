import React, { useState, useEffect } from 'react';
import './App.css';
import 'fetch';

const Cards = require('./devData/MTGACards.json');

const Card = ({active, index, onClick}) => {
  return (
    <div onClick={onClick} id={index} className={active ? "card active" : "card"}>
      <img src={Cards[index].image_uris.en} alt={Cards[index].name}/>
    </div>
  );
};

const getParams = (location) => {
  const searchParams = new URLSearchParams(location.search);
  return {
    session: searchParams.get('session') || '',
  };
}

function App() {
  const [chosen, setChosen] = useState();
  const [selected, setSelected] = useState([]);
  const [collection, setCollection] = useState({});

  useEffect(() => {
    const { session } = getParams(window.location);
    async function fetchData() {
      const res = await fetch(`/api/collection/${session}`);
      res
      .json()
      .then(res => setCollection(res));
    }
    fetchData();
  });
 
  const removeFromList = (id) => {
    const filtered = selected.filter(selection => id !== selection);
    setSelected(filtered);
  };
  const addToCube = () => !selected.includes(chosen) && setSelected([...selected, chosen]);
  const xport = () => {
    const cardList = selected.map((id) => Cards[id].name + '\n');
    const data = new Blob(cardList, {type: 'text'});
    const fileURL = window.URL.createObjectURL(data);
    const tempLink = document.createElement('a');
    tempLink.href = fileURL;
    tempLink.setAttribute('download', 'filename.txt');
    tempLink.click();
  };

  return (
    <div className="App">
      <div id="cardContainerHeader"><h2>Group collection</h2></div>
      <div id="cardContainer">
        {
          Object.keys(collection).map((key) => 
            <Card active={key === chosen} index={key} onClick={() => setChosen(key)} key={key} />
          )
        }
      </div>
      <div id="selectorContainer">
        <button onClick={addToCube}>Add to Cube</button><button onClick={xport}>Export Cube</button>
      </div>
      <div id="listContainerHeader"><h2>Cube Card List</h2></div>
      <div id="listContainer">
      <div id="statContainer">Card Count: {selected.length}</div>
        {
          selected && selected.map((id) => 
          <div className="listItem" key={id}>
            <span>{Cards[id].name}</span>
            <button onClick={() => removeFromList(id)}>Remove</button>
          </div>
          )
        }
      </div>
    </div>
  );
}

export default App;
