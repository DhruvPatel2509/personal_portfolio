import { useScrollProgress } from '../../hooks/useScrollProgress';

/** Thin gradient bar fixed to the top of the viewport showing scroll depth. */
const ScrollProgress = () => {
  const progress = useScrollProgress();
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent">
      <div
        className="h-full bg-gradient-primary transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ScrollProgress;
