import React from 'react';
function Input({ value, onChange }) {
    return (
        <div className="input-field">
            <input
                type="text"
                id="input"
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default Input;