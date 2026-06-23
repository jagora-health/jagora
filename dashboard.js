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

buildStatCards();
buildReferralCallout();
buildCoverageChart();
buildFunnelChart();