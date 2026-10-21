import { AppBar, TitlePortal, ToggleThemeButton } from 'react-admin';

export const MyAppBar = () => (
    <AppBar toolbar={<ToggleThemeButton />}>
        <TitlePortal />
    </AppBar>
);
