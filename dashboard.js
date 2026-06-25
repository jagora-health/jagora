var allVisits = [];
var shownVisits = [];
var sortedCbds = [];
var sortColumn = 'counselled';
var sortAsc = false;
var wardFilter = 'all';
function getLoggedInUser() {
    var params = new URLSearchParams(window.location.search);
    return params.get('user') || 'sani.yusuf.bauchi.state_team';
}

var currentUser = getLoggedInUser();
var currentRole = currentUser.split('.').pop();
var currentScope = currentUser.split('.')[2];

function scopeVisits(visits) {
    if (currentRole === 'ward_lead') {
        return visits.filter(function(v) {
            return v.ward.toLowerCase().indexOf(currentScope) === 0;
        });
    }
    if (currentRole === 'lga_lead') {
        return visits.filter(function(v) {
            return v.lga.toLowerCase() === currentScope;
        });
    }
    return visits; // state_team and admin see everything
}

function showRoleLabel() {
    var roleNames = {
        'ward_lead': 'Ward Lead',
        'lga_lead': 'LGA Lead',
        'state_team': 'State Team',
        'admin': 'Administrator'
    };
    var label = roleNames[currentRole] || currentRole;
    document.getElementById('roleLabel').innerHTML =
        label + ' · ' + currentScope +
        '  |  <span class="signout" onclick="signOut()">Sign out</span>';
}

function signOut() {
    window.location.href = 'index.html';
}

function countBy(visits, dimension, field) {
    var result = {};
    for (var i = 0; i < visits.length; i++) {
        var key = visits[i][dimension];
        if (!result[key]) { result[key] = 0; }
        result[key] += (field ? visits[i][field] : 1);
    }
    return result;
}
function showCbdDetail(index) {
    var c = sortedCbds[index];
    var last = (c.lastActive === 0) ? 'Today' :
               c.lastActive + (c.lastActive === 1 ? ' day ago' : ' days ago');

    var html =
        '<h2>' + c.name + '</h2>' +
        '<p class="detailWard">' + c.ward + ' ward, Bauchi</p>' +
        '<div class="detailStats">' +
            detailStat(c.counselled, 'Counselled') +
            detailStat(c.children, 'Children') +
            detailStat(c.referred, 'Referred') +
        '</div>' +
        '<p class="detailMeta">Last active: ' + last + '</p>' +
        '<h3>Settlements covered</h3>' +
        '<p>' + cbdSettlements(c) + '</p>' +
        '<h3>Questions recorded</h3>' +
        '<p>' + cbdQuestions(c) + '</p>';

    document.getElementById('cbdDetailContent').innerHTML = html;
    document.getElementById('cbdDetail').classList.remove('hidden');
}

function detailStat(value, label) {
    return '<div class="detailStatBox"><div class="detailStatValue">' + value +
           '</div><div class="detailStatLabel">' + label + '</div></div>';
}

function cbdSettlements(c) {
    var pool = ['Majidadi', 'Gwallaga', 'Miri', 'Zungur', 'Dorawar Dillalai', 'Yelwa', 'Galambi'];
    var n = Math.floor(Math.random() * 3) + 2;
    var picked = [];
    for (var i = 0; i < n; i++) {
        picked.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    return picked.join(', ');
}

function cbdQuestions(c) {
    if (c.referred < 5) { return 'No questions recorded this period.'; }
    return '“Za a iya bayar da shi tare da nonon uwa?” — pending review';
}

function closeCbdDetail() {
    document.getElementById('cbdDetail').classList.add('hidden');
}
function generateVisits() {
    var cbds = [
        'ahmad.nasir.bau.campaigner', 'musa.ibrahim.makama.campaigner',
        'sani.yusuf.birshi.campaigner', 'aisha.bello.zungur.campaigner',
        'fatima.sani.galambi.campaigner', 'ibrahim.sule.majidadi.campaigner',
        'hauwa.lawan.mun.campaigner', 'yusuf.adamu.dandango.campaigner',
        'zainab.haruna.kundum.campaigner', 'bello.tanko.kangyare.campaigner',
        'maryam.danjuma.daniya.campaigner', 'usman.aliyu.bau.campaigner',
        'halima.shehu.makama.campaigner', 'sadiq.bala.birshi.campaigner',
        'amina.umar.zungur.campaigner', 'garba.gambo.galambi.campaigner',
        'rakiya.iliya.majidadi.campaigner', 'nuhu.maina.mun.campaigner',
        'saratu.dauda.dandango.campaigner', 'kabiru.audu.kundum.campaigner'
    ];
    var months = ['2026-01', '2026-02', '2026-03'];
    var visits = [];
    for (var i = 0; i < seed.settlements.length; i++) {
        var s = seed.settlements[i];
        for (var j = 0; j < 12; j++) {
            var jitterLat = (Math.random() - 0.5) * 0.02;
            var jitterLng = (Math.random() - 0.5) * 0.02;
            var isReferral = Math.random() < 0.15;
            var month = months[Math.floor(Math.random() * months.length)];
            var day = Math.floor(Math.random() * 28) + 1;
            var dayStr = (day < 10) ? '0' + day : '' + day;
            visits.push({
                settlement: s.name,
                ward: seed.wards[i % seed.wards.length],
                lga: (i < 6) ? 'Bauchi' : 'Toro',
                lat: s.lat + jitterLat,
                lng: s.lng + jitterLng,
                type: isReferral ? 'referral' : 'counselled',
                children: Math.floor(Math.random() * 3) + 1,
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
var coverageChartObj;

function buildCoverageChart() {
    var dimension = (currentRole === 'state_team' || currentRole === 'admin') ? 'lga' : 'ward';
    var counts = countBy(shownVisits, dimension);

    var labels = Object.keys(counts);
    var data = [];
    for (var i = 0; i < labels.length; i++) {
        data.push(counts[labels[i]]);
    }

    if (coverageChartObj) { coverageChartObj.destroy(); }
    coverageChartObj = new Chart(document.getElementById('coverageChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{ label: 'Visits', data: data, backgroundColor: '#0f766e' }]
        },
        options: { indexAxis: 'y', plugins: { legend: { display: false } } }
    });
}

var funnelChartObj;

function buildFunnelChart() {
    var childrenChecked = 0, referred = 0;
    for (var i = 0; i < shownVisits.length; i++) {
        childrenChecked += shownVisits[i].children;
        if (shownVisits[i].type === 'referral') { referred++; }
    }
    var diarrhoea = Math.round(childrenChecked * 0.28);

    if (funnelChartObj) { funnelChartObj.destroy(); }

    funnelChartObj = new Chart(document.getElementById('funnelChart'), {
        type: 'bar',
        data: {
            labels: ['Children checked', 'Diarrhoea cases', 'Referred'],
            datasets: [{
                data: [childrenChecked, diarrhoea, referred],
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
    buildCoverageChart();
    buildFunnelChart();
    buildCbdTable();
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
    var stats = {};
    for (var i = 0; i < shownVisits.length; i++) {
        var v = shownVisits[i];
        if (!stats[v.cbd]) {
            stats[v.cbd] = { cbd: v.cbd, ward: v.ward, counselled: 0, children: 0, referred: 0 };
        }
        if (v.type === 'referral') { stats[v.cbd].referred++; }
        else { stats[v.cbd].counselled++; }
        stats[v.cbd].children += v.children;
    }

    var cbds = [];
    for (var key in stats) {
        var s = stats[key];
        s.name = seed.cbdNames[key] || key;
        cbds.push(s);
    }

    if (wardFilter !== 'all') {
        cbds = cbds.filter(function(c) { return c.ward === wardFilter; });
    }

    cbds.sort(function(a, b) {
        var av = a[sortColumn], bv = b[sortColumn];
        if (typeof av === 'string') {
            return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
        }
        return sortAsc ? av - bv : bv - av;
    });

    var cols = [
        { key: 'name', label: 'CBD' },
        { key: 'ward', label: 'Ward' },
        { key: 'counselled', label: 'Counselled' },
        { key: 'children', label: 'Children' },
        { key: 'referred', label: 'Referred' }
    ];

    var html = '<table class="cbdTable"><thead><tr>';
    for (var h = 0; h < cols.length; h++) {
        var arrow = (sortColumn === cols[h].key) ? (sortAsc ? ' ▲' : ' ▼') : '';
        html += '<th onclick="sortBy(\'' + cols[h].key + '\')">' + cols[h].label + arrow + '</th>';
    }
    html += '</tr></thead><tbody>';

    for (var i = 0; i < cbds.length; i++) {
        var c = cbds[i];
        html += '<tr onclick="showCbdDetail(' + i + ')">' +
            '<td>' + c.name + '</td><td>' + c.ward + '</td>' +
            '<td>' + c.counselled + '</td><td>' + c.children + '</td>' +
            '<td>' + c.referred + '</td></tr>';
    }
    html += '</tbody></table>';
    document.getElementById('cbdTable').innerHTML = html;

    sortedCbds = cbds;
}
function sortBy(column) {
    if (sortColumn === column) {
        sortAsc = !sortAsc;
    } else {
        sortColumn = column;
        sortAsc = false;
    }
    buildCbdTable();
}

function setWardFilter() {
    wardFilter = document.getElementById('wardSelect').value;
    buildCbdTable();
}
function buildReviewList() {
    var container = document.getElementById('reviewList');
    var html = '';
    for (var i = 0; i < seed.reviewQuestions.length; i++) {
        var item = seed.reviewQuestions[i];
        var badge = '<span class="badge badge-' + item.status + '">' + item.status + '</span>';
        var actions = '';
        if (item.status === 'pending') {
            actions =
                '<button class="approveBtn" onclick="reviewAction(' + item.id + ', \'approved\')">Approve</button>' +
                '<button class="rejectBtn" onclick="reviewAction(' + item.id + ', \'rejected\')">Reject</button>';
        } else if (item.status === 'approved') {
            actions = '<span class="pipelineNote">→ becoming an FAQ entry</span>';
        }
        html +=
            '<div class="reviewItem">' +
                '<div class="reviewQ">' +
                    '<button class="playBtn" onclick="alert(\'Playing recorded question (Hausa)\')">▶</button>' +
                    '<span>' + item.q + '</span>' +
                '</div>' +
                '<div class="reviewMeta">' + item.cbd + ' · ' + item.settlement + ' · ' + item.date + ' ' + badge + '</div>' +
                '<div class="reviewActions">' + actions + '</div>' +
            '</div>';
    }
    container.innerHTML = html;
}

function fillWardSelect() {
    var sel = document.getElementById('wardSelect');
    if (!sel) { return; }
    var html = '<option value="all">All wards</option>';
    for (var i = 0; i < seed.wards.length; i++) {
        html += '<option value="' + seed.wards[i] + '">' + seed.wards[i] + '</option>';
    }
    sel.innerHTML = html;
}
function reviewAction(id, decision) {
    for (var i = 0; i < seed.reviewQuestions.length; i++) {
        if (seed.reviewQuestions[i].id === id) {
            seed.reviewQuestions[i].status = decision;
        }
    }
    buildReviewList();
}
allVisits = scopeVisits(generateVisits());
shownVisits = allVisits;
var allCbds = generateCbds();

fillWardSelect();
updateStatsFromShown();
buildReferralCallout();
buildCoverageChart();
buildFunnelChart();
buildMap();
buildCbdTable();
buildReviewList();
showRoleLabel();