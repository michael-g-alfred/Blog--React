export default function FormLayout({ children }) {
  return (
    <div className="w-full flex justify-center px-2">
      <div className="max-w-md w-full p-4 sm:p-6 flex flex-col gap-3 bg-blue-50/70 rounded-lg shadow-sm">
        {children}
      </div>
    </div>
  );
}
