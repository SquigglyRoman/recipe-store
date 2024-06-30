import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

interface LoginProps {
    setApiToken: React.Dispatch<React.SetStateAction<string | undefined>>
}

const Login: React.FC<LoginProps> = ({setApiToken}) => {
    const [token, setToken] = useState('');

    const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setToken(event.target.value);
    };

    // TODO: Test if api token is valid, THEN set it
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setApiToken(token);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="token">
                <Form.Label>GitHub API Token</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter your GitHub API token"
                    value={token}
                    onChange={handleTokenChange}
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
};

export default Login;