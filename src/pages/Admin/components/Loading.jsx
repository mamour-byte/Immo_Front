// components/Loading.jsx
import LottieLoader from "../../../components/LottieLoader";

export default function Loading({ message = "Chargement..." }) {
  return (
    <div className="flex items-center justify-center p-6">
      <LottieLoader size={64} className="mr-3" title={message} />
      <div className="text-gray-600">{message}</div>
    </div>
  );
}
