import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
import SetPasswordGuard from '../auth/SetPasswordGuard';
// layouts
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config-global';
//
import {
  // Auth
  LoginPage,
  ChangePasswordPage,
  VerifyCodePage,
  PhoneVerifyCodePage,
  NewPasswordPage,
  ResetPasswordPage,
  SetPasswordPage,
  // Dashboard: General
  GeneralAppPage,
  General3DModelPage,
  GeneralManageAppThumbnailPage,
  GeneralBankingPage,
  GeneralBookingPage,
  GeneralEcommercePage,
  GeneralAnalyticsPage,
  // Dashboard: User
  GeneralUserListPage,
  GeneralShopperListPage,
  GeneralAddCompanyPage,
  GeneralUserAccountPage,
  GeneralUserAccountEditPage,
  UserListPage,
  UserEditPage,
  UserCardsPage,
  UserCreatePage,
  UserProfilePage,
  UserAccountPage,
  // Dashboard: Ecommerce
  EcommerceShopPage,
  EcommerceCheckoutPage,
  EcommerceProductListPage,
  EcommerceProductEditPage,
  EcommerceProductCreatePage,
  EcommerceProductDetailsPage,
  // Dashboard: Category
  EcommerceCategoryPage,
  EcommerceCategoryEditPage,
  EcommerceCategoryCreatePage,
  // Dashboard: Billing
  GeneralBillingPage,
  // GeneralBillingDetailPage,

  // GeneralBroadcastSystem
  GeneralBroadcastSystemPage,

  // Dashboard: Subscription
  GeneralSubscriptionPage,
  GeneralSubscriptionEditPage,
  GeneralSubscriptionCreatePage,
  // Dashboard: Blog
  GeneralBlogPage,
  GeneralDraftBlogPage,
  GeneralBlogEditPage,
  GeneralBlogCreatePage,
  // Dashboard: QA
  GeneralQAPage,
  GeneralQAEditPage,
  GeneralQACreatePage,
  GeneralQACategoryPage,
  GeneralQACategoryCreatePage,
  GeneralQACategoryEditPage,
  // Dashboard: ED
  GeneralEDPage,
  GeneralDraftEDPage,
  GeneralEDEditPage,
  GeneralEDCreatePage,
  // Tag
  EcommerceTagPage,
  // Dashboard: Invoice
  InvoiceListPage,
  InvoiceDetailsPage,
  InvoiceCreatePage,
  InvoiceEditPage,
  // Dashboard: Pricing
  PricingListPage,
  PricingCreatePage,
  PricingEditPage,
  // Dashboard: Service
  ServiceListPage,
  ServiceCreatePage,
  ServiceEditPage,
  // Dashboard: Blog
  BlogPostsPage,
  BlogPostPage,
  BlogNewPostPage,

  // Dashboard: Media
  GeneralMediaManagerPage,
  GeneralMediaGalleryImageAddPage,
  GeneralMediaGalleryImageEditPage,
  GeneralMediaVideoEditPage,

  // AssetRequest
  GeneralAssetRequestListPage,
  GeneralAssetRequestEditPage,
  AssetRequestDetailsPage,
  // Dashboard: FileManager
  GeneralFileManagerPage,
  // Dashboard: App
  ChatPage,
  MailPage,
  CalendarPage,
  KanbanPage,
  //
  BlankPage,
  PermissionDeniedPage,
  UpgradePlanPage,
  UserUpgradingFromProTrialPage,
  SwitchBillingPage,
  AlmostDonePage,
  PaymentMethodsPage,

  // Congratulations
  UpgradePlanCongratulationPage,
  UpgradeBillingCongratulationPage,
  UpgradePaymentCongratulationPage,
  UpgradeAccountCongratulationPage,
  UpgradeUserInfoCongratulationPage,
  //
  // Page500,
  // Page403,
  Page404,
  // HomePage,
  // FaqsPage,
  // AboutPage,
  // Contact,
  // PricingPage,
  // PaymentPage,
  // ComingSoonPage,
  // MaintenancePage,
  // //
  // ComponentsOverviewPage,
  // FoundationColorsPage,
  // FoundationTypographyPage,
  // FoundationShadowsPage,
  // FoundationGridPage,
  // FoundationIconsPage,
  // //
  // MUIAccordionPage,
  // MUIAlertPage,
  // MUIAutocompletePage,
  // MUIAvatarPage,
  // MUIBadgePage,
  // MUIBreadcrumbsPage,
  // MUIButtonsPage,
  // MUICheckboxPage,
  // MUIChipPage,
  // MUIDataGridPage,
  // MUIDialogPage,
  // MUIListPage,
  // MUIMenuPage,
  // MUIPaginationPage,
  // MUIPickersPage,
  // MUIPopoverPage,
  // MUIProgressPage,
  // MUIRadioButtonsPage,
  // MUIRatingPage,
  // MUISliderPage,
  // MUIStepperPage,
  // MUISwitchPage,
  // MUITablePage,
  // MUITabsPage,
  // MUITextFieldPage,
  // MUITimelinePage,
  // MUITooltipPage,
  // MUITransferListPage,
  // MUITreesViewPage,
  //
  // DemoAnimatePage,
  // DemoCarouselsPage,
  // DemoChartsPage,
  // DemoCopyToClipboardPage,
  // DemoEditorPage,
  // DemoFormValidationPage,
  // DemoImagePage,
  // DemoLabelPage,
  // DemoLightboxPage,
  // DemoMapPage,
  // DemoMegaMenuPage,
  // DemoMultiLanguagePage,
  // DemoNavigationBarPage,
  // DemoOrganizationalChartPage,
  // DemoScrollbarPage,
  // DemoSnackbarPage,
  // DemoTextMaxLinePage,
  // DemoUploadPage,
  // DemoMarkdownPage,
  AddAdminPage,
  AddCompaniesPage,
  AffiliatesManagePage,
} from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  // useEffect(() => {
  //   dispatch(initialize());
  // }, [dispatch]);

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
        // {
        //   path: 'register',
        //   element: (
        //     <GuestGuard>
        //       <RegisterPage />
        //     </GuestGuard>
        //   ),
        // },
        { path: 'login-unprotected', element: <LoginPage /> },
        {
          path: 'setPassword',
          element: (
            <SetPasswordGuard>
              <SetPasswordPage />
            </SetPasswordGuard>
          ),
        },
        // { path: 'register-unprotected', element: <RegisterPage /> },
        {
          element: <CompactLayout />,
          children: [
            { path: 'reset-password', element: <ResetPasswordPage /> },
            { path: 'new-password', element: <NewPasswordPage /> },
            { path: 'verify', element: <VerifyCodePage /> },
            { path: 'phoneVerify', element: <PhoneVerifyCodePage /> },
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
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'fences', element: <General3DModelPage /> },
        { path: 'app', element: <GeneralAppPage /> },
        { path: 'ecommerce', element: <GeneralEcommercePage /> },
        { path: 'analytics', element: <GeneralAnalyticsPage /> },
        { path: 'banking', element: <GeneralBankingPage /> },
        { path: 'booking', element: <GeneralBookingPage /> },
        {
          path: 'media',
          children: [
            { element: <Navigate to="/dashboard/media/manage" replace />, index: true },
            { path: 'manage', element: <GeneralMediaManagerPage /> },
            { path: 'video', element: <GeneralMediaVideoEditPage /> },
            { path: 'gallery', element: <GeneralMediaGalleryImageEditPage /> },
            { path: 'newimages', element: <GeneralMediaGalleryImageAddPage /> },
          ],
        },
        {
          path: 'billing',
          element: <GeneralBillingPage />,
        },
        {
          path: 'billing/:id',
          element: <InvoiceDetailsPage />,
        },
        {
          path: 'assetRequest',
          children: [
            { element: <Navigate to="/dashboard/assetRequest/list" replace />, index: true },
            { path: 'list', element: <GeneralAssetRequestListPage /> },
            { path: 'edit/:id', element: <GeneralAssetRequestEditPage /> },
            { path: 'view/:id', element: <AssetRequestDetailsPage /> },
            // { path: 'gallery', element: <GeneralMediaGalleryImageEditPage /> },
            // { path: 'newimages', element: <GeneralMediaGalleryImageAddPage /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/list" replace />, index: true },
            { path: 'list', element: <GeneralUserListPage /> },
            { path: 'shopper', element: <GeneralShopperListPage /> },
            { path: 'newcompany', element: <GeneralAddCompanyPage /> },
            { path: 'account', element: <GeneralUserAccountPage /> },
            // { path: 'edit/:id', element: <GeneralAssetRequestEditPage /> },
            // { path: 'gallery', element: <GeneralMediaGalleryImageEditPage /> },
            // { path: 'newimages', element: <GeneralMediaGalleryImageAddPage /> },
          ],
        },
        {
          path: 'subscription',
          children: [
            { element: <Navigate to="/dashboard/subscription/list" replace />, index: true },
            { path: 'list', element: <GeneralSubscriptionPage /> },
            { path: 'new', element: <GeneralSubscriptionCreatePage /> },
            { path: 'edit/:id', element: <GeneralSubscriptionEditPage /> },
          ],
        },

        {
          path: 'ED',
          children: [
            { element: <Navigate to="/dashboard/ED/list" replace />, index: true },
            { path: 'list', element: <GeneralEDPage /> },
            { path: 'draft', element: <GeneralDraftEDPage /> },
            { path: 'new', element: <GeneralEDCreatePage /> },
            { path: 'edit/:id', element: <GeneralEDEditPage /> },
          ],
        },
        {
          path: 'blog',
          children: [
            { element: <Navigate to="/dashboard/blog/list" replace />, index: true },
            { path: 'list', element: <GeneralBlogPage /> },
            { path: 'draft', element: <GeneralDraftBlogPage /> },
            { path: 'new', element: <GeneralBlogCreatePage /> },
            { path: 'edit/:id', element: <GeneralBlogEditPage /> },
          ],
        },
        {
          path: 'QA',
          children: [
            { element: <Navigate to="/dashboard/QA/list" replace />, index: true },
            { path: 'list', element: <GeneralQAPage /> },
            { path: 'new', element: <GeneralQACreatePage /> },
            { path: 'edit/:id', element: <GeneralQAEditPage /> },
            { path: 'category', element: <GeneralQACategoryPage /> },
            { path: 'newcategory', element: <GeneralQACategoryCreatePage /> },
            { path: 'editcategory/:id', element: <GeneralQACategoryEditPage /> },
          ],
        },
        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/dashboard/e-commerce/shop" replace />, index: true },
            { path: 'shop', element: <EcommerceShopPage /> },
            { path: 'product/:id', element: <EcommerceProductDetailsPage /> },
            { path: 'list', element: <EcommerceProductListPage /> },
            { path: 'product/new', element: <EcommerceProductCreatePage /> },
            { path: 'product/:id/edit', element: <EcommerceProductEditPage /> },
            { path: 'checkout', element: <EcommerceCheckoutPage /> },
            { path: 'newcategory', element: <EcommerceCategoryCreatePage /> },
            { path: 'category', element: <EcommerceCategoryPage /> },
            { path: 'category/:id/edit', element: <EcommerceCategoryEditPage /> },
            { path: 'thumbnail/:title', element: <GeneralManageAppThumbnailPage /> },
            { path: 'tag', element: <EcommerceTagPage /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'profile', element: <UserProfilePage /> },
            { path: 'cards', element: <UserCardsPage /> },
            { path: 'list', element: <UserListPage /> },
            { path: 'new', element: <UserCreatePage /> },
            { path: 'edit/:id', element: <UserEditPage /> },
            { path: 'account', element: <UserAccountPage /> },
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
          ],
        },
        {
          path: 'service',
          children: [
            { element: <Navigate to="/dashboard/service/list" replace />, index: true },
            { path: 'list', element: <ServiceListPage /> },
            { path: 'new', element: <ServiceCreatePage /> },
            { path: 'edit/:id', element: <ServiceEditPage /> },
          ],
        },
        {
          path: 'pricing',
          children: [
            { element: <Navigate to="/dashboard/invoice/list" replace />, index: true },
            { path: 'list', element: <PricingListPage /> },
            { path: ':id/edit', element: <PricingEditPage /> },
            { path: 'new', element: <PricingCreatePage /> },
          ],
        },
        {
          path: 'blog',
          children: [
            { element: <Navigate to="/dashboard/blog/posts" replace />, index: true },
            { path: 'posts', element: <BlogPostsPage /> },
            { path: 'post/:title', element: <BlogPostPage /> },
            { path: 'new', element: <BlogNewPostPage /> },
          ],
        },
        { path: 'file', element: <GeneralFileManagerPage /> },

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
        {
          path: 'broadcast',
          element: <GeneralBroadcastSystemPage />,
        },
        {
          path: 'affiliates',
          element: <AffiliatesManagePage />,
        },
        { path: 'calendar', element: <CalendarPage /> },
        { path: 'addAdmin', element: <AddAdminPage /> },
        { path: 'kanban', element: <KanbanPage /> },
        { path: 'permission-denied', element: <PermissionDeniedPage /> },
        { path: 'blank', element: <BlankPage /> },
      ],
    },
    // {
    //   element: (
    //     <AuthGuard>
    //       <CompactLayout />
    //     </AuthGuard>
    //   ),
    //   children: [
    {
      path: 'upgradePlan/:id',
      element: (
        <AuthGuard>
          <UpgradePlanPage />
        </AuthGuard>
      ),
    },
    {
      path: 'upgradingfromprotrial/:id',
      element: (
        <AuthGuard>
          <UserUpgradingFromProTrialPage />
        </AuthGuard>
      ),
    },
    {
      path: 'changePassword',
      element: (
        <AuthGuard>
          <ChangePasswordPage />
        </AuthGuard>
      ),
    },
    {
      path: 'almostdone/:id',
      element: (
        <AuthGuard>
          <AlmostDonePage />
        </AuthGuard>
      ),
    },
    {
      path: 'switchbilling/:id',
      element: (
        <AuthGuard>
          <SwitchBillingPage />
        </AuthGuard>
      ),
    },
    {
      path: 'paymentmethods/:id',
      element: (
        <AuthGuard>
          <PaymentMethodsPage />
        </AuthGuard>
      ),
    },
    {
      path: 'account/:id',
      element: (
        <AuthGuard>
          <GeneralUserAccountEditPage />
        </AuthGuard>
      ),
    },
    {
      path: 'addComapnies/:id',
      element: (
        <AuthGuard>
          <AddCompaniesPage />
        </AuthGuard>
      ),
    },
    //   ],
    // },

    // Main Routes
    { path: '/', element: <LoginPage /> },
    { path: '/upgradeSuccess', element: <UpgradePlanCongratulationPage /> },
    { path: '/billingSuccess', element: <UpgradeBillingCongratulationPage /> },
    { path: '/paymentsuccess', element: <UpgradePaymentCongratulationPage /> },
    { path: '/upgradeAccountSuccess', element: <UpgradeAccountCongratulationPage /> },
    { path: '/upgradeUserInfoSuccess', element: <UpgradeUserInfoCongratulationPage /> },
    { path: '*', element: <Page404 /> },
  ]);
}
