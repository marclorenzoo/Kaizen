# 🧠 Task & Habit Tracker App

Aplicación web de productividad inspirada en Trello que permite gestionar tareas y realizar seguimiento de hábitos diarios. Construida con Angular 19 y Supabase, enfocada en buenas prácticas, arquitectura escalable y experiencia moderna.

---

## 🚀 Descripción

Esta aplicación permite a los usuarios:

- Crear, editar y completar tareas tipo tablero
- Organizar su flujo de trabajo de forma visual
- Hacer seguimiento de hábitos diarios (habit tracker)
- Autenticarse de forma segura mediante JWT con Supabase

El proyecto está diseñado no solo como una app funcional, sino como una demostración de arquitectura frontend profesional.

---

## 🛠️ Tecnologías utilizadas

- **Angular 19**
- **Tailwind CSS**
- **DaisyUI**
- **Supabase (Auth + Database)**
- **RxJS**

---

## 🧩 Características técnicas clave

El proyecto destaca por aplicar buenas prácticas modernas de Angular:

- 🧱 **Arquitectura modular**
- ⚡ **Lazy Loading** para mejorar el rendimiento
- 🔐 **Guards de autenticación**
- 🔄 **Interceptors** para:
  - Gestión de tokens (JWT)
  - Manejo global de errores
- 📡 **Uso avanzado de RxJS** (más allá de simples `subscribe`)
- 📝 **Formularios reactivos**
- 🧠 **Manejo de estado** (simple pero bien estructurado)

---

## ▶️ Cómo ejecutar el proyecto

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

Crea el archivo `environment.ts`:

```ts
export const environment = {
  production: false,
  supabaseUrl: 'TU_SUPABASE_URL',
  supabaseKey: 'TU_SUPABASE_KEY'
};
```

4. Ejecutar la aplicación:

```bash
ng serve
```

5. Abrir en el navegador:

```
http://localhost:4200
```

---

## 🧼 Buenas prácticas

- Código limpio y mantenible
- Separación de responsabilidades
- Escalabilidad en mente
- Reutilización de componentes
- Tipado fuerte con TypeScript

---

## 📌 Estado del proyecto

🚧 En desarrollo / mejora continua

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Puedes abrir issues o pull requests.

---

## 📄 Licencia

MIT
