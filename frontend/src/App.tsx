import { Admin, Resource } from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./proveedores/dataProvider";
import { tema } from "./theme";
import { Dashboard } from "./guia/dashboard";  //dashboard

//^ crud
import { PostList, PostShow, PostEdit, PostCreate } from "./guia/posts";
import { UserList, UserShow, UserEdit, UserCreate } from "./guia/users";
import { CommentList, CommentShow, CommentEdit, CommentCreate } from "./guia/comments";
import { PhotoList, PhotoShow, PhotoEdit, PhotoCreate } from "./guia/photos";
import { AlbumList, AlbumShow, AlbumEdit, AlbumCreate } from "./guia/albums";
import { TodoList, TodoShow, TodoEdit, TodoCreate } from "./guia/todos";

//^ vistas de Padrón Infantil
import { Curvas } from "./vistas/curvas";
import CurvasIcon from '@mui/icons-material/ShowChart';
import { Tutor } from "./vistas/tutor";
import TutorIcon from '@mui/icons-material/FamilyRestroom';
import { Coordinador } from "./vistas/coordinador";
import CoordinadorIcon from '@mui/icons-material/Assessment';
import { Panel } from "./vistas/admin";
import AdminIcon from '@mui/icons-material/AdminPanelSettings';
import { MedicionCreate } from "./vistas/captura";


//^ traducción
import { authProvider } from "./proveedores/authProvider";
import { i18nProvider } from "./proveedores/i18nProvider";

//^ iconos
import PostIcon from '@mui/icons-material/Feed';
import UserIcon from '@mui/icons-material/Person3';
import CommentIcon from '@mui/icons-material/Comment';
import AlbumIcon from '@mui/icons-material/Collections';
import PhotoIcon from '@mui/icons-material/Image';
import TodoIcon from '@mui/icons-material/Checklist';

export const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider}
        theme={tema}
        dashboard={Dashboard} i18nProvider={i18nProvider} layout={Layout} >
          
      <Resource name="curvas" options={{ label: "Curvas de crecimiento" }} list={Curvas} icon={CurvasIcon} />
      <Resource name="tutor" options={{ label: "Vista del tutor" }} list={Tutor} icon={TutorIcon} />
      <Resource name="coordinador" options={{ label: "Vista del coordinador" }} list={Coordinador} icon={CoordinadorIcon} />
      <Resource name="mediciones" options={{ label: "Captura de medidas" }} create={MedicionCreate} />
      <Resource name="admin" options={{ label: "Panel del administrador" }} list={Panel} icon={AdminIcon} />
      <Resource name="posts" list={PostList} show={PostShow} edit={PostEdit} create={PostCreate} icon={PostIcon} />
      <Resource name="users" list={UserList} show={UserShow} edit={UserEdit} create={UserCreate} icon={UserIcon} />
      <Resource name="comments" list={CommentList} show={CommentShow} edit={CommentEdit} create={CommentCreate} icon={CommentIcon} />
      <Resource name="albums" list={AlbumList} show={AlbumShow} edit={AlbumEdit} create={AlbumCreate} icon={AlbumIcon} />
      <Resource name="photos" list={PhotoList} show={PhotoShow} edit={PhotoEdit} create={PhotoCreate} icon={PhotoIcon} />
      <Resource name="todos" list={TodoList} show={TodoShow} edit={TodoEdit} create={TodoCreate} icon={TodoIcon} />
    </Admin>
);
