import { Suspense, lazy } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.localStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();

      window.localStorage.setItem('page-has-been-force-refreshed', 'false');

      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Assuming that the user is not on the latest version of the application.
        // Let's refresh the page immediately.
        window.localStorage.setItem('page-has-been-force-refreshed', 'true');
        return window.location.reload();
      }

      // The page has already been reloaded
      // Assuming that user is already using the latest version of the application.
      // Let's let the application crash and raise the error.
      throw error;
    }
  });

// ----------------------------------------------------------------------
export const TestPage = Loadable(lazyWithRetry(() => import('../pages/LayoutTestPage')));
export const OurFencePage = Loadable(lazyWithRetry(() => import('../pages/OurFencePage')));
export const OurFenceDetailPage = Loadable(
  lazyWithRetry(() => import('../pages/OurFenceDetailPage'))
);
export const MeetingPage = Loadable(lazyWithRetry(() => import('../pages/MeetingPage')));
export const ArPage = Loadable(lazyWithRetry(() => import('../pages/RealityARPage')));
// AUTH
export const LoginPage = Loadable(lazyWithRetry(() => import('../pages/auth/LoginPage')));
export const SetPasswordPage = Loadable(
  lazyWithRetry(() => import('../pages/auth/SetPasswordPage'))
);
export const RegisterPage = Loadable(lazyWithRetry(() => import('../pages/auth/RegisterPage')));
export const VerifyCodePage = Loadable(lazyWithRetry(() => import('../pages/auth/VerifyCodePage')));
export const ResetPasswordVerifyCodePage = Loadable(
  lazyWithRetry(() => import('../pages/auth/ResetPasswordVerifyPage'))
);
export const NewPasswordPage = Loadable(
  lazyWithRetry(() => import('../pages/auth/NewPasswordPage'))
);
export const ResetPasswordPage = Loadable(
  lazyWithRetry(() => import('../pages/auth/ResetPasswordPage'))
);
export const ForgotPasswordPage = Loadable(
  lazyWithRetry(() => import('../pages/auth/ForgotPasswordPage'))
);
export const DownloadPage = Loadable(lazyWithRetry(() => import('../pages/DownloadPage')));
export const OurStoryPage = Loadable(lazyWithRetry(() => import('../pages/OurStoryPage')));
export const ShopperPage = Loadable(
  lazyWithRetry(() => import('../pages/fenceShopper/fenceshopper'))
);
export const SubscriptPage = Loadable(lazyWithRetry(() => import('../pages/SubscriptionPage')));
export const StartedPage = Loadable(lazyWithRetry(() => import('../pages/StartedPage')));
// DASHBOARD: GENERAL
export const GeneralAppPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/GeneralAppPage'))
);
export const GeneralEcommercePage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/GeneralEcommercePage'))
);
export const GeneralAnalyticsPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/GeneralAnalyticsPage'))
);
export const GeneralBankingPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/GeneralBankingPage'))
);

export const GeneralBookingPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/GeneralBookingPage'))
);
export const GeneralFilePage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/GeneralFilePage'))
);
export const GeneralFaqsupportPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/GeneralFaqsupportPage'))
);
export const GeneralContactusPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/GeneralContactusPage'))
);

export const GeneralEDFencesPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/GeneralEDFencesPage'))
);

// DASHBOARD: ECOMMERCE
export const EcommerceShopPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/EcommerceShopPage'))
);
export const EcommerceProductDetailsPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/EcommerceProductDetailsPage'))
);
export const EcommerceProductListPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/EcommerceProductListPage'))
);
export const EcommerceProductCreatePage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/EcommerceProductCreatePage'))
);
export const EcommerceProductEditPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/EcommerceProductEditPage'))
);
export const EcommerceCheckoutPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/EcommerceCheckoutPage'))
);

// DASHBOARD: INVOICE
export const InvoiceListPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/InvoiceListPage'))
);
// export const InvoiceDetailsPage = Loadable(
//   lazyWithRetry(() => import('../pages/dashboard/InvoiceDetailsPage'))
// );
export const InvoiceCreatePage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/InvoiceCreatePage'))
);
export const InvoiceEditPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/InvoiceEditPage'))
);
export const InvoiceHistoryPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/BillingHistoryPage'))
);
export const InvoiceDetailsPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/billingDetail/InvoiceDetailsPage'))
);
// DASHBOARD: USER
export const UserProfilePage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/UserProfilePage'))
);
export const UserCardsPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/UserCardsPage'))
);
export const UserListPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/UserListPage'))
);
export const UserAccountPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/UserAccountPage'))
);
export const UserCreatePage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/UserCreatePage'))
);
export const UserEditPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/UserEditPage'))
);
export const UserUpdatePlanPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/UserUpdatePlanPage'))
);
export const UserSwitchBillingPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/UserSwitchBillingPage'))
);
export const UserPaymentMethodPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/UserPaymentMethodPage'))
);
export const UserAccountInfoPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/UserAccountInfoPage'))
);
export const UserManageInfoPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/UserManageInfoPage'))
);
export const UserAlmostPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/UserAlmostPage'))
);
export const UserPauseCongratulationPage = Loadable(
  lazyWithRetry(() => import('../pages/congratulation/pausePage'))
);
export const SubscriptionResumeCongratulationPage = Loadable(
  lazyWithRetry(() => import('../pages/congratulation/resumePage'))
);
export const CancelSubscriptionCongratulationPage = Loadable(
  lazyWithRetry(() => import('../pages/congratulation/CancelSubscriptionPage'))
);
export const UserPlanCongratulationPage = Loadable(
  lazyWithRetry(() => import('../pages/congratulation/planPage'))
);
export const UserBillingCongratulationPage = Loadable(
  lazyWithRetry(() => import('../pages/congratulation/billingPage'))
);
export const UserPaymentCongratulationPage = Loadable(
  lazyWithRetry(() => import('../pages/congratulation/paymentPage'))
);
export const UserInfoCongratulationPage = Loadable(
  lazyWithRetry(() => import('../pages/congratulation/infoPage'))
);
export const UserUserInfoCongratulationPage = Loadable(
  lazyWithRetry(() => import('../pages/congratulation/userinfoPage'))
);
export const UserCallForCancelPage = Loadable(
  lazyWithRetry(() => import('../pages/congratulation/callForCancelPage'))
);
export const UserCallForSwitchPage = Loadable(
  lazyWithRetry(() => import('../pages/congratulation/callForSwitchPage'))
);

export const UserUpgradingProTrialPage = Loadable(
  lazyWithRetry(() => import('../pages/UserUpgradingProTrialPage'))
);

// DASHBOARD: BLOG
export const BlogPostsPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/BlogPostsPage'))
);
export const BlogPostPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/BlogPostPage'))
);
export const BlogNewPostPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/BlogNewPostPage'))
);
// -----------
export const EDFencePage = Loadable(lazyWithRetry(() => import('../pages/dashboard/EDFencePage')));

export const BlogFencePage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/BlogFencePage'))
);
export const BlogFencesPage = Loadable(lazyWithRetry(() => import('../pages/BlogFencesPage')));
export const BlogFenceDetailPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/BlogFenceDetailPage'))
);
export const BlogFencesDetailPage = Loadable(
  lazyWithRetry(() => import('../pages/BlogFencesDetailPage'))
);

// DASHBOARD: FILE MANAGER
export const FileManagerPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/FileManagerPage'))
);
export const FileManagerRenamePage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/FileManagerRenamePage'))
);

// DASHBOARD: APP
export const ChatPage = Loadable(lazyWithRetry(() => import('../pages/dashboard/ChatPage')));
export const MailPage = Loadable(lazyWithRetry(() => import('../pages/dashboard/MailPage')));
export const CalendarPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/CalendarPage'))
);
export const KanbanPage = Loadable(lazyWithRetry(() => import('../pages/dashboard/KanbanPage')));

// TEST RENDER PAGE BY ROLE
export const PermissionDeniedPage = Loadable(
  lazyWithRetry(() => import('../pages/dashboard/PermissionDeniedPage'))
);

// BLANK PAGE
export const BlankPage = Loadable(lazyWithRetry(() => import('../pages/dashboard/BlankPage')));

// MAIN
export const Page500 = Loadable(lazyWithRetry(() => import('../pages/Page500')));
export const Page403 = Loadable(lazyWithRetry(() => import('../pages/Page403')));
export const Page404 = Loadable(lazyWithRetry(() => import('../pages/Page404')));
export const HomePage = Loadable(lazyWithRetry(() => import('../pages/HomePage')));
export const FaqsPage = Loadable(lazyWithRetry(() => import('../pages/FaqsPage')));
export const AboutPage = Loadable(lazyWithRetry(() => import('../pages/AboutPage')));
export const Contact = Loadable(lazyWithRetry(() => import('../pages/ContactPage')));
export const PricingPage = Loadable(lazyWithRetry(() => import('../pages/PricingPage')));
export const PaymentPage = Loadable(lazyWithRetry(() => import('../pages/PaymentPage')));
export const NewPaymentPage = Loadable(lazyWithRetry(() => import('../pages/NewPaymentPage')));
export const CheckoutPageV2 = Loadable(lazyWithRetry(() => import('../pages/CheckoutPage_v2')));
export const TrialPaymentPage = Loadable(lazyWithRetry(() => import('../pages/TrialPaymentPage')));
export const UserBillingPage = Loadable(lazyWithRetry(() => import('../pages/BillingPage')));
export const PaymentUgradePage = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/PaymentUgradePage'))
);
export const UserPricingUgradePage = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/UserPricingUgradePage'))
);
export const UserAlmostUpgradePage = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/UserAlmostUgradePage'))
);
export const UserAlmostCongratulationPage = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/UserAlmostCongratulationPage'))
);
export const CreateNewAccount = Loadable(lazyWithRetry(() => import('../pages/CreateAccountPage')));
export const RecommendDevicePage = Loadable(
  lazyWithRetry(() => import('../pages/RecommendDevicePage'))
);
export const DownloadFencePage = Loadable(
  lazyWithRetry(() => import('../pages/DownloadFencePage'))
);

export const OnboardingDownloadAppPage = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/DownloadAppPage'))
);
export const DpaPage = Loadable(lazyWithRetry(() => import('../pages/DpaPage')));

// ONboarding
export const AddUsersPage = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/AddUsersPage'))
);
export const OnboardingPage = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/OnboardingPage'))
);
export const SelectFencePage = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/SelectFencePage'))
);
export const DetailFencePage = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/DetailFencePage'))
);
export const SelectFencePageT = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/SelectFencesp'))
);
export const CategoryFencePage = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/CategoryFencePage'))
);
export const StyleFencePage = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/StyleFencePage'))
);
export const AddFencePage = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/AddFencePage'))
);
export const RequestFencePage = Loadable(
  lazyWithRetry(() => import('../pages/fenceSwapper/FenceRequest'))
);
export const AddFencePageT = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/AddFencePageT'))
);
export const TutorialPage = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/TutorialPage'))
);
export const SelectFenceConfirmPage = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/SelectFencesConfirmPage'))
);
export const PlanUpgradeCongratulationsPage = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/PlanUpgradeCongratulationsPage'))
);
export const FenceRequestCongratulation = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/FenceRequestCongratulation'))
);
// Fence swapper
export const FenceSwapperPage = Loadable(
  lazyWithRetry(() => import('../pages/fenceSwapper/FenceSwapper'))
);
//
export const MaintenancePage = Loadable(lazyWithRetry(() => import('../pages/MaintenancePage')));
export const FenceRequestPage = Loadable(
  lazyWithRetry(() => import('../pages/onboarding/FenceRequestPage'))
);
export const SwapConfirmPage = Loadable(
  lazyWithRetry(() => import('../pages/fenceSwapper/SwapConfirmPage'))
);
// DEMO COMPONENTS
// ----------------------------------------------------------------------

export const ComponentsOverviewPage = Loadable(
  lazyWithRetry(() => import('../pages/components/ComponentsOverviewPage'))
);

// FOUNDATION
export const FoundationColorsPage = Loadable(
  lazyWithRetry(() => import('../pages/components/foundation/FoundationColorsPage'))
);
export const FoundationTypographyPage = Loadable(
  lazyWithRetry(() => import('../pages/components/foundation/FoundationTypographyPage'))
);
export const FoundationShadowsPage = Loadable(
  lazyWithRetry(() => import('../pages/components/foundation/FoundationShadowsPage'))
);
export const FoundationGridPage = Loadable(
  lazyWithRetry(() => import('../pages/components/foundation/FoundationGridPage'))
);
export const FoundationIconsPage = Loadable(
  lazyWithRetry(() => import('../pages/components/foundation/FoundationIconsPage'))
);

// MUI COMPONENTS
export const MUIAccordionPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIAccordionPage'))
);
export const MUIAlertPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIAlertPage'))
);
export const MUIAutocompletePage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIAutocompletePage'))
);
export const MUIAvatarPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIAvatarPage'))
);
export const MUIBadgePage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIBadgePage'))
);
export const MUIBreadcrumbsPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIBreadcrumbsPage'))
);
export const MUIButtonsPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIButtonsPage'))
);
export const MUICheckboxPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUICheckboxPage'))
);
export const MUIChipPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIChipPage'))
);
export const MUIDataGridPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIDataGridPage'))
);
export const MUIDialogPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIDialogPage'))
);
export const MUIListPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIListPage'))
);
export const MUIMenuPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIMenuPage'))
);
export const MUIPaginationPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIPaginationPage'))
);
export const MUIPickersPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIPickersPage'))
);
export const MUIPopoverPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIPopoverPage'))
);
export const MUIProgressPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIProgressPage'))
);
export const MUIRadioButtonsPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIRadioButtonsPage'))
);
export const MUIRatingPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIRatingPage'))
);
export const MUISliderPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUISliderPage'))
);
export const MUIStepperPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUIStepperPage'))
);
export const MUISwitchPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUISwitchPage'))
);
export const MUITablePage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUITablePage'))
);
export const MUITabsPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUITabsPage'))
);
export const MUITextFieldPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUITextFieldPage'))
);
export const MUITimelinePage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUITimelinePage'))
);
export const MUITooltipPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUITooltipPage'))
);
export const MUITransferListPage = Loadable(
  lazyWithRetry(() => import('../pages/components/mui/MUITransferListPage'))
);
// export const MUITreesViewPage = Loadable(
//   lazyWithRetry(() => import('../pages/components/mui/MUITreesViewPage'))
// );

// EXTRA
export const DemoAnimatePage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoAnimatePage'))
);
export const DemoCarouselsPage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoCarouselsPage'))
);
export const DemoChartsPage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoChartsPage'))
);
export const DemoCopyToClipboardPage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoCopyToClipboardPage'))
);
export const DemoEditorPage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoEditorPage'))
);
export const DemoFormValidationPage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoFormValidationPage'))
);
export const DemoImagePage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoImagePage'))
);
export const DemoLabelPage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoLabelPage'))
);
export const DemoLightboxPage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoLightboxPage'))
);
export const DemoMapPage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoMapPage'))
);
export const DemoMegaMenuPage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoMegaMenuPage'))
);
export const DemoMultiLanguagePage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoMultiLanguagePage'))
);
export const DemoNavigationBarPage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoNavigationBarPage'))
);
export const DemoOrganizationalChartPage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoOrganizationalChartPage'))
);
export const DemoScrollbarPage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoScrollbarPage'))
);
export const DemoSnackbarPage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoSnackbarPage'))
);
export const DemoTextMaxLinePage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoTextMaxLinePage'))
);
export const DemoUploadPage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoUploadPage'))
);
export const DemoMarkdownPage = Loadable(
  lazyWithRetry(() => import('../pages/components/extra/DemoMarkdownPage'))
);
