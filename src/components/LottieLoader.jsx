import Lottie from "lottie-react";
import loaderAnimation from "../assets/lotties/loader.json";

export default function LottieLoader({
  size = 96,
  className = "",
  loop = true,
  autoplay = true,
  title = "Chargement",
}) {
  return (
    <div
      className={className}
      role="status"
      aria-live="polite"
      aria-label={title}
    >
      <Lottie
        animationData={loaderAnimation}
        loop={loop}
        autoplay={autoplay}
        style={{ width: size, height: size }}
      />
    </div>
  );
}

