/*
Este es un componente decorativo que genera puntos que se mueven en el canvas. Los puntos se conectan cuando se acercan.

useRef en este caso guarda el estado de nuestros puntos renderizados para que no se vuelvan a actualizar cuando cambia el componente


*/


import React, { useEffect, useRef } from 'react';
import '../estilos.css';

const CodeEffect = () => {

  //la referencia de nuestro canvas
  const canvasRef = useRef(null);


  // Configuración del canvas y la animación

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const dots = [];
    const dotCount = 50;
    const maxDistance = 100;


    //Esta es la object class Dot para crear los puntos

    class Dot {
      constructor(x, y, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
      }

      //funcion para "dibujar" el punto
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }

      //funcion para actualizar la posición en x/y del punto
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) {
          this.speedX *= -1;
        }

        if (this.y < 0 || this.y > canvas.height) {
          this.speedY *= -1;
        }

        this.draw();
      }
    }

    //funcion para crear los puntos usando nuestra class dots 
    function createDots() {
      for (let i = 0; i < dotCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = (Math.random() - 0.5) * 2;
        const speedY = (Math.random() - 0.5) * 2;
        const color = "white";
        dots.push(new Dot(x, y, speedX, speedY, color));
      }
    }

    //funcion para crear las lineas que se conectaran con los puntos al acercarse

    function drawLines() {
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const distance = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y);
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / maxDistance})`;
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
    }
    //Funcion de animar para que que se muevan los puntos
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dots.forEach(dot => {
        dot.update();
      });

      drawLines();
    }

    //creamos los puntos
    createDots();
    //animamos
    animate();
  }, []);

  return (
    <div id="codeEffect">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default CodeEffect;