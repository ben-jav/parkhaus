// 202403071603
// Parkhaus mit 2 Etage jeweils 10 Parkboxen
// mit verschachtelte Array-Struktur

const myprompt = require('prompt-sync')({ sigint: true })

interface Parkboxen {
    id: number;
    autoKennzeichen: string;
    status: string;
    lable: string;
    parkzeit?: Date;
    anzahlGeparkt: number;
}

const parkhaus: Parkboxen[][] = [];

for (let etage = 0; etage < 2; etage++) {
    let etagenBoxen: Parkboxen[] = [];
    for (let i = 0; i < 10; i++) {
        if (etage == 0) {
            if (i < 7) {
                etagenBoxen.push({id: i+1, autoKennzeichen: '', status: 'frei', lable: 'ladies', anzahlGeparkt: 0});
            } else {
                etagenBoxen.push({id: i+1, autoKennzeichen: '', status: 'frei', lable: 'noLable', anzahlGeparkt: 0});
            } 
        } else {
            etagenBoxen.push({id: i+11, autoKennzeichen: '', status: 'frei', lable: 'noLable', anzahlGeparkt: 0});
        }
    }
    parkhaus.push(etagenBoxen);
}
let anzahlBox = parkhaus[0].length + parkhaus[1].length;
let anzahlBelegt = 0;
let gesamtEinnahmen = 0;
let gesamtAnzahlAusfahrt = 0;




function findeAuto(kennzeichen: string) : number {
    for (let etage = 0; etage < parkhaus.length; etage++) {
        parkhaus[etage].forEach(box => {
            if (box.autoKennzeichen === kennzeichen) {
                return box.id;
            }
        });
    }
    return -1;
}


function findeAuto1(kennzeichen: string) : number {
    for (let etage = 0; etage < parkhaus.length; etage++) {
        for (let i = 0; i < parkhaus[etage].length; i++) {
            if (parkhaus[etage][i].autoKennzeichen === kennzeichen) {
                return parkhaus[etage][i].id;
            }
        }
    }
    return -1;
}

function ausparkenAuto(kennzeichen: string) : boolean {
    const id = findeAuto1(kennzeichen);
    if (id === -1) {
        console.log('Das Auto mit Kennzeichen', kennzeichen, 'ist nicht im Parkhaus!');
        return false;
    } else {
        return ausparkenId(id);
    }
}

function ausparkenId(id: number) : boolean {
    if (id < 1 || id > anzahlBox) {
        console.log("Falsche ID!");
        return false;
    } else {
        // if (id <= 10) {
        //     if (parkhaus[0][id-1].status !== 'frei') {
        //         const parkDauerMinute = Math.ceil((Date.now() - parkhaus[0][id-1].parkzeit!.getTime()) / (1000 * 60));
        //         const parkKosten = parkDauerMinute * 0.10;
        //         console.log(`Auto ${parkhaus[0][id-1].autoKennzeichen} ist vom Parkbox ${id} raus.`);
        //         console.log(`Parkdauer: ${parkDauerMinute} Minuten.`);
        //         console.log(`Parkkosten: ${parkKosten.toFixed(2)} Euro.`);
        //         parkhaus[0][id-1].autoKennzeichen = '';
        //         parkhaus[0][id-1].status = 'frei';
        //         parkhaus[0][id-1].parkzeit = undefined;
        //         anzahlBelegt--;
        //         return true;
        //     } else {
        //         console.log(`Parkbox ${id} ist schon leer/frei`);
        //         return false;
        //     }
        // } else if (id > 10) {
        //     if (parkhaus[1][id-11].status !== 'frei') {
        //         const parkDauerMinute = Math.ceil((Date.now() - parkhaus[1][id-11].parkzeit!.getTime()) / (1000 * 60));
        //         const parkKosten = parkDauerMinute * 0.10;
        //         console.log(`Auto ${parkhaus[1][id-11].autoKennzeichen} ist vom Parkbox ${id} raus.`);
        //         console.log(`Parkdauer: ${parkDauerMinute} Minuten.`);
        //         console.log(`Parkkosten: ${parkKosten.toFixed(2)} Euro.`);
        //         parkhaus[1][id-11].autoKennzeichen = '';
        //         parkhaus[1][id-11].status = 'frei';
        //         parkhaus[1][id-11].parkzeit = undefined;
        //         anzahlBelegt--;
        //         return true;
        //     } else {
        //         console.log(`Parkbox ${id} ist schon frei!`);
        //         return false;
        //     }
        // }
        const box = (id <= 10) ? parkhaus[0][id-1] : parkhaus[1][id-11];
        if (box.status !== 'frei') {
            const parkDauerMinute = Math.ceil((Date.now() - box.parkzeit!.getTime()) / (1000 * 60));
            const parkKosten = parkDauerMinute * 0.10;
            gesamtEinnahmen += parkKosten;
            console.log(`Auto ${box.autoKennzeichen} ist vom Parkbox ${id} raus.`);
            console.log(`Parkdauer: ${parkDauerMinute} Minuten.`);
            console.log(`Parkkosten: ${parkKosten.toFixed(2)} Euro.`);
            box.autoKennzeichen = '';
            box.status = 'frei';
            box.parkzeit = undefined;
            anzahlBelegt--;
            gesamtAnzahlAusfahrt ++;
            return true;
        } else {
            console.log(`Parkbox ${id} ist schon leer/frei`);
            return false;
        }
    }
}

function einparken(kennzeichen: string, lady: string): boolean {
    let geparkt = false;

    if (anzahlBelegt < 20) {
        if (lady == 'y') {
            if (einparklady() === false) {
                einparkAll();
            }
        } else {
            einparkAll();
        }
    } else {
        console.log('Parkhaus ist voll, erstmal ausparken dann erneut versuchen.');
    }
    
    function einparklady() : boolean {
        for (let i = 0; i < 7; i++) {
            if (parkhaus[0][i].status === 'frei') {
                parkhaus[0][i].autoKennzeichen = kennzeichen;
                parkhaus[0][i].status = 'belegt';
                console.log(`Auto ${kennzeichen} wurde in 1. Etage Parkbox ${i+1} geparkt.`);
                // diese Zeitstampel muss ich später in einer andere stelle platzieren
                // z.B. in der erste if-schleife in Funktion
                // um unnötige Zeitstampel verhindern
                // oder alternetiv oder besser kann auch ein freieLadiesPlatzAnzahl-Methode für 
                // erste if-Schleife in einparken-Methode schreiben 
                // um einparklady() nicht unnötig auszuführen.
                parkhaus[0][i].parkzeit = new Date();
                parkhaus[0][i].anzahlGeparkt++;
                anzahlBelegt++;
                geparkt = true;
                return true;
            }
        }
        return false;
    }
    function einparkAll() {
        if (freieMannPlatzAnzahl() > 0) {
            while (geparkt === false) {
                const random = Math.floor(Math.random() * (20 - 8 + 1) + 8);
                if (random <= 10) {
                    if (parkhaus[0][random-1].status === 'frei') {
                        parkhaus[0][random-1].autoKennzeichen = kennzeichen;
                        parkhaus[0][random-1].status = 'belegt';
                        parkhaus[0][random-1].parkzeit = new Date();
                        parkhaus[0][random-1].anzahlGeparkt++;
                        console.log(`Auto ${kennzeichen} wurde in 1. Etage Parkbox ${random} geparkt.`);
                        anzahlBelegt++;
                        geparkt = true;
                    }
                } else if (random > 10) {
                    if (parkhaus[1][random-11].status === 'frei') {
                        parkhaus[1][random-11].autoKennzeichen = kennzeichen;
                        parkhaus[1][random-11].status = 'belegt';
                        parkhaus[1][random-11].parkzeit = new Date();
                        parkhaus[1][random-11].anzahlGeparkt++;
                        console.log(`Auto ${kennzeichen} wurde in 2. Etage Parkbox ${random} geparkt.`);
                        anzahlBelegt++;
                        geparkt = true;
                    }
                }
            }
        } else {
            console.log('Männer Parkplätze sin alle voll! erstmal ausparken.');
        }
    }
    return geparkt;
}

function freieMannPlatzAnzahl () : number {
    var anzahl = 0;
    for (let etage = 0; etage < parkhaus.length; etage++) {
        for (let i = 0; i < parkhaus[etage].length; i++) {
            if (parkhaus[etage][i].lable !== 'ladies' && parkhaus[etage][i].status === 'frei') {
                anzahl++;
            }
        }
    }
    return anzahl;
}

function anzahlEinfahrtAusfahrt () : void {
    let anzahl = 0;
    for (let etage = 0; etage < parkhaus.length; etage++) {
        for (let i = 0; i < parkhaus[etage].length; i++) {
            anzahl += parkhaus[etage][i].anzahlGeparkt;
        }
    }
    console.log(`Gesamte Einfahrten in Parkhaus: ${anzahl}`);
    console.log(`Gesamte Ausfahrten aus Parkhaus: ${gesamtAnzahlAusfahrt}`);
}


function alleAusparken () : void { 
    parkhaus.forEach(etage => {
        etage.forEach(box => {
            if (box.status !== 'frei' || box.autoKennzeichen !== '') {
                let id = box.id;
                ausparkenId(id);
            }
        })
    })
}
function feierabendCheck () : void {
    const aktuelleZeit = new Date();
    const stunde = aktuelleZeit.getHours();
    const minute = aktuelleZeit.getMinutes();
    if (stunde === 20 && minute === 0) {
        console.log('Es ist 20:00 Uhr. Feierabend, alle Autos raus!');
        alleAusparken();
    }
}
setInterval(feierabendCheck, 60000);


function parkhausInfo () : void {
    console.log('--------------------------------------------------');
    for (let etage = 0; etage < parkhaus.length; etage++) {
        let zeile = '|';
        for (let i = 0; i < parkhaus[etage].length; i++) {
            let box = parkhaus[etage][i];
            if (box.status === 'frei') {
                zeile += ' - |'
            } else {
                zeile += ' x |'
            }
        }
        console.log(zeile + ` Etage ${etage+1}`);
        console.log('--------------------------------------------------');
    }
    console.log(`Freie Plätze: ${anzahlBox - anzahlBelegt}` + `    Belegte Plätze: ${anzahlBelegt}`);
}

// --------------------------------------------------
// | x | x | x | x | x | x | x | x | x | x | Etage 1
// --------------------------------------------------
// | - | - | - | - | - | - | - | - | - | - | Etage 2
// --------------------------------------------------

function sechsAutosParken () : void {
    einparken('HB-L9040', 'y');
    einparken('D-S9040', 'n');
    einparken('ME-48203', 'y');
    einparken('HB-6790', 'n');
    einparken('NE-C9880', 'y');
    einparken('D-L9040', 'n');
}
sechsAutosParken();



let eingabe = -1;
while (eingabe !== 6) {
    console.log("\x1b[33m");
    console.log("1. Einparken");
    console.log("2. Ausparken");
    console.log("3. Gesamte Parkhaus Info anzeigen");
    console.log("4. Parkhaus Einnahmen");
    console.log("5. Alle Autos ausparken.");
    console.log("6. Exit", "\x1b[0m");
    eingabe = parseInt(myprompt("Bitte Ihre Auswahl eingeben: ") || "0")

    switch (eingabe) {
        case 1:
            var kenn = myprompt("Kennzeichen eingeben: ");
            var fahrer = myprompt("Ist Fahrer eine Lady? (y/n) ");
            einparken(kenn, fahrer);
            break;
        case 2:
            var kennOrId = myprompt("Kennzeichen oder Parkbox-Nr. eingeben: ");
            if (!isNaN(parseInt(kennOrId))) {
                ausparkenId(parseInt(kennOrId));
            } else {
                ausparkenAuto(kennOrId);
            }
            break;
        case 3:
            console.log(parkhaus);
            parkhausInfo();
            anzahlEinfahrtAusfahrt();
            break;
        case 4:
            console.log('Gesamte Einnahmen: ', gesamtEinnahmen, 'EUR');
            break;
        case 5: 
            alleAusparken();
            break;
        case 6:
            console.log("Exit Programm");
            break;
        default:
            console.log("Ungültige Auswahl, erneut versuchen.");
            break;
    }
}