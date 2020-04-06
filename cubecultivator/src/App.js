import React, { useState, useEffect, Fragment } from 'react';
import './App.css';
import 'fetch';

const debugCollection = require('./devData/collection.json');
const Cards = require('./devData/MTGACards.json');
const debugging = process.env.REACT_APP_DEBUGGING === 'true';

const getParams = (location) => {
  const searchParams = new URLSearchParams(location.search);
  return {
    session: searchParams.get('session') || '',
  };
}

const Card = ({active, index, onClick, selected, addToCube, removeFromList}) => {
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


function App() {

  // Hook definitions
  const [chosen, setChosen] = useState();
  const [selected, setSelected] = useState([]);
  const [collection, setCollection] = useState({});
  const [page, setPage] = useState(1);
  const [nameFilter, setNameFilter] = useState("");
  const [colorFilter, setColorFilter] = useState({
    W: true,
    U: true,
    B: true,
    R: true,
    G: true,
  });
  const [rarityFilter, setRarityFilter] = useState({
    common: true,
    uncommon: true,
    rare: true,
    mythic: true,
  });

  // Effect Hooks
  useEffect(() => {
    if (debugging) {
      setCollection(debugCollection);
    } else {
      const { session } = getParams(window.location);
      async function fetchData() {
        const res = await fetch(`/api/collection/${session}`);
        res
        .json()
        .then(res => setCollection(res));
      }
      fetchData();
    }
  }, []);
 
  // Component Utility functions
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
    tempLink.setAttribute('download', 'cube_export.txt');
    tempLink.click();
  };
  const nextPage = () => {
    setPage(page + 1);
  };
  const prevPage = () => {
    setPage(page - 1);
  };
  const paginate = (array, page, pageSize) => {
    return array.slice((page - 1) * pageSize, page * pageSize);
  };
  const filterChange = (e, hook) => {
    e.preventDefault();
    hook(e.target.value);
  }
  const checkboxChange = (e, state, hook) => {
    const name = e.target.name;
    const checked = e.target.checked;
    hook({ ...state, [name]: checked });
  }
  const filterByName = (id) => {
    return Cards[id].name.toLowerCase().includes(nameFilter.toLowerCase());
  };
  const filterByColor = (id) => {
    let matches = true;
    Cards[id].color_identity.forEach((color) => {
      matches = matches && colorFilter[color];
    });
    return matches;
  }
  const filterByRarity = (id) => {
    return rarityFilter[Cards[id].rarity];
  }

  // Objects for use in component
  const collectionArray = Object.keys(collection);
  const filteredArray = collectionArray
    .filter(filterByName)
    .filter(filterByColor)
    .filter(filterByRarity);
  const pageSize = 25;
  const pages = Math.ceil(filteredArray.length / pageSize);
  const paginatedCollection = paginate(filteredArray, page, pageSize);

  return (
    <div className="App">
      <div id="cardContainerHeader">
        <h5>Group collection - Total Cards: {filteredArray.length} {filteredArray.length < collectionArray.length && '(Filtered)'}</h5>
        <div>
          <label htmlFor="nameFilter">
            Filter by Name
            <input id="nameFilter" name="nameFilter" type="text" value={nameFilter} onChange={(e) => filterChange(e, setNameFilter)}></input>
          </label>
          <span> Filter by Color: </span>
          {
            Object.keys(colorFilter).map((color) => 
              <label>
              {color}
              <input
                style={{marginLeft:2, marginRight: 5}}
                name={color}
                type="checkbox"
                checked={colorFilter[color]}
                onChange={(e) => checkboxChange(e, colorFilter, setColorFilter)} />
              </label>)
          }
          <span> Filter by Rarity: </span>
          {
            Object.keys(rarityFilter).map((rarity) => 
              <label>
              {rarity}
              <input
                style={{marginLeft:2, marginRight: 10}}
                name={rarity}
                type="checkbox"
                checked={rarityFilter[rarity]}
                onChange={(e) => checkboxChange(e, rarityFilter, setRarityFilter)} />
              </label>)
          }
        </div>
          {
            pages > 1 &&
            <Fragment>
              <button id="prevPage" disabled={ page === 1 } onClick={prevPage} >Prev Page</button>
              <button disabled={ page === pages } onClick={nextPage}id="nextPage">Next Page</button>
            </Fragment>
          }
      </div>
      <div id="cardContainer">
        {
          paginatedCollection.map((key) => 
            <Card 
              active={key === chosen}
              index={key}
              onClick={() => setChosen(key)}
              key={key}
              selected={selected}
              addToCube={addToCube}
              removeFromList={removeFromList}/>
          )
        }
      </div>
      <div id="selectorContainer">
        <button onClick={xport}>Export Cube</button>
      </div>
      <div id="statContainer"><span>Card Count: {selected.length}</span></div>
      <div id="pageCountContainer">{ pages > 1 && <span>Page: {page} of {pages}</span> }</div>
      <div id="listContainerHeader"><h3>Cube Card List</h3></div>
      <div id="listContainer">
      
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
