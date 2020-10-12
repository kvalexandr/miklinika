import './scss/index.scss';
import 'slick-carousel';
import '@fancyapps/fancybox';
import 'bootstrap/js/dist/modal';
import 'jquery-datetimepicker/build/jquery.datetimepicker.full.min';
import 'jquery.maskedinput/src/jquery.maskedinput';
import 'readmore-js/readmore';
import Masonry from 'masonry-layout/masonry';
import SimpleBar from 'simplebar';

/* 1global 1ga, 1yaCounter57332251 */
/* eslint no-undef: "error" */

const $ = require('jquery');

$('.text-page table').wrap('<div class="table-wrap"></div>');

$('.review-text').readmore({
  speed: 75,
  lessLink: '',
  moreLink: '<a class="read-more" href="#">Читать далее...</a>',
});

$.datetimepicker.setLocale('ru');
$('.datetimepicker').datetimepicker({
  format: 'd.m.Y',
  timepicker: false
});

$('.phone').mask('+7(999)999-99-99');

// мобильное меню
const btnOpenMobileMenu = document.querySelector('.hidden-menu-ticker');
const body = document.getElementsByTagName('body')[0];
if (btnOpenMobileMenu) {
  btnOpenMobileMenu.addEventListener('change', function (e) {
    body.classList.toggle('mobile__menu-open');
  });
}

const mobileMenu = document.querySelector('.mobile__menu');
const mobileLinksMenu = document.querySelectorAll('.mobile__menu-parent');
for (const mobileLinkMenu of mobileLinksMenu) {
  const mobileSubmenu = mobileLinkMenu.nextElementSibling;
  if (mobileLinkMenu) {
    mobileLinkMenu.addEventListener('click', function (e) {
      e.preventDefault();
      const h = mobileSubmenu.scrollHeight;
      mobileMenu.style.height = `${h}px`;
      mobileSubmenu.classList.toggle('mobile__submenu--open');
    });
  }
}

const submenusBack = document.querySelectorAll('.submenu__item-back');
for (const submenuBack of submenusBack) {
  if (submenuBack) {
    submenuBack.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentElement.parentElement.parentElement.classList.toggle('mobile__submenu--open');
      mobileMenu.style.height = `auto`;
    });
  }
}

const submenusFilter = document.querySelectorAll('.submenu__filter');
const submenuFilterList = document.querySelector('.submenu__filter-list');
for (const submenuFilter of submenusFilter) {
  if (submenuFilter) {
    submenuFilter.addEventListener('click', function (e) {
      e.preventDefault();
      const h = submenuFilterList.scrollHeight;
      mobileMenu.style.height = `${h}px`;
    });
  }
}

// внутреннее меню
const anchors = document.querySelectorAll('a[href*="#"]');

if (anchors) {
  for (const anchor of anchors) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const blockID = anchor.getAttribute('href').substr(1);
      if (blockID) {
        document.getElementById(blockID).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }
}

// раскрывашки прайс-листа
const directions = document.querySelectorAll('.price__direction-name');
for (const direction of directions) {
  direction.addEventListener('click', function (e) {
    e.preventDefault();

    direction.classList.toggle('active');
    const panel = direction.nextElementSibling;
    panel.classList.toggle('hidden');
  });
}

// фильтр по взрослым и детям
const setFilter = (buttonsFilter, type) => {
  buttonsFilter.forEach(i => i.classList.remove('active'));
  const typeAll = document.querySelectorAll('[data-type=' + type + ']');
  typeAll.forEach(i => i.classList.add('active'));

  if (type === 'all') {
    for (const allPrice of allPrices) {
      allPrice.classList.remove('hidden');
    }
  }

  if (type === 'adult') {
    const adultPrices = document.querySelectorAll('[data-adult="1"]');
    for (const allPrice of allPrices) {
      allPrice.classList.add('hidden');
    }
    for (const adultPrice of adultPrices) {
      adultPrice.classList.remove('hidden');
    }
  }

  if (type === 'children') {
    const childrenPrices = document.querySelectorAll('[data-children="1"]');
    for (const allPrice of allPrices) {
      allPrice.classList.add('hidden');
    }
    for (const childrenPrice of childrenPrices) {
      childrenPrice.classList.remove('hidden');
    }
  }
};

const buttonsFilter = document.querySelectorAll('.list-filter__nav-item');
const allPrices = document.querySelectorAll('.nav-item');

for (const buttonFilter of buttonsFilter) {
  const localType = localStorage.getItem('mik_filter_type');
  if (localType) {
    buttonsFilter.forEach(i => {
      if (i.getAttribute('data-type') !== localType) i.classList.remove('active');
      else i.classList.add('active');
    });
    setFilter(buttonsFilter, localType);
  }

  buttonFilter.addEventListener('click', function (e) {
    e.preventDefault();
    const type = buttonFilter.getAttribute('data-type');
    localStorage.setItem('mik_filter_type', type);

    setFilter(buttonsFilter, type);
  });
}

// custom checkbox
$('input[type="checkbox"]').bind('change', function () {
  if ($(this).is(':checked')) {
    $(this).parent('label').addClass('checked');
  } else {
    $(this).parent('label').removeClass('checked');
  }
});

// фильтр списков
function getDataFilter(params) {
  const query = Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
  const url = window.location.pathname + '?' + query;
  const requestOptions = {
    method: 'GET',
  };
  return fetch(url, requestOptions).then(function (response) {
    response.text().then(function (text) {
      itemsList.innerHTML = text;
      const scrollBlock = document.querySelector('.scroll__block');
      if (scrollBlock) {
        new SimpleBar(scrollBlock, { autoHide: false });
      }
    });
  });
}

const selectDirection = document.querySelector('[name="direction"]');
const inputFio = document.querySelector('[name="fio"]');
const checkboxChildren = document.querySelector('[name="children"]');
const checkboxAdult = document.querySelector('[name="adult"]');
const itemsList = document.querySelector('.ajax-container');

if (selectDirection) {
  selectDirection.addEventListener('change', function (e) {
    const params = {
      'ajax': 'Y',
      'direction': this.value
    };
    if (inputFio) params.fio = inputFio.value;
    if (checkboxAdult) params.adult = checkboxAdult.checked ? 1 : 0;
    if (checkboxChildren) params.children = checkboxChildren.checked ? 1 : 0;
    getDataFilter(params);
  });
}

if (inputFio) {
  inputFio.addEventListener('input', function (e) {
    const fio = this.value;
    if (fio.length > 2 || fio.length === 0) {
      const params = {
        'ajax': 'Y',
        'direction': selectDirection.value,
        'fio': this.value,
        'adult': checkboxAdult.checked ? 1 : 0,
        'children': checkboxChildren.checked ? 1 : 0
      };
      getDataFilter(params);
    }
  });
}

if (checkboxChildren) {
  checkboxChildren.addEventListener('change', function (e) {
    const params = {
      'ajax': 'Y',
      'direction': selectDirection.value,
      'fio': inputFio.value,
      'adult': checkboxAdult.checked ? 1 : 0,
      'children': this.checked ? 1 : 0
    };
    getDataFilter(params);
  });
}

if (checkboxAdult) {
  checkboxAdult.addEventListener('change', function (e) {
    const params = {
      'ajax': 'Y',
      'direction': selectDirection.value,
      'fio': inputFio.value,
      'adult': this.checked ? 1 : 0,
      'children': checkboxChildren.checked ? 1 : 0
    };
    getDataFilter(params);
  });
}

// отправка формы POST
function postData(url, options) {
  const requestOptions = {
    method: 'POST',
    headers: options.headers,
    body: options.body
  };
  return fetch(url, requestOptions).then(function (response) {
    return response.json();
  });
}

const reviewForm = document.querySelector('.form-send-review');
const reviewBtn = document.querySelector('.btn-send-review');
if (reviewForm) {
  reviewForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const successText = reviewForm.querySelector('.success-text__form').textContent;
    const data = new FormData(reviewForm);
    reviewBtn.disabled = true;
    postData('/local/ajax/review.php', {
      body: data
    }).then(function (data) {
      reviewBtn.disabled = false;
      if (data.status) {
        $('#review-send').modal('hide');
        $('#success-form').find('.success-text').text(successText);
        $('#success-form').modal('show');
      } else {
        alert('Ошбика при отправке!');
      }
      reviewForm.reset();
    });
  });
}

const appointmentForm = document.querySelector('.form-send-appointment');
const appointmentBtn = document.querySelector('.btn-send-appointment');
if (appointmentForm) {
  appointmentForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const successText = appointmentForm.querySelector('.success-text__form').textContent;
    const data = new FormData(appointmentForm);
    appointmentBtn.disabled = true;
    postData('/local/ajax/appointment.php', {
      body: data
    }).then(function (data) {
      appointmentBtn.disabled = false;
      if (data.status) {
        $('#appointment').modal('hide');
        $('#success-form').find('.success-text').text(successText);
        $('#success-form').modal('show');

        if (data.form_type === 'services') {
          window.dataLayer.push({ 'event': 'form-success' });
        }
        if (data.form_type === 'doctor') {
          window.dataLayer.push({ 'event': 'doctor-form-success' });
        }
        if (data.form_type === 'head') {
          window.dataLayer.push({ 'event': 'head-form-success' });
        }
        if (data.form_type === 'top') {
          window.dataLayer.push({ 'event': 'form-banner' });
        }
        if (data.form_type === 'price') {
          window.dataLayer.push({ 'event': 'form-price' });
        }
        if (data.form_type === 'contacts-mnogoprofilnaya-innovatsionnaya-klinika-mik') {
          window.dataLayer.push({ 'event': 'contacts-form-success' });
        }
        if (data.form_type === 'contacts-tsentr-reabilitatsii-mik') {
          window.dataLayer.push({ 'event': 'contacts-form-rehabilitation-success' });
        }
      } else {
        alert('Ошбика при отправке!');
      }
      appointmentForm.reset();
    });
  });
}

const appointmentFormFooter = document.querySelector('.form-send-appointment-footer');
const appointmentBtnFooter = document.querySelector('.btn-send-appointment-footer');
if (appointmentFormFooter) {
  appointmentFormFooter.addEventListener('submit', function (e) {
    e.preventDefault();
    const successText = appointmentFormFooter.querySelector('.success-text__form').textContent;
    const data = new FormData(appointmentFormFooter);
    appointmentBtnFooter.disabled = true;
    postData('/local/ajax/appointment.php', {
      body: data
    }).then(function (data) {
      appointmentBtnFooter.disabled = false;
      if (data.status) {
        $('#success-form').find('.success-text').text(successText);
        $('#success-form').modal('show');
        if (data.form_type === 'footer') {
          // ga('send', 'event', 'onsubmit', 'footer-form-success');
          // yaCounter57332251.reachGoal('footer-form-success');
          window.dataLayer.push({ 'event': 'footer-form-success' });
        }
      } else {
        alert('Ошбика при отправке!');
      }
      appointmentFormFooter.reset();
    });
  });
}

const appointmentFormsSlider = document.querySelectorAll('.form-send-appointment-slider');
// const appointmentBtnsSlider = document.querySelectorAll('.btn-send-appointment-slider');
for (const appointmentFormSlider of appointmentFormsSlider) {
  if (appointmentFormSlider) {
    appointmentFormSlider.addEventListener('submit', function (e) {
      e.preventDefault();
      const successText = appointmentFormSlider.querySelector('.success-text__form').textContent;
      const data = new FormData(appointmentFormSlider);
      // appointmentBtnSlider.disabled = true;
      postData('/local/ajax/appointment.php', {
        body: data
      }).then(function (data) {
        // appointmentBtnSlider.disabled = false;
        if (data.status) {
          $('#success-form').find('.success-text').text(successText);
          $('#success-form').modal('show');
        } else {
          alert('Ошбика при отправке!');
        }
        appointmentFormSlider.reset();
      });
    });
  }
}

const questionForm = document.querySelector('.form-send-question');
const questionBtn = document.querySelector('.btn-send-question');
if (questionForm) {
  questionForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const successText = questionForm.querySelector('.success-text__form').textContent;
    const data = new FormData(questionForm);
    questionBtn.disabled = true;
    postData('/local/ajax/question.php', {
      body: data
    }).then(function (data) {
      questionBtn.disabled = false;
      if (data.status) {
        $('#question-form').modal('hide');
        $('#success-form').find('.success-text').text(successText);
        $('#success-form').modal('show');
        // ga('send', 'event', 'onsubmit', 'question-form-success');
        // yaCounter57332251.reachGoal('question-form-success');

        if (data.form_type === 'contacts-mnogoprofilnaya-innovatsionnaya-klinika-mik') {
          window.dataLayer.push({ 'event': 'contacts-form-question-success' });
        } else if (data.form_type === 'contacts-tsentr-reabilitatsii-mik') {
          window.dataLayer.push({ 'event': 'contacts-form-question-rehabilitation-success' });
        } else {
          window.dataLayer.push({ 'event': 'question-form-success' });
        }
      } else {
        alert('Ошбика при отправке!');
      }
      questionForm.reset();
    });
  });
}

// для формы на главном баннере
const pastForms = document.querySelectorAll('.past__form');
for (const pastForm of pastForms) {
  if (pastForm) {
    pastForm.addEventListener('click', function (e) {
      e.preventDefault();
      const name = this.parentElement.parentElement.querySelector('[name="name"]').value;
      const phone = this.parentElement.parentElement.querySelector('[name="phone"]').value;
      document.querySelector('.form-appointment-name').value = name;
      document.querySelector('.form-appointment-phone').value = phone;
    });
  }
}

function orderInit() {
  const orders = document.querySelectorAll('.order');
  for (const order of orders) {
    if (order) {
      const orderFormType = order.getAttribute('data-form-type');
      const comment = order.getAttribute('data-comment');
      order.addEventListener('click', function (e) {
        e.preventDefault();
        $('#appointment').modal('show');
        $('#appointment').find('input[name="form_type"]').val(orderFormType);
        $('#appointment').find('textarea[name="comment"]').val(comment);
      });
    }
  }
}
orderInit();

const questions = document.querySelectorAll('.question');
for (const question of questions) {
  if (question) {
    const questionFormType = question.getAttribute('data-form-type');
    question.addEventListener('click', function (e) {
      e.preventDefault();
      $('#question-form').modal('show');
      $('#question-form').find('input[name="form_type"]').val(questionFormType);
    });
  }
}

$('.gallery__slider-full').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  infinite: true,
  centerPadding: 0,
  prevArrow: '<button type="button" class="prev"><span></span></button>',
  nextArrow: '<button type="button" class="next"><span></span></button>'
});

$('.gallery__slider-mini').slick({
  slidesToShow: 4,
  slidesToScroll: 1,
  infinite: true,
  centerPadding: 0,
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    }
  ],
  prevArrow: '<button type="button" class="prev"><span></span></button>',
  nextArrow: '<button type="button" class="next"><span></span></button>'
});

$('.banner__slider').slick({
  variableWidth: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  infinite: true,
  arrows: true,
  fade: true,
  prevArrow: '<button type="button" class="prev"><span></span></button>',
  nextArrow: '<button type="button" class="next"><span></span></button>',
  responsive: [
    {
      breakpoint: 639,
      settings: {
        dots: true,
        arrows: false
      }
    }
  ]
});

// $('.prev-banner').on('click', function () {
//   $('.banner__slider').slick('slickPrev');
// });

// $('.next-banner').on('click', function () {
//   $('.banner__slider').slick('slickNext');
// });


$('#works-1').on('show.bs.modal', function (event) {
  $('.works-item__slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    prevArrow: '<button type="button" class="prev"><span></span></button>',
    nextArrow: '<button type="button" class="next"><span></span></button>'
  });
});

$('#works-1').on('hide.bs.modal', function (event) {
  $('.works-item__slider').slick('unslick');
});

$('.works-item').on('click', function () {
  $('#works-1').modal();
  // $.fancybox.open({
  //   src: '#works-1',
  //   autoFocus: true,
  //   type: 'inline',
  //   opts: {
  //     afterLoad: function (instance, current) {
  //       console.log('sdf');
  //       $('.works-item__slider').slick({
  //         slidesToShow: 1,
  //         slidesToScroll: 1,
  //         infinite: true,
  //         prevArrow: '<button type="button" class="prev"></button>',
  //         nextArrow: '<button type="button" class="next"></button>'
  //       });
  //     }
  //   }
  // });
});

$('.about-gallery__slider').slick({
  slidesToShow: 4,
  slidesToScroll: 1,
  infinite: true,
  centerPadding: 0,
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    }
  ],
  prevArrow: '<button type="button" class="prev"><span></span></button>',
  nextArrow: '<button type="button" class="next"><span></span></button>'
});

$('.reviews-slider').slick({
  slidesToShow: 2,
  slidesToScroll: 1,
  infinite: true,
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ],
  prevArrow: '<button type="button" class="prev"><span></span></button>',
  nextArrow: '<button type="button" class="next"><span></span></button>'
});

$('.promo__slider').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 5000,
  arrows: false,
  dots: true,
  adaptiveHeight: true
});

// справочник болезней
if (window.matchMedia('(max-width: 768px)').matches) {
  $('.diseases__abc-list').slick({
    slidesToShow: 8,
    slidesToScroll: 8,
    infinite: true,
    arrows: false,
    dots: false,
    variableWidth: true,
  });
}

const slideIndex = $('.diseases__abc-list').find('.active-let').parent().parent().attr('data-slick-index');
$('.diseases__abc-list').slick('slickGoTo', parseInt(slideIndex));


// фото в футере
const galleryFooter = document.querySelector('.gallery-footer');
if (galleryFooter) {
  new Masonry('.gallery-footer', {
    itemSelector: '.grid-item',
    percentPosition: true,
    gutter: 16
  });
}


// цены показать еще
$(document).on('click', '.show-more-price', function (e) {
  const btn = $(this);
  const page = btn.attr('data-next-page');
  // const id = btn.attr('data-show-more');

  const data = {};

  data['PAGEN_1'] = page;
  data['service'] = btn.attr('data-service');
  data['direction'] = btn.attr('data-direction');
  data['service_not'] = btn.attr('data-service-not');

  $.ajax({
    type: 'GET',
    url: '/local/ajax/price_list.php',
    data: data,
    beforeSend: function () {
      // btn.find("span.show-more-text").text("Идет загрузка...");
    },
    success: function (data) {
      $('.btn_area_ajax').remove();
      $('.price_ajax').append($(data).find('.price_ajax').html());
      orderInit();
    }
  });

  e.preventDefault();
});

// поиск
$('.search-input-link').on('click', function (e) {
  e.preventDefault();
  $('.search-top').addClass('search-open');
  $('.header__nav').addClass('search-open');
  $('.search-top').find('input').focus();
});

$('.search-top input').on('blur', function () {
  setTimeout(() => {
    $('.header__nav').removeClass('search-open');
    $('.search-top').removeClass('search-open');
    $('.search-result').hide();
    $('.search-result').empty();
    $(this).val('');
  }, 300);
});

$('.search-top').find('input').on('keyup', function (e) {
  const q = $(this).val();
  if (q.length === 0) {
    $('.search-result').html('');
    $('.search-result').hide();
  }
  if (q.length > 2) {
    $.ajax({
      type: 'POST',
      url: '/local/ajax/search.php',
      data: `q=${q}`,
      dataType: 'json',
      beforeSend: function () {
        $('.search-result').html('<div class="category">Идет поиск...</div>');
        $('.search-result').show();
      },
      success: function (data) {
        let result = '';

        for (const category in data) {
          if ({}.hasOwnProperty.call(data, category)) {
            result += `<div class='category'>${category}</div>`;
            result += `<div class='items'>`;
            data[category].forEach(function (item, i, arr) {
              if (item.href === '/prices/') {
                result += `<a class='item order' data-comment='${item.label}' href='${item.href}'>${item.label}</a>`;
              } else {
                result += `<a class='item' href='${item.href}'>${item.label}</a>`;
              }
            });
            result += `</div>`;
          }
        }
        $('.search-result').html(result);
        orderInit();
      },
      error: function () {
      }
    });
  }
});


// лайки варчам
const likes = document.querySelectorAll('.add-to-like');
const localLike = JSON.parse(localStorage.getItem('like'));
if (localLike) {
  for (const like of likes) {
    if (localLike.includes(like.getAttribute('data-id'))) {
      like.classList.add('red');
    }
  }
}

$(document).on('click', '.add-to-like', function (e) {
  const btn = $(this);

  if (!btn.hasClass('red')) {
    const idDoctor = btn.attr('data-id');
    const data = {};
    data['doctor_id'] = idDoctor;

    $.ajax({
      type: 'GET',
      url: '/local/ajax/like.php',
      data: data,
      dataType: 'json',
      beforeSend: function () {
        btn.addClass('red');
      },
      success: function (data) {
        if (data.status) {
          let localLike = JSON.parse(localStorage.getItem('like'));
          if (!localLike) localLike = [];
          localLike.push(idDoctor);
          localStorage.setItem('like', JSON.stringify(localLike));

          btn.find('.like-counter').text(data.like);

          const successText = 'Спасибо! Ваш голос принят.';
          $('#success-form').find('.success-text').text(successText);
          $('#success-form').modal('show');
        } else {
          btn.removeClass('red');
        }
      }
    });
  }

  e.preventDefault();
});

// скролл
const scrollBlock = document.querySelector('.scroll__block');
// const scrollTable = document.querySelector('.table-wrap');
$(window).on('load resize', function () {
  if ($(window).width() < 640 && scrollBlock) {
    // скролл для врачей
    new SimpleBar(scrollBlock, { autoHide: false });
  }
});

// форма налога
showTab(1);

function showTab(n) {
  const tab = document.querySelector(`[data-tab='${n}']`);
  if (tab) {
    tab.style.display = 'flex';
  }
}

function hideTab(n) {
  const tab = document.querySelector(`[data-tab='${n}']`);
  if (tab) {
    tab.style.display = 'none';
  }
}

const formNalog = document.querySelector('#form-nalog');

if (formNalog) {
  const lastName = document.querySelector('input[name=lastname]');
  const firstName = document.querySelector('input[name=firstname]');
  const secondName = document.querySelector('input[name=secondname]');
  const period = document.querySelectorAll('input[name=period]');
  const phone = document.querySelector('input[name=phone]');
  const email = document.querySelector('input[name=email]');
  const comment = document.querySelector('textarea[name=comment]');

  let error = false;
  let tax = {};
  const localTax = localStorage.getItem('tax');
  if (localTax) {
    tax = JSON.parse(localTax);
  }

  // следующий шаг
  const nextBtns = document.querySelectorAll(`.btn-next`);
  for (const nextBtn of nextBtns) {
    nextBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const stepCurrent = parseInt(e.target.getAttribute('data-step'));

      if (stepCurrent === 1) {
        if (!lastName.value) {
          lastName.parentElement.classList.add('error');
          error = true;
        }
        if (!firstName.value) {
          firstName.parentElement.classList.add('error');
          error = true;
        }
        if (!secondName.value) {
          secondName.parentElement.classList.add('error');
          error = true;
        }

        if (lastName.value && firstName.value && secondName.value) {
          error = false;
        }

        const periodChecked = [];
        for (let index = 0; index < period.length; index++) {
          if (period[index].checked) {
            periodChecked.push(period[index].value);
          }
        }

        tax.taxpayer = {
          'lastName': lastName.value,
          'firstName': firstName.value,
          'secondName': secondName.value,
          'period': periodChecked
        };

        localStorage.setItem('tax', JSON.stringify(tax));
      }

      if (stepCurrent === 2 && !tax.patient) {
        const successText = 'Добавьте хотя бы одного пациента!';
        $('#success-form').find('.success-text').text(successText);
        $('#success-form').modal('show');
        error = true;
      }

      if (!error) {
        hideTab(stepCurrent);
        showTab(stepCurrent + 1);
      }
    });
  }

  // валидация
  const requiredTexts = document.querySelectorAll('.required-text');
  for (const requiredText of requiredTexts) {
    requiredText.addEventListener('keyup', function (e) {
      if (e.target.value.length > 2) this.parentElement.classList.remove('error');
    });
    requiredText.addEventListener('blur', function (e) {
      if (e.target.value.length > 2) this.parentElement.classList.remove('error');
    });
  }

  // кнопка назад
  const backBtns = document.querySelectorAll(`.btn-back`);
  for (const backBtn of backBtns) {
    backBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const stepCurrent = e.target.getAttribute('data-step');
      hideTab(stepCurrent);
      showTab(parseInt(stepCurrent) - 1);
    });
  }

  // добавляем пациента
  const addPatient = document.querySelector('.add-patient');
  const patientBlock = document.querySelector('.patient-block');
  let patietnId = 0;

  addPatient.addEventListener('click', function (e) {
    e.preventDefault();
    const lastName = document.querySelector('input[name=patient-lastname]');
    const firstName = document.querySelector('input[name=patient-firstname]');
    const secondName = document.querySelector('input[name=patient-secondname]');
    const dr = document.querySelector('input[name=patient-dr]');
    const who = document.querySelector('.patient-who');

    if (!lastName.value) {
      lastName.parentElement.classList.add('error');
      error = true;
    }
    if (!firstName.value) {
      firstName.parentElement.classList.add('error');
      error = true;
    }
    if (!secondName.value) {
      secondName.parentElement.classList.add('error');
      error = true;
    }
    if (!dr.value) {
      dr.parentElement.classList.add('error');
      error = true;
    }

    if (lastName.value && firstName.value && secondName.value && dr.value) {
      const div = document.createElement('div');
      div.className = 'patient';
      div.innerHTML = `${patietnId + 1}. ${lastName.value} ${firstName.value.substring(0, 1)}. ${secondName.value.substring(0, 1)}.`;
      patientBlock.append(div);

      if (!tax.patient) tax.patient = {};

      tax.patient[patietnId] = {
        'lastName': lastName.value,
        'firstName': firstName.value,
        'secondName': secondName.value,
        'dr': dr.value,
        'who': who.value
      };

      error = false;

      localStorage.setItem('tax', JSON.stringify(tax));
      patietnId++;
      lastName.value = '';
      firstName.value = '';
      secondName.value = '';
      dr.value = '';
    }
  });

  // отправка данных
  const btnSendTax = document.querySelector(`.btn-send-nalog`);
  if (btnSendTax) {
    btnSendTax.addEventListener('click', function (e) {
      e.preventDefault();

      if (!phone.value) {
        phone.parentElement.classList.add('error');
        error = true;
      }
      if (!email.value) {
        email.parentElement.classList.add('error');
        error = true;
      }

      if (phone.value && email.value) {
        tax.contacts = {
          'phone': phone.value,
          'email': email.value,
          'comment': comment.value
        };

        localStorage.setItem('tax', JSON.stringify(tax));
        $.ajax({
          type: 'POST',
          url: '/local/ajax/tax.php',
          data: `data=${JSON.stringify(tax)}`,
          dataType: 'json',
          beforeSend: function () {
          },
          success: function (data) {
            if (data.status) {
              const successText = 'Ваше заявление успешно отправлено!';
              $('#success-form').find('.success-text').text(successText);
              $('#success-form').modal('show');
              localStorage.removeItem('tax');
              patientBlock.innerHTML = '';
              $('#form-nalog')[0].reset();
              hideTab(3);
              showTab(1);
            } else {
              alert('Ошибка!');
            }
          }
        });
      }
    });
  }
}
