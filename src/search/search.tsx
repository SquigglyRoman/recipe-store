import React from 'react';
import { Form } from 'react-bootstrap';

interface SearchProps {
    setSearchTokens: React.Dispatch<React.SetStateAction<string[]>>
}

const Search: React.FC<SearchProps> = ({ setSearchTokens }) => {

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTokens(event.target.value.split(' '));
    };

    return (
        <Form.Control
            type="text"
            placeholder="Search recipes..."
            onChange={handleQueryChange}
        />
    );
};

export default Search;