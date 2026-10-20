
import { Admin } from 'react-admin';
import { Layout } from './Layout';
import { dataProvider } from './proveedores/dataProvider';


export const App = () => (
    <Admin
        layout={Layout}
        dataProvider={dataProvider}
    >
        
    </Admin>
);

