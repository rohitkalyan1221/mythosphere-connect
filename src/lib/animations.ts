
import { useEffect, useState } from 'react';

export function useScrollAnimation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrolled;
}

export function useIntersectionObserver(options = {}) {
  const [elements, setElements] = useState<Map<Element, boolean>>(new Map());
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        setElements(prev => new Map(prev).set(entry.target, entry.isIntersecting));
      });
    }, options);

    setObserver(observer);

    return () => observer.disconnect();
  }, [options]);

  const observe = (element: Element) => {
    if (!element || !observer) return;
    observer.observe(element);
    setElements(prev => new Map(prev).set(element, false));
    return () => {
      observer.unobserve(element);
      setElements(prev => {
        const newMap = new Map(prev);
        newMap.delete(element);
        return newMap;
      });
    };
  };

  return { observe, elements };
}
