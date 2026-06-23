function generateVisits() {
    var cbds = [
        'ahmad.nasir.bau.campaigner',
        'musa.ibrahim.makama.campaigner',
        'sani.yusuf.birshi.campaigner',
        'aisha.bello.zungur.campaigner',
        'fatima.sani.galambi.campaigner'
    ];
    var months = ['2026-01', '2026-02', '2026-03'];
    var visits = [];
    for (var i = 0; i < seed.settlements.length; i++) {
        var s = seed.settlements[i];
        for (var j = 0; j < 5; j++) {
            var jitterLat = (Math.random() - 0.5) * 0.02;
            var jitterLng = (Math.random() - 0.5) * 0.02;
            var isReferral = Math.random() < 0.15;
            var month = months[Math.floor(Math.random() * months.length)];
            var day = Math.floor(Math.random() * 28) + 1;
            var dayStr = (day < 10) ? '0' + day : '' + day;
            visits.push({
                settlement: s.name,
                lat: s.lat + jitterLat,
                lng: s.lng + jitterLng,
                type: isReferral ? 'referral' : 'counselled',
                cbd: cbds[Math.floor(Math.random() * cbds.length)],
                date: month + '-' + dayStr
            });
        }
    }
    return visits;
}
function buildStatCards() {
    var cards = [
        { label: 'Caregivers counselled', value: seed.totals.caregiversCounselled, accent: 'teal' },
        { label: 'Children checked', value: seed.totals.childrenChecked, accent: 'teal' },
        { label: 'Referrals made', value: seed.totals.referralsMade, accent: 'amber' },
        { label: 'Active CBDs', value: seed.totals.activeCbds, accent: 'teal' }
    ];

    var row = document.getElementById('statRow');
    for (var i = 0; i < cards.length; i++) {
        var c = cards[i];
        var card = document.createElement('div');
        card.className = 'statCard ' + c.accent;
        card.innerHTML =
            '<div class="statValue">' + c.value.toLocaleString() + '</div>' +
            '<div class="statLabel">' + c.label + '</div>';
        row.appendChild(card);
    }
}

function buildReferralCallout() {
    document.getElementById('referralCallout').textContent =
        'For the first time, ' + seed.totals.referralsMade +
        ' referrals tracked with GPS, time, and worker.';
}
function buildCoverageChart() {
    new Chart(document.getElementById('coverageChart'), {
        type: 'bar',
        data: {
            labels: seed.wards,
            datasets: [{
                label: 'Caregivers counselled',
                data: seed.wardCounselled,
                backgroundColor: '#0f766e'
            }]
        },
        options: {
            indexAxis: 'y',
            plugins: { legend: { display: false } }
        }
    });
}

function buildFunnelChart() {
    new Chart(document.getElementById('funnelChart'), {
        type: 'bar',
        data: {
            labels: ['Children checked', 'Diarrhoea cases', 'Referred'],
            datasets: [{
                data: [seed.funnel.childrenChecked, seed.funnel.diarrhoeaCases, seed.funnel.referred],
                backgroundColor: ['#0f766e', '#14b8a6', '#f59e0b']
            }]
        },
        options: { plugins: { legend: { display: false } } }
    });
}

function buildMap() {
    var map = L.map('map').setView([10.31, 9.84], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    var allVisits = generateVisits();
    for (var i = 0; i < allVisits.length; i++) {
        var v = allVisits[i];
        var color = (v.type === 'referral') ? '#f59e0b' : '#0f766e';
        L.circleMarker([v.lat, v.lng], {
            radius: 9,
            color: color,
            fillColor: color,
            fillOpacity: 0.8
        }).addTo(map).bindPopup(
            '<b>' + v.settlement + '</b><br>' +
            v.type + '<br>' +
            'CBD: ' + v.cbd
        );
    }
}

buildStatCards();
buildReferralCallout();
buildCoverageChart();
buildFunnelChart();
buildMap();