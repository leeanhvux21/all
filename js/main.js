function loadPost(offset, limit) {
    let content_center = $('#feed-main');
    mHeritageGoService.getPhotos({offset: offset, limit: limit})
        .then(photos => {
            $(photos).each(function () {
                mHeritageGoService.getPhoto(this)
                    .then(photo => {
                        console.log(photo);
                        let new_content = content_center.clone();
                        new_content.find('.feed-head').addClass(photo['photo_id']);
                        new_content.find('#profile-img').attr("src", "http:" +
                                    photo['account']['picture_url'] + "?size=medium");
                        new_content.find('#photo-title').text(photo['title'][0]['content']);
                        new_content.find('#photo-location').text(photo['area_name']);
                        new_content.find('#photo-time').text(photo['creation_time'].substring(0,4));
                        new_content.find('#photo-image').attr("src", "http:" + photo['image_url'] + "?size=medium");
                        new_content.find('#photo-like').text(photo['like_count']);
                        new_content.find('#photo-comment').text(photo['comment_count']);
                        new_content.find('#photo-view').text(photo['view_count']);
                        new_content.removeAttr('hidden');
                        new_content.appendTo($('.main'));
                    })
                    .catch(error => {
                        console.log(error);
                    });
            });
        })
        .catch(error => {
            console.log(error);
        });
};


function getLanguages() {
  var languages = navigator.languages;
  let base_content = $('#single_lang');
  let dropdown_menu = base_content.parent();
  for (var i = 0; i < languages.length; i++) {
    if (languages[i].length == 2) {
      content_clone = base_content.clone()
      console.log(content_clone)
      let language = native_code[languages[i]].split(", ")[0];
      content_clone.find('#lang_container').text(language);
      content_clone.find('#lang_container').attr('class', alpha1_alpha3[languages[i]]);
      dropdown_menu.append(content_clone);
    }
  }
};


function LoadOnScroll(offset, limit) {
  $(window).on('scroll',function() {
       if ($(window).scrollTop() + $(window).height() > $(document).height() -
          50 && ($(window).scrollTop() + $(window).height() < $(document).height())) {
            console.log($(window).scrollTop() + $(window).height() ,$(document).height() - 50);
            loadPost(offset, limit);
            offset += limit;
       }
    });
}

function input(language) {

  var class1 = $(language).parents('.feed-head').attr('class').split(" ")[1];
  var lang = language.textContent;
  var lang_code = language.classList[0];
  console.log(lang_code);
  $('.' + class1).find('.input-title').show();
  $('.' + class1).find('.translate-icon').hide();
  $('.' + class1).find('.photo-title').hide();
  $('.' + class1).find('.language').show();
  console.log($('.' + class1).find('.language'))
  $('.' + class1).find('.language').html(lang);
  $('.' + class1).find('.input-title:last').attr('id', class1 + '+' + lang_code);
};

function add(input, event){

  if(event.keyCode == 13){
    var class1 = $(input).parents('.feed-head').attr('class').split(" ")[1];
    $('.' + class1).find('.input-title').hide();
    $('.' + class1).find('.translate-icon').show();
    $('.' + class1).find('.language').hide();
    $('.' + class1).find('.photo-title').show();
    var caption = input.value;
    var photo_id = input.id.split('+')[0];
    var locale = input.id.split('+')[1];
    mHeritageGoService.suggestPhotoCaption(photo_id, caption, locale)
    .catch(error => {
    console.log(error);
    });
  }
}
function showLoginForm(){
  $("#loginModal").modal();
};


function showPass(){
  $("#password").attr("type","text");
  $("#open").hide();
  $("#close").show();
};


function hidePass(){
  $("#password").attr("type","password");
  $("#close").hide();
  $("#open").show();
};


function blurContent() {
  var content = $('.main'),
      header = $('.header');
  $(content).clone().prependTo(header).addClass('blurred');

  var blur = 'blur(.5em)';
  $('.blurred').css({
  'background': '#fff',
  '-webkit-filter': blur,
  'filter': blur
  });
};


function BlurOnScroll() {
  $(document).scroll(function(){
  var scroll = $(this).scrollTop();
  var window_width = $(window).width()
  if (window_width <= 425) {
    scroll /= 0.706;
  };
  if (window_width <= 375) {
    scroll /= 0.83;
  }
  $('.blurred').css({
    '-webkit-transform' : 'translateY(-'+scroll+'px)',
    'transform' : 'translateY(-'+scroll+'px)'
  });
  })
};

var button;

function changeCaret(dropdown_button){
  if (button != undefined && button != dropdown_button){
    $(button).find('#up').hide();
    $(button).find('#down').show();
    $(button).find('#translate-icon').attr('class', 'shake');
  }
  var caretup = document.getElementById('up');
  if($(dropdown_button).find('#translate-icon').hasClass("shake")) {
    caretup.style.display = 'none';
    $(dropdown_button).find('#down').hide();
    $(dropdown_button).find('#up').show();
    $(dropdown_button).find('#translate-icon').removeAttr('class', 'shake');
  }
  else {
    caretup.style.display = 'inline-block';
    $(dropdown_button).find('#up').hide();
    $(dropdown_button).find('#down').show();
    $(dropdown_button).find('#translate-icon').attr('class', 'shake');
  }
  button = dropdown_button;
}




$(document).ready(function() {
  loadPost(0,5);
  LoadOnScroll(0,1);
  getLanguages();
  blurContent();
  BlurOnScroll();
  changeCaret();
  $(document).click(function()
  {
    $(button).find('#up').hide();
    $(button).find('#down').show();
    $(button).find('#translate-icon').attr('class', 'shake');
  })
});
