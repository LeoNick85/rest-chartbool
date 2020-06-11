//Mia API http://157.230.17.132:4014/sales

$(document).ready(function() {
    //Preparo i grafici con i dati correnti con chiamata ajax
    printCharts();

    //Al click sul bottone "aggiungi contratto", faccio chiamata post per aggiornare i dati con il nuovo contratto e aggiorno i grafici con i nuovi dati
    $("#add-sales").click(function(){
        addNewContract();
        //Richiamo la funzione dei grafici per rifarli aggiornati
        printCharts();
    })

})

//FUNZIONI

//Funzione per disegnare i grafici dopo chiamata ajax
function printCharts() {
    $.ajax({
        url : "http://157.230.17.132:4014/sales",
        method : "GET",
        success: function(array_vendite) {
            //Calcolo le vendite mese per mese
            var salesByMonth = monthlySales(array_vendite);

            //Costruisco il grafico N-1, sulle vendite mese per mese
            var ctx1 = document.getElementById('chart-one').getContext('2d');
            var myChart = new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: Object.keys(salesByMonth),
                    datasets: [{
                        label: '# of Sales',
                        data: Object.values(salesByMonth),
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)'
                        ],
                        borderColor: [
                            'rgba(153, 102, 255, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });

            //Calcolo le percentuali di vendita per singolo venditore
            var relativeSalesByEmployee = personalSalesPercentage(array_vendite);

            //Genero il secondo grafico, a torta con la divisione percentuale delle vendite dei singoli impiegati
            var ctx2 = document.getElementById('chart-two').getContext('2d');
            var myChart = new Chart(ctx2, {
                type: 'pie',
                data: {
                    labels: Object.keys(relativeSalesByEmployee),
                    datasets: [{
                        label: '% of Sales',
                        data: Object.values(relativeSalesByEmployee),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });

            //Calcolo il numero di vendite divise per quadrimestre
            var salesByQ = numberSalesQ(array_vendite);

            //Genero il terzo grafico con la divisione numero contratti per quadrimestre
            var ctx3 = document.getElementById('chart-three').getContext('2d');
            var myChart = new Chart(ctx3, {
                type: 'bar',
                data: {
                    labels: Object.keys(salesByQ),
                    datasets: [{
                        label: '# of Sales',
                        data: Object.values(salesByQ),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
            },
        error : function() {
            alert("Non funziona ajax");
        }
    })
}

//Funzione per produrre un oggetto con le vendite divise per mese
function monthlySales(vendite) {
    //Elaboro il grafico con andamento totale delle vendite per mese, stile line
    var salesByMonth = {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0
    };

    //Uso un ciclo for per aggiungere via via le singole registrazioni di vendite al mese corrispondente
    for (var i = 0; i < vendite.length; i++) {
        var sale_date = moment(vendite[i].date, "DD/MM/YYYY");
        var sale_date_month = sale_date.format("MMMM");

        //In base al mese aggiorno la proprietà relativa nell'oggetto delle vendite totali per mese
        salesByMonth[sale_date_month] += parseInt(vendite[i].amount);
    }

    return salesByMonth;
}

//Funzione per produrre un oggetto con le percentuali di vendita divisa per venditore
function personalSalesPercentage(vendite) {
    var totalSalesByEmployee = {};
    var tot_amount = 0;

    //Tramite ciclo for costruisco un oggetto con le vendite totali divise per venditore e il totale del fatturato
    for (var i = 0; i < vendite.length; i++) {
        //verifico se il venditore è già nella lista e aggiorno l'oggetto vendite per impiegato di conseguenza
        if (totalSalesByEmployee.hasOwnProperty(vendite[i].salesman)) {
            totalSalesByEmployee[vendite[i].salesman] += parseInt(vendite[i].amount);
        } else {
            totalSalesByEmployee[vendite[i].salesman] = parseInt(vendite[i].amount);
        }
        //Aggiorno il conteggio del totale
        tot_amount += parseInt(vendite[i].amount);
    }

    //Creo un oggetto con le percentuali di vendita (vendita dell'impiegato/totale vendite)
    var relativeSalesByEmployee = {};

    for (x in totalSalesByEmployee) {
        var name = x;
        var personal_sales = totalSalesByEmployee[x];
        relativeSalesByEmployee[name] = (personal_sales / tot_amount * 100).toFixed(1);
    }

    return relativeSalesByEmployee;
}

//Funzione per produrre un oggetto con il numero di contratti divisi per quadrimestre
function numberSalesQ(vendite) {
    //Creo un oggetto per il totale contratti per quadrimestre
    var contractsByQ = {
        Q1: 0,
        Q2: 0,
        Q3: 0,
        Q4: 0
    };

    //Ciclo il database e aggiorno via via il conteggio dei contratti per quadrimestre
    for (var i = 0; i < vendite.length; i++) {
        var contract_date = moment(vendite[i].date, "DD/MM/YYYY");
        var contract_month = contract_date.format("M");

        if (contract_month < 3) {
            contractsByQ.Q1++;
        } else if (contract_month > 3 && contract_month < 7) {
            contractsByQ.Q2++;
        }  else if (contract_month > 6 && contract_month < 10) {
            contractsByQ.Q3++;
        }  else {
            contractsByQ.Q4++;
        }
    }

    return contractsByQ;
}

//Funzione per fare una chiamata POST e inviare i dati del nuovo contratto
function addNewContract() {
    //Recupero i valori che mi interessano dal relativo form nella pagina e costruisco l'oggetto da inviare in post
    var selected_salesman = $("#salesman-selector").val();
    var selected_month = $("#month-selector").val();
    var selected_amount = parseInt($("#amount-selector").val());
    var contract_date = "01/" + selected_month + "/2017";
    var new_contract = {
        salesman: selected_salesman,
        amount: selected_amount,
        date: contract_date
    }

    console.log(new_contract);

    //Uso i valori salvati per fare la chiamata POST
    $.ajax({
            url : "http://157.230.17.132:4014/sales",
            method : "POST",
            data: new_contract,
            success: function(data) {
                console.log(data);
                },
            error : function() {
                alert("Problema in POST");
            }
        })
}
