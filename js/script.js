'use strict';

window.addEventListener('DOMContentLoaded', () => {

    const tabs = document.querySelectorAll('.tabheader__item');
    const tabsContent = document.querySelectorAll('.tabcontent');
    const tabsParent = document.querySelector('.tabheader__items');

    // Табы

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.style.display = 'none'
        });
        tabs.forEach(tab => {
            tab.classList.remove('tabheader__item_active')
        });
    }
    hideTabContent();

    function showTabContent(i = 0){
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active')
    }
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent()
                    showTabContent(i)
                }
            });
        }
    });

    
    //timer


    const deadline = '2022-12-15';

    function getTimeRemaining(endtime) {
        let total = Date.parse(endtime) - Date.parse(new Date());
        let days, hours, minutes, seconds;

        if (total <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0; 
        } else {
            days = Math.floor(total / (1000 * 60 * 60 * 24));
            hours = Math.floor((total / (1000 * 60 * 60) % 24));
            minutes = Math.floor((total / 1000 / 60) % 60);
            seconds = Math.floor((total / 1000) % 60);
        }

        return {
            'total': total,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector);
        const days = timer.querySelector('#days');
        const hours = timer.querySelector('#hours');
        const minutes = timer.querySelector('#minutes');
        const seconds = timer.querySelector('#seconds');
        let timeInterval = setInterval(updateClock, 1000)

        updateClock();

        function updateClock() {
            const total = getTimeRemaining(endtime);
            days.textContent = getZero(total.days);
            hours.textContent = getZero(total.hours);
            minutes.textContent = getZero(total.minutes);
            seconds.textContent = getZero(total.seconds);

            if (total.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline)


    //modal 

    const modalBtns = document.querySelectorAll('[data-modal]');
    const modalClose = document.querySelector('[data-close]');
    const modal = document.querySelector('.modal');


    function showModal() {
        modal.style.display = 'block'
        document.body.style.overflow = 'hidden'
    }

    modalBtns.forEach((btn) => {
        btn.addEventListener('click', showModal)
    })

    function hideModal() {
            modal.style.display = 'none';
            document.body.style.overflow = ''
    }

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1) {
            showModal();
            window.removeEventListener('scroll', showModalByScroll)
        }
    }

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' && modal.style.display == 'block') {
            hideModal();
        }
    });

    modalClose.addEventListener('click', hideModal)

    modal.addEventListener('click', (event) => {
        if(event.target === modal) {
            hideModal();
        }
    });

    window.addEventListener('scroll', showModalByScroll);


  
    // class for cards


    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.transfer = 30;
            this.parent = document.querySelector(parentSelector)
            this.changeToUah();
        }

        changeToUah() {
            this.price = +this.price * +this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));

            }
            element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> Р/день</div>
                    </div>
            `;
            this.parent.append(element)      
        }
    }

    const getData = async (url) => {
        const res = await fetch(url)

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`)
        }

        return await res.json();
    }

    // getData('http://localhost:3000/menu')
    //     .then((data) => {
            // data.forEach(({img, altimg, title, descr, price}) => {
            //     new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
            // })
    //     })

    axios.get('http://localhost:3000/menu')
    .then((data) => {
        data.data.forEach(({img, altimg, title, descr, price}) => {
             new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
        })
    })

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'Loading',
        success: 'Скоро с вами свяжемся',
        failur: 'Error',
    }

    forms.forEach(item => {
        bindPostData(item);
    })

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: data
        })

        return await res.json();

    }

    function bindPostData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

            // request.setRequestHeader();
            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()))

            postData('http://localhost:3000/requests', json)
              .then((data) => {
                console.log(data);
                showThanksModal(message.success); 
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failur);
            }).finally(() => {
                form.reset();
            })
        });
    }

    const thanksModal = document.createElement('div');

    const prevModalDialog = document.querySelector('.modal__dialog');

    function showThanksModal(message) {
        
        prevModalDialog.style.display = 'none';
        showModal();

        thanksModal.classList.add('modal__dialog')
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.style.display = 'block';
            hideModal();
        }, 4000)
    } 


    //slider

    const slides = document.querySelectorAll('.offer__slide');
    const slider = document.querySelector('.offer__slider')
    const next = document.querySelector('.offer__slider-next');
    const prev = document.querySelector('.offer__slider-prev');
    const total = document.querySelector('#total');
    const current = document.querySelector('#current');

    slider.style.position = 'relative';

    const indicators = document.createElement('ol');

    indicators.classList.add('carousel-indicators')
    slider.append(indicators);

   
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot')

        indicators.append(dot);
    }

    const d = document.querySelectorAll('.dot');

    let slideIndex = 1;

    showSlides(slideIndex)

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`
    } else {
        total.textContent = slides.length
    }

    function showSlides(n) {
        if (n > slides.length) {
            slideIndex = 1
        } 

        if (n < 1) {
            slideIndex = slides.length
        }

        slides.forEach((slide) => {
            slide.style.display = 'none'
        })
        d.forEach((item) => {
            item.style.opacity = '0.3'
        })

        slides[slideIndex - 1].style.display = 'block';
        d[slideIndex - 1].style.opacity = 1;

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`
        } else {
            current.textContent = slideIndex
        } 
    }
    
    function plusSlides(n) {
        showSlides(slideIndex += n)
        
    }

    prev.addEventListener('click', () => {
        plusSlides(-1)
       
    })

    next.addEventListener('click', () => {
        plusSlides(1) 
     
    })

    //calc


    const result = document.querySelector('.calculating__result span');
    
    let sex;
    let height;
    let weight;
    let age;
    let ratio

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex')
    } else {
        sex = 'female'
        localStorage.setItem('sex', 'female')
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio')
    } else {
        ratio = 1.375
        localStorage.setItem('ratio', 1.375)
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector)

        elements.forEach((elem) => {
            elem.classList.remove(activeClass)
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass)
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        })
    }
    initLocalSettings('#gender div', 'calculating__choose-item_active')
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active')

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return
        }

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio)
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio)
        }
    }

    calcTotal()

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector)

        elements.forEach((item) => {
            item.addEventListener('click', (event) => {
                if (event.target.getAttribute('data-ratio')) {
                    ratio = +event.target.getAttribute('data-ratio')
                    localStorage.setItem('ratio', +event.target.getAttribute('data-ratio'))
                } else {
                    sex = event.target.getAttribute('id');
                    localStorage.setItem('sex', event.target.getAttribute('id'));
                }
    
                elements.forEach((elem) => {
                    elem.classList.remove(activeClass)
                })
    
                event.target.classList.add(activeClass);
    
                calcTotal()
            })
        })
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active')

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red'
            } else {
                input.style.border = 'none'
            }

            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal()
        })


    }
    getDynamicInformation('#height')
    getDynamicInformation('#weight')
    getDynamicInformation('#age')



});



