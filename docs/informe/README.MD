# 📑 INFORME

## 📅 FECHA - 16 de agosto del 2020

## ***Setup y configuracion inicial del proyecto***
### **Objetivo:** Crear la configuracion del proyecto a traves del CLI, integrar las carpetas nativas de ios y android e instalar las dependencias de Capacitor.<br /><br />

1. Creación de la estructura con el CLI de Ionic.

    ![](./images/imagen-1.png)

2. Instalamos Capacitor para utilizar los componentes de los dispositivos móviles a través de los plugins que ofrece el Framework.

    ![](./images/imagen-2.png)

3. Inicializamos Capacitor con la información de la aplicación, que corresponde al "appName" y al "appId".

    ![](./images/imagen-3.png)

4. Hacemos el Build de nuestra aplicación, esto creará la carpeta "www".

    ![](./images/imagen-4.png)

5. Agregamos las plataformas de Ios y Android que corresponden a los proyectos nativos.

    ![](./images/imagen-5.png)

    ![](./images/imagen-6.png)

6. Se agrega al mismo nivel del root de la aplicación, las carpetas "informe" y "doc".

    ![](./images/imagen-7.png)

### Estructura Base del proyecto:

![](./images/imagen-8.png)

+ La carpeta ios y android, corresponden a las aplicaciones móviles nativas cofiguradas a través del webView.
+ La carpeta src contiene la aplicación HTML, CSS y JavaScript
+ Los archivos .JSON corresponden a configuraciones realizadas por el CLI de Ionic, como por ejemplo las dependencias de la aplicación.

## ***Estructura inicial de la Aplicación***
### **Objetivo:** Establecer carpetas, rutas y componentes básicos en la aplicación que serán de utilidad en todo el proyecto.
### **Consideraciones:** En este apartado se tomarán componentes de la plantilla asignada y se procederá a establecer una estructura de la aplicación siguiendo las mejores prácticas establecidas en la documentación de John Papa. <br /><br />

### Estructura base de la carpeta src:
***NOTA: Esta configuracion inicial puede variar***

![](./images/imagen-9.png)

+ La carpeta Core contiene un modulo y funciona para establecer todos los servicios hacia las APIS externas, en este caso, todas las peticiones hacia Firebase. Su módulo se importa en el app.module para utilizarlo en cualquier parte de la aplicación.
+ La carpeta home es el componente que se carga al iniciar la aplicación. Este componente será modificado posteriormente.
+ La carpeta page-not-found contiene el módulo y las página que se va a establecer al momento de no conseguir alguna ruta especificada en la aplicación.
+ La carpeta shared va a contener alertas, notificaciones, pipes y otros componentes que se comparten entre todos los componentes y que pueden reutilizarse.
+ La carpeta shell, corresponde a una forma de crear esqueleto de precargado de los datos en la aplicación. Tambien posee el DataStore para hacer de una manera más fluida la obtención y envío de información sin necesidad de bloquear las funcionalidades de la aplicación mientras se espera por los datos.
+ La carpeta assets contiene iconos e imagenes estáticas de la aplicación, como por ejemplo la imagen que carga en page-not-found.
+ La carpeta environments contiene las variables de entorno y api Keys de la aplicación. **Por motivos de seguridad, esta carpeta no será publicada en el repositorio, debido a que es público**.
+ La carpeta theme, contiene información referente a los estilos scss globales de la aplicación.<br /><br />

## 📅 FECHA - 17 de agosto del 2020
## ***Setup y configuracion inicial de Firebase***
### **Objetivo:** Configurar los servicios de autenticación de firebase, el servicio de Cloud Firestore para la base de datos y establecer la configuración entre el proyecto y los servicios necesarios de Firebase.<br /><br />

### CONFIGURACIÓN DE FIREBASE - PLATAFORMA
1. Una vez en la consola del proyecto en Firebase, habilitamos el método de inicio de sesión por correo electrónico/contraseña. Esto va a permitir la autenticación por correo electrónico.

![](./images/imagen-10.png)

2. Configuramos Cloud Firestore para la capa de persistencia de la aplicación. Para esto establecemos su ubicación en us-central.

![](./images/imagen-11.png)

3. Establecemos las reglas de seguridad de la base de datos. En este caso como estamos en etapa de desarrollo, se permitirá agregar y leer documentos de la base de datos.

    ![](./images/imagen-12.png)

4. Configuramos la aplicación web en firebase para que nos asignen las claves y variables de acceso a los servicios.

    ![](./images/imagen-16.png)

### CONFIGURACIÓN DE FIREBASE - APLICACIÓN
**Nota: Debemos tener instalado el CLI de Firebase de forma global**

1. Instalamos la libreria de AngularFire para conectar Firebase con la aplicación. Esta libreria tambien posee lo necsario para hacer las peticiones de autenticación y de Cloud Firestore.

    ![](./images/imagen-13.png)

2. Agregamos las variables de entorno que nos proporciona Firebase en el environment.ts y environment.prod.ts. **Por motivos de seguridad, no se colocará una imagen en este apartado**

3. Accedemos a Firebase a través del siguiente comando.

    ![](./images/imagen-14.png)

4. Iniciamos el proyecto de Firebase en la aplicación. Seleccionamos Firestore para utilizar los servicios de la base de datos.

    ![](./images/imagen-15.png)

+ Esto creará los archivos de configuración para el proyecto, .firebaserc, firebase.json y firestore.indexes.json. El proyecto estará listo para utilizar los servicios de Firebase.

## ***Modelo no Relacional de la Base de Datos***
**NOTA: La siguiente imagen es una estructura inicial que se propone para representar la forma en que serán almacenados los datos en Firebase, siguiendo la documentación oficial y un esquema orientado a documentos.**

![](./images/Diagrama.png)

## 📅 FECHA - 19 de agosto del 2020
### **Primera reunion con el tutor empresarial.**
Se conversó sobre el flujo de trabajo y se plantearon los primeros issues para la semana inicial.

## 📅 FECHA - 20 de agosto del 2020
## **Inicio de sesión en la aplicación**

1. Se crea la carpeta auth, que contendrá todo lo relacionacio a la autenticación del usuario, olvido de contraseña, registro y reseteo de clave.

    1.1 Dentro de esta carpeta se encuentra la carpeta sign-in, que  correspondiente a la página y todo el contenido HTML. Se importa estos archivos al módulo de autenticación y se hacen los respectivos ajustes para crear las rutas de navegación.

    ![](./images/imagen-17.png)

2. En la carpeta core, se crea la carpeta services, que contiene toda la información de las peticiones y llamadas a firebase.

    2.1 Creamos dentro de la carpeta service el archivo "auth.service.ts" que contiene toda la lógica de negocio correspondiente al inicio de sesión. Además contendrá toda la lógica correspondiente al registro, olvido de contraseña y recuperación de contraseña para mantener al usuario autenticado.

    ![](./images/imagen-18.png)

3. Se agregan los botones de registro y recuperación de contraseña que serán implementados posteriormente.

## 📅 FECHA - 21 de agosto del 2020
## **Registro de usuario**

1. Se crea la página de registro dentro de la carpeta auth, con el nombre de "sign-up", esta carpeta contiene toda la logica de la página, estilos y código HTML correspondiente al registro.

    1.1 Se agregan el componente al módulo de autenticación y se elaboran las rutas específicas para su accesso en la aplicacíon.

    ![](./images/imagen-19.png)

2. Se crea en la carpeta core/services, el archivo "user.service.ts", el cual contiene la información relacionada a la lógica de negocio del crud de usuario.

    2.1 Se implementa los métodos necesarios de autenticación de usuario para el registro en firebase, dentro del archivo "auth.service.ts"

    ![](./images/imagen-20.png)

3. Se crean las reglas de la base de datos en firebase para asegurar los datos de los usuarios. **Por motivos de seguridad esta imagen no será mostrada.**

4. Se crea el archivo "storage.service.ts", en la carpeta core/services, el cual contiene toda la información referente a el almacenamiento de archivos e imágenes en firebase storage.

    ![](./images/imagen-21.png)

4. Se inicializa el Storage en firebase para almacenar las imágenes de los usuarios.

## 📅 FECHA - 22 de agosto del 2020
## **Perfil de  y editar datos personales**

1. se agrega una nueva página en la carpeta "app/profile". Esta contiene toda la lógica del perfil de usuario correspondiente a la página, los estilos y código HTML.

    ![](./images/imagen-22.png)

    1.1 Se crea el guard y el resolver para prevenir que los usuarios puedan acceder a esta ruta si no poseen una sesión activa.

2. Se agrega enl archivo "user.service.ts" los metodos necesarios para obtener el usuario de la base de datos. Cabe destacar que para un mejor rendimiento, optimización y reducción de costors, la información del usuario se guarda en caché una vez inicia sesión.

3. se implementa el cierre de sesión y la vista de editar perfil en esta página. Para ello se agrega los métodos necesarios en los servicios de la aplicación.

## 📅 FECHA - 23 de agosto del 2020
## **Olvido de contraseña y reseteo de contraseña**

1. Se crean los métodos necesarios en la carpeta core/auth.service.ts para implementar el olvido de contraseña por correo y cambio de contraseña en el componente de editar información del usuario.

2. Se crea la vista de olvido de contraseña en la carpeta auth/forgot-password

    ![](./images/imagen-23.png)

## 📅 FECHA - 24 de agosto del 2020
## **Estructura del tab de navegación**

1. se crea en la carpeta app/tabs toda la lógica correspondiente a la navegación principal de la aplicación. Esta carpeta contiene un archivo de rutas para que el usuario pueda navegar, además del codigo HTML y sus estilos.

    ![](./images/imagen-24.png)

    1.1 Se hace un cambio en el app routing para que al cargar este componente, se conecte directamente a esta página y esta sea la encargada de manejar la navegación.

## 📅 FECHA - 25 de agosto del 2020
## **Segunda reunión con el tutor empresarial**

1. Se muestra los avances del proyecto.
2. Se observan algunos cambios visuales.
3. Se agrega en la carpeta configurations dos archivos.

+ roles.ts para mantener centralizado los roles de la aplicación.
+ staticText.ts para mantener centralizado el contenido estático de la aplicación, como el texto.

4. En la carpeta assets/icons se coloca el logo de la aplicación y el de la empresa.

5. se modifican cambios visuales y estéticos en las diferentes vistas de la aplicación.

## 📅 FECHA - 26 de agosto del 2020
## **Tercera reunión con el tutor empresarial**

1. Se agregaron nuevos issues a elaborar.
2. Se definieron nuevos ajustes en las vistas.
3. Se agrega internacionalización i18n, por lo que se elimina de configurations el archivo staticText.ts y se crea una carpeta en assets/i18n que contendrá los archivos JSON con las traducciones.

    ![](./images/imagen-30.png)

## 📅 FECHA - 28 de agosto del 2020
## **Nuevas funcionalidades**

1. Se realizan cambios visuales en la aplicación
2. Se implementa la pantalla de envío de mensajes.

    1.1 Para esto se utiliza la Librería de QuillJs. Se prueba en Dispositivos android y funciona correctamente.

    1.2 Se crea la vista send-message, que contiene toda la lógica de creación de mensajes, así como sus archivos HTML y CSS.

    ![](./images/imagen-31.png)

    1.3 Se crea la carpeta "message.service.ts" con la finalidad de tener centralizacos los servicios correspondiente al manejo del os mensajes dentro de la aplicación.

    ![](./images/imagen-32.png)

    1.4 se implementa la navegación hacia todas las vistas (Nuevo, Enviados, Buscador, Reciibidos y Perfil).

## 📅 FECHA - 29 de agosto del 2020
## **Nuevas funcionalidades**

1. Se implementa el componente para realizar envío de mensajes múltiples. Se puede seleccionar en la aplicación a varios usuarios y enviar un mismo mensaje a la vez.

    1.1 Este componente se crea dentro de la vista de envío de mensaje.

    ![](./images/imagen-33.png)

    1.2 se crea un pipe en la carpeta shared que tendrá la funcionalidad del buscador y podrá ser implementado en varios componentes.

    ![](./images/imagen-34.png)


## 📅 FECHA - 30 de agosto del 2020
## **Nuevas funcionalidades**

1. Se implementa la vista de mensajes enviados, creando un componente "sended-message"

    1.1 dentro del componente se crea una barra de navegación que utliza el pipe creado anteriormente para buscar los mensajes de los usuarios.

    ![](./images/imagen-35.png)


## 📅 FECHA - 31 de agosto del 2020
## **Nuevas funcionalidades**

1. Se implementa una funcionalidad para que en los mensajes enviados no se tengan que realizar peticiones seguidas a la base de datos.

2. Se corrigen aspectos visuales en la aplicación.

3. Se crea un pipe para saber si un mensaje es o no publicable.

    3.1 Este pipe se coloca dentro de la carpeta shared.
    
    ![](./images/imagen-37.png)

4. Se hace un cambio de estructura de la base de datos, con el fin de no duplicar informacion en los mensajes enviados y recibidos. En esta situación se procede a crear una única colección donde se centralizan los datos.

## 📅 FECHA - 1 de septiembre del 2020
## **Nuevas funcionalidades**

1. Se implementa la vista del detalle de mensaje.

    1.1 Se crea un componente compartido en la carpeta shared denominado message-detail. Este componente será utilizado tanto para el detalle de los mensajes enviados, recibidos y los mensajes del perfil del usuario.

    ![](./images/imagen-38.png)

2. Se implementa la vista de mensajes recibidos,
creando un componente received-message

    1.1 dentro del componente se crea una barra de navegación que utliza el pipe creado anteriormente para buscar los mensajes de los usuarios.

    ![](./images/imagen-36.png)

## 📅 FECHA - 2 de septiembre del 2020
## **Cuarta reunión con el tutor empresarial**

1. Se definen nuevos issues.
2. Se corrigen cambios visuales.
3. Se establecen funcionalidades adicionales en la aplicación.

## 📅 FECHA - 3 de septiembre del 2020
## **Nuevas funcionalidades**

1. Se arregla problemas con la fecha en los mensajes enviados y recibidos.

2. Se hace una investigación sobre el hosting de imágenes de firebase para no tener que hacer peticiones tan seguidas a la base de datos.

3. Se crea un archivo en la carpeta configurations para centralizar los iconos de la aplicación.

    ![](./images/imagen-39.png)

## 📅 FECHA - 4 de septiembre del 2020
## **Nuevas funcionalidades**

1. Se implementa el conteo de votos positivos y negativos tanto de mensajes enviados como de recibidos en el perfil de usuario.

## 📅 FECHA - 5 de septiembre del 2020
## **Nuevas funcionalidades**

1. Se implementa la funcionalidad de likes y dislikes de mensajes enviados y recibidos en el perfil de usuario.

2. Se corrigen detalles visuales.

3. Se hace el esquema del boton para supervisores y administradores, el cual contendrá las opciones o funcionalidades adicionales, que son propias de cada cargo. Este botón se puede mover por toda la pantalla y colocarlo donde sea menos incómodo para el usuario.

## 📅 FECHA - 6 de septiembre del 2020
## **Nuevas funcionalidades**

1. Se crea el buscador.
2. Se implementa la funcion de ladministrador para cambiar cargos de trabajadores y supervisores.
    1.1 Se crean los servicios necesarios en la carpeta core.
    1.2 se crea el modulo que contiene la logica del cambio de cargos de trabajadores y supervisores.

## 📅 FECHA - 7 de septiembre del 2020
## **Nuevas funcionalidades**

1. Se implementa la funcion del administrador para asignar trabajadores a supervisores.
    1.1 Se crean los servicios necesarios en la carpeta core.
    1.2 se crea el modulo que contiene la logica para asignar trabajadores a supervisores.

## 📅 FECHA - 8 de septiembre del 2020
## **Nuevas funcionalidades**

1. Se implementa la funcion del supervisor para ver sus trabajadores asignados, con todos los mensajes tanto publicos como privados y poder calificarlos.
    1.1 Se crean los servicios necesarios en la carpeta core.
    1.2 Se crea el modulo que contiene tola la logica para ver los trabajadores que un supervisor tiene asignado.

## 📅 FECHA - 13 de septiembre del 2020
## **Nuevas funcionalidades**

1. Se implementa el ranking de trabajadores
    1.1 Se crean los servicios necesarios en la carpeta core.
    1.2 Se crea el modulo que contiene tola la logica del ranking de trabajadores.

## 📅 FECHA - 16 de septiembre del 2020
## **Reunión con el tutor empresarial**

1. se crean nuevos issues.
2. Se plantean cambios visuales.

## 📅 FECHA - 17 de septiembre del 2020
## **Mejoras**

1. Se realizan cambios visuales en la aplicacion.

## 📅 FECHA - 18 de septiembre del 2020
## **Mejorass**

1. Se realizan cambios visuales en la aplicacion.
2. Se corrigen errores en la logica de la palicacion.
3. Se realizan pruebas de aceptacion.

## 📅 FECHA - 21 de septiembre del 2020
## **Mejoras**

1. Se realizan cambios visuales en la aplicacion.
2. Se corrigen errores en la logica de la palicacion.
3. Se realizan pruebas de aceptacion.

## 📅 FECHA - 22 de septiembre del 2020
## **Mejoras**

1. refactorizacion en la logica de la aplicacion.
2. pruebas de aceptacion.