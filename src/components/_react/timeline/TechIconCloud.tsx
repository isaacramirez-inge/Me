import React, { useEffect, useRef, useState } from 'react';
import './TechIconCloud.css';
import type { TechIconCloudProps, IconState } from './TimelineTypes';
import { useMediaQuery } from 'react-responsive';
import { breakpoints } from '../../../styles/breakpoints';


function detectCollision(a: IconState, b: IconState, ICON_SIZE: number, ICON_MARGIN: number) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return dist < ICON_SIZE + ICON_MARGIN / 2;
  
}

const TechIconCloud: React.FC<TechIconCloudProps> = ({  base_path, technologies, techAll }) => {
  

  const isMobile = useMediaQuery({ query: breakpoints.mobile });
  const ICON_SIZE = isMobile ? 30 : 30; // px
  const ICON_MARGIN = 10; // px
  const INITIAL_SPEED = 0.3; // px/frame (lento)
  const FINAL_SPEED = 0.2; // px/frame (más suave)


  const techList = techAll.filter(tech => technologies.includes(tech.id));
  const uniqueTechs = Array.from(
    new Map(
      techList
        .filter(t => typeof t.logo_path === 'string' && t.logo_path)
        .map(t => [t.name, {
          logo_path: `/${base_path}/img/icon/${t.logo_path}${t.extension}`,
          name: t.name
        }])
    ).values()
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [iconStates, setIconStates] = useState<IconState[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // --- CÓDIGO MODIFICADO ---
  // Reemplazamos el event listener de scroll por un IntersectionObserver para mayor rendimiento.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Actualiza el estado 'isVisible' basado en si el elemento está intersectando el viewport.
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null, // Observa intersecciones con el viewport del navegador.
        rootMargin: '0px',
        threshold: 0.1 // Se activa cuando al menos el 10% del elemento es visible.
      }
    );

    const currentContainer = containerRef.current; // Capturamos el valor actual de la ref.

    if (currentContainer) {
      observer.observe(currentContainer);
    }

    // Función de limpieza para dejar de observar cuando el componente se desmonte.
    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, []); // El array de dependencias vacío asegura que esto se ejecute solo una vez.


  // Usar ResizeObserver para obtener el tamaño real del contenedor
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });
    observer.observe(containerRef.current);
    // Inicializar tamaño al montar
    const rect = containerRef.current.getBoundingClientRect();
    setContainerSize({ width: rect.width, height: rect.height });
    return () => observer.disconnect();
  }, []);

  // Inicializar iconos en cuadrícula centrada cuando el tamaño es válido
  useEffect(() => {
    const { width, height } = containerSize;
    if (!width || !height) return;
    // Esperar un tick para asegurar layout
    const timeout = setTimeout(() => {
      const n = uniqueTechs.length;
      if (n === 0) return;
      // Calcular filas y columnas para cuadrícula más cuadrada posible
      const cols = Math.ceil(Math.sqrt(n * width / height));
      const rows = Math.ceil(n / cols);
      // Espacio horizontal y vertical para distribuir uniformemente
      const totalW = cols * ICON_SIZE + (cols - 1) * ICON_MARGIN;
      const totalH = rows * ICON_SIZE + (rows - 1) * ICON_MARGIN;
      const offsetX = Math.max((width - totalW) / 2, 0);
      const offsetY = Math.max((height - totalH) / 2, 0);
      const states: IconState[] = [];
      for (let i = 0; i < n; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        states.push({
          x: offsetX + col * (ICON_SIZE + ICON_MARGIN),
          y: offsetY + row * (ICON_SIZE + ICON_MARGIN),
          dx: 0,
          dy: 0,
          speed: 0,
          iconIdx: i,
        });
      }
      setIconStates(states);
    }, 50);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [uniqueTechs.length, containerSize.width, containerSize.height]);

  // Cuando el contenedor es visible, asignar dirección y velocidad aleatoria baja
  useEffect(() => {
    if (!isVisible || iconStates.length === 0) return;
    setIconStates(prevStates =>
      prevStates.map(icon => {
        if (icon.dx !== 0 || icon.dy !== 0) return icon; // ya tiene dirección
        const angle = Math.random() * 2 * Math.PI;
        return {
          ...icon,
          dx: Math.cos(angle),
          dy: Math.sin(angle),
          speed: INITIAL_SPEED,
        };
      })
    );
  }, [isVisible, iconStates.length]);
  
  useEffect(() => {
    // Si no es visible y los iconos ya se están moviendo, no canceles la animación.
    // Solo detenla si quieres que se pare al salir del viewport.
    // Para este caso, solo arrancamos la animación si es visible.
    if (!isVisible || iconStates.length === 0) return;
    
    let frame: number;
    const animate = () => {
      setIconStates(prevStates => {
        if (!containerRef.current) return prevStates;
        const rect = containerRef.current.getBoundingClientRect();
        const newStates = prevStates.map(icon => {
          const { x, y, iconIdx } = icon;
          let {speed, dx, dy } = icon;
          // Sin desaceleración, velocidad constante
          if (speed > FINAL_SPEED) speed = FINAL_SPEED;
          let nextX = x + dx * speed;
          let nextY = y + dy * speed;
          // Rebote en los bordes
          if (nextX < 0) { nextX = 0; dx = -dx; }
          if (nextX > rect.width - ICON_SIZE) { nextX = rect.width - ICON_SIZE; dx = -dx; }
          if (nextY < 0) { nextY = 0; dy = -dy; }
          if (nextY > rect.height - ICON_SIZE) { nextY = rect.height - ICON_SIZE; dy = -dy; }
          return { x: nextX, y: nextY, dx, dy, speed, iconIdx };
        });
        // Colisiones entre iconos (perfect elastic mode)
        for (let i = 0; i < newStates.length; i++) {
          for (let j = i + 1; j < newStates.length; j++) {
            if (detectCollision(newStates[i], newStates[j], ICON_SIZE, ICON_MARGIN)) {
              // Intercambiar vectores de velocidad (dx, dy)
              const tempDx = newStates[i].dx;
              const tempDy = newStates[i].dy;
              newStates[i].dx = newStates[j].dx;
              newStates[i].dy = newStates[j].dy;
              newStates[j].dx = tempDx;
              newStates[j].dy = tempDy;
              // No separar ni aleatorizar dirección
            }
          }
        }
        return newStates;
      });
      frame = requestAnimationFrame(animate);
    };

    // Solo inicia la animación si hay movimiento
    if (iconStates.some(icon => icon.speed > 0)) {
        frame = requestAnimationFrame(animate);
    }
    
    return () => cancelAnimationFrame(frame);
  }, [isVisible, iconStates]);

  return (
    <div className="tech-icon-cloud dvd-cloud xs:p-l[15%]" ref={containerRef} style={{ position: 'relative', height: '100%', minHeight: 120 }}>
      {iconStates.length === uniqueTechs.length && uniqueTechs.map((tech, idx) => (
        <img
          key={tech.name + idx}
          src={tech.logo_path}
          alt={tech.name}
          className="tech-icon-cloud-img dvd-icon"
          title={`${tech.name} + ${/*techAll.find(t => t.name === tech.name)?.id || */''}`}
          style={{
            position: 'absolute',
            transform: `translate3d(${iconStates[idx]?.x ?? 0}px, ${iconStates[idx]?.y ?? 0}px, 0)`,
            width: ICON_SIZE,
            height: ICON_SIZE,
            pointerEvents: 'auto',
            zIndex: 2,
            transition: 'box-shadow 0.2s',
          }}
          loading="lazy"
        />
      ))}
    </div>
  );
};

export default TechIconCloud;
