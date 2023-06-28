import React from 'react';

function StateSelector({ selectedState, onStateChange }) {
    return (
        <select
            className="file-select__dropdown"
            value={selectedState}
            onChange={onStateChange}
        >
            <option value="OH">OH</option>
            <option value="NJ">NJ</option>
            <option value="PA">PA</option>
            <option value="MI">MI</option>
        </select>
    );
}

export default StateSelector;
