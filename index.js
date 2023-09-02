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

let prevTouchTime = Date.now()
const MIN_SCREEN_TIME_IN_MILIS = 3_000

window.onload = function() {
  const pages = $('.page')
  pages.each(function(i,e){
    let sectionViewed = false
    $(this).click(function(event){
      const currentTime = Date.now()

      if( i === pages.length-1 ||
        !sectionViewed && 
        currentTime - prevTouchTime < MIN_SCREEN_TIME_IN_MILIS) return

      sectionViewed = true
      prevTouchTime = currentTime
      const self = this

      if(self.id === "start_section")
        bgAudioElement.play()

      playSound('smb3_enter_level.wav')

      var x = event.pageX;
      var y = event.pageY;

      var nextItem = i + 1;
      if (nextItem >= pages.length){
        nextItem = 1;
      }
      
      $(pages[nextItem]).css('z-index', parseInt($(this).css('z-index')) + 2);
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

            pages[i].style = "display: none;"
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

function characterIn(event) {
  const el = event.currentTarget
  const characterEl = el.querySelectorAll('.op_character')[0]
  const confirmAssistance = Array.from(characterEl.classList).includes('character_yes')

  characterEl.classList.add('animate__animated', 'animate__slideOutDown')

  playSound('smb_pipe.wav')

  setTimeout(() => {
    sendMessage(confirmAssistance)
  }, 1_500)
}

function sendMessage(confirm) {
  const textMessage = confirm ? "Genial! Contá conmigo." : "Lo siento, no puedo."
  const responsible = new URLSearchParams(location.search).get('res')
  const phone = responsible === "carla" ? "1169295449" : "1126482560"
  const whatsappLink = `https://wa.me/+540${phone}/?text=${encodeURI(textMessage)}`
  
  location.href = whatsappLink
}

function stopAnimation(event) {
  event.currentTarget.children[0].classList.add('animate__paused')
}

function restart(event) {
  event.currentTarget.children[0].classList.add('animate__paused')
  playSound('smb_1-up.wav')

  setTimeout(() => {
    window.location.reload()
  }, 1_000)
}