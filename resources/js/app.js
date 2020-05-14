//Selecting all elements

const country_name_element = document.querySelector('.country .name');
const total_cases_element = document.querySelector('.total-cases .value');
const new_cases_element = document.querySelector('.total-cases .new-value');
const recovered_element = document.querySelector('.recovered .value');
const new_recovered_element = document.querySelector('.recovered .new-value');
const deaths_element = document.querySelector('.deaths .value');
const new_deaths_element = document.querySelector('.deaths .new-value');

const ctx = document.getElementById('axes_line_chart').getContext('2d');

//App variable
let app_data = [],
    cases_list = [],
    recovered_list = [],
    deaths_list = [];

//Getting users country code
let country_code = geoplugin_countryCode()
let user_country;
country_list.forEach(country => {
    if (country.code == country_code) {
        user_country = country.name;
    }
})

console.log(user_country)



function fetchData(user_country) {

    fetch(`https://covid19-monitor-pro.p.rapidapi.com/coronavirus/cases_by_days_by_country.php?country=${user_country}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "covid19-monitor-pro.p.rapidapi.com",
                "x-rapidapi-key": "7e269ec140msh8a5df9cfc21b4b4p1c1e3ejsn9aba26afc6e0"
            }
        }).then(response => {
            return response.json();
        }).then(data => {

            console.log(data);
            dates = Object.keys(data);
            //console.log(dates)

            dates.forEach(date => {
                let DATA = data[date];
                app_data.push(DATA);
                cases_list.push(parseInt(DATA.total_cases.replace(/,/g, "")));
                recovered_list.push(parseInt(DATA.total_recovered.replace(/,/g, "")));
                deaths_list.push(parseInt(DATA.total_deaths.replace(/,/g, "")));

            });
        }).then(() => {
            updateUI();
        })
        .catch(error => {
            alert(error);
        })
}

fetchData(user_country)

//Function which Updates UI 
function updateUI() {
    updateStats();
    updateAxisChar();

}
//Updating todays statistics
function updateStats() {
    let last_entry = app_data[app_data.length - 1];
    let before_last_entry = app_data[app_data.length - 2];

    console.log(last_entry);
    console.log(before_last_entry);

    country_name_element.innerHTML = last_entry.country_name;

    total_cases_element.innerHTML = last_entry.total_cases || 0;
    new_cases_element.innerHTML = `+${last_entry.new_cases || 0}`;

    recovered_element.innerHTML = last_entry.total_recovered || 0;
    new_recovered_element.innerHTML = `+${parseInt(last_entry.total_recovered.replace(/,/g,""))- parseInt(before_last_entry.total_recovered.replace(/,/g,""))}`;

    deaths_element.innerHTML = last_entry.total_deaths;
    new_deaths_element.innerHTML = `+${last_entry.new_deaths||0}`;

}

let my_chart;
//Function which updated chart
function updateAxisChar() {
    my_chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'First dataset',
                data: [0, 20, 40, 50]
            }],
            labels: ['January', 'February', 'March', 'April']
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: 50,
                        suggestedMax: 100
                    }
                }]
            }
        }
    })
};