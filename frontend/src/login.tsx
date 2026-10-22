import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLogin,
    useNotify,
    useTranslate,
} from 'react-admin';

const MyLoginPage = (() => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const notify = useNotify();
    const translate = useTranslate();

    const handleSubmit = (e: FormEvent <HTMLFormElement>) => {
        e.preventDefault();
        // will call authProvider.login({ username, password })
        login({ username, password }).catch(() =>
            notify('Login Failed')
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                {translate('ra.auth.username')}
                <input
                    name="username"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </label>
            <label>
                {translate('ra.auth.password')}
                <input
                    name="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </label>
            <button type="submit">{translate('ra.auth.sign_in')}</button>
        </form>
    );
});

export default MyLoginPage;