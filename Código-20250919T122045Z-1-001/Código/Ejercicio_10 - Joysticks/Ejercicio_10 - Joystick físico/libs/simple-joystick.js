// Simple virtual joystick for desktop and mobile
// Adds a joystick overlay and exposes getAxis() for x, y values
class SimpleJoystick {
  constructor(container = document.body) {
    this.container = container;
    this.base = document.createElement('div');
    this.stick = document.createElement('div');
    this.base.className = 'joystick-base';
    this.stick.className = 'joystick-stick';
    this.base.appendChild(this.stick);
    this.container.appendChild(this.base);
    this.active = false;
    this.value = { x: 0, y: 0 };
    this.maxDistance = 50;
    this._initEvents();
  }
  _initEvents() {
    const start = (e) => {
      this.active = true;
      this._move(e);
      document.addEventListener('mousemove', move);
      document.addEventListener('touchmove', move, { passive: false });
      document.addEventListener('mouseup', end);
      document.addEventListener('touchend', end);
    };
    const move = (e) => {
      if (!this.active) return;
      this._move(e);
    };
    const end = () => {
      this.active = false;
      this.value = { x: 0, y: 0 };
      this.stick.style.transform = '';
      document.removeEventListener('mousemove', move);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchend', end);
    };
    this.base.addEventListener('mousedown', start);
    this.base.addEventListener('touchstart', start, { passive: false });
  }
  _move(e) {
    let clientX, clientY;
    if (e.touches && e.touches.length) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const rect = this.base.getBoundingClientRect();
    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top + rect.height / 2);
    const dist = Math.min(this.maxDistance, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);
    const x = dist * Math.cos(angle);
    const y = dist * Math.sin(angle);
    this.stick.style.transform = `translate(${x}px, ${y}px)`;
    this.value = {
      x: +(x / this.maxDistance).toFixed(2),
      y: +(y / this.maxDistance).toFixed(2)
    };
  }
  getAxis() {
    return { ...this.value };
  }
}
window.SimpleJoystick = SimpleJoystick;
