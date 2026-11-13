import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Sparkles, Brain, BookOpen, Send, User, Youtube, CheckCircle2, 
  ChevronRight, Search, X, GraduationCap, Flame, Calculator, ExternalLink,
  Award, Menu, ChevronDown
} from 'lucide-react';

// Base de datos completa de vídeos del canal Mates para Noobs
const VIDEO_DATABASE = [
  // Ecuaciones y Sistemas
  { id: 'Es3P-R4V_MQ', title: 'Aprende el MÉTODO DE REDUCCIÓN para resolver sistemas de ecuaciones', category: 'algebra', categoryLabel: 'Ecuaciones y Sistemas', level: '3º/4º ESO', desc: 'Explicación paso a paso con ejemplos prácticos para no equivocarte con las multiplicaciones.', pdfUrl: '/ficha_reduccion.pdf' },
  { id: 'R-sqTXj5prY', title: 'Método de IGUALACIÓN para Sistemas de Ecuaciones', category: 'algebra', categoryLabel: 'Ecuaciones y Sistemas', level: '3º/4º ESO', desc: 'Paso a paso con ejemplos resueltos para despejar la misma incógnita sin líos.' },
  { id: 'Ez8XBPwnVe4', title: 'Método de SUSTITUCIÓN paso a paso (Sistemas con 2 incógnitas)', category: 'algebra', categoryLabel: 'Ecuaciones y Sistemas', level: '3º/4º ESO', desc: 'Aprende a aislar la incógnita más fácil y sustituirla correctamente.' },
  { id: 'kCJBNMH-dk0', title: 'Aprende a RESOLVER un sistema de ecuaciones con el MÉTODO GRÁFICO', category: 'algebra', categoryLabel: 'Ecuaciones y Sistemas', level: '3º/4º ESO', desc: 'Dibuja las dos rectas en los ejes cartesianos y encuentra el punto de corte.' },
  { id: 'HWNA5ZTEFPM', title: 'SISTEMAS de ECUACIONES 2x2 COMPLEJOS', category: 'algebra', categoryLabel: 'Ecuaciones y Sistemas', level: '4º ESO / 1º Bach', desc: 'Sustitución, igualación y reducción en sistemas con paréntesis y fracciones.' },
  { id: 'LDHTn0H0R90', title: 'Ecuaciones BICUADRADAS Paso a Paso', category: 'algebra', categoryLabel: 'Ecuaciones y Sistemas', level: '4º ESO', desc: '¿Por qué pueden tener hasta 4 soluciones? Cambio de variable x² = t explicada fácil.' },
  { id: '-a5Zqm0Guzg', title: 'Cómo Resolver ECUACIONES con RAÍCES paso a paso', category: 'algebra', categoryLabel: 'Ecuaciones y Sistemas', level: '4º ESO / 1º Bach', desc: 'Aísla la raíz, eleva al cuadrado a ambos lados e incluye la comprobación obligatoria.' },
  { id: 'vdbre01j-Zo', title: 'Ecuaciones de Segundo Grado (Fórmula General + Incompletas)', category: 'algebra', categoryLabel: 'Ecuaciones y Sistemas', level: '2º/3º ESO', desc: 'Aprende a aplicar la fórmula general y los trucos para incompletas.' },
  { id: 'EbBWnuwRbjQ', title: 'Sistema de INECUACIONES con una incógnita', category: 'algebra', categoryLabel: 'Ecuaciones y Sistemas', level: '4º ESO / 1º Bach', desc: 'Resuelve cada inecuación por separado y encuentra la intersección de intervalos.' },

  // Polinomios y Ruffini
  { id: 'W_l-vQRMDJc', title: 'Suma y Resta de Polinomios (Ejemplos paso a paso)', category: 'polinomios', categoryLabel: 'Polinomios y Factorización', level: '2º/3º ESO', desc: 'Agrupa monomios semejantes y vigila los cambios de signo al restar polinomios.' },
  { id: 'UzduFGyiT1A', title: 'Factoriza POLINOMIOS PASO A PASO', category: 'polinomios', categoryLabel: 'Polinomios y Factorización', level: '3º/4º ESO & Bach', desc: 'Combina Ruffini, factor común y la ecuación de segundo grado para factorizar al máximo.' },
  { id: 'rKDo7OQE3R4', title: 'Aprende la REGLA DE RUFFINI (División de Polinomios FÁCIL)', category: 'polinomios', categoryLabel: 'Polinomios y Factorización', level: '3º/4º ESO', desc: 'Explicación clara para dividir polinomios entre (x - a) y encontrar raíces.' },
  { id: 'MHUhz92k1oM', title: 'Suma, Resta y Multiplicación de Polinomios', category: 'polinomios', categoryLabel: 'Polinomios y Factorización', level: '2º/3º ESO', desc: 'Domina las operaciones fundamentales de álgebra básica desde cero.' },
  { id: 'D1Fp0NyiUfE', title: 'Cómo SACAR FACTOR COMÚN paso a paso', category: 'polinomios', categoryLabel: 'Polinomios y Factorización', level: '1º/2º ESO', desc: 'El primer paso fundamental antes de cualquier factorización.' },
  { id: 'kbBrVff8_QM', title: 'Domina los MONOMIOS en minutos', category: 'polinomios', categoryLabel: 'Polinomios y Factorización', level: '1º ESO', desc: 'Coeficiente, parte literal y grado explicados con ejemplos muy sencillos.' },
  { id: 'tc7GnqHhPZw', title: 'Cuadrado de una suma, diferencia y suma por diferencia', category: 'polinomios', categoryLabel: 'Polinomios y Factorización', level: '2º/3º ESO', desc: 'Las tres identidades notables explicadas sin líos para no equivocarte en el examen.' },

  // Fracciones Algebraicas
  { id: '1U8-Euhk01g', title: 'Aprende a TACHAR DENOMINADORES en ecuaciones algebraicas', category: 'fracciones', categoryLabel: 'Fracciones Algebraicas', level: '4º ESO / 1º Bach', desc: 'Cuándo se pueden eliminar denominadores y cómo calcular el mcm correctamente.', pdfUrl: '/ficha_fracciones.pdf' },
  { id: 'g_ct5e6VXQM', title: '¿Qué son las FRACCIONES ALGEBRAICAS? Simplificar y Factorizar', category: 'fracciones', categoryLabel: 'Fracciones Algebraicas', level: '4º ESO', desc: 'Paso a paso para simplificar numeradores y denominadores factorizando.' },
  { id: '70ryMnvvz8Q', title: 'Fracciones Algebraicas con DISTINTO DENOMINADOR', category: 'fracciones', categoryLabel: 'Fracciones Algebraicas', level: '4º ESO / 1º Bach', desc: 'Suma y resta reduciendo a común denominador mediante el mcm.' },
  { id: 'DrXIjEvdQ4A', title: 'Cómo sacar el COMÚN DENOMINADOR de 3 fracciones algebraicas', category: 'fracciones', categoryLabel: 'Fracciones Algebraicas', level: '4º ESO', desc: 'Método práctico del Mínimo Común Múltiplo de polinomios.' },
  { id: 'QrZhnRQplcI', title: 'Multiplica y Divide Fracciones Algebraicas', category: 'fracciones', categoryLabel: 'Fracciones Algebraicas', level: '4º ESO', desc: 'Multiplicación en línea y división en cruz simplificando antes de operar.' },

  // Funciones y Límites
  { id: 'z420fcNnXmk', title: '¿ES CONTINUA ESTA FUNCIÓN? Comprobar continuidad con a y b', category: 'funciones', categoryLabel: 'Funciones y Límites', level: '1º/2º Bachillerato', desc: 'Halla los parámetros a y b calculando límites laterales en los puntos de corte.' },
  { id: 'KqB0_yajXKw', title: '¿Qué es la CONTINUIDAD en una función? Tipos y definiciones', category: 'funciones', categoryLabel: 'Funciones y Límites', level: '1º/2º Bachillerato', desc: 'Discontinuidades evitables, de salto finito e infinito explicadas con gráficas.' },
  { id: 'QAg9k30iQc0', title: 'LÍMITES para PRINCIPIANTES paso a paso', category: 'funciones', categoryLabel: 'Funciones y Límites', level: '1º Bachillerato', desc: 'Aprende a resolver límites directos e indeterminaciones básicas.' },
  { id: 'CO4AOcUpttw', title: 'Desarrollar funciones VALOR ABSOLUTO a trozos', category: 'funciones', categoryLabel: 'Funciones y Límites', level: '1º/2º Bachillerato', desc: 'Descompón expresiones |f(x)| definiendo intervalos según los signos.' },
  { id: 'OOC7tqWDfE0', title: 'Funciones por Partes (Aprende a Graficarlas)', category: 'funciones', categoryLabel: 'Funciones y Límites', level: '4º ESO / 1º Bach', desc: 'Dibuja cada tramo respetando los dominios definidos en la función.' },
  { id: 'ymyjNGkkEjc', title: 'FUNCIONES CUADRÁTICAS desde CERO (Dibuja Parábolas)', category: 'funciones', categoryLabel: 'Funciones y Límites', level: '3º/4º ESO', desc: 'Calcula el vértice V(-b/2a, y), los puntos de corte con los ejes y el eje de simetría.' },

  // Integrales y Derivadas
  { id: 'CGjsNbeDmNg', title: 'Aprende INTEGRACIÓN por PARTES (Regla ALPES)', category: 'integrales', categoryLabel: 'Integrales y Derivadas', level: '2º Bachillerato', desc: 'Aplica ∫ u dv = u·v - ∫ v du eligiendo "u" con el truco infalible ALPES.' },
  { id: 'WFUaZCSWgQw', title: 'Integral tipo Logaritmo Neperiano + Arcotangente', category: 'integrales', categoryLabel: 'Integrales y Derivadas', level: '2º Bachillerato', desc: 'Ejemplo completo resuelto paso a paso separando la fracción.' },
  { id: '9rqFbSAFxik', title: 'Método de SUSTITUCIÓN para INTEGRALES con raíces', category: 'integrales', categoryLabel: 'Integrales y Derivadas', level: '2º Bachillerato', desc: 'Cambios de variable t² = f(x) para deshacerte de los radicales fácilmente.' },
  { id: 'GyO3gkmdSgo', title: 'Aprende el MÉTODO de FRACCIONES SIMPLES paso a paso', category: 'integrales', categoryLabel: 'Integrales y Derivadas', level: '2º Bachillerato', desc: 'Descomposición A/(x-a) + B/(x-b) para integrar funciones racionales.' },
  { id: 'cBcNqaGrZEA', title: 'Aprende la INTEGRAL de ARCOTANGENTE paso a paso', category: 'integrales', categoryLabel: 'Integrales y Derivadas', level: '2º Bachillerato', desc: 'Ajusta el numerador y completa el cuadrado en el denominador.' },
  { id: 'uekp1d0rMBE', title: 'Derivadas vs Integrales (¿Qué relación tienen?)', category: 'integrales', categoryLabel: 'Integrales y Derivadas', level: '2º Bachillerato', desc: 'Concepto de primitiva y Teorema Fundamental del Cálculo explicado sin tecnicismos.' },

  // Geometría y Vectores
  { id: 'a-Il4CTc0s4', title: 'Posición Relativa de Rectas (Secantes, Paralelas o Coincidentes)', category: 'geometria', categoryLabel: 'Geometría y Vectores', level: '4º ESO / 1º Bach', desc: 'Compara las pendientes m1 y m2 o los vectores directores para clasificar las rectas.' },
  { id: 'YK-BV-Mr-9U', title: 'ESCRIBIR ecuaciones de rectas paralelas y perpendiculares', category: 'geometria', categoryLabel: 'Geometría y Vectores', level: '4º ESO / 1º Bach', desc: 'Usa la misma pendiente para paralelas y m2 = -1/m1 para perpendiculares.' },
  { id: '-t3Y4w_ieHI', title: 'Todos los TIPOS de ECUACIONES DE LA RECTA', category: 'geometria', categoryLabel: 'Geometría y Vectores', level: '4º ESO / 1º Bach', desc: 'Vectorial, Paramétricas, Continua, General/Implícita y Explícita.' },
  { id: 'oYpJuLAgBv4', title: 'Aprende VECTORES desde CERO', category: 'geometria', categoryLabel: 'Geometría y Vectores', level: '4º ESO', desc: 'Coordenadas de un vector AB = B - A, módulo, dirección y sentido.' },
  { id: 'bxUhfZRh4R8', title: 'PUNTO MEDIO y PUNTO SIMÉTRICO de un segmento', category: 'geometria', categoryLabel: 'Geometría y Vectores', level: '4º ESO / 1º Bach', desc: 'Fórmulas directas con ejemplos prácticos para exámenes.' },

  // Matrices y Determinantes
  { id: 'XwALSVvaX0w', title: 'Determinantes desde CERO con Regla de Sarrus', category: 'matrices', categoryLabel: 'Matrices y Determinantes', level: '2º Bachillerato', desc: 'Cálculo de determinantes 1x1, 2x2 y 3x3 paso a paso.' },
  { id: '2yqMeM-CXic', title: 'Cómo calcular la MATRIZ INVERSA paso a paso (A⁻¹ = Adj(A)ᵀ / |A|)', category: 'matrices', categoryLabel: 'Matrices y Determinantes', level: '2º Bachillerato', desc: 'Cálculo de determinantes, matriz adjunta y traspuesta para 2x2 y 3x3.' },
  { id: 'cbCfHHSInb4', title: '¿CÓMO SABER el RANGO de una MATRIZ con PARÁMETROS?', category: 'matrices', categoryLabel: 'Matrices y Determinantes', level: '2º Bachillerato', desc: 'Discusión del rango igualando el determinante a cero según el parámetro k.' },
  { id: 'HEB2Zc8B_KI', title: 'Cómo hallar la MATRIZ ENÉSIMA (Aⁿ)', category: 'matrices', categoryLabel: 'Matrices y Determinantes', level: '2º Bachillerato', desc: 'Calcula A², A³ y deduce la ley de inducción para Selectividad / PAU.' }
];

// Limpieza y conversión de expresiones matemáticas LaTeX a formato legible y etiquetas estructuradas
function sanitizeLatex(text) {
  if (!text) return '';
  let cleaned = text;

  cleaned = cleaned.replace(/\\begin\{(?:equation|align|math|center)\*?\}/g, '');
  cleaned = cleaned.replace(/\\end\{(?:equation|align|math|center)\*?\}/g, '');

  // Convertir entornos de matrices pmatrix/bmatrix a \matrix{...}
  cleaned = cleaned.replace(/\\begin\{(?:pmatrix|bmatrix|matrix)\}([\s\S]*?)\\end\{(?:pmatrix|bmatrix|matrix)\}/g, (match, inner) => {
    const rows = inner.trim().split('\\\\').map(r => r.trim().split('&').map(c => c.trim()).join(',')).join('|');
    return `\\matrix{${rows}}`;
  });

  // Convertir listas anidadas [[a, b], [c, d]] a \matrix{a,b|c,d}
  cleaned = cleaned.replace(/\[\s*\[\s*([^\]]+)\s*\]\s*,\s*\[\s*([^\]]+)\s*\](?:\s*,\s*\[\s*([^\]]+)\s*\])?(?:\s*,\s*\[\s*([^\]]+)\s*\])?\s*\]/g, (match, r1, r2, r3, r4) => {
    const rows = [r1, r2, r3, r4].filter(Boolean).map(r => r.replace(/\s*,\s*/g, ',')).join('|');
    return `\\matrix{${rows}}`;
  });

  cleaned = cleaned.replace(/\\left\s*/g, '');
  cleaned = cleaned.replace(/\\right\s*/g, '');
  cleaned = cleaned.replace(/\\(?:text|mathrm|mathbf|mathit)\{([^{}]+)\}/g, '$1');
  cleaned = cleaned.replace(/\\(?:quad|qquad|,|;|:|!)/g, ' ');

  // Convertir divisiones con barras a \frac{num}{den}
  cleaned = cleaned.replace(/\(([^()]+)\)\s*\/\s*\(([^()]+)\)/g, '\\frac{$1}{$2}');
  cleaned = cleaned.replace(/\(([^()]+)\)\s*\/\s*([0-9a-zA-Z]+)/g, '\\frac{$1}{$2}');
  cleaned = cleaned.replace(/(^|[\s=+\-*])([0-9a-zA-Z]+)\s*\/\s*\(([^()]+)\)/g, '$1\\frac{$2}{$3}');
  cleaned = cleaned.replace(/(^|[\s=+\-*<>])(\d*[a-zA-Z]+|\d+)\s*\/\s*(\d*[a-zA-Z]+|\d+)/g, '$1\\frac{$2}{$3}');

  // Símbolos matemáticos Unicode
  cleaned = cleaned.replace(/\\+iiint/g, '∭');
  cleaned = cleaned.replace(/\\+iint/g, '∬');
  cleaned = cleaned.replace(/\\+int/g, '∫');
  cleaned = cleaned.replace(/\\+oint/g, '∮');
  cleaned = cleaned.replace(/\\+partial/g, '∂');
  cleaned = cleaned.replace(/\\+pi/g, 'π');
  cleaned = cleaned.replace(/\\+alpha/g, 'α');
  cleaned = cleaned.replace(/\\+beta/g, 'β');
  cleaned = cleaned.replace(/\\+gamma/g, 'γ');
  cleaned = cleaned.replace(/\\+theta/g, 'θ');
  cleaned = cleaned.replace(/\\+lambda/g, 'λ');
  cleaned = cleaned.replace(/\\+mu/g, 'μ');
  cleaned = cleaned.replace(/\\+sigma/g, 'σ');
  cleaned = cleaned.replace(/\\+omega/g, 'ω');
  cleaned = cleaned.replace(/\\+Delta/g, 'Δ');
  cleaned = cleaned.replace(/\\+cdot/g, ' · ');
  cleaned = cleaned.replace(/\\+rightarrow/g, ' → ');
  cleaned = cleaned.replace(/\\+leftarrow/g, ' ← ');
  cleaned = cleaned.replace(/\\+implies/g, ' ⇒ ');
  cleaned = cleaned.replace(/\\+sqrt\{([^{}]+)\}/g, '√($1)');
  cleaned = cleaned.replace(/\\+sqrt/g, '√');
  cleaned = cleaned.replace(/\\+pm/g, '±');
  cleaned = cleaned.replace(/\\+times/g, ' × ');
  cleaned = cleaned.replace(/\\+leq/g, '≤');
  cleaned = cleaned.replace(/\\+geq/g, '≥');
  cleaned = cleaned.replace(/\\+neq/g, '≠');
  cleaned = cleaned.replace(/\\+approx/g, '≈');
  cleaned = cleaned.replace(/\\+infty/g, '∞');

  // Superíndices y subíndices Unicode
  const supMap = {
    '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹',
    '+':'⁺','-':'⁻','=':'⁼','(':'⁽',')':'⁾','n':'ⁿ','i':'ⁱ','x':'ˣ','a':'ᵃ','b':'ᵇ',
    'c':'ᶜ','d':'ᵈ','e':'ᵉ','f':'ᶠ','g':'ᵍ','h':'ʰ','k':'ᵏ','l':'ˡ','m':'ᵐ','o':'ᵒ',
    'p':'ᵖ','r':'ʳ','s':'ˢ','t':'ᵗ','u':'ᵘ','v':'ᵛ','w':'ʷ','y':'ʸ'
  };
  cleaned = cleaned.replace(/\^\{([^}]+)\}/g, (_, expr) => expr.split('').map(c => supMap[c] || c).join(''));
  cleaned = cleaned.replace(/\^\(([^)]+)\)/g, (_, expr) => expr.split('').map(c => supMap[c] || c).join(''));
  cleaned = cleaned.replace(/\^([0-9nixabcdeghklmoprstuwy\+\-=])/g, (_, char) => supMap[char] || `^${char}`);

  const subMap = {
    '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉',
    '+':'₊','-':'₋','=':'₌','(':'₍',')':'₎','a':'ₐ','e':'ₑ','o':'ₒ','x':'ₓ','h':'ₕ',
    'k':'ₖ','l':'ₗ','m':'ₘ','n':'ₙ','p':'ₚ','s':'ₛ','t':'ₜ'
  };
  cleaned = cleaned.replace(/_\{([^}]+)\}/g, (_, expr) => expr.split('').map(c => subMap[c] || c).join(''));
  cleaned = cleaned.replace(/_([0-9aeoxhklmnpst\+\-=])/g, (_, char) => subMap[char] || `_${char}`);

  cleaned = cleaned.replace(/\$\$/g, '');
  cleaned = cleaned.replace(/\$/g, '');

  return cleaned;
}

// Componente de Fracción Apilada 2D
function StackedFraction({ num, den }) {
  return (
    <span className="inline-flex flex-col items-center justify-center align-middle mx-1 px-1.5 py-0.5 text-[0.85em] leading-none font-mono bg-slate-950/60 rounded border border-cyan-500/20">
      <span className="border-b border-cyan-400/80 pb-0.5 text-cyan-200 font-bold text-center w-full">{num}</span>
      <span className="pt-0.5 text-cyan-300 font-bold text-center w-full">{den}</span>
    </span>
  );
}

// Componente de Matriz 2D
function RenderMatrix({ dataStr }) {
  const rows = dataStr.split('|').map(r => r.split(','));
  return (
    <span className="inline-flex items-center align-middle mx-1.5 my-1 px-2.5 py-1.5 bg-slate-950 border-x-2 border-indigo-400 rounded-lg text-xs font-mono shadow-md">
      <span className="flex flex-col gap-1">
        {rows.map((row, rIdx) => (
          <span key={rIdx} className="flex gap-3 justify-center text-indigo-200">
            {row.map((cell, cIdx) => (
              <span key={cIdx} className="min-w-[1.2rem] text-center font-bold">{cell.trim()}</span>
            ))}
          </span>
        ))}
      </span>
    </span>
  );
}

// Componente de Sistema de Ecuaciones con Llave
function SystemOfEquations({ dataStr }) {
  const eqs = dataStr.split('|');
  return (
    <span className="inline-flex items-center align-middle mx-1 my-1">
      <span className="text-cyan-400 font-light text-4xl mr-1.5 leading-none translate-y-[-2px]">{'{'}</span>
      <span className="flex flex-col justify-center gap-1 text-cyan-100 font-mono text-[0.85em] leading-tight">
        {eqs.map((eq, i) => <span key={i}>{eq.trim()}</span>)}
      </span>
    </span>
  );
}

// Renderizado de línea con negritas, código en línea, fracciones, matrices y sistemas
function renderLineWithInlineFormatting(line) {
  if (!line) return null;

  const tokenRegex = /(\\matrix\{[^}]+\}|\\frac\{[^}]+\}\{[^}]+\}|\\system\{[^}]+\}|\*\*[^*]+\*\*|`[^`]+`)/g;
  const parts = line.split(tokenRegex);

  return parts.map((part, i) => {
    if (!part) return null;

    const systemMatch = part.match(/^\\system\{([^}]+)\}$/);
    if (systemMatch) {
      return <SystemOfEquations key={i} dataStr={systemMatch[1]} />;
    }

    const matrixMatch = part.match(/^\\matrix\{([^}]+)\}$/);
    if (matrixMatch) {
      return <RenderMatrix key={i} dataStr={matrixMatch[1]} />;
    }

    const fracMatch = part.match(/^\\frac\{([^}]+)\}\{([^}]+)\}$/);
    if (fracMatch) {
      return <StackedFraction key={i} num={fracMatch[1]} den={fracMatch[2]} />;
    }

    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={i} className="font-bold text-white bg-indigo-500/20 px-1.5 py-0.5 rounded border border-indigo-500/30">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={i} className="font-mono bg-slate-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30 text-[0.9em]">
          {part.slice(1, -1)}
        </code>
      );
    }

    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

// Formateador del contenido completo de la respuesta de la IA
function FormatMessageContent({ text }) {
  const sanitized = sanitizeLatex(text);
  const lines = sanitized.split('\n');

  return (
    <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-200">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Banner de Alerta de Examen
        const isAlert = trimmed.includes('ALERTA DE EXAMEN') || trimmed.startsWith('⚠️');
        if (isAlert) {
          const alertText = trimmed
            .replace(/^#+\s*/, '')
            .replace(/^⚠️\s*/, '')
            .replace(/^ALERTA DE EXAMEN:?\s*/i, '');
          return (
            <div key={idx} className="my-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 shadow-md">
              <div className="flex items-center gap-2 font-bold text-amber-300 text-xs sm:text-sm mb-1.5">
                <span className="text-base">⚠️</span>
                <span>ALERTA DE EXAMEN</span>
              </div>
              <div className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-medium">
                {renderLineWithInlineFormatting(alertText || trimmed)}
              </div>
            </div>
          );
        }

        // Encabezados de sección
        if (trimmed.startsWith('#')) {
          const headerText = trimmed.replace(/^#+\s*/, '');
          return (
            <h4 key={idx} className="font-black text-indigo-300 text-sm sm:text-base mt-4 mb-1 border-b border-slate-800 pb-1">
              {headerText}
            </h4>
          );
        }

        // Bloques de ecuaciones destacadas
        const hasMathOps = trimmed.includes('=') || trimmed.includes('→') || trimmed.includes('⇒') || trimmed.includes('\\frac') || trimmed.includes('\\matrix') || trimmed.includes('∫') || trimmed.includes('²') || trimmed.includes('³') || trimmed.includes('·');
        const isNotUrlOrList = !trimmed.startsWith('http') && !/^\d+\./.test(trimmed) && !trimmed.startsWith('-') && !trimmed.startsWith('*');

        if (hasMathOps && isNotUrlOrList && trimmed.length < 200) {
          return (
            <div key={idx} className="my-3 p-3.5 px-4 bg-slate-950/90 rounded-2xl border border-cyan-500/30 text-cyan-300 font-mono text-xs sm:text-sm shadow-inner overflow-x-auto flex items-center flex-wrap gap-2 leading-relaxed">
              {renderLineWithInlineFormatting(trimmed)}
            </div>
          );
        }

        // Párrafo estándar
        return (
          <p key={idx} className="leading-relaxed">
            {renderLineWithInlineFormatting(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Barra de navegación sticky
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { label: 'Vídeos', href: '#videos' },
    { label: 'Tutor IA', href: '#tutor' },
    { label: 'Chuletas', href: '#formulas' },
    { label: 'Fichas PDF', href: '#fichas' },
    { label: 'Test', href: '#test' },
    { label: 'El Profe', href: '#profe' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <a href="#" className="flex items-center gap-3 group">
          <img 
            src="https://i.postimg.cc/rFRP3pd8/Logo-circular.jpg" 
            alt="Logo Mates para Noobs" 
            className="w-11 h-11 rounded-full border-2 border-indigo-400/70 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0 object-cover"
          />
          <span className="font-black text-xl text-white tracking-tight">
            MatesPara<span className="text-indigo-400">Noobs</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-indigo-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://youtube.com/@matesparanoobs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20"
          >
            <Youtube className="w-4 h-4 fill-current" />
            <span>Ver Canal</span>
          </a>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-300 hover:text-indigo-400"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://youtube.com/@matesparanoobs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold"
          >
            <Youtube className="w-4 h-4 fill-current" />
            <span>Ir al canal de YouTube</span>
          </a>
        </div>
      )}
    </nav>
  );
}

// Sección Hero principal
function Hero() {
  return (
    <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[160px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-6">
          <Flame className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>Matemáticas para ESO y Bachillerato en plan fácil</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
          Aprueba Mates <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-400 bg-clip-text text-transparent">
            sin rodeos ni rollos teóricos
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
          Explicaciones paso a paso, resolución de ejercicios clave de examen y un Tutor IA disponible 24/7 para resolver tus dudas antes del control.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#tutor"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.02]"
          >
            <Brain className="w-5 h-5" />
            <span>Preguntar a DudaBot IA</span>
          </a>
          <a
            href="#videos"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all"
          >
            <Play className="w-4 h-4 text-indigo-400 fill-current" />
            <span>Explorar Vídeos</span>
          </a>
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
            <div className="text-2xl font-black text-white mb-0.5">+90</div>
            <div className="text-xs font-semibold text-slate-400">Vídeos de examen</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
            <div className="text-2xl font-black text-white mb-0.5">ESO & Bach</div>
            <div className="text-xs font-semibold text-slate-400">Temario Oficial</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
            <div className="text-2xl font-black text-white mb-0.5">Paso a paso</div>
            <div className="text-xs font-semibold text-slate-400">Sin saltarse nada</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center">
            <div className="text-2xl font-black text-white mb-0.5">Tutor IA</div>
            <div className="text-xs font-semibold text-slate-400">Respuesta inmediata</div>
          </div>
        </div>

      </div>
    </section>
  );
}

// Galería de vídeos filtrable por tema, curso y búsqueda
function VideoGallery({ onSelectVideo }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Todos los Vídeos' },
    { id: 'algebra', label: 'Ecuaciones y Sistemas' },
    { id: 'polinomios', label: 'Polinomios y Ruffini' },
    { id: 'fracciones', label: 'Fracciones Algebraicas' },
    { id: 'funciones', label: 'Funciones y Límites' },
    { id: 'integrales', label: 'Integrales y Derivadas' },
    { id: 'geometria', label: 'Geometría y Vectores' },
    { id: 'matrices', label: 'Matrices y Determinantes' },
  ];

  const filteredVideos = VIDEO_DATABASE.filter(video => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          video.desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    const levelStr = video.level;
    const matchesCourse = selectedCourse === 'all' || 
      (selectedCourse === '1º ESO' && (levelStr.includes('1º ESO') || levelStr.includes('1º/2º ESO'))) ||
      (selectedCourse === '2º ESO' && (levelStr.includes('2º ESO') || levelStr.includes('1º/2º ESO') || levelStr.includes('2º/3º ESO'))) ||
      (selectedCourse === '3º ESO' && (levelStr.includes('3º ESO') || levelStr.includes('2º/3º ESO') || levelStr.includes('3º/4º ESO'))) ||
      (selectedCourse === '4º ESO' && (levelStr.includes('4º ESO') || levelStr.includes('3º/4º ESO'))) ||
      (selectedCourse === '1º Bachillerato' && (levelStr.includes('1º Bach') || levelStr.includes('1º/2º Bach') || levelStr.includes('& Bach'))) ||
      (selectedCourse === '2º Bachillerato' && (levelStr.includes('2º Bach') || levelStr.includes('1º/2º Bach') || levelStr.includes('& Bach')));

    return matchesCategory && matchesSearch && matchesCourse;
  });

  return (
    <section id="videos" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-bold border border-indigo-500/20 mb-3">
              <Youtube className="w-4 h-4 text-red-500" />
              <span>Biblioteca de Vídeos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Aprende por Temas
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-48 shrink-0">
              <GraduationCap className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-xs sm:text-sm text-white appearance-none focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value="all">Todos los cursos</option>
                <option value="1º ESO">1º ESO</option>
                <option value="2º ESO">2º ESO</option>
                <option value="3º ESO">3º ESO</option>
                <option value="4º ESO">4º ESO</option>
                <option value="1º Bachillerato">1º Bachillerato</option>
                <option value="2º Bachillerato">2º Bachillerato</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar (Ruffini, reducción...)"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin scrollbar-thumb-slate-800">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => onSelectVideo(video)}
                className="group bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 shadow-lg flex flex-col"
              >
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-md text-[11px] font-mono font-bold text-indigo-300 border border-slate-800">
                    {video.level}
                  </div>

                  {video.pdfUrl && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-indigo-600/90 backdrop-blur-md rounded-md text-[10px] font-mono font-bold text-white shadow-md flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>+ PDF</span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                      {video.categoryLabel}
                    </span>
                    <h3 className="font-bold text-white text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                      {video.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                    <span>Ver explicación en vídeo</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
            <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-slate-300 font-bold text-base mb-1">No se encontraron vídeos</h3>
            <p className="text-slate-500 text-xs">Prueba a cambiar el filtro de curso o el término de búsqueda</p>
          </div>
        )}

      </div>
    </section>
  );
}

// Modal reproductor con botón de descarga de PDF condicional
function VideoModal({ video, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              {video.categoryLabel} ({video.level})
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            aria-label="Cerrar vídeo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-video bg-black w-full">
          <iframe 
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`} 
            title={video.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>

        <div className="p-6 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-lg leading-snug mb-1">
              {video.title}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              {video.desc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {video.pdfUrl && (
              <a 
                href={video.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-colors w-full sm:w-auto shadow-md shadow-indigo-600/20"
              >
                <BookOpen className="w-4 h-4" />
                <span>Ejercicios (PDF)</span>
              </a>
            )}
            <a 
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-colors w-full sm:w-auto"
            >
              <Youtube className="w-4 h-4 fill-current" />
              <span>Ver en YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

// Tutor IA interactivo DudaBot con respuestas matemáticas formateadas
function AITutor() {
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      text: '¡Buenas! Soy **DudaBot**, la IA de Carlos (**Mates para Noobs**). Dime qué ejercicio se te está atravesando o qué dudas tienes de tu examen de matemáticas de la ESO o Bachillerato y te lo explico paso a paso sin líos.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sampleQuestions = [
    "¿Cómo hago Ruffini si me falta el término independiente?",
    "¿Cómo despejo x en ecuaciones con denominadores?",
    "¿Cómo sé si una matriz 3x3 tiene inversa?",
    "¿Cómo aplico la regla ALPES para integrar por partes?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Respuesta de respaldo local inteligente si la API externa no tiene clave configurada en preview
  const getFallbackExplanation = (question) => {
    const q = question.toLowerCase();
    if (q.includes('ruffini')) {
      return `Vamos a verlo paso a paso con la **Regla de Ruffini**:\n\n1. Ordena el polinomio de mayor a menor grado. Si falta el término independiente (el número solo al final), **es obligatorio poner un 0** en la última columna.\n2. Por ejemplo, para factorizar x³ - 4x, sacamos primero factor común: x · (x² - 4) = 0.\n3. Recuerda que un polinomio sin término independiente siempre tiene como primera raíz **x = 0**.\n\n⚠️ ALERTA DE EXAMEN: Nunca te saltes el 0 cuando falte un grado intermedio o el término independiente, o toda la tabla de Ruffini se desplazará y dará mal.`;
    }
    if (q.includes('denominador') || q.includes('fraccion')) {
      return `Para resolver ecuaciones con denominadores sin fallar en los signos:\n\n1. Calcula el **mínimo común múltiplo (m.c.m.)** de todos los denominadores.\n2. Divide el m.c.m. entre cada denominador antiguo y multiplica el resultado por su numerador.\n3. Una vez que toda la ecuación tiene el mismo denominador, ya puedes tacharlos.\n\n\\frac{x - 1}{2} + \\frac{x + 3}{4} = 2  →  2(x - 1) + (x + 3) = 8\n\n⚠️ ALERTA DE EXAMEN: Si delante de una fracción hay un **signo menos (-)**, ese menos cambia el signo a TODO el numerador de esa fracción al quitar denominadores.`;
    }
    if (q.includes('inversa') || q.includes('matriz')) {
      return `Para saber si una matriz cuadrada A de orden 3x3 tiene inversa (A⁻¹):\n\n1. Calcula primero su determinante **|A|** usando la Regla de Sarrus.\n2. Si **|A| ≠ 0**, la matriz **SÍ tiene inversa** (es una matriz regular).\n3. Aplica la fórmula general:\n\nA⁻¹ = \\frac{1}{|A|} · (Adj(A))ᵀ\n\n⚠️ ALERTA DE EXAMEN: Si te da |A| = 0, para inmediatamente y escribe que **no existe matriz inversa** porque no se puede dividir entre cero.`;
    }
    if (q.includes('alpes') || q.includes('partes') || q.includes('integral')) {
      return `La **Regla ALPES** te dice qué función elegir como **u** en la fórmula de integración por partes:\n\n∫ u · dv = u · v - ∫ v · du\n\n1. **A**rcotangente / Arcoseno (máxima prioridad para ser u)\n2. **L**ogaritmos (ln x)\n3. **P**olinomios (x², 3x...)\n4. **E**xponenciales (eˣ)\n5. **S**eno / Coseno (mínima prioridad)\n\n⚠️ ALERTA DE EXAMEN: Lo que elijas como **u** se **deriva** para sacar du, y el resto se **integra** para sacar v. ¡No los confundas!`;
    }
    return `¡Buena pregunta! Para resolver este tipo de ejercicios paso a paso:\n\n1. Identifica primero qué datos te da el enunciado y qué incógnita te piden despejar.\n2. Simplifica paréntesis y agrupa términos semejantes antes de operar.\n3. Revisa siempre la solución sustituyendo el resultado en la expresión original.\n\n⚠️ ALERTA DE EXAMEN: Repasa siempre los signos negativos delante de paréntesis o fracciones; ahí es donde se escapa el 80% de los puntos en el examen.`;
  };

  const sendMessage = async (textToSend) => {
    const userMessage = textToSend || input.trim();
    if (!userMessage || isLoading) return;

    if (!textToSend) setInput('');

    const updatedMessages = [...messages, { role: 'user', text: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const systemPrompt = "Eres Carlos, profesor de matemáticas de secundaria y bachillerato en España y creador del canal de YouTube 'Mates para Noobs'. Tu misión es ayudar a los alumnos a entender las matemáticas de la ESO y Bachillerato para aprobar sus exámenes.\n\nREGLAS OBLIGATORIAS DE FORMATO:\n1. FORMATO DE FRACCIONES: Para representar fracciones, usa SIEMPRE la sintaxis `\\frac{numerador}{denominador}` (ej. `\\frac{3}{4}`).\n2. FORMATO DE MATRICES Y DETERMINANTES: Usa SIEMPRE `[[a, b], [c, d]]`.\n3. IMPORTANTE SOBRE SÍMBOLOS: Usa símbolos Unicode reales para texto matemático ('∫', '·', '√', '→', x², x³). La ÚNICA etiqueta de estilo LaTeX permitida es `\\frac{...}{...}` para las fracciones.\n4. Explica los ejercicios paso a paso usando listas numeradas (1., 2., 3.).\n5. Incluye SIEMPRE al final de tu explicación una sección titulada '⚠️ ALERTA DE EXAMEN' advirtiendo sobre el error más típico.";

      const apiKey = ""; 
      if (!apiKey) {
        await new Promise(resolve => setTimeout(resolve, 650));
        const fallbackText = getFallbackExplanation(userMessage);
        setMessages(prev => [...prev, { role: 'model', text: fallbackText }]);
        setIsLoading(false);
        return;
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const payload = {
        contents: updatedMessages.map(m => ({
          role: m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.text }]
        })),
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.[0]?.text) {
        const text = result.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { role: 'model', text }]);
      } else {
        throw new Error("Respuesta no válida");
      }
    } catch (error) {
      const fallbackText = getFallbackExplanation(userMessage);
      setMessages(prev => [...prev, { role: 'model', text: fallbackText }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="tutor" className="py-20 bg-slate-900/40 border-y border-slate-800/80 relative overflow-hidden">
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-3">
            <Brain className="w-4 h-4" />
            <span>Asistente de Exámenes 24/7</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            DudaBot: Tutor de Matemáticas IA
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            ¿Dudas a última hora estudiando para el examen de mañana? Pon tu problema y obtén la explicación en segundos.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none justify-start sm:justify-center">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(q)}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 text-slate-300 hover:text-white text-xs font-semibold whitespace-nowrap transition-all shrink-0"
            >
              💡 {q}
            </button>
          ))}
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[560px]">
          
          <div className="bg-slate-900/90 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <div>
                <h3 className="text-white font-bold text-sm">DudaBot (Profe IA MatesParaNoobs)</h3>
                <p className="text-slate-400 text-[11px] font-mono">Responde con los pasos exactos para tu examen</p>
              </div>
            </div>
            <div className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Tutor IA Activo
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-1">
                    <Brain className="w-4 h-4 text-indigo-400" />
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-2xl px-4 py-3.5 ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white font-medium rounded-tr-none shadow-md text-sm sm:text-base' 
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none text-xs sm:text-sm leading-relaxed shadow-sm'
                }`}>
                  {msg.role === 'user' ? (
                    <p>{msg.text}</p>
                  ) : (
                    <FormatMessageContent text={msg.text} />
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-1">
                  <Brain className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">DudaBot está escribiendo los pasos...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-slate-900/70 border-t border-slate-800">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe aquí tu duda de examen o ejercicio..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-4 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm transition-colors"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-40 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

// Sección de Chuletas de Fórmulas y Trucos
function FormulaCheatSheet() {
  const [activeTopic, setActiveTopic] = useState('ruffini');

  const formulas = {
    ruffini: {
      title: "Regla de Ruffini (Factorizar Polinomios)",
      level: "3º/4º ESO & Bachillerato",
      summary: "Divide un polinomio entre (x - a) de forma rápida sin hacer la división larga.",
      steps: [
        "Escribe solo los coeficientes del polinomio ordenados de mayor a menor grado.",
        "⚠️ Si falta algún término (ej: x³ - 5x + 2), PON UN CERO en el hueco de x².",
        "Baja el primer número directo al resultado.",
        "Multiplica por la raíz 'a' y suma en la columna siguiente."
      ],
      examTip: "Los candidatos a probar como raíz son siempre los divisores del término independiente."
    },
    sarrus: {
      title: "Regla de Sarrus (Determinantes 3x3)",
      level: "2º Bachillerato",
      summary: "Método directo para calcular determinantes de orden 3.",
      steps: [
        "Suma de las 3 diagonales principales: (a₁₁·a₂₂·a₃₃ + a₁₂·a₂₃·a₃₁ + a₁₃·a₂₁·a₃₂)",
        "Resta la suma de las 3 diagonales secundarias: -(a₁₃·a₂₂·a₃₁ + a₁₁·a₂₃·a₃₂ + a₁₂·a₂₁·a₃₃)",
        "⚠️ Atención con los signos menos: si una multiplicación da negativa, con el menos de la fórmula pasa a SER POSITIVA."
      ],
      examTip: "Utiliza paréntesis alrededor de la parte secundaria para no trabarte con los signos."
    },
    alpes: {
      title: "Método ALPES (Integración por partes)",
      level: "2º Bachillerato",
      summary: "Cómo elegir 'u' al aplicar ∫ u dv = u·v - ∫ v du",
      steps: [
        "A: Arcotangente / Arcoseno (prioridad máxima para u)",
        "L: Logaritmos (ln x)",
        "P: Polinomios (x², 3x...)",
        "E: Exponenciales (eˣ)",
        "S: Seno / Coseno (prioridad mínima)"
      ],
      examTip: "La función que esté más arriba en la palabra ALPES es la que debes elegir como 'u'."
    },
    rectas: {
      title: "Ecuaciones de la Recta en el Plano",
      level: "4º ESO / 1º Bachillerato",
      summary: "De la forma vectorial a la general a partir del punto P(x₀,y₀) y vector v=(v₁,v₂).",
      steps: [
        "Vectorial: (x,y) = (x₀,y₀) + k(v₁,v₂)",
        "Paramétricas: \\system{x = x₀ + k·v₁|y = y₀ + k·v₂}",
        "Continua: \\frac{x - x₀}{v₁} = \\frac{y - y₀}{v₂}",
        "General/Implícita: Ax + By + C = 0  (donde el vector director es v = (-B, A))"
      ],
      examTip: "Para hallar la pendiente m teniendo el vector director: m = \\frac{v₂}{v₁}."
    }
  };

  const topicKeys = Object.keys(formulas);
  const current = formulas[activeTopic];

  return (
    <section id="formulas" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-bold border border-indigo-500/20 mb-3">
            <Calculator className="w-4 h-4" />
            <span>Resumen de Examen</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Chuleta de Fórmulas y Trucos
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Lo indispensable para tener fresco antes de entrar a tu prueba.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4 space-y-2">
            {topicKeys.map((key) => {
              const item = formulas[key];
              const isActive = activeTopic === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTopic(key)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isActive 
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg' 
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-mono font-bold text-indigo-400 mb-1">{item.level}</div>
                  <div className="font-bold text-sm sm:text-base">{item.title}</div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                  {current.level}
                </span>
                <div className="flex items-center gap-3 mt-2">
                  <img 
                    src="https://i.postimg.cc/rFRP3pd8/Logo-circular.jpg" 
                    alt="Logo" 
                    className="w-7 h-7 rounded-full border border-indigo-400/50 object-cover shrink-0"
                  />
                  <h3 className="text-xl sm:text-2xl font-black text-white">{current.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Descargar Chuleta (PDF)</span>
              </button>
            </div>

            <p className="text-slate-300 text-sm font-medium mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
              {renderLineWithInlineFormatting(current.summary)}
            </p>

            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-400 mb-3">
              Pasos clave para la resolución:
            </h4>
            <ul className="space-y-4 mb-6">
              {current.steps.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-xs sm:text-sm text-slate-300 items-start">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed mt-1">{renderLineWithInlineFormatting(step)}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm">
              <strong className="font-bold text-amber-300 block mb-1">💡 CONSEJO DE EXAMEN:</strong>
              <span>{renderLineWithInlineFormatting(current.examTip)}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

// Sección de Fichas de Ejercicios en PDF
function PDFExerciseSection() {
  const worksheets = [
    {
      title: "Sistemas de Ecuaciones: Método de Reducción",
      level: "3º / 4º ESO",
      count: "15 Ejercicios (3 Niveles + Soluciones)",
      desc: "Ficha estructurada en 3 niveles de dificultad progresiva con soluciones finales incluidas.",
      pdfUrl: "/ficha_reduccion.pdf"
    },
    {
      title: "Comparación y Ordenación de Fracciones",
      level: "1º / 2º ESO",
      count: "15 Ejercicios (3 Niveles + Soluciones)",
      desc: "Igual denominador, igual numerador y reducción a común denominador mediante m.c.m. con negativos.",
      pdfUrl: "/ficha_fracciones.pdf"
    },
    {
      title: "Integrales y Regla ALPES",
      level: "2º Bachillerato",
      count: "6 Ejercicios de Selectividad",
      desc: "Integración por partes, racionales por fracciones simples y sustitución.",
      pdfUrl: null
    }
  ];

  return (
    <section id="fichas" className="py-20 bg-slate-900/50 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-bold border border-indigo-500/20 mb-3">
            <BookOpen className="w-4 h-4" />
            <span>Fichas Listas para Imprimir</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Descargar Fichas de Ejercicios en PDF
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Colección de problemas típicos de examen ordenados por nivel con soluciones paso a paso.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {worksheets.map((ws, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 shrink-0">
                    {ws.level}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono font-semibold text-right">{ws.count}</span>
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{ws.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">{ws.desc}</p>
              </div>

              {ws.pdfUrl ? (
                <a 
                  href={ws.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-600/20"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Descargar Ficha PDF</span>
                </a>
              ) : (
                <button 
                  onClick={() => window.print()}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Imprimir Vista Rápida</span>
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// Test interactivo de autoevaluación
function ExamChallenge() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const quiz = [
    {
      question: "¿Qué ocurre si al factorizar por Ruffini te falta un término del polinomio (ej: x³ - 4x + 1)?",
      options: [
        "No pasa nada, se ponen los números tal cual",
        "Debes poner un CERO en el lugar del término ausente (0x²)",
        "Tienes que multiplicar todo el polinomio por 2",
        "Ruffini no se puede usar si faltan términos"
      ],
      correct: 1,
      explanation: "¡Exacto! Siempre hay que colocar un cero en la columna del grado que falta para mantener el orden correcto de las potencias."
    },
    {
      question: "En un sistema de ecuaciones con fracciones, ¿cuál es el primer paso recomendable?",
      options: [
        "Despejar directamente la x con las fracciones",
        "Calcular el mcm de los denominadores para eliminarlos",
        "Sumar todos los numeradores",
        "Pasar todo a decimales"
      ],
      correct: 1,
      explanation: "¡Correcto! Hallar el mcm de los denominadores y multiplicar elimina las fracciones limpiamente para trabajar con enteros."
    },
    {
      question: "En la Regla ALPES para integrales por partes, ¿qué significa la 'L'?",
      options: [
        "Límites",
        "Logaritmos (ln x)",
        "Lineales",
        "Lógica"
      ],
      correct: 1,
      explanation: "¡Eso es! La 'L' corresponde a las funciones Logarítmicas. Si hay un logaritmo, casi siempre se elige como 'u'."
    }
  ];

  const handleSelect = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === quiz[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion + 1 < quiz.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
  };

  return (
    <section id="test" className="py-16 bg-slate-900/30 border-y border-slate-800/80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                Desafío de Examen Rápido
              </span>
            </div>
            {!showResult && (
              <span className="text-xs font-mono text-slate-400">
                Pregunta {currentQuestion + 1} de {quiz.length}
              </span>
            )}
          </div>

          {!showResult ? (
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-6">
                {quiz[currentQuestion].question}
              </h3>

              <div className="space-y-3 mb-6">
                {quiz[currentQuestion].options.map((opt, idx) => {
                  let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700";
                  if (selectedOption !== null) {
                    if (idx === quiz[currentQuestion].correct) {
                      btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
                    } else if (idx === selectedOption) {
                      btnStyle = "bg-red-500/20 border-red-500 text-red-300 font-bold";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={selectedOption !== null}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 mb-6 text-xs sm:text-sm text-slate-300">
                  <p className="font-medium">{quiz[currentQuestion].explanation}</p>
                </div>
              )}

              {selectedOption !== null && (
                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    {currentQuestion + 1 < quiz.length ? "Siguiente Pregunta" : "Ver Resultado"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-500 flex items-center justify-center text-indigo-400 mx-auto mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">
                ¡Has completado el desafío!
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Puntuación obtenida: <strong className="text-indigo-400 text-lg">{score} / {quiz.length}</strong>
              </p>
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Volver a intentarlo
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

// Sección sobre el profesor Carlos
function AboutProfe() {
  return (
    <section id="profe" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-bold border border-indigo-500/20">
                <GraduationCap className="w-4 h-4" />
                <span>Enfoque Didáctico</span>
              </div>
              
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                El método de <span className="text-indigo-400">Carlos</span>
              </h2>

              <div className="space-y-4 text-slate-300 text-base sm:text-lg leading-relaxed">
                <p>
                  Las matemáticas no se atragantan por falta de capacidad, sino porque a veces se enseñan con un lenguaje abstracto que desconecta del ejercicio real.
                </p>
                <p>
                  En <strong className="text-white font-bold">Mates para Noobs</strong> voy directo al grano. Explicamos exactamente lo que necesitas para resolver los exámenes de la ESO y Bachillerato en España, indicando la trampa de cada problema y el paso a paso estructurado.
                </p>
                <p className="p-4 bg-slate-950/80 border-l-4 border-indigo-500 rounded-r-xl text-slate-200 italic text-sm sm:text-base font-medium">
                  "Entender la estructura lógica de un problema vale más que memorizar 50 fórmulas de memoria."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">Ejercicios de Examen</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">Preparación de Selectividad</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">Respuesta a dudas reales</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">Explicaciones claras y breves</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
                    M
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Carlos - MatesParaNoobs</h4>
                    <p className="text-slate-400 text-xs font-mono">Profesor de ESO y Bachillerato</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-center space-y-3">
                  <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Fórmula MatesParaNoobs</div>
                  <div className="text-sm font-bold text-white bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 shadow-inner leading-snug">
                    Entender la base + vigilar los signos = <span className="text-emerald-400">Aprobado asegurado</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Sin rodeos ni rollos teóricos. Ejercicios resueltos paso a paso para salvar tu próximo examen.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

// Footer con redes sociales
function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <img 
            src="https://i.postimg.cc/rFRP3pd8/Logo-circular.jpg" 
            alt="Logo Mates para Noobs" 
            className="w-8 h-8 rounded-full border border-indigo-400/50 object-cover"
          />
          <span className="font-black text-lg text-white">
            MatesPara<span className="text-indigo-400">Noobs</span>
          </span>
        </div>

        <p className="text-slate-500 text-xs sm:text-sm font-medium text-center md:text-left">
          Explicaciones de Matemáticas para la ESO y Bachillerato. Todos los derechos reservados.
        </p>

        <div className="flex items-center gap-5">
          <a 
            href="https://youtube.com/@matesparanoobs" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-red-400 text-xs sm:text-sm font-semibold transition-colors"
          >
            <Youtube className="w-4 h-4 text-red-500 fill-current" />
            <span>YouTube</span>
          </a>
          <a 
            href="https://www.instagram.com/matesparanoobs/" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-pink-400 text-xs sm:text-sm font-semibold transition-colors"
          >
            <svg className="w-4 h-4 fill-current text-pink-500" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Instagram</span>
          </a>
          <a 
            href="https://www.tiktok.com/@mates.para.noobs?is_from_webapp=1&sender_device=pc" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-xs sm:text-sm font-semibold transition-colors"
          >
            <svg className="w-4 h-4 fill-current text-cyan-400" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
            <span>TikTok</span>
          </a>
        </div>

      </div>
    </footer>
  );
}

// Componente Principal App
export default function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <VideoGallery onSelectVideo={(video) => setSelectedVideo(video)} />
        <AITutor />
        <FormulaCheatSheet />
        <PDFExerciseSection />
        <ExamChallenge />
        <AboutProfe />
      </main>
      <Footer />

      {selectedVideo && (
        <VideoModal 
          video={selectedVideo} 
          onClose={() => setSelectedVideo(null)} 
        />
      )}
    </div>
  );
}