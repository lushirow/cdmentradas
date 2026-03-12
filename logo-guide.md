# Club Deportivo Malanzán - Guía de Uso del Logo

> Logos remasterizados con calidad profesional para uso en web, impresión y medios digitales.

---

## 🎨 Logos Disponibles

### 1. Logo Principal Remasterizado

![Logo Principal](C:/Users/User/.gemini/antigravity/brain/53448d2f-1b22-4889-8765-6a48639a21ba/cdm_logo_remastered_1769478370781.png)

**Características:**
- Escudo pentagonal con doble borde dorado
- 5 estrellas uniformes en la parte superior
- Círculo central con letras "CDM"
- 3 pilares verticales decorativos
- Colores: Negro (#000000) y Oro (#FFD700)

**Uso recomendado:**
- ✅ Página web (header, footer)
- ✅ Merchandising (camisetas, gorras)
- ✅ Documentos oficiales
- ✅ Redes sociales (posts)
- ✅ Impresión de alta calidad

**Tamaños recomendados:**
- Web: 200px - 400px de ancho
- Impresión: Mínimo 5cm de ancho

---

### 2. Logo Versión Campeonatos

![Logo Campeonatos](C:/Users/User/.gemini/antigravity/brain/53448d2f-1b22-4889-8765-6a48639a21ba/cdm_logo_championship_1769478412222.png)

**Características:**
- Estrella grande superior con "22" (Campeonato 2022)
- 4 estrellas con números: 84, 85, 86, 87
- Mismo diseño base que el logo principal

**Uso recomendado:**
- ✅ Comunicaciones sobre logros históricos
- ✅ Sección "Historia" del sitio web
- ✅ Material conmemorativo
- ✅ Banners de celebración
- ✅ Merchandising especial

**Cuándo usar:**
- Contextos que celebren los campeonatos del club
- Material histórico o de archivo
- Eventos especiales de aniversario

---

### 3. Logo Icono Simplificado

![Logo Icono](C:/Users/User/.gemini/antigravity/brain/53448d2f-1b22-4889-8765-6a48639a21ba/cdm_logo_icon_1769478453059.png)

**Características:**
- Formato circular
- Solo letras "CDM" en oro sobre negro
- Diseño minimalista y limpio
- Perfecto para tamaños pequeños

**Uso recomendado:**
- ✅ Favicon del sitio web
- ✅ App móvil (icono de aplicación)
- ✅ Perfil de redes sociales (foto de perfil)
- ✅ Watermark en videos/imágenes
- ✅ Botones pequeños en UI

**Tamaños recomendados:**
- Favicon: 32x32px, 64x64px
- App icon: 512x512px, 1024x1024px
- Social media: 200x200px, 400x400px

---

### 4. Banner Horizontal

![Banner Horizontal](C:/Users/User/.gemini/antigravity/brain/53448d2f-1b22-4889-8765-6a48639a21ba/cdm_banner_horizontal_1769478490270.png)

**Características:**
- Logo + texto "CLUB DEPORTIVO MALANZÁN"
- 5 estrellas integradas
- Formato horizontal optimizado
- Fondo negro con elementos dorados

**Uso recomendado:**
- ✅ Header de sitio web
- ✅ Portada de Facebook
- ✅ Banner de YouTube
- ✅ Firma de email
- ✅ Material promocional horizontal

**Dimensiones:**
- Web header: 1920x400px
- Facebook cover: 820x312px
- YouTube banner: 2560x1440px (área segura)

---

## 📐 Especificaciones Técnicas

### Colores Oficiales

| Elemento | Color | Hex | RGB | Uso |
|----------|-------|-----|-----|-----|
| **Fondo** | Negro | `#000000` | `rgb(0, 0, 0)` | Fondo del escudo |
| **Elementos** | Oro | `#FFD700` | `rgb(255, 215, 0)` | Bordes, letras, estrellas |

### Espaciado y Proporciones

**Área de Protección:**
- Mínimo: 10% del ancho del logo en todos los lados
- No colocar texto u otros elementos dentro de esta área

**Tamaño Mínimo:**
- Digital: 80px de ancho
- Impresión: 2cm de ancho

### Formatos de Archivo

Los logos están disponibles en:
- **PNG** (con transparencia) - Para web y digital
- **SVG** (vectorial) - Para escalado sin pérdida de calidad
- **PDF** (vectorial) - Para impresión profesional

---

## ✅ Usos Correctos

### En Fondos Oscuros
```css
/* Usar logo con elementos dorados sobre fondo negro/oscuro */
background: #000000;
/* Logo se ve perfecto */
```

### En Fondos Claros
```css
/* Agregar un contenedor negro alrededor del logo */
.logo-container {
  background: #000000;
  padding: 20px;
  border-radius: 8px; /* opcional */
}
```

### Ejemplos de Uso Correcto

✅ **Correcto:**
- Logo centrado con espacio suficiente alrededor
- Colores originales sin modificación
- Proporciones mantenidas (no estirado)
- Tamaño legible

---

## ❌ Usos Incorrectos

### NO Hacer:

❌ **Cambiar los colores**
- No usar otros colores que no sean negro y oro
- No aplicar filtros de color

❌ **Distorsionar**
- No estirar horizontal o verticalmente
- No rotar en ángulos extraños
- No inclinar (skew)

❌ **Modificar elementos**
- No quitar las estrellas
- No cambiar las letras "CDM"
- No agregar elementos adicionales

❌ **Fondos problemáticos**
- No usar sobre fondos amarillos (bajo contraste)
- No usar sobre imágenes muy ocupadas sin fondo sólido

❌ **Tamaño inadecuado**
- No usar más pequeño que el tamaño mínimo especificado
- No pixelar por escalado excesivo

---

## 🎯 Guía de Selección Rápida

| Contexto | Logo Recomendado |
|----------|------------------|
| **Sitio web - Header** | Banner Horizontal |
| **Sitio web - Footer** | Logo Principal |
| **Favicon** | Logo Icono |
| **Redes sociales - Perfil** | Logo Icono |
| **Redes sociales - Posts** | Logo Principal |
| **Camisetas/Merchandising** | Logo Principal o Campeonatos |
| **Documentos oficiales** | Logo Principal |
| **Material histórico** | Logo Campeonatos |
| **App móvil** | Logo Icono |
| **Banners promocionales** | Banner Horizontal |

---

## 💻 Implementación en Web

### HTML Básico

```html
<!-- Header con banner -->
<header>
  <img 
    src="/assets/logos/cdm-banner-horizontal.png" 
    alt="Club Deportivo Malanzán"
    class="logo-header"
  >
</header>

<!-- Logo en footer -->
<footer>
  <img 
    src="/assets/logos/cdm-logo-principal.png" 
    alt="CDM Logo"
    class="logo-footer"
  >
</footer>
```

### CSS Recomendado

```css
/* Logo en header */
.logo-header {
  max-width: 400px;
  height: auto;
  display: block;
}

/* Logo en footer */
.logo-footer {
  width: 150px;
  height: auto;
  display: block;
  margin: 0 auto;
}

/* Responsive */
@media (max-width: 768px) {
  .logo-header {
    max-width: 250px;
  }
  
  .logo-footer {
    width: 100px;
  }
}
```

### Favicon Implementation

```html
<!-- En el <head> de tu HTML -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
```

---

## 📱 Redes Sociales - Tamaños Recomendados

### Facebook
- **Foto de perfil**: 170x170px (Logo Icono)
- **Portada**: 820x312px (Banner Horizontal adaptado)

### Instagram
- **Foto de perfil**: 320x320px (Logo Icono)
- **Posts**: 1080x1080px (Logo Principal centrado)

### Twitter/X
- **Foto de perfil**: 400x400px (Logo Icono)
- **Header**: 1500x500px (Banner Horizontal)

### YouTube
- **Foto de perfil**: 800x800px (Logo Icono)
- **Banner**: 2560x1440px (Banner Horizontal en área segura)

---

## 🎨 Variaciones de Fondo Permitidas

### Opción 1: Fondo Negro Sólido
```css
background: #000000;
```
**Resultado:** Logo dorado sobre negro (máximo contraste)

### Opción 2: Fondo Oscuro con Patrón
```css
background: 
  linear-gradient(45deg, transparent 30%, rgba(255,215,0,0.05) 30%),
  #000000;
```
**Resultado:** Fondo negro con sutil patrón dorado

### Opción 3: Contenedor con Sombra
```css
.logo-container {
  background: #000000;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(255, 215, 0, 0.2);
  border-radius: 12px;
}
```
**Resultado:** Logo en contenedor negro con resplandor dorado

---

## 📋 Checklist de Calidad

Antes de usar el logo, verifica:

- [ ] ¿El logo es legible al tamaño que lo estoy usando?
- [ ] ¿Hay suficiente espacio alrededor (área de protección)?
- [ ] ¿Los colores son exactamente negro y oro (sin modificaciones)?
- [ ] ¿Las proporciones están correctas (no estirado)?
- [ ] ¿El fondo tiene suficiente contraste?
- [ ] ¿Estoy usando el formato correcto (PNG/SVG/PDF)?
- [ ] ¿El logo está alineado correctamente?

---

## 🔄 Actualizaciones y Versiones

**Versión actual:** 1.0 (Remasterización 2026)

**Cambios en esta versión:**
- ✨ Remasterización completa con calidad profesional
- ✨ Bordes más nítidos y precisos
- ✨ Geometría perfecta y simétrica
- ✨ Optimización para web y impresión
- ✨ Nuevas variantes (icono, banner)

---

## 📞 Contacto para Uso del Logo

Para solicitudes especiales de uso del logo o dudas sobre la guía de marca:
- Contactar a la directiva del Club Deportivo Malanzán

---

**Última actualización:** Enero 2026  
**Diseño:** Remasterización profesional basada en logo original  
**Proyecto:** cdmentradas
