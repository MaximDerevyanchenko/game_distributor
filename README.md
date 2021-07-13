# Stim

Tutto il progetto, incluso di relazione e rispettivi mockup, è disponibile nella release.

## Installazione

Per installare l'applicativo è necessario aver già installato *Npm e MongoDB*.

Una volta scaricato il progetto è necessario eseguire i seguenti passi:

1. Aprire una *console* nella cartella del progetto e digitare
  
      `npm install` 
  
2. Compilare il file *.scss* mediante il comando

      `npm run build-css`
    
3. Eseguire i seguenti comandi per MongoDB:

      `mongoimport --db stim --collection games games.json --jsonArray`
        
      `mongoimport --db stim --collection countries countries.json --jsonArray`
  
4. Eseguire il server tramite il comando

      `node index.js`
   
5. Infine, digitare sul browser
        
     `http://localhost:3000`
    
