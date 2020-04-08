import React from 'react';

const sets = [
	'none',
	'mir',
	'wth',
	'mmq',
	'inv',
	'pls',
	'ody',
	'ons',
	'scg',
	'8ed',
	'mrd',
	'dst',
	'5dn',
	'sok',
	'9ed',
	'rav',
	'dis',
	'10e',
	'lrw',
	'mor',
	'shm',
	'me2',
	'ala',
	'arb',
	'm10',
	'zen',
	'wwk',
	'roe',
	'm11',
	'ddf',
	'som',
	'me4',
	'cmd',
	'isd',
	'avr',
	'chk',
	'con',
	'dka',
	'm13',
	'nph',
	'rtr',
	'gtc',
	'm14',
	'ths',
	'jou',
	'c13',
	'mma',
	'm15',
	'vma',
	'dtk',
	'ori',
	'bfz',
	'soi',
	'emn',
	'akh',
	'xln',
	'rix',
	'dom',
	'm19',
	'g18',
	'grn',
	'ana',
	'rna',
	'war',
	'm20',
	'eld',
	'thb',
	'mh1',
	'und'
];

const DropdownFilter = ({ filterName, style, value, onChange }) => (
		<label key={filterName}>
			{filterName}
			<select id="setFilterSelect" style={style} value={value} onChange={onChange}>
				{
					sets.map((set) => <option value={set}>{set}</option>)
				}
			</select>
		</label>
	);

export default DropdownFilter;