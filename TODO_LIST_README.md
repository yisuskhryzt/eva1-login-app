# TODO List - Evaluación N° 2

## Funcionalidades Implementadas

### ✅ Requisitos según EVA 2 URL: https://www.notion.so/borisbelmar/Evaluaci-n-2-En-grupo-2acdc82ee39480cea72ef9117c890151?source=copy_link

1. **Crear tareas con formulario completo**
   - ✅ Título de la tarea
   - ✅ Foto (desde cámara o galería)
   - ✅ Ubicación automática (GPS)

2. **Gestionar tareas**
   - ✅ Eliminar tareas con confirmación
   - ✅ Marcar/desmarcar tareas como completadas
   - ✅ Visualización del estado completado (tachado)
   - ✅ Ver detalles completos de cada tarea
   - ✅ Editar tareas existentes (título, foto, ubicación)

3. **Vincular tareas con usuario (email)**
   - ✅ Las tareas están asociadas al email del usuario
   - ✅ Cada usuario solo ve sus propias tareas
   - ✅ Filtrado automático por usuario autenticado

4. **Persistencia local**
   - ✅ Tareas guardadas en AsyncStorage
   - ✅ Fotos guardadas en el sistema de archivos local del celular
   - ✅ Las tareas persisten al cerrar y abrir la app

## Estructura del Proyecto (usé IA para esta parte)

### Archivos Creados/Modificados

```
types/
  └── Task.ts                    # Interfaces para Task, Location, TaskFormData

utils/
  └── storage.ts                 # Funciones para AsyncStorage y FileSystem

context/
  └── TaskContext.tsx            # Contexto global para manejo de tareas

components/
  ├── TaskItem.tsx               # Componente para mostrar cada tarea (clickeable)
  ├── NewTaskModal.tsx           # Modal para crear nuevas tareas
  ├── TaskDetailModal.tsx        # Modal para ver detalles de tarea
  └── EditTaskModal.tsx          # Modal para editar tareas existentes

app/
  ├── _layout.tsx                # Modificado: agregado TaskProvider
  └── (tabs)/
      ├── _layout.tsx            # Modificado: agregado tab de Tareas
      └── tasks.tsx              # Nueva pantalla de TODO List
```

## Tecnologías Utilizadas

- **@react-native-async-storage/async-storage**: Persistencia de datos de tareas
- **expo-file-system**: Almacenamiento de fotos en el dispositivo
- **expo-image-picker**: Captura de fotos desde cámara o galería
- **expo-location**: Obtención de ubicación GPS y geocoding inverso
- **React Context API**: Manejo de estado global de tareas

## Cómo Usar la Aplicación

### 1. Inicio de Sesión
- Ingresa un email válido
- Usa la contraseña: `1234`

### 2. Crear una Nueva Tarea
1. Ve a la pestaña "Tareas"
2. Presiona el botón "+" (esquina superior derecha)
3. Ingresa un título para la tarea
4. Toma una foto o selecciona de la galería
5. Presiona "Obtener Ubicación" para capturar tu ubicación actual
6. Presiona "Crear Tarea"

### 3. Ver Detalles de una Tarea
1. Toca cualquier tarea del listado
2. Se abrirá un modal con todos los detalles:
   - Foto en tamaño completo
   - Título
   - Estado (completada/pendiente)
   - Ubicación completa (dirección y coordenadas)
   - Fecha y hora de creación
   - Usuario que la creó
3. Presiona "Cerrar" para volver al listado

### 4. Editar una Tarea
1. Abre los detalles de la tarea (toca la tarea)
2. Presiona el botón "✏️ Editar Tarea"
3. Modifica lo que necesites:
   - Cambiar el título
   - Retomar foto o seleccionar nueva de galería
   - Actualizar ubicación
4. Presiona "Guardar Cambios"

### 5. Gestionar Tareas
- **Marcar como completada**: Toca el círculo a la derecha del título
- **Eliminar tarea**: Toca el botón "🗑️ Eliminar" y confirma
- Las tareas completadas aparecen con el título tachado y más transparente

### 6. Información de la Tarea
Cada tarea en el listado muestra:
- 📷 Foto asociada (miniatura)
- 📝 Título
- 📍 Ubicación (dirección o coordenadas)
- 🕐 Fecha y hora de creación
- ✓ Estado de completado

## Permisos Requeridos

La app solicita los siguientes permisos:

1. **Cámara**: Para tomar fotos de las tareas
2. **Galería**: Para seleccionar fotos existentes
3. **Ubicación**: Para asociar la ubicación GPS a las tareas

Los permisos se solicitan automáticamente cuando el usuario intenta usar cada funcionalidad.

## Arquitectura

### TaskContext
El contexto maneja:
- Estado global de todas las tareas
- CRUD operations (Create, Read, Update, Delete)
- Persistencia automática en AsyncStorage
- Filtrado de tareas por usuario

### Storage Utils
Funciones para:
- Guardar/cargar tareas desde AsyncStorage
- Guardar fotos en el sistema de archivos
- Eliminar fotos al eliminar tareas

### Componentes
- **TaskItem**: Muestra cada tarea con foto, info y acciones
- **NewTaskModal**: Formulario modal para crear tareas
- **TasksScreen**: Pantalla principal con lista de tareas

## Flujo de Datos

```
Usuario → NewTaskModal → TaskContext → Storage Utils
                              ↓
                         AsyncStorage + FileSystem
                              ↓
                         TaskContext (actualiza estado)
                              ↓
                         TasksScreen → TaskItem (renderiza)
```

## Características Técnicas

### Validaciones
- ✅ Título requerido (no vacío)
- ✅ Foto requerida
- ✅ Ubicación requerida
- ✅ Confirmación antes de eliminar

### UX/UI
- ✅ Tema claro/oscuro automático
- ✅ Loading states
- ✅ Empty states
- ✅ Iconos descriptivos
- ✅ Feedback visual (tachado para completadas)
- ✅ Sombras y elevaciones
- ✅ Animaciones suaves

### Manejo de Errores
- ✅ Try-catch en todas las operaciones async
- ✅ Alerts informativos para el usuario
- ✅ Logs en consola para debugging
- ✅ Fallbacks para permisos denegados

## Pruebas Recomendadas

1. **Crear tarea**
   - Con cámara
   - Con galería
   - Verificar ubicación

2. **Persistencia**
   - Crear tareas
   - Cerrar app
   - Reabrir app
   - Verificar que las tareas siguen ahí

3. **Multi-usuario**
   - Crear tareas con usuario A
   - Cerrar sesión
   - Iniciar sesión con usuario B
   - Verificar que no ve las tareas de A

4. **Completar/Eliminar**
   - Marcar como completada
   - Desmarcar
   - Eliminar tarea
   - Verificar que la foto también se eliminó

## Comandos

```bash
# Instalar dependencias
npm install

# Iniciar app
npm start

# Limpiar cache si hay problemas
npm start -- --clear
```

## Notas Importantes

1. Las fotos se guardan en el directorio de documentos de la app
2. Las tareas se guardan con el key `@eva1_tasks` en AsyncStorage
3. Cada tarea tiene un ID único generado con timestamp + random
4. La ubicación intenta obtener la dirección (geocoding inverso)
5. Si falla el geocoding, se muestran las coordenadas


---

**Desarrollado para:** Evaluación N° 2 - Desarrollo de Aplicaciones Móviles I
**Estudiantes:**
- Ignacio Riveros
- Ethan Duran
- Andrés Corbacho
- Jesús Flores
**Instituto:** San Sebastián  
**Año:** 2do Año - 3° Trimestre
**Docente:** Boris Belmar
