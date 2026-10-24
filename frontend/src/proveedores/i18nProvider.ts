//! para este código tome como base el codigo de react admin (https://marmelab.com/react-admin/Translation.html)

import polyglotI18nProvider from 'ra-i18n-polyglot';
import type { TranslationMessages } from 'react-admin';

export const spanishMessages: TranslationMessages = {
    ra: {
        action: {
            add: 'Agregar',
            back: 'Regresar',
            bulk_actions: '1 elemento seleccionado |||| %{smart_count} elementos seleccionados',
            cancel: 'Cancelar',
            clear_input_value: 'Limpiar valor',
            confirm: 'Confirmar',
            create: 'Crear',
            create_item: 'Crear %{item}',
            delete: 'Eliminar',
            edit: 'Editar',
            export: 'Exportar',
            list: 'Lista',
            refresh: 'Actualizar',
            remove: 'Quitar',
            reset: 'Restablecer',
            save: 'Guardar',
            search: 'Buscar',
            select_all: 'Seleccionar todo',
            select_all_button: 'Seleccionar todo',
            select_row: 'Seleccionar esta fila',
            show: 'Mostrar',
            sort: 'Ordenar',
            undo: 'Deshacer',
            unselect: 'Deseleccionar',
            close: 'Cerrar',
            open_menu: 'Abrir menú',
            close_menu: 'Cerrar menú',
            update: 'Actualizar',
            open: 'Abrir',
            toggle_theme: 'Cambiar modo claro/oscuro',
            update_application: 'Recargar aplicación',
            add_filter: 'Añadir filtro',
            clear_array_input: 'Vaciar la lista',
            clone: 'Duplicar',
            remove_filter: 'Quitar este filtro',
            remove_all_filters: 'Quitar todos los filtros',
            search_columns: 'Buscar columnas',
            expand: 'Expandir',
            move_up: 'Subir',
            move_down: 'Bajar',
            select_columns: 'Columnas',
        },
        boolean: {
            true: 'Sí',
            false: 'No',
            null: ' ',
        },
        page: {
            create: 'Crear %{name}',
            dashboard: 'Panel principal',
            edit: '%{name} %{recordRepresentation}',
            error: 'Algo salió mal',
            list: '%{name}',
            loading: 'Cargando',
            not_found: 'No encontrado',
            show: '%{name} %{recordRepresentation}',
            empty: 'Todavía no hay %{name}.',
            invite: '¿Deseas agregar uno?',
            access_denied: 'Acceso denegado',
            authentication_error: 'Error de autenticación',
        },
        input: {
            references: {
                all_missing: 'No se encontraron los datos de referencia.',
                many_missing:
                    'Al menos una de las referencias asociadas ya no parece estar disponible.',
                single_missing:
                    'La referencia asociada ya no parece estar disponible.',
            },
            password: {
                toggle_visible: 'Ocultar contraseña',
                toggle_hidden: 'Mostrar contraseña',
            },
            file: {
                upload_several: 'Arrastra algunos archivos para subirlos, o haz clic para elegirlos.',
                upload_single: 'Arrastra un archivo para subirlo, o haz clic para elegirlo.',
            },
            image: {
                upload_several: 'Arrastra algunas imágenes para subirlas, o haz clic para elegirlas.',
                upload_single: 'Arrastra una imagen para subirla, o haz clic para elegirla.',
            },
        },
        message: {
            about: 'Acerca de',
            access_denied:
                'No tienes los permisos necesarios para acceder a esta página',
            are_you_sure: '¿Estás seguro?',
            authentication_error:
                'El servidor de autenticación devolvió un error y no se pudieron validar tus credenciales.',
            auth_error:
                'Ocurrió un error al validar el token de autenticación.',
            bulk_delete_content:
                '¿Estás seguro de que quieres eliminar este %{name}? |||| ¿Estás seguro de que quieres eliminar estos %{smart_count} elementos?',
            bulk_delete_title:
                'Eliminar %{name} |||| Eliminar %{smart_count} %{name}',
            bulk_update_content:
                '¿Estás seguro de que quieres actualizar %{name} %{recordRepresentation}? |||| ¿Estás seguro de que quieres actualizar estos %{smart_count} elementos?',
            bulk_update_title:
                'Actualizar %{name} %{recordRepresentation} |||| Actualizar %{smart_count} %{name}',
            delete_content: '¿Estás seguro de que quieres eliminar este %{name}?',
            delete_title: 'Eliminar %{name} %{recordRepresentation}',
            details: 'Detalles',
            error: 'Ocurrió un error y tu solicitud no pudo completarse.',
            invalid_form: 'El formulario no es válido. Por favor revisa los errores',
            loading: 'Espera un momento por favor',
            no: 'No',
            not_found:
                'Escribiste una URL incorrecta, o seguiste un enlace equivocado.',
            select_all_limit_reached:
                'Hay demasiados elementos para seleccionarlos todos. Solo se seleccionaron los primeros %{max} elementos.',
            unsaved_changes:
                'Algunos cambios no se guardaron. ¿Estás seguro de que quieres ignorarlos?',
            yes: 'Sí',
            placeholder_data_warning: 'Problema de red: no se pudo actualizar la información.',
            clear_array_input: '¿Seguro que quieres vaciar toda la lista?',
        },
        navigation: {
            clear_filters: 'Quitar filtros',
            no_filtered_results: 'No se encontraron %{name} con los filtros actuales.',
            no_results: 'No se encontraron %{name}',
            no_more_results:
                'La página número %{page} está fuera de los límites. Prueba con la página anterior.',
            page_out_of_boundaries: 'La página número %{page} está fuera de los límites',
            page_out_from_end: 'No se puede avanzar después de la última página',
            page_out_from_begin: 'No se puede retroceder antes de la página 1',
            page_range_info: '%{offsetBegin}-%{offsetEnd} de %{total}',
            partial_page_range_info:
                '%{offsetBegin}-%{offsetEnd} de más de %{offsetEnd}',
            current_page: 'Página %{page}',
            page: 'Ir a la página %{page}',
            first: 'Ir a la primera página',
            last: 'Ir a la última página',
            next: 'Ir a la página siguiente',
            previous: 'Ir a la página anterior',
            page_rows_per_page: 'Filas por página:',
            skip_nav: 'Saltar al contenido',
        },
        sort: {
            sort_by: 'Ordenar por %{field_lower_first} %{order}',
            ASC: 'ascendente',
            DESC: 'descendente',
        },
        auth: {
            auth_check_error: 'Por favor inicia sesión para continuar',
            user_menu: 'Perfil',
            username: 'Usuario',
            password: 'Contraseña',
            sign_in: 'Iniciar sesión',
            sign_in_error: 'Error de autenticación, por favor intenta de nuevo',
            logout: 'Cerrar sesión',
            email: 'Correo electrónico',
        },
        notification: {
            updated: 'Elemento actualizado |||| %{smart_count} elementos actualizados',
            created: 'Elemento creado',
            deleted: 'Elemento eliminado |||| %{smart_count} elementos eliminados',
            bad_item: 'Elemento incorrecto',
            item_doesnt_exist: 'El elemento no existe',
            http_error: 'Error de comunicación con el servidor',
            data_provider_error:
                'Error del dataProvider. Revisa la consola para más detalles.',
            i18n_error:
                'No se pudieron cargar las traducciones para el idioma especificado',
            canceled: 'Acción cancelada',
            logged_out: 'Tu sesión ha terminado, por favor vuelve a conectarte.',
            not_authorized: 'No estás autorizado para acceder a este recurso.',
            application_update_available: 'Hay una nueva versión disponible.',
            offline: 'Sin conexión. No se pudo obtener la información.',
        },
        validation: {
            required: 'Obligatorio',
            minLength: 'Debe tener al menos %{min} caracteres',
            maxLength: 'Debe tener %{max} caracteres o menos',
            minValue: 'Debe ser al menos %{min}',
            maxValue: 'Debe ser %{max} o menos',
            number: 'Debe ser un número',
            email: 'Debe ser un correo válido',
            oneOf: 'Debe ser uno de: %{options}',
            regex: 'Debe tener un formato específico: %{pattern}',
            unique: 'Ya existe, debe ser único',
        },
        saved_queries: {
            label: 'Búsquedas guardadas',
            query_name: 'Nombre de la búsqueda',
            new_label: 'Guardar búsqueda actual...',
            new_dialog_title: 'Guardar búsqueda actual como',
            remove_label: 'Quitar búsqueda guardada',
            remove_label_with_name: 'Quitar búsqueda "%{name}"',
            remove_dialog_title: '¿Quitar búsqueda guardada?',
            remove_message: '¿Seguro que quieres quitar esta búsqueda de tu lista?',
            help: 'Filtra la lista y guarda esta búsqueda para después',
        },
        guesser: {
            empty: {
                title: 'No hay datos para mostrar',
                message: 'Revisa tu proveedor de datos',
            },
        },
        configurable: {
            customize: 'Personalizar',
            configureMode: 'Configurar esta página',
            inspector: {
                title: 'Inspector',
                content: 'Pasa el cursor sobre los elementos para configurarlos',
                reset: 'Restablecer configuración',
                hideAll: 'Ocultar todo',
                showAll: 'Mostrar todo',
            },
            Datagrid: {
                title: 'Tabla',
                unlabeled: 'Columna sin nombre #%{column}',
            },
            SimpleForm: {
                title: 'Formulario',
                unlabeled: 'Campo sin nombre #%{input}',
            },
            SimpleList: {
                title: 'Lista',
                primaryText: 'Texto principal',
                secondaryText: 'Texto secundario',
                tertiaryText: 'Texto terciario',
            },
        },
    },
    //? nombres de las colecciones y sus campos, react-admin los usa en títulos y
    //? en los campos que no tienen label escrito en la vista
    resources: {
        infantes: {
            name: 'Infante |||| Infantes',
            fields: {
                matricula: 'Matrícula',
                nombre: 'Nombre(s)',
                paterno: 'Apellido paterno',
                materno: 'Apellido materno',
                genero: 'Sexo',
                curp: 'CURP',
                fnac: 'Fecha de nacimiento',
                freg: 'Fecha de registro',
                ebdi: 'EBDI',
                activo: 'Activo',
                baja: 'Baja',
                fBaja: 'Fecha de baja',
                motivoBaja: 'Motivo de baja',
                ebdiAnt: 'EBDI anterior',
                tallaMama: 'Talla de la mamá (cm)',
                tallaPapa: 'Talla del papá (cm)',
                tallaBlancoFamiliar: 'Talla blanco familiar (cm)',
                ultimaMedicion: 'Última medición',
            },
        },
        mediciones: {
            name: 'Medición |||| Mediciones',
            fields: {
                infanteId: 'Infante',
                fecha: 'Fecha de medición',
                peso: 'Peso (kg)',
                talla: 'Talla (cm)',
                perimetroCefalico: 'Perímetro cefálico (cm)',
            },
        },
        estancias: {
            name: 'Estancia |||| Estancias',
            fields: {
                numero: 'Número de EBDI',
                nombre: 'Nombre',
                tipo: 'Tipo',
                estado: 'Estado',
                region: 'Región',
            },
        },
        usuarios: {
            name: 'Persona del personal |||| Personal',
            fields: {
                nombre: 'Nombre completo',
                email: 'Correo',
                rol: 'Rol',
                estanciaId: 'Estancia',
                region: 'Región',
                activo: 'Cuenta activa',
            },
        },
        tutores: {
            name: 'Tutor |||| Tutores',
            fields: {
                nombre: 'Padre, madre o tutor',
                ciudad: 'Ciudad',
            },
        },
    },
};

export const i18nProvider = polyglotI18nProvider(() => spanishMessages, 'es');
