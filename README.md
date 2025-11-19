# EVA1 Login App

Aplicación móvil desarrollada con **React Native** y **Expo** que incluye autenticación de usuarios, gestión de tareas y perfil de usuario.

## 📋 Requisitos Previos

- **Node.js** (v16 o superior)
- **npm** o **yarn**
- **Expo CLI** (instalado globalmente)
- Emulador de Android/iOS o dispositivo físico

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd eva1-login-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Expo CLI** (si no está instalado)
   ```bash
   npm install -g expo-cli
   ```

## ▶️ Ejecutar la Aplicación

### En desarrollo
```bash
npm start
```

### En Android
```bash
npm run android
```

### En iOS
```bash
npm run ios
```

### En Web
```bash
npm run web
```

## 📝 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Inicia el servidor de desarrollo |
| `npm run android` | Ejecuta en emulador/dispositivo Android |
| `npm run ios` | Ejecuta en simulador/dispositivo iOS |
| `npm run web` | Ejecuta en navegador web |

## 🔐 Autenticación

La aplicación utiliza un sistema de autenticación simple basado en:
- Almacenamiento seguro de credenciales en **AsyncStorage**
- Contexto global para gestionar el estado de sesión
- Redirección automática según estado de autenticación


## 💾 Almacenamiento de Datos

- **AsyncStorage**: Para credenciales de usuario y datos de tareas
- **Expo FileSystem**: Para archivos adicionales

