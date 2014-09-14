Install
---

    $ component install kelonye/component-animate-cubic-bezier-curve

Usage
---

```javascript

  var canvas = document.createElement('canvas');
  canvas.width = 300.5;
  canvas.height = 300.5;
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#aaa';
  ctx.moveTo(20.5, 20.5);
  ctx.bezierCurveTo(40.5, 100.5 , 200.5, 200.5, 220.5, 20.5);
  ctx.stroke();

  var animation = require('component-animate-cubic-bezier-curve');
  animation(20.5, 20.5, 40.5, 100.5 , 200.5, 200.5, 220.5, 20.5)
    .color('deepskyblue')
    .draw(canvas);

```

So,

```javascript

  var canvas = document.createElement('canvas');
  canvas.width = 300.5;
  canvas.height = 300.5;
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#aaa';
  ctx.moveTo(20.5, 20.5);
  ctx.bezierCurveTo(40.5, 100.5 , 200.5, 200.5, 220.5, 20.5);
  ctx.stroke();

```

yields ...

![](https://dl.dropbox.com/u/30162278/component-animate-cubic-bezier-curve-a.png)

then,

```javascript

  var animation = require('component-animate-cubic-bezier-curve');
  animation(20.5, 20.5, 40.5, 100.5 , 200.5, 200.5, 220.5, 20.5)
    .color('deepskyblue')
    .draw(canvas);

```

yields ...

![](https://dl.dropbox.com/u/30162278/component-animate-cubic-bezier-curve-b.png)

Example
---

See [demo](http://component.herokuapp.com/#/5415b9380d29961900b7fdca)

    $ make example

## Api

### Animation(ax, ay, bx, by, cx, cy, dx, dy)

  Initialize a new Animation with `ax`, `ay`, `bx`, `by`, `cx`, `cy`, `dx` and `dy` as

  ```javascript
  ctx.moveTo(ax, ay);
  ctx.bezierCurveTo(bx, by, cx, cy, dx, dy);
  ```

### Animation#color(string)

  Set the stroke style, which the animation will use. For example,

  ```javascript
    var animation = require('component-animate-cubic-bezier-curve');
    animation(20.5, 20.5, 40.5, 100.5 , 200.5, 200.5, 220.5, 20.5)
      .color('deepskyblue')
      .draw(canvas);
  ```

### Animation#ease(function)

  Apply easing `function`. For example,

  ```javascript
    var animation = require('component-animate-cubic-bezier-curve');
    animation(20.5, 20.5, 40.5, 100.5 , 200.5, 200.5, 220.5, 20.5)
      .ease(function(t, b, c, d) {
        t /= d/2;
        if (t < 1) {
          return c / 2 * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      })
      .color('deepskyblue')
      .draw(canvas);
  ```

### Animation#draw(canvas)

  Initialize animation using `canvas` properties

License
---

MIT