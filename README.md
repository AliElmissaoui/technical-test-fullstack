#  Visionyze – Test Fullstack (Stripe + Next.js + Prisma)

> Mini application **Next.js 14 + Stripe (mode test)** avec persistance **PostgreSQL (Prisma)** et un mini **dashboard admin**.  
> Déployable facilement via **Docker Compose**.

---

##  Objectif du projet

Créer une application qui permet de :
- Initier un paiement via **Stripe Checkout** (mode test).  
- Recevoir la confirmation via un **webhook Stripe** sécurisé.  
- Sauvegarder les paiements dans **PostgreSQL** via **Prisma**.  
- Afficher un **dashboard `/admin`** listant les paiements récents .

---

##  Installation rapide
Cloner le projet
git clone https://github.com/AliElmissaoui/technical-test-fullstack.git
cd technical-test-fullstack

## Exécution complète via Docker

```bash
cp .env.example .env
docker compose up --build
# Stripe CLI hors conteneur:
stripe listen --forward-to http://localhost:3000/api/webhook ..
```


## Structure du projet
src/
├─ app/
│  ├─ page.tsx              → Page d’accueil (checkout)
│  ├─ admin/page.tsx        → Dashboard admin 
│  └─ api/
│     ├─ checkout/route.ts  → Création session Stripe
│     └─ webhook/route.ts   → Réception webhook Stripe
├─ lib/
│  ├─ prisma.ts             → Client Prisma
│  └─ stripe.ts             → Initialisation Stripe
prisma/
└─ schema.prisma            → Modèle Payment
README.md 


## Fonctionnement

L’utilisateur clique sur “Acheter” → création d’une session Stripe Checkout.

Après paiement, Stripe envoie un webhook à l’API /api/webhook.

Le webhook vérifie la signature et crée la ligne dans la base Payment.

Le dashboard /admin affiche les 50 derniers paiements (avec total global).


## Explications techniques
Pourquoi ce mode d’intégration Stripe ?

J’ai choisi Stripe Checkout hébergé car :

il simplifie la gestion du paiement et la conformité PCI.

il évite de manipuler directement les cartes bancaires.

il est rapide à mettre en place et idéal pour un test technique.

Limites en production :

Personnalisation limitée de l’UI du checkout.

Dépendance à l’infrastructure Stripe (pas de self-host).

Webhook doit être exposé publiquement (via Stripe CLI ou tunnel).


Points à améliorer avec plus de temps

Ajouter une authentification admin sécurisée (NextAuth / Clerk).

Ajouter recherche / filtrage sur le dashboard.

Ajout du support multi-devises et pagination serveur-side.

Gérer les statuts Stripe dynamiquement (websocket ou polling).

Ajouter des tests unitaires Jest + e2e Playwright.

CI/CD automatique via GitHub Actions.