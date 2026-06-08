# gesCasesRurals — Documentació Tècnica i Funcional Completa

> **Projecte Acadèmic** · Implantació d'Aplicacions Web  
> Tipologia: Memòria de Projecte Final · Nivell: CFGS DAW / DAM / Universitari

---

# 1. FITXA DE L'APLICACIÓ

| Camp | Valor |
|------|-------|
| **Nom de l'Aplicació** | gesCasesRurals |
| **Descripció** | Aplicació web per a la gestió integral de 6 cases rurals, incloent usuaris, reserves, disponibilitat i administració |
| **Autor** | Equip de Desenvolupament – Projecte Acadèmic IAW |
| **Data de Creació** | Juny 2026 |
| **Versió** | 1.0.0 |
| **Arquitectura** | Client / Servidor – Aplicació Web Tradicional – Arquitectura Multicapa (MVC) |
| **Tecnologies Frontend** | HTML5, CSS3, JavaScript Vanilla |
| **Tecnologies Backend** | PHP 8.x, MySQL 8.x, PDO |
| **Servidor Web** | Apache (XAMPP / WAMP) |
| **URL de Publicació** | `http://localhost/gesCasesRurals/` (entorn local) |
| **Paquet de Desplegament** | `.zip` amb codi font + fitxer `.sql` de base de dades |
| **Llicència** | Ús Acadèmic |

## Objectius del Sistema

1. Oferir una plataforma centralitzada per a la gestió de 6 cases rurals.
2. Permetre als clients consultar disponibilitat i realitzar reserves en línia.
3. Facilitar l'aprovació o rebuig de reserves per part dels administradors.
4. Evitar conflictes de reserva (solapes de dates en la mateixa casa).
5. Mantenir un historial complet de totes les reserves realitzades.
6. Proporcionar un panell d'administració amb gestió d'usuaris, cases i reserves.
7. Garantir la seguretat de les dades mitjançant bones pràctiques de desenvolupament web.

---

# 2. DEFINICIÓ DEL PROJECTE

## Problema que resol

Actualment, molts propietaris de cases rurals gestionen les seves reserves de manera manual (telèfon, correu electrònic, notes en paper o fulls de càlcul). Aquesta metodologia comporta errors humans greus com ara la doble reserva d'una mateixa casa per a les mateixes dates, la pèrdua d'informació de clients, la dificultat de consultar l'historial de reserves i la impossibilitat d'oferir als clients una forma àgil de consultar la disponibilitat en temps real.

**gesCasesRurals** resol tots aquests problemes integrant en una sola aplicació web la gestió completa del negoci: des de la consulta de disponibilitat per part del client fins a l'aprovació de reserves per part de l'administrador.

## Usuaris Objectiu

| Tipus d'Usuari | Descripció |
|----------------|------------|
| **Client (visitant registrat)** | Persona que vol consultar cases, fer reserves i gestionar les seves reservas personals |
| **Administrador** | Propietari o gestor del complex rural amb accés total al sistema |
| **Visitant anònim** | Persona que visita la web sense registrar-se i pot consultar informació pública |

## Beneficis

- **Per al propietari**: Digitalització completa del negoci, estalvi de temps, reducció d'errors, accés a estadístiques i historial.
- **Per al client**: Consulta de disponibilitat 24/7, reserva còmoda des de qualsevol dispositiu, gestió autònoma de les seves reserves.
- **Per al negoci**: Professionalització de la imatge, increment de la conversió de reserves, reducció de la carga administrativa.

## Abast del Sistema

El sistema **inclou**:
- Gestió de 6 cases rurals amb imatges i descripció.
- Registre i autenticació d'usuaris (clients i administradors).
- Procés complet de reserves (sol·licitud → aprovació/rebuig → confirmació).
- Control de disponibilitat i prevenció de duplicitats.
- Panel d'administració complet.
- Historial de reserves i notificacions internes.
- Log d'accions administratives.

El sistema **no inclou** (en la versió 1.0):
- Pagament en línia (passarel·la de pagament).
- Aplicació mòbil nativa (iOS/Android).
- Integració amb calendaris externs (Google Calendar).
- Xat en temps real entre client i administrador.
- Sistema de valoracions i comentaris públics.

## Limitacions

- L'aplicació és monolítica i no està dissenyada per a un escalat horitzontal massiu.
- Requereix un servidor web amb suport PHP i MySQL.
- La gestió d'imatges és local (no usa CDN).
- No inclou control de concurrència avançat per a transaccions simultànies.

---

# 3. ENTREVISTA DE REQUISITS

**Participants:**
- **Client (C):** Sr. Jordi Puigdomènech, propietari del complex rural "Can Puigdomènech"
- **Desenvolupador (D):** Responsable tècnic del projecte

---

**D:** Bon dia, Sr. Puigdomènech. Per a poder dissenyar l'aplicació correctament, m'agradaria fer-li algunes preguntes sobre el seu negoci i les seves necessitats. Comencem pel principi: com gestiona ara mateix les seves reserves?

**C:** Bon dia. Ara ho faig tot per telèfon i per WhatsApp. La meva filla porta un Excel, però de vegades ens equivoquem i hem tingut problemes amb reserves duplicades. Necessitem algo més professional.

**D:** Quantes cases rurals té exactament al complex?

**C:** En tenim sis. Cada una té un nom, una capacitat diferent i un preu per nit distint. Les cases van de 4 a 12 places.

**D:** Qui utilitza el sistema? Parlem d'usuaris interns i externs.

**C:** Per fora, els clients que volen reservar. Per dins, jo com a administrador i potser la meva filla també com a administradora. No serem més de 2 o 3 administradors.

**D:** Quants clients espera que s'hi registrin?

**C:** No sé... potser 200 o 300 l'any. No som un hotel gran. Ara tenim uns 50 clients habituals.

**D:** Des de quins dispositius accediran els clients a la web?

**C:** La majoria des del mòbil, però alguns també des de l'ordinador. Ha de funcionar bé en tots dos.

**D:** Expliqui'm el flux ideal d'una reserva. Com vol que funcioni?

**C:** El client entra a la web, veu les cases disponibles, tria una, mira les dates i demana la reserva. Jo rebo un avís, la reviso i l'accepto o la rebutjo. El client veu l'estat de la seva reserva.

**D:** Vol que el client pugui pagar en línia?

**C:** De moment no. Preferim cobrar en arribar. Potser en el futur.

**D:** Necessita que el sistema eviti que dos clients puguin reservar la mateixa casa per les mateixes dates?

**C:** Sí, és imprescindible. Això és el principal problema que tenim ara.

**D:** Quines dades vol guardar de cada client?

**C:** Nom complet, correu electrònic i contrasenya per a entrar. Potser el telèfon, però no és obligatori.

**D:** Quines dades vol tenir de cada casa?

**C:** El nom, una descripció, la capacitat, el preu per nit, unes quantes fotos i si està activa o no.

**D:** Vol que hi hagi alguna pàgina pública on es vegi informació de les cases sense necessitat de registrar-se?

**C:** Sí, que es puguin veure les cases i la disponibilitat sense registrar-se, però per a reservar sí que cal registrar-se.

**D:** Necessita estadístiques o informes?

**C:** Sí, m'agradaria veure quantes reserves hi ha per casa, quines estan pendents d'aprovació i un historial de tot.

**D:** Quant podria invertir mensualment en hosting?

**C:** Uns 10-15 euros al mes com a màxim. Res car.

**D:** En quant temps necessita tenir el sistema funcionant?

**C:** Idealment per a la temporada d'estiu, en uns 3 mesos.

**D:** Té alguna preferència pel disseny visual?

**C:** Que sigui senzill, net i que inspiri confiança. Colors naturals, com verds i marrons, que recorden la natura.

**D:** Alguna altra cosa que consideri important?

**C:** Que les contrasenyes estiguin protegides i que no es pugui accedir a dades d'altres usuaris. La privacitat és molt important.

**D:** Perfecte, Sr. Puigdomènech. Amb tota aquesta informació, podré dissenyar un sistema que s'ajusti a les seves necessitats. Gràcies.

**C:** Gràcies a vosaltres.

---

# 4. LLISTA DE REQUISITS

## 4.1 Requisits Funcionals

| ID | Requisit Funcional | Prioritat |
|----|-------------------|-----------|
| RF-01 | El sistema ha de permetre el registre de nous usuaris clients | Alta |
| RF-02 | El sistema ha de permetre l'autenticació d'usuaris amb email i contrasenya | Alta |
| RF-03 | El sistema ha de mostrar un llistat de les 6 cases rurals amb informació detallada | Alta |
| RF-04 | El sistema ha de mostrar les imatges de cada casa rural | Mitjana |
| RF-05 | El sistema ha de permetre consultar la disponibilitat d'una casa per a unes dates concretes | Alta |
| RF-06 | El sistema ha de permetre als clients registrats realitzar una sol·licitud de reserva | Alta |
| RF-07 | El sistema ha de bloquejar reserves amb dates solapades per a la mateixa casa | Alta |
| RF-08 | L'administrador ha de poder aprovar o rebutjar les reserves pendents | Alta |
| RF-09 | El client ha de poder veure l'estat de les seves reserves (pendent, acceptada, rebutjada, cancel·lada) | Alta |
| RF-10 | El client ha de poder cancel·lar una reserva pendent | Mitjana |
| RF-11 | L'administrador ha de poder gestionar (crear, editar, desactivar) les cases rurals | Alta |
| RF-12 | L'administrador ha de poder gestionar els usuaris del sistema | Alta |
| RF-13 | El sistema ha de mantenir un historial complet de totes les reserves | Alta |
| RF-14 | El sistema ha de generar notificacions internes per als usuaris | Baixa |
| RF-15 | El sistema ha de registrar totes les accions administratives en un log | Baixa |
| RF-16 | El sistema ha de permetre a l'administrador cercar i filtrar reserves | Mitjana |
| RF-17 | El sistema ha de mostrar una pàgina de contacte pública | Baixa |
| RF-18 | El sistema ha de permetre la gestió del perfil personal de l'usuari | Mitjana |

## 4.2 Requisits No Funcionals

| ID | Requisit No Funcional | Mètrica |
|----|----------------------|---------|
| RNF-01 | El sistema ha de tenir un temps de resposta màxim de 3 segons per a consultes habituals | ≤ 3 seg |
| RNF-02 | La interfície ha de ser responsive i funcionar correctament en mòbil i escriptori | Resolucions ≥ 320px |
| RNF-03 | El codi ha d'estar estructurat seguint el patró MVC | 100% |
| RNF-04 | El sistema ha de ser compatible amb els navegadors moderns principals (Chrome, Firefox, Safari, Edge) | Últimes 2 versions |
| RNF-05 | La base de dades ha d'estar normalitzada fins a la 3a Forma Normal (3FN) | 3FN |
| RNF-06 | El sistema ha de tenir un uptime del 99% en entorn de producció | 99% |
| RNF-07 | La documentació tècnica ha d'estar completa i actualitzada | 100% |

## 4.3 Requisits de Seguretat

| ID | Requisit de Seguretat |
|----|----------------------|
| RS-01 | Les contrasenyes han d'emmagatzemar-se amb hash BCrypt (cost ≥ 12) |
| RS-02 | Totes les consultes a la BD han d'usar PDO amb sentències preparades |
| RS-03 | S'ha de sanititzar tota entrada d'usuari per prevenir XSS |
| RS-04 | S'han d'implementar tokens CSRF en tots els formularis |
| RS-05 | El control d'accés per rols ha d'estar implementat a nivell de servidor |
| RS-06 | Les sessions han de tenir temps d'expiració configurats |
| RS-07 | Els fitxers sensibles (config, includes) han d'estar fora de l'arrel pública o protegits |
| RS-08 | S'han d'implementar capçaleres de seguretat HTTP (X-Frame-Options, CSP, etc.) |

## 4.4 Requisits de Rendiment

| ID | Requisit de Rendiment |
|----|----------------------|
| RP-01 | Les imatges han d'estar optimitzades (format WebP o JPEG comprimit) |
| RP-02 | Les consultes SQL han d'estar indexades correctament |
| RP-03 | El sistema ha de suportar fins a 100 usuaris concurrents en entorn local |
| RP-04 | El temps de càrrega inicial de la pàgina ha de ser inferior a 2 segons |

## 4.5 Requisits d'Usabilitat

| ID | Requisit d'Usabilitat |
|----|----------------------|
| RU-01 | La navegació ha de ser intuïtiva i consistent en totes les pàgines |
| RU-02 | Els formularis han de mostrar missatges d'error clars i localitzats |
| RU-03 | El sistema ha de mostrar missatges de confirmació per a accions crítiques |
| RU-04 | El disseny ha de seguir una paleta de colors coherent i accessible (contrast WCAG AA) |
| RU-05 | El sistema ha d'incloure pàgines d'error amigables (404, 403, 500) |

## 4.6 Requisits Tècnics

| ID | Requisit Tècnic |
|----|----------------|
| RT-01 | Llenguatge backend: PHP 8.x |
| RT-02 | Base de dades: MySQL 8.x |
| RT-03 | Accés a dades: PDO (PHP Data Objects) |
| RT-04 | Frontend: HTML5, CSS3, JavaScript Vanilla |
| RT-05 | Servidor web: Apache amb mod_rewrite |
| RT-06 | Entorn de desenvolupament: XAMPP / WAMP |
| RT-07 | Estructura: Arquitectura MVC |
| RT-08 | Codificació: UTF-8 en tot el projecte |

---

# 5. DFD NIVELL 0 — DIAGRAMA DE CONTEXT

```
                    ┌─────────────────────────────────────────┐
                    │                                         │
   [CLIENT]─────────►  sol·licitud de reserva                │
       │            │                                         │
       ◄────────────── confirmació / estat reserva            │
       │            │                                         │
   [CLIENT]─────────►  consulta disponibilitat                │
       │            │                                         │
       ◄────────────── resultats disponibilitat               │
       │            │                                         │
   [CLIENT]─────────►  registre / login                      │
       │            │           gesCasesRurals                │
       ◄────────────── sessió / token autenticació            │
                    │                                         │
[ADMINISTRADOR]────►  gestió cases, usuaris, reserves        │
       │            │                                         │
       ◄────────────── informes, historial, logs              │
                    │                                         │
[ADMINISTRADOR]────►  aprovació / rebuig de reserves         │
       │            │                                         │
       ◄────────────── confirmació d'acció                    │
                    │                                         │
                    └─────────────────────────────────────────┘
```

**Descripció dels fluxos:**

| Actor | Flux d'Entrada | Flux de Sortida |
|-------|---------------|-----------------|
| Client | Dades de registre, credencials d'accés, sol·licitud de reserva, dates de consulta | Sessió iniciada, llistat de cases, disponibilitat, estat de reserva |
| Administrador | Credencials d'accés, dades de casa (alta/edita/baixa), aprovació/rebuig de reserves, gestió d'usuaris | Panel de control, historial, estadístiques, logs d'accions |

---

# 6. DFD NIVELL 1 — DESCOMPOSICIÓ DE PROCESSOS

```
┌─────────────────────────────────────────────────────────────────────┐
│                         gesCasesRurals                              │
│                                                                     │
│  [CLIENT] ──► P1: Gestió Usuaris ──► [D.USUARIS]                   │
│               │ (registre, login,     │                             │
│               │  perfil, sessió)      │                             │
│               │                       │                             │
│  [CLIENT] ──► P2: Gestió Cases ◄─── [D.CASES]                      │
│               │ (llistat, detall,     │                             │
│               │  imatges, cerca)      │                             │
│               │                       │                             │
│  [CLIENT] ──► P3: Gestió Reserves ──► [D.RESERVES]                 │
│               │ (nova, cancel·lar,    │                             │
│               │  consultar estat)     │                             │
│               │         │             │                             │
│               │         ▼             │                             │
│               │  P4: Consulta         │                             │
│               │  Disponibilitat ◄──── D.RESERVES                   │
│               │  (validació dates,    │                             │
│               │   conflictes)         │                             │
│               │                       │                             │
│  [ADMIN] ───► P5: Administració ──── [D.LOGS]                      │
│               │ (aprovar/rebutjar,    │                             │
│               │  gestionar tot,       │                             │
│               │  informes, logs)      │                             │
│                                       │                             │
└───────────────────────────────────────┼─────────────────────────────┘
                                        │
                              [BASE DE DADES MySQL]
```

## Detall de cada procés:

### P1 – Gestió d'Usuaris
| | Descripció |
|-|-----------|
| **Entrades** | Dades de registre (nom, email, password), credencials de login |
| **Procés** | Validació de dades, hash de contrasenya, creació de sessió, control de rols |
| **Sortides** | Usuari creat, sessió iniciada, missatges d'error/confirmació |
| **Magatzem** | Taula `usuarios` |

### P2 – Gestió de Cases
| | Descripció |
|-|-----------|
| **Entrades** | Peticions de consulta (usuari qualsevol), dades d'edició (administrador) |
| **Procés** | Recuperació de cases actives, mostra d'imatges, filtratge per capacitat/preu |
| **Sortides** | Llistat de cases, pàgina de detall, galeria d'imatges |
| **Magatzem** | Taules `casas`, `imagenes` |

### P3 – Gestió de Reserves
| | Descripció |
|-|-----------|
| **Entrades** | Sol·licitud de reserva (id_casa, dates, id_usuari), peticions de cancel·lació |
| **Procés** | Validació de dates, verificació de disponibilitat, creació/actualització de reserva |
| **Sortides** | Confirmació de reserva, missatge d'error si hi ha conflicte, notificació a admin |
| **Magatzem** | Taula `reservas` |

### P4 – Consulta de Disponibilitat
| | Descripció |
|-|-----------|
| **Entrades** | id_casa, data_entrada, data_sortida |
| **Procés** | Consulta de reserves actives (estat pending/accepted) amb dates solapades |
| **Sortides** | Booleà de disponibilitat, llistat de dates ocupades |
| **Magatzem** | Taula `reservas` |

### P5 – Administració
| | Descripció |
|-|-----------|
| **Entrades** | Accions de gestió (aprovació, rebuig, alta de casa, gestió d'usuaris) |
| **Procés** | Canvi d'estat de reserves, CRUD de cases, gestió de rols, generació de logs |
| **Sortides** | Panel actualitzat, informes, registre d'accions al log |
| **Magatzem** | Taules `reservas`, `casas`, `usuarios`, `logs_admin`, `notificaciones` |

---

# 7. MODEL DE DADES

## Entitats i Atributs Complets

### Entitat: `usuarios`
| Camp | Tipus | Restriccions | Descripció |
|------|-------|-------------|------------|
| `id_usuario` | INT | PK, AUTO_INCREMENT, NOT NULL | Identificador únic de l'usuari |
| `nombre` | VARCHAR(100) | NOT NULL | Nom de l'usuari |
| `apellidos` | VARCHAR(150) | NOT NULL | Cognoms de l'usuari |
| `email` | VARCHAR(200) | NOT NULL, UNIQUE | Correu electrònic (clau de login) |
| `password` | VARCHAR(255) | NOT NULL | Contrasenya encriptada (BCrypt) |
| `telefono` | VARCHAR(20) | NULL | Telèfon de contacte (opcional) |
| `rol` | ENUM('cliente','admin') | NOT NULL, DEFAULT 'cliente' | Rol de l'usuari al sistema |
| `estado` | ENUM('activo','inactivo','bloqueado') | NOT NULL, DEFAULT 'activo' | Estat del compte |
| `fecha_registro` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data i hora de registre |
| `ultimo_acceso` | DATETIME | NULL | Data i hora de l'últim accés |

### Entitat: `casas`
| Camp | Tipus | Restriccions | Descripció |
|------|-------|-------------|------------|
| `id_casa` | INT | PK, AUTO_INCREMENT, NOT NULL | Identificador únic de la casa |
| `nombre` | VARCHAR(150) | NOT NULL, UNIQUE | Nom de la casa rural |
| `descripcion` | TEXT | NOT NULL | Descripció detallada |
| `capacidad` | INT | NOT NULL, CHECK(> 0) | Nombre màxim de persones |
| `precio_noche` | DECIMAL(8,2) | NOT NULL, CHECK(> 0) | Preu per nit en euros |
| `num_habitaciones` | INT | NOT NULL, DEFAULT 1 | Nombre d'habitacions |
| `num_banos` | INT | NOT NULL, DEFAULT 1 | Nombre de banys |
| `metros_cuadrados` | INT | NULL | Superfície en m² |
| `servicios` | TEXT | NULL | Serveis disponibles (JSON o text lliure) |
| `estado` | ENUM('activa','inactiva','mantenimiento') | NOT NULL, DEFAULT 'activa' | Estat operatiu de la casa |
| `fecha_alta` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data d'alta al sistema |

### Entitat: `reservas`
| Camp | Tipus | Restriccions | Descripció |
|------|-------|-------------|------------|
| `id_reserva` | INT | PK, AUTO_INCREMENT, NOT NULL | Identificador únic de la reserva |
| `id_usuario` | INT | NOT NULL, FK → usuarios | Client que realitza la reserva |
| `id_casa` | INT | NOT NULL, FK → casas | Casa objecte de la reserva |
| `fecha_entrada` | DATE | NOT NULL | Data d'entrada |
| `fecha_salida` | DATE | NOT NULL | Data de sortida |
| `num_personas` | INT | NOT NULL, CHECK(> 0) | Nombre de persones |
| `precio_total` | DECIMAL(10,2) | NOT NULL | Import total calculat |
| `estado_reserva` | ENUM('pendiente','aceptada','rechazada','cancelada') | NOT NULL, DEFAULT 'pendiente' | Estat de la reserva |
| `observaciones` | TEXT | NULL | Notes del client |
| `fecha_solicitud` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data i hora de la sol·licitud |
| `fecha_gestion` | DATETIME | NULL | Data i hora de l'aprovació o rebuig |
| `id_admin_gestion` | INT | NULL, FK → usuarios | Administrador que va gestionar la reserva |

### Entitat: `imagenes`
| Camp | Tipus | Restriccions | Descripció |
|------|-------|-------------|------------|
| `id_imagen` | INT | PK, AUTO_INCREMENT, NOT NULL | Identificador únic de la imatge |
| `id_casa` | INT | NOT NULL, FK → casas | Casa a la qual pertany la imatge |
| `ruta` | VARCHAR(500) | NOT NULL | Ruta relativa al fitxer d'imatge |
| `descripcion_alt` | VARCHAR(255) | NULL | Text alternatiu per a accessibilitat |
| `es_principal` | TINYINT(1) | NOT NULL, DEFAULT 0 | Indica si és la imatge principal |
| `orden` | INT | NOT NULL, DEFAULT 0 | Ordre de mostra a la galeria |
| `fecha_subida` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de pujada del fitxer |

### Entitat: `notificaciones`
| Camp | Tipus | Restriccions | Descripció |
|------|-------|-------------|------------|
| `id_notificacion` | INT | PK, AUTO_INCREMENT, NOT NULL | Identificador únic de la notificació |
| `id_usuario` | INT | NOT NULL, FK → usuarios | Usuari destinatari |
| `mensaje` | TEXT | NOT NULL | Contingut del missatge |
| `tipo` | ENUM('reserva_aceptada','reserva_rechazada','nueva_reserva','sistema') | NOT NULL | Tipus de notificació |
| `leida` | TINYINT(1) | NOT NULL, DEFAULT 0 | Indica si l'usuari l'ha llegida |
| `fecha_creacion` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de creació |

### Entitat: `logs_admin`
| Camp | Tipus | Restriccions | Descripció |
|------|-------|-------------|------------|
| `id_log` | INT | PK, AUTO_INCREMENT, NOT NULL | Identificador únic del log |
| `id_admin` | INT | NOT NULL, FK → usuarios | Administrador que realitza l'acció |
| `accion` | VARCHAR(500) | NOT NULL | Descripció de l'acció realitzada |
| `tabla_afectada` | VARCHAR(100) | NULL | Taula de BD afectada per l'acció |
| `id_registro_afectado` | INT | NULL | ID del registre afectat |
| `ip_address` | VARCHAR(45) | NULL | Adreça IP de l'administrador |
| `fecha_accion` | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data i hora de l'acció |

---

# 8. MODEL ENTITAT-RELACIÓ

## Relacions

### Relació 1: `usuarios` → `reservas` (1:N)
- **Cardinalitat:** Un usuari pot tenir moltes reserves; una reserva pertany a un únic usuari.
- **FK:** `reservas.id_usuario` → `usuarios.id_usuario`
- **Acció referencial:** ON DELETE RESTRICT (no es pot eliminar un usuari amb reserves)

### Relació 2: `casas` → `reservas` (1:N)
- **Cardinalitat:** Una casa pot tenir moltes reserves; una reserva és per a una única casa.
- **FK:** `reservas.id_casa` → `casas.id_casa`
- **Acció referencial:** ON DELETE RESTRICT

### Relació 3: `casas` → `imagenes` (1:N)
- **Cardinalitat:** Una casa pot tenir moltes imatges; una imatge pertany a una única casa.
- **FK:** `imagenes.id_casa` → `casas.id_casa`
- **Acció referencial:** ON DELETE CASCADE (si s'elimina la casa, s'eliminen les seves imatges)

### Relació 4: `usuarios` → `notificaciones` (1:N)
- **Cardinalitat:** Un usuari pot rebre moltes notificacions; una notificació és per a un únic usuari.
- **FK:** `notificaciones.id_usuario` → `usuarios.id_usuario`
- **Acció referencial:** ON DELETE CASCADE

### Relació 5: `usuarios` → `logs_admin` (1:N)
- **Cardinalitat:** Un administrador pot generar molts registres de log; cada log pertany a un únic administrador.
- **FK:** `logs_admin.id_admin` → `usuarios.id_usuario`
- **Acció referencial:** ON DELETE RESTRICT

### Relació 6: `usuarios` → `reservas` (via id_admin_gestion) (1:N)
- **Cardinalitat:** Un administrador pot gestionar moltes reserves; cada reserva pot ser gestionada per un únic administrador.
- **FK:** `reservas.id_admin_gestion` → `usuarios.id_usuario`
- **Acció referencial:** ON DELETE SET NULL

## Esquema textual del Diagrama E-R

```
┌───────────────┐       ┌───────────────────┐       ┌───────────────┐
│   usuarios    │1     N│      reservas      │N     1│     casas     │
│───────────────│───────│───────────────────│───────│───────────────│
│ id_usuario PK │       │ id_reserva PK     │       │ id_casa PK    │
│ nombre        │       │ id_usuario FK ────┘       │ nombre        │
│ apellidos     │       │ id_casa FK ────────────────│ descripcion   │
│ email UNIQUE  │       │ fecha_entrada     │       │ capacidad     │
│ password      │       │ fecha_salida      │       │ precio_noche  │
│ rol           │       │ num_personas      │       │ estado        │
│ estado        │       │ precio_total      │       └───────┬───────┘
└───────┬───────┘       │ estado_reserva    │               │ 1
        │ 1             │ id_admin_gestion─┐│               │
        │               └───────────────────┘               │ N
        │ N                     ▲                   ┌───────▼───────┐
┌───────▼───────┐               │ 1:N               │   imagenes    │
│notificaciones │               │                   │───────────────│
│───────────────│       ┌───────┴───────┐           │ id_imagen PK  │
│ id_notif PK   │       │ logs_admin    │           │ id_casa FK    │
│ id_usuario FK │       │───────────────│           │ ruta          │
│ mensaje       │       │ id_log PK     │           │ es_principal  │
│ tipo          │       │ id_admin FK   │           │ orden         │
│ leida         │       │ accion        │           └───────────────┘
└───────────────┘       │ fecha_accion  │
                        └───────────────┘
```

---

# 9. MODEL SQL COMPLET

```sql
-- ============================================================
-- gesCasesRurals - Script de Creació de Base de Dades
-- Versió: 1.0.0 | Data: Juny 2026
-- Motor: MySQL 8.x | Codificació: UTF-8
-- ============================================================

-- Creació i selecció de la base de dades
CREATE DATABASE IF NOT EXISTS `gescasesrurals`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `gescasesrurals`;

-- ============================================================
-- TAULA: usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS `usuarios` (
    `id_usuario`      INT             NOT NULL AUTO_INCREMENT,
    `nombre`          VARCHAR(100)    NOT NULL,
    `apellidos`       VARCHAR(150)    NOT NULL,
    `email`           VARCHAR(200)    NOT NULL,
    `password`        VARCHAR(255)    NOT NULL COMMENT 'Hash BCrypt, cost 12',
    `telefono`        VARCHAR(20)     NULL,
    `rol`             ENUM('cliente','admin') NOT NULL DEFAULT 'cliente',
    `estado`          ENUM('activo','inactivo','bloqueado') NOT NULL DEFAULT 'activo',
    `fecha_registro`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `ultimo_acceso`   DATETIME        NULL,
    
    -- Clau primària
    PRIMARY KEY (`id_usuario`),
    
    -- Restriccions d'unicitat
    UNIQUE KEY `uq_usuarios_email` (`email`),
    
    -- Índexos per a millora de rendiment
    INDEX `idx_usuarios_rol`    (`rol`),
    INDEX `idx_usuarios_estado` (`estado`),
    INDEX `idx_usuarios_email`  (`email`)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Taula d''usuaris del sistema (clients i administradors)';


-- ============================================================
-- TAULA: casas
-- ============================================================
CREATE TABLE IF NOT EXISTS `casas` (
    `id_casa`           INT             NOT NULL AUTO_INCREMENT,
    `nombre`            VARCHAR(150)    NOT NULL,
    `descripcion`       TEXT            NOT NULL,
    `capacidad`         INT             NOT NULL,
    `precio_noche`      DECIMAL(8,2)    NOT NULL,
    `num_habitaciones`  INT             NOT NULL DEFAULT 1,
    `num_banos`         INT             NOT NULL DEFAULT 1,
    `metros_cuadrados`  INT             NULL,
    `servicios`         TEXT            NULL COMMENT 'Llista de serveis separats per comes',
    `estado`            ENUM('activa','inactiva','mantenimiento') NOT NULL DEFAULT 'activa',
    `fecha_alta`        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Restriccions CHECK
    CONSTRAINT `chk_casas_capacidad`     CHECK (`capacidad` > 0),
    CONSTRAINT `chk_casas_precio`        CHECK (`precio_noche` > 0),
    CONSTRAINT `chk_casas_habitaciones`  CHECK (`num_habitaciones` > 0),
    CONSTRAINT `chk_casas_banos`         CHECK (`num_banos` > 0),
    
    -- Clau primària
    PRIMARY KEY (`id_casa`),
    
    -- Restriccions d'unicitat
    UNIQUE KEY `uq_casas_nombre` (`nombre`),
    
    -- Índexos
    INDEX `idx_casas_estado`    (`estado`),
    INDEX `idx_casas_capacidad` (`capacidad`),
    INDEX `idx_casas_precio`    (`precio_noche`)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Taula de les cases rurals disponibles';


-- ============================================================
-- TAULA: reservas
-- ============================================================
CREATE TABLE IF NOT EXISTS `reservas` (
    `id_reserva`            INT             NOT NULL AUTO_INCREMENT,
    `id_usuario`            INT             NOT NULL,
    `id_casa`               INT             NOT NULL,
    `fecha_entrada`         DATE            NOT NULL,
    `fecha_salida`          DATE            NOT NULL,
    `num_personas`          INT             NOT NULL,
    `precio_total`          DECIMAL(10,2)   NOT NULL,
    `estado_reserva`        ENUM('pendiente','aceptada','rechazada','cancelada') NOT NULL DEFAULT 'pendiente',
    `observaciones`         TEXT            NULL,
    `fecha_solicitud`       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `fecha_gestion`         DATETIME        NULL,
    `id_admin_gestion`      INT             NULL,
    
    -- Restriccions CHECK
    CONSTRAINT `chk_reservas_fechas`       CHECK (`fecha_salida` > `fecha_entrada`),
    CONSTRAINT `chk_reservas_personas`     CHECK (`num_personas` > 0),
    CONSTRAINT `chk_reservas_precio`       CHECK (`precio_total` >= 0),
    
    -- Clau primària
    PRIMARY KEY (`id_reserva`),
    
    -- Claus forànies
    CONSTRAINT `fk_reservas_usuario`
        FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
        
    CONSTRAINT `fk_reservas_casa`
        FOREIGN KEY (`id_casa`) REFERENCES `casas` (`id_casa`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
        
    CONSTRAINT `fk_reservas_admin`
        FOREIGN KEY (`id_admin_gestion`) REFERENCES `usuarios` (`id_usuario`)
        ON UPDATE CASCADE ON DELETE SET NULL,
    
    -- Índexos
    INDEX `idx_reservas_usuario`       (`id_usuario`),
    INDEX `idx_reservas_casa`          (`id_casa`),
    INDEX `idx_reservas_estado`        (`estado_reserva`),
    INDEX `idx_reservas_fechas`        (`fecha_entrada`, `fecha_salida`),
    INDEX `idx_reservas_casa_fechas`   (`id_casa`, `fecha_entrada`, `fecha_salida`, `estado_reserva`)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Taula de reserves de cases rurals';


-- ============================================================
-- TAULA: imagenes
-- ============================================================
CREATE TABLE IF NOT EXISTS `imagenes` (
    `id_imagen`         INT             NOT NULL AUTO_INCREMENT,
    `id_casa`           INT             NOT NULL,
    `ruta`              VARCHAR(500)    NOT NULL,
    `descripcion_alt`   VARCHAR(255)    NULL,
    `es_principal`      TINYINT(1)      NOT NULL DEFAULT 0,
    `orden`             INT             NOT NULL DEFAULT 0,
    `fecha_subida`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Clau primària
    PRIMARY KEY (`id_imagen`),
    
    -- Clau forània
    CONSTRAINT `fk_imagenes_casa`
        FOREIGN KEY (`id_casa`) REFERENCES `casas` (`id_casa`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    
    -- Índexos
    INDEX `idx_imagenes_casa`      (`id_casa`),
    INDEX `idx_imagenes_principal` (`id_casa`, `es_principal`)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Taula d''imatges de les cases rurals';


-- ============================================================
-- TAULA: notificaciones
-- ============================================================
CREATE TABLE IF NOT EXISTS `notificaciones` (
    `id_notificacion`   INT             NOT NULL AUTO_INCREMENT,
    `id_usuario`        INT             NOT NULL,
    `mensaje`           TEXT            NOT NULL,
    `tipo`              ENUM('reserva_aceptada','reserva_rechazada','nueva_reserva','sistema') NOT NULL,
    `leida`             TINYINT(1)      NOT NULL DEFAULT 0,
    `fecha_creacion`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Clau primària
    PRIMARY KEY (`id_notificacion`),
    
    -- Clau forània
    CONSTRAINT `fk_notificaciones_usuario`
        FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
        ON UPDATE CASCADE ON DELETE CASCADE,
    
    -- Índexos
    INDEX `idx_notif_usuario`      (`id_usuario`),
    INDEX `idx_notif_leida`        (`id_usuario`, `leida`),
    INDEX `idx_notif_fecha`        (`fecha_creacion`)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Taula de notificacions internes del sistema';


-- ============================================================
-- TAULA: logs_admin
-- ============================================================
CREATE TABLE IF NOT EXISTS `logs_admin` (
    `id_log`                  INT             NOT NULL AUTO_INCREMENT,
    `id_admin`                INT             NOT NULL,
    `accion`                  VARCHAR(500)    NOT NULL,
    `tabla_afectada`          VARCHAR(100)    NULL,
    `id_registro_afectado`    INT             NULL,
    `ip_address`              VARCHAR(45)     NULL COMMENT 'Suporta IPv6',
    `fecha_accion`            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Clau primària
    PRIMARY KEY (`id_log`),
    
    -- Clau forània
    CONSTRAINT `fk_logs_admin`
        FOREIGN KEY (`id_admin`) REFERENCES `usuarios` (`id_usuario`)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    
    -- Índexos
    INDEX `idx_logs_admin`   (`id_admin`),
    INDEX `idx_logs_fecha`   (`fecha_accion`),
    INDEX `idx_logs_tabla`   (`tabla_afectada`)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Taula de registre d''accions administratives';
```

---

# 10. REGLES DE NEGOCI

## 10.1 Regles de Reserva

### RN-01: Estats d'una Reserva

```
           ┌────────────┐
           │  PENDENT   │ (estat inicial en crear la reserva)
           └─────┬──────┘
                 │
         ┌───────┴────────┐
         │                │
    [Admin aprova]   [Admin rebutja] / [Client cancel·la]
         │                │
    ┌────▼────┐      ┌────▼──────┐
    │ACCEPTADA│      │REBUTJADA  │
    └─────────┘      └───────────┘
         │
    [Client cancel·la]
         │
    ┌────▼──────┐
    │CANCEL·LADA│
    └───────────┘
```

| Transició | Qui pot fer-la | Condicions |
|-----------|---------------|-----------|
| Pendent → Acceptada | Administrador | Verificació prèvia de disponibilitat |
| Pendent → Rebutjada | Administrador | Sense condicions addicionals |
| Pendent → Cancel·lada | Client | Només per reserves pròpies en estat pendent |
| Acceptada → Cancel·lada | Client / Admin | Possiblement amb restriccions de temps |

### RN-02: Prevenció de Duplicitats

Una reserva és **invàlida** si existeix a la BD una altra reserva que compleixi **totes** les condicions:
1. `id_casa` = mateixa casa
2. `estado_reserva` IN ('pendiente', 'aceptada')
3. Les dates se solapen: `fecha_entrada_nova < fecha_salida_existent AND fecha_salida_nova > fecha_entrada_existent`

**Consulta de verificació de disponibilitat:**
```sql
SELECT COUNT(*) AS conflictes
FROM reservas
WHERE id_casa = :id_casa
  AND estado_reserva IN ('pendiente', 'aceptada')
  AND fecha_entrada < :fecha_salida_nova
  AND fecha_salida > :fecha_entrada_nova;
```
Si `conflictes > 0` → Reserva **NO PERMESA**.

### RN-03: Validació de Dates

- `fecha_entrada` ha de ser igual o posterior a la data actual.
- `fecha_salida` ha de ser estrictament posterior a `fecha_entrada`.
- La durada mínima de la reserva és d'1 nit.
- La durada màxima és de 30 nits (configurable).

### RN-04: Càlcul del Preu Total

```
precio_total = precio_noche (de la casa) × nombre_de_nits
nombre_de_nits = fecha_salida - fecha_entrada (en dies)
```

### RN-05: Nombre de Persones

El `num_personas` de la reserva no pot superar la `capacidad` de la casa seleccionada.

## 10.2 Regles d'Usuaris

- Un usuari en estat `bloqueado` no pot iniciar sessió.
- Un usuari en estat `inactivo` no pot realitzar reserves.
- Un usuari no pot modificar dades d'altres usuaris.
- L'email és únic al sistema; no es poden registrar dos usuaris amb el mateix email.

## 10.3 Regles de Cases

- Una casa en estat `inactiva` o `mantenimiento` no pot rebre noves reserves.
- No es pot eliminar una casa que tingui reserves actives (pendents o acceptades).

---

# 11. ARQUITECTURA DEL PROJECTE

## Tipus d'Arquitectura

**gesCasesRurals** segueix una **arquitectura Client/Servidor de 3 capes** implementada com una **Aplicació Web Tradicional (MPA – Multi-Page Application)** amb el patró de disseny **MVC (Model-Vista-Controlador)**.

```
┌────────────────────────────────────────────────────────┐
│                    CAPA PRESENTACIÓ                     │
│              (Navegador web del client)                  │
│         HTML5 + CSS3 + JavaScript Vanilla               │
└────────────────────────┬───────────────────────────────┘
                         │ HTTP/HTTPS (peticions)
                         │
┌────────────────────────▼───────────────────────────────┐
│                    CAPA LÒGICA DE NEGOCI                │
│              (Servidor Web Apache + PHP 8.x)            │
│         Controladors PHP + Models + Validadors          │
└────────────────────────┬───────────────────────────────┘
                         │ PDO (SQL)
                         │
┌────────────────────────▼───────────────────────────────┐
│                    CAPA DE DADES                        │
│                  (Servidor MySQL 8.x)                   │
│         Base de dades gescasesrurals                    │
└────────────────────────────────────────────────────────┘
```

## Components de l'Arquitectura

### Capa de Presentació (Client)
- **Navegador web** (Chrome, Firefox, Safari, Edge)
- Renderitza HTML/CSS rebut del servidor
- Executa JavaScript Vanilla per a validacions client-side i interactivitat
- Comunica amb el servidor via HTTP (peticions GET/POST)

### Capa de Lògica de Negoci (Servidor Web)
- **Apache HTTP Server** actua com a servidor web
- **PHP 8.x** processa les peticions, aplica la lògica de negoci i genera HTML dinàmic
- Implementa el patró MVC: Controladors gestionen la petició, Models accedeixen a dades, Vistes renderitzen la resposta

### Capa de Dades (Base de Dades)
- **MySQL 8.x** com a SGBD relacional
- **PDO** com a capa d'abstracció d'accés a dades (PreparedStatements)
- Les dades persistents es guarden en la base de dades `gescasesrurals`

## Avantatges i Desavantatges

| | Avantatges | Desavantatges |
|-|-----------|---------------|
| **Arquitectura 3 capes** | Separació de responsabilitats, mantenibilitat | Latència afegida entre capes |
| **PHP + MySQL** | Ampli suport, hosting econòmic, comunitat gran | No ideal per a temps real |
| **MVC** | Codi organitzat, reutilitzable, testable | Corba d'aprenentatge inicial |
| **Apache** | Estable, configurable, suport .htaccess | Menor rendiment que Nginx en alta càrrega |
| **PDO** | Agnòstic a BD, prepared statements | Lleugerament més verbós que alternatives |

## Escalabilitat

- **Escalat vertical**: Augmentar recursos del servidor (RAM, CPU) és la opció més senzilla.
- **Escalat horitzontal**: Requereix configuració addicional (load balancer, sessió compartida).
- **Per a la versió actual**: L'arquitectura és suficient per a fins a ~500 usuaris concurrents amb hardware adequat.

## Seguretat de l'Arquitectura

- Separació clara entre zona pública i zona privada (admin).
- Els fitxers de configuració (`config.php`) fora de l'arrel web o amb accés restringit.
- Ús de `.htaccess` per a bloquejar accés directe a directoris sensibles.
- Variables de sessió controlades al servidor, no al client.

---

# 12. ESTRUCTURA DEL FRONTEND

## 12.1 Pàgines Públiques (Accessibles sense login)

### `index.php` — Inici
Pàgina principal de l'aplicació. Mostra un banner de benvinguda, un resum de les 6 cases (targetes amb imatge, nom i preu), i accés directe a registre i login. Inclou una secció "Per què triar-nos" i un peu de pàgina amb informació de contacte.

### `casas.php` — Llistat de Cases
Mostra totes les cases actives amb filtratge per capacitat i rang de preus. Cada casa es presenta en una targeta amb imatge principal, nom, capacitat, preu per nit i botó "Veure detall". Pàgina responsiva i optimitzada per a mòbil.

### `detall_casa.php?id=X` — Detall d'una Casa
Pàgina de detall completa per a una casa concreta. Inclou galeria d'imatges, descripció completa, taula de característiques (habitacions, banys, m², capacitat, serveis), selector de dates per a verificar disponibilitat i formulari de reserva (redirigeix a login si no autenticat).

### `login.php` — Inici de Sessió
Formulari d'autenticació amb camps email i contrasenya. Inclou missatges d'error descriptius, botó "Recordar-me" i enllaç a la pàgina de registre. Valida al servidor amb PDO prepared statements.

### `registre.php` — Registre d'Usuari
Formulari de registre de nou usuari client. Camps: nom, cognoms, email, telèfon (opcional), contrasenya i confirmació de contrasenya. Validació en temps real amb JavaScript i validació server-side amb PHP.

### `contacte.php` — Contacte
Pàgina de contacte amb informació del complex (adreça, telèfon, email, mapa), formulari de contacte i horari d'atenció.

## 12.2 Pàgines Privades (Requereixen login com a client)

### `perfil.php` — Perfil de l'Usuari
Permet a l'usuari autenticat veure i editar les seves dades personals (nom, cognoms, telèfon). Permet canviar la contrasenya (amb verificació de l'actual). Mostra resum d'activitat (nombre de reserves).

### `mes_reserves.php` — Les Meves Reserves
Llista de totes les reserves de l'usuari autenticat, ordenades per data de sol·licitud (les més recents primer). Cada reserva mostra: nom de la casa, dates, import, estat (amb badge de color) i opció de cancel·lar si és pendent.

## 12.3 Pàgines d'Administració (Requereixen login com a admin)

### `admin/dashboard.php` — Panell d'Administració
Pàgina d'inici del panell admin. Mostra targetes de resum: total de reserves (per estat), cases actives, usuaris registrats i reserves del mes actual. Taula de les últimes 10 reserves pendents d'aprovació. Gràfic simple de reserves per mes.

### `admin/gestio_cases.php` — Gestió de Cases
CRUD complet de les 6 cases rurals. Llistat de cases amb opcions d'editar, desactivar/activar i veure imatges. Formulari d'alta/edició de casa amb tots els camps. Gestió de la galeria d'imatges (pujar, ordenar, marcar com a principal, eliminar).

### `admin/gestio_reserves.php` — Gestió de Reserves
Llistat complet de reserves amb filtres per estat, casa i rang de dates. Accions: aprovar o rebutjar reserves pendents. Historial complet de totes les reserves. Exportació de llistat (opcional).

### `admin/gestio_usuaris.php` — Gestió d'Usuaris
Llistat de tots els usuaris registrats. Opcions per activar/desactivar/bloquejar comptes. Canvi de rol (client ↔ admin). Visualització de l'historial de reserves d'un usuari concret.

---

# 13. ESTRUCTURA DEL BACKEND (Sistema de Fitxers)

```
/gesCasesRurals/
│
├── index.php                    # Punt d'entrada principal
├── .htaccess                    # Configuració Apache, redireccionaments, proteccions
├── README.md                    # Documentació bàsica del projecte
│
├── /config/                     # Configuració del sistema
│   ├── config.php               # Constants: BD host, user, pass, dbname, timezone
│   ├── database.php             # Classe Database: connexió PDO singleton
│   └── session.php              # Configuració i gestió de sessions PHP
│
├── /includes/                   # Fragments reutilitzables de vista
│   ├── header.php               # Capçalera HTML, menú de navegació
│   ├── footer.php               # Peu de pàgina
│   ├── navbar.php               # Barra de navegació responsiva
│   └── alerts.php               # Missatges d'alerta (success, error, warning)
│
├── /models/                     # Capa de Model (accés a dades via PDO)
│   ├── UsuarioModel.php         # CRUD usuaris, autenticació, gestió de rols
│   ├── CasaModel.php            # CRUD cases rurals
│   ├── ReservaModel.php         # CRUD reserves, verificació disponibilitat
│   ├── ImagenModel.php          # Gestió d'imatges de cases
│   ├── NotificacionModel.php    # Creació i lectura de notificacions
│   └── LogAdminModel.php        # Registre d'accions al log
│
├── /controllers/                # Capa de Controlador (lògica de negoci)
│   ├── AuthController.php       # Login, logout, registre, control de sessió
│   ├── CasaController.php       # Gestió de cases (accions públiques i admin)
│   ├── ReservaController.php    # Flux de reserves (crear, aprovar, rebutjar, cancel·lar)
│   ├── UsuarioController.php    # Gestió del perfil i panell admin d'usuaris
│   └── AdminController.php      # Lògica exclusiva del panell d'administració
│
├── /views/                      # Capa de Vista (HTML generat per PHP)
│   ├── /public/                 # Vistes públiques
│   │   ├── home.view.php
│   │   ├── casas.view.php
│   │   ├── detall_casa.view.php
│   │   ├── login.view.php
│   │   ├── registre.view.php
│   │   └── contacte.view.php
│   ├── /client/                 # Vistes privades del client
│   │   ├── perfil.view.php
│   │   └── mes_reserves.view.php
│   └── /admin/                  # Vistes del panell d'administració
│       ├── dashboard.view.php
│       ├── gestio_cases.view.php
│       ├── gestio_reserves.view.php
│       └── gestio_usuaris.view.php
│
├── /assets/                     # Recursos estàtics
│   ├── /css/
│   │   ├── style.css            # Estils globals del lloc
│   │   ├── admin.css            # Estils exclusius del panell admin
│   │   └── responsive.css       # Media queries per a responsivitat
│   ├── /js/
│   │   ├── main.js              # JavaScript global
│   │   ├── validations.js       # Validacions de formularis client-side
│   │   ├── disponibilitat.js    # Lògica de consulta de disponibilitat (AJAX)
│   │   └── admin.js             # JavaScript exclusiu del panell admin
│   └── /img/
│       ├── logo.png             # Logotip de l'aplicació
│       └── /defaults/           # Imatges per defecte
│           └── casa_default.jpg
│
├── /uploads/                    # Imatges pujades pels administradors
│   └── /cases/                  # Subcarpeta per a imatges de cases
│       └── /1/                  # Subcarpeta per casa (id_casa)
│           ├── principal.jpg
│           └── galeria_01.jpg
│
├── /admin/                      # Punt d'entrada del panell d'administració
│   ├── index.php                # Redirigeix a dashboard o login
│   ├── dashboard.php
│   ├── gestio_cases.php
│   ├── gestio_reserves.php
│   └── gestio_usuaris.php
│
├── /consultes/                  # Scripts de consulta (AJAX i API interna)
│   ├── check_disponibilitat.php # Retorna JSON: disponible/no disponible
│   ├── get_reserves_casa.php    # Retorna reserves d'una casa (per al calendari)
│   └── get_notificacions.php    # Retorna notificacions no llegides de l'usuari
│
└── /manteniment/                # Scripts d'utilitat i manteniment
    ├── seed_database.php        # Inserta dades d'exemple (mode dev)
    ├── clear_logs.php           # Neteja logs antics
    └── backup_config.php        # Utilitat de backup
```

## Responsabilitats de cada Mòdul

| Mòdul | Responsabilitat |
|-------|----------------|
| `/config` | Centralitzar la configuració del sistema. Cap fitxer PHP ha d'hardcodejar credencials. |
| `/includes` | Fragments HTML reutilitzables (capçalera, peu, alertes). Evita duplicació de codi. |
| `/models` | Únic punt d'accés a la BD. Totes les consultes SQL estan aquí, amb PDO. |
| `/controllers` | Processen les peticions HTTP, apliquen validacions i crides als models. |
| `/views` | Presenten les dades sense lògica de negoci. Reben variables dels controladors. |
| `/assets` | Recursos estàtics servits directament pel servidor web. |
| `/uploads` | Imatges pujades per l'admin. Accés restringit per permissos de fitxer. |
| `/admin` | Punt d'entrada del backoffice. Totes les rutes validen el rol 'admin' al controlador. |
| `/consultes` | Endpoints AJAX interns per a consultes dinàmiques sense recarregar la pàgina. |
| `/manteniment` | Scripts d'ús intern del desenvolupador. Accés bloquejat en producció. |

---

# 14. CASOS D'ÚS

## CU-01: Registrar Usuari

| | |
|-|-|
| **Nom** | Registrar Usuari |
| **Actor** | Visitant anònim |
| **Descripció** | Un visitant anònim crea un nou compte d'usuari client al sistema |
| **Precondicions** | L'usuari no té compte previ. Accés a la pàgina de registre. |

**Flux Principal:**
1. L'usuari accedeix a `/registre.php`.
2. Omple el formulari: nom, cognoms, email, telèfon (opcional), contrasenya, confirmació de contrasenya.
3. Fa clic a "Crear compte".
4. El sistema valida els camps (client-side amb JS).
5. El sistema envia les dades al servidor (POST).
6. El servidor valida: camps obligatoris, format email, contrasenyes coincidents, email no existent a la BD.
7. El servidor crea l'hash BCrypt de la contrasenya.
8. El servidor insereix el nou usuari a la taula `usuarios` amb rol 'cliente' i estat 'activo'.
9. El sistema inicia la sessió automàticament i redirigeix a `index.php`.
10. Es mostra un missatge de benvinguda.

**Flux Alternatiu – A1: Email ja registrat:**
- Al pas 6, el sistema detecta que l'email ja existeix.
- Es mostra un missatge d'error: "Aquest email ja és registrat. Inicia sessió."
- Es torna al formulari mantenint els camps emplenats (excepte contrasenyes).

**Flux Alternatiu – A2: Contrasenyes no coincidents:**
- Al pas 4 (JS) o 6 (servidor), es detecta la discrepància.
- Es mostra un missatge d'error al camp de confirmació.

**Flux Alternatiu – A3: Error de servidor:**
- Al pas 8, si hi ha un error de BD, es mostra un missatge genèric i es registra l'error al log.

**Resultat:** Nou usuari creat, sessió iniciada, redirecció a la pàgina d'inici.

---

## CU-02: Iniciar Sessió

| | |
|-|-|
| **Nom** | Iniciar Sessió |
| **Actor** | Usuari registrat (client o admin) |
| **Precondicions** | Compte existent amb estat 'activo'. |

**Flux Principal:**
1. L'usuari accedeix a `/login.php`.
2. Introdueix email i contrasenya.
3. Fa clic a "Iniciar sessió".
4. El servidor verifica que l'email existeix a la BD.
5. El servidor verifica que la contrasenya coincideix amb el hash (`password_verify()`).
6. El servidor comprova que l'estat del compte és 'activo'.
7. S'inicialitzen les variables de sessió: `$_SESSION['id_usuario']`, `$_SESSION['rol']`, `$_SESSION['nombre']`.
8. S'actualitza el camp `ultimo_acceso` de l'usuari.
9. Redirecció: admin → `admin/dashboard.php` | client → `index.php`.

**Flux Alternatiu – A1: Credencials incorrectes:**
- Als passos 4 o 5, les credencials no coincideixen.
- Es mostra missatge genèric: "Email o contrasenya incorrectes." (no es revela si l'email existeix).

**Flux Alternatiu – A2: Compte bloquejat:**
- Al pas 6, l'estat és 'bloqueado'.
- Es mostra: "El seu compte ha estat bloquejat. Contacti l'administrador."

**Resultat:** Sessió iniciada, redirecció al panell corresponent al rol de l'usuari.

---

## CU-03: Reservar Casa

| | |
|-|-|
| **Nom** | Reservar Casa |
| **Actor** | Client autenticat |
| **Precondicions** | Sessió iniciada com a client. Casa en estat 'activa'. |

**Flux Principal:**
1. El client navega a la pàgina de detall d'una casa (`/detall_casa.php?id=X`).
2. Selecciona la data d'entrada i la data de sortida al formulari de reserva.
3. Indica el nombre de persones.
4. Fa clic a "Comprovar disponibilitat".
5. El sistema realitza una petició AJAX a `consultes/check_disponibilitat.php`.
6. El servidor consulta la BD: no hi ha reserves actives (pendents/acceptades) amb dates solapades per a aquesta casa.
7. El sistema mostra el preu total calculat i activa el botó "Confirmar reserva".
8. El client fa clic a "Confirmar reserva".
9. El servidor valida: usuari autenticat, dates vàlides, disponibilitat (doble comprovació), persones ≤ capacitat.
10. S'insereix la reserva a la BD amb estat 'pendiente'.
11. Es genera una notificació per a l'administrador ('nueva_reserva').
12. Es genera una notificació per al client ('reserva_pendiente').
13. Es redirigeix el client a `mes_reserves.php` amb un missatge de confirmació.

**Flux Alternatiu – A1: Casa no disponible:**
- Al pas 6, es detecten reserves conflictives.
- El sistema mostra un missatge: "La casa no està disponible per a les dates seleccionades."
- Es suggereix un calendari amb dates disponibles.

**Flux Alternatiu – A2: Nombre de persones supera capacitat:**
- Al pas 9, `num_personas > capacitat`.
- Error: "El nombre de persones supera la capacitat de la casa (màxim X persones)."

**Resultat:** Reserva creada en estat 'pendiente', notificació generada, confirmació al client.

---

## CU-04: Consultar Disponibilitat

| | |
|-|-|
| **Nom** | Consultar Disponibilitat |
| **Actor** | Qualsevol usuari (anònim o autenticat) |
| **Precondicions** | Cap. Accessible per a tothom. |

**Flux Principal:**
1. L'usuari visita la pàgina de detall d'una casa.
2. Selecciona un rang de dates al selector (date picker).
3. El sistema realitza una petició AJAX automàtica (o en fer clic).
4. El servidor executa: `SELECT COUNT(*) FROM reservas WHERE id_casa=? AND estado_reserva IN ('pendiente','aceptada') AND fecha_entrada < ? AND fecha_salida > ?`.
5. Si `COUNT = 0`, retorna `{"disponible": true, "precio_total": XXX.XX}`.
6. Si `COUNT > 0`, retorna `{"disponible": false, "mensaje": "Dates no disponibles"}`.
7. La interfície actualitza dinàmicament el resultat.

**Resultat:** L'usuari coneix la disponibilitat i el preu sense necessitat de recarregar la pàgina.

---

## CU-05: Aprovar Reserva

| | |
|-|-|
| **Nom** | Aprovar Reserva |
| **Actor** | Administrador |
| **Precondicions** | Sessió iniciada com a admin. Existeix una reserva en estat 'pendiente'. |

**Flux Principal:**
1. L'administrador accedeix a `admin/gestio_reserves.php`.
2. Visualitza les reserves en estat 'pendiente' (taulell prioritari).
3. Fa clic a "Aprovar" en una reserva concreta.
4. El sistema realitza una doble comprovació de disponibilitat (per si hi ha canvis des de la sol·licitud).
5. El sistema actualitza l'estat de la reserva a 'aceptada'.
6. S'actualitza `fecha_gestion` i `id_admin_gestion`.
7. Es genera una notificació al client: "La seva reserva ha estat acceptada."
8. Es registra l'acció al log (`logs_admin`).
9. La pàgina es refresca i la reserva desapareix de la cua de pendents.

**Flux Alternatiu – A1: Conflicte de disponibilitat:**
- Al pas 4, es detecta que la casa ja té una reserva acceptada per a les mateixes dates.
- L'administrador veu un avís: "Atenció: S'ha detectat un conflicte de dates. Revisi les reserves."
- No es permet l'aprovació sense resolució manual del conflicte.

**Resultat:** Reserva aprovada, client notificat, log registrat.

---

## CU-06: Rebutjar Reserva

| | |
|-|-|
| **Nom** | Rebutjar Reserva |
| **Actor** | Administrador |
| **Precondicions** | Sessió iniciada com a admin. Reserva en estat 'pendiente'. |

**Flux Principal:**
1. L'administrador accedeix a `admin/gestio_reserves.php`.
2. Fa clic a "Rebutjar" en una reserva.
3. El sistema demana confirmació (modal/diàleg).
4. L'administrador confirma l'acció.
5. El sistema actualitza l'estat a 'rechazada'.
6. Es genera una notificació al client: "La seva reserva ha estat rebutjada."
7. Es registra l'acció al log.

**Resultat:** Reserva rebutjada, client notificat, log registrat. La casa queda disponible per a noves reserves.

---

## CU-07: Gestionar Cases

| | |
|-|-|
| **Nom** | Gestionar Cases Rurals |
| **Actor** | Administrador |
| **Precondicions** | Sessió iniciada com a admin. |

**Flux Principal (Alta de nova casa):**
1. L'administrador accedeix a `admin/gestio_cases.php`.
2. Fa clic a "Nova casa".
3. Omple el formulari: nom, descripció, capacitat, preu/nit, habitacions, banys, m², serveis.
4. Puja les imatges de la casa (mínim 1).
5. Marca una imatge com a principal.
6. Fa clic a "Desar".
7. El servidor valida tots els camps i les imatges.
8. S'insereix la casa a la BD amb estat 'activa'.
9. S'insereixen les imatges a la taula `imagenes`.
10. Es registra l'acció al log.

**Flux Alternatiu (Editar casa):**
- L'administrador selecciona una casa i fa clic a "Editar".
- Modifica els camps desitjats i desa.
- Es registra l'acció al log.

**Flux Alternatiu (Desactivar casa):**
- L'administrador fa clic a "Desactivar".
- Si la casa té reserves actives (pendents o acceptades), el sistema mostra un avís.
- Si es confirma, l'estat canvia a 'inactiva' i la casa no accepta noves reserves.

**Resultat:** Casa creada/editada/desactivada, canvis persistits a la BD, log registrat.

---

# 15. DISSENY DE PANTALLES (WIREFRAMES TEXTUALS)

## WF-01: Pàgina d'Inici (`index.php`)

```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR: [Logo gesCasesRurals]  [Casas][Contacte][Login][Registre] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           HERO BANNER (imatge de fons)              │   │
│  │                                                     │   │
│  │      🏡 Descobreix les nostres Cases Rurals         │   │
│  │   Natura, tranquil·litat i confort a prop teu       │   │
│  │                                                     │   │
│  │         [ VER CASAS ]    [ RESERVAR ]               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ── Les nostres Cases ──────────────────────────────────── │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ [img]    │  │ [img]    │  │ [img]    │                 │
│  │ Casa 1   │  │ Casa 2   │  │ Casa 3   │                 │
│  │ 6 pers.  │  │ 4 pers.  │  │ 10 pers. │                 │
│  │ 85€/nit  │  │ 65€/nit  │  │ 120€/nit │                 │
│  │[VEURE +] │  │[VEURE +] │  │[VEURE +] │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ [img]    │  │ [img]    │  │ [img]    │                 │
│  │ Casa 4   │  │ Casa 5   │  │ Casa 6   │                 │
│  │ 8 pers.  │  │ 12 pers. │  │ 6 pers.  │                 │
│  │ 95€/nit  │  │ 150€/nit │  │ 80€/nit  │                 │
│  │[VEURE +] │  │[VEURE +] │  │[VEURE +] │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                             │
│  ── Per Què Triar-nos ───────────────────────────────────  │
│  [🏡 6 Cases Exclusives]  [✅ Reserva Fàcil]  [🔒 Segur]  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ FOOTER: Contacte | Avís Legal | © 2026 gesCasesRurals       │
└─────────────────────────────────────────────────────────────┘
```

## WF-02: Pàgina de Login (`login.php`)

```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR: [Logo]            [Casas][Contacte][Login][Registre]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ┌─────────────────────────────┐               │
│              │  🔐 Accés al Sistema        │               │
│              │                             │               │
│              │  Email:                     │               │
│              │  [________________________] │               │
│              │                             │               │
│              │  Contrasenya:               │               │
│              │  [________________________] │               │
│              │                             │               │
│              │  [☐] Recorda'm              │               │
│              │                             │               │
│              │  [   INICIAR SESSIÓ   ]     │               │
│              │                             │               │
│              │  ─────────────────────────  │               │
│              │  Nou usuari?                │               │
│              │  → Crea un compte           │               │
│              └─────────────────────────────┘               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                      │
└─────────────────────────────────────────────────────────────┘
```

## WF-03: Pàgina de Registre (`registre.php`)

```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│           ┌───────────────────────────────────┐            │
│           │  📋 Crear Nou Compte               │            │
│           │                                   │            │
│           │  Nom:         [________________]  │            │
│           │  Cognoms:     [________________]  │            │
│           │  Email:       [________________]  │            │
│           │  Telèfon:     [________________]  │            │
│           │                  (opcional)       │            │
│           │  Contrasenya: [________________]  │            │
│           │  Confirmar:   [________________]  │            │
│           │                                   │            │
│           │  Força de contrasenya: [████░░░]  │            │
│           │                                   │            │
│           │  [☐] Accepto els termes i cond.   │            │
│           │                                   │            │
│           │     [ CREAR COMPTE ]              │            │
│           │                                   │            │
│           │  Ja tens compte? → Iniciar sessió │            │
│           └───────────────────────────────────┘            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                      │
└─────────────────────────────────────────────────────────────┘
```

## WF-04: Detall de Casa + Formulari de Reserva

```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ← Tornar al llistat                                        │
│                                                             │
│  ┌──────────────────────────┐  ┌──────────────────────┐    │
│  │                          │  │  🏡 Can Puigdomènech │    │
│  │  [GALERIA D'IMATGES]     │  │  ─────────────────── │    │
│  │  [img principal gran]    │  │  👥 Capacitat: 8     │    │
│  │  [img1][img2][img3][img4]│  │  🛏 Habitacions: 4   │    │
│  │                          │  │  🚿 Banys: 2         │    │
│  └──────────────────────────┘  │  📐 120 m²           │    │
│                                │  💰 95€ / nit        │    │
│  Descripció:                   │                      │    │
│  [Text descriptiu llarg...]    │  ── RESERVAR ──────  │    │
│                                │  Entrada: [📅 data]  │    │
│  Serveis:                      │  Sortida: [📅 data]  │    │
│  ✓ WiFi  ✓ BBQ  ✓ Piscina     │  Persones:[  1  ▼ ]  │    │
│  ✓ Aparcament  ✓ TV Satèl·lit  │                      │    │
│                                │  [COMPROVAR DISPON.] │    │
│                                │                      │    │
│                                │  ✅ Disponible!      │    │
│                                │  Total: 285€ (3 nits)│    │
│                                │                      │    │
│                                │  [CONFIRMAR RESERVA] │    │
│                                └──────────────────────┘    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                      │
└─────────────────────────────────────────────────────────────┘
```

## WF-05: Dashboard d'Administrador

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo Admin] gesCasesRurals – Panell d'Administració       │
│  ─────────────────────────────────── [Tancar Sessió]        │
├──────────────┬──────────────────────────────────────────────┤
│ SIDEBAR      │  CONTINGUT PRINCIPAL                         │
│ ──────────── │                                              │
│ 📊 Dashboard │  📊 Resum del Sistema                        │
│              │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│ 🏡 Cases     │  │Pendents  │ │Acceptades│ │Usuaris   │    │
│              │  │    7     │ │   23     │ │   145    │    │
│ 📅 Reserves  │  └──────────┘ └──────────┘ └──────────┘    │
│              │                                              │
│ 👥 Usuaris   │  ── Reserves Pendents ─────────────────────  │
│              │  ┌───┬───────────┬──────────┬───────┬─────┐ │
│ 🔔 Notif.    │  │ # │ Client    │ Casa     │ Dates │Acc. │ │
│              │  ├───┼───────────┼──────────┼───────┼─────┤ │
│ 📋 Logs      │  │ 1 │ Joan G.   │ Casa 2   │15-18j │✓ ✗  │ │
│              │  │ 2 │ Maria P.  │ Casa 4   │20-25j │✓ ✗  │ │
│              │  │ 3 │ Pere S.   │ Casa 1   │01-07a │✓ ✗  │ │
│              │  └───┴───────────┴──────────┴───────┴─────┘ │
│              │                                              │
│              │  [Veure totes les reserves →]                │
└──────────────┴──────────────────────────────────────────────┘
```

## WF-06: Les Meves Reserves (Client)

```
┌─────────────────────────────────────────────────────────────┐
│  NAVBAR                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📅 Les Meves Reserves                                      │
│                                                             │
│  Filtrar per: [Totes ▼]  [Buscar casa...]  [Buscar]        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🟡 PENDENT                                          │   │
│  │ Casa: Can Puigdomènech (Casa 3)                     │   │
│  │ Entrada: 15/07/2026 | Sortida: 18/07/2026 (3 nits) │   │
│  │ Persones: 5 | Total: 285,00€                        │   │
│  │ Sol·licitada: 01/06/2026 18:32                      │   │
│  │                              [ CANCEL·LAR RESERVA ] │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🟢 ACCEPTADA                                        │   │
│  │ Casa: Can Noguer (Casa 1)                           │   │
│  │ Entrada: 01/08/2026 | Sortida: 08/08/2026 (7 nits) │   │
│  │ Persones: 4 | Total: 595,00€                        │   │
│  │ Gestionada: 02/06/2026 09:15 per Admin              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔴 REBUTJADA                                        │   │
│  │ Casa: Can Roure (Casa 5)                            │   │
│  │ Entrada: 20/06/2026 | Sortida: 22/06/2026 (2 nits) │   │
│  │ Persones: 12 | Total: 300,00€                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                      │
└─────────────────────────────────────────────────────────────┘
```

---

# 16. VALIDACIONS

## 16.1 Validacions Client-Side (JavaScript)

### Formulari de Registre

| Camp | Validació JS | Missatge d'Error |
|------|-------------|-----------------|
| `nom` | No buit, longitud 2-100 caràcters | "El nom és obligatori (mínim 2 caràcters)" |
| `cognoms` | No buit, longitud 2-150 caràcters | "Els cognoms són obligatoris (mínim 2 caràcters)" |
| `email` | Regex email: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | "Introduïu un email vàlid" |
| `telefono` | Regex opcional: `/^[0-9\s\+\-]{9,20}$/` | "Format de telèfon invàlid" |
| `password` | Longitud ≥ 8, conté: majúscula, minúscula, número | "La contrasenya ha de tenir mínim 8 caràcters amb majúscula, minúscula i número" |
| `confirmar_password` | Igual que `password` | "Les contrasenyes no coincideixen" |

### Formulari de Login

| Camp | Validació JS |
|------|-------------|
| `email` | No buit, format email vàlid |
| `password` | No buit |

### Formulari de Reserva

| Camp | Validació JS |
|------|-------------|
| `fecha_entrada` | No buida, format data, ≥ data avui |
| `fecha_salida` | No buida, format data, > `fecha_entrada` |
| `num_personas` | Enter positiu, 1 ≤ valor ≤ capacitat de la casa |

## 16.2 Validacions Server-Side (PHP)

### Registre d'Usuari

```php
// Exemple de validació server-side
$errors = [];

if (empty($nombre) || strlen($nombre) < 2) {
    $errors['nombre'] = "El nom és obligatori.";
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = "Format d'email invàlid.";
}

if (strlen($password) < 8 || 
    !preg_match('/[A-Z]/', $password) || 
    !preg_match('/[a-z]/', $password) || 
    !preg_match('/[0-9]/', $password)) {
    $errors['password'] = "La contrasenya no compleix els requisits de seguretat.";
}

if ($password !== $confirmar_password) {
    $errors['confirmar_password'] = "Les contrasenyes no coincideixen.";
}

// Verificar email únic a la BD
$stmt = $pdo->prepare("SELECT COUNT(*) FROM usuarios WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetchColumn() > 0) {
    $errors['email'] = "Aquest email ja és registrat.";
}
```

### Validació de Disponibilitat (Regla de Negoci Central)

```php
function verificarDisponibilitat(PDO $pdo, int $id_casa, string $fecha_entrada, string $fecha_salida, ?int $excluir_id_reserva = null): bool
{
    $sql = "SELECT COUNT(*) FROM reservas 
            WHERE id_casa = :id_casa 
            AND estado_reserva IN ('pendiente', 'aceptada')
            AND fecha_entrada < :fecha_salida 
            AND fecha_salida > :fecha_entrada";
    
    if ($excluir_id_reserva !== null) {
        $sql .= " AND id_reserva != :excluir_id";
    }
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':id_casa', $id_casa, PDO::PARAM_INT);
    $stmt->bindValue(':fecha_entrada', $fecha_entrada);
    $stmt->bindValue(':fecha_salida', $fecha_salida);
    
    if ($excluir_id_reserva !== null) {
        $stmt->bindValue(':excluir_id', $excluir_id_reserva, PDO::PARAM_INT);
    }
    
    $stmt->execute();
    return (int) $stmt->fetchColumn() === 0; // true = disponible
}
```

## 16.3 Validacions d'Administració (Control de Permisos)

```php
// Funció de control d'accés (inclosa en totes les pàgines privades)
function requireLogin(): void {
    if (!isset($_SESSION['id_usuario'])) {
        header('Location: /login.php?error=session_expired');
        exit;
    }
}

function requireAdmin(): void {
    requireLogin();
    if ($_SESSION['rol'] !== 'admin') {
        header('HTTP/1.1 403 Forbidden');
        include 'views/errors/403.php';
        exit;
    }
}
```

| Pàgina | Validació d'accés |
|--------|--------------------|
| `/admin/*` | `requireAdmin()` – Rol 'admin' obligatori |
| `/mes_reserves.php` | `requireLogin()` – Sessió iniciada |
| `/perfil.php` | `requireLogin()` – Sessió iniciada |
| Aprovar/Rebutjar reserva (POST) | `requireAdmin()` + verificació token CSRF |

---

# 17. SEGURETAT

## 17.1 Hash de Contrasenyes

```php
// Creació del hash en el registre
$hash = password_hash($password_plana, PASSWORD_BCRYPT, ['cost' => 12]);

// Verificació en el login
if (password_verify($password_plana_introduida, $hash_de_la_BD)) {
    // Login correcte
}
```

- S'utilitza **BCrypt** amb cost 12 (factor de treball adequat per a 2026).
- Mai s'emmagatzema la contrasenya en text pla ni en MD5/SHA1.
- El hash resultant té 60 caràcters i inclou el salt de manera integrada.

## 17.2 PDO Prepared Statements (Protecció SQL Injection)

```php
// ✅ CORRECTE: Sentència preparada amb paràmetres lligats
$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = :email AND estado = 'activo'");
$stmt->bindValue(':email', $email, PDO::PARAM_STR);
$stmt->execute();

// ❌ INCORRECTE: Interpolació directa (vulnerable a SQL Injection)
// $stmt = $pdo->query("SELECT * FROM usuarios WHERE email = '$email'"); // MAI!
```

**Regla absoluta:** Cap valor provinent de l'usuari (`$_GET`, `$_POST`, `$_COOKIE`, `$_SESSION` des de client) es concatena directament en una consulta SQL.

## 17.3 Protecció XSS

```php
// Funció d'escapament per a output HTML
function e(string $valor): string {
    return htmlspecialchars($valor, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

// Ús en les vistes
echo "<p>" . e($usuario['nombre']) . "</p>";
```

Tota sortida de dades en HTML (provinents de la BD o de l'usuari) passa per `htmlspecialchars()`.

## 17.4 Tokens CSRF

```php
// Generació del token (a la càrrega del formulari)
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// En el formulari HTML
echo '<input type="hidden" name="csrf_token" value="' . $_SESSION['csrf_token'] . '">';

// Validació en el processament del POST
function validarCSRF(): void {
    if (!isset($_POST['csrf_token']) || 
        !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
        http_response_code(403);
        die("Error de validació CSRF. Torneu a la pàgina anterior.");
    }
}
```

## 17.5 Control de Sessions

```php
// config/session.php
ini_set('session.use_strict_mode', 1);
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);    // Activar en producció (HTTPS)
ini_set('session.cookie_samesite', 'Strict');
session_set_cookie_params(['lifetime' => 7200]); // 2 hores
session_start();

// Regeneració d'ID de sessió en el login (prevenció de Session Fixation)
session_regenerate_id(true);
```

## 17.6 Capçaleres de Seguretat HTTP

```php
// Afegir a config/session.php o al header.php
header("X-Frame-Options: DENY");
header("X-Content-Type-Options: nosniff");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;");
```

## 17.7 Protecció de Fitxers Sensibles (`.htaccess`)

```apache
# /gesCasesRurals/.htaccess
Options -Indexes

# Bloquejar accés directe a fitxers PHP de configuració
<FilesMatch "^(config|database|session)\.php$">
    Require all denied
</FilesMatch>

# Bloquejar accés a directoris sensibles
<DirectoryMatch "/(config|includes|models|controllers)/">
    Require all denied
</DirectoryMatch>

# Bloquejar accés al directori de manteniment en producció
<DirectoryMatch "/manteniment/">
    Require all denied
</DirectoryMatch>
```

---

# 18. PLA DE PROVES

## 18.1 Proves Funcionals

| ID | Cas de Prova | Dades d'Entrada | Resultat Esperat | Resultat Obtingut | Estat |
|----|-------------|-----------------|-----------------|-------------------|-------|
| PF-01 | Registre d'usuari correcte | Dades vàlides i úniques | Usuari creat, sessió iniciada | — | Pendent |
| PF-02 | Registre amb email duplicat | Email ja existent | Error: "Email ja registrat" | — | Pendent |
| PF-03 | Login correcte com a client | Credencials vàlides + rol client | Sessió client iniciada, redirecció a index | — | Pendent |
| PF-04 | Login correcte com a admin | Credencials vàlides + rol admin | Sessió admin iniciada, redirecció a dashboard | — | Pendent |
| PF-05 | Login amb contrasenya incorrecta | Contrasenya errònia | Error genèric de credencials | — | Pendent |
| PF-06 | Login amb compte bloquejat | Usuari bloqueado | Error: compte bloquejat | — | Pendent |
| PF-07 | Consulta de disponibilitat: casa lliure | Casa 1, dates sense conflictes | Resposta: disponible | — | Pendent |
| PF-08 | Consulta de disponibilitat: casa ocupada | Casa 1, dates amb reserva activa | Resposta: no disponible | — | Pendent |
| PF-09 | Crear reserva correctament | Dates vàlides, casa disponible, client autenticat | Reserva creada en estat 'pendiente' | — | Pendent |
| PF-10 | Crear reserva: solapament de dates | Dates conflictives | Error: dates no disponibles | — | Pendent |
| PF-11 | Crear reserva: persones > capacitat | num_personas > capacitat | Error: capacitat superada | — | Pendent |
| PF-12 | Aprovar reserva | Reserva en estat pendent | Estat canviat a 'aceptada', notificació generada | — | Pendent |
| PF-13 | Rebutjar reserva | Reserva en estat pendent | Estat canviat a 'rechazada', notificació generada | — | Pendent |
| PF-14 | Cancel·lar reserva pròpia | Reserva pendent del client | Estat canviat a 'cancelada' | — | Pendent |
| PF-15 | Alta de nova casa (admin) | Dades de casa vàlides + imatge | Casa creada, accessible al frontend | — | Pendent |
| PF-16 | Editar casa existent (admin) | Dades modificades | Canvis persistits a la BD | — | Pendent |
| PF-17 | Desactivar casa amb reserves actives | Casa amb 1 reserva pendent | Avís d'alerta, no es desactiva automàticament | — | Pendent |
| PF-18 | Visualitzar "Les meves reserves" | Usuari autenticat amb reserves | Llistat de reserves pròpies (no d'altres) | — | Pendent |
| PF-19 | Log d'accions d'administrador | Aprovació de reserva | Registre creat a logs_admin | — | Pendent |
| PF-20 | Tancar sessió | Clic a "Tancar sessió" | Sessió destruïda, redirecció a login | — | Pendent |

## 18.2 Proves d'Integració

| ID | Cas de Prova | Descripció | Resultat Esperat |
|----|-------------|-----------|-----------------|
| PI-01 | Flux complet de reserva | Registre → Login → Cercar casa → Comprovar disponibilitat → Reservar → Admin aprova → Client veu "Acceptada" | Tot el flux completa sense errors |
| PI-02 | Integritat referencial | Intentar eliminar un usuari amb reserves | Error BD: restricció FK, operació rebutjada |
| PI-03 | Cascade d'imatges | Eliminar una casa (si no té reserves) | Imatges associades eliminades per CASCADE |
| PI-04 | Doble comprovació disponibilitat | Dos clients reserven simultàniament la mateixa casa i dates | Només una reserva creada, l'altra falla |
| PI-05 | Notificació en aprovar reserva | Admin aprova una reserva | Notificació visible per al client |
| PI-06 | AJAX de disponibilitat | Selecció de dates → petició AJAX → resposta JSON | Resposta JSON correcta sense recarregar pàgina |

## 18.3 Proves de Validació

| ID | Cas de Prova | Dades d'Entrada | Resultat Esperat |
|----|-------------|-----------------|-----------------|
| PV-01 | Email sense @ | `pepgomez.com` | Error: "Format d'email invàlid" |
| PV-02 | Contrasenya < 8 caràcters | `pass1` | Error: "Mínim 8 caràcters" |
| PV-03 | Contrasenya sense número | `PasswordAbc` | Error: "Ha d'incloure un número" |
| PV-04 | Data entrada > data sortida | Entrada: 20/07, Sortida: 18/07 | Error: "La data de sortida ha de ser posterior" |
| PV-05 | Data entrada en el passat | Entrada: 01/01/2020 | Error: "La data no pot ser al passat" |
| PV-06 | Camps obligatoris buits | Tots els camps buits | Errors en tots els camps obligatoris |
| PV-07 | Nombre de persones = 0 | `num_personas = 0` | Error: "Ha d'indicar almenys 1 persona" |

## 18.4 Proves de Seguretat

| ID | Cas de Prova | Atac Simulat | Resultat Esperat |
|----|-------------|-------------|-----------------|
| PS-01 | SQL Injection en login | `' OR '1'='1` com a email | Login rebutjat, cap accés no autoritzat |
| PS-02 | XSS en camp de nom | `<script>alert('xss')</script>` | Text mostrat literalment, sense execució |
| PS-03 | Accés directe a pàgina admin | URL directa sense sessió | Redirecció a login (403 o redirect) |
| PS-04 | CSRF en formulari de reserva | Petició POST sense token CSRF | Error 403, operació rebutjada |
| PS-05 | Accés a reserves d'altre usuari | Manipulació de `id_reserva` en URL | Error 403 o reserves del propi usuari |
| PS-06 | Accès a fitxer config.php | URL directa: `/config/config.php` | Accés denegat per .htaccess |
| PS-07 | Pujada de fitxer PHP com a imatge | Upload de `shell.php` disfressat | Rebutjat per validació MIME type |

---

# 19. DADES D'EXEMPLE

## 19.1 INSERT Usuaris (10 usuaris)

```sql
-- ============================================================
-- Dades d'exemple: Usuaris
-- Contrasenya per a tots: Test1234! (hash BCrypt cost 12)
-- ============================================================

INSERT INTO `usuarios` 
    (`nombre`, `apellidos`, `email`, `password`, `telefono`, `rol`, `estado`, `fecha_registro`) 
VALUES
-- Administradors
('Jordi',    'Puigdomènech Masó',    'admin@gescasesrurals.cat',   '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '972 123 456', 'admin',   'activo',   '2026-01-01 10:00:00'),
('Montserrat','Puigdomènech Fontana','montse@gescasesrurals.cat',  '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '972 123 457', 'admin',   'activo',   '2026-01-15 09:00:00'),

-- Clients
('Joan',     'Garcia Roca',         'joan.garcia@email.com',       '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '600 111 222', 'cliente', 'activo',   '2026-02-10 14:30:00'),
('Maria',    'Pérez Soler',         'maria.perez@email.com',       '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '611 333 444', 'cliente', 'activo',   '2026-02-15 11:00:00'),
('Pere',     'Sala Martínez',       'pere.sala@email.com',         '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '622 555 666', 'cliente', 'activo',   '2026-03-01 16:45:00'),
('Anna',     'López Vidal',         'anna.lopez@email.com',        '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '633 777 888', 'cliente', 'activo',   '2026-03-20 09:15:00'),
('Carles',   'Fernández Pou',       'carles.fernandez@email.com',  '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL,          'cliente', 'activo',   '2026-04-05 20:00:00'),
('Núria',    'Bosch Torrent',       'nuria.bosch@email.com',       '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '644 999 000', 'cliente', 'activo',   '2026-04-18 12:30:00'),
('Marc',     'Riera Puig',          'marc.riera@email.com',        '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '655 111 333', 'cliente', 'inactivo', '2026-05-01 08:00:00'),
('Laura',    'Mas Brugada',         'laura.mas@email.com',         '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '666 444 555', 'cliente', 'bloqueado','2026-05-10 17:00:00');
```

## 19.2 INSERT Cases Rurals (6 cases)

```sql
-- ============================================================
-- Dades d'exemple: Cases Rurals
-- ============================================================

INSERT INTO `casas` 
    (`nombre`, `descripcion`, `capacidad`, `precio_noche`, `num_habitaciones`, `num_banos`, `metros_cuadrados`, `servicios`, `estado`) 
VALUES
(
    'Can Noguer',
    'Acollidora masia del segle XVIII completament restaurada, envoltada de bosc de roures centenaris. Disposa de xemeneia, cuina equipada i jardí privat amb barbacoa. Perfecta per a famílies que busquen la pau de la natura sense renunciar als confortes moderns.',
    6, 85.00, 3, 2, 130, 'WiFi,Barbacoa,Jardí,Aparcament,Cuina equipada,Xemeneia,TV,Rentadora',
    'activa'
),
(
    'Can Alzina',
    'Encantadora casa de pedra situada als peus de la muntanya, amb vistes espectaculars a la vall. Ideal per a parelles i famílies petites. Disposa de terrassa amb vistes panoràmiques i accés directe a rutes de senderisme.',
    4, 65.00, 2, 1, 90, 'WiFi,Terrassa,Aparcament,Cuina equipada,TV,Calefacció',
    'activa'
),
(
    'Can Puigdomènech',
    'La joia del complex. Gran masia senyorial amb piscina privada, jardí d''estiu, sala de jocs i zona BBQ. Perfecta per a celebracions familiars, reunions d''amics o escapades de grup. Disposa de sala d''estar amb TV gran, cuina industrial i 4 habitacions dobles.',
    10, 150.00, 4, 3, 250, 'WiFi,Piscina privada,Barbacoa,Jardí,Aparcament,Cuina industrial,TV gran,Sala de jocs,Terrassa,Rentadora,Assecadora',
    'activa'
),
(
    'Can Roure',
    'Rústica i autèntica casa rural amb tot el encant de la ruralia catalana. Disposa d''un hort orgànic que els hostes poden gaudir, gallines i un ase. Experiència rural única. Cuina de llenya i forn de pa tradicional.',
    8, 95.00, 4, 2, 180, 'WiFi,Hort orgànic,Animals de granja,Cuina de llenya,Forn de pa,Barbacoa,Aparcament',
    'activa'
),
(
    'Can Oliveres',
    'Luxosa casa rural situada enmig d''una olivera centenària. Disposa de spa interior (jacuzzi i sauna), habitació principal de luxe i totes les comoditats d''un hotel de 4 estrelles en un entorn natural privilegiat. Ideal per a celebracions especials.',
    12, 200.00, 5, 4, 320, 'WiFi,Spa,Jacuzzi,Sauna,Piscina exterior,Barbacoa,Jardí,Aparcament,Cuina equipada,TV,Rentadora,Minibar,Servei de neteja diari',
    'activa'
),
(
    'La Barraca del Riu',
    'Acollidora i econòmica opció per a parelles o famílies petites. Situada a la vora del riu, amb accés directe per a pescar o banyar-se. Sense pretensions però amb tot el necessari per a una estada confortable i desconnectada.',
    4, 55.00, 2, 1, 75, 'WiFi,Accés al riu,Terrassa,Aparcament,Cuina bàsica,Barbacoa',
    'activa'
);
```

## 19.3 INSERT Reserves (15 reserves)

```sql
-- ============================================================
-- Dades d'exemple: Reserves
-- (id_usuario: 3=Joan, 4=Maria, 5=Pere, 6=Anna, 7=Carles, 8=Núria)
-- (id_casa: 1=Can Noguer, 2=Can Alzina, 3=Can Puigdomènech, 4=Can Roure, 5=Can Oliveres, 6=La Barraca)
-- (id_admin_gestion: 1=Jordi admin)
-- ============================================================

INSERT INTO `reservas` 
    (`id_usuario`, `id_casa`, `fecha_entrada`, `fecha_salida`, `num_personas`, `precio_total`, `estado_reserva`, `observaciones`, `fecha_solicitud`, `fecha_gestion`, `id_admin_gestion`) 
VALUES
-- Reserves ACCEPTADES (historiques completades)
(3, 1, '2026-03-10', '2026-03-15', 5, 425.00, 'aceptada',   'Aniversari de casament. Necessitem cuna.', '2026-03-01 09:00:00', '2026-03-02 10:30:00', 1),
(4, 2, '2026-03-20', '2026-03-22', 2, 130.00, 'aceptada',   'Escapada de Setmana Santa.',               '2026-03-05 14:00:00', '2026-03-06 09:00:00', 1),
(5, 3, '2026-04-01', '2026-04-08', 9, 1050.00,'aceptada',   'Reunió familiar anual.',                   '2026-03-15 11:00:00', '2026-03-16 08:30:00', 1),
(6, 4, '2026-04-18', '2026-04-21', 6, 285.00, 'aceptada',   NULL,                                       '2026-04-01 20:00:00', '2026-04-02 11:00:00', 1),
(3, 5, '2026-05-01', '2026-05-05', 8, 800.00, 'aceptada',   'Celebració de graduació.',                 '2026-04-10 16:00:00', '2026-04-11 09:00:00', 1),

-- Reserves ACCEPTADES (futures confirmades)
(4, 1, '2026-07-10', '2026-07-17', 6, 595.00, 'aceptada',   'Vacances d''estiu.',                      '2026-05-20 10:00:00', '2026-05-21 09:15:00', 1),
(5, 6, '2026-07-01', '2026-07-04', 3, 165.00, 'aceptada',   'Cap de setmana de senderisme.',            '2026-06-01 12:00:00', '2026-06-02 08:00:00', 1),
(8, 3, '2026-08-10', '2026-08-17', 10, 1050.00,'aceptada',  'Festa aniversari 40 anys.',               '2026-05-15 09:00:00', '2026-05-16 10:00:00', 2),

-- Reserves PENDENTS (per a gestionar)
(3, 2, '2026-07-20', '2026-07-23', 2, 195.00, 'pendiente',  'Escapada romàntica.',                     '2026-06-03 19:00:00', NULL, NULL),
(6, 4, '2026-08-01', '2026-08-07', 7, 570.00, 'pendiente',  'Ens agrada molt Can Roure.',              '2026-06-04 08:30:00', NULL, NULL),
(7, 5, '2026-09-05', '2026-09-10', 10, 1000.00,'pendiente', 'Celebració d''empresa.',                  '2026-06-04 11:00:00', NULL, NULL),

-- Reserves REBUTJADES
(5, 1, '2026-07-10', '2026-07-15', 4, 425.00, 'rechazada',  NULL,                                      '2026-05-18 16:00:00', '2026-05-19 09:00:00', 1),
(6, 2, '2026-06-20', '2026-06-22', 2, 130.00, 'rechazada',  NULL,                                      '2026-06-01 10:00:00', '2026-06-02 08:30:00', 1),

-- Reserves CANCEL·LADES
(7, 3, '2026-06-15', '2026-06-20', 8, 750.00, 'cancelada',  'He de cancel·lar per motius personals.',  '2026-05-25 20:00:00', NULL, NULL),
(8, 6, '2026-07-05', '2026-07-07', 3, 110.00, 'cancelada',  NULL,                                      '2026-06-01 09:00:00', NULL, NULL);
```

## 19.4 INSERT Imatges de Cases

```sql
-- ============================================================
-- Dades d'exemple: Imatges de les Cases
-- ============================================================

INSERT INTO `imagenes` (`id_casa`, `ruta`, `descripcion_alt`, `es_principal`, `orden`) VALUES
-- Can Noguer (id_casa = 1)
(1, 'uploads/cases/1/principal.jpg',   'Façana exterior de Can Noguer', 1, 1),
(1, 'uploads/cases/1/interior.jpg',    'Sala d''estar amb xemeneia',    0, 2),
(1, 'uploads/cases/1/jardí.jpg',       'Jardí exterior amb barbacoa',   0, 3),

-- Can Alzina (id_casa = 2)
(2, 'uploads/cases/2/principal.jpg',   'Vista exterior de Can Alzina',  1, 1),
(2, 'uploads/cases/2/terrassa.jpg',    'Terrassa amb vistes a la vall', 0, 2),

-- Can Puigdomènech (id_casa = 3)
(3, 'uploads/cases/3/principal.jpg',   'Façana senyorial de Can Puig.', 1, 1),
(3, 'uploads/cases/3/piscina.jpg',     'Piscina privada exterior',      0, 2),
(3, 'uploads/cases/3/sala.jpg',        'Gran sala d''estar',            0, 3),
(3, 'uploads/cases/3/cuina.jpg',       'Cuina industrial equipada',     0, 4),

-- Can Roure (id_casa = 4)
(4, 'uploads/cases/4/principal.jpg',   'Exterior rústic de Can Roure',  1, 1),
(4, 'uploads/cases/4/hort.jpg',        'Hort orgànic dels hostes',      0, 2),

-- Can Oliveres (id_casa = 5)
(5, 'uploads/cases/5/principal.jpg',   'Façana de luxe de Can Oliveres',1, 1),
(5, 'uploads/cases/5/spa.jpg',         'Spa interior amb jacuzzi',      0, 2),
(5, 'uploads/cases/5/habitacio.jpg',   'Habitació principal de luxe',   0, 3),

-- La Barraca del Riu (id_casa = 6)
(6, 'uploads/cases/6/principal.jpg',   'Vista al riu de La Barraca',    1, 1),
(6, 'uploads/cases/6/terrassa.jpg',    'Terrassa amb vistes al riu',    0, 2);
```

---

# 20. CONCLUSIONS

## 20.1 Viabilitat del Projecte

El projecte **gesCasesRurals** és **tècnicament viable** i pot ser executat amb els recursos tecnològics proposats (PHP, MySQL, Apache) que representen una pila madura, ben documentada i àmpliament suportada pels serveis d'hosting convencionals a un cost molt baix (entre 5 i 15 €/mes).

La solució resol eficaçment el problema central identificat (gestió manual propensa a errors i reserves duplicades) i aporta un increment de valor clar i mesurable al negoci del client.

Des del punt de vista acadèmic, el projecte cobreix tots els blocs temàtics del mòdul d'Implantació d'Aplicacions Web: disseny de bases de dades relacionals, arquitectura MVC, seguretat web, accés a dades amb PDO i desplegament en servidor Apache.

## 20.2 Millores Futures (Versió 2.0)

| Millora | Descripció | Impacte |
|---------|-----------|---------|
| **Passarel·la de pagament** | Integració amb Stripe o PayPal per a cobrament en línia | Alt – Eliminaria el cobrament manual |
| **Sistema de valoracions** | Permitir als clients deixar puntuació i comentaris públics | Alt – Millora la confiança de nous usuaris |
| **Calendari de disponibilitat** | Visualitzar les dates disponibles/ocupades en un calendari interactiu | Alt – Millora molt l'experiència d'usuari |
| **Notificacions per email** | Enviar emails de confirmació i notificació (PHPMailer/SMTP) | Alt – Comunicació automatitzada |
| **API REST** | Exposar una API per a integració amb plataformes externes | Mitjà – Permet integrar amb Booking.com o Airbnb |
| **App Mòbil** | Aplicació mòbil nativa o PWA per a iOS i Android | Mitjà – Millora l'accessibilitat |
| **Estadístiques avançades** | Dashboard amb gràfics d'ocupació, ingressos per mes, casa més sol·licitada | Baix – Valor per al propietari |
| **Multi-idioma** | Suport per a català, castellà, anglès i francès | Baix – Important per a turisme internacional |

## 20.3 Possibles Ampliacions

- **Gestió de preus dinàmics**: Preu diferent per temporada alta/baixa, caps de setmana i festius.
- **Sistema de fidelització**: Descomptes per a clients habituals.
- **Integració amb xarxes socials**: Login amb Google/Facebook, compartir en RRSS.
- **Xat en temps real**: Comunicació directa entre client i administrador (WebSockets).
- **Sincronització de calendaris**: Exportació a iCal / Google Calendar.
- **Sistema de facturació**: Generació de factures PDF per a les reserves completades.

## 20.4 Valor per al Negoci

L'implementació de **gesCasesRurals** aportarà un valor mesurable al negoci del Sr. Puigdomènech en diverses dimensions:

**Eficiència operacional**: Reducció estimada del 80% del temps dedicat a la gestió manual de reserves (estimat en 10h/setmana → 2h/setmana).

**Reducció d'errors**: Eliminació gairebé completa de les reserves duplicades (de ~3 incidents/temporada a 0), evitant situacions de crisi i pèrdua de reputació.

**Disponibilitat 24/7**: Els clients poden consultar i sol·licitar reserves en qualsevol moment, sense dependre de l'horari d'atenció del propietari. Increment potencial de reserves del 20-30%.

**Professionalització**: La imatge digital del negoci millora notablement, incrementant la confiança dels nous clients i la fidelitat dels habituals.

**Escalabilitat**: La solució pot créixer amb el negoci (noves cases, nous serveis) sense requerir canvis arquitecturals majors.

**ROI estimat**: Amb un cost de desenvolupament acadèmic i un cost d'hosting de ~12€/mes, el retorn de la inversió s'assoleix en les primeres 2-3 reserves addicionals generades gràcies a la disponibilitat 24/7.

---

> *Document generat per al projecte acadèmic gesCasesRurals · Implantació d'Aplicacions Web · Juny 2026*  
> *Revisió: 1.0 – Document complet de 20 seccions*
