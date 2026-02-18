# Dolce Vita - Sito Web Pasticceria Artigianale

Un sito web moderno e elegante per una pasticceria artigianale di lusso. Questo progetto è un concept professionale che mostra best practices nel web design e nello sviluppo frontend.

## Sito Live

[Visita il sito live](https://ft2801.github.io/Dolce-Vita-Website/) per vedere il progetto in azione.

## Caratteristiche

- Scroll fluido con Lenis
- Design elegante e minimalista con accenti oro
- Layout completamente responsivo
- Prestazioni ottimizzate con throttling degli eventi e lazy loading
- Animazione di preloader elegante
- Elementi interattivi: hover effects, pulsanti magnetici, parallax
- Menu mobile funzionale
- Form contatti
- HTML5 semantico e ottimizzato per SEO

## Tecnologie Utilizzate

- HTML5
- CSS3 con variabili e animazioni
- JavaScript vanilla (ES6+)
- Lenis per lo smooth scrolling
- IntersectionObserver API

## Struttura del Progetto

```
dolcevita/
├── index.html          # Home page
├── about.html          # Chi Siamo
├── menu.html           # Creazioni
├── gallery.html        # Galleria
├── contact.html        # Contatti
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   └── animations.js
├── README.md
├── LICENSE
└── .gitignore
```

## Installazione Locale

1. Clona il repository
   ```bash
   git clone https://github.com/ft2801/Dolce-Vita-Website.git
   cd dolcevita
   ```

2. Avvia un server locale
   ```bash
   python -m http.server 8000
   ```

3. Apri il browser
   ```
   http://localhost:8000
   ```

## Pagine

- **Home**: Landing page con hero, prodotti in evidenza e testimonial
- **Chi Siamo**: Storia della pasticceria e valori
- **Creazioni**: Showcase dei prodotti con filtri
- **Galleria**: Immagini con lightbox
- **Contatti**: Form di contatto e informazioni

## Personalizzazione

Tutti i colori sono definiti come variabili CSS in `style.css`

I contenuti HTML, le immagini e i testi possono essere facilmente personalizzati per la tua pasticceria.

## Licenza

Questo progetto è sotto licenza MIT. Vedi il file [LICENSE](LICENSE) per i dettagli.
