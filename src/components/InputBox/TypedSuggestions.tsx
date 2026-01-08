
import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js'; // [1](https://hotgithub.com/projects/typedjs/)[2](https://dev.to/kristinegusta/how-to-use-typedjs-in-react-beginner-friendly-dnc)

const TypedTitle: React.FC = () => {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const typed = new Typed(el.current!, {
      strings: ["¿En qué piensas?", "¿Cómo estás?", "Cuéntame un chiste"],
      startDelay: 100,
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 1000,
      loop: true,
    });

    return () => {
      typed.destroy(); // limpia recursos cuando el componente se desmonta
    };
  }, []);

  return (
    <h1 style={{fontSize: "1em"}}>
      <span ref={el} style={{color: "var(--text-color)"}}></span>
    </h1>
  );
};

export default TypedTitle;
