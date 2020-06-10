//Mia API http://157.230.17.132:4014/sales

$(document).ready(function() {
    $.ajax({
        url : "http://157.230.17.132:4014/sales",
        method : "GET",
        success: function(array_vendite) {
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
            for (var i = 0; i < array_vendite.length; i++) {
                var sale_date = moment(array_vendite[i].date, "DD/MM/YYYY");
                var sale_date_month = sale_date.format("MMMM");

                //In base al mese aggiorno la proprietà relativa nell'oggetto delle vendite totali per mese
                salesByMonth[sale_date_month] += array_vendite[i].amount;
            }

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

            var totalSalesByEmployee = {};
            var tot_amount = 0;

            //Tramite ciclo for costruisco un oggetto con le vendite totali divise per venditore e il totale del fatturato
            for (var i = 0; i < array_vendite.length; i++) {
                //verifico se il venditore è già nella lista e aggiorno l'oggetto vendite per impiegato di conseguenza
                if (totalSalesByEmployee.hasOwnProperty(array_vendite[i].salesman)) {
                    totalSalesByEmployee[array_vendite[i].salesman] += array_vendite[i].amount;
                } else {
                    totalSalesByEmployee[array_vendite[i].salesman] = array_vendite[i].amount;
                }
                //Aggiorno il conteggio del totale
                tot_amount += array_vendite[i].amount;
            }

            //Creo un oggetto con le percentuali di vendita (vendita dell'impiegato/totale vendite)
            var relativeSalesByEmployee = {};

            for (x in totalSalesByEmployee) {
                var name = x;
                var personal_sales = totalSalesByEmployee[x];
                relativeSalesByEmployee[name] = (personal_sales / tot_amount);
            }

            //Genero il secondo grafico, a torta con la divisione percentuale delle vendite dei singoli impiegati
            var ctx2 = document.getElementById('chart-two').getContext('2d');
            var myChart = new Chart(ctx2, {
                type: 'pie',
                data: {
                    labels: Object.keys(relativeSalesByEmployee),
                    datasets: [{
                        label: '# of Sales',
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
            },
        error : function() {
            alert("Non funziona ajax");
        }
    })



















    //Primo grafico con andamento totale vendite, stile line

    //Secondo grafico con contributi vendita per venditore nel 2017, in percentuale (fatturato venditore/fatturato totale)

})
