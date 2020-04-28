import React, { useState, useEffect, Fragment } from 'react';
import './App.css';
import 'fetch';
import { Card, CheckboxFilter, DropdownFilter } from './components';

const debugCollection = require('./devData/collection.json');
const debugCards = require('./devData/debugCards.json');
const debugging = process.env.REACT_APP_DEBUGGING === 'true';
const notProduction = process.env.NODE_ENV !== 'production';

const getParams = (location) => {
  const searchParams = new URLSearchParams(location.search);
  return {
    session: searchParams.get('session') || '',
  };
}


function App() {
  // Initial states
  const initColorFilterState = {
    W: true,
    U: true,
    B: true,
    R: true,
    G: true,
  };

  const initRarityFilterState = {
    common: true,
    uncommon: true,
    rare: true,
    mythic: true,
  };

  // Hook definitions
  const [chosen, setChosen] = useState();
  const [selected, setSelected] = useState([]);
  const [collection, setCollection] = useState({});
  const [Cards, setCards] = useState({});
  const [page, setPage] = useState(1);
  const [nameFilter, setNameFilter] = useState("");
  const [cmcFilter, setCMCFilter] = useState(0);
  const [cmcCompareFilter, setCMCCompareFilter] = useState("=");
  const [colorFilter, setColorFilter] = useState(initColorFilterState);
  const [rarityFilter, setRarityFilter] = useState(initRarityFilterState);
  const [setFilter, setSetFilter] = useState('none');
  const [loading, setLoading] = useState({Cards: true, collection: true});

  // Effect Hooks
  useEffect(() => {
    if (notProduction && debugging) {
      setCollection(debugCollection);
      setLoading({collection: false});
    } else {
      const { session } = getParams(window.location);
      async function fetchData() {
        const res = await fetch(`/api/collection/${session}`);
        res
        .json()
        .then(res => {
          setCollection(res);
          setLoading((l) => ({...l, collection: false}));
        });
      }
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (debugging) {
      setCards(debugCards);
      setLoading({Cards: false});
    } else {
      async function fetchCards() {
        const res = await fetch('/api/cards/all');
        res
        .json()
        .then(res => {
          setCards(res);
          setLoading((l) => ({...l, Cards: false}));
        });
      }
      fetchCards();
    }
  }, []);

  
 
  // Component Utility functions
  const removeFromList = (id) => {
    const filtered = selected.filter(selection => id !== selection);
    setSelected(filtered);
  };
  const addToCube = () => !selected.includes(chosen) && setSelected([...selected, chosen]);
  const xport = (exportSet) => {
    let cardList;
    if (exportSet) {
      cardList = exportSet.map((id) => Cards[id].name + '\n');
    } else {
      cardList = selected.map((id) => Cards[id].name + '\n');
    }
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
    // Reset Page to 1
    setPage(1);
  }
  const checkboxChange = (e, state, hook) => {
    const name = e.target.name;
    const checked = e.target.checked;
    hook({ ...state, [name]: checked });
    // Reset Page to 1
    setPage(1);
  }
  const selectChange = (e) => {
    setSetFilter(e.target.value);
    setPage(1);
  };
  const cmcChange = (e) => {
    setCMCCompareFilter(e.target.value);
    setPage(1);
  };
  const filterByName = (id) => nameFilter === "" || Cards[id].name.toLowerCase().includes(nameFilter.toLowerCase());
  const filterByColor = (id) => {
    if (!Object.values(colorFilter).includes(false) ) {
      return true;
    }
    let matches = true;
    Cards[id].color_identity.forEach((color) => {
      matches = matches && colorFilter[color];
    });
    return matches;
  }
  const filterByRarity = (id) => !Object.values(rarityFilter).includes(false) || rarityFilter[Cards[id].rarity];
  const filterBySet = (id) => (setFilter === 'none' || Cards[id].set === setFilter);
  const filterByCMC = (id) => {
    if (cmcCompareFilter === "=" && parseInt(cmcFilter) === 0) {
      return true;
    }
    switch (cmcCompareFilter) {
      case "=":
        return Cards[id].cmc === parseInt(cmcFilter)
      case ">":
        return Cards[id].cmc > parseInt(cmcFilter)
      case ">=":
        return Cards[id].cmc >= parseInt(cmcFilter)
      case "<":
        return Cards[id].cmc < parseInt(cmcFilter)
      case "<=":
        return Cards[id].cmc <= parseInt(cmcFilter)
      default:
        return Cards[id].cmc === parseInt(cmcFilter)
    }
  };

  // Objects for use in component
  const collectionArray = Object.keys(collection);
  const filteredArray = collectionArray
    .filter(filterByName)
    .filter(filterByColor)
    .filter(filterByRarity)
    .filter(filterBySet)
    .filter(filterByCMC);
  const pageSize = 25;
  const pages = Math.ceil(filteredArray.length / pageSize);
  const paginatedCollection = paginate(filteredArray, page, pageSize);
  const pageLoading = loading.Cards || loading.collection;
  return (
    <div className="App">
      {
        !pageLoading &&
        <Fragment>
        <div id="cardContainerHeader">
        <h5>Group collection - Total Cards: {filteredArray.length} {filteredArray.length < collectionArray.length && '(Filtered)'}</h5>
        <div>
          <label htmlFor="nameFilter">
            Filter by Name
            <input id="nameFilter" name="nameFilter" type="text" value={nameFilter} onChange={(e) => filterChange(e, setNameFilter)}></input>
          </label>
          <label htmlFor="cmcFilter">
            Filter by CMC
            <DropdownFilter 
            filterName=""
            value={cmcCompareFilter}
            onChange={cmcChange} 
            choices={["=", ">", ">=", "<", "<="]}
            />
            <input id="cmcFilter" name="cmcFilter" type="number" value={cmcFilter} onChange={(e) => filterChange(e, setCMCFilter)}></input>
          </label>
          <span> Filter by Color: </span>
          {
            <CheckboxFilter 
              filterState={colorFilter}
              hook={setColorFilter}
              checkboxChange={checkboxChange}
              style={{marginLeft:2, marginRight: 5}}
              />
          }
          <span> Filter by Rarity: </span>
          {
            <CheckboxFilter 
              filterState={rarityFilter}
              hook={setRarityFilter}
              checkboxChange={checkboxChange}
              style={{marginLeft:2, marginRight: 10}}
              />
          }
          <DropdownFilter 
          filterName="Set Filter: "
          value={setFilter}
          onChange={selectChange} />
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
              Cards={Cards}
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
        <button onClick={() => xport()}>Export Cube</button>
        <button onClick={() => xport(collectionArray)}>Export All</button>
        <button onClick={() => xport(filteredArray)}>Export Filtered</button>
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
      </Fragment>
      }
      {
        pageLoading &&
        <div id="loader">Loading <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
      }
    </div>
  );
}

export default App;
