import { useNavigate } from "react-router-dom";
import Profile from "./Profile";

export default function ProfilePage() {
  const navigate = useNavigate();
  return <Profile onBack={() => navigate("/")} />;
}
