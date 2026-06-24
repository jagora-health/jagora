var allVisits = [];
var shownVisits = [];
var sortedCbds = [];
function showCbdDetail(index) {
    var c = sortedCbds[index];
    alert(c.name + ' — ' + c.ward + '\n' +
          c.counselled + ' counselled, ' + c.referred + ' referred');
}
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
function generateCbds() {
    var firstNames = ['Ahmad','Musa','Aisha','Fatima','Sani','Ibrahim','Hauwa','Yusuf',
                      'Zainab','Bello','Maryam','Usman','Halima','Sadiq','Amina','Garba',
                      'Rakiya','Nuhu','Saratu','Kabiru','Hadiza','Idris'];
    var lastNames = ['Nasir','Ibrahim','Bello','Sani','Yusuf','Abubakar','Sule','Lawan',
                     'Adamu','Haruna','Tanko','Danjuma','Aliyu','Shehu','Bala','Umar',
                     'Gambo','Iliya','Maina','Dauda','Audu','Jibril'];
    var cbds = [];
    for (var i = 0; i < 22; i++) {
        var ward = seed.wards[i % seed.wards.length];
        var counselled = Math.floor(Math.random() * 180) + 40;
        var children = counselled + Math.floor(Math.random() * 90);
        var referred = Math.floor(Math.random() * 18);
        var lastDays = Math.floor(Math.random() * 14);
        cbds.push({
            name: firstNames[i] + ' ' + lastNames[i],
            ward: ward,
            counselled: counselled,
            children: children,
            referred: referred,
            lastActive: lastDays
        });
    }
    return cbds;
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

var mapObject;
var mapMarkers = [];

function buildMap() {
    mapObject = L.map('map').setView([10.31, 9.84], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(mapObject);
    drawMarkers();
}

function drawMarkers() {
    for (var i = 0; i < mapMarkers.length; i++) {
        mapObject.removeLayer(mapMarkers[i]);
    }
    mapMarkers = [];

    for (var i = 0; i < shownVisits.length; i++) {
        var v = shownVisits[i];
        var color = (v.type === 'referral') ? '#f59e0b' : '#0f766e';
        var marker = L.circleMarker([v.lat, v.lng], {
            radius: 9,
            color: color,
            fillColor: color,
            fillOpacity: 0.8
        }).addTo(mapObject).bindPopup(
            '<b>' + v.settlement + '</b><br>' + v.type + '<br>CBD: ' + v.cbd
        );
        mapMarkers.push(marker);
    }
}
function applyFilter(period) {
    if (period === 'all') {
        shownVisits = allVisits;
        document.getElementById('filterStatus').textContent = 'Showing: all time';
    } else {
        shownVisits = allVisits.filter(function(v) {
            return v.date.indexOf(period) === 0;
        });
        document.getElementById('filterStatus').textContent = 'Showing: ' + period;
    }
    refreshPanels();
}

function applyCustomFilter() {
    var from = document.getElementById('fromDate').value;
    var to = document.getElementById('toDate').value;
    if (!from || !to) {
        document.getElementById('filterStatus').textContent = 'Pick both dates';
        return;
    }
    shownVisits = allVisits.filter(function(v) {
        return v.date >= from && v.date <= to;
    });
    document.getElementById('filterStatus').textContent = 'Showing: ' + from + ' to ' + to;
    refreshPanels();
}
function refreshPanels() {
    drawMarkers();
    updateStatsFromShown();
}

function updateStatsFromShown() {
    var counselled = 0, referred = 0;
    var cbdSet = {};
    for (var i = 0; i < shownVisits.length; i++) {
        var v = shownVisits[i];
        if (v.type === 'referral') { referred++; }
        else { counselled++; }
        cbdSet[v.cbd] = true;
    }
    var activeCbds = Object.keys(cbdSet).length;

    var row = document.getElementById('statRow');
    row.innerHTML =
        statCardHtml(counselled, 'Caregivers counselled', 'teal') +
        statCardHtml(shownVisits.length, 'Visits in period', 'teal') +
        statCardHtml(referred, 'Referrals made', 'amber') +
        statCardHtml(activeCbds, 'Active CBDs', 'teal');
}

function statCardHtml(value, label, accent) {
    return '<div class="statCard ' + accent + '">' +
        '<div class="statValue">' + value.toLocaleString() + '</div>' +
        '<div class="statLabel">' + label + '</div></div>';
}
function buildCbdTable() {
    var cbds = allCbds.slice();
    cbds.sort(function(a, b) { return b.counselled - a.counselled; });

    var html = '<table class="cbdTable"><thead><tr>' +
        '<th>CBD</th><th>Ward</th><th>Counselled</th>' +
        '<th>Children</th><th>Referred</th><th>Last active</th>' +
        '</tr></thead><tbody>';

    for (var i = 0; i < cbds.length; i++) {
        var c = cbds[i];
        var last = (c.lastActive === 0) ? 'Today' : c.lastActive + ' days ago';
        var stale = (c.lastActive > 7) ? ' class="stale"' : '';
        html += '<tr onclick="showCbdDetail(' + i + ')"' + stale + '>' +
            '<td>' + c.name + '</td>' +
            '<td>' + c.ward + '</td>' +
            '<td>' + c.counselled + '</td>' +
            '<td>' + c.children + '</td>' +
            '<td>' + c.referred + '</td>' +
            '<td>' + last + '</td></tr>';
    }
    html += '</tbody></table>';
    document.getElementById('cbdTable').innerHTML = html;

    sortedCbds = cbds;
}
allVisits = generateVisits();
shownVisits = allVisits;
var allCbds = generateCbds();

updateStatsFromShown();
buildReferralCallout();
buildCoverageChart();
buildFunnelChart();
buildMap();
buildCbdTable();