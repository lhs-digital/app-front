import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./contexts/auth";
import RoutesApp from "./routes";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoutesApp />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
