// _____________________________________________КОНТАКТНАЯ ФОРМА  __________________________________________________________________________________________________________

var input = document.querySelector("#formPhone");
window.intlTelInput(input, {
    initialCountry: "auto",
    geoIpLookup: function(callback) {
        fetch('https://ipinfo.io/json', { headers: { 'Accept': 'application/json' }})
            .then((resp) => resp.json())
            .then((resp) => {
                var countryCode = (resp && resp.country) ? resp.country : "us";
                callback(countryCode);
            });
    },
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});



// Проверка поддержки формата WebP
function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }
  
  testWebP(function (support) {
    if (support == true) {
      document.querySelector('body').classList.add('webp');
    } else {
      document.querySelector('body').classList.add('no-webp');
    }
  });
  
  // Обработчик прокрутки для фиксации хедера
  window.addEventListener('scroll', function() {
    var header = document.querySelector('.header');
    if (header) {
      header.classList.toggle("sticky", window.scrollY > 1);
    }
  });
  
  // Валидация формы и обработка телефонных номеров
  document.addEventListener('DOMContentLoaded', function () {
    const phoneInputs = document.querySelectorAll('.phone-input');
    
    phoneInputs.forEach(function (phoneInput) {
      const iti = window.intlTelInput(phoneInput, {
        initialCountry: "auto",
        preferredCountries: ['ru', 'us', 'gb'],
        geoIpLookup: callback => {
          fetch("https://ipapi.co/json")
            .then(res => res.json())
            .then(data => callback(data.country_code))
            .catch(() => callback("ru"));
        },
        separateDialCode: true,
        allowDropdown: true,
        autoHideDialCode: false,
        autoPlaceholder: "aggressive",
        strictMode: true,
        excludeCountries: ['ua'],
      });
  
      phoneInput.addEventListener('input', function () {
        if (it.isValidNumber()) {
          phoneInput.classList.remove('error');
          phoneInput.placeholder = 'Ваш номер телефона';
        }
      });
  
      phoneInput.addEventListener('blur', () => {
        const fullNumber = it.getNumber();
        phoneInput.value = fullNumber;
      });
  
      phoneInput.addEventListener("countrychange", function () {
        phoneInput.value = "";
      });
  
      const form = document.getElementById('form-new');
      form.addEventListener('submit', function (event) {
        var nameInput = form.querySelector('input[name="name"]');
        var emailInput = form.querySelector('input[name="email"]');
        var phoneInput = form.querySelector('.phone-input');
  
        var nameValue = nameInput.value.trim();
        var emailValue = emailInput.value.trim();
        var phoneValue = iti.getNumber();
  
        var nameRegex = /^.{2,}$/;
        var emailRegex = /@/;
  
        var isValid = true;
  
        if (!nameRegex.test(nameValue)) {
          nameInput.classList.add('error');
          if (nameValue === '') {
            nameInput.placeholder = 'Введите полное имя';
          }
          isValid = false;
        } else {
          nameInput.classList.remove('error');
          nameInput.placeholder = 'Ваше имя';
        }
  
        if (!emailRegex.test(emailValue)) {
          emailInput.classList.add('error');
          if (emailValue === '') {
            emailInput.placeholder = 'Введите правильно почту';
          }
          isValid = false;
        } else {
          emailInput.classList.remove('error');
          emailInput.placeholder = 'Ваша почта';
        }
  
        if (!iti.isValidNumber()) {
          phoneInput.classList.add('error');
          phoneInput.placeholder = 'Введите правильный номер';
          isValid = false;
        } else {
          phoneInput.classList.remove('error');
          phoneInput.placeholder = 'Ваш номер телефона';
          phoneInput.value = phoneValue;
        }
  
        if (!isValid) {
          event.preventDefault();
        }
      });
  
      const nameInput = form.querySelector('input[name="name"]');
      const emailInput = form.querySelector('input[name="email"]');
  
      nameInput.addEventListener('input', function () {
        var nameValue = nameInput.value.trim();
        var nameRegex = /^.{2,}$/;
  
        if (nameRegex.test(nameValue)) {
          nameInput.classList.remove('error');
          nameInput.placeholder = 'Ваше имя';
        }
      });
  
      emailInput.addEventListener('input', function () {
        var emailValue = emailInput.value.trim();
        var emailRegex = /@/;
  
        if (emailRegex.test(emailValue)) {
          emailInput.classList.remove('error');
          emailInput.placeholder = 'Ваша почта';
        }
      });
    });
  });









//Фоома для заполнения данными 

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    const popupButton = document.getElementById('popup-button');
    const popupForm = document.getElementById('popup-form');
    const closeButton = document.getElementById('close-button');

    popupButton.addEventListener('click', function () {
        popupForm.style.display = 'block';
    });

    closeButton.addEventListener('click', function () {
        popupForm.style.display = 'none';
    });

    form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();

        let error = formValidate(form);

        let formData = new FormData(form);

        if (error === 0) {
            form.classList.add('_sending');
            let response = await fetch('api.php', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                let result = await response.json();
                alert(result.message);
                form.reset();
                form.classList.remove('_sending');
                popupForm.style.display = 'none';
            } else {
                alert("Ошибка");
                form.classList.remove('_sending');
            }
        } else {
            alert('Заполните обязательные поля');
        }
    }

    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('._req');

        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            formRemoveError(input);

            if (input.classList.contains('_email')) {
                if (emailTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else if (input.getAttribute("type") === "checkbox" && !input.checked) {
                formAddError(input);
                error++;
            } else {
                if (input.value === '') {
                    formAddError(input);
                    error++;
                }
            }
        }
        return error;
    }

    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }

    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }

    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(.\w{2,8})+$/.test(input.value);
    }
});


// для телефонов 

document.addEventListener('DOMContentLoaded', function () {
    const phoneInputField = document.querySelector("#formPhone");

    // Массив с кодами стран
    const allowedCountries = [
        "AD", "AT", "BE", "BG", "HR", "CZ", "DK", "EE", "FI", "FR",
        "GR", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MK", "MT",
        "MC", "ME", "NL", "NO", "PT", "RO", "RS", "SK", "SI", "ES",
        "SE", "CH", "GB"
    ];

    const phoneInput = window.intlTelInput(phoneInputField, {
        initialCountry: "auto",
        separateDialCode: true,
        onlyCountries: allowedCountries, // Включение только определённых стран
        geoIpLookup: function(callback) {
            fetch('https://ipinfo.io/json')
                .then(response => response.json())
                .then(data => callback(data.country))
                .catch(() => callback('us'));
        },
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
    });

    // Обновление поля ввода при смене страны
    phoneInputField.addEventListener('countrychange', function() {
        const countryData = phoneInput.getSelectedCountryData();
        const dialCode = '+' + countryData.dialCode;
        phoneInputField.value = dialCode + phoneInputField.value.replace(/^\+?\d+/, '');
    });

    // Обработчик отправки формы
    const form = document.querySelector("#form-new");
    form.addEventListener('submit', function(e) {
        // Получаем полный номер телефона с кодом страны
        const fullNumber = phoneInput.getNumber();

        // Записываем полный номер в скрытое поле или изменяем значение phoneInputField
        phoneInputField.value = fullNumber;

        // Если используется скрытое поле:
        // document.querySelector("#hiddenPhoneInput").value = fullNumber;
    });

    // Add event listener for the close button
    const closeButton = document.getElementById('close-button-new');
    closeButton.addEventListener('click', function () {
        document.getElementById('popup-form-new').style.display = 'none';
    });

    // Show the popup form
    document.getElementById('popup-button').addEventListener('click', function () {
        document.getElementById('popup-form-new').style.display = 'block';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const orderButton = document.getElementById('order-button');
    const moreButtonHeader = document.getElementById('more-button-header');
    const moreButtons = document.querySelectorAll('#more-button, #more-button-header');
    const popupForm = document.getElementById('popup-form-new');
    const closeButton = document.getElementById('close-button-new');
    
    // Обработчик для кнопки "Бесплатная консультация"
    orderButton.addEventListener('click', function() {
        popupForm.style.display = 'block';
    });
    
    // Обработчик для кнопок "Подробнее"
    moreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Предотвращаем стандартное поведение кнопки
            document.getElementById('return-stages').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Обработчик для кнопки закрытия формы
    closeButton.addEventListener('click', function() {
        popupForm.style.display = 'none';
    });
    
    // Закрытие формы при клике вне ее области
    window.addEventListener('click', function(event) {
        if (event.target === popupForm) {
            popupForm.style.display = 'none';
        }
    });
});

// _____________________________________________стили для формы  __________________________________________________________________________________________________________
// Получаем элементы
// Получаем элементы
document.addEventListener('DOMContentLoaded', function() {
    const buyTrafficBtn = document.getElementById('buy-traffic-btn');
    const sellTrafficBtn = document.getElementById('sell-traffic-btn');
    const formSection = document.getElementById('form-section');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeButton = document.getElementById('close-button-new');

    // Показываем форму и затемнение фона при нажатии на кнопки
    buyTrafficBtn.addEventListener('click', () => {
        formSection.style.display = 'block';
        modalOverlay.style.display = 'block'; // Показать затемнение
    });

    sellTrafficBtn.addEventListener('click', () => {
        formSection.style.display = 'block';
        modalOverlay.style.display = 'block'; // Показать затемнение
    });

    // Закрываем форму и затемнение при нажатии на крестик
    closeButton.addEventListener('click', () => {
        formSection.style.display = 'none';
        modalOverlay.style.display = 'none'; // Скрыть затемнение
    });

    // Закрываем форму при клике на затемнение
    modalOverlay.addEventListener('click', () => {
        formSection.style.display = 'none';
        modalOverlay.style.display = 'none'; // Скрыть затемнение
    });
});


// _____________________________________________Для других кноплк  __________________________________________________________________________________________________________

// Получаем элементы кнопок
const buyTrafficButton = document.querySelector('.buttonFirst');
const sellTrafficButton = document.querySelector('.buttonSecond');
const formSection = document.getElementById('form-section');
const closeButton = document.createElement('span');

// Добавляем кнопку закрытия формы
closeButton.classList.add('close-button');
closeButton.textContent = '';
formSection.appendChild(closeButton);

// Показываем форму при нажатии на "Купити трафік"
buyTrafficButton.addEventListener('click', () => {
    formSection.style.display = 'block';
});

// Показываем форму при нажатии на "Продати трафік"
sellTrafficButton.addEventListener('click', () => {
    formSection.style.display = 'block';
});

// Закрываем форму при нажатии на крестик
closeButton.addEventListener('click', () => {
    formSection.style.display = 'none';
});

// Закрываем форму при клике вне её области
window.addEventListener('click', (event) => {
    if (event.target === formSection) {
        formSection.style.display = 'none';
    }
});







// ----------



// Получаем элемент кнопки "Продати трафік" в блоке .wrapper_seven
const sellTrafficButtonSeven = document.querySelector('.wrapper_seven .buttonFirst');
const formSectionSeven = document.getElementById('form-section');

// Показываем форму при нажатии на кнопку "Продати трафік" в блоке .wrapper_seven
sellTrafficButtonSeven.addEventListener('click', () => {
    formSectionSeven.style.display = 'block';
});

// Закрываем форму при нажатии на крестик (если уже не подключено)
const closeButtonSeven = formSectionSeven.querySelector('.close-button');
closeButtonSeven.addEventListener('click', () => {
    formSectionSeven.style.display = 'none';
});

// Закрываем форму при клике вне её области
window.addEventListener('click', (event) => {
    if (event.target === formSectionSeven) {
        formSectionSeven.style.display = 'none';
    }
});




// для кнопок присоеденится -----------

// Получаем кнопки "Приєднатися" в блоке .wrapper_fourth
const joinButtons = document.querySelectorAll('.wrapper_fourth .buttonFirst1');
const formSectionFourth = document.getElementById('form-section');

// Показываем форму при нажатии на любую из кнопок "Приєднатися" в блоке .wrapper_fourth
joinButtons.forEach(button => {
    button.addEventListener('click', () => {
        formSectionFourth.style.display = 'block';
    });
});

// Закрываем форму при нажатии на крестик
const closeButtonFourth = formSectionFourth.querySelector('.close-button');
closeButtonFourth.addEventListener('click', () => {
    formSectionFourth.style.display = 'none';
});

// Закрываем форму при клике вне её области
window.addEventListener('click', (event) => {
    if (event.target === formSectionFourth) {
        formSectionFourth.style.display = 'none';
    }
});









// _____________________________________________ПЕРЕВОД ТЕКСТА __________________________________________________________________________________________________________

const translations = {

// ______________________Англ версия___________________________________
en: {
    buttonBuy: "Buy Traffic",
    buttonSell: "Sell Traffic",
    joinUs: "JOIN <span class='highlight'>SAGA</span> TODAY",
    firstBlockText: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    secondBlock: {
        payouts: "Payouts",
        daily: "Possible every day",
        partners: "MORE THAN 2000",
        programs: "Active partners and flexible programs",
        cpi: "CPI",
        validLead: "Get paid for each valid lead",
        cpa: "CPA",
        firstDeposit: "Get a commission from the first deposit of invited clients"
    },
    offers: "OFFERS:",
    thirdBlock: {
        offers: "More than 1000 offers",
        weekly: "Weekly payments",
        loyalty: "Loyalty Program",
        support: "Support"
    },
    fourthBlock: {
        deposit: "Minimum deposit <br> 250 USD",
        traffic: "We accept <br> traffic from 130+ countries",
        weeklyPayments: "Regular payments <br> weekly",
        join: "Join"
    },
    animationBlock: {
        line1: "UNLIMITED CAPS PAYOUTS DAILY STANDARD PAYOUTS UNLIMITED CAPS PAYOUTS DAILY STANDARD PAYOUTS UNLIMITED CAPS PAYOUTS DAILY STANDARD PAYOUTS UNLIMITED CAPS PAYOUTS DAILY STANDARD PAYOUTS",
        line2: "DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS",
        line3: "NON-STANDARD PAYOUTS DAILY PAYOUTS NON-STANDARD PAYOUTS NON-STANDARD PAYOUTS DAILY PAYOUTS NON-STANDARD PAYOUTS NON-STANDARD PAYOUTS DAILY PAYOUTS NON-STANDARD PAYOUTS NON-STANDARD PAYOUTS DAILY PAYOUTS NON-STANDARD PAYOUTS",
        line4: "UNLIMITED CAPS PAYOUTS DAILY STANDARD PAYOUTS UNLIMITED CAPS PAYOUTS DAILY STANDARD PAYOUTS UNLIMITED CAPS PAYOUTS DAILY STANDARD PAYOUTS UNLIMITED CAPS PAYOUTS DAILY STANDARD PAYOUTS",
        line5: "DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS DAILY PAYOUTS",
        line6: "NON-STANDARD PAYOUTS DAILY PAYOUTS NON-STANDARD PAYOUTS NON-STANDARD PAYOUTS DAILY PAYOUTS NON-STANDARD PAYOUTS NON-STANDARD PAYOUTS DAILY PAYOUTS NON-STANDARD PAYOUTS NON-STANDARD PAYOUTS DAILY PAYOUTS NON-STANDARD PAYOUTS"
    },
    sixthBlock: {
        nft: "NFT",
        network: "CPA-NETWORK",
        cpa1: "CPA: $750-1050",
        cr1: "CR: 21%",
        revolution: "PROFIT REVOLUTION",
        cpa2: "CPA: $450-600",
        cr2: "CR: 10%",
        joinToday: "JOIN <span class='highlight'>LALA</span> TODAY"
    },
    seventhBlock: {
        loyalty: "LOYALTY PROGRAM",
        geo: "WORLDWIDE GEO",
        weeklyPayments: "WEEKLY PAYOUTS",
        topCreative: "TOP CREO"
    },
    eighthBlock: {
        title: "HOW DOES IT WORK?",
        integration: "Flexible integration tools",
        statistics: "Real-time statistics",
        campaigns: "You can link and optimize your campaigns on all platforms",
        performance: "Track performance indicators on the partner panel"
    },
    incomeBlock: {
        orangeText: "GET INCOME WITH ONE OF OUR METHODS"
    },
    scrollingText: {
        text: "earn up to <span class='highlight'>$1200</span> on deposits from unique and active clients "
    },
    form: {
        title: "Submit your application!",
        namePlaceholder: "Your name",
        phonePlaceholder: "Your phone",
        emailPlaceholder: "Your email",
        checkboxLabel: "I accept the terms and conditions of this website and agree to the processing of my data.",
        submitButton: "Free Consultation"
    }

},
 

// ______________________Укр версия___________________________________




    ua: {
        buttonBuy: "Купити трафік",
        buttonSell: "Продати трафік",
        joinUs: "ПРИЄДНУЙТЕСЬ ДО <span class='highlight'>SAGA</span> ВЖЕ СЬОГОДНІ",
        firstBlockText: "лорем іпсум долор сіт амет консектетур адіпісцінг еліт",
        secondBlock: {
            payouts: "Виплати",
            daily: "Можливі кожного дня",
            partners: "БІЛЬШЕ 2000",
            programs: "Активних партнерів та гнучкі програми",
            cpi: "CPI",
            validLead: "Отримайте виплату за кожного валідного ліда",
            cpa: "СPA",
            firstDeposit: "Отримайте комісію з першого депозиту запрошених клієнтів"
        },
        offers: "ПРОПОЗИЦІЇ:",
        thirdBlock: {
            offers: "Більше 1000 пропозицій",
            weekly: "Виплати щотижня",
            loyalty: "Програма лояльності",
            support: "Техпідтримка"
        },
        fourthBlock: {
            deposit: "Мінімальний депозит <br> 250 доларів США",
            traffic: "Ми приймаємо <br> трафік із 130+ країн",
            weeklyPayments: "Регулярні виплати <br> щотижня",
            join: "Приєднатися"
        },
        animationBlock: {
            line1: "НЕОБМЕЖЕНІ КАПИ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ СТАНДАРТНІ НЕОБМЕЖЕНІ КАПИ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ СТАНДАРТНІ",
            line2: "ЩОДЕННІ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ",
            line3: "НЕСТАНДАРТНІ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ НЕСТАНДАРТНІ ВИПЛАТИ НЕСТАНДАРТНІ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ НЕСТАНДАРТНІ ВИПЛАТИ",
            line4: "НЕОБМЕЖЕНІ КАПИ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ СТАНДАРТНІ НЕОБМЕЖЕНІ КАПИ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ СТАНДАРТНІ",
            line5: "ЩОДЕННІ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ",
            line6: "НЕСТАНДАРТНІ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ НЕСТАНДАРТНІ ВИПЛАТИ НЕСТАНДАРТНІ ВИПЛАТИ ЩОДЕННІ ВИПЛАТИ НЕСТАНДАРТНІ ВИПЛАТИ"
        },
        sixthBlock: {
            nft: "NFT",
            network: "CPA-NETWORK",
            cpa1: "CPA: $750-1050",
            cr1: "CR: 21%",
            revolution: "РЕВОЛЮЦІЯ ПРИБУТКУ",
            cpa2: "CPA: $450-600",
            cr2: "CR: 10%",
            joinToday: "ПРИЄДНУЙТЕСЬ ДО <span class='highlight'>LALA</span> ВЖЕ СЬОГОДНІ"
        },
        seventhBlock: {
            loyalty: "ПРОГРАМА ЛОЯЛЬНОСТІ",
            geo: "ВСЕСВІТНІЙ ГЕО",
            weeklyPayments: "ВИПЛАТИ ЩОТИЖНЯ",
            topCreative: "ТОПОВІ КРЕО"
        },
        eighthBlock: {
            title: "ЯК ВСЕ ПРАЦЮЄ?",
            integration: "Гнучкі інструменти інтеграції",
            statistics: "Статистика в реальному часі",
            campaigns: "Ви можете зв’язати й оптимізувати свої кампанії на всіх платформах",
            performance: "Відстежуйте показники переходів ефективність на панелі партнера"
        },
        incomeBlock: {
            orangeText: "ОТРИМАЙТЕ ДОХОДИ ЗА ДОПОМОГОЮ ОДНОГО З НАШИХ МЕТОДІВ"
        },
        scrollingText: {
            text: "заробляйте до <span class='highlight'>$1200</span> на депозитах від унікальних та активних клієнтів "
        },
        form: {
            title: "Залиште заявку!",
            namePlaceholder: "Ваше ім'я",
            phonePlaceholder: "Ваш телефон",
            emailPlaceholder: "Ваша пошта",
            checkboxLabel: "Я приймаю правила та умови данного веб-ресурсу і даю згоду  на обробку даних.",
            submitButton: "Безкоштовна консультація"
        }
    },
    






// ______________________Рус версия___________________________________


ru: {
    buttonBuy: "Купить трафик",
    buttonSell: "Продать трафик",
    joinUs: "ПРИСОЕДИНЯЙТЕСЬ К <span class='highlight'>SAGA</span> СЕГОДНЯ",
    firstBlockText: "лорем ипсум долор сит амет консектетур адиписцинг елит",
    secondBlock: {
        payouts: "Выплаты",
        daily: "Возможны каждый день",
        partners: "БОЛЕЕ 2000",
        programs: "Активных партнеров и гибкие программы",
        cpi: "CPI",
        validLead: "Получите выплату за каждого валидного лида",
        cpa: "CPA",
        firstDeposit: "Получите комиссию с первого депозита приглашенных клиентов"
    },
    offers: "ПРЕДЛОЖЕНИЯ:",
    thirdBlock: {
        offers: "Более 1000 предложений",
        weekly: "Выплаты каждую неделю",
        loyalty: "Программа лояльности",
        support: "Поддержка"
    },
    fourthBlock: {
        deposit: "Минимальный депозит <br> 250 долларов США",
        traffic: "Мы принимаем <br> трафик из 130+ стран",
        weeklyPayments: "Регулярные выплаты <br> каждую неделю",
        join: "Присоединиться"
    },
    animationBlock: {
        line1: "БЕЗЛИМИТНЫЕ КЭПЫ ВЫПЛАТЫ ЕЖЕДНЕВНО СТАНДАРТНЫЕ ВЫПЛАТЫ БЕЗЛИМИТНЫЕ КЭПЫ ВЫПЛАТЫ ЕЖЕДНЕВНО СТАНДАРТНЫЕ ВЫПЛАТЫ",
        line2: "ЕЖЕДНЕВНЫЕ ВЫПЛАТЫ ЕЖЕДНЕВНЫЕ ВЫПЛАТЫ ЕЖЕДНЕВНЫЕ ВЫПЛАТЫ ЕЖЕДНЕВНЫЕ ВЫПЛАТЫ ЕЖЕДНЕВНЫЕ ВЫПЛАТЫ ЕЖЕДНЕВНЫЕ ВЫПЛАТЫ",
        line3: "НЕСТАНДАРТНЫЕ ВЫПЛАТЫ ЕЖЕДНЕВНЫЕ ВЫПЛАТЫ НЕСТАНДАРТНЫЕ ВЫПЛАТЫ НЕСТАНДАРТНЫЕ ВЫПЛАТЫ ЕЖЕДНЕВНЫЕ ВЫПЛАТЫ НЕСТАНДАРТНЫЕ ВЫПЛАТЫ",
        line4: "БЕЗЛИМИТНЫЕ КЭПЫ ВЫПЛАТЫ ЕЖЕДНЕВНО СТАНДАРТНЫЕ ВЫПЛАТЫ БЕЗЛИМИТНЫЕ КЭПЫ ВЫПЛАТЫ ЕЖЕДНЕВНО СТАНДАРТНЫЕ ВЫПЛАТЫ",
        line5: "ЕЖЕДНЕВНЫЕ ВЫПЛАТЫ ЕЖЕДНЕВНЫЕ ВЫПЛАТЫ ЕЖЕДНЕВНЫЕ ВЫПЛАТЫ ЕЖЕДНЕВНЫЕ ВЫПЛАТЫ ЕЖЕДНЕВНЫЕ ВЫПЛАТЫ ЕЖЕДНЕВНЫЕ ВЫПЛАТЫ",
        line6: "НЕСТАНДАРТНЫЕ ВЫПЛАТЫ ЕЖЕДНЕВНЫЕ ВЫПЛАТЫ НЕСТАНДАРТНЫЕ ВЫПЛАТЫ НЕСТАНДАРТНЫЕ ВЫПЛАТЫ ЕЖЕДНЕВНЫЕ ВЫПЛАТЫ НЕСТАНДАРТНЫЕ ВЫПЛАТЫ"
    },
    sixthBlock: {
        nft: "NFT",
        network: "CPA-NETWORK",
        cpa1: "CPA: $750-1050",
        cr1: "CR: 21%",
        revolution: "РЕВОЛЮЦИЯ ПРИБЫЛИ",
        cpa2: "CPA: $450-600",
        cr2: "CR: 10%",
        joinToday: "ПРИСОЕДИНЯЙТЕСЬ К <span class='highlight'>LALA</span> СЕГОДНЯ"
    },
    seventhBlock: {
        loyalty: "ПРОГРАММА ЛОЯЛЬНОСТИ",
        geo: "ВСЕМИРНЫЙ ГЕО",
        weeklyPayments: "ВЫПЛАТЫ КАЖДУЮ НЕДЕЛЮ",
        topCreative: "ТОПОВЫЕ КРЕО"
    },
    eighthBlock: {
        title: "КАК ВСЕ РАБОТАЕТ?",
        integration: "Гибкие инструменты интеграции",
        statistics: "Статистика в реальном времени",
        campaigns: "Вы можете связать и оптимизировать свои кампании на всех платформах",
        performance: "Отслеживайте показатели переходов на панели партнера"
    },
    incomeBlock: {
        orangeText: "ПОЛУЧАЙТЕ ДОХОД С ОДНИМ ИЗ НАШИХ МЕТОДОВ"
    },
    scrollingText: {
        text: "зарабатывайте до <span class='highlight'>$1200</span> на депозитах от уникальных и активных клиентов "
    },
    form: {
        title: "Оставьте заявку!",
        namePlaceholder: "Ваше имя",
        phonePlaceholder: "Ваш телефон",
        emailPlaceholder: "Ваша почта",
        checkboxLabel: "Я принимаю правила и условия данного веб-ресурса и даю согласие на обработку данных.",
        submitButton: "Бесплатная консультация"
    }
}
    };



// ______________________укр версия ___________________________________



function translatePage(selectedLanguage) {
    
        // Перевод первого блока
        document.querySelector('.buttonFirstblock1').textContent = translations[selectedLanguage].buttonBuy;
        document.querySelector('.buttonSecondblock2').textContent = translations[selectedLanguage].buttonSell;
        document.querySelector('.text_first').textContent = translations[selectedLanguage].firstBlockText;
    
        // Перевод второго блока
        document.querySelector('.block1 .UnderBanner_cardTitle__AD7J-').textContent = translations[selectedLanguage].secondBlock.payouts;
        document.querySelector('.block1 .UnderBanner_cardText__KN5sy').textContent = translations[selectedLanguage].secondBlock.daily;
        document.querySelector('.block2 .UnderBanner_cardTitle__AD7J-').textContent = translations[selectedLanguage].secondBlock.partners;
        document.querySelector('.block2 .UnderBanner_cardText__KN5sy').textContent = translations[selectedLanguage].secondBlock.programs;
        document.querySelector('.block3 .UnderBanner_cardTitle__AD7J-').textContent = translations[selectedLanguage].secondBlock.cpi;
        document.querySelector('.block3 .UnderBanner_cardText__KN5sy').textContent = translations[selectedLanguage].secondBlock.validLead;
        document.querySelector('.block4 .UnderBanner_cardTitle__AD7J-').textContent = translations[selectedLanguage].secondBlock.cpa;
        document.querySelector('.block4 .UnderBanner_cardText__KN5sy').textContent = translations[selectedLanguage].secondBlock.firstDeposit;
    
        // Перевод предложений
        document.querySelector('.big-text1').textContent = translations[selectedLanguage].offers;
    
        // Перевод третьего блока
        document.querySelector('.block_image_one .imgsub-text').textContent = translations[selectedLanguage].thirdBlock.offers;
        document.querySelector('.block_image_two .imgsub-text').textContent = translations[selectedLanguage].thirdBlock.weekly;
        document.querySelector('.block_image_three .imgsub-text').textContent = translations[selectedLanguage].thirdBlock.loyalty;
        document.querySelector('.block_image_four .imgsub-text').textContent = translations[selectedLanguage].thirdBlock.support;
    
        // Перевод четвертого блока
        document.querySelector('.block_one .imgsub-text1').innerHTML = translations[selectedLanguage].fourthBlock.deposit;
        document.querySelector('.block_two .imgsub-text1').innerHTML = translations[selectedLanguage].fourthBlock.traffic;
        document.querySelector('.block_three .imgsub-text1').innerHTML = translations[selectedLanguage].fourthBlock.weeklyPayments;
        document.querySelectorAll('.buttonFirst1').forEach(button => button.textContent = translations[selectedLanguage].fourthBlock.join);
    
         // Перевод блока с анимацией
    const animatedItems = document.querySelectorAll('.items-wrap .item');
    if (animatedItems.length >= 6) {
        animatedItems[0].textContent = translations[selectedLanguage].animationBlock.line1;
        animatedItems[1].textContent = translations[selectedLanguage].animationBlock.line2;
        animatedItems[2].textContent = translations[selectedLanguage].animationBlock.line3;
        animatedItems[3].textContent = translations[selectedLanguage].animationBlock.line4;
        animatedItems[4].textContent = translations[selectedLanguage].animationBlock.line5;
        animatedItems[5].textContent = translations[selectedLanguage].animationBlock.line6;
    }

    // Перевод шестого блока
    const firstContainer = document.querySelector('.first-container .text-container');
    const secondContainer = document.querySelector('.second-container .text-container');

    if (firstContainer && secondContainer) {
        firstContainer.querySelector('p:nth-child(1)').textContent = translations[selectedLanguage].sixthBlock.nft;
        firstContainer.querySelector('p:nth-child(2)').textContent = translations[selectedLanguage].sixthBlock.network;
        firstContainer.querySelector('p:nth-child(3)').textContent = translations[selectedLanguage].sixthBlock.cpa1;
        firstContainer.querySelector('p:nth-child(4)').textContent = translations[selectedLanguage].sixthBlock.cr1;

        secondContainer.querySelector('p:nth-child(1)').textContent = translations[selectedLanguage].sixthBlock.revolution;
        secondContainer.querySelector('p:nth-child(2)').textContent = translations[selectedLanguage].sixthBlock.network;
        secondContainer.querySelector('p:nth-child(3)').textContent = translations[selectedLanguage].sixthBlock.cpa2;
        secondContainer.querySelector('p:nth-child(4)').textContent = translations[selectedLanguage].sixthBlock.cr2;
    }

    // Перевод кнопок в шестом блоке
    const firstButton = document.querySelector('.buttonFirst');
    const secondButton = document.querySelector('.buttonSecond');

    if (firstButton && secondButton) {
        firstButton.textContent = translations[selectedLanguage].buttonBuy;
        secondButton.textContent = translations[selectedLanguage].buttonSell;
    }
 // Перевод текста "ПРИСОЕДИНЯЙТЕСЬ К SAGA СЕГОДНЯ"
 const joinText = document.querySelector('.big-text');
 if (joinText) {
     joinText.innerHTML = translations[selectedLanguage].sixthBlock.joinToday;
 }




        // Перевод седьмого блока
        document.querySelectorAll('.tabsText').forEach((element, index) => {
            switch (index) {
                case 0:
                    element.textContent = translations[selectedLanguage].seventhBlock.loyalty;
                    break;
                case 1:
                    element.textContent = translations[selectedLanguage].seventhBlock.geo;
                    break;
                case 2:
                    element.textContent = translations[selectedLanguage].seventhBlock.weeklyPayments;
                    break;
                case 3:
                    element.textContent = translations[selectedLanguage].seventhBlock.topCreative;
                    break;
            }
        });
    
    
        // Перевод восьмого блока
        document.querySelector('.main-text').textContent = translations[selectedLanguage].eighthBlock.title;
        document.querySelector('.text-block:nth-child(1) .text').textContent = translations[selectedLanguage].eighthBlock.integration;
        document.querySelector('.text-block:nth-child(2) .text').textContent = translations[selectedLanguage].eighthBlock.statistics;
        document.querySelector('.text-block:nth-child(3) .text').textContent = translations[selectedLanguage].eighthBlock.campaigns;
        document.querySelector('.text-block:nth-child(4) .text').textContent = translations[selectedLanguage].eighthBlock.performance;
    
       // Перевод блока с доходом
    document.querySelector('.orange-square-container-text').textContent = translations[selectedLanguage].incomeBlock.orangeText;

    // Перевод кнопки в блоке с доходом
    const incomeButton = document.querySelector('.custom-button2.buttonFirst');
    if (incomeButton) {
        incomeButton.textContent = translations[selectedLanguage].buttonSell;
    }
        // Перевод блока с прокручивающимся текстом
        document.querySelectorAll('.marquee1 span').forEach(element => {
            element.innerHTML = translations[selectedLanguage].scrollingText.text;
        });



         // Перевод формы
    // Update translations for the form
    const formTitle = document.querySelector('.form__title-new1');
    const formName = document.querySelector('#formName');
    const formPhone = document.querySelector('#formPhone');
    const formEmail = document.querySelector('#formEmail');
    const formCheckboxLabel = document.querySelector('label[for="accept-terms"]');
    const formButton = document.querySelector('.popup-form-button-new1');

    if (formTitle && formName && formPhone && formEmail && formCheckboxLabel && formButton) {
        // Update form title
        formTitle.textContent = translations[selectedLanguage].form.title;

        // Update placeholders
        formName.placeholder = translations[selectedLanguage].form.namePlaceholder;
        formPhone.placeholder = translations[selectedLanguage].form.phonePlaceholder;
        formEmail.placeholder = translations[selectedLanguage].form.emailPlaceholder;

        // Update the checkbox label while preserving the input element
        const checkboxTextSpan = formCheckboxLabel.querySelector('.bord');
        formCheckboxLabel.childNodes[2].textContent = translations[selectedLanguage].form.checkboxLabel.split('и даю')[0];
        if (checkboxTextSpan) {
            checkboxTextSpan.textContent = translations[selectedLanguage].form.checkboxLabel.split('и даю')[1];
        }

        // Update button text
        formButton.textContent = translations[selectedLanguage].form.submitButton;
    }

    };
    

// Инициализация перевода при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const selectedLanguage = 'ua'; // Здесь предполагается, что украинский язык по умолчанию
    translatePage(selectedLanguage); // Выполняем перевод страницы при загрузке
});

// Обработчик смены языка
document.getElementById('language-select').addEventListener('change', function() {
    const selectedLanguage = this.value;
    translatePage(selectedLanguage); // Выполняем перевод при смене языка
});










    


    // ______________________Рус версия___________________________________
   document.getElementById('language-select').addEventListener('change', function() {
    const selectedLanguage = this.value;

    // Перевод первого блока
    const buttonBuy = document.querySelector('.buttonFirstblock1');
    const buttonSell = document.querySelector('.buttonSecondblock2');
    const firstText = document.querySelector('.text_first');
    if (buttonBuy && buttonSell && firstText) {
        buttonBuy.textContent = translations[selectedLanguage].buttonBuy;
        buttonSell.textContent = translations[selectedLanguage].buttonSell;
        firstText.textContent = translations[selectedLanguage].firstBlockText;
    }

    // Перевод второго блока
    const block1Title = document.querySelector('.block1 .UnderBanner_cardTitle__AD7J-');
    const block1Text = document.querySelector('.block1 .UnderBanner_cardText__KN5sy');
    const block2Title = document.querySelector('.block2 .UnderBanner_cardTitle__AD7J-');
    const block2Text = document.querySelector('.block2 .UnderBanner_cardText__KN5sy');
    const block3Title = document.querySelector('.block3 .UnderBanner_cardTitle__AD7J-');
    const block3Text = document.querySelector('.block3 .UnderBanner_cardText__KN5sy');
    const block4Title = document.querySelector('.block4 .UnderBanner_cardTitle__AD7J-');
    const block4Text = document.querySelector('.block4 .UnderBanner_cardText__KN5sy');

    if (block1Title && block1Text && block2Title && block2Text && block3Title && block3Text && block4Title && block4Text) {
        block1Title.textContent = translations[selectedLanguage].secondBlock.payouts;
        block1Text.textContent = translations[selectedLanguage].secondBlock.daily;
        block2Title.textContent = translations[selectedLanguage].secondBlock.partners;
        block2Text.textContent = translations[selectedLanguage].secondBlock.programs;
        block3Title.textContent = translations[selectedLanguage].secondBlock.cpi;
        block3Text.textContent = translations[selectedLanguage].secondBlock.validLead;
        block4Title.textContent = translations[selectedLanguage].secondBlock.cpa;
        block4Text.textContent = translations[selectedLanguage].secondBlock.firstDeposit;
    }

    // Перевод текста предложений
    const offersText = document.querySelector('.big-text1');
    if (offersText) {
        offersText.textContent = translations[selectedLanguage].offers;
    }

    // Перевод третьего блока (картинки)
    const imgTexts = document.querySelectorAll('.mini-image-blocks .imgsub-text');
    if (imgTexts.length === 4) {
        imgTexts[0].textContent = translations[selectedLanguage].thirdBlock.offers;
        imgTexts[1].textContent = translations[selectedLanguage].thirdBlock.weekly;
        imgTexts[2].textContent = translations[selectedLanguage].thirdBlock.loyalty;
        imgTexts[3].textContent = translations[selectedLanguage].thirdBlock.support;
    }

    // Перевод четвертого блока
    const blockOneText = document.querySelector('.block_one .imgsub-text1');
    const blockTwoText = document.querySelector('.block_two .imgsub-text1');
    const blockThreeText = document.querySelector('.block_three .imgsub-text1');
    const joinButtons = document.querySelectorAll('.buttonFirst1');

    if (blockOneText && blockTwoText && blockThreeText) {
        blockOneText.innerHTML = translations[selectedLanguage].fourthBlock.deposit;
        blockTwoText.innerHTML = translations[selectedLanguage].fourthBlock.traffic;
        blockThreeText.innerHTML = translations[selectedLanguage].fourthBlock.weeklyPayments;
    }

    joinButtons.forEach(button => {
        if (button) {
            button.textContent = translations[selectedLanguage].fourthBlock.join;
        }
    });

    // Перевод блока с анимацией
    const animatedItems = document.querySelectorAll('.items-wrap .item');
    if (animatedItems.length === 6) {
        animatedItems[0].textContent = translations[selectedLanguage].animationBlock.line1;
        animatedItems[1].textContent = translations[selectedLanguage].animationBlock.line2;
        animatedItems[2].textContent = translations[selectedLanguage].animationBlock.line3;
        animatedItems[3].textContent = translations[selectedLanguage].animationBlock.line4;
        animatedItems[4].textContent = translations[selectedLanguage].animationBlock.line5;
        animatedItems[5].textContent = translations[selectedLanguage].animationBlock.line6;
    }

    // Перевод шестого блока (блок с NFT)
    const firstContainer = document.querySelector('.first-container .text-container');
    const secondContainer = document.querySelector('.second-container .text-container');

    if (firstContainer && secondContainer) {
        firstContainer.querySelector('p:nth-child(1)').textContent = translations[selectedLanguage].sixthBlock.nft;
        firstContainer.querySelector('p:nth-child(2)').textContent = translations[selectedLanguage].sixthBlock.network;
        firstContainer.querySelector('p:nth-child(3)').textContent = translations[selectedLanguage].sixthBlock.cpa1;
        firstContainer.querySelector('p:nth-child(4)').textContent = translations[selectedLanguage].sixthBlock.cr1;

        secondContainer.querySelector('p:nth-child(1)').textContent = translations[selectedLanguage].sixthBlock.revolution;
        secondContainer.querySelector('p:nth-child(2)').textContent = translations[selectedLanguage].sixthBlock.network;
        secondContainer.querySelector('p:nth-child(3)').textContent = translations[selectedLanguage].sixthBlock.cpa2;
        secondContainer.querySelector('p:nth-child(4)').textContent = translations[selectedLanguage].sixthBlock.cr2;
    }

    // Перевод седьмого блока (картинки с кораблями)
    const pictureTexts = document.querySelectorAll('.tabsText');
    if (pictureTexts.length === 4) {
        pictureTexts[0].textContent = translations[selectedLanguage].seventhBlock.loyalty;
        pictureTexts[1].textContent = translations[selectedLanguage].seventhBlock.geo;
        pictureTexts[2].textContent = translations[selectedLanguage].seventhBlock.weeklyPayments;
        pictureTexts[3].textContent = translations[selectedLanguage].seventhBlock.topCreative;
    }

    // Перевод восьмого блока (как это работает)
    const mainText = document.querySelector('.main-text');
    if (mainText) {
        mainText.textContent = translations[selectedLanguage].eighthBlock.title;
    }

    const textBlocks = document.querySelectorAll('.text-block .text');
    if (textBlocks.length === 4) {
        textBlocks[0].textContent = translations[selectedLanguage].eighthBlock.integration;
        textBlocks[1].textContent = translations[selectedLanguage].eighthBlock.statistics;
        textBlocks[2].textContent = translations[selectedLanguage].eighthBlock.campaigns;
        textBlocks[3].textContent = translations[selectedLanguage].eighthBlock.performance;
    }

    // Перевод блока с доходом
    const incomeText = document.querySelector('.orange-square-container-text');
    if (incomeText) {
        incomeText.textContent = translations[selectedLanguage].incomeBlock.orangeText;
    }

    // Перевод блока с прокручивающимся текстом
    const scrollingText = document.querySelectorAll('.marquee1 span');
    scrollingText.forEach(element => {
        if (element) {
            element.innerHTML = translations[selectedLanguage].scrollingText.text;
        }
    });

    // Перевод формы
    // Update translations for the form
    const formTitle = document.querySelector('.form__title-new1');
    const formName = document.querySelector('#formName');
    const formPhone = document.querySelector('#formPhone');
    const formEmail = document.querySelector('#formEmail');
    const formCheckboxLabel = document.querySelector('label[for="accept-terms"]');
    const formButton = document.querySelector('.popup-form-button-new1');

    if (formTitle && formName && formPhone && formEmail && formCheckboxLabel && formButton) {
        // Update form title
        formTitle.textContent = translations[selectedLanguage].form.title;

        // Update placeholders
        formName.placeholder = translations[selectedLanguage].form.namePlaceholder;
        formPhone.placeholder = translations[selectedLanguage].form.phonePlaceholder;
        formEmail.placeholder = translations[selectedLanguage].form.emailPlaceholder;

        // Update the checkbox label while preserving the input element
        const checkboxTextSpan = formCheckboxLabel.querySelector('.bord');
        formCheckboxLabel.childNodes[2].textContent = translations[selectedLanguage].form.checkboxLabel.split('и даю')[0];
        if (checkboxTextSpan) {
            checkboxTextSpan.textContent = translations[selectedLanguage].form.checkboxLabel.split('и даю')[1];
        }

        // Update button text
        formButton.textContent = translations[selectedLanguage].form.submitButton;
    }

});









// ______________________Англ  версия___________________________________



// Переключение языка
document.getElementById('language-select').addEventListener('change', function() {
    const selectedLanguage = this.value;

    // Перевод первого блока
    const buttonBuy = document.querySelector('.buttonFirstblock1');
    const buttonSell = document.querySelector('.buttonSecondblock2');
    const firstText = document.querySelector('.text_first');
    if (buttonBuy && buttonSell && firstText) {
        buttonBuy.textContent = translations[selectedLanguage].buttonBuy;
        buttonSell.textContent = translations[selectedLanguage].buttonSell;
        firstText.textContent = translations[selectedLanguage].firstBlockText;
    }

    // Перевод второго блока
    const block1Title = document.querySelector('.block1 .UnderBanner_cardTitle__AD7J-');
    const block1Text = document.querySelector('.block1 .UnderBanner_cardText__KN5sy');
    const block2Title = document.querySelector('.block2 .UnderBanner_cardTitle__AD7J-');
    const block2Text = document.querySelector('.block2 .UnderBanner_cardText__KN5sy');
    const block3Title = document.querySelector('.block3 .UnderBanner_cardTitle__AD7J-');
    const block3Text = document.querySelector('.block3 .UnderBanner_cardText__KN5sy');
    const block4Title = document.querySelector('.block4 .UnderBanner_cardTitle__AD7J-');
    const block4Text = document.querySelector('.block4 .UnderBanner_cardText__KN5sy');

    if (block1Title && block1Text && block2Title && block2Text && block3Title && block3Text && block4Title && block4Text) {
        block1Title.textContent = translations[selectedLanguage].secondBlock.payouts;
        block1Text.textContent = translations[selectedLanguage].secondBlock.daily;
        block2Title.textContent = translations[selectedLanguage].secondBlock.partners;
        block2Text.textContent = translations[selectedLanguage].secondBlock.programs;
        block3Title.textContent = translations[selectedLanguage].secondBlock.cpi;
        block3Text.textContent = translations[selectedLanguage].secondBlock.validLead;
        block4Title.textContent = translations[selectedLanguage].secondBlock.cpa;
        block4Text.textContent = translations[selectedLanguage].secondBlock.firstDeposit;
    }

    // Перевод текста предложений
    const offersText = document.querySelector('.big-text1');
    if (offersText) {
        offersText.textContent = translations[selectedLanguage].offers;
    }

    // Перевод третьего блока (картинки)
    const imgTexts = document.querySelectorAll('.mini-image-blocks .imgsub-text');
    if (imgTexts.length === 4) {
        imgTexts[0].textContent = translations[selectedLanguage].thirdBlock.offers;
        imgTexts[1].textContent = translations[selectedLanguage].thirdBlock.weekly;
        imgTexts[2].textContent = translations[selectedLanguage].thirdBlock.loyalty;
        imgTexts[3].textContent = translations[selectedLanguage].thirdBlock.support;
    }

    // Перевод четвертого блока
    const blockOneText = document.querySelector('.block_one .imgsub-text1');
    const blockTwoText = document.querySelector('.block_two .imgsub-text1');
    const blockThreeText = document.querySelector('.block_three .imgsub-text1');
    const joinButtons = document.querySelectorAll('.buttonFirst1');

    if (blockOneText && blockTwoText && blockThreeText) {
        blockOneText.innerHTML = translations[selectedLanguage].fourthBlock.deposit;
        blockTwoText.innerHTML = translations[selectedLanguage].fourthBlock.traffic;
        blockThreeText.innerHTML = translations[selectedLanguage].fourthBlock.weeklyPayments;
    }

    joinButtons.forEach(button => {
        if (button) {
            button.textContent = translations[selectedLanguage].fourthBlock.join;
        }
    });

    // Перевод анимации
    function updateAnimationText(language) {
        document.querySelector('.row-1 .item').textContent = translations[language].animationBlock.line1;
        document.querySelector('.row-2 .item').textContent = translations[language].animationBlock.line2;
        document.querySelector('.row-3 .item').textContent = translations[language].animationBlock.line3;
        document.querySelector('.row-4 .item').textContent = translations[language].animationBlock.line4;
        document.querySelector('.row-5 .item').textContent = translations[language].animationBlock.line5;
        document.querySelector('.row-6 .item').textContent = translations[language].animationBlock.line6;
    }
    
    updateAnimationText(selectedLanguage);

    // Перевод шестого блока (блок с NFT)
    const firstContainer = document.querySelector('.first-container');
    const secondContainer = document.querySelector('.second-container');
    if (firstContainer && secondContainer) {
        firstContainer.querySelector('p:nth-child(1)').textContent = translations[selectedLanguage].sixthBlock.nft;
        firstContainer.querySelector('p:nth-child(2)').textContent = translations[selectedLanguage].sixthBlock.network;
        firstContainer.querySelector('p:nth-child(3)').textContent = translations[selectedLanguage].sixthBlock.cpa1;
        firstContainer.querySelector('p:nth-child(4)').textContent = translations[selectedLanguage].sixthBlock.cr1;

        secondContainer.querySelector('p:nth-child(1)').textContent = translations[selectedLanguage].sixthBlock.revolution;
        secondContainer.querySelector('p:nth-child(2)').textContent = translations[selectedLanguage].sixthBlock.network;
        secondContainer.querySelector('p:nth-child(3)').textContent = translations[selectedLanguage].sixthBlock.cpa2;
        secondContainer.querySelector('p:nth-child(4)').textContent = translations[selectedLanguage].sixthBlock.cr2;
    }

    // Перевод седьмого блока (картинки с космическими кораблями)
    const pictureTexts = document.querySelectorAll('.pictures-container .tabsText');
    if (pictureTexts.length === 4) {
        pictureTexts[0].textContent = translations[selectedLanguage].seventhBlock.loyalty;
        pictureTexts[1].textContent = translations[selectedLanguage].seventhBlock.geo;
        pictureTexts[2].textContent = translations[selectedLanguage].seventhBlock.weeklyPayments;
        pictureTexts[3].textContent = translations[selectedLanguage].seventhBlock.topCreative;
    }

    // Перевод восьмого блока (как это работает)
    const mainText = document.querySelector('.main-text');
    if (mainText) {
        mainText.textContent = translations[selectedLanguage].eighthBlock.title;
    }

    const textBlocks = document.querySelectorAll('.text-block .text');
    if (textBlocks.length === 4) {
        textBlocks[0].textContent = translations[selectedLanguage].eighthBlock.integration;
        textBlocks[1].textContent = translations[selectedLanguage].eighthBlock.statistics;
        textBlocks[2].textContent = translations[selectedLanguage].eighthBlock.campaigns;
        textBlocks[3].textContent = translations[selectedLanguage].eighthBlock.performance;
    }

    // Перевод блока с доходом
    const incomeText = document.querySelector('.orange-square-container-text');
    if (incomeText) {
        incomeText.textContent = translations[selectedLanguage].incomeBlock.orangeText;
    }

    // Перевод блока с прокручивающимся текстом
    const scrollingText = document.querySelectorAll('.marquee1 span');
    scrollingText.forEach(element => {
        if (element) {
            element.innerHTML = translations[selectedLanguage].scrollingText.text;
        }
    });

    // Перевод формы
      // Update translations for the form
      const formTitle = document.querySelector('.form__title-new1');
      const formName = document.querySelector('#formName');
      const formPhone = document.querySelector('#formPhone');
      const formEmail = document.querySelector('#formEmail');
      const formCheckboxLabel = document.querySelector('label[for="accept-terms"]');
      const formButton = document.querySelector('.popup-form-button-new1');
  
      if (formTitle && formName && formPhone && formEmail && formCheckboxLabel && formButton) {
          // Update form title
          formTitle.textContent = translations[selectedLanguage].form.title;
  
          // Update placeholders
          formName.placeholder = translations[selectedLanguage].form.namePlaceholder;
          formPhone.placeholder = translations[selectedLanguage].form.phonePlaceholder;
          formEmail.placeholder = translations[selectedLanguage].form.emailPlaceholder;
  
          // Update the checkbox label while preserving the input element
          const checkboxTextSpan = formCheckboxLabel.querySelector('.bord');
          formCheckboxLabel.childNodes[2].textContent = translations[selectedLanguage].form.checkboxLabel.split('и даю')[0];
          if (checkboxTextSpan) {
              checkboxTextSpan.textContent = translations[selectedLanguage].form.checkboxLabel.split('и даю')[1];
          }
  
          // Update button text
          formButton.textContent = translations[selectedLanguage].form.submitButton;
      }
  
});






// SAGA diz ________































    

 