// UBICACIÓN: /DEPLOYMENT_GUIDE.md
# 🚀 Guía Completa de Despliegue - ROUND2BOX en Firebase Hosting

## 📋 Pre-requisitos

✅ Node.js 18+ instalado  
✅ npm instalado  
✅ Cuenta Google  
✅ Proyecto Firebase ya creado: `round2box-11d85`

## 🔑 Paso 1: Instalar Firebase CLI

```bash
# En PowerShell como Administrador
npm install -g firebase-tools

# Verificar instalación
firebase --version
```

**Esperado:** Verás la versión de Firebase CLI (ej: 13.0.0)

---

## 🔐 Paso 2: Autenticarse en Firebase

```bash
# Abre navegador para login
firebase login

# Selecciona tu cuenta Google (round2box-11d85)
```

**Esperado:** 
```
✔ Success! Logged in as tu@email.com
```

---

## 📦 Paso 3: Compilar la Aplicación

```bash
# En la carpeta del proyecto
npm run build

# Esto genera la carpeta 'dist' con archivos optimizados
```

**Esperado:**
```
✓ 1234 modules transformed
✓ built in 12.34s
dist/
  ├── index.html
  ├── assets/
  │   ├── index.js
  │   ├── style.css
  │   └── ...
```

---

## 🌐 Paso 4: Verificar Configuración Firebase

```bash
# Ver proyecto seleccionado
firebase use

# Si necesitas cambiar proyecto
firebase use round2box-11d85
```

**Esperado:**
```
Now using project round2box-11d85
```

---

## ✅ Paso 5: Deploy a Firebase Hosting

### Opción A: Comando Rápido
```bash
npm run deploy
```

### Opción B: Solo Hosting
```bash
npm run firebase:deploy
```

### Opción C: Manual Completo
```bash
firebase deploy --only hosting
```

**Esperado:**
```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/round2box-11d85/overview
Hosting URL: https://round2box-11d85.web.app
```

---

## 🎉 Paso 6: Verificar Despliegue

### En el Navegador
```
Abre: https://round2box-11d85.web.app
```

Deberías ver:
- ✅ Pantalla de login
- ✅ Selección de rol
- ✅ Google login funcionando

### En Firebase Console
```
https://console.firebase.google.com/project/round2box-11d85/hosting
```

Deberías ver:
- ✅ Tu deployment en el historial
- ✅ URL en vivo
- ✅ Estadísticas de tráfico

---

## 📊 URLs Finales

| Tipo | URL |
|------|-----|
| **Principal** | https://round2box-11d85.web.app |
| **Alternativa** | https://round2box-11d85.firebaseapp.com |
| **Console** | https://console.firebase.google.com/project/round2box-11d85 |
| **Hosting** | https://console.firebase.google.com/project/round2box-11d85/hosting |

---

## 🔄 Despliegues Posteriores (Actualizaciones)

Cada vez que hagas cambios:

```bash
# 1. Guarda los cambios
git add .
git commit -m "Descripción del cambio"

# 2. Compila
npm run build

# 3. Despliega
firebase deploy --only hosting

# O directamente:
npm run deploy
```

---

## 🐛 Troubleshooting

### Error: "Command not found: firebase"

**Solución:**
```bash
npm install -g firebase-tools
firebase --version
```

### Error: "You do not have permission to access..."

**Solución:**
```bash
firebase logout
firebase login
firebase use round2box-11d85
```

### Error: "dist folder not found"

**Solución:**
```bash
npm run build
# Verifica que la carpeta 'dist' se creó
ls dist/
```

### Deploy parece estancado

**Solución:**
```bash
# Interrumpe (Ctrl+C) y reintenta
# Si persiste, limpia caché
firebase cache:clear
firebase deploy --only hosting
```

### Cambios no aparecen en producción

**Solución:**
```bash
# Limpia caché del navegador (Ctrl+Shift+Del)
# O abre incógnito: Ctrl+Shift+N
# Si persiste, revisa que subiste la versión correcta:
firebase open hosting
```

---

## 🔒 Consideraciones de Seguridad

### 1. Firestore Rules
Están configuradas en Firebase Console. Verifica:
```
https://console.firebase.google.com/project/round2box-11d85/firestore/rules
```

### 2. API Keys
Las claves de Firebase están públicas en el código (es normal):
```javascript
// Está bien que sea público
const firebaseConfig = {
  apiKey: "AIzaSy...", // PUBLIC
  authDomain: "...",
  projectId: "round2box-11d85",
  ...
};
```

### 3. Storage
Configura permiso solo para autenticados:
```
https://console.firebase.google.com/project/round2box-11d85/storage
```

---

## 📈 Monitoreo Post-Deploy

### Ver Tráfico
```
Console Firebase → Hosting → Analytics
```

### Ver Errores
```
Console Firebase → Monitoring → Error Reporting
```

### Ver Logs
```bash
firebase functions:log
```

---

## 🔄 Proceso Completo (Resumen)

```bash
# 1. Hacer cambios locales
# (edita archivos en VS Code)

# 2. Verificar localmente
npm run dev
# Abre http://localhost:5173

# 3. Compilar para producción
npm run build

# 4. Desplegar a Firebase
npm run deploy

# 5. Verificar en producción
# Abre https://round2box-11d85.web.app
```

---

## ✅ Checklist Final

- [ ] Firebase CLI instalado (`firebase --version`)
- [ ] Autenticado (`firebase login`)
- [ ] Proyecto seleccionado (`firebase use round2box-11d85`)
- [ ] Código compilado (`npm run build`)
- [ ] `dist/` creada con archivos
- [ ] Deploy exitoso (`firebase deploy`)
- [ ] URLs accesibles y funcionando
- [ ] Firestore Rules revisadas
- [ ] Storage configurado

---

## 📞 Contacto

Cualquier problema, contacta al equipo de desarrollo.

---

**Versión:** 1.0  
**Última actualización:** 19 de Diciembre, 2025  
**Estado:** ✅ Listo para producción
