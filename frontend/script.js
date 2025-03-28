document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const benutzername = document.getElementById("login-benutzername").value;
  const passwort = document.getElementById("login-passwort").value;

  fetch("http://localhost:8080/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ benutzername, passwort })
  })
    .then(res => res.text())
    .then(rolle => {
      if (rolle === "admin" || rolle === "user") {
        localStorage.setItem("rolle", rolle);
        document.getElementById("login-container").style.display = "none";
        document.getElementById("app-inhalt").style.display = "block";
        ladeApp(); // a fő inicializálás
      } else {
        document.getElementById("login-fehler").style.display = "block";
      }
    });
});

// Produktliste vom Server laden und anzeigen
fetch('http://localhost:8080/api/items')
  .then(response => response.json())
  .then(produkte => {
    const tabelle = document.getElementById('produkt-tabelle');
    produkte.forEach(produkt => {
      const zeile = document.createElement('tr');
      zeile.setAttribute('data-id', produkt.id);

      zeile.innerHTML = `
        <td><input type="checkbox" class="auswahl-checkbox" data-id="${produkt.id}"></td>
        <td>${produkt.name}</td>
        <td>${produkt.artikelnummer}</td>
        <td>${produkt.beschreibung}</td>
        <td>${produkt.menge}</td>
        <td>${produkt.lager}</td>
      `;

      tabelle.appendChild(zeile);
    });
  });

// Neuen Produkt hinzufügen

// Ausgewählte Produkte löschen
document.getElementById('geloeschte-auswahl').addEventListener('click', () => {
  const checkboxen = document.querySelectorAll('.auswahl-checkbox:checked');
  const idsZumLoeschen = Array.from(checkboxen).map(cb => cb.getAttribute('data-id'));

  if (idsZumLoeschen.length === 0) {
    alert("Keine ausgewählten Einträge.");
    return;
  }

  if (!confirm("Bist du sicher, dass du die ausgewählten Produkte löschen möchtest?")) return;

  const promises = idsZumLoeschen.map(id => {
    return fetch(`http://localhost:8080/api/items/${id}`, {
      method: 'DELETE'
    });
  });

  Promise.all(promises)
    .then(() => {
      // Frissítés a sikeres törlés után
      location.reload();
      ladeStatistik();
    })
    .catch(fehler => console.error("Fehler beim Löschen:", fehler));
});

// Formular-Submit: Neues Produkt oder Bearbeiten
document.getElementById('produkt-formular').addEventListener('submit', function (e) {
  e.preventDefault();

  const formularButton = this.querySelector('button');
  const bearbeitenId = formularButton.getAttribute('data-bearbeiten-id');
  ladeStatistik();
  // ✅ Itt hozzuk létre a termék objektumot, ami POST-hoz és PUT-hoz is kell
  const produkt = {
    name: document.getElementById('name').value,
    artikelnummer: document.getElementById('artikelnummer').value,
    beschreibung: document.getElementById('beschreibung').value,
    menge: parseInt(document.getElementById('menge').value),
    lager: document.getElementById('lager').value
  };

  if (bearbeitenId) {
    // 🛠️ Produkt bearbeiten (PUT)
    fetch(`http://localhost:8080/api/items/${bearbeitenId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(produkt)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Bearbeiten fehlgeschlagen");
      }
      return response.json();
    })
    .then(() => {
      ladeStatistik();
      location.reload();
    })
    .catch(fehler => {
      console.error("Fehler beim Bearbeiten:", fehler);
    });

  } else {
    // ➕ Neues Produkt hinzufügen (POST)
    fetch('http://localhost:8080/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(produkt)
    })
    .then(response => response.json())
    .then(produkt => {
      const tabelle = document.getElementById('produkt-tabelle');
      const zeile = document.createElement('tr');
      zeile.setAttribute('data-id', produkt.id);

      zeile.innerHTML = `
        <td><input type="checkbox" class="auswahl-checkbox" data-id="${produkt.id}"></td>
        <td>${produkt.name}</td>
        <td>${produkt.artikelnummer}</td>
        <td>${produkt.beschreibung}</td>
        <td>${produkt.menge}</td>
        <td>${produkt.lager}</td>
      `;

      tabelle.appendChild(zeile);
      document.getElementById('produkt-formular').reset();

      formularButton.textContent = "Hinzufügen";
      formularButton.removeAttribute('data-bearbeiten-id');
      ladeStatistik();
    })
    .catch(fehler => console.error("Fehler beim Hinzufügen:", fehler));
  }
});


// Bearbeiten-Knopf: Produktdaten ins Formular laden
document.getElementById('bearbeiten-auswahl').addEventListener('click', () => {
  const checkboxen = document.querySelectorAll('.auswahl-checkbox:checked');
  
  if (checkboxen.length !== 1) {
    alert("Bitte genau ein Produkt auswählen, das bearbeitet werden soll.");
    return;
  }

  const produktId = checkboxen[0].getAttribute('data-id');
  const zeile = document.querySelector(`tr[data-id="${produktId}"]`);
  if (!zeile) return;
  ladeStatistik();

  // Daten aus der Zeile extrahieren
  const zellen = zeile.querySelectorAll('td');
  const name = zellen[1].innerText;
  const artikelnummer = zellen[2].innerText;
  const beschreibung = zellen[3].innerText;
  const menge = zellen[4].innerText;
  const lager = zellen[5].innerText;
document.getElementById('lager').value = lager;

  // Daten ins Formular einfügen
  document.getElementById('name').value = name;
  document.getElementById('artikelnummer').value = artikelnummer;
  document.getElementById('beschreibung').value = beschreibung;
  document.getElementById('menge').value = menge;

  // Button auf "Aktualisieren" umstellen
  const formular = document.getElementById('produkt-formular');
  const button = formular.querySelector('button');
  button.textContent = "Aktualisieren";
  button.setAttribute('data-bearbeiten-id', produktId);
});
// Zugang (Menge +1)
document.getElementById('zugang-button').addEventListener('click', () => {
  const ausgewählteCheckboxen = document.querySelectorAll('.auswahl-checkbox:checked');
  if (ausgewählteCheckboxen.length === 0) {
    alert("Bitte mindestens ein Produkt auswählen.");
    return;
  }

  const promises = Array.from(ausgewählteCheckboxen).map(cb => {
    const id = cb.getAttribute('data-id');
    return fetch(`http://localhost:8080/api/items/${id}/zugang`, {
      method: 'PUT'
    });
  });

  Promise.all(promises)
    .then(() => location.reload())
    .catch(err => console.error("Fehler beim Zugang:", err));
});
// Abgang (Menge -1)
document.getElementById('abgang-button').addEventListener('click', () => {
  const ausgewählteCheckboxen = document.querySelectorAll('.auswahl-checkbox:checked');
  if (ausgewählteCheckboxen.length === 0) {
    alert("Bitte mindestens ein Produkt auswählen.");
    return;
  }

  const promises = Array.from(ausgewählteCheckboxen).map(cb => {
    const id = cb.getAttribute('data-id');
    return fetch(`http://localhost:8080/api/items/${id}/abgang`, {
      method: 'PUT'
    });
  });

  Promise.all(promises)
    .then(() => location.reload())
    .catch(err => console.error("Fehler beim Abgang:", err));
});


// 🔍 Produktsuche nach Name oder Artikelnummer
document.getElementById('suche').addEventListener('input', function () {
  const filter = this.value.toLowerCase();
  const zeilen = document.querySelectorAll('#produkt-tabelle tr');

  zeilen.forEach(zeile => {
    const name = zeile.cells[1]?.innerText.toLowerCase() || "";
    const artikelnummer = zeile.cells[2]?.innerText.toLowerCase() || "";

    if (name.includes(filter) || artikelnummer.includes(filter)) {
      zeile.style.display = "";
    } else {
      zeile.style.display = "none";
    }
  });
});

// 📊 Statistiken laden
fetch('http://localhost:8080/api/statistik')
  .then(res => res.json())
  .then(data => {
    document.getElementById('gesamt-produkte').textContent = data.gesamtProdukte;
    document.getElementById('gesamt-menge').textContent = data.gesamtMenge;
    document.getElementById('top-produkt').textContent = data.topProdukt;
  })
  .catch(err => console.error("Fehler beim Laden der Statistik:", err
  ));

  function ladeStatistik() {
    fetch('http://localhost:8080/api/statistik')
      .then(res => res.json())
      .then(data => {
        document.getElementById('gesamt-produkte').textContent = data.gesamtProdukte;
        document.getElementById('gesamt-menge').textContent = data.gesamtMenge;
        document.getElementById('top-produkt').textContent = data.topProdukt;
      })
      .catch(err => console.error("Fehler beim Laden der Statistik:", err));
  }
  function ladeApp() {
    ladeStatistik(); // ha van
    // ide jöhet a táblázat betöltés, form események stb.
  
    if (localStorage.getItem("rolle") === "user") {
      // Csak az admin láthat bizonyos gombokat
      document.getElementById("geloeschte-auswahl").style.display = "none";
      document.getElementById("bearbeiten-auswahl").style.display = "none";
      document.getElementById("zugang-button").style.display = "none";
      document.getElementById("abgang-button").style.display = "none";
    }
  
    // ... itt mehet a fetch a termékekhez stb.
  }
  