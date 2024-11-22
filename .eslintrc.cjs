const SPACES = 4;

module.exports = {
  root: true,
  env: { browser: true, es2020: true, jest: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: [
    "react-refresh",
    "unused-imports",
    "sort-destructure-keys",
  ],
  "rules": {
        //"react/react-in-jsx-scope": "error", //Para versiones anteriores a R17 falla cuando no importamos React (Si se usa version 17 en adelante desactivar.)
        "semi": "error", //Se necesita agregar ";" luego de las declaraciones.
        "prefer-const": "error", //Preferir el uso de constantes sobre let.
        "no-constant-binary-expression": "error", // investigar
        "no-constant-condition": "error", // No permite valores constantes en las condiciones ej: if(true).
        "func-style": "error", // No usar "function" y preferir el uso de: const funcion = () => {}.
        "space-before-function-paren": "error", // Colocar espacio antes de parentesis.
        "space-before-blocks": "error", // espacios antes de bloques.
        "no-duplicate-imports": "error", // No usar imports duplicados.
        "no-empty-pattern": "error", // A la hora de desestructurar, no puede quedar vacio.
        "no-multi-spaces": "error", // No permite mas de un espacio.
        "arrow-spacing": "error", // espacios antes y despues de la funcion flecha.
        "comma-spacing": "error", //espacio despues de la coma.
        "comma-style": ["error", "last"], //la coma va antes del salto de linea.
        "dot-location": ["error", "property"], // el punto de object.propery va antes del salto de linea.
        "key-spacing": ["error", { "beforeColon": false }], //espacio despues de los dos puntos y no antes.
        "space-in-parens": ["error", "never"], //Espacios en parentesis nunca.
        "brace-style": "error", // Si en los bloques usamos "{}" entonces requiere salto de linea.
        "camelcase": "error", //Variables en camelCase.
        "eqeqeq": ["error", "always"], // Obliga a usar "===" o "!==".
        "curly": ["error", "multi"], // Si las declaraciones de bloque tienen una sola declaracion no poner "{}".
        "indent": ["error", SPACES, { "SwitchCase": 1 }], // indentacion de 4 espacios.
        "keyword-spacing": ["error", { "before": true, "after": true }], // Espacios antes y despues de las palabras claves.
        "no-return-assign": ["error", "always"], //No se permiten asignaciones en declaraciones return.
        "no-unneeded-ternary": "error", //Evita el uso de ternarios que son inncesesarios.
        "no-console": ["warn", { allow: ["error"] }], // Si ve un console que no sea error avisa con un warning.
        "quotes": ["error", "double", { "allowTemplateLiterals": true }], //
        "no-extra-semi": "error", //No se permiten ";" extras.
        "no-floating-decimal": "error", //Exigir formato "0.2" o "2.0" para numeros decimales.
        "no-magic-numbers": "error", // No permite numeros magicos, hay que declarar variables para usarlos.
        "no-nested-ternary": "error", // No permite ternarios anidados.
        "no-unused-vars": "warn", // Advierte el tener variables sin usar.
        "no-var": "error", // No permite uso de var.
        "comma-dangle": ["error", { "arrays": "always-multiline", "objects": "always-multiline" }], // En arrays y objetos, si las propiedades estan con saltos de linea, el ultimo lleva coma.
        "jsx-quotes": ["error", "prefer-double"], // Preferir comillas dobles en jsx.
        "block-spacing": "error", //Agregar espacio bloques.
        "object-curly-newline": ["error", { "multiline": true }], //Si una propiedad de objeto esta en otra linea, todas las propiedades van en nuevas lineas.
        "object-curly-spacing": ["error", "always"], //Despues de "{" requiere un espacio, tambien antes de "}"
        "react/jsx-space-before-closing": "warn", // Antes de cerrar el componente requiere un espacio.
        "react/jsx-curly-spacing": "warn", // Las propiedades de componentes van sin espacios despues y antes de "{}"
        "react/button-has-type": "error", // Requiere definir el "type" de los button.
        "react/jsx-no-duplicate-props": "error", // No se pueden duplicar propiedades.
        "react/jsx-no-useless-fragment": "error", //Evita el uso de fragmentos innecesarios.
        "react/jsx-one-expression-per-line": "error", //Requiere saltos de linea por cada etiqueta jsx.
        "react/jsx-pascal-case": "error", //Los componentes deben ser nombrados con PascalCase.
        "react/jsx-props-no-multi-spaces": "error", //Al colocar props de componentes en distintas lineas, no pueden quedar lineas vacias.
        "react/jsx-sort-props": "error", //Ordenar las props alfabeticamente.
        "react/jsx-tag-spacing": "error", // Prohibe los espacios al inicio de las etiquetas.
        "react/self-closing-comp": "error", // Si la etiqueta no tienen hijos, se debe cerra a si misma.
        "react/jsx-uses-react": "error", // Si la importacion de React no se usa, nos advierte.
        "react/jsx-indent-props": ["error", SPACES], // Las props de los componentes tienen que respetar la indentacion de 4 espacios.
        "react/jsx-max-props-per-line": ["error", { "maximum": 3 }], // Maximo de props por linea de 3.
        "react/jsx-no-undef": "error", // Si no esta importado el componente, falla.
        "react/jsx-key": "error", // Requiere que se coloque la propiedad key sobre los componentes iterables.
        "react/hook-use-state": "error", // Al usar useState obliga a mantener nomenclatura. Ej:  [contador, setContador].
        "react/no-multi-comp": "error", // Prohibe exportar mas de un componente por archivo.
        "unused-imports/no-unused-imports": "warn", // Warning cuando hay imports sin usar.
        "no-undef": "error", // Error cuando hay variables que se usan pero no estan definidas.
        "sort-destructure-keys/sort-destructure-keys": ["warn", { "caseSensitive": false }],
        // Usamos proptypes?
    },
};
