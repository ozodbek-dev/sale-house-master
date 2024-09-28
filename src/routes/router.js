import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
	Outlet,
	Navigate
} from "react-router-dom"

import NotFoundPage from "components/ui/NotFoundPage"

import BaseLayout from "layouts/BaseLayout"

import LogInSignUpLayout from "layouts/LogInSignUpLayout"
import LogIn from "pages/login-signup/LogIn"
import TopPanelProvider from "context/providers/TopPanelProvider"
import NotificationProvider from "context/providers/NotificationProvider"
import Dashboard from "pages/admin/dashboard/Dashboard"
import Arrears from "pages/admin/arrears/Arrears"
import Clients from "pages/admin/clients/Clients"
import Contract from "pages/admin/contract/Contract"
import Order from "pages/admin/order/Order"
import Payment from "pages/admin/payment/Payment"
import Settings from "pages/admin/settings/Settings"
import Companies from "pages/admin/settings/company/Companies"
import CompanyAddEdit from "pages/admin/settings/company/CompanyAddEdit"
import Staff from "pages/admin/settings/staff/Staff"
import Block from "pages/admin/block/Block"
import Message from "pages/admin/sms/Message"
import AuthProvider from "context/providers/AuthProvider"
import Objects from "pages/admin/objects/Objects"
import ObjectAddEdit from "pages/admin/objects/ObjectAddEdit"
import Shaxmatka from "pages/admin/shaxmatka/Shaxmatka"
import ShaxmatkaBlock from "pages/admin/shaxmatka/ShaxmatkaBlock"
import ContractAdd from "pages/admin/contract/ContractAdd"
import ClientAddEdit from "pages/admin/clients/ClientAddEdit"
import AccounterPayment from "pages/accounter/payment/AccounterPayment"
import ContractView from "pages/admin/contract/ContractView"
import PaymentAdd from "pages/accounter/payment/PaymentAdd"
import Changes from "pages/admin/changes/Changes"
import PaymentContractView from "pages/accounter/payment/PaymentContractView"
import Home from "pages/admin/settings/home/Home"
import News from "pages/admin/news/News"
import NewsAddEdit from "pages/admin/news/NewsAddEdit"
import ClientView from "pages/admin/clients/ClientView"
import Profile from "pages/profile/Profile"
import HomeDataFromExcel from "pages/admin/settings/home-excel/HomeDataFromExcel"
import ClientDataFromExcel from "pages/admin/settings/client-excel/ClientDataFromExcel"
import ContractDataFromExcel from "pages/admin/settings/contract-excel/ContractDataFromExcel"
import PaymentChanges from "pages/admin/payment-changes/PaymentChanges"
import ROLE_TYPE_LIST from "shared/roleTypeList"
import RequireAuth from "hoc/RequireAuth"
import Leads from "pages/admin/leads/Leads"
import LeadView from "pages/admin/leads/LeadView"
import LeadShaxmatka from "pages/admin/leads/leads-shaxmatka/LeadShaxmatka"
import LeadShaxmatkaBlock from "pages/admin/leads/leads-shaxmatka/LeadShaxmatkaBlock"
import LeadProvider from "context/providers/LeadProvider"
import Homes from "pages/homes/Homes"
import Currency from "pages/admin/currency/Currency"
import CurrencyProvider from "context/providers/CurrencyProvider"
import BaseProvider from "context/BaseProvider"

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route element={<Outlet />}>
			<Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

			<Route element={<AuthProvider />}>
				<Route element={<LogInSignUpLayout />}>
					<Route path="login" element={<LogIn />} />
				</Route>
				{/* <Route element={<BaseProvider />}> */}
				{/* <Route element={<TopPanelProvider />}> */}
				{/* <Route element={<NotificationProvider />}> */}
				<Route element={<BaseProvider />}>
					<Route element={<BaseLayout />}>
						<Route
							element={
								<RequireAuth allowedRoles={[ROLE_TYPE_LIST.ADMIN.code]} />
							}
							path="admin"
						>
							<Route path="dashboard" element={<Dashboard />} />

							<Route path="homes" element={<Homes />} />

							<Route path="arrear" element={<Arrears />} />

							<Route path="object" element={<Outlet />}>
								<Route index element={<Objects />} />
								<Route path="add" element={<ObjectAddEdit />} />
								{/* <Route path="edit/:id" element={<ObjectAddEdit />} /> */}
							</Route>

							<Route path="shaxmatka" element={<Outlet />}>
								<Route index element={<Shaxmatka />} />
								<Route path=":objectId/object" element={<ShaxmatkaBlock />} />
							</Route>

							<Route path="change" element={<Changes />} />

							<Route path="payment-change" element={<PaymentChanges />} />

							<Route path="payment" element={<Payment />} />

							<Route path="currency" element={<Currency />} />

							<Route path="client" element={<Outlet />}>
								<Route index element={<Clients />} />
								<Route path="add" element={<ClientAddEdit />} />
								<Route path="view/:id" element={<ClientView />} />
							</Route>

							<Route path="lead" element={<LeadProvider />}>
								<Route index element={<Leads />} />
								<Route path="shaxmatka" element={<Outlet />}>
									<Route index element={<LeadShaxmatka />} />
									<Route
										path=":objectId/object"
										element={<LeadShaxmatkaBlock />}
									/>
								</Route>
								<Route path="view/:id" element={<LeadView />} />
							</Route>

							<Route path="news" element={<Outlet />}>
								<Route index element={<News />} />
								<Route path="add" element={<NewsAddEdit />} />
								<Route path="edit/:id" element={<NewsAddEdit />} />
							</Route>

							<Route path="contract" element={<Outlet />}>
								<Route index element={<Contract />} />
								<Route path="add" element={<ContractAdd />} />
								<Route path="view/:id" element={<ContractView />} />
							</Route>

							<Route path="order" element={<Order />} />

							<Route path="settings" element={<Outlet />}>
								<Route index element={<Settings />} />
								<Route path="home" element={<Home />} />
								<Route path="company" element={<Outlet />}>
									<Route index element={<Companies />} />
									<Route path="add" element={<CompanyAddEdit />} />
									<Route path="edit/:id" element={<CompanyAddEdit />} />
								</Route>
								<Route path="staff" element={<Staff />} />
								<Route path="home-excel" element={<HomeDataFromExcel />} />
								<Route path="client-excel" element={<ClientDataFromExcel />} />
								<Route
									path="contract-excel"
									element={<ContractDataFromExcel />}
								/>
							</Route>

							<Route path="block" element={<Block />} />

							<Route path="message" element={<Message />} />
						</Route>

						<Route
							element={
								<RequireAuth allowedRoles={[ROLE_TYPE_LIST.MANAGER.code]} />
							}
							path="manager"
						>
							<Route path="dashboard" element={<Dashboard />} />

							<Route path="homes" element={<Homes />} />

							<Route path="arrear" element={<Arrears />} />

							<Route path="shaxmatka" element={<Outlet />}>
								<Route index element={<Shaxmatka />} />
								<Route path=":objectId/object" element={<ShaxmatkaBlock />} />
							</Route>

							<Route path="contract" element={<Outlet />}>
								<Route index element={<Contract />} />
								<Route path="add" element={<ContractAdd />} />
								<Route path="view/:id" element={<ContractView />} />
							</Route>

							<Route path="change" element={<Changes />} />

							<Route path="payment" element={<Payment />} />

							<Route path="client" element={<Outlet />}>
								<Route index element={<Clients />} />
								<Route path="add" element={<ClientAddEdit />} />
								<Route path="view/:id" element={<ClientView />} />
							</Route>

							<Route path="news" element={<News />} />

							<Route path="order" element={<Order />} />

							<Route path="message" element={<Message />} />
						</Route>

						<Route
							element={
								<RequireAuth allowedRoles={[ROLE_TYPE_LIST.ACCOUNTER.code]} />
							}
							path="accounter"
						>
							<Route path="payment" element={<Outlet />}>
								<Route index element={<AccounterPayment />} />
								<Route path="add" element={<PaymentAdd />} />
								<Route path="contract/:id" element={<PaymentContractView />} />
							</Route>
							<Route path="change" element={<Changes />} />
						</Route>

						<Route
							element={
								<RequireAuth allowedRoles={[ROLE_TYPE_LIST.OPERATOR.code]} />
							}
							path="operator"
						>
							<Route path="lead" element={<LeadProvider />}>
								<Route index element={<Leads />} />
								<Route path="shaxmatka" element={<Outlet />}>
									<Route index element={<LeadShaxmatka />} />
									<Route
										path=":objectId/object"
										element={<LeadShaxmatkaBlock />}
									/>
								</Route>
								<Route path="view/:id" element={<LeadView />} />
							</Route>
						</Route>

						<Route path="profile" element={<Profile />} />

						<Route path="not-found" element={<NotFoundPage />} />
						<Route path="*" element={<NotFoundPage />} />
					</Route>
				</Route>
				{/* </Route> */}
				{/* </Route> */}
				{/* </Route> */}
			</Route>
		</Route>
	)
)

export default router
