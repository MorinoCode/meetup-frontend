# Meetup Frontend

En fullstack-applikation byggd i **React (Vite)** som låter användare **registrera sig, logga in, skapa, delta i och recensera meetups**.  
Frontend är byggd i React och driftsatt på **AWS S3**, medan backend körs i **Render** som en Docker-container.

---

## 🚀 Funktionalitet

### 👥 Användarflöde
- **Signup & Login** med JWT-autentisering  
- **Protected routes** (endast åtkomst för inloggade användare)
- **Skapa, visa, delta i, och avregistrera sig från meetups**
- **Filtrera & söka** bland meetups
- **Se profil med historik och kommande meetups**
- **Betygsätt & recensera** tidigare meetups

### 📅 Meetups-funktioner
- Visa **alla meetups** med titel, plats, datum, tid och värd
- Filtrera meetups efter **datumintervall** eller **uppkommande/tidigare**
- Skapa egna meetups (med titel, beskrivning, plats, tid och datum)
- Möjlighet att anmäla sig eller avregistrera sig
- Recensioner och betyg visas på varje meetup-sida

---

## 🏗️ Teknisk översikt

| Teknologi | Användning |
|------------|-------------|
| **React (Vite)** | UI och routing |
| **React Router DOM** | Navigering och privata routes |
| **CSS / Tailwind-liknande styling** | Komponentdesign |
| **Render** | Backend-hosting (Express + Postgres) |
| **AWS S3** | Frontend-hosting |
| **GitHub Actions** | CI/CD-pipeline för automatisk deployment |
| **JWT** | Autentisering & skyddade routes |

---

## 🧠 Projektstruktur

```bash
meetup-frontend/
│
├── src/
│   ├── component/
│   │   ├── navbar/         # Navbar-komponent
│   │   └── footer/         # Footer-komponent
│   │
│   ├── pages/
│   │   ├── home/           # Startsida
│   │   ├── signup/         # Registrering
│   │   ├── login/          # Inloggning
│   │   ├── meetups/        # Alla meetups + filter/sök
│   │   ├── meetupDetails/  # Detaljerad meetup-sida
│   │   ├── profile/        # Profil & historik
│   │   └── createmeetup/   # Skapa meetup
│   │
│   ├── App.jsx             # Routing och PrivateRoute
│   ├── main.jsx            # React root + BrowserRouter
│   ├── config.js           # Backend-URL (Render)
│   └── index.css           # Global styling
│
├── .github/
│   └── workflows/
│       └── frontend.yml    # GitHub Actions (deployment till S3)
│
├── package.json
├── vite.config.js
└── README.md
