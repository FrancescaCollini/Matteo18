// Codice di accesso
const ACCESS_CODE = 'wonderland18';

// Gestione dei tab
function switchTab(tabName) {
    // Nascondi tutti i tab
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Rimuovi la classe active da tutti i pulsanti
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Mostra il tab selezionato
    document.getElementById(tabName).classList.add('active');

    // Aggiungi la classe active al pulsante cliccato
    event.target.classList.add('active');
}

// Gestione sblocco sezione conferma
function unlockConferma() {
    const code = document.getElementById('accessCode').value.trim();
    const errorMsg = document.getElementById('errorMsg');
    const codeSection = document.getElementById('codeInput');
    const confermContent = document.getElementById('confermContent');

    // Pulizia messaggio errore precedente
    errorMsg.textContent = '';

    if (!code) {
        errorMsg.textContent = '⚠️ Per favore, inserisci il codice di accesso.';
        return;
    }

    if (code === ACCESS_CODE) {
        // Codice corretto - mostra il form
        codeSection.classList.add('hidden');
        confermContent.classList.remove('hidden');
        errorMsg.textContent = '';
    } else {
        // Codice errato
        errorMsg.textContent = '❌ Codice non corretto. Riprova!';
        document.getElementById('accessCode').value = '';
        
        // Effetto di shake
        document.getElementById('accessCode').style.animation = 'none';
        setTimeout(() => {
            document.getElementById('accessCode').style.animation = 'shake 0.5s';
        }, 10);
    }
}

// Gestione invio form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.conferma-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Raccogli dati del form
            const nome = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const guests = document.getElementById('guests').value;
            const dietary = document.getElementById('dietary').value;

            // Validazione base
            if (!nome || !email || !guests) {
                alert('Per favore, compila tutti i campi obbligatori!');
                return;
            }

            // Crea oggetto con i dati
            const formData = {
                nome: nome,
                email: email,
                phone: phone,
                numeroPersone: guests,
                esigenzeDietetiche: dietary,
                dataConferma: new Date().toLocaleString('it-IT')
            };

            // Salva in localStorage come backup
            let conferme = JSON.parse(localStorage.getItem('confermeCompleanno')) || [];
            conferme.push(formData);
            localStorage.setItem('confermeCompleanno', JSON.stringify(conferme));

            // Mostra messaggio di successo
            form.style.display = 'none';
            document.getElementById('confirmationMsg').classList.remove('hidden');

            // Log per debug (in produzione, mandare al server)
            console.log('Conferma ricevuta:', formData);
            console.log('Totale conferme:', conferme.length);

            // Reset form dopo 3 secondi
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                document.getElementById('confirmationMsg').classList.add('hidden');
            }, 5000);
        });
    }

    // Permetti invio con Invio quando il focus è sull'input del codice
    document.getElementById('accessCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            unlockConferma();
        }
    });
});

// Aggiungi animazione shake al CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Funzione per ottenere il numero totale di conferme (utile per amministratore)
function getConferme() {
    const conferme = JSON.parse(localStorage.getItem('confermeCompleanno')) || [];
    return conferme;
}

// Funzione per contare le persone totali
function contaPersone() {
    const conferme = getConferme();
    let totale = 0;
    conferme.forEach(conferma => {
        totale += parseInt(conferma.numeroPersone) || 1;
    });
    return totale;
}

// Funzione per exportare dati (utile per l'host)
function exportConfermeDati() {
    const conferme = getConferme();
    const csv = 'Nome,Email,Telefono,Numero Persone,Esigenze Dietetiche,Data Conferma\n' +
        conferme.map(c => 
            `"${c.nome}","${c.email}","${c.phone}","${c.numeroPersone}","${c.esigenzeDietetiche}","${c.dataConferma}"`
        ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conferme-compleanno.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}