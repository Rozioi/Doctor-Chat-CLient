import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { ProtectedRoute } from "../ui/ProtectedRoute";
import { Loader } from "../../shared/ui/Loader/Loader";
import { LoadingFallback } from "../../shared/ui/Loader/LoadingFallback";
import { ServerGuard } from "../ui/ServerGuard";
import { PublicLayout } from "../../layouts/PublicLayout";
const PersonalAccountPage = lazy(
  () => import("../../pages/PersonalAccount/PersonalAccountPage"),
);
const DoctorProfilePage = lazy(() =>
  import("../../pages/DoctorProfile/DoctorProfilePage").then((module) => ({
    default: module.DoctorProfilePage,
  })),
);
const PdfViewer = lazy(() => import("../../shared/ui/InfoPage/InfoPage"));

const preloadMain = () => import("../../pages/Main/Main");
const preloadSearch = () => import("../../pages/DoctorSearch/DoctorSearch");

const OnBoardingPage = lazy(() =>
  import("../../pages/Onboarding/ui/Onboarding").then((module) => ({
    default: module.OnBoardingPage,
  })),
);
const LoginPage = lazy(() => import("../../pages/Autheticated/ui/LoginPage"));
const RegisterPage = lazy(
  () => import("../../pages/Autheticated/ui/RegisterPage"),
);
const DoctorRegisterPage = lazy(
  () => import("../../pages/Autheticated/ui/DoctorRegisterPage"),
);
const Main = lazy(() => import("../../pages/Main/Main"));
const AnalysisSelectionPage = lazy(
  () => import("../../pages/AnalysisSelectionPage/AnalysisSelectionPage"),
);
const DoctorSearchPage = lazy(
  () => import("../../pages/DoctorSearch/DoctorSearch"),
);
const MaintenancePage = lazy(
  () => import("../../pages/Maintenance/MaintenancePage"),
);
const PaymentPage = lazy(() => import("../../pages/Payment/PaymentPage"));
const PaymentSuccessPage = lazy(
  () => import("../../pages/Payment/PaymentSuccessPage"),
);
const PaymentFailPage = lazy(
  () => import("../../pages/Payment/PaymentFailPage"),
);
const ChatListPage = lazy(() => import("../../pages/ChatList/ChatListPage"));

if (typeof window !== "undefined") {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(
      () => {
        preloadMain();
        preloadSearch();
      },
      { timeout: 2000 },
    );
  } else {
    setTimeout(() => {
      preloadMain();
      preloadSearch();
    }, 100);
  }
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ServerGuard>
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        </ServerGuard>
      </Suspense>
    ),
    children: [
      { index: true, element: <Main /> },
      { path: "home", element: <Main /> },
      { path: "analyses", element: <AnalysisSelectionPage /> },
      { path: "search", element: <DoctorSearchPage /> },
      { path: "payment", element: <PaymentPage /> },
      { path: "chat", element: <ChatListPage /> },
      { path: "profile", element: <PersonalAccountPage /> },
      { path: "payment/success", element: <PaymentSuccessPage /> },
      { path: "payment/fail", element: <PaymentFailPage /> },

      {
        path: "search/doctor/:id",
        element: (
          <Suspense
            fallback={
              <Loader fullScreen text="Загрузка профиля..." size="large" />
            }
          >
            <DoctorProfilePage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/doctor",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ServerGuard>
          <PublicLayout />
        </ServerGuard>
      </Suspense>
    ),
    children: [
      {
        path: ":slug",
        element: <DoctorProfilePage />,
      },
    ],
  },
  {
    path: "/welcome",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <OnBoardingPage />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: "/doctor-registration",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <DoctorRegisterPage />
      </Suspense>
    ),
  },
  {
    path: "/info",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PdfViewer fileUrl="a.pdf" title="Информация" />
      </Suspense>
    ),
  },
  {
    path: "/tech",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <MaintenancePage />
      </Suspense>
    ),
  },
]);
