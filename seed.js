var seed = {
    lga: 'Bauchi',
    totals: {
        caregiversCounselled: 4820,
        childrenChecked: 7140,
        referralsMade: 386,
        activeCbds: 200
    },
    wards: [
        'Majidadi A', 'Majidadi B', 'Makama/Sarki Baki',
        'Zungur/Liman Katagum', 'Mun/Munsal', 'Dandango/Yamrat',
        'Birshi/Miri', 'Kundum/Durum', 'Kangyare/Turwun', "Dan'iya Hardo"
    ],
    wardCounselled: [612, 548, 503, 470, 458, 442, 431, 405, 248, 205],
    funnel: {
        childrenChecked: 7140,
        diarrhoeaCases: 1980,
        referred: 386
    },
   settlements: [
        { name: 'Majidadi', lat: 10.3158, lng: 9.8442 },
        { name: 'Gwallaga', lat: 10.2987, lng: 9.8501 },
        { name: 'Miri', lat: 10.2745, lng: 9.8123 },
        { name: 'Zungur', lat: 10.2412, lng: 9.9234 },
        { name: 'Bayara', lat: 10.2634, lng: 9.7956 },
        { name: 'Galambi', lat: 10.3501, lng: 9.9412 },
        { name: 'Dorawar Dillalai', lat: 10.3289, lng: 9.8678 },
        { name: 'Yelwa', lat: 10.2856, lng: 9.8234 },
        { name: 'Kangyare', lat: 10.3823, lng: 9.7689 },
        { name: 'Gwallameji', lat: 10.2701, lng: 9.8312 },
        { name: 'Kobi', lat: 10.3067, lng: 9.8389 },
        { name: 'Dandango', lat: 10.3201, lng: 9.8556 }
    ],
   cbdNames: {
        'ahmad.nasir.bau.campaigner': 'Ahmad Nasir',
        'musa.ibrahim.makama.campaigner': 'Musa Ibrahim',
        'sani.yusuf.birshi.campaigner': 'Sani Yusuf',
        'aisha.bello.zungur.campaigner': 'Aisha Bello',
        'fatima.sani.galambi.campaigner': 'Fatima Sani',
        'ibrahim.sule.majidadi.campaigner': 'Ibrahim Sule',
        'hauwa.lawan.mun.campaigner': 'Hauwa Lawan',
        'yusuf.adamu.dandango.campaigner': 'Yusuf Adamu',
        'zainab.haruna.kundum.campaigner': 'Zainab Haruna',
        'bello.tanko.kangyare.campaigner': 'Bello Tanko',
        'maryam.danjuma.daniya.campaigner': 'Maryam Danjuma',
        'usman.aliyu.bau.campaigner': 'Usman Aliyu',
        'halima.shehu.makama.campaigner': 'Halima Shehu',
        'sadiq.bala.birshi.campaigner': 'Sadiq Bala',
        'amina.umar.zungur.campaigner': 'Amina Umar',
        'garba.gambo.galambi.campaigner': 'Garba Gambo',
        'rakiya.iliya.majidadi.campaigner': 'Rakiya Iliya',
        'nuhu.maina.mun.campaigner': 'Nuhu Maina',
        'saratu.dauda.dandango.campaigner': 'Saratu Dauda',
        'kabiru.audu.kundum.campaigner': 'Kabiru Audu'
    },
    reviewQuestions: [
        { id: 1, q: 'Idan yaron yana da zazzabi tare da gudawa fa?', cbd: 'Aisha Bello', settlement: 'Makama', date: '2026-02-18', status: 'pending' },
        { id: 2, q: 'Za a iya hada ORS da ruwan famfo?', cbd: 'Musa Ibrahim', settlement: 'Gwallaga', date: '2026-02-21', status: 'pending' },
        { id: 3, q: 'Sau nawa zan iya bayar da zinc a rana?', cbd: 'Fatima Sani', settlement: 'Galambi', date: '2026-03-02', status: 'pending' },
        { id: 4, q: 'Me zan yi idan yaron ya ki shan ORS?', cbd: 'Ahmad Nasir', settlement: 'Dorawar Dillalai', date: '2026-03-05', status: 'pending' },
        { id: 5, q: 'Shin ana iya bayar da maganin gargajiya tare da ORS?', cbd: 'Sani Yusuf', settlement: 'Miri', date: '2026-03-08', status: 'pending' }
    ]
};