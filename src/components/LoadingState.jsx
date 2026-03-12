import LottieLoader from "./LottieLoader";

export default function LoadingState() {
  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className="flex flex-col items-center gap-2">
        <LottieLoader size={110} />
        <div className="text-gray-500 text-lg">Chargement...</div>
      </div>
    </div>
  );
}
