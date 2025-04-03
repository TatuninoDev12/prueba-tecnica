import { MyRoutes } from "./routes/routes";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <>
      <MyRoutes />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}

export default App;
