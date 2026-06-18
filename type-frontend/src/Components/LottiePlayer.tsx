import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import aiThinkingAnimation from "../Assets/placidplace-pattern-18024.json";

export default function LottiePlayer({ style }: { style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const anim = lottie.loadAnimation({
      container: ref.current,
      animationData: aiThinkingAnimation,
      renderer: "svg",
      loop: true,
      autoplay: true,
    });
    return () => anim.destroy();
  }, []);

  return <div ref={ref} style={style} />;
}