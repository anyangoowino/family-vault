import { createBrowserRouter } from "react-router";
import AppShell from "../components/AppShell";
import Landing from "../pages/Landing";
import NotFound from "../pages/NotFound";
import Learn from "../pages/Learn";
import Wizard from "../pages/Wizard";
import Dashboard from "../pages/Dashboard";
import Fund from "../pages/Fund";
import Recovery from "../pages/Recovery";
import RecoveryPlan from "../pages/RecoveryPlan";
import FlashPack from "../pages/FlashPack";
import Settings from "../pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppShell,
    children: [
      { index: true, Component: Landing },
      { path: "learn", Component: Learn },
      { path: "setup", Component: Wizard },
      { path: "dashboard", Component: Dashboard },
      { path: "fund", Component: Fund },
      { path: "recovery", Component: Recovery },
      { path: "recovery-plan", Component: RecoveryPlan },
      { path: "flash-pack", Component: FlashPack },
      { path: "settings", Component: Settings },
      { path: "*", Component: NotFound },
    ],
  },
]);
