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
        <div className='col-12 col-sm-9 col-md-6 col-lg-4'>
            <Form.Control
                type="text"
                placeholder="Search recipes..."
                onChange={handleQueryChange}
            />
        </div>
    );
};

export default Search;