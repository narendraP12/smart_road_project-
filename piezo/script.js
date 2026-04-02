const channelID = "3317755";
const readKey = "U7YQ0MLDRE22B2AS";
const tsUrl = `https://api.thingspeak.com/channels/${channelID}/fields/1.json?api_key=${readKey}&results=10`;

const ctx = document.getElementById('liveChart').getContext('2d');
let myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Vibration Power (mW)',
            data: [],
            borderColor: '#00ff88',
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
            fill: true,
            tension: 0.4
        }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});

async function updateData() {
    try {
        const response = await fetch(tsUrl);
        const data = await response.json();
        if(data && data.feeds.length > 0) {
            let feeds = data.feeds;
            let lastVal = parseFloat(feeds[feeds.length-1].field1) || 0;

            // Updates
            document.getElementById('live-p').innerText = lastVal.toFixed(2);
            document.getElementById('total-j').innerText = (lastVal * 0.002).toFixed(3);
            document.getElementById('peak-v').innerText = (lastVal / 120).toFixed(1);

            myChart.data.labels = feeds.map(f => new Date(f.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
            myChart.data.datasets[0].data = feeds.map(f => parseFloat(f.field1));
            myChart.update();
        }
    } catch (e) { console.log("Waiting for data..."); }
}

setInterval(updateData, 15000);
updateData();