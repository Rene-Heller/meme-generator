JavaScript Cheat-Sheet für Python-Entwickler (basierend auf dem gegebenen Code)
## 1.Imports

### Python:
```python
from service import imageArray
```
### JavaScript:
```js
import { imageArray } from './service';
```
>JavaScript importiert Module ähnlich wie Python. Die geschweiften Klammern bedeuten: Importiere genau diese benannten Werte.

---

## 2.Funktionen

### Python:

```python
 def load_templates():
    pass
 ```

 ### JavaScript:
 ```js
 function loadTemplates() {}
 ```

>Mit export wird eine Funktion auch für andere Dateien verfügbar:
>>`export function loadTemplates() {}`

---

## 3. Variablen

### JavaScript
 - `let -> Variable kann später geändert werden `
 - `const -> Referenz wird nicht neu zugewiesen`

---
## 4. Bedingungen
### Python:

```python
if len(imageArray) == 0:
    something()
elif len(imageArray) > 0:
    somethingElse()
else:
    nothing()

 ```

### JavaScript:

```js
 if (imageArray.length === 0) {
    something();
 } else if(imageArray.length > 0){
    somthingElse()
 }else{
    nothing()
 }
 ```

 > **Der JS-Shorthand für if/else ist:**
 >>```
 >>const value = imageArray.length > 0 ? something() : nothing()
 >>```

Unterschiede:
 - `length` statt `len() `
 - `===` möglich statt `==` ---> (`===` überprüft strict)
 - geschweifte Klammern statt Einrückungsblöcke

---
## 5. Arrays und Schleifen

### Python:
```python
 for element in custom_list:
    pass
```

### JavaScript:

```js
for (const element of listArray) {};
for (const key in object) {};
```

---
### 6. Objektzugriff

## Python:

```python
file.name
```
## JavaScript:

```js
file.name
```

---

### 7. Booleans

## Python:

```python
true_var = True
false_var = False
```
## JavaScript:

```js
const trueVar = true;
const falseVar = false;
```
>`";"` ist in JS nicht immer Pflicht, wird aber konventionell hinter jeder Funktion/ hinter jedem Scope gesetzt.
---

### 8. Methoden



| **.method()** | **Python** | **JavaScript** |
| ------------- | ---------- | -------------- |
| `.includes()` | `found = "cat" in array` | `const found = array.includes("cat");` |
| `.map()`      | `result = list(map(lambda n: n * 2, numbers)) or ` | `const result = numbers.map(n => n * 2);` |
|   | `result = [n * 2 for n in numbers]` |   |
| `.push()` | `array.append("cat")` | `array.push("cat");` |
| `.split()` | `words = text.split(" ")` | `const words = text.split(" ");` |
| `.pop()` | `last = array.pop()` | `const last = array.pop();` |
