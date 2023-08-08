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

const bgAudioElement = new Audio("/src/audio/smb_bg.mp3")
let audioElement

function playSound(src) {
    audioElement?.pause()
    audioElement = new Audio("/src/audio/" + src);
    audioElement.play();
}

window.onload = function() {
  const pages = $('.page')
  pages.each(function(i,e){
    $(this).click(function(event){
      const self = this

      if(self.id === "start_section") {
        bgAudioElement.play()
      } else {
        playSound('smb3_enter_level.wav')
      }
      var x = event.pageX;
      var y = event.pageY;

      var nextItem = i + 1;
      if (nextItem >= pages.length){
        nextItem = 1;
      }
      
      $(pages[nextItem]).css('z-index', parseInt($(this).css('z-index')) + 1);
      $(pages[nextItem]).css('clip-path', 'circle(0% at '+ x +'px '+ y +'px)');

      anime({
        targets: $('.page')[nextItem],
        update: function(anim) {
          $(pages[nextItem]).css('clip-path', 'circle('+ (anim.progress*2) +'% at '+ x +'px '+ y +'px)');
          
          if(anim.progress === 100) {
            pages[nextItem].querySelectorAll(`.animate__paused`)
              .forEach((el) => el.classList.remove('animate__paused'))
            
            if(self.id === "start_section") {
              self.remove()
            }
          }
        }
      });
    });
  });
}

window.onblur = function() {
  if(audioElement)
    audioElement.pause()

  if(bgAudioElement)
    bgAudioElement.pause()
}

window.onfocus = function() {
  // if(audioElement && audioElement.paused && audioElement.currentTime !== 0) {
  //   audioElement.play()
  // }

  if(bgAudioElement && bgAudioElement.paused && bgAudioElement.currentTime !== 0) {
    bgAudioElement.play()
  }
}

