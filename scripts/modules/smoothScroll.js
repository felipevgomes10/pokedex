export default (function smoothScroll() {
  const btn = document.querySelector('.button');
  const events = ['click', 'touchstart'];

  function handleClick() {
    window.scroll({
      top: 0,
      behavior: 'smooth',
    })
  }

  events.forEach(userEvent => {
    btn. addEventListener(userEvent, handleClick);
  });

})();