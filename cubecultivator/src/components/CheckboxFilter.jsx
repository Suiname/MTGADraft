import React from 'react';

const CheckboxFilter = ({ filterState, hook, checkboxChange, style }) => 
	Object.keys(filterState).map((filterName) => 
		<label key={filterName}>
		{filterName}
			<input
			style={style}
			name={filterName}
			type="checkbox"
			checked={filterState[filterName]}
			onChange={(e) => checkboxChange(e, filterState, hook)} />
		</label>
	);

export default CheckboxFilter;