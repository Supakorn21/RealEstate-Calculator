// ประกาศ state ของ form(HTML)
let state = {
    price: getNumber(document.querySelectorAll('[name="price"]')[0].value),
    loan_years: document.querySelectorAll('[name="loan_years"]')[0].value,
    down_payment: document.querySelectorAll('[name="down_payment"]')[0].value,
    interest_rate: document.querySelectorAll('[name="interest_rate"]')[0].value,
    property_tax: document.querySelectorAll('[name="property_tax"]')[0].value,
    home_insurance: document.querySelectorAll('[name="home_insurance"]')[0].value,
    hoa: document.querySelectorAll('[name="hoa"]')[0].value,
}

// ประกาศ variables
let totalLoan,
totalMonths,
mothlyInterest,
monthlyPrincipalInterest,
monthlyPropertyTaxes,
monthlyHomeInsurance,
monthlyHOA,
monthlyTotal,
labels = ["Principal & Interest", "Property Tax", "Home Insurance", "HOA"],
backgroundColor = [
    'rgb(255, 99, 132, 1)',
    'rgb(54, 162, 235, 1)',
    'rgb(255, 205, 86, 1)',
    'rgb(75, 192, 192, 1)',
    'rgb(153, 102, 255, 1)',
    'rgb(255, 159, 64, 1)',
  ];
borderColor = [
    'rgb(255, 99, 132, 1)',
    'rgb(54, 162, 235, 1)',
    'rgb(255, 205, 86, 1)',
    'rgb(75, 192, 192, 1)',
    'rgb(153, 102, 255, 1)',
    'rgb(255, 159, 64, 1)',
  ];



// เอาตัวอักษรอื่นที่ไม่ใช่ตัวเลขออก (เอาแค่ตัวเลขอย่างเดียว)
function getNumber(str){
    return Number(str.replace(/\D+/g,""))
}

// เอามาจาก library Chart.js แล้วใส่ varable backgroundColor, กับ borderColor, labels, 'doughnut' ลงไป
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: labels,
        datasets: [{
            label: '# of Votes',
            data: [
                monthlyPrincipalInterest,
                monthlyPropertyTaxes,
                monthlyHomeInsurance,
                monthlyHOA
            ],
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1
        }]
    },
});
myChart.options.animation = false;

// เพิ่ม event listener ใน input
let i;
// ประกาศ InputTexts โดยใช่คลาส form-group__textInput จากนั้นสร้างลูปเพื่อให้เกิดการเปลี่ยนแปลงแบบ real-time
let inputTexts = document.getElementsByClassName('form-group__textInput');
for (i = 0; i < inputTexts.length; i++){
    inputTexts[i].addEventListener('input', updateInputsState)
}
let inputSlides = document.getElementsByClassName('form-group__range-slide');
for (i = 0; i < inputSlides.length; i++){
    inputSlides[i].addEventListener('input', updateInputsState)
}

function updateInputsState(event){
    let name = event.target.name;
    let value = event.target.value;
    if(name == 'price'){
        value = getNumber(value);
    }
    if(event.target.type == 'range'){
        let total = (document.getElementsByClassName(`total__${name}`))[0].innerHTML = `${value}`
    }
    state = {
        ... state,
        [name]: value
    }
    calculateData()
}

document.getElementsByTagName('form')[0].addEventListener('submit', (event) => {
    event.preventDefault();
    document.getElementsByClassName('mg-page__right')[0].classList.add('mg-page__right--animate')
    calculateData()
})

function calculateData(){
    totalLoan = state.price - (state.price * (state.down_payment / 100));
    totalMonths = state.loan_years * 12;
    monthlyInterest = (state.interest_rate / 100) / 12;
    monthlyPrincipalInterest = (
        totalLoan * 
        (
            (monthlyInterest * ((1 + monthlyInterest) ** totalMonths) / ((1+ monthlyInterest) ** totalMonths - 1) 
            )
        )
    ).toFixed(2)
    monthlyPropertyTaxes = (
        (state.price * (state.property_tax / 100)) 
        / 12
    ).toFixed(2);
    monthlyHomeInsurance = state.home_insurance / 12;
    monthlyHOA = state.hoa / 12;
    monthlyTotal = 
        parseFloat(monthlyPrincipalInterest) +
        parseFloat(monthlyPropertyTaxes) +
        parseFloat(monthlyHomeInsurance) + 
        parseFloat(monthlyHOA);

        document.getElementsByClassName('info__numbers--principal')[0].innerHTML = parseFloat(monthlyPrincipalInterest).toFixed(2);
        document.getElementsByClassName('info__numbers--property_taxes')[0].innerHTML = parseFloat(monthlyPropertyTaxes).toFixed(2);
        document.getElementsByClassName('info__numbers--home_insurance')[0].innerHTML = parseFloat(monthlyHomeInsurance).toFixed(2);
        document.getElementsByClassName('info__numbers--hoa')[0].innerHTML = parseFloat(monthlyHOA).toFixed(2);
        document.getElementsByClassName('info__numbers--total')[0].innerHTML = monthlyTotal.toFixed(2);

        updateChart(myChart, labels, backgroundColor);
}

function updateChart(chart, label, color){
    chart.data.datasets.pop();
    chart.data.datasets.push({
        labels: labels,
        backgroundColor: color,
        data: [
            monthlyPrincipalInterest,
            monthlyPropertyTaxes,
            monthlyHomeInsurance,
            monthlyHOA
        ]
    });
    chart.options.transitions.active.animation.duration = 0;
    chart.update();
}

calculateData();
