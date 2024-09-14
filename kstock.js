const stocks = ['AAPL','MSFT','GOOGL','AMZN','PYPL','TSLA','JPM','NVDA','NFLX','DIS']
const Api = "https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata";
async function getData(){
    try{
        var fle = await fetch(Api);
        var dt = await fle.json();
        return dt.stocksStatsData;
    }
    catch(error){
        console.error(error);
        
    }
}
const stock_list = document.querySelector(".stock-list");
var obje

getData().then((data)=>{
    obje = data[0];
    stocks.forEach((key, index) => {
        setTimeout(function() {
            const div = document.createElement("div");
            const btn = document.createElement("button");
            const book_div = document.createElement("div");
            const pro_div = document.createElement("div");
            
            btn.innerHTML = key;
            btn.setAttribute("id",key);
            btn.addEventListener("click",function(e){
                currentstock = `${key}`;
                currentdate = `5y`; 
                newData();
                detaizl();
                
            })
            div.classList.add("item");
            book_div.textContent = `$${obje[key].bookValue.toFixed(3)}`;
            if(obje[key].profit == 0){
                pro_div.style.color ="red";
            }
            pro_div.textContent = `${obje[key].profit.toFixed(2)}%`;
            book_div.classList.add("bookValue");
            pro_div.classList.add("profit");
            
            div.appendChild(btn);
            div.appendChild(book_div);  
            div.appendChild(pro_div);
            stock_list.appendChild(div);
        }, index * 250);
    });
    
})
let stockChart;  

const stockData = {
    value: [156.286773681641, 137.570495605469, 152.641525268555, 147.355728149414, 129.552719116211, 143.871017456055, 146.981979370117, 164.672225952148, 169.445617675781, 177.005172729492, 193.970001220703, 193.130004882813, 192.749298095703],
    timeStamp: [1659326400, 1662004800, 1664596800, 1667275200, 1669870800, 1672549200, 1675227600, 1677646800, 1680321600, 1682913600, 1685592000, 1688184000, 1689963868]
};

function StartData() {
    const labels = stockData.timeStamp.map(ts => new Date(ts * 1000).toLocaleDateString());

    if (stockChart) {
        stockChart.destroy();  // Destroy the existing chart before creating a new one
    }

    const ctx = document.getElementById('stockChart').getContext('2d');
    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'AAPL Stock Price',
                data: stockData.value,
                fill: false,
                borderColor: 'rgba(0, 255, 0, 1)', // Green color for line
                tension: 0.1,
                 
                pointBackgroundColor: 'rgba(0, 0, 0, 0)', 
                pointBorderColor: 'rgba(0, 0, 0, 0)',  // Green color for points
            }]
        },
        options: {
            scales: {
                x: {
                    display: false, // Keep X-axis hidden if desired
                    min: 0, // Start at the first label
                    max: labels.length - 1, // End at the last label
                    ticks: {
                        maxTicksLimit: labels.length, // Increase the number of ticks
                    }
                },
                y: {
                    display: false // Hide Y-axis
                }
            },
            plugins: {
                legend: {
                    display: false // Hide the legend
                },
                tooltip: {
                    enabled: true, // Enable tooltips
                    mode: 'index', // Show tooltip when hovering over the nearest data point
                    intersect: false, // Ensure the tooltip shows even when not directly over the point
                    callbacks: {
                        label: function(tooltipItem) {
                            return  `AAPL : $${tooltipItem.raw.toFixed(2)}`; 
                        }
                    }
                }
            }
        }
    });

    const verticalLine = document.getElementById('verticalLine');
    const chartContainer = document.querySelector('.chart-container');

    chartContainer.addEventListener('mousemove', (event) => {
        const chartArea = stockChart.chartArea;
        const canvasPosition = stockChart.canvas.getBoundingClientRect();
        const x = event.clientX - canvasPosition.left;

        if (x >= chartArea.left && x <= chartArea.right) {
            verticalLine.style.left = `${x}px`;
            verticalLine.style.display = 'block';
        } 
        else {
            verticalLine.style.display = 'none';
        }
    });

    chartContainer.addEventListener('mouseleave', () => {
        verticalLine.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded',function(e){
    newData();
    displaycontent(currentstock);
    
})
var currentstock = "AAPL";
var  currentdate = "5y";
var obj;

const API_pro = "https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata"; 


async function getstockvalue(){
    const raw_data = await fetch(API_pro);
    const data = await raw_data.json();
    return data;

}

function newData(){
    getstockvalue().then((info)=>{
        obj = info["stocksData"][0];
        let innerobj = obj;
        let arr = [currentstock,currentdate];
        for(let i=0;i<2;i++){
            innerobj = innerobj[arr[i]];
        }
        stockData.timeStamp = innerobj.timeStamp;
        stockData.value = innerobj.value;
        StartData();

    })
}
const btn_area = document.querySelector(".btn-area");
btn_area.addEventListener("click",function(e){
    console.log(e.target.id);
    currentdate = e.target.id;
    newData();  
    
})
const nam = document.querySelector(".nam");
const pro = document.querySelector(".pro");
const book = document.querySelector(".book");

function detaizl(){
    nam.innerHTML = currentstock;
    if(obje[currentstock].profit == 0){
        pro.style.color = "red";
    }
    else{
         pro.style.color = "";
    }
    pro.innerHTML = `${obje[currentstock].profit}%`;
    book.innerHTML = $`${obje[currentstock].bookValue}`;
    displaycontent(currentstock);
    console.log("hiiii");
    

}
async function getcontent(){
    const raw = await fetch("https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata");
    const data = await raw.json();
    return data;
    
}
var cont_para = document.querySelector(".para");
var con_obj;
function displaycontent(name){
    getcontent().then((data)=>{
        con_obj = data["stocksProfileData"][0];
        cont_para.textContent = con_obj[name]["summary"];
    })
}