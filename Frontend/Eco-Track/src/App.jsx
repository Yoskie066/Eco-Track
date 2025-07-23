import HomepageRoutes from "./routes/HomepageRoutes/HomepageRoutes";
import AuthRoutes from "./routes/AuthRoutes/AuthRoutes";
import UserRoutes from "./routes/UserRoutes/UserRoutes";

function App() {
  return (
    <>
      <HomepageRoutes />
      <AuthRoutes />
      <UserRoutes />
    </>
  );
}

export default App;

