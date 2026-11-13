import { RouterProvider } from "react-router";
import { router } from "./app/routes";
import { VaultProvider } from "./lib/VaultContext";

export default function App() {
  return (
    <VaultProvider>
      <RouterProvider router={router} />
    </VaultProvider>
  );
}
