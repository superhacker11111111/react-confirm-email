import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TourProvider } from '@reactour/tour';
// eslint-disable-next-line import/no-extraneous-dependencies
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { Button } from '@mui/material';
// auth
import { initialize } from '../redux/actions/authAction';
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
import SetPasswordGuard from '../auth/SetPasswordGuard';
// import ResetPasswordGuard from '../auth/ResetPasswordGuard';
import OnboardingGuard from '../auth/OnboardingGuard';
// layouts
import MainLayout from '../layouts/main';
import SimpleLayout from '../layouts/simple';
import OnboardingLayout from '../layouts/onboarding';
import OnboardingToolbarLayout from '../layouts/onboardingToolbar';
// import ToolbarLayout from '../layouts/onboardingToolbar/ToobarLayout';
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
import TestLayout from '../layouts/onboardingLayout';
// config
import { PATH_AFTER_LOGIN } from '../config-global';
//

import {
  TestPage,
  // Page
  MeetingPage,
  OurStoryPage,
  SubscriptPage,
  StartedPage,
  ArPage,
  ShopperPage,
  OurFencePage,
  OurFenceDetailPage,
  // Auth
  LoginPage,
  SetPasswordPage,
  RegisterPage,
  VerifyCodePage,
  ResetPasswordVerifyCodePage,
  NewPasswordPage,
  ResetPasswordPage,
  ForgotPasswordPage,
  DownloadPage,
  // Dashboard: General
  GeneralAppPage,
  GeneralFilePage,
  GeneralBankingPage,
  GeneralBookingPage,
  GeneralEcommercePage,
  GeneralAnalyticsPage,
  GeneralFaqsupportPage,
  GeneralContactusPage,
  // Dashboard: User
  UserListPage,
  UserEditPage,
  UserCardsPage,
  UserCreatePage,
  UserProfilePage,
  UserAccountPage,
  UserUpdatePlanPage,
  UserSwitchBillingPage,
  UserPaymentMethodPage,
  UserAccountInfoPage,
  UserManageInfoPage,
  UserAlmostPage,
  UserPauseCongratulationPage,
  CancelSubscriptionCongratulationPage,
  UserPlanCongratulationPage,
  UserBillingCongratulationPage,
  UserPaymentCongratulationPage,
  UserInfoCongratulationPage,
  UserUserInfoCongratulationPage,
  UserCallForCancelPage,
  UserCallForSwitchPage,
  UserUpgradingProTrialPage,
  // Dashboard: Ecommerce
  EcommerceShopPage,
  EcommerceCheckoutPage,
  EcommerceProductListPage,
  EcommerceProductEditPage,
  EcommerceProductCreatePage,
  EcommerceProductDetailsPage,
  // Dashboard: Invoice
  InvoiceListPage,
  InvoiceDetailsPage,
  InvoiceCreatePage,
  InvoiceEditPage,
  InvoiceHistoryPage,
  // Dashboard: Blog
  BlogPostsPage,
  BlogPostPage,
  BlogNewPostPage,
  //
  BlogFencePage,
  BlogFencesPage,
  BlogFenceDetailPage,
  BlogFencesDetailPage,
  EDFencePage,
  // Dashboard: FileManager
  FileManagerPage,
  FileManagerRenamePage,
  // Dashboard: App
  ChatPage,
  MailPage,
  CalendarPage,
  KanbanPage,
  //
  BlankPage,
  PermissionDeniedPage,
  //
  DpaPage,
  Page500,
  Page403,
  Page404,
  HomePage,
  FaqsPage,
  AboutPage,
  Contact,
  PricingPage,
  PaymentPage,
  CheckoutPageV2,
  NewPaymentPage,
  TrialPaymentPage,
  PaymentUgradePage,
  RecommendDevicePage,
  DownloadFencePage,
  UserPricingUgradePage,
  UserAlmostUpgradePage,
  UserAlmostCongratulationPage,
  // ONBOARDING
  //
  AddUsersPage,
  OnboardingPage,
  SelectFencePageT,
  TutorialPage,
  AddFencePage,
  RequestFencePage,
  AddFencePageT,
  SelectFencePage,
  CategoryFencePage,
  StyleFencePage,
  DetailFencePage,
  SelectFenceConfirmPage,
  OnboardingDownloadAppPage,
  FenceRequestPage,
  FenceRequestCongratulation,
  PlanUpgradeCongratulationsPage,
  FenceSwapperPage,
  GeneralEDFencesPage,
  //
  MaintenancePage,
  //
  // ComponentsOverviewPage,
  // FoundationColorsPage,
  // FoundationTypographyPage,
  // FoundationShadowsPage,
  // FoundationGridPage,
  // FoundationIconsPage,
  //
  SwapConfirmPage,
  CreateNewAccount,
  UserBillingPage,
  SubscriptionResumeCongratulationPage,
} from './elements';

const Tutorials = [
  {
    id: 1,
    selector: '.step1',
    content: (
      <span>
        Welcome to Fence
        <br /> Requests! Let&apos;s start with <br />a short tutorial.
      </span>
    ),
  },
  {
    id: 2,
    selector: '.step2',
    content: (
      <span>
        First, make sure you only
        <br /> request{' '}
        <span
          style={{
            textDecoration: 'underline',
          }}
        >
          one
        </span>{' '}
        fence at a <br />
        time.
      </span>
    ),
  },
  {
    id: 3,
    selector: '.step3',
    content: (
      <span>
        For each fence, fill out
        <br /> the form with the
        <br /> necessary details.
      </span>
    ),
  },
  {
    id: 4,
    selector: '.step4',
    content: (
      <span>
        Make sure you add several
        <br /> images of the front and
        <br /> back of the fence.
      </span>
    ),
  },
  {
    id: 5,
    selector: '.step5',
    content: (
      <span>
        When you are finished
        <br /> with each Fence Request,
        <br /> click &quot;Add Request.&quot;
      </span>
    ),
  },
  {
    id: 6,
    selector: '.step6',
    content: (
      <span>
        You will see that the
        <br /> request has been added <br /> to the Requests tab.
      </span>
    ),
  },
  {
    id: 7,
    selector: '.step7',
    content: (
      <span>
        You can add as many
        <br /> requests as you need from
        <br /> this screen - at any time!
      </span>
    ),
  },
  {
    id: 8,
    selector: '.step8',
    content: (
      <span>
        When you are finished
        <br /> adding all of your requests,
        <br /> click &quot;Save and Finish.&quot;
      </span>
    ),
  },
];
// ----------------------------------------------------------------------

export default function Router() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const disableBody = (target) => disableBodyScroll(target);
  const enableBody = (target) => enableBodyScroll(target);

  useEffect(() => {
    dispatch(initialize());
  }, [dispatch]);

  return useRoutes([
    // Auth
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          ),
        },
        {
          path: 'setPassword/:token',
          element: (
            <SetPasswordGuard>
              <SetPasswordPage />
            </SetPasswordGuard>
          ),
        },
        {
          path: 'forgotPassword',
          element: (
            <ForgotPasswordPage>
              <ResetPasswordPage />
            </ForgotPasswordPage>
          ),
        },
        { path: 'login-unprotected', element: <LoginPage /> },
        { path: 'register-unprotected', element: <RegisterPage /> },
        {
          element: <CompactLayout />,
          children: [
            { path: 'reset-password', element: <ResetPasswordPage /> },
            {
              path: 'new-password',
              element: <NewPasswordPage />,
            },
            { path: 'verify', element: <VerifyCodePage /> },
            { path: 'resetPasswordVerify', element: <ResetPasswordVerifyCodePage /> },
          ],
        },
      ],
    },

    // Dashboard
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/dashboard" replace />, index: true },
        { path: 'app', element: <GeneralAppPage /> },
        { path: 'ecommerce', element: <GeneralEcommercePage /> },
        { path: 'analytics', element: <GeneralAnalyticsPage /> },
        { path: 'banking', element: <GeneralBankingPage /> },
        { path: 'booking', element: <GeneralBookingPage /> },
        { path: 'file', element: <GeneralFilePage /> },
        { path: 'faqsupport', element: <GeneralFaqsupportPage /> },
        { path: 'contactus', element: <GeneralContactusPage /> },
        { path: 'edfences', element: <GeneralEDFencesPage /> },
        { path: 'device', element: <RecommendDevicePage /> },
        { path: 'downloadfence', element: <DownloadFencePage /> },

        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/dashboard/e-commerce/shop" replace />, index: true },
            { path: 'shop', element: <EcommerceShopPage /> },
            { path: 'product/:name', element: <EcommerceProductDetailsPage /> },
            { path: 'list', element: <EcommerceProductListPage /> },
            { path: 'product/new', element: <EcommerceProductCreatePage /> },
            { path: 'product/:name/edit', element: <EcommerceProductEditPage /> },
            { path: 'checkout', element: <EcommerceCheckoutPage /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
            { path: 'profile', element: <UserProfilePage /> },
            { path: 'cards', element: <UserCardsPage /> },
            { path: 'list', element: <UserListPage /> },
            { path: 'new', element: <UserCreatePage /> },
            { path: 'edit/:id', element: <UserEditPage /> },
            { path: 'account', element: <UserAccountPage /> },
            { path: 'updateplan/:id', element: <UserUpdatePlanPage /> },
            { path: 'useralmost/:id', element: <UserAlmostPage /> },
            { path: 'switchbilling/:id', element: <UserSwitchBillingPage /> },
            { path: 'paymentcongratulation', element: <UserPaymentCongratulationPage /> },
            { path: 'paymentmethod/:id', element: <UserPaymentMethodPage /> },
            { path: 'useraccountinfo', element: <UserAccountInfoPage /> },
            { path: 'usermanageinfo/:id', element: <UserManageInfoPage /> },
            { path: 'pausecongratulation', element: <UserPauseCongratulationPage /> },
            { path: 'resumecongratulation', element: <SubscriptionResumeCongratulationPage /> },
            { path: 'cancelcongratulation', element: <CancelSubscriptionCongratulationPage /> },
            { path: 'plancongratulation', element: <UserPlanCongratulationPage /> },
            { path: 'billingcongratulation', element: <UserBillingCongratulationPage /> },
            { path: 'infocongratulation', element: <UserInfoCongratulationPage /> },
            { path: 'userinfocongratulation', element: <UserUserInfoCongratulationPage /> },
            { path: 'callForCancel', element: <UserCallForCancelPage /> },
            { path: 'callForSwitch', element: <UserCallForSwitchPage /> },
            { path: 'upgradingprotrial/:id', element: <UserUpgradingProTrialPage /> },
          ],
        },
        {
          path: 'invoice',
          children: [
            { element: <Navigate to="/dashboard/invoice/list" replace />, index: true },
            { path: 'list', element: <InvoiceListPage /> },
            { path: ':id', element: <InvoiceDetailsPage /> },
            { path: ':id/edit', element: <InvoiceEditPage /> },
            { path: 'new', element: <InvoiceCreatePage /> },
            { path: 'billinghistory', element: <InvoiceHistoryPage /> },
            {
              path: 'billing/:id',
              element: <InvoiceDetailsPage />,
            },
          ],
        },
        {
          path: 'blog',
          children: [
            { element: <Navigate to="/dashboard/blog/posts" replace />, index: true },
            { path: 'posts', element: <BlogPostsPage /> },
            { path: 'post/:title', element: <BlogPostPage /> },
            { path: 'new', element: <BlogNewPostPage /> },
            { path: 'blogfence', element: <BlogFencePage /> },
            { path: ':id', element: <BlogFenceDetailPage /> },
          ],
        },

        { path: 'files-manager', element: <FileManagerPage /> },
        { path: 'files-manager/rename/:id', element: <FileManagerRenamePage /> },
        {
          path: 'mail',
          children: [
            { element: <Navigate to="/dashboard/mail/all" replace />, index: true },
            { path: 'label/:customLabel', element: <MailPage /> },
            { path: 'label/:customLabel/:mailId', element: <MailPage /> },
            { path: ':systemLabel', element: <MailPage /> },
            { path: ':systemLabel/:mailId', element: <MailPage /> },
          ],
        },
        {
          path: 'chat',
          children: [
            { element: <ChatPage />, index: true },
            { path: 'new', element: <ChatPage /> },
            { path: ':conversationKey', element: <ChatPage /> },
          ],
        },
        { path: 'calendar', element: <CalendarPage /> },
        { path: 'kanban', element: <KanbanPage /> },
        { path: 'permission-denied', element: <PermissionDeniedPage /> },
        { path: 'blank', element: <BlankPage /> },
      ],
    },

    // Main Routes
    {
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
        { path: 'download', element: <DownloadPage /> },
        { path: 'about-us', element: <AboutPage /> },
        { path: 'contact-us', element: <Contact /> },
        { path: 'faqs', element: <FaqsPage /> },
        { path: 'about', element: <OurStoryPage /> },
        { path: 'meeting', element: <MeetingPage /> },
        { path: 'getstarted', element: <StartedPage /> },
        { path: 'subscription', element: <SubscriptPage /> },
        { path: 'understandar', element: <ArPage /> },
        { path: 'shopper', element: <ShopperPage /> },
        { path: 'createaccount', element: <CreateNewAccount /> },
        { path: 'gallery-1', element: <OurFencePage /> },
        { path: 'fencedetail/:id', element: <OurFenceDetailPage /> },
        { path: 'blogfences', element: <BlogFencesPage /> },
        { path: 'blogs/:id', element: <BlogFencesDetailPage /> },
        { path: 'realityfence-ed', element: <EDFencePage /> },
        { path: 'dpa', element: <DpaPage /> },
        { path: 'checkout_v2', element: <CheckoutPageV2 /> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { path: 'pricing', element: <PricingPage /> },
        { path: 'payment', element: <NewPaymentPage /> },
        { path: 'trialpayment', element: <TrialPaymentPage /> },
        { path: 'newpayment', element: <PaymentPage /> },
      ],
    },
    {
      element: (
        <OnboardingGuard>
          <SimpleLayout />
        </OnboardingGuard>
      ),
      children: [
        { path: 'userUpgradePricing', element: <UserPricingUgradePage /> },
        { path: 'userAlmostUpgrade', element: <UserAlmostUpgradePage /> },
        { path: 'billingPage', element: <UserBillingPage /> },

        { path: 'paymentupgrade/:id', element: <PaymentUgradePage /> },
        { path: 'planUpgradeCongratulation', element: <PlanUpgradeCongratulationsPage /> },
        { path: 'almostcongratulation', element: <UserAlmostCongratulationPage /> },
      ],
    },
    {
      element: <CompactLayout />,
      children: [
        { path: 'maintenance', element: <MaintenancePage /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
      ],
    },
    {
      element: (
        <OnboardingGuard>
          <OnboardingLayout />
        </OnboardingGuard>
      ),
      children: [
        { path: 'addusers', element: <AddUsersPage /> },
        { path: 'onboarding', element: <OnboardingPage /> },
        { path: 'tutorial', element: <TutorialPage /> },
        { path: 'downloadApp', element: <OnboardingDownloadAppPage /> },
        { path: 'selectfencesconfirm', element: <SelectFenceConfirmPage /> },
        { path: 'selectfencesp', element: <SelectFencePageT /> },
        { path: 'addfencesp', element: <AddFencePageT /> },
        { path: 'fencerequest', element: <FenceRequestPage /> },
        { path: 'fenceRequestCongratulation', element: <FenceRequestCongratulation /> },
      ],
    },
    { path: 'swapconfirm', element: <SwapConfirmPage /> },

    {
      element: (
        <OnboardingGuard>
          <TourProvider
            scrollSmooth
            steps={Tutorials}
            defaultOpen={pathname === '/requestfences'}
            afterOpen={disableBody}
            beforeClose={enableBody}
            styles={{
              popover: (base) => ({
                ...base,
                '--reactour-accent': '#1FA9FF',
                borderRadius: '10px',
                maxWidth: '450px',
                width: '400px',
                fontSize: '24px',
                fontFamily: 'Poppins',
                fontWeight: 'bold',
                textAlign: 'center',
                margin: '2px 30px 30px 22px',
              }),
              maskArea: (base) => ({ ...base, rx: '10px', padding: 10 }),
              badge: (base) => ({
                ...base,
                right: 'auto',
                left: '-0.8125em',
              }),
              close: (base) => ({ ...base, left: 'auto', right: 8, top: 8, width: 12, height: 12 }),
            }}
            prevButton={({ currentStep, setCurrentStep }) => {
              const first = currentStep === 0;
              return first ? (
                <div
                  style={{
                    width: '50px',
                  }}
                />
              ) : (
                <Button
                  sx={{
                    backgroundColor: '#1FA9FF !important',
                    color: 'white',
                    width: '50px',
                    textAlign: 'center',
                  }}
                  variant="contained"
                  onClick={() => {
                    setCurrentStep((s) => s - 1);
                  }}
                >
                  Back
                </Button>
              );
            }}
            nextButton={({ currentStep, stepsLength, setIsOpen, setCurrentStep }) => {
              const last = currentStep === stepsLength - 1;
              return (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#1FA9FF !important',
                    color: 'white',
                    width: '50px',
                    textAlign: 'center',
                  }}
                  onClick={() => {
                    if (last) {
                      setIsOpen(false);
                    } else {
                      setCurrentStep((s) => (s === Tutorials.length - 1 ? 0 : s + 1));
                    }
                  }}
                >
                  {last ? 'Close' : 'Next'}
                </Button>
              );
            }}
          >
            <OnboardingToolbarLayout />
          </TourProvider>
        </OnboardingGuard>
      ),
      children: [
        { path: 'selectfences/:id', element: <SelectFencePage /> },
        { path: 'categoryfences', element: <CategoryFencePage /> },
        { path: 'stylefences', element: <StyleFencePage /> },
        { path: 'detailfences/:id', element: <DetailFencePage /> },
        { path: 'addfences', element: <AddFencePage /> },
        { path: 'requestfences', element: <RequestFencePage /> },
        { path: 'fenceswapper', element: <FenceSwapperPage /> },
      ],
    },
    {
      element: <TestLayout />,
      children: [{ path: 'test', element: <TestPage /> }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
