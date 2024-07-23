import React, { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { checkTokenValidity } from '../recipes/recipeApi';
import { saveLogin } from './cookieAuthHandler';

interface LoginProps {
    onLoginSuccess: () => void
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [isChecking, setIsChecking] = useState<boolean>(false);
    const [token, setToken] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setToken(event.target.value);
        setError('');
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        const sanitizedToken = token.trim();

        setIsChecking(true);
        const isUserAuthorized = await checkTokenValidity(sanitizedToken);

        if (isUserAuthorized) {
            onLoginSuccess();
            saveLogin(sanitizedToken);
            setError('');
        } else {
            setError('Invalid API key');
        }

        setIsChecking(false);
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
            <Button className="mt-3" variant="primary" type="submit">
                {isChecking ? 'Checking...' : 'Submit'}
            </Button>
            {error && <Alert variant="danger">{error}</Alert>}
        </Form>
    );
};

export default Login;