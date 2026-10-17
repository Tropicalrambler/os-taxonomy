# Taxonomía de habilidades de Marble

Una taxonomía abierta de **lo que aprenden los niños y las niñas** en la escuela primaria: ideas pequeñas («microtemas»), unidas por un grafo de prerrequisitos y alineadas con estándares curriculares. La creó [Marble](https://withmarble.com).

> **Versión:** `v1` · **Temas:** 1,590 · **Relaciones de prerrequisito:** 3,221 · **Áreas:** 8

Este archivo es la presentación en español latinoamericano (`es-419`) del conjunto de datos. La versión en inglés del proyecto está en [README.md](README.md).

## Qué es

La mayoría de los currículos son una lista plana de estándares, o viven encerrados en un producto. Estos datos son un **grafo de aprendizaje**:

- **1,590 microtemas.** Cada uno es una idea que se puede enseñar (por ejemplo, «Construir oraciones» o «El brillo aparente de las estrellas»), con una descripción en lenguaje claro, criterios de **evidencia** de dominio, un tipo (conceptual, procedimental, representacional, de lenguaje o de metacognición), un área, un dominio y un rango de edad aproximado.
- **3,221 prerrequisitos.** Un grafo dirigido: «el tema X depende del prerrequisito Y». Cada relación es `hard` o `soft` y trae una **razón** en una línea.
- **Alineación curricular.** Cada microtema enlaza los estándares de los que se destiló (NGSS, Common Core, el currículo nacional de Inglaterra y otros). Esos textos de terceros no se traducen aquí.
- **183 resúmenes por dominio,** escritos para las familias: un párrafo por área, dominio y edad.

### Áreas

| Área | Temas |
|---|---:|
| Ciencias Naturales | 547 |
| Matemáticas | 503 |
| Inglés | 286 |
| Historia | 90 |
| Desarrollo personal y social | 88 |
| Habilidades para la vida | 37 |
| Computación | 21 |
| Aprender a aprender | 18 |

Los nombres en inglés de las áreas y los dominios se conservan como claves. Los nombres para mostrar están en [`data/i18n/es-419/labels.json`](data/i18n/es-419/labels.json).

## La traducción

El español vive en [`data/i18n/es-419/`](data/i18n/es-419/) y **no modifica** los JSON en inglés. Se une al original por el mismo identificador.

| Archivo | Qué está en español | Cómo se une |
|---|---|---|
| [`topics.json`](data/i18n/es-419/topics.json) | `name`, `description` y cada elemento de `evidence` | `id` del tema |
| [`clusters.json`](data/i18n/es-419/clusters.json) | `summary` | `subject` + `domain` + `ageRangeStart` |
| [`dependencies.json`](data/i18n/es-419/dependencies.json) | `reason` | `topicId` + `prerequisiteId` |
| [`labels.json`](data/i18n/es-419/labels.json) | nombres de áreas, dominios y tipos | la clave en inglés |

El lenguaje está pensado para madres, padres y docentes en Guatemala y en el resto de América Latina. El trato es **ustedes**. No usa vocabulario propio de España (*vosotros*, *ordenador*, *coger*, *zumo*). Los términos de ciencias y de matemáticas son los de la primaria. Los códigos NGSS, Common Core y similares se dejan como están. Las letras y las palabras inglesas que el niño o la niña está aprendiendo (la palabra «I», el prefijo «un-») también se quedan en inglés.

Los esquemas están en [`schema/i18n-topics.schema.json`](schema/i18n-topics.schema.json), [`schema/i18n-clusters.schema.json`](schema/i18n-clusters.schema.json), [`schema/i18n-dependencies.schema.json`](schema/i18n-dependencies.schema.json) y [`schema/i18n-labels.schema.json`](schema/i18n-labels.schema.json).

Para comprobar que cada identificador tiene traducción, que no sobra ninguno y que no hay textos vacíos:

```bash
node scripts/validate.mjs
```

### Cómo unir un tema con su traducción

```js
import topics from './data/topics.json' with { type: 'json' };
import es from './data/i18n/es-419/topics.json' with { type: 'json' };

const en = new Map(topics.topics.map((t) => [t.id, t]));
for (const tr of es.topics) {
  const original = en.get(tr.id);
  // original.name en inglés, tr.name en español; mismo id
}
```

## Licencia y atribución

Esta traducción es una **obra derivada**. No cambia la autoría ni las licencias de Marble.

| Capa | Licencia |
|---|---|
| **La base de datos** — la colección, la estructura, los identificadores y las relaciones | [**ODbL 1.0**](LICENSE). Se puede usar en investigación y en productos comerciales. Hay que **atribuir** y, si se modifica la base, **compartir igual** (la base derivada sigue en ODbL). |
| **El texto que escribió Marble** — nombres, descripciones, evidencias, razones y resúmenes, **incluida esta traducción** | [**CC BY-SA 4.0**](LICENSE-CONTENT). Atribución y compartir igual. |
| **`curriculum-standards.json`** | No es de Marble. Cada fuente conserva su licencia. Véase [PROVENANCE.md](PROVENANCE.md). No forma parte de esta traducción. |

Cualquier uso debe acreditar:

> Taxonomía de habilidades de Marble (v1) · © Generative Spark, Inc. (Marble) · https://withmarble.com · base de datos bajo ODbL 1.0 y contenido bajo CC BY-SA 4.0.
> Traducción al español latinoamericano (es-419) · obra derivada publicada en el fork de Alain Berger ([Tropicalrambler](https://github.com/Tropicalrambler/os-taxonomy)) · distribuida bajo las **mismas licencias** (ODbL 1.0 para los datos traducidos y CC BY-SA 4.0 para el texto traducido).

La cita formal del conjunto original está en [CITATION.cff](CITATION.cff).

## Qué no está aquí

No se publican incrustaciones semánticas ni datos de ningún niño o niña. Los enunciados de evaluación (`assessmentPrompt`) siguen en inglés en esta entrega. El detalle de los archivos en inglés está en [README.md](README.md).
