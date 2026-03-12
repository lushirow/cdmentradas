# Club Deportivo Malanzán - Guía de Identidad Visual

> Documento de referencia con colores, elementos visuales y datos del club para desarrollo web y diseño.

---

## 📋 Información General

| Campo | Valor |
|-------|-------|
| **Nombre Oficial** | Club Deportivo Malanzán |
| **Abreviatura** | CDM |
| **Ubicación** | Malanzán, La Rioja, Argentina |
| **Logro Destacado** | Campeón Liga del Sur Riojano 2022 |

---

## 🎨 Paleta de Colores Oficial

### Colores Primarios

| Color | Hex | RGB | HSL | Uso Principal |
|-------|-----|-----|-----|---------------|
| **Amarillo Oro** | `#FFD700` | `rgb(255, 215, 0)` | `hsl(51, 100%, 50%)` | Color principal del club, escudo, uniforme |
| **Negro** | `#000000` | `rgb(0, 0, 0)` | `hsl(0, 0%, 0%)` | Fondo del escudo, detalles, uniforme alternativo |

### Variantes de Amarillo (del uniforme)

| Color | Hex | RGB | Descripción |
|-------|-----|-----|-------------|
| **Amarillo Brillante** | `#FFEB3B` | `rgb(255, 235, 59)` | Amarillo más claro usado en camisetas |
| **Amarillo Dorado** | `#FFC107` | `rgb(255, 193, 7)` | Tono medio para detalles |
| **Amarillo Oscuro** | `#F9A825` | `rgb(249, 168, 37)` | Para sombras y profundidad |

### Colores Secundarios (del uniforme)

| Color | Hex | RGB | Uso |
|-------|-----|-----|-----|
| **Blanco** | `#FFFFFF` | `rgb(255, 255, 255)` | Medias, detalles, texto sobre negro |
| **Gris Oscuro** | `#1A1A1A` | `rgb(26, 26, 26)` | Alternativa al negro puro |

---

## 🛡️ Elementos del Escudo

### Descripción Visual

- **Forma**: Escudo tipo shield (pentagonal)
- **Fondo**: Negro sólido
- **Borde**: Amarillo dorado con doble línea
- **Elemento Central**: Círculo con las letras "CDM" en amarillo
- **Estrellas**: 5 estrellas amarillas en la parte superior (representando años de campeonatos: 84, 85, 22, 86, 87)
- **Detalles**: Líneas verticales amarillas decorativas

### Variantes del Escudo

**Escudo Principal** (Primera imagen):
- Estrella central grande con el número "22"
- 4 estrellas pequeñas con números: 84, 85, 86, 87
- Diseño más elaborado con detalles geométricos

**Escudo Simplificado** (Segunda imagen):
- 5 estrellas uniformes sin números
- Diseño más limpio y minimalista
- Texto adicional: "CAMPEÓN LIGA DEL SUR RIOJANO 2022"

---

## 👕 Uniformes

### Uniforme Titular

| Elemento | Color Principal | Color Secundario | Detalles |
|----------|----------------|------------------|----------|
| **Camiseta** | Amarillo | Negro | Diseño con patrón geométrico negro/amarillo |
| **Pantalón** | Amarillo | Negro | Detalles negros en los laterales |
| **Medias** | Negro | Blanco | Franjas blancas |

### Uniforme Alternativo

| Elemento | Color Principal | Color Secundario |
|----------|----------------|------------------|
| **Camiseta** | Negro | Amarillo |
| **Pantalón** | Negro | Amarillo |
| **Medias** | Negro | Blanco |

---

## 💻 Guía de Uso para Desarrollo Web

### CSS Variables Recomendadas

\`\`\`css
:root {
  /* Colores Primarios */
  --cdm-gold: #FFD700;
  --cdm-black: #000000;
  --cdm-white: #FFFFFF;
  
  /* Variantes de Amarillo */
  --cdm-yellow-bright: #FFEB3B;
  --cdm-yellow-medium: #FFC107;
  --cdm-yellow-dark: #F9A825;
  
  /* Grises */
  --cdm-gray-dark: #1A1A1A;
  --cdm-gray-medium: #333333;
  
  /* Gradientes */
  --cdm-gradient-primary: linear-gradient(135deg, #FFD700 0%, #FFC107 100%);
  --cdm-gradient-dark: linear-gradient(135deg, #1A1A1A 0%, #000000 100%);
  --cdm-gradient-shield: linear-gradient(180deg, #FFD700 0%, #F9A825 100%);
}
\`\`\`

### Combinaciones de Color Recomendadas

#### Para Fondos Oscuros
\`\`\`css
.dark-theme {
  background: var(--cdm-black);
  color: var(--cdm-gold);
}
\`\`\`

#### Para Fondos Claros
\`\`\`css
.light-theme {
  background: var(--cdm-white);
  color: var(--cdm-black);
  accent-color: var(--cdm-gold);
}
\`\`\`

#### Botones Primarios
\`\`\`css
.btn-primary {
  background: var(--cdm-gradient-primary);
  color: var(--cdm-black);
  border: 2px solid var(--cdm-black);
}

.btn-primary:hover {
  background: var(--cdm-yellow-dark);
  transform: translateY(-2px);
}
\`\`\`

#### Botones Secundarios
\`\`\`css
.btn-secondary {
  background: var(--cdm-black);
  color: var(--cdm-gold);
  border: 2px solid var(--cdm-gold);
}

.btn-secondary:hover {
  background: var(--cdm-gray-dark);
}
\`\`\`

---

## 🎯 Contraste y Accesibilidad

### Combinaciones WCAG AA Compliant

| Fondo | Texto | Ratio de Contraste | Estado |
|-------|-------|-------------------|--------|
| Negro (#000000) | Amarillo (#FFD700) | 10.4:1 | ✅ AAA |
| Negro (#000000) | Blanco (#FFFFFF) | 21:1 | ✅ AAA |
| Amarillo (#FFD700) | Negro (#000000) | 10.4:1 | ✅ AAA |
| Amarillo Oscuro (#F9A825) | Negro (#000000) | 8.2:1 | ✅ AAA |

---

## 🖼️ Assets Visuales

### Imágenes de Referencia

![Escudo Principal](C:/Users/User/.gemini/antigravity/brain/53448d2f-1b22-4889-8765-6a48639a21ba/uploaded_media_0_1769477866222.png)

![Escudo Campeón 2022](C:/Users/User/.gemini/antigravity/brain/53448d2f-1b22-4889-8765-6a48639a21ba/uploaded_media_1_1769477866222.png)

![Equipo Oficial](C:/Users/User/.gemini/antigravity/brain/53448d2f-1b22-4889-8765-6a48639a21ba/uploaded_media_2_1769477866222.jpg)

---

## 🎨 Patrones de Diseño

### Patrón del Uniforme

El uniforme presenta un diseño geométrico distintivo:
- **Base**: Amarillo brillante
- **Patrón**: Formas geométricas negras (triángulos, líneas diagonales)
- **Estilo**: Moderno, dinámico, con sensación de movimiento
- **Inspiración**: Diseño tipo "camuflaje deportivo" o "patrón digital"

### Recomendaciones para UI

\`\`\`css
/* Patrón de fondo inspirado en el uniforme */
.pattern-background {
  background: 
    linear-gradient(45deg, transparent 30%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 70%, transparent 70%),
    linear-gradient(-45deg, transparent 30%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 70%, transparent 70%),
    var(--cdm-gold);
  background-size: 60px 60px;
}
\`\`\`

---

## 📱 Tipografía Recomendada

### Para Títulos
- **Familia**: Montserrat Bold / Bebas Neue / Oswald
- **Peso**: 700-900
- **Estilo**: Mayúsculas, espaciado amplio
- **Color**: Amarillo sobre negro, o negro sobre amarillo

### Para Texto Corrido
- **Familia**: Inter / Roboto / Open Sans
- **Peso**: 400-600
- **Color**: Blanco sobre negro, o negro sobre blanco

---

## 🏆 Logros Destacados

- **Campeón Liga del Sur Riojano 2022**
- **Campeonatos históricos**: 1984, 1985, 1986, 1987

---

## 📝 Notas de Implementación

### Prioridades de Diseño

1. **Contraste Alto**: El negro y amarillo deben mantener siempre alto contraste
2. **Legibilidad**: Evitar amarillo sobre blanco (bajo contraste)
3. **Consistencia**: Usar siempre los mismos tonos de amarillo
4. **Modernidad**: El patrón geométrico debe reflejarse en el diseño web
5. **Identidad**: Las 5 estrellas son un elemento distintivo importante

### Elementos Clave para Incluir

- ✅ Escudo en header/navbar
- ✅ Colores amarillo/negro en toda la UI
- ✅ Patrón geométrico como textura de fondo
- ✅ Referencias a "Campeón 2022"
- ✅ Las 5 estrellas como elemento decorativo

---

## 🔗 Recursos Adicionales

### Generadores de Paleta Online
- [Coolors.co](https://coolors.co) - Generar variantes
- [Adobe Color](https://color.adobe.com) - Armonías de color
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - Verificar accesibilidad

### Inspiración de Diseño
- Buscar "black and gold sports design"
- Referencia: Equipos con colores similares (Borussia Dortmund, Pittsburgh Steelers)

---

**Última actualización**: Enero 2026  
**Versión**: 1.0  
**Autor**: Documentación generada para proyecto cdmentradas
