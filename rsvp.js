// El acceso flotante aparece solo entre la portada y la sección de confirmación.
const floatingRsvp = document.querySelector('.floating-rsvp');
const hero = document.querySelector('.hero');
const rsvp = document.querySelector('.rsvp');

if (floatingRsvp && hero && rsvp) {
  let scheduled = false;
  function update() {
    floatingRsvp.hidden = hero.getBoundingClientRect().bottom > 0 || rsvp.getBoundingClientRect().top <= window.innerHeight;
    scheduled = false;
  }
  function scheduleUpdate() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }
  update();
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
}
