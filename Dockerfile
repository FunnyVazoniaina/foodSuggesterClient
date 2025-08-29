# Utilise Node 22 Alpine
FROM node:22-alpine

# Crée le dossier de travail
WORKDIR /app

# Installe les dépendances système utiles
RUN apk add --no-cache bash git

# Copie package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm ci

# Copie le reste du code
COPY . .

# Expose le port du dev server (Vite ou CRA)
EXPOSE 5173

# Commande pour lancer le dev server
CMD ["npm", "run", "dev"]
