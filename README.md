## FullStack 1 opintojakson luentoon 5 liittyvä esimerkki

### Backend

_Backend-kirjastot ovat projektissa valittu niin että ne tukevat myös JS/TS pohjaisia edge-funktioiden suoritusympäristöjä_

Projektissa on otettu käyttöön TypeScript sovelluskehys Hono
- Linkki Honon dokumentaatioon: https://hono.dev/

Tietokantana (toistaiseksi)
- sqlite https://www.npmjs.com/package/better-sqlite3
- ORM:ina drizzle https://orm.drizzle.team/

## #Käyttöönotto
1. Kloonaa repositorio

2. Asenna paketit

```
npm install
```

3. Suorita tietokannan luominen schema.ts tiedoston mukaisesti
```
npm run generate
```

4. Suorita migraatio
```
npm run migrate
```

5. Käynnistä backend-palvelin kehitysympäristössä
```
npm run dev
```



```
open http://localhost:3000
```
