import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ValidatorFn
} from '@angular/forms';
import { of } from 'rxjs';
import $ from 'jquery';

@Component({
  selector: 'app-selection-list',
  templateUrl: './selection-list.component.html',
  styleUrls: ['./selection-list.component.css']
})
export class SelectionListComponent implements OnInit {

  //Proprietà del componente
  TodayDate!: string; //Data attuale
  date!: string; // data del datepicker
  form: FormGroup; //form di selezione stato/regioni
  orders:any = []; // lista di regioni inizializzata nel costruttore

  //link dei file JSON
  stato_latest = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale-latest.json"
  regioni_latest = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni-latest.json"
  stato = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json"
  regioni = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json"

  //file JSON
  Stato_latest = this.downloadJSON(this.stato_latest);
  public Stato_Json = this.downloadJSON(this.stato);
  Regioni_latest = this.downloadJSON(this.regioni_latest);
  Regioni = this.downloadJSON(this.regioni);
  /*----------------------------------------------------------------------------------------------------------------------*/

  constructor(private formBuilder: FormBuilder) {
   
    this.form = this.formBuilder.group({
      orders: ['']
    });

    this.getId();
    
  }

  //inizializzazione del componente impostando la data odierna nel datepicker
  ngOnInit(): void {
    $(".Info").click(function(){
      $("#info").slideToggle();
    });
    let date =  new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    (hour >= 17) ? (this.TodayDate = year + "-" + month + "-" + day) : (this.TodayDate = year + "-" + month + "-" + (day-1))
  
    let sel_date = document.querySelector('.date');
    sel_date?.setAttribute("value", this.TodayDate);
  }
    
  //Ottenere il nome della regione
  getId() {

    of(this.getOrders()).subscribe(orders => {
      this.orders = orders;
      this.form.controls.orders.patchValue(this.orders[0].id);
      return this.form.controls.orders.patchValue(this.orders[0].id);
    });

    return this.form.controls.orders.patchValue(this.orders[0].id);
    
  }
  //nomi regioni
  getOrders() {
    return [
      { id: 'Stato', name: 'STATO' },
      { id: 'Abruzzo', name: 'Abruzzo' },
      { id: 'Basilicata', name: 'Basilicata' },
      { id: 'P.A. Bolzano', name: 'Bolzano' },
      { id: 'Calabria', name: 'Calabria' },
      { id: 'Campania', name: 'Campania' },
      { id: 'Emilia-Romagna', name: 'Emilia Romagna' },
      { id: 'Friuli Venezia Giulia', name: 'Friuli Venezia Giulia' },
      { id: 'Lazio', name: 'Lazio' },
      { id: 'Liguria', name: 'Liguria' },
      { id: 'Lombardia', name: 'Lombardia' },
      { id: 'Marche', name: 'Marche' },
      { id: 'Molise', name: 'Molise' },
      { id: 'Piemonte', name: 'Piemonte' },
      { id: 'Puglia', name: 'Puglia' },
      { id: 'Sardegna', name: 'Sardegna' },
      { id: 'Sicilia', name: 'Sicilia' },
      { id: 'Toscana', name: 'Toscana' },
      { id: 'P.A. Trento', name: 'Trento' },
      { id: 'Umbria', name: 'Umbria' },
      { id: "Valle d'Aosta", name: "Valle d'Aosta" },
      { id: 'Veneto', name: 'Veneto' }
    ];
  }
  
  //funzione per scaricare i file JSON
  downloadJSON(repositoryLink:any) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', repositoryLink, false);
    xhr.send();
    if (xhr.status != 200) {
        alert(xhr.status + ': ' + xhr.statusText);
    } else {
        return JSON.parse(xhr.responseText);
    }
}

  //funzione chiamata quando si preme il bottone nella form
  submit() {

    //formatto il file JSON Stato_latest
    let parseArray = this.Stato_latest[this.Stato_latest.length - 1];
    //Seleziono il datepicker
    let sel_date = document.querySelector('.date');

    //se la data del datepicker cambia si attiva l'evento change ed inserisco la nuova data nella proprietà date del componente
    sel_date?.addEventListener('change', (e:any) => 
    {
      this.date = e.target.value;
    });
    
    //elimino l'eventuale tabella esistente
    if(document.getElementById("outTable") != null)
    {
      document.getElementById("outTable")?.remove();
    }

    /*in base al valore di orders e se la data del datepicker è stata cambiata inizio l'output dei dati con la funzione
    parseSubmit() dopo aver creato una tabella dove inserire i dati di output*/
    if(this.form.value.orders == 'Stato')
    {
      if(this.date != null)
      {
        let table = document.createElement("TABLE");
        table.setAttribute("id", "outTable");
        document.getElementById("jsonOutput")?.appendChild(table);

        this.parseSubmit(this.Stato_Json);
      }else
      {
        let table = document.createElement("TABLE");
        table.setAttribute("id", "outTable");
        document.getElementById("jsonOutput")?.appendChild(table);

        this.parseSubmit(parseArray);
      }
    }else if(this.form.value.orders != 'Stato')
    {
      if(this.date != null)
      {
        let table = document.createElement("TABLE");
        table.setAttribute("id", "outTable");
        document.getElementById("jsonOutput")?.appendChild(table);

        this.parseSubmit(this.Regioni);
      }else
      {
        let table = document.createElement("TABLE");
        table.setAttribute("id", "outTable");
        document.getElementById("jsonOutput")?.appendChild(table);
  
        this.parseSubmit(this.Regioni_latest);
      }
    }
  }
  
  //Formattazione dell'output per renderlo maggiormente userfriendly
  parseSubmit(array:any)
  {

    if(this.form.value.orders == 'Stato')
    {
      //array associativo per associare le proprietà dell'oggetto ad un nome più userfriendly
      var stateKeys:any = {"data":'data',"stato":'stato', "ricoverati_con_sintomi":'ricoverati con sintomi', "terapia_intensiva":'terapia intensiva',
      "totale_ospedalizzati":'totale in ospedale', "isolamento_domiciliare":'in isolamento domiciliare', "totale_positivi":'totale positivi', "variazione_totale_positivi":'variazione positivi',
      "nuovi_positivi":'nuovi positivi', "dimessi_guariti":'dimessi guariti', "deceduti":'deceduti', "totale_casi":'totale casi', "tamponi":'totale tamponi',
      "casi_testati":'totale casi testati', "ingressi_terapia_intensiva":'in terapia intensiva', "totale_positivi_test_molecolare":'positivi al molecolare', "totale_positivi_test_antigenico_rapido":'positivi al rapido',
      "tamponi_test_molecolare":'tamponi molecolare', "tamponi_test_antigenico_rapido":'tamponi rapidi'};

      //controllo se la data del datepicker è stata cambiata
      if(this.date != null)
      {
        for(let i = 0; i<array.length; i++) //scorro il file JSON
        { 
          if(this.date == array[i].data.split("T")[0]) //se le date del datepicker e quella dell'oggetto selezionato coincidono
          {
            //con un ciclo scorro tutto l'oggetto creando delle righe per la tabella creata in precedenza
            for(let key in array[i])
            {
              let trow = document.createElement("TR");
              document.getElementById("outTable")?.appendChild(trow);
              //condizione per non visualizzare dati null
              (array[i][key] == null) ? null : trow.innerHTML = stateKeys[key] + ": " + array[i][key];
            }
          }
        }
      }else
      {
        for(let key in array)
        {
          let trow = document.createElement("TR");
          document.getElementById("outTable")?.appendChild(trow);
          array[key] == "" ? null : trow.innerHTML = stateKeys[key] + ": " + array[key];
        }
      }
    }else if(this.form.value.orders != 'Stato') //se il valore di orders è diverso da "Stato" allora è una regione
    {
      var regionKeys:any = {"data":'data',"stato":'stato',"denominazione_regione":'nome regione',
      "ricoverati_con_sintomi":'ricoverati con sintomi', "terapia_intensiva":'terapia intensiva',
      "totale_ospedalizzati":'totale in ospedale', "isolamento_domiciliare":'in isolamento domiciliare', 
      "totale_positivi":'totale positivi',"variazione_totale_positivi":'variazione positivi',"nuovi_positivi":'nuovi positivi',
      "dimessi_guariti":'dimessi guariti',"deceduti":'deceduti', "totale_casi":'totale casi', "tamponi":'totale tamponi',
      "casi_testati":'totale casi testati',"totale_positivi_test_molecolare":'positivi al molecolare', 
      "tamponi_test_molecolare":'tamponi molecolare', "tamponi_test_antigenico_rapido":'tamponi rapidi'};

      if(this.date != null)
      {
        for(let i = 0; i<array.length; i++)
        {
          /*controllo se le date coincidono come in precedenza ma con un ulteriore controllo per verificare la correttezza della 
          regione selezionata*/
          if(this.date == array[i].data.split("T")[0] && array[i].denominazione_regione == this.form.value.orders)
          {
            let regione = array[i];
            for(let key in array[i])
            {
              let trow = document.createElement("TR");
              document.getElementById("outTable")?.appendChild(trow);
              (regione[key] == null || regionKeys[key] == null)? null : trow.innerHTML = regionKeys[key] + ": " + regione[key];
            }
          }
        }
      }else
      {
        for(let i = 0; i< array.length; i++)
        {
          if(array[i].denominazione_regione == this.form.value.orders)
          {
            let regione = array[i];
            for(let key in regione)
            {
              let trow = document.createElement("TR")
              document.getElementById("outTable")?.appendChild(trow);
              (regione[key] == "" || regione[key] == null || regionKeys[key] == null)? null : trow.innerHTML = regionKeys[key] + ": " + regione[key];
            }
          }
        }
      }
    }
  }

}
