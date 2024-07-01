import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { initApi, isAuthorized } from '../recipes/recipeApi';

interface LoginProps {
    setApiToken: React.Dispatch<React.SetStateAction<string | undefined>>
}

const Login: React.FC<LoginProps> = ({ setApiToken }) => {
    const [token, setToken] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setToken(event.target.value);
        setError('');
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        const sanitizedToken = token.trim();
        initApi(sanitizedToken);
        const isAuthorizedResponse = await isAuthorized();
        if (isAuthorizedResponse) {
            setApiToken(sanitizedToken);
            setError('');
        } else {
            setError('Invalid API key');
        }
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
            {error && <Alert variant="danger">{error}</Alert>}
        </Form>
    );
};

export default Login;