import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiClient } from "../../api/api";
import { Loader } from "../../shared/ui/Loader/Loader";

export const ServerGuard = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkServer = async () => {
      try {
        if (!(await apiClient.checkedServer()).success) {
          navigate("/tech", { replace: true });
          return;
        }
      } catch {
        navigate("/tech", { replace: true });
        return;
      }

      setLoading(false);
    };

    checkServer();
  }, [navigate]);

  if (loading) {
    return <Loader fullScreen text="Проверка сервера..." size="large" />;
  }

  return children;
};
