function onStart(event) {
    event.preventDefault()

    const soundSrc = event.target.dataset.src
    const scrollId = event.target.dataset.scroll

    playSound(soundSrc)

    setTimeout(() => {
        scrollToSection(scrollId)
        const section = document.getElementById(scrollId)
        section.children[0].classList.add("animate__animated", "animate__bounceOutUp")
    }, 1000)
}

function scrollToSection(id) {
    let e = document.getElementById(id);
    e.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
      inline: 'start'
    });
}

function playSound(src) {
    const audioElement = new Audio(src);

    audioElement.play();
}

window.onload = function() {
    $('.page').each(function(i,e){
        $(this).click(function(event){
          var x = event.pageX;
          var y = event.pageY;

          var nextItem = i + 1;
          if (nextItem >= $('.page').length){
            nextItem = 0;
          }
          
          $('.page:eq('+ nextItem +')').css('z-index', parseInt($(this).css('z-index')) + 1);
          $('.page:eq('+ nextItem +')').css('clip-path', 'circle(0% at '+ x +'px '+ y +'px)');
          
          anime({
            targets: $('.page')[nextItem],
            update: function(anim) {
              $('.page:eq('+ nextItem +')').css('clip-path', 'circle('+ (anim.progress*2) +'% at '+ x +'px '+ y +'px)');
            }
          });
        });
      });
}