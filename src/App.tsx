import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'

// Context Providers
import { ThemeProvider } from '@/context/ThemeContext'
import { GoogleMapsProvider } from '@/context/GoogleMapsContext'
import { GoogleMapsConfigModal } from '@/components/maps/GoogleMapsConfigModal'
import { ToastProvider } from '@/context/ToastContext'
import { DemoProvider } from '@/context/DemoContext'
import { AuthProvider } from '@/context/AuthContext'
import { OrderProvider } from '@/context/OrderContext'

// Global UI
import { OfflineBanner } from '@/components/ui/OfflineBanner'
import { DemoControlBar } from '@/components/common/DemoControlBar'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, Home, Package } from 'lucide-react'

// Public & Landing
import { LandingPage } from '@/features/landing/LandingPage'
import { ReceiverTrackingPage } from '@/features/receiver/ReceiverTrackingPage'

// Customer Experience
import { CustomerLayout } from '@/features/customer/CustomerLayout'
import { CustomerLoginPage } from '@/features/customer/CustomerLoginPage'
import { CustomerHomePage } from '@/features/customer/CustomerHomePage'
import { BookingWizardPage } from '@/features/customer/BookingWizard/BookingWizardPage'
import { OrderHistoryPage } from '@/features/customer/OrderHistoryPage'
import { OrderTrackingPage } from '@/features/customer/OrderTrackingPage'
import { WalletPage } from '@/features/customer/WalletPage'
import { AddressesContactsPage } from '@/features/customer/AddressesContactsPage'
import { NotificationsPage } from '@/features/customer/NotificationsPage'
import { ProfileSettingsPage } from '@/features/customer/ProfileSettingsPage'
import { CustomerHelpPage } from '@/features/customer/CustomerHelpPage'

// Delivery Partner App
import { DriverLayout } from '@/features/driver/DriverLayout'
import { DriverLoginPage } from '@/features/driver/DriverLoginPage'
import { DriverOnboardingPage } from '@/features/driver/DriverOnboardingPage'
import { DriverVerificationStatusPage } from '@/features/driver/DriverVerificationStatusPage'
import { DriverDashboardPage } from '@/features/driver/DriverDashboardPage'
import { DriverJobPage } from '@/features/driver/DriverJobPage'
import { DriverEarningsPage } from '@/features/driver/DriverEarningsPage'
import { DriverWalletPage } from '@/features/driver/DriverWalletPage'
import { DriverDocumentsPage } from '@/features/driver/DriverDocumentsPage'
import { DriverSupportPage } from '@/features/driver/DriverSupportPage'

// Admin Operations Deck
import { AdminLayout } from '@/features/admin/AdminLayout'
import { AdminOverviewPage } from '@/features/admin/AdminOverviewPage'
import { AdminLiveOpsPage } from '@/features/admin/AdminLiveOpsPage'
import { AdminOrdersPage } from '@/features/admin/AdminOrdersPage'
import { AdminDriversPage } from '@/features/admin/AdminDriversPage'
import { AdminOnlineDriversPage } from '@/features/admin/AdminOnlineDriversPage'
import { AdminPricingPage } from '@/features/admin/AdminPricingPage'
import { AdminCommissionsPage } from '@/features/admin/AdminCommissionsPage'
import { AdminClaimsPage } from '@/features/admin/AdminClaimsPage'
import { AdminSupportPage } from '@/features/admin/AdminSupportPage'
import { AdminReportsPage } from '@/features/admin/AdminReportsPage'
import { AdminHelpersPage } from '@/features/admin/AdminHelpersPage'
import { AdminContentPage } from '@/features/admin/AdminContentPage'
import { AdminRolesPage } from '@/features/admin/AdminRolesPage'


/**
 * Scroll restoration helper on route changes
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/**
 * Public shell wrapper for landing page with global navbar and footer
 */
const LandingShell: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden w-full">
    <Navbar />
    <main className="flex-1 w-full">
      <LandingPage />
    </main>
    <Footer />
  </div>
)

/**
 * Customer portal shell: combines global Navbar, customer sub-nav bar, and Footer
 */
const CustomerShell: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden w-full">
    <Navbar />
    <div className="flex-1 w-full">
      <CustomerLayout />
    </div>
    <Footer />
  </div>
)

/**
 * Minimal auth shell for login screens
 */
const AuthShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
    <Navbar />
    <main className="flex-1 flex items-center justify-center p-4">
      {children}
    </main>
    <Footer />
  </div>
)

/**
 * Driver auth wrapper with dark background
 */
const DriverAuthShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col justify-center bg-slate-950 p-4">
    {children}
  </div>
)

/**
 * 404 Not Found Page
 */
const NotFoundPage: React.FC = () => (
  <div className="min-h-[70vh] flex items-center justify-center p-4 text-center">
    <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-lg space-y-4">
      <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h1 className="text-2xl font-black text-slate-900">Page Not Found</h1>
      <p className="text-xs text-slate-600 leading-relaxed">
        The page you are looking for does not exist or has been moved to another route in the Local Move portal.
      </p>
      <div className="pt-2 flex justify-center gap-3">
        <Link to="/">
          <Button variant="primary" size="sm" leftIcon={<Home className="w-4 h-4" />}>
            Return Home
          </Button>
        </Link>
        <Link to="/customer/home">
          <Button variant="outline" size="sm" leftIcon={<Package className="w-4 h-4" />}>
            Customer Dashboard
          </Button>
        </Link>
      </div>
    </div>
  </div>
)

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <GoogleMapsProvider>
          <ToastProvider>
            <DemoProvider>
              <AuthProvider>
                <OrderProvider>
                  <ScrollToTop />
                  <OfflineBanner />

                <Routes>
                  {/* 1. Public Landing Page */}
                  <Route path="/" element={<LandingShell />} />

                  {/* 2. Public Receiver Tracking Portal (No login needed) */}
                  <Route path="/track" element={<ReceiverTrackingPage />} />
                  <Route path="/track/:trackingToken" element={<ReceiverTrackingPage />} />
                  <Route path="/receiver" element={<ReceiverTrackingPage />} />
                  <Route path="/receiver/track" element={<ReceiverTrackingPage />} />
                  <Route path="/receiver/:trackingToken" element={<ReceiverTrackingPage />} />
                  <Route path="/receiver/track/:trackingToken" element={<ReceiverTrackingPage />} />

                  {/* 3. Customer Authentication */}
                  <Route
                    path="/customer/login"
                    element={
                      <AuthShell>
                        <CustomerLoginPage />
                      </AuthShell>
                    }
                  />

                  {/* 4. Customer Portal (Nested under CustomerShell) */}
                  <Route path="/customer" element={<CustomerShell />}>
                    <Route index element={<Navigate to="/customer/login" replace />} />
                    <Route path="home" element={<CustomerHomePage />} />
                    <Route path="book" element={<BookingWizardPage />} />
                    <Route path="orders" element={<OrderHistoryPage />} />
                    <Route path="orders/:orderId" element={<OrderTrackingPage />} />
                    <Route path="wallet" element={<WalletPage />} />
                    <Route path="addresses" element={<AddressesContactsPage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="profile" element={<ProfileSettingsPage />} />
                    <Route path="help" element={<CustomerHelpPage />} />
                  </Route>

                  {/* 5. Driver Authentication & Onboarding */}
                  <Route
                    path="/driver/login"
                    element={
                      <DriverAuthShell>
                        <DriverLoginPage />
                      </DriverAuthShell>
                    }
                  />
                  <Route
                    path="/driver/onboarding"
                    element={
                      <DriverAuthShell>
                        <DriverOnboardingPage />
                      </DriverAuthShell>
                    }
                  />
                  <Route
                    path="/driver/verification-status"
                    element={
                      <DriverAuthShell>
                        <DriverVerificationStatusPage />
                      </DriverAuthShell>
                    }
                  />
                  <Route
                    path="/driver/status"
                    element={<Navigate to="/driver/verification-status" replace />}
                  />

                  {/* 6. Driver Portal (Nested under DriverLayout) */}
                  <Route path="/driver" element={<DriverLayout />}>
                    <Route index element={<Navigate to="/driver/dashboard" replace />} />
                    <Route path="dashboard" element={<DriverDashboardPage />} />
                    <Route path="job/:orderId" element={<DriverJobPage />} />
                    <Route path="earnings" element={<DriverEarningsPage />} />
                    <Route path="wallet" element={<DriverWalletPage />} />
                    <Route path="documents" element={<DriverDocumentsPage />} />
                    <Route path="support" element={<DriverSupportPage />} />
                  </Route>

                  {/* 7. Admin Operations Desk (Nested under AdminLayout) */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/overview" replace />} />
                    <Route path="overview" element={<AdminOverviewPage />} />
                    <Route path="online-drivers" element={<AdminOnlineDriversPage />} />
                    <Route path="live-ops" element={<AdminLiveOpsPage />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="drivers" element={<AdminDriversPage />} />
                    <Route path="pricing" element={<AdminPricingPage />} />
                    <Route path="commissions" element={<AdminCommissionsPage />} />
                    <Route path="claims" element={<AdminClaimsPage />} />
                    <Route path="support" element={<AdminSupportPage />} />
                    <Route path="reports" element={<AdminReportsPage />} />
                    <Route path="helpers" element={<AdminHelpersPage />} />
                    <Route path="content" element={<AdminContentPage />} />
                    <Route path="roles" element={<AdminRolesPage />} />
                  </Route>

                  {/* 8. Fallback 404 Route */}
                  <Route
                    path="*"
                    element={
                      <div className="min-h-screen flex flex-col bg-slate-50">
                        <Navbar />
                        <main className="flex-1">
                          <NotFoundPage />
                        </main>
                        <Footer />
                      </div>
                    }
                  />
                </Routes>

                {/* Floating Scenario & Role Simulation Bar */}
                <DemoControlBar />

                {/* Google Maps Platform API Key & Engine Config Modal */}
                <GoogleMapsConfigModal />
              </OrderProvider>
            </AuthProvider>
          </DemoProvider>
        </ToastProvider>
      </GoogleMapsProvider>
    </ThemeProvider>
  </BrowserRouter>
  )
}

export default App
