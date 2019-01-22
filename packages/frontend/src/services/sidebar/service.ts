import Service from '@ember/service';

import { A } from '@ember/array';
import { computed } from '@ember-decorators/object';
import { notEmpty } from '@ember-decorators/object/computed';

import { syncToLocalStorage } from 'emberclear/src/utils/decorators';

export default class Sidebar extends Service {
  unreadAbove = A();
  unreadBelow = A();

  unreadObserver?: IntersectionObserver;

  @notEmpty('unreadAbove') hasUnreadAbove!: boolean;
  @notEmpty('unreadBelow') hasUnreadBelow!: boolean;

  @syncToLocalStorage
  get isShown(): boolean {
    return false;
  }

  type =           'left'; // 'left' or 'right'
  width =          85;     // 0-100
  maxWidth =       300;   // in px
  maskEnabled =    true;
  shadowEnabled =  true;
  triggerVelocity = 0.3;

  // private
  isDragging = false;
  isTransitioning = false;
  position = 0;
  dxCorrection = 0;

  @computed('width', 'maxWidth')
  get _width(){
    return Math.min(this.width) / 100 * window.innerWidth, this.maxWidth);
  }

  panOpen(e){
    this.set('isDragging', true);

    const { current: { distanceX } } = e;

    const width = this._width;

    // enforce limits on the offset [0, width]
    const targetPosition = Math.min(Math.max(distanceX, 0), width);

    this.set('position', targetPosition);
  }

  panOpenEnd(e){
    this.set('isDragging', false);

    const { current: { distanceX, velocityX, } } = e;

    const triggerVelocity = this.triggerVelocity;

    const width = this._width;

    const dx = distanceX;
    const vx = velocityX;

    // when overall horizontal velocity is high, force open/close and skip the rest
    if (vx > triggerVelocity || dx > width / 2) {
      this.show();
    } else {
      this.hide();
    }
  }

  // pan handlers for closing the menu
  didPan(e){
    const {
      current: {
        distanceX,
        x
      }
    } = e;

    const windowWidth = window.innerWidth;
    const width = this._width;

    const dx = distanceX;
    const cx = x;

    if(this.isOpen && !this.isDragging){
      // calculate and set a correction delta if the pan started outside the opened menu
      if(cx < width) {
        this.set('isDragging', true);
        this.set('dxCorrection', dx);
      }
    }

    if(this.get('isDragging')){
      let targetPosition = dx;

      // correct targetPosition with dxCorrection set earlier
      targetPosition -= this.get('dxCorrection');

      // enforce limits on the offset [0, width]
      if(cx < width){
        if(targetPosition > 0){
          targetPosition = 0;
        } else if(targetPosition < -1 * width){
          targetPosition = -1 * width;
        }
        this.set('position', width + targetPosition);
      }
    }
  }

  didPanEnd(e){
    if(this.isDragging){
      this.set('isDragging', false);

      const {
        current: {
          distanceX,
          velocityX
        }
      } = e;

      const triggerVelocity = this.triggerVelocity;

      const width = this._width;

      const dx = distanceX;
      const vx = velocityX;

      // the pan action is over, cleanup and set the correct final menu position
      if (vx < -1 * triggerVelocity || -1 * dx > width / 2){
        this.hide();
      } else {
        this.show();
      }

      this.set('dxCorrection', 0);
    }
  }


  show() {
    this.set('isShown', true);
  }

  hide() {
    this.set('isShown', false);
  }

  toggle() {
    this.set('isShown', !this.isShown);
  }

  clearUnreadBelow() {
    this.unreadBelow.clear();
  }

  clearUnreadAbove() {
    this.unreadAbove.clear();
  }

  observeIntersectionOf(id: string) {
    this.ensureUnreadIntersectionObserverExists();

    const target = document.getElementById(id);

    this.unreadObserver!.observe(target!);
  }

  private ensureUnreadIntersectionObserverExists() {
    if (this.unreadObserver) return;

    this.unreadObserver = this.createUnreadObserver();
  }

  private createUnreadObserver(): IntersectionObserver {
    const callback = this.handleIntersectionEvent.bind(this);
    const io = new IntersectionObserver(callback, {
      root: document.querySelector('.sidebar-wrapper aside.menu'),
      rootMargin: '-50px 0px -50px 0px',
    });

    return io;
  }

  private handleIntersectionEvent(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      const target = entry.target;
      const id = target.id;
      const { boundingClientRect, rootBounds, isIntersecting } = entry;
      const isBelow = boundingClientRect.top > rootBounds.bottom;
      const isAbove = boundingClientRect.top < rootBounds.top;

      if (isIntersecting) {
        this.unreadAbove.removeObject(id);
        this.unreadBelow.removeObject(id);
      }

      if (isBelow) {
        this.unreadBelow.addObject(id);
      }

      if (isAbove) {
        this.unreadAbove.addObject(id);
      }
    });
  }
}
