name: Combined Frontend Pipelines

on:
  push:
    branches:
      - main
    paths:
      - 'admin_frontend/**'
      - 'frontend/**'
      - 'Backend/**'
jobs:
  admin_frontend:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '>=14'
      - name: Install Dependencies
        run: |
          cd admin_frontend
          npm i

      - name: Build and Test
        run: |
          cd admin_frontend
          npm run build
          
  frontend:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '>=14'
      - name: Install Dependencies
        run: |
          cd frontend
          npm i

      - name: Build and Test
        run: |
          cd frontend
          npm run build

  Backend:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '>=14'      
      - name: Install Dependencies
        run: |
          cd Backend
          npm i

      - name: Build and Test
        run: |
          cd Backend
          pm2 restart all