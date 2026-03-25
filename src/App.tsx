import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ActivityManagement } from "./pages/ActivityManagement";
import { AttendanceTracking } from "./pages/AttendanceTracking";
import { CreateActivity } from "./pages/CreateActivity";
import { Dashboard } from "./pages/Dashboard";
import { ItemDelivery } from "./pages/ItemDelivery";
import { LeaveManagement } from "./pages/LeaveManagement";
import { Login } from "./pages/Login";
import { MemberDetail } from "./pages/members/MemberDetail";
import { MemberForm } from "./pages/members/MemberForm";
import { MemberList } from "./pages/members/MemberList";
import { VotingSystem } from "./pages/VotingSystem";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="create-activity" element={<CreateActivity />} />
          <Route path="leave" element={<LeaveManagement />} />
          <Route path="attendance" element={<AttendanceTracking />} />
          <Route path="item-delivery" element={<ItemDelivery />} />
          <Route path="activity-management" element={<ActivityManagement />} />
          <Route path="voting" element={<VotingSystem />} />
          <Route path="members" element={<Outlet />}>
            <Route index element={<MemberList />} />
            <Route path="new" element={<MemberForm mode="create" />} />
            <Route path=":id/edit" element={<MemberForm mode="edit" />} />
            <Route path=":id" element={<MemberDetail />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
