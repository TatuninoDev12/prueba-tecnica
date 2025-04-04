# Prueba Técnica

## Tabla de Contenidos

- [Acerca de](#acerca-de)
- [Comenzando](#comenzando)
  - [Requisitos Previos](#requisitos-previos)
  - [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologias](#tec)

# Acerca de <a id="acerca-de"></a>

Esta aplicación es una prueba técnica desarrollada con el propósito de demostrar habilidades en el desarrollo frontend. La aplicación incluye funcionalidades clave como la gestión de datos, interacción con APIs y una interfaz de usuario moderna y responsiva. Está diseñada para ser fácil de usar y mantener, utilizando tecnologías modernas como React y Vite.

## Comenzando <a id="comenzando"></a>

Sigue estas instrucciones para obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas.

# Requisitos Previos <a id="requisitos-previos"></a>

Asegúrate de tener instalados los siguientes programas:

- Node.js (versión 16 o superior)
- npm o yarn
- Un navegador web moderno

# Instalación <a id="instalación"></a>

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/tu-usuario/prueba-tecnica.git
   cd prueba-tecnica
   ```

2. Instala las dependencias necesarias:

   ```bash
   npm install
   ```

3. Crea archivo .env donde estara la api para poder realizar la consulta a la API:

   ```bash
   VITE_API_KEY=api_key
   ```

4. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abre tu navegador y navega a `http://localhost:5173` para ver la aplicación en funcionamiento.

# Uso <a id="uso"></a>

- Dar click en el boton que se encuentra al final de la pagina para ver mas images.

# Estructura del Proyecto <a id="estructura-del-proyecto"></a>

El proyecto está organizado de la siguiente manera:

```
/src
  /components    # Componentes reutilizables de la interfaz
  /pages         # Páginas principales de la aplicación
  /hooks         # Hooks personalizados
  /store         # Gestión del estado global
  /assets        # Recursos estáticos como imágenes y estilos
  index.css        # Para estilos generales
  App.tsx        # Componente principal de la aplicación
  main.tsx       # Punto de entrada de la aplicación
```

# 👨‍💻 Tecnologias <a id="tec" ></a>

- React
- Tanstack
- react-router-dom
- styled-components
- sweetalert2
- zustand
