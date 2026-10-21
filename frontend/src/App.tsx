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
      <Resource name="posts" list={PostList} show={PostShow} edit={PostEdit} create={PostCreate} icon={PostIcon} />
      <Resource name="users" list={UserList} show={UserShow} edit={UserEdit} create={UserCreate} icon={UserIcon} />
      <Resource name="comments" list={CommentList} show={CommentShow} edit={CommentEdit} create={CommentCreate} icon={CommentIcon} />
      <Resource name="albums" list={AlbumList} show={AlbumShow} edit={AlbumEdit} create={AlbumCreate} icon={AlbumIcon} />
      <Resource name="photos" list={PhotoList} show={PhotoShow} edit={PhotoEdit} create={PhotoCreate} icon={PhotoIcon} />
      <Resource name="todos" list={TodoList} show={TodoShow} edit={TodoEdit} create={TodoCreate} icon={TodoIcon} />
    </Admin>
);
