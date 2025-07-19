import { AuthProvider } from "./context/AuthProvider";
import { PostProvider } from "./context/PostContext";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <PostProvider>
        <AuthProvider>
          <Navbar />
          <AppRoutes />
        </AuthProvider>
      </PostProvider>
    </>
  );
}

export default App;
