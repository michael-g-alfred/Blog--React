export default function PanelLayout({ children, className = "" }) {
  return (
    <div
      className={`absolute font-bold flex flex-col justify-center gap-1 p-1 border-3 border-blue-900 backdrop-blur-md bg-blue-50/70 rounded-lg z-40 transition-all duration-100 ease-in-out transform ${className}`}>
      {children}
    </div>
  );
}
