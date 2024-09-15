import { Outlet } from "@remix-run/react";

export default function Layout() {
  return (
    <div className="w-full h-svh flex items-center justify-center">
      <Outlet />
    </div>
  );
}
