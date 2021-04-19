## despre

poze pt cartonase motovelo ca dureaza prea mult sa stai sa le faci manual

programul descarca o versiune de chromium si o foloseste headless pentru a randa `index.html`, si face screenshot la elementul `#tabelul`

## cum folosesti

rulezi programul si il lasi in fundal, editezi in `data.txt` randurile ce contin `:::`, si de fiecare data cand salvezi se va genera o poza in folderul `photos` cu numele dat de randul ce contine `===`

**un bug ii ca daca ai imaginea deschisa in timp ce editezi `data.txt` programul nu va mai merge, deci inchide poza dupa ce ai vz o si schimba numele la fisier de dupa `===` pt a genera o poza noua, daca intampini bugul asta doar inchide l si deschide l**

## download

o sa fie si un exe la sectiunea de releases, **e nevoie de o conexiune si de mai mult spatiu decat descarcarea initiala pt a descarca chromium**

## cum faci alt model

aspectul modular provine din faptul ca poti face un model nou de cartonase doar prin editarea `index.html`, orice program sau modalitate e compatibila

- un `index.html` care sa contina notatiile _$$slot**x**_ in locul in care sa fie inlocuite datele din `data.txt`, **x** din notatii corespunde cu linia din `data.txt`, adica `$$slot0`din`index.html`corespunde cu prima linie ce contine`:::`

- un `data.txt` structurat ca in model. nu conteaza spatiile sau liniile in plus, liniile importante sunt doar cele cu delimitatorul `:::`, nu conteaza ce este dupa partea stanga a delimitatorului, doar ce e in partea dreapta, astfel `nume ::: maverix` este echivalent cu `::: maverix` daca sunt situate pe aceeasi linie, obligatoriu in `data.txt`, recomandat la sfarsitul fisierului, linia cu `===`

- observatie: `data.txt` trebuie sa aiba acelasi nr de `:::` ca nr de sloturi din `index.html`

## deps

de la versiuni mai mici pot aparea probleme, pt a avea exact acceasi versiune de node ca aici instaleaza `nvm` si foloseste versiunea aia

node: `v14.15.3`

npm: `6.14.9`

yarn: `1.22.10` (`npm i -g yarn`)

## pt rulare dev

`yarn start`

rulezi `yarn` in folder prima data sau de fiecare data cand umblu la deps

ai nevoie de `index.html` si `index.css` in acelasi folder mereu cand rulezi programul chit ca este compilat

## pt build

`yarn build-win`

`yarn build-linux`
